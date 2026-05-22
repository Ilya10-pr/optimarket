/** То, что после нормализации уходит в `ProductCard` */
export type CatalogProduct = {
  id?: string
  title: string
  category: string
  price: string
  description: string
  badge?: string
  image?: string
  /** Ключ секции каталога (совпадает с `STORE_CATEGORIES[].id`) */
  categorySlug?: string
  discount?: string
  priceDiscount?: string
  /**
   * Оценка покупателей (0–5, допускаются дроби).
   * `null`, отсутствие поля → в карточке «нет отзывов».
   */
  rating?: number | null
}
