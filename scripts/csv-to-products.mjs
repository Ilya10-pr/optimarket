#!/usr/bin/env node
/**
 * CSV → public/products.json
 *
 * Заголовки (строка 1): id, title, category, price, description, badge, image
 * (обязательны: title, category, price, description)
 *
 * Кодировка:
 *   По умолчанию читаем как UTF-8 (BOM снимается).
 *   Excel в Windows часто сохраняет кириллицу как Windows-1251 — тогда:
 *     npm run products:import -- export.csv win1251
 *
 * Если текст в файле уже «кракозябры» (типа Áåñïðôîâîäíûå) при открытии
 * как UTF-8, но файл на самом деле был сохранён в UTF-8, а Excel испортил
 * отображение — попробуйте пересохранить файл в UTF-8 в LibreOffice/Google
 * Таблицы, или импорт с win1251, или флаг --repair (восстановление после
 * неверной перекодировки).
 *
 * Примеры:
 *   node scripts/csv-to-products.mjs export.csv
 *   node scripts/csv-to-products.mjs export.csv win1251
 *   node scripts/csv-to-products.mjs export.csv --repair
 *   node scripts/csv-to-products.mjs export.csv utf8 --repair
 */

import { readFileSync, writeFileSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import iconv from "iconv-lite"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, "..")
const OUT = resolve(ROOT, "public/products.json")

const REQUIRED = ["title", "category", "price", "description"]

/** UTF-8 прочли как Latin-1/бинарно — восстанавливаем байты и декодируем в UTF-8 */
function repairMojibakeUtf8(lat1Str) {
  const b = Buffer.alloc(lat1Str.length)
  for (let i = 0; i < lat1Str.length; i++) b[i] = lat1Str.charCodeAt(i) & 0xff
  return b.toString("utf8")
}

function readFileAsText(absPath, encodingHint, repair) {
  const buf = readFileSync(absPath)
  /** @type {string} */
  let text

  const hint = (encodingHint || "utf8").toLowerCase()
  const isUtf8 =
    hint === "utf8" ||
    hint === "utf-8" ||
    hint === ""

  if (hint === "win1251" || hint === "cp1251" || hint === "1251") {
    text = iconv.decode(buf, "win1251")
  } else if (isUtf8) {
    text = buf.toString("utf8")
    if (text.charCodeAt(0) === 0xfeff) text = text.slice(1)
  } else {
    throw new Error(
      `Неизвестная кодировка "${encodingHint}". Укажите utf8 или win1251.`,
    )
  }

  if (repair) text = repairMojibakeUtf8(text)

  return text
}

function parseCsvLine(line) {
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
    } else if (c === ",") {
      out.push(cur)
      cur = ""
    } else {
      cur += c
    }
  }
  out.push(cur)
  return out.map((s) => s.trim())
}

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0)
  if (lines.length < 2) {
    throw new Error(
      "CSV: нужна строка заголовков и минимум одна строка данных",
    )
  }
  const headers = parseCsvLine(lines[0]).map((h) => h.trim().toLowerCase())
  for (const h of REQUIRED) {
    if (!headers.includes(h)) {
      throw new Error(`CSV: нет колонки "${h}". Есть: ${headers.join(", ")}`)
    }
  }
  const rows = []
  for (let li = 1; li < lines.length; li++) {
    const cells = parseCsvLine(lines[li])
    if (cells.length === 1 && cells[0] === "") continue
    const row = {}
    headers.forEach((key, i) => {
      row[key] = cells[i] ?? ""
    })
    rows.push(row)
  }
  return rows
}

function usage() {
  console.error(`
Использование:
  node scripts/csv-to-products.mjs <файл.csv> [utf8|win1251] [--repair]

  win1251  — если Excel сохранил CSV в «ANSI» / кодировке Windows кириллицы
  --repair — попробовать починить UTF-8, один раз прочитанный как Latin-1

npm:
  npm run products:import -- export.csv win1251
`)
}

function main() {
  const argv = process.argv.slice(2)
  const repair = argv.includes("--repair")
  const pos = argv.filter((a) => !a.startsWith("--"))
  const inputPath = pos[0]
  const encodingHint = pos[1]

  if (!inputPath) {
    usage()
    process.exit(1)
  }

  const abs = resolve(process.cwd(), inputPath)
  const text = readFileAsText(abs, encodingHint || "utf8", repair)
  const rows = parseCsv(text)
  const products = rows.map((row, index) => {
    const title = row.title?.trim() || `Товар ${index + 1}`
    const item = {
      id: row.id?.trim() || `import-${index + 1}`,
      title,
      category: row.category?.trim() || "Без категории",
      price: row.price?.trim() || "—",
      description: row.description?.trim() || "",
    }
    const badge = row.badge?.trim()
    if (badge) item.badge = badge
    const image = row.image?.trim()
    if (image) item.image = image
    return item
  })

  writeFileSync(OUT, `${JSON.stringify(products, null, 2)}\n`, "utf8")
  console.log(`OK: ${products.length} позиций → ${OUT}`)
}

main()
