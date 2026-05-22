import { createContext } from "react"
import type { CatalogProduct } from "../types/catalog"
import type { StoreCategoryId } from "../data/categories"

export type CatalogContextValue = {
  products: CatalogProduct[]
  loading: boolean
  banner?: string
  counts: Record<StoreCategoryId, number>
}

export const CatalogContext = createContext<CatalogContextValue | null>(null)
