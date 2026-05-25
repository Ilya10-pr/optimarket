const contacts = [
  {
    label: "Юридический и почтовый адрес",
    value:
      "220007, г. Минск, ул. Быховская, д. 35, пом. 11Н (Optimarket)",
    href: undefined,
  },
  {
    label: "Режим обработки заказов",
    value: "Ежедневно 11:00 — 18:00 (см. расписание по дням ниже на странице)",
    href: "#working-hours",
  },
  {
    label: "Телефон для связи",
    value: "+375 (__) ___-__-__",
    href: undefined,
  },
  {
    label: "Электронная почта",
    value: "order@optimarket.by",
    href: "mailto:order@optimarket.by",
  },
]

export function ContactSection() {
  return (
    <section id="contacts" className="section-y scroll-mt-20 pb-12 sm:pb-14">
      <div className="section-shell grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:items-start">
        <div className="space-y-6">
          <h2 className="heading-accent font-display text-3xl text-ink sm:text-4xl">
            Контакты
          </h2>
          <p className="max-w-md text-lg text-mist">
            Вопросы по заказу, наличию и сотрудничеству — в рабочее время
            обработки заказов. Реквизиты и способы оплаты размещены на этой
            странице.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="mailto:order@optimarket.by" className="btn-primary">
              Написать нам
            </a>
          </div>
        </div>
        <dl className="surface-card divide-y divide-ink/10 overflow-hidden">
          {contacts.map((row) => (
            <div
              key={row.label}
              className="flex flex-col gap-1 px-6 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
            >
              <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-mist">
                {row.label}
              </dt>
              <dd className="text-base text-ink sm:max-w-[60%] sm:text-right">
                {row.href ? (
                  <a href={row.href} className="transition hover:text-blaze">
                    {row.value}
                  </a>
                ) : (
                  row.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
