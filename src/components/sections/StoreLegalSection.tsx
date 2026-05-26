const orderSchedule = [
  { day: "Понедельник", hours: "09:00—21:00" },
  { day: "Вторник", hours: "09:00—21:00" },
  { day: "Среда", hours: "09:00—21:00" },
  { day: "Четверг", hours: "09:00—21:00" },
  { day: "Пятница", hours: "09:00—21:00" },
  { day: "Суббота", hours: "09:00—21:00" },
  { day: "Воскресенье", hours: "09:00—21:00" },
]

const paymentMethods = ["Наличный расчёт", "Банковская пластиковая карта"]

export function StoreLegalSection() {
  return (
    <section
      id="working-hours"
      className="scroll-mt-[4.25rem] border-y border-ink/10 bg-void py-10 sm:py-14"
    >
      <div className="section-shell space-y-16">
        <div className="grid gap-12 lg:grid-cols-2">
          <div id="order-hours" className="scroll-mt-24 space-y-6">
            <h2 className="heading-accent font-display text-3xl text-ink sm:text-4xl">
              Режим обработки заказов
            </h2>
            <p className="text-mist">
              Обработка обращений и заказов ведётся в указанные интервалы по дням
              недели.
            </p>
            <ul className="surface-card divide-y divide-ink/10 overflow-hidden">
              {orderSchedule.map((row) => (
                <li
                  key={row.day}
                  className="flex items-center justify-between gap-2 px-4 py-3 text-sm sm:gap-4 sm:px-5 sm:py-3.5"
                >
                  <span className="font-medium text-ink">{row.day}</span>
                  <span className="tabular-nums text-mist">{row.hours}</span>
                </li>
              ))}
            </ul>
          </div>

          <div id="payments" className="scroll-mt-24 space-y-6">
            <h2 className="heading-accent font-display text-3xl text-ink sm:text-4xl">
              Способы оплаты
            </h2>
            <ul className="space-y-3">
              {paymentMethods.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 rounded-[var(--radius-card)] border border-ink/10 bg-panel px-5 py-4 text-ink"
                >
                  <span className="size-2 shrink-0 rounded-full bg-linear-to-br from-ember to-blaze" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="surface-card p-6 sm:p-10">
          <h2 className="heading-accent mb-6 font-display text-2xl text-ink sm:text-3xl">
            Сведения о продавце
          </h2>
          <div className="space-y-4 wrap-break-word text-sm leading-relaxed text-mist sm:text-[0.9375rem]">
            <p className="text-base font-semibold text-ink">
              Общество с ограниченной ответственностью «Клуб Ривьера»
            </p>
            <p>
              <span className="font-medium text-ink">Юридический адрес: </span>
              220007, г.&nbsp;Минск, ул.&nbsp;Быховская, д.&nbsp;35, пом.&nbsp;11Н
            </p>
            <p>
              <span className="font-medium text-ink">УНП </span>193956057
            </p>
            {/* <p>
              <span className="font-medium text-ink">
                Свидетельство о регистрации{' '}
              </span>
              193956057 от 20.01.2026
            </p>
            <p>
              <span className="font-medium text-ink">Регистрирующий орган: </span>
              Минский горисполком
            </p>
            <p>
              <span className="font-medium text-ink">
                Зарегистрирован в торговом реестре:{' '}
              </span>
              20.03.2026
            </p>
            <p>
              <span className="font-medium text-ink">Номер регистрации: </span>
              772076
            </p> */}
            <p>
              <span className="font-medium text-ink">
                Местонахождение книги замечаний и предложений:{' '}
              </span>
              г.&nbsp;Минск, ул.&nbsp;Быховская, д.&nbsp;35, пом.&nbsp;11Н
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
