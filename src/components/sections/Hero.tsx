export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-ink/10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,oklch(0.52_0.12_264_/_0.12),transparent),radial-gradient(ellipse_55%_45%_at_95%_45%,oklch(0.68_0.08_256_/_0.09),transparent)]" />
      <div className="section-shell section-y relative grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
        <div className="space-y-8">
          <p className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-ink/10 bg-panel px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-ember shadow-sm sm:px-4 sm:py-1.5 sm:text-[11px]">
            Optimarket · интернет‑магазин
          </p>
          <div className="space-y-4">
            <h1 className="font-display text-4xl leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Техника и товары для дома в одном{' '}
              <span className="bg-linear-to-r from-blaze via-glow to-ember bg-clip-text text-transparent">
                удобном каталоге
              </span>
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-mist">
              Мы помогаем быстро подобрать компьютеры, электронику, бытовую технику,
              товары для ремонта, дома, детей и отдыха — с понятными условиями,
              выбранными способами оплаты и обработкой заказов в фиксированные часы.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="#catalog" className="btn-primary">
              Перейти в каталог
            </a>
          </div>

        </div>
        <div className="relative">
          <div className="surface-card relative mx-auto max-w-md p-5 sm:p-6 lg:mx-0 lg:max-w-none">
            <div className="absolute -right-6 -top-6 hidden size-28 rounded-full bg-blaze/20 blur-3xl lg:block" />
            <div className="absolute -bottom-10 -left-10 hidden size-40 rounded-full bg-ember/15 blur-3xl lg:block" />
            <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-panel via-void to-panel-muted ring-1 ring-ink/10">
              <div className="relative aspect-[16/7] overflow-hidden sm:aspect-[16/6]">
                <img
                  src="/lego.webp"
                  alt="Конструкторы LEGO"
                  className="h-full w-full object-cover object-center"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                  <p className="inline-flex items-center rounded-[var(--radius-pill)] border border-white/20 bg-black/30 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-snow backdrop-blur-md">
                    Конструкторы LEGO
                  </p>
                </div>
              </div>

              <div className="relative space-y-3 p-4 sm:p-5">
                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-blaze/35 to-transparent" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-ember">
                    Выгодное предложение
                  </p>
                  <p className="mt-2 font-display text-xl leading-tight text-ink sm:text-2xl">
                    Заказывайте LEGO по{" "}
                    <span className="bg-linear-to-r from-blaze via-glow to-ember bg-clip-text text-transparent">
                      самым низким ценам
                    </span>
                  </p>
                  <p className="mt-2  text-sm leading-snug text-mist">
                    Оригинальные наборы Star Wars, Technic, City, Icons и другие
                    серии — поможем подобрать модель и быстро оформим заказ с
                    доставкой по Беларуси.
                  </p>
                </div>

                <div className="rounded-xl border border-ink/10 bg-panel/95 p-3 backdrop-blur-md shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
                    <div>
                      <p className="text-[11px] text-mist">Оригинал · консультация · доставка</p>
                      <p className="font-display text-base text-ink sm:text-lg">
                        выгоднее, чем в обычных магазинах
                      </p>
                    </div>
                    <a href="#catalog" className="btn-primary shrink-0 px-3.5 py-1.5 text-xs">
                      Смотреть наборы
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
