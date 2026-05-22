/**
 * Графический знак белорусского рубля (утв. НБРБ, 2026): Б со штрихом.
 * Отдельного кодпойнта в Unicode пока может не быть — рисуем семантику через Б + линию.
 */
export function BelarusRubleGlyph({ className = "" }: { className?: string }) {
  return (
    <span
      className={`relative inline-flex h-[1em] min-h-[12px] w-[0.78em] min-w-[11px] shrink-0 items-center justify-center [vertical-align:-0.06em] text-[inherit] ${className}`}
      aria-hidden
    >
      <span className="select-none font-sans text-[0.94em] font-semibold leading-none tracking-[-0.05em]">
        Б
      </span>
      <span className="pointer-events-none absolute left-[12%] right-[10%] top-[calc(50%+0.04em)] h-[max(2px,0.085em)] -translate-y-1/2 rounded-[min(2px,0.08em)] bg-current" />
    </span>
  )
}
