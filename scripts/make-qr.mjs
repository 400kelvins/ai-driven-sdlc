#!/usr/bin/env node
// Story 7 (spec 007): writes public/qr/<id>.svg for each link in scripts/links.json.
// SVGs are committed, so the Links slide works offline.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import QRCode from 'qrcode'

export function qrSvg(url) {
  return QRCode.toString(url, { type: 'svg', errorCorrectionLevel: 'M', margin: 2 })
}

async function main() {
  const links = JSON.parse(readFileSync(new URL('./links.json', import.meta.url), 'utf8'))
  mkdirSync('public/qr', { recursive: true })
  for (const [id, { url }] of Object.entries(links)) {
    writeFileSync(`public/qr/${id}.svg`, await qrSvg(url))
    console.log(`public/qr/${id}.svg → ${url}`)
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main()
