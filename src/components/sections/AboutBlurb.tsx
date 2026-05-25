export function AboutBlurb() {
  return (
    <section
      id="about"
      className="scroll-mt-20 border-y border-ink/10 bg-panel-muted/50 py-10 sm:py-14"
    >
      <div className="section-shell grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <h2 className="heading-accent font-display text-3xl text-ink sm:text-4xl">
            Почему выбирают Optimarket
          </h2>
          <p className="text-lg leading-relaxed text-mist">
            Интернет‑магазин Optimarket работает для тех, кому нужен широкий
            ассортимент без лишней суеты: техника, товары для дома и семьи —
            с понятными сроками обработки заказов и официальными сведениями о
            продавце (юридическое лицо указано в реквизитах).
          </p>
          <ul className="space-y-4 text-mist">
            <li className="flex gap-3">
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-linear-to-br from-ember to-blaze shadow-[var(--shadow-glow)]" />
              Актуальные категории: от компьютеров и сетей до товаров для детей и
              мам.
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-linear-to-br from-blaze to-glow shadow-[var(--shadow-glow)]" />
              Заказ можно оплатить наличными или картой.
            </li>

          </ul>
        </div>
        <div className="surface-card p-8 sm:p-10">
          <blockquote className="font-display wrap-break-word text-xl leading-snug text-ink sm:text-2xl sm:text-[1.65rem]">
            «Нам важно, чтобы вы знали, кто продаёт товар, как с нами связаться и
            когда обрабатываются заказы — прозрачно и по правилам торгового
            реестра.»
          </blockquote>
          <p className="mt-6 text-sm font-medium text-blaze">
            — команда Optimarket
          </p>
        </div>
      </div>
    </section>
  )
}
