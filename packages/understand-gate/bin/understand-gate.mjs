#!/usr/bin/env node
// understand-gate: no yes without understanding.
//
//   understand-gate fingerprint --scope <name>
//
// Exit codes: 0 pass, 1 failure, 2 usage. Errors are one line on stderr.
import { fingerprint } from '../src/fingerprint.mjs'
import { loadConfig } from '../src/scopes.mjs'

const USAGE = 'Usage: understand-gate fingerprint --scope <name>'

function main([cmd, ...rest]) {
  const scopeAt = rest.indexOf('--scope')
  const name = scopeAt === -1 ? undefined : rest[scopeAt + 1]
  if (cmd !== 'fingerprint' || !name) {
    console.error(USAGE)
    return 2
  }
  try {
    const { scopes } = loadConfig()
    if (!Object.hasOwn(scopes, name)) {
      console.error(`Unknown scope "${name}"; known scopes: ${Object.keys(scopes).join(', ')}`)
      return 1
    }
    console.log(fingerprint(scopes[name]))
    return 0
  } catch (err) {
    console.error(err.message.split('\n')[0])
    return 1
  }
}

process.exitCode = main(process.argv.slice(2))
