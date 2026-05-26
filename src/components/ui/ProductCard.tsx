import { BelarusRubleGlyph } from "./BelarusRubleGlyph"

export type ProductCardProps = {
  title: string
  category: string
  price: string
  description: string
  badge?: string
  image?: string
  discount?: string
  priceDiscount?: string
  rating?: number | null
  onOrder?: () => void
}

function stripTrailingLegacyCurrency(amount: string): string {
  return amount.replace(/\s*(Br|руб\.?|BYN)\s*$/iu, "").trimEnd()
}

function PriceAmount({
  raw,
  className,
  ariaHiddenTotal,
  strikethrough = false,
}: {
  raw: string
  className?: string
  ariaHiddenTotal?: boolean
  strikethrough?: boolean
}) {
  const trimmed = raw.trim()
  if (trimmed === "" || trimmed === "—") {
    return <span className={className}>{trimmed === "" ? "—" : trimmed}</span>
  }
  const numPart = stripTrailingLegacyCurrency(trimmed)
  const label = `${numPart.replace(/\s+/gu, " ")} белорусских рублей`
  return (
    <span
      className={`relative inline-flex items-baseline gap-0.5 ${
        strikethrough ? "text-sm font-medium text-mist/80" : ""
      } ${className ?? ""}`}
      aria-label={ariaHiddenTotal ? undefined : label}
      aria-hidden={ariaHiddenTotal}
    >
      <span className="tabular-nums">{numPart}</span>
      <BelarusRubleGlyph
        className={strikethrough ? "opacity-80" : "-translate-y-px opacity-95"}
      />
      {strikethrough ? (
        <span
          className="pointer-events-none absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-ember/80"
          aria-hidden
        />
      ) : null}
    </span>
  )
}

function DiscountPercentLabel(raw: string) {
  const t = raw.trim()
  if (!t) return null
  if (/%/u.test(t)) return `−${t.replace(/^−|^-/u, "")}`
  return `−${t}%`
}

function StarCell({ fraction }: { fraction: number }) {
  const f = Math.min(1, Math.max(0, fraction))
  if (f <= 0) {
    return (
      <span
        className="text-[0.95em] leading-none text-mist/30"
        aria-hidden
      >
        ★
      </span>
    )
  }
  if (f >= 1) {
    return (
      <span className="text-[0.95em] leading-none text-blaze" aria-hidden>
        ★
      </span>
    )
  }
  return (
    <span className="relative inline-block h-[1em] w-[0.92em]" aria-hidden>
      <span className="absolute inset-0 leading-none text-mist/30">★</span>
      <span
        className="absolute inset-y-0 left-0 overflow-hidden leading-none text-blaze"
        style={{ width: `${f * 100}%` }}
      >
        <span className="inline-block w-[0.92em]">★</span>
      </span>
    </span>
  )
}

function RatingBlock({ rating }: { rating?: number | null }) {
  if (rating !== null && rating !== undefined && Number.isFinite(rating)) {
    const r = Math.min(5, Math.max(0, rating))
    const label =
      Number.isInteger(r) || r === Math.floor(r) ? `${r}` : r.toFixed(1)
    return (
      <div
        className="flex flex-wrap items-center gap-2 border-t border-ink/10 pt-3"
        role="img"
        aria-label={`Рейтинг ${label} из 5`}
      >
        <span className="flex gap-px text-blaze">
          {[1, 2, 3, 4, 5].map((i) => (
            <StarCell key={i} fraction={Math.min(Math.max(r - i + 1, 0), 1)} />
          ))}
        </span>
        <span className="text-sm tabular-nums font-medium text-ink">{label}</span>
      </div>
    )
  }
  return (
    <p className="border-t border-ink/10 pt-3 text-sm text-mist">
      Нет отзывов
    </p>
  )
}

export function ProductCard({
  title,
  category,
  price,
  description,
  badge,
  image,
  discount,
  priceDiscount,
  rating,
  onOrder,
}: ProductCardProps) {
  const hasSale =
    Boolean(discount?.trim()) &&
    typeof priceDiscount === "string" &&
    priceDiscount.trim() !== ""

  const pctLabel = discount?.trim() ? DiscountPercentLabel(discount) : null

  return (
    <article className="surface-card group flex flex-col overflow-hidden transition hover:border-blaze/30 hover:shadow-[0_8px_40px_oklch(0.45_0.1_262_/_0.12)]">
      <div className="relative flex h-[7.75rem] w-full shrink-0 items-center justify-center overflow-hidden bg-linear-to-br from-panel-muted via-void to-panel sm:h-[8.75rem]">
        {image ? (
          <img
            src={image}
            alt={title}
            loading="lazy"
            decoding="async"
            className="max-h-full max-w-full object-contain p-3 transition duration-300 group-hover:scale-[1.03]"
          />
        ) : null}
        <div
          className={`absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(0.52_0.12_262_/_0.18),transparent_55%),radial-gradient(circle_at_80%_70%,oklch(0.65_0.08_252_/_0.1),transparent_50%)] ${image ? "opacity-40" : ""}`}
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-60 transition group-hover:opacity-90">
          {!image ? (
            <div className="size-24 rounded-full border border-ink/10 bg-panel/90 backdrop-blur-md shadow-inner" />
          ) : null}
        </div>
        {badge ? (
          <span className="absolute left-4 top-4 rounded-[var(--radius-pill)] bg-panel/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-ember shadow-sm ring-1 ring-blaze/25 backdrop-blur-md">
            {badge}
          </span>
        ) : null}
        {hasSale && pctLabel ? (
          <span className="absolute right-4 top-4 rounded-[var(--radius-pill)] bg-linear-to-r from-ember to-blaze px-3 py-1 text-[11px] font-bold text-snow shadow-sm ring-1 ring-white/20">
            {pctLabel}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-mist">
              {category}
            </p>
            <h3 className="font-display text-xl leading-snug text-ink line-clamp-2 break-words hyphens-auto">
              {title}
            </h3>
          </div>
          <div className="shrink-0 text-right leading-tight">
            {hasSale ? (
              <div className="flex flex-col items-end gap-1">
                <PriceAmount raw={price} ariaHiddenTotal strikethrough />
                <span className="rounded-lg bg-blaze/10 px-3 py-1 text-sm font-semibold tabular-nums text-ember ring-1 ring-blaze/20 [&_*]:tabular-nums">
                  <PriceAmount raw={priceDiscount!.trim()} />
                </span>
              </div>
            ) : (
              <span className="rounded-lg bg-blaze/10 px-3 py-1 text-sm font-semibold tabular-nums text-ember ring-1 ring-blaze/20 [&_*]:tabular-nums">
                <PriceAmount raw={price} />
              </span>
            )}
          </div>
        </div>
        <RatingBlock rating={rating} />
        <p className="flex-1 min-h-0 whitespace-pre-line line-clamp-2 break-words text-sm leading-relaxed text-mist">
          {description}
        </p>
        <button
          type="button"
          onClick={onOrder}
          className="btn-primary w-full justify-center sm:w-auto"
        >
          Заказать
        </button>
      </div>
    </article>
  )
}
