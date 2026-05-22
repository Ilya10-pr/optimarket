import { Logo } from "../ui/Logo"

const links = [
  { href: "#categories", label: "Категории" },
  { href: "#catalog", label: "Каталог" },
  { href: "#about", label: "О нас" },
  { href: "#contacts", label: "Контакты" },
]

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-void/90 backdrop-blur-xl">
      <div className="section-shell flex h-16 items-center justify-between gap-4 sm:h-[4.25rem]">
        <a href="#" className="shrink-0 outline-none">
          <Logo />
        </a>
        <nav
          className="hidden items-center gap-4 lg:gap-6 xl:gap-8 md:flex"
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
        <div className="flex items-center gap-2 sm:gap-3">
          <a href="#contacts" className="btn-ghost hidden sm:inline-flex">
            Связаться
          </a>
          <a href="#catalog" className="btn-primary text-xs sm:text-sm">
            Смотреть товары
          </a>
        </div>
      </div>
    </header>
  )
}
