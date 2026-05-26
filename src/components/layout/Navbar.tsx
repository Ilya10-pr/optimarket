import { Logo } from "../ui/Logo"
import { ProductSearch } from "../ui/ProductSearch"

const links = [
  { href: "#catalog", label: "Каталог" },
  { href: "#working-hours", label: "Режим работы" },
  { href: "#about", label: "О нас" },
]

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-void/90 backdrop-blur-xl">
      <div className="section-shell max-w-7xl flex flex-wrap items-center justify-between gap-x-4 gap-y-3 py-3 lg:py-0 lg:h-[4.25rem]">
        {/* Logo */}
        <a href="#" className="shrink-0 outline-none">
          <Logo />
        </a>

        <ProductSearch className="order-2 w-full min-[900px]:order-none min-[900px]:max-w-md min-[900px]:flex-1 min-[900px]:w-auto" />

        {/* Navigation links — on <1000px moves to bottom row, full width, centered */}
        <nav
          className="flex items-center justify-center gap-4 max-[1000px]:order-last max-[1000px]:w-full max-[1000px]:justify-center lg:gap-6 xl:gap-8"
          aria-label="Основная навигация"
        >
          {links.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-mist transition hover:text-blaze"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right side: Phone + Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="tel:+375292372227"
            className="btn-ghost inline-flex whitespace-nowrap max-[420px]:text-[10px]"
          >
            +375 (29) 237-22-27
          </a>
          <a
            href="#catalog"
            className="btn-primary text-xs sm:text-sm max-[700px]:hidden"
          >
            Смотреть товары
          </a>
        </div>
      </div>
    </header>
  )
}
