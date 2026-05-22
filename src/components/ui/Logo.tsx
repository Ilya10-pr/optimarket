export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>

        <img
          src="/logo.webp"
          alt="Optimarket"
          width={90}
          height={60}
          className="h-12 w-auto shrink-0 object-contain"
        />
      <div className="leading-tight">
        <span className="font-display text-xl tracking-wide text-ink sm:text-2xl">
          Optimarket
        </span>
        <span className="hidden text-[11px] uppercase tracking-[0.35em] text-mist sm:block">
          интернет‑магазин
        </span>
      </div>
    </div>
  )
}
