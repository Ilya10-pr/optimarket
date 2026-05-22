/** Чипы категорий на главной → якорь #catalog-{id} и фильтры в каталоге */
export const STORE_CATEGORIES = [
  { id: "electronics", label: "Электроника" },
  { id: "appliances", label: "Бытовая техника" },
  { id: "construction", label: "Стройка и ремонт" },
] as const

export type StoreCategoryId = (typeof STORE_CATEGORIES)[number]["id"]

const SLUG_SET = new Set<string>(STORE_CATEGORIES.map((c) => c.id))

export function resolveCatalogCategory(
  categoryRaw: unknown,
  categoryNameRaw?: unknown,
): { slug: string; label: string } {
  const cat = typeof categoryRaw === "string" ? categoryRaw.trim() : ""
  const lc = cat.toLowerCase()
  const explicit =
    typeof categoryNameRaw === "string" ? categoryNameRaw.trim() : ""

  if (lc && SLUG_SET.has(lc)) {
    const base = STORE_CATEGORIES.find((c) => c.id === lc)!
    return { slug: lc, label: explicit || base.label }
  }

  const matchLabel = STORE_CATEGORIES.find(
    (c) => c.label.toLowerCase() === cat.toLowerCase(),
  )
  if (matchLabel) {
    return {
      slug: matchLabel.id,
      label: explicit || matchLabel.label,
    }
  }

  return {
    slug: "other",
    label: explicit || cat || "Без категории",
  }
}
