import { useEffect, useId, useMemo, useRef, useState } from "react"
import type { CatalogProduct } from "../../types/catalog"
import { useCatalog } from "../../context/useCatalog"
import { OrderModal } from "./OrderModal"
import { BelarusRubleGlyph } from "./BelarusRubleGlyph"

const MAX_RESULTS = 8

function normalizeQuery(q: string): string {
  return q.trim().toLowerCase().replace(/\s+/gu, " ")
}

function matchesProduct(product: CatalogProduct, query: string): boolean {
  const haystack = [
    product.title,
    product.category,
    product.description,
    product.badge,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
  return haystack.includes(query)
}

function filterProducts(
  products: CatalogProduct[],
  rawQuery: string,
): CatalogProduct[] {
  const query = normalizeQuery(rawQuery)
  if (!query) return []
  const tokens = query.split(" ").filter(Boolean)
  return products
    .filter((p) => tokens.every((t) => matchesProduct(p, t)))
    .slice(0, MAX_RESULTS)
}

function SearchPrice({
  product,
}: {
  product: CatalogProduct
}) {
  const hasSale =
    Boolean(product.discount?.trim()) &&
    typeof product.priceDiscount === "string" &&
    product.priceDiscount.trim() !== ""

  if (hasSale) {
    return (
      <span className="flex shrink-0 flex-col items-end leading-tight">
        <span className="text-xs text-mist line-through tabular-nums">
          {product.price}
        </span>
        <span className="inline-flex items-center gap-0.5 text-sm font-semibold tabular-nums text-ember">
          {product.priceDiscount}
          <BelarusRubleGlyph className="opacity-95" />
        </span>
      </span>
    )
  }

  return (
    <span className="inline-flex shrink-0 items-center gap-0.5 text-sm font-semibold tabular-nums text-ember">
      {product.price}
      <BelarusRubleGlyph className="opacity-95" />
    </span>
  )
}

function SearchResultCard({
  product,
  active,
  onSelect,
}: {
  product: CatalogProduct
  active: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={active}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onSelect}
      className={`flex w-full gap-3 rounded-[var(--radius-card)] border p-2.5 text-left transition sm:gap-4 sm:p-3 ${
        active
          ? "border-blaze/40 bg-blaze/8 ring-1 ring-blaze/25"
          : "border-transparent bg-panel/60 hover:border-blaze/25 hover:bg-panel"
      }`}
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-ink/10 bg-linear-to-br from-panel-muted via-void to-panel sm:h-16 sm:w-16">
        {product.image ? (
          <img
            src={product.image}
            alt=""
            className="max-h-full max-w-full object-contain p-1.5"
          />
        ) : (
          <span className="text-[10px] text-mist">Нет фото</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-mist sm:text-[11px]">
          {product.category}
        </p>
        <p className="font-display text-sm leading-snug text-ink line-clamp-2 sm:text-base">
          {product.title}
        </p>
        {product.rating != null && Number.isFinite(product.rating) ? (
          <p className="mt-1 text-xs text-mist">
            ★{" "}
            {Number.isInteger(product.rating)
              ? product.rating
              : product.rating.toFixed(1)}
          </p>
        ) : null}
      </div>
      <SearchPrice product={product} />
    </button>
  )
}

export function ProductSearch({ className = "" }: { className?: string }) {
  const { products, loading } = useCatalog()
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [orderProduct, setOrderProduct] = useState<CatalogProduct | null>(null)

  const results = useMemo(
    () => filterProducts(products, query),
    [products, query],
  )

  const showDropdown =
    open && normalizeQuery(query).length > 0 && !loading && !orderProduct

  useEffect(() => {
    setActiveIndex(results.length ? 0 : -1)
  }, [results])

  useEffect(() => {
    if (!showDropdown) return
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [showDropdown])

  function selectProduct(product: CatalogProduct) {
    setOrderProduct(product)
    setOpen(false)
    setQuery("")
    setActiveIndex(-1)
    inputRef.current?.blur()
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showDropdown && e.key === "ArrowDown" && results.length) {
      setOpen(true)
      return
    }
    if (!showDropdown) return

    if (e.key === "Escape") {
      e.preventDefault()
      setOpen(false)
      return
    }
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % results.length)
      return
    }
    if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1))
      return
    }
    if (e.key === "Enter" && activeIndex >= 0 && results[activeIndex]) {
      e.preventDefault()
      selectProduct(results[activeIndex])
    }
  }

  return (
    <>
      <div ref={rootRef} className={`relative ${className}`}>
        <label htmlFor={listId} className="sr-only">
          Поиск по каталогу
        </label>
        <div className="relative">
          <span
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist"
            aria-hidden
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20 16.5 16.5" />
            </svg>
          </span>
          <input
            ref={inputRef}
            id={listId}
            type="search"
            value={query}
            disabled={loading}
            placeholder={loading ? "Загрузка каталога…" : "Поиск товаров…"}
            autoComplete="off"
            role="combobox"
            aria-expanded={showDropdown}
            aria-controls={`${listId}-listbox`}
            aria-activedescendant={
              activeIndex >= 0 ? `${listId}-opt-${activeIndex}` : undefined
            }
            onChange={(e) => {
              setQuery(e.target.value)
              setOpen(true)
            }}
            onFocus={() => {
              if (normalizeQuery(query)) setOpen(true)
            }}
            onKeyDown={onKeyDown}
            className="w-full rounded-[var(--radius-pill)] border border-ink/12 bg-panel/90 py-2.5 pl-10 pr-9 text-sm text-ink shadow-sm backdrop-blur-sm transition placeholder:text-mist/70 focus:border-blaze/45 focus:outline-none focus:ring-2 focus:ring-blaze/20 disabled:cursor-wait disabled:opacity-70"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("")
                setOpen(false)
                inputRef.current?.focus()
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-mist transition hover:bg-panel hover:text-ink"
              aria-label="Очистить поиск"
            >
              ✕
            </button>
          ) : null}
        </div>

        {showDropdown ? (
          <div
            className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-[60] overflow-hidden rounded-[var(--radius-card)] border border-ink/12 bg-void/98 shadow-[0_16px_48px_oklch(0.35_0.08_262_/_0.22)] backdrop-blur-xl"
            role="listbox"
            id={`${listId}-listbox`}
          >
            <div className="border-b border-ink/10 px-3 py-2 text-xs text-mist sm:px-4">
              {results.length
                ? `Найдено: ${results.length}${results.length >= MAX_RESULTS ? "+" : ""}`
                : "Ничего не найдено"}
            </div>
            <ul className="max-h-[min(70vh,22rem)] space-y-1 overflow-y-auto overscroll-contain p-2 sm:p-2.5">
              {results.length ? (
                results.map((product, i) => (
                  <li key={product.id ?? product.title}>
                    <div id={`${listId}-opt-${i}`}>
                      <SearchResultCard
                        product={product}
                        active={i === activeIndex}
                        onSelect={() => selectProduct(product)}
                      />
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-3 py-6 text-center text-sm text-mist sm:px-4">
                  Попробуйте другое название или категорию
                </li>
              )}
            </ul>
          </div>
        ) : null}
      </div>

      <OrderModal
        product={orderProduct}
        onClose={() => setOrderProduct(null)}
      />
    </>
  )
}
