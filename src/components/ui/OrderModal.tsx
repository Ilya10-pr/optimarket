import { useEffect, useState } from "react"
import type { CatalogProduct } from "../../types/catalog"
import { BelarusRubleGlyph } from "./BelarusRubleGlyph"

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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-modal-title"
    >
      <div
        className="surface-card w-full max-w-5xl overflow-hidden rounded-[var(--radius-card)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
          <h2 id="order-modal-title" className="font-display text-2xl text-ink">
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

        <div className="grid gap-8 p-6 md:grid-cols-2 lg:gap-10">
          {/* LEFT: Product info */}
          <div className="space-y-6">
            {product.image ? (
              <div className="overflow-hidden rounded-[var(--radius-card)] border border-ink/10 bg-panel-muted">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-auto w-full object-contain"
                />
              </div>
            ) : (
              <div className="flex h-48 items-center justify-center rounded-[var(--radius-card)] border border-ink/10 bg-panel-muted text-mist">
                Нет фото
              </div>
            )}

            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-mist">
                    {product.category}
                  </p>
                  <h3 className="font-display text-2xl leading-tight text-ink">
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
                <p className="whitespace-pre-line leading-relaxed">
                  {product.description}
                </p>
              </div>
            ) : null}

            {product.rating != null && Number.isFinite(product.rating) ? (
              <div className="text-sm text-mist">
                Рейтинг: <span className="font-medium text-ink">{product.rating}</span> / 5
              </div>
            ) : (
              <div className="text-sm text-mist">Нет отзывов</div>
            )}
          </div>

          {/* RIGHT: Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
              {submitting ? "Отправляем заказ..." : "Отправить заказ в Telegram"}
            </button>

            <p className="text-center text-xs text-mist">
              Нажимая кнопку, вы соглашаетесь с обработкой персональных данных.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
