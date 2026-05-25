import { useEffect, useState } from "react"
import type { CatalogProduct } from "../../types/catalog"
import { BelarusRubleGlyph } from "./BelarusRubleGlyph"

function StarCell({ filled }: { filled: boolean }) {
  return (
    <span
      className={`text-[0.95em] leading-none ${filled ? "text-blaze" : "text-mist/30"}`}
      aria-hidden
    >
      ★
    </span>
  )
}

function StarsRow({ value }: { value: number }) {
  const stars = Math.min(5, Math.max(0, Math.round(value)))
  return (
    <span className="flex gap-px">
      {[1, 2, 3, 4, 5].map((i) => (
        <StarCell key={i} filled={i <= stars} />
      ))}
    </span>
  )
}

type OrderModalProps = {
  product: CatalogProduct | null
  onClose: () => void
}

export function OrderModal({ product, onClose }: OrderModalProps) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [deliveryTime, setDeliveryTime] = useState("")
  const [payment, setPayment] = useState<"Наличными" | "Картой">("Наличными")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Close on ESC
  useEffect(() => {
    if (!product) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    // lock scroll
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [product, onClose])

  if (!product) return null

  const hasSale =
    Boolean(product.discount?.trim()) &&
    typeof product.priceDiscount === "string" &&
    product.priceDiscount.trim() !== ""

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!product) return

    if (!phone.trim() || !address.trim()) {
      setError("Укажите телефон и адрес доставки")
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        product: {
          id: product.id,
          title: product.title,
          category: product.category,
          price: product.price,
          priceDiscount: hasSale ? product.priceDiscount : undefined,
        },
        name: name.trim() || undefined,
        phone: phone.trim(),
        address: address.trim(),
        deliveryTime: deliveryTime.trim() || "Не указано",
        payment,
      }

      const res = await fetch("/api/send-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("send failed")

      alert("✅ Заказ отправлен! Мы свяжемся с вами в ближайшее время.")
      // reset
      setName("")
      setPhone("")
      setAddress("")
      setDeliveryTime("")
      setPayment("Наличными")
      onClose()
    } catch {
      setError("Не удалось отправить заказ. Попробуйте позже или позвоните нам.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-3 sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-modal-title"
    >
      <div
        className="surface-card flex max-h-[min(100dvh-1.5rem,56rem)] w-full max-w-5xl flex-col overflow-hidden rounded-[var(--radius-card)] sm:max-h-[min(100dvh-2rem,56rem)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-ink/10 px-4 py-3 sm:px-6 sm:py-4">
          <h2
            id="order-modal-title"
            className="font-display text-xl text-ink sm:text-2xl"
          >
            Оформление заказа
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-mist transition hover:bg-panel hover:text-ink"
            aria-label="Закрыть"
          >
            ✕
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="grid gap-5 p-4 sm:gap-6 sm:p-6 md:grid-cols-2 lg:gap-8">
          {/* LEFT: Product info */}
          <div className="space-y-4 sm:space-y-5">
            {product.image ? (
              <div className="overflow-hidden rounded-[var(--radius-card)] border border-ink/10 bg-panel-muted">
                <img
                  src={product.image}
                  alt={product.title}
                  className="mx-auto max-h-32 w-full object-contain sm:max-h-40 md:max-h-44"
                />
              </div>
            ) : (
              <div className="flex h-28 items-center justify-center rounded-[var(--radius-card)] border border-ink/10 bg-panel-muted text-mist sm:h-36">
                Нет фото
              </div>
            )}

            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-mist">
                    {product.category}
                  </p>
                  <h3 className="font-display text-lg leading-tight text-ink sm:text-xl md:text-2xl">
                    {product.title}
                  </h3>
                </div>
                <div className="shrink-0 text-right text-lg font-semibold tabular-nums text-ember">
                  {hasSale ? (
                    <div className="flex flex-col items-end">
                      <span className="text-sm text-mist line-through">
                        {product.price}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        {product.priceDiscount}
                        <BelarusRubleGlyph />
                      </span>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      {product.price}
                      <BelarusRubleGlyph />
                    </span>
                  )}
                </div>
              </div>

              {product.badge ? (
                <span className="mt-2 inline-block rounded-[var(--radius-pill)] bg-blaze/10 px-3 py-0.5 text-xs font-semibold text-ember ring-1 ring-blaze/20">
                  {product.badge}
                </span>
              ) : null}
            </div>

            {product.description ? (
              <div className="prose prose-sm max-w-none text-mist">
                <p className="line-clamp-4 whitespace-pre-line text-sm leading-relaxed sm:line-clamp-none sm:text-base">
                  {product.description}
                </p>
              </div>
            ) : null}

            {product.rating != null && Number.isFinite(product.rating) ? (
              <div className="space-y-4 border-t border-ink/10 pt-4">
                <div className="flex flex-wrap items-center gap-2">
                  <StarsRow value={product.rating} />
                  <span className="text-sm font-medium tabular-nums text-ink">
                    {Number.isInteger(product.rating)
                      ? product.rating
                      : product.rating.toFixed(1)}{" "}
                    / 5
                  </span>
                  {product.reviews?.length ? (
                    <span className="text-sm text-mist">
                      · {product.reviews.length}{" "}
                      {product.reviews.length === 1
                        ? "отзыв"
                        : product.reviews.length < 5
                          ? "отзыва"
                          : "отзывов"}
                    </span>
                  ) : null}
                </div>

                {product.reviews?.length ? (
                  <ul className="max-h-36 space-y-2 overflow-y-auto pr-1 sm:max-h-44 md:max-h-52">
                    {product.reviews.map((review, i) => (
                      <li
                        key={`${review.author}-${i}`}
                        className="rounded-[var(--radius-card)] border border-ink/10 bg-panel-muted/50 px-3 py-2.5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-sm font-medium text-ink">
                            {review.author}
                          </span>
                          <StarsRow value={review.stars} />
                        </div>
                        <p className="mt-1.5 text-sm leading-relaxed text-mist">
                          {review.text}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : (
              <div className="border-t border-ink/10 pt-4 text-sm text-mist">
                Нет отзывов
              </div>
            )}
          </div>

          {/* RIGHT: Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-ink">Ваше имя (необязательно)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Иван Иванов"
                className="w-full rounded-[var(--radius-card)] border border-ink/15 bg-panel px-4 py-3 text-sm placeholder:text-mist/60 focus:border-blaze/50 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-ink">Телефон *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+375 (29) 123-45-67"
                className="w-full rounded-[var(--radius-card)] border border-ink/15 bg-panel px-4 py-3 text-sm placeholder:text-mist/60 focus:border-blaze/50 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-ink">Адрес доставки *</label>
              <textarea
                required
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="г. Минск, ул. ..., д. ..., кв. ..."
                className="w-full resize-y rounded-[var(--radius-card)] border border-ink/15 bg-panel px-4 py-3 text-sm placeholder:text-mist/60 focus:border-blaze/50 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-ink">Желательное время доставки</label>
              <input
                type="datetime-local"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                className="w-full rounded-[var(--radius-card)] border border-ink/15 bg-panel px-4 py-3 text-sm focus:border-blaze/50 focus:outline-none"
              />
              <p className="text-xs text-mist">Или укажите в комментарии, например «завтра после 15:00»</p>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium text-ink">Способ оплаты</span>
              <div className="flex gap-4">
                {(["Наличными", "Картой"] as const).map((method) => (
                  <label
                    key={method}
                    className="flex cursor-pointer items-center gap-2 rounded-[var(--radius-pill)] border border-ink/15 px-4 py-2 text-sm transition hover:border-blaze/40"
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method}
                      checked={payment === method}
                      onChange={() => setPayment(method)}
                      className="accent-blaze"
                    />
                    {method}
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary mt-2 w-full disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Отправляем заказ..." : "Заказать"}
            </button>

            <p className="text-center text-xs text-mist">
              Нажимая кнопку, вы соглашаетесь с обработкой персональных данных.
            </p>
          </form>
          </div>
        </div>
      </div>
    </div>
  )
}
