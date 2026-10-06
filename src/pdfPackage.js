import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

const A4 = [595.28, 841.89]
const FOOTER_HEIGHT = 34
const MARGIN = 54

function drawFooter(page, tenderId, pageNumber, totalPages, font) {
  const { width } = page.getSize()
  page.drawRectangle({ x: 0, y: 0, width, height: FOOTER_HEIGHT, color: rgb(0.055, 0.075, 0.08) })
  page.drawLine({ start: { x: 0, y: FOOTER_HEIGHT }, end: { x: width, y: FOOTER_HEIGHT }, thickness: 0.7, color: rgb(0.35, 0.89, 0.86) })
  const footer = `${tenderId} | Page ${pageNumber} of ${totalPages}`
  const textWidth = font.widthOfTextAtSize(footer, 8)
  page.drawText(footer, { x: (width - textWidth) / 2, y: 12, size: 8, font, color: rgb(0.9, 0.95, 0.95) })
}

function drawCover(page, tender, included, fonts) {
  const { width, height } = page.getSize()
  const ink = rgb(0.06, 0.09, 0.1)
  const cyan = rgb(0.12, 0.58, 0.57)
  const muted = rgb(0.33, 0.39, 0.4)
  page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(0.98, 0.99, 0.99) })
  page.drawRectangle({ x: 0, y: height - 14, width, height: 14, color: cyan })
  page.drawText('TENDER DOCUMENT PACKAGE', { x: MARGIN, y: height - 85, size: 10, font: fonts.bold, color: cyan, characterSpacing: 1.4 })
  page.drawText(tender.tender_id, { x: MARGIN, y: height - 135, size: 27, font: fonts.bold, color: ink })
  drawWrapped(page, tender.title, MARGIN, height - 170, width - (MARGIN * 2), 18, fonts.bold, ink, 23)
  const details = [
    ['Procuring entity', tender.procuring_entity],
    ['Bidder', tender.bidder],
    ['Submission deadline', tender.submission_deadline],
    ['Package made', new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })],
  ]
  let y = height - 277
  details.forEach(([label, value]) => {
    page.drawText(label.toUpperCase(), { x: MARGIN, y, size: 7.5, font: fonts.bold, color: muted, characterSpacing: 0.7 })
    page.drawText(value, { x: MARGIN + 146, y: y - 1, size: 10, font: fonts.regular, color: ink })
    y -= 27
  })
  y -= 18
  page.drawLine({ start: { x: MARGIN, y }, end: { x: width - MARGIN, y }, thickness: 0.8, color: rgb(0.76, 0.81, 0.81) })
  y -= 24
  page.drawText('INCLUDED DOCUMENTS', { x: MARGIN, y, size: 9, font: fonts.bold, color: cyan, characterSpacing: 1 })
  y -= 22
  const listLineHeight = Math.max(10, Math.min(19, 320 / Math.max(included.length, 1)))
  const listSize = included.length > 15 ? 7.5 : 9.5
  included.forEach((item) => {
    page.drawText(`${String(item.order).padStart(2, '0')}  ${item.title_en}`, { x: MARGIN, y, size: listSize, font: fonts.regular, color: ink })
    y -= listLineHeight
  })
}

function drawWrapped(page, text, x, y, maxWidth, size, font, color, lineHeight) {
  const words = text.split(/\s+/)
  let line = ''
  let lineY = y
  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word
    if (font.widthOfTextAtSize(candidate, size) > maxWidth && line) {
      page.drawText(line, { x, y: lineY, size, font, color })
      line = word
      lineY -= lineHeight
    } else line = candidate
  })
  if (line) page.drawText(line, { x, y: lineY, size, font, color })
}

export async function createTenderPackage({ tender, requirements, uploads, matches }) {
  const output = await PDFDocument.create()
  const fonts = { regular: await output.embedFont(StandardFonts.Helvetica), bold: await output.embedFont(StandardFonts.HelveticaBold) }
  const included = requirements.filter((requirement) => matches[requirement.id]).sort((a, b) => a.order - b.order)
  const cover = output.addPage(A4)
  drawCover(cover, tender, included, fonts)

  for (const requirement of included) {
    const upload = uploads.find((file) => file.id === matches[requirement.id])
    if (!upload) continue
    const source = await PDFDocument.load(await upload.file.arrayBuffer())
    const sourcePages = source.getPages()
    for (let index = 0; index < sourcePages.length; index += 1) {
      const sourcePage = sourcePages[index]
      const { width, height } = sourcePage.getSize()
      const [embedded] = await output.embedPdf(source, [index])
      const wrapped = output.addPage([width, height + FOOTER_HEIGHT])
      wrapped.drawPage(embedded, { x: 0, y: FOOTER_HEIGHT, width, height })
    }
  }

  const pages = output.getPages()
  pages.forEach((page, index) => drawFooter(page, tender.tender_id, index + 1, pages.length, fonts.regular))
  return output.save()
}
