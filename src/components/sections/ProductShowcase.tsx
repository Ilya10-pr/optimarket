import { useMemo, useState } from "react"
import { ProductCard } from "../ui/ProductCard"
import { OrderModal } from "../ui/OrderModal"
import type { CatalogProduct } from "../../types/catalog"
import {
  STORE_CATEGORIES,
  type StoreCategoryId,
} from "../../data/categories"
import { useCatalog } from "../../context/useCatalog"

type CatalogFilterKey = "all" | StoreCategoryId

export function ProductShowcase() {
  const { products: rows, loading, banner } = useCatalog()
  const [catalogFilter, setCatalogFilter] = useState<CatalogFilterKey>("all")
  const [orderProduct, setOrderProduct] = useState<CatalogProduct | null>(null)

  const sections = useMemo(() => {
    const bySlug = new Map<string, CatalogProduct[]>()
    for (const cat of STORE_CATEGORIES) bySlug.set(cat.id, [])
    bySlug.set("other", [])
    for (const p of rows) {
      const slug = p.categorySlug ?? "other"
      const list = bySlug.get(slug)
      if (list) list.push(p)
      else bySlug.set(slug, [p])
    }
    const ordered: { id: string; title: string; items: CatalogProduct[] }[] =
      []
    for (const { id, label } of STORE_CATEGORIES) {
      const items = bySlug.get(id) ?? []
      if (items.length) ordered.push({ id, title: label, items })
    }
    return ordered
  }, [rows])

  const sectionsToRender = useMemo(() => {
    if (catalogFilter === "all") return sections
    return sections.filter((s) => s.id === catalogFilter)
  }, [sections, catalogFilter])

  const filterableCats = useMemo(
    () => STORE_CATEGORIES.filter((c) => sections.some((s) => s.id === c.id)),
    [sections],
  )

  return (
    <section id="catalog" className="section-y scroll-mt-20">
      <div className="section-shell space-y-12">
        <div className="max-w-2xl space-y-4">
          <h2 className="heading-accent font-display text-3xl text-ink sm:text-4xl">
            Каталог
          </h2>

          {banner ? (
            <p className="rounded-lg border border-ink/15 bg-panel px-4 py-3 text-sm text-mist">
              {banner}
            </p>
          ) : null}
          {loading ? (
            <p className="text-sm text-mist">Загрузка каталога…</p>
          ) : null}
          {!loading && filterableCats.length ? (
            <div
              className="flex flex-wrap gap-2 pt-2"
              role="group"
              aria-label="Фильтр по категории"
            >
              <button
                type="button"
                aria-pressed={catalogFilter === "all"}
                onClick={() => setCatalogFilter("all")}
                className={`rounded-[var(--radius-pill)] border px-4 py-2 text-sm font-medium transition ${
                  catalogFilter === "all"
                    ? "border-blaze bg-blaze/10 text-ember ring-1 ring-blaze/25"
                    : "border-ink/10 bg-panel text-ink hover:border-blaze/35"
                }`}
              >
                Все
              </button>
              {filterableCats.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={catalogFilter === id}
                  onClick={() => setCatalogFilter(id)}
                  className={`rounded-[var(--radius-pill)] border px-4 py-2 text-sm font-medium transition ${
                    catalogFilter === id
                      ? "border-blaze bg-blaze/10 text-ember ring-1 ring-blaze/25"
                      : "border-ink/10 bg-panel text-ink hover:border-blaze/35"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        {!loading ? (
          <div className="space-y-16">
            {sectionsToRender.map((section) => (
              <div
                key={section.id}
                id={`catalog-${section.id}`}
                className="scroll-mt-28 space-y-8"
              >
                <div className="border-b border-ink/10 pb-4">
                  <h3 className="font-display text-2xl text-ink">{section.title}</h3>
                  <p className="mt-1 text-sm text-mist">
                    Товаров: {section.items.length}
                  </p>
                </div>
                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                  {section.items.map((product) => (
                    <ProductCard
                      key={product.id ?? product.title}
                      title={product.title}
                      category={product.category}
                      price={product.price}
                      description={product.description}
                      badge={product.badge}
                      image={product.image}
                      discount={product.discount}
                      priceDiscount={product.priceDiscount}
                      rating={product.rating}
                      onOrder={() => setOrderProduct(product)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="surface-card animate-pulse overflow-hidden rounded-[var(--radius-card)]"
              >
                <div className="h-[7.75rem] shrink-0 bg-panel-muted sm:h-[8.75rem]" />
                <div className="space-y-3 p-5">
                  <div className="h-3 w-1/4 rounded bg-panel-muted" />
                  <div className="h-6 w-3/4 rounded bg-panel-muted" />
                  <div className="h-16 rounded bg-panel-muted/80" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <OrderModal
        product={orderProduct}
        onClose={() => setOrderProduct(null)}
      />
    </section>
  )
}
