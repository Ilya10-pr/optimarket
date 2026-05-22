import { Navbar } from "../components/layout/Navbar"
import { Footer } from "../components/layout/Footer"
import { Hero } from "../components/sections/Hero"
import { ProductShowcase } from "../components/sections/ProductShowcase"
import { AboutBlurb } from "../components/sections/AboutBlurb"
import { StoreLegalSection } from "../components/sections/StoreLegalSection"
import { CatalogProvider } from "../context/CatalogProvider"

export function LandingPage() {
  return (
    <CatalogProvider>
      <>
        <Navbar />
        <main>
          <Hero />
          <ProductShowcase />
          <AboutBlurb />
          <StoreLegalSection />
        </main>
        <Footer />
      </>
    </CatalogProvider>
  )
}
