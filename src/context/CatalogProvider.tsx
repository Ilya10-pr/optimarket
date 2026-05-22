import { useEffect, useMemo, useState, type ReactNode } from "react"
import type { CatalogProduct } from "../types/catalog"
import {
  STORE_CATEGORIES,
  type StoreCategoryId,
} from "../data/categories"
import { normalizeProduct } from "../catalog/normalizeCatalogProduct"
import { CatalogContext, type CatalogContextValue } from "./catalogContext"

const ALLOWED_IDS = new Set<string>(STORE_CATEGORIES.map((c) => c.id))

const FALLBACK: CatalogProduct[] = [
  {
    id: "fb-1",
    title: "Умное устройство — пример витрины",
    category: "Электроника",
    categorySlug: "electronics",
    price: "от 299",
    description:
      "Подборка «Электроника». Запасная карточка, если каталог не загрузился или нет товаров по выбранным категориям.",
    badge: "Пример",
  },
]

function emptyCounts(): Record<StoreCategoryId, number> {
  return Object.fromEntries(
    STORE_CATEGORIES.map((c) => [c.id, 0]),
  ) as Record<StoreCategoryId, number>
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<CatalogProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [banner, setBanner] = useState<string | undefined>()

  const counts = useMemo(() => {
    const acc = emptyCounts()
    for (const p of products) {
      const s = p.categorySlug
      if (s && Object.hasOwn(acc, s)) acc[s as StoreCategoryId] += 1
    }
    return acc
  }, [products])

  useEffect(() => {
    let cancelled = false
    const ac = new AbortController()
    ;(async () => {
      try {
        const res = await fetch("/products.json", { signal: ac.signal })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: unknown = await res.json()
        if (!Array.isArray(data)) throw new Error("Ожидался массив")
        const list = data
          .map((row, i) => normalizeProduct(row, i))
          .filter(Boolean) as CatalogProduct[]
        const filtered = list.filter((p) =>
          ALLOWED_IDS.has(p.categorySlug ?? ""),
        )
        if (cancelled) return
        if (filtered.length === 0) {
          setProducts(FALLBACK)
          if (list.length > 0) {
            setBanner(
              "В файле есть товары, но они не входят в категории витрины (электроника, техника, стройка) — показан пример.",
            )
          } else {
            setBanner(
              "В products.json нет корректных позиций — показана запасная карточка.",
            )
          }
        } else {
          setProducts(filtered)
          setBanner(undefined)
        }
      } catch {
        if (cancelled) return
        setProducts(FALLBACK)
        setBanner(
          "Не удалось загрузить /products.json — показана запасная карточка.",
        )
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
      ac.abort()
    }
  }, [])

  const value: CatalogContextValue = useMemo(() => {
    const v: CatalogContextValue = { products, loading, banner, counts }
    return v
  }, [products, loading, banner, counts])

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  )
}
