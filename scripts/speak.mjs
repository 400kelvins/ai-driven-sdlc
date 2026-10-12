#!/usr/bin/env node
// Reads the "Summary (read aloud)" section of a Gate Review Pack aloud.
// Usage: npm run review:speak -- <file.md> [--dry-run]
import { readFileSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { pathToFileURL } from 'node:url'

const HEADING = /^##\s+Summary\b.*$/im

export function extractSummary(markdown) {
  const start = markdown.search(HEADING)
  if (start === -1) return null
  const afterHeading = markdown.slice(start).replace(HEADING, '')
  const next = afterHeading.search(/^##\s+/m)
  return (next === -1 ? afterHeading : afterHeading.slice(0, next)).trim()
}

export function stripMarkdown(text) {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\|?[-:\s|]+\|?\s*$/gm, '')
    .replace(/\|/g, ' ')
    .replace(/(?<!\w)(\*\*|__|\*|_|~~)(?=\S)(.+?)(?<=\S)\1(?!\w)/g, '$2')
    .replace(/\[\[|\]\]/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\s*\n\s*/g, ' ')
    .trim()
}

function main(argv) {
  const dryRun = argv.includes('--dry-run')
  const file = argv.find((a) => !a.startsWith('--'))
  if (!file) {
    console.error('Usage: npm run review:speak -- <file.md> [--dry-run]')
    return 2
  }
  let markdown
  try {
    markdown = readFileSync(file, 'utf8')
  } catch {
    console.error(`File not found: ${file}`)
    return 1
  }
  const summary = extractSummary(markdown)
  if (!summary) {
    console.error(`No "## Summary" section in ${file}`)
    return 1
  }
  const text = stripMarkdown(summary)
  if (dryRun || process.platform !== 'darwin') {
    console.log(text)
    return 0
  }
  // Text goes in on stdin, never argv, so it cannot be parsed as a `say` option
  const say = spawn('say', ['-f', '-'], { stdio: ['pipe', 'inherit', 'inherit'] })
  say.on('error', (err) => {
    console.error(`Could not run say: ${err.message}`)
    process.exit(1)
  })
  say.on('exit', (code, signal) => process.exit(signal ? 1 : (code ?? 1)))
  say.stdin.end(text)
  return null
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const code = main(process.argv.slice(2))
  if (code !== null) process.exit(code)
}
