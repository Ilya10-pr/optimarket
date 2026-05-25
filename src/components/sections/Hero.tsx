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
          <div className="surface-card relative mx-auto max-w-md p-8 lg:mx-0 lg:max-w-none">
            <div className="absolute -right-6 -top-6 hidden size-28 rounded-full bg-blaze/20 blur-3xl lg:block" />
            <div className="absolute -bottom-10 -left-10 hidden size-40 rounded-full bg-ember/15 blur-3xl lg:block" />
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-linear-to-br from-panel via-void to-panel-muted ring-1 ring-ink/10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,oklch(0.55_0.12_262_/_0.1),transparent_60%)]" />
              <div className="flex h-full flex-col justify-between p-6 sm:p-8">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-mist">
                    С чего начать
                  </p>
                  <p className="mt-4 font-display text-3xl text-ink sm:text-4xl">
                    Категории на каждый день
                  </p>
                  <p className="mt-3 max-w-[16rem] text-sm leading-relaxed text-mist">
                    От сетей и ПК до детских товаров и ухода за собой — выберите
                    раздел выше и листайте подборки в каталоге.
                  </p>
                </div>
                <div className="rounded-xl border border-ink/10 bg-panel/95 p-4 backdrop-blur-md shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
                    <div>
                      <p className="text-xs text-mist">Оплата</p>
                      <p className="font-display text-lg text-ink sm:text-xl">
                        карта и наличные
                      </p>
                    </div>
                    <a href="#catalog" className="btn-primary shrink-0 px-4 py-2 text-xs">
                      В каталог
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
