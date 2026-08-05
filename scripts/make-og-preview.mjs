import sharp from 'sharp'
import { copyFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const sourcePhoto = join(root, 'public', 'og-preview.png')
const outFile = join(root, 'public', 'og-preview.png')
const backup = join(root, 'public', 'og-source-photo.png')

const W = 1200
const H = 630

await copyFile(sourcePhoto, backup)

const bg = await sharp({
  create: {
    width: W,
    height: H,
    channels: 3,
    background: { r: 255, g: 247, b: 250 },
  },
})
  .png()
  .toBuffer()

const photo = await sharp(backup)
  .resize(620, H, { fit: 'cover', position: 'attention' })
  .png()
  .toBuffer()

const svg = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffe5ec"/>
      <stop offset="100%" stop-color="#fff7fa"/>
    </linearGradient>
  </defs>
  <rect x="620" y="0" width="580" height="630" fill="url(#g)"/>
  <circle cx="1050" cy="90" r="120" fill="#ff8fab" fill-opacity="0.22"/>
  <circle cx="700" cy="560" r="160" fill="#e63956" fill-opacity="0.12"/>
  <text x="670" y="230" font-family="Georgia, 'Times New Roman', serif" font-size="28" fill="#e63956" letter-spacing="3">YOU'RE INVITED</text>
  <text x="670" y="310" font-family="Georgia, 'Times New Roman', serif" font-size="54" font-weight="700" fill="#9b2340">Minthara Ellise</text>
  <text x="670" y="375" font-family="Georgia, 'Times New Roman', serif" font-size="42" fill="#c9184a">Christening</text>
  <text x="670" y="455" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="#7a4558">September 6, 2026</text>
  <text x="670" y="500" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="#7a4558">Malaybalay, Bukidnon</text>
</svg>
`)

await sharp(bg)
  .composite([
    { input: photo, left: 0, top: 0 },
    { input: svg, left: 0, top: 0 },
  ])
  .png({ compressionLevel: 8 })
  .toFile(outFile)

const meta = await sharp(outFile).metadata()
console.log(`Wrote ${outFile} (${meta.width}x${meta.height})`)
