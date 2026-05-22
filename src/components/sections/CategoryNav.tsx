import { STORE_CATEGORIES } from "../../data/categories"
import { useCatalog } from "../../context/useCatalog"

type StoreCategoryRow = (typeof STORE_CATEGORIES)[number]

export function CategoryNav() {
  const { counts, loading } = useCatalog()

  function visibleCats(): StoreCategoryRow[] {
    if (loading) return [...STORE_CATEGORIES]
    return STORE_CATEGORIES.filter((c) => counts[c.id] > 0)
  }

  const navCats = visibleCats()

  return (
    <section
      id="categories"
      aria-label="Категории товаров"
      className="scroll-mt-24 border-b border-ink/10 bg-panel py-6"
    >
      <div className="section-shell">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <h2 className="heading-accent font-display text-xl text-ink sm:text-2xl">
            Категории
          </h2>
          <a
            href="#catalog"
            className="text-sm font-medium text-blaze transition hover:text-ember"
          >
            Смотреть подборки →
          </a>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible">
          {navCats.map(({ id, label }) => (
            <a
              key={id}
              href={`#catalog-${id}`}
              className="shrink-0 rounded-[var(--radius-pill)] border border-ink/10 bg-void px-4 py-2 text-sm font-medium text-ink shadow-sm transition hover:border-blaze/35 hover:bg-panel"
            >
              {label}
              {!loading && counts[id] > 0 ? (
                <span className="ml-1.5 inline tabular-nums text-mist">
                  ({counts[id]})
                </span>
              ) : null}
            </a>
          ))}
          {!loading && navCats.length === 0 ? (
            <span className="text-sm text-mist">
              Категории появятся после загрузки каталога
            </span>
          ) : null}
        </div>
      </div>
    </section>
  )
}
