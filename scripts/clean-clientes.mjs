import fs from 'fs'
import path from 'path'
import Papa from 'papaparse'

const root = path.resolve(process.cwd())
const inputPath = path.join(root, 'server', 'database', 'Clientes.csv')
const outputPath = path.join(root, 'server', 'database', 'Clientes_clean.csv')

const readFileUtf8 = (p) => fs.readFileSync(p, 'utf8')
const writeFileUtf8 = (p, c) => fs.writeFileSync(p, c, 'utf8')

const collapseWhitespace = (s) => s.replace(/[\s\u00A0]+/g, ' ').trim()
const stripQuotes = (s) => s.replace(/^"|"$/g, '')
const cleanCell = (v) => collapseWhitespace(stripQuotes(String(v ?? '').replace(/\r?\n/g, ' ').trim()))

const stripLeadingNameColon = (s) => {
  // Remove leading "SOMETHING: " before the real address/detail
  // Example: "ANDES TROPICO: QUILLACOLLO, AV ..." -> "QUILLACOLLO, AV ..."
  return s.replace(/^[^:]{2,}:(\s*)/u, '')
}

const isHeaderLettersRow = (row) => row[0] === '' && row[1] === 'A'
const isHeaderTitlesRow = (row) => (row[0] || '').toLowerCase() === 'empresa' && (row[1] || '').toLowerCase().startsWith('cliente')

function main() {
  const csvRaw = readFileUtf8(inputPath)

  const parsed = Papa.parse(csvRaw, {
    header: false,
    skipEmptyLines: 'greedy',
  })

  if (parsed.errors?.length) {
    console.error('Errores al parsear CSV:', parsed.errors.slice(0, 3))
  }

  const rows = parsed.data
  const out = []
  const seen = new Set()

  for (const rawRow of rows) {
    const row = Array.isArray(rawRow) ? rawRow : []

    if (row.length === 0) continue
    if (isHeaderLettersRow(row)) continue
    if (isHeaderTitlesRow(row)) continue

    const empresa = cleanCell(row[0] || '')
    const detalleRaw = cleanCell(row[1] || '')
    const cliente = cleanCell(row[2] || '')

    if (!empresa && !detalleRaw && !cliente) continue

    const detalle = stripLeadingNameColon(detalleRaw)
    const notas = row.slice(3)
      .map(cleanCell)
      .filter(Boolean)
      .join(' | ')

    const key = `${empresa}||${detalle}||${cliente}||${notas}`
    if (seen.has(key)) continue
    seen.add(key)

    out.push({ Empresa: empresa, Direccion: detalle, Cliente: cliente, Notas: notas })
  }

  // Sort by Empresa asc then Cliente asc
  out.sort((a, b) => (a.Empresa || '').localeCompare(b.Empresa || '') || (a.Cliente || '').localeCompare(b.Cliente || ''))

  const cleanCsv = Papa.unparse(out, { header: true })
  writeFileUtf8(outputPath, cleanCsv + '\n')
  console.log(`✅ CSV limpio generado: ${outputPath}`)
  console.log(`   Registros: ${out.length}`)
}

main()
