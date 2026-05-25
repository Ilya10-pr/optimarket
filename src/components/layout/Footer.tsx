export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-ink/10 bg-panel-muted/35 py-12">
      <div className="section-shell  text-center text-xs text-mist">
        <p>
          © {year} Optimarket. УНП 193956057.
        </p>
        <p className="mx-auto max-w-3xl wrap-break-word leading-relaxed">
          Юридический адрес: 220007, г.&nbsp;Минск, ул.&nbsp;Быховская, д.&nbsp;35,
          пом.&nbsp;11Н
        </p>
      </div>
    </footer>
  )
}
