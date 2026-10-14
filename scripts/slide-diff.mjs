#!/usr/bin/env node
// Compares two folders of slide screenshots (spec 009) and keeps only the slides that look different.
//
//   node scripts/slide-diff.mjs <base-dir> <head-dir> <out-dir>
//
// Writes <out-dir>/manifest.json plus NNN-before.png / NNN-after.png for each changed slide.
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const SHOT = /^(\d{3})\.png$/
const pad = (n) => String(n).padStart(3, '0')

/** base, head: Map<slide number, image bytes>. Byte compare: rendering is deterministic on one runner. */
export function diff(base, head) {
  const changes = []
  for (const slide of new Set([...base.keys(), ...head.keys()])) {
    const before = base.get(slide)
    const after = head.get(slide)
    if (!before) changes.push({ slide, kind: 'new' })
    else if (!after) changes.push({ slide, kind: 'removed' })
    else if (!before.equals(after)) changes.push({ slide, kind: 'changed' })
  }
  changes.sort((a, b) => a.slide - b.slide)
  return { total: head.size, baseMissing: base.size === 0, changes }
}

function readShots(dir) {
  if (!existsSync(dir)) return new Map()
  return new Map(
    readdirSync(dir)
      .map((f) => f.match(SHOT))
      .filter(Boolean)
      .map((m) => [Number(m[1]), readFileSync(join(dir, m[0]))]),
  )
}

function main([baseDir, headDir, outDir]) {
  if (!headDir || !outDir) {
    console.error('usage: slide-diff.mjs <base-dir> <head-dir> <out-dir>')
    return 2
  }
  const result = diff(readShots(baseDir), readShots(headDir))
  mkdirSync(outDir, { recursive: true })
  for (const { slide, kind } of result.changes) {
    const name = `${pad(slide)}.png`
    if (kind !== 'new') copyFileSync(join(baseDir, name), join(outDir, `${pad(slide)}-before.png`))
    if (kind !== 'removed') copyFileSync(join(headDir, name), join(outDir, `${pad(slide)}-after.png`))
  }
  writeFileSync(join(outDir, 'manifest.json'), JSON.stringify(result, null, 2) + '\n')
  console.log(`${result.changes.length} changed`)
  return 0
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) process.exit(main(process.argv.slice(2)))
