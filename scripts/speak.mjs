#!/usr/bin/env node
// Reads the "Summary (read aloud)" section of a Gate Review Pack aloud.
// Usage: npm run review:speak -- <file.md> [--dry-run] [--highlight]
//   --highlight  open a Terminal window that highlights each word as it is spoken
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
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

// AppleScript that runs `say --interactive` in a new Terminal window. The text is read
// from a temp file, so nothing from the pack reaches a shell command line.
export function highlightScript(textFile) {
  if (!/^[\w./-]+$/.test(textFile)) throw new Error(`Unsafe temp path: ${textFile}`)
  const cmd = `clear; say --interactive=smso -f '${textFile}'; exit`
  return [
    'tell application "Terminal"',
    `  do script "${cmd}"`,
    '  activate',
    'end tell',
  ].join('\n')
}

function speakHighlighted(text) {
  const file = join(mkdtempSync(join(tmpdir(), 'speak-')), 'summary.txt')
  writeFileSync(file, text)
  const osa = spawn('osascript', ['-'], { stdio: ['pipe', 'ignore', 'inherit'] })
  osa.on('error', (err) => {
    console.error(`Could not open Terminal: ${err.message}`)
    process.exit(1)
  })
  osa.on('exit', (code, signal) => process.exit(signal ? 1 : (code ?? 1)))
  osa.stdin.end(highlightScript(file))
}

function main(argv) {
  const dryRun = argv.includes('--dry-run')
  const highlight = argv.includes('--highlight')
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
  if (highlight) {
    speakHighlighted(text)
    return null
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
