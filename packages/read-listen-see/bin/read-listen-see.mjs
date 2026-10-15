#!/usr/bin/env node
// read-listen-see: an alias of understand-gate. Same commands, same output, same exit code.
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const bin = fileURLToPath(import.meta.resolve('understand-gate/bin/understand-gate.mjs'))
const result = spawnSync(process.execPath, [bin, ...process.argv.slice(2)], { stdio: 'inherit' })
process.exitCode = result.status ?? 1
