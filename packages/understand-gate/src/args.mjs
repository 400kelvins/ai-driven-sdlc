/** `--name value` pairs; a flag followed by another flag, or by nothing, is `true`. */
export function parseArgs(argv) {
  const out = {}
  for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith('--')) continue
    const name = argv[i].slice(2)
    if (Object.hasOwn(out, name)) throw new Error(`--${name} given twice`)
    const next = argv[i + 1]
    out[name] = next === undefined || next.startsWith('--') ? true : (i++, next)
  }
  return out
}
