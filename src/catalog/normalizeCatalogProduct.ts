import type { CatalogProduct, ProductReview } from "../types/catalog"
import { resolveCatalogCategory } from "../data/categories"

export function firstImageFromArray(images: unknown): string | undefined {
  if (!Array.isArray(images)) return undefined
  for (const el of images) {
    if (typeof el !== "string") continue
    const u = el.trim()
    if (u) return u
  }
  return undefined
}

export function parseRating(raw: unknown): number | null | undefined {
  if (raw === null) return null
  if (raw === undefined) return undefined
  if (typeof raw === "number" && Number.isFinite(raw)) return raw
  if (typeof raw === "string") {
    const s = raw.trim()
    if (s === "" || s.toLowerCase() === "null") return null
    const n = Number.parseFloat(s.replace(",", "."))
    if (Number.isFinite(n)) return n
  }
  return undefined
}

function parseReviews(raw: unknown): ProductReview[] | undefined {
  if (!Array.isArray(raw)) return undefined
  const reviews: ProductReview[] = []
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue
    const o = entry as Record<string, unknown>
    const author = typeof o.author === "string" ? o.author.trim() : ""
    const text = typeof o.text === "string" ? o.text.trim() : ""
    const stars =
      typeof o.stars === "number" && Number.isFinite(o.stars)
        ? Math.min(5, Math.max(1, Math.round(o.stars)))
        : null
    if (!author || !text || stars === null) continue
    reviews.push({ author, stars, text })
  }
  return reviews.length > 0 ? reviews : undefined
}

export function normalizeProduct(
  raw: unknown,
  index: number,
): CatalogProduct | null {
  if (!raw || typeof raw !== "object") return null
  const o = raw as Record<string, unknown>
  const title = typeof o.title === "string" ? o.title.trim() : ""
  if (!title) return null
  const category = typeof o.category === "string" ? o.category : ""
  const categoryDisplayName =
    typeof o.categoryName === "string" ? o.categoryName : undefined

  const { slug: categorySlug, label: categoryLabel } = resolveCatalogCategory(
    category,
    categoryDisplayName,
  )

  const price =
    typeof o.price === "string" && o.price.trim() ? o.price.trim() : "—"
  const description =
    typeof o.description === "string" ? o.description.trim() : ""
  const item: CatalogProduct = {
    id: typeof o.id === "string" && o.id.trim() ? o.id.trim() : `row-${index + 1}`,
    title,
    category: categoryLabel,
    categorySlug,
    price,
    description,
  }
  if (typeof o.badge === "string" && o.badge.trim()) item.badge = o.badge.trim()

  const ratingParsed = parseRating(o.rating)
  if (ratingParsed !== undefined) item.rating = ratingParsed

  const reviewsParsed = parseReviews(o.reviews)
  if (reviewsParsed) item.reviews = reviewsParsed

  const discRaw = typeof o.discount === "string" ? o.discount.trim() : ""
  const pdRaw =
    typeof o.priceDiscount === "string" ? o.priceDiscount.trim() : ""
  if (discRaw !== "" && pdRaw !== "") {
    item.discount = discRaw
    item.priceDiscount = pdRaw
  }

  const fromImageField =
    typeof o.image === "string" && o.image.trim() ? o.image.trim() : undefined
  const fromImages = firstImageFromArray(o.images)
  const resolved = fromImageField ?? fromImages
  if (resolved) item.image = resolved
  return item
}
