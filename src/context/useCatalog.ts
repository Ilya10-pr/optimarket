import { useContext } from "react"
import { CatalogContext, type CatalogContextValue } from "./catalogContext"

export function useCatalog(): CatalogContextValue {
  const ctx = useContext(CatalogContext)
  if (!ctx) {
    throw new Error("useCatalog должен использоваться внутри CatalogProvider")
  }
  return ctx
}
