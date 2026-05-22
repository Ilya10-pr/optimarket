// Vercel Serverless Function
// Deployed automatically when you push to Vercel.
// Set environment variables in Vercel Dashboard:
//   TELEGRAM_BOT_TOKEN = your bot token from @BotFather
//   TELEGRAM_CHAT_ID = your personal chat id (get via getUpdates or @userinfobot)

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    return res.status(405).end("Method Not Allowed")
  }

  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    console.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID")
    return res.status(500).json({ error: "Telegram integration not configured" })
  }

  try {
    const { product, name, phone, address, deliveryTime, payment } = req.body || {}

    if (!product?.title || !phone || !address) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const lines = [
      "🛒 <b>Новый заказ с сайта Optimarket</b>",
      "",
      `<b>Товар:</b> ${product.title}`,
      product.category ? `<b>Категория:</b> ${product.category}` : null,
      `<b>Цена:</b> ${product.priceDiscount ? product.priceDiscount : product.price}`,
      "",
      name ? `<b>Имя:</b> ${name}` : null,
      `<b>Телефон:</b> ${phone}`,
      `<b>Адрес:</b> ${address}`,
      `<b>Время доставки:</b> ${deliveryTime || "Не указано"}`,
      `<b>Оплата:</b> ${payment || "Наличными"}`,
      "",
      `<i>Получено: ${new Date().toLocaleString("ru-RU")}</i>`,
    ].filter(Boolean)

    const text = lines.join("\n")

    const tgResponse = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      }
    )

    if (!tgResponse.ok) {
      const err = await tgResponse.text()
      console.error("Telegram API error:", err)
      throw new Error("Telegram send failed")
    }

    res.status(200).json({ ok: true, message: "Order sent to Telegram" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to process order" })
  }
}
