#!/usr/bin/env node
// Fails if any speaker-note text from pages/*.md appears in the built dist/ (Story 3, FR-005).
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const notes = readdirSync('pages')
  .filter((f) => f.endsWith('.md'))
  .flatMap((f) => [...readFileSync(join('pages', f), 'utf8').matchAll(/<!--([\s\S]*?)-->/g)])
  .flatMap((m) => m[1].split('\n'))
  .map((line) => line.trim())
  .filter((line) => line.length >= 25)

function files(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f)
    return statSync(p).isDirectory() ? files(p) : [p]
  })
}

const built = files('dist')
  .filter((p) => /\.(js|html|css|json)$/.test(p))
  .map((p) => readFileSync(p, 'utf8'))
  .join('\n')

const leaked = notes.filter((line) => built.includes(line.slice(0, 40)))
if (leaked.length) {
  console.error(`Speaker notes leaked into dist/:\n${leaked.map((l) => `  - ${l}`).join('\n')}`)
  process.exit(1)
}
console.log(`No speaker notes in dist/ (${notes.length} note lines checked)`)
