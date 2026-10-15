#!/usr/bin/env node
// read-listen-see: an alias of understand-gate. Same commands, same output, same exit code.
import { spawnSync } from 'node:child_process'
import { constants } from 'node:os'
import { fileURLToPath } from 'node:url'

const bin = fileURLToPath(import.meta.resolve('understand-gate/bin/understand-gate.mjs'))
const result = spawnSync(process.execPath, [bin, ...process.argv.slice(2)], { stdio: 'inherit' })
if (result.error) {
  console.error(`read-listen-see: could not start understand-gate: ${result.error.message}`)
  process.exitCode = 1
} else if (result.signal) {
  // Like a shell: 128 + the signal number
  process.exitCode = 128 + (constants.signals[result.signal] ?? 0)
} else {
  process.exitCode = result.status ?? 1
}
