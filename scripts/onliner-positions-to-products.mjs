#!/usr/bin/env node
/**
 * Импорт выгрузки Onliner → public/products.json
 * Разделитель полей: «;»
 * Кодировка: **UTF-8** или **Windows-1251** — авто-по наличию колонки «Товар»,
 * или явно: `--utf8` | `--win1251`
 *
 *   npm run products:onliner
 *   npm run products:onliner -- --write-utf8
 *   npm run products:onliner -- позиции.csv --utf8 --write-utf8
 */

import { readFileSync, writeFileSync } from "node:fs"
import { resolve, basename, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import iconv from "iconv-lite"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, "..")
const OUT_JSON = resolve(ROOT, "public/products.json")

const REQUIRED_HEADERS = ["Товар", "Раздел", "Цена", "Описание предложения"]

function parseLine(line, delim) {
  const out = []
  let cur = ""
  let inQ = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (inQ) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cur += '"'
          i++
        } else {
          inQ = false
        }
      } else {
        cur += c
      }
    } else if (c === '"') {
      inQ = true
    } else if (c === delim) {
      out.push(cur)
      cur = ""
    } else {
      cur += c
    }
  }
  out.push(cur)
  return out.map((s) => s.trim())
}

function normalizeHeader(h) {
  return h.trim().replace(/^\ufeff/, "")
}

function decodeAsUtf8(buf) {
  let t = buf.toString("utf8")
  if (t.charCodeAt(0) === 0xfeff) t = t.slice(1)
  return t
}

function headersMatchRequired(line, delim) {
  const hdrs = parseLine(line, delim).map(normalizeHeader)
  const set = new Set(hdrs)
  return REQUIRED_HEADERS.every((k) => set.has(k))
}

/** Выбираем текст CSV: UTF-8 (копия после --write-utf8) или оригинал Win-1251 */
function decodeCsvBuffer(buf, mode) {
  const utf8Text = decodeAsUtf8(buf)
  const cp1251Text = iconv.decode(buf, "win1251")

  const firstLine = (txt) =>
    txt.split(/\r?\n/).find((l) => l.trim().length > 0) ?? ""

  if (mode === "utf8") return utf8Text
  if (mode === "win1251" || mode === "cp1251" || mode === "1251")
    return cp1251Text

  const lu = firstLine(utf8Text)
  const lw = firstLine(cp1251Text)

  const okU = headersMatchRequired(lu, ";")
  const okW = headersMatchRequired(lw, ";")

  if (okU && !okW) return utf8Text
  if (okW && !okU) return cp1251Text
  if (okU && okW) {
    console.warn(
      "Обе кодировки подходят по заголовкам → использован UTF-8. При ошибках попробуйте --win1251",
    )
    return utf8Text
  }

  console.warn(
    "Не нашли строку заголовков с «Товар», «Раздел», «Цена», «Описание предложения» — пробуем UTF-8. Иначе передайте --win1251",
  )
  return utf8Text
}

function main() {
  const args = process.argv.slice(2)
  const writeUtf8 = args.includes("--write-utf8")
  const FLAG = new Set(["--write-utf8", "--utf8", "--win1251"])
  const positional = args.filter((a) => !FLAG.has(a) && !a.startsWith("--"))

  /** @type {"auto" | "utf8" | "win1251"} */
  let encMode = "auto"
  if (args.includes("--utf8")) encMode = "utf8"
  if (args.includes("--win1251")) encMode = "win1251"

  const defaultCsv = resolve(ROOT, "positions.csv")
  const inputPath = positional.length
    ? resolve(process.cwd(), positional[0])
    : defaultCsv

  const raw = readFileSync(inputPath)
  const text = decodeCsvBuffer(raw, encMode)
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0)
  if (lines.length < 2) {
    console.error("Нет строк данных в CSV")
    process.exit(1)
  }

  if (writeUtf8) {
    const outCsv = `${basename(inputPath, ".csv")}.utf8.csv`
    const outPath = resolve(dirname(inputPath), outCsv)
    writeFileSync(outPath, text, "utf8")
    console.log(`UTF-8 таблица → ${outPath}`)
  }

  const headers = parseLine(lines[0], ";").map(normalizeHeader)
  const idx = Object.fromEntries(headers.map((h, i) => [h, i]))

  for (const k of REQUIRED_HEADERS) {
    if (idx[k] === undefined) {
      console.error(`Нет колонки «${k}». Заголовки: ${headers.join("; ")}`)
      console.error(
        "Подсказка: если выгрузка в Windows-1251 — выполните: npm run products:onliner -- positions.csv --win1251",
      )
      console.error(
        "Если файл уже UTF-8 — npm run products:onliner -- positions.csv --utf8",
      )
      process.exit(1)
    }
  }

  const idCol = idx["id-предложения"] ?? idx["Onliner ID"]
  const brandCol = idx["Производитель"]

  const products = []
  for (let li = 1; li < lines.length; li++) {
    const cells = parseLine(lines[li], ";")
    const get = (name) => cells[idx[name]] ?? ""

    const titleBase = get("Товар").trim()
    if (!titleBase) continue

    const brand = brandCol !== undefined ? get("Производитель").trim() : ""
    const title =
      brand && !titleBase.toLowerCase().includes(brand.toLowerCase())
        ? `${brand} · ${titleBase}`
        : titleBase

    const priceRaw = get("Цена").trim()
    const currency = get("Валюта").trim().toUpperCase() || "BYN"
    const price =
      currency === "BYN" ? `${priceRaw} Br` : `${priceRaw} ${currency}`

    const rawId = idCol !== undefined ? cells[idCol]?.trim() : ""
    const onlinerProductId = get("Onliner ID").trim()
    const id =
      rawId ||
      (onlinerProductId ? `${onlinerProductId}-${li}` : `row-${li}`)

    const item = {
      id,
      title,
      category: get("Раздел").trim() || "Без раздела",
      price,
      description: get("Описание предложения").trim(),
    }

    const stock = get("Наличие на складе").trim().toLowerCase()
    if (stock === "in_stock") item.badge = "В наличии"

    products.push(item)
  }

  writeFileSync(OUT_JSON, `${JSON.stringify(products, null, 2)}\n`, "utf8")
  console.log(`OK: ${products.length} позиций → ${OUT_JSON}`)
}

main()
