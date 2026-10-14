// Local quiz statistics for counter-metric CM-2 (a rubber-stamp quiz); computed only from the ledger.

export function stats(entries) {
  const quizzed = entries.filter((e) => typeof e.firstTry === 'boolean')
  return {
    decisions: entries.length,
    no: entries.filter((e) => e.decision === 'no').length,
    quizzed: quizzed.length,
    firstTry: quizzed.filter((e) => e.firstTry).length,
    reExplanations: entries.reduce((sum, e) => sum + (Number.isInteger(e.attempts) && e.attempts > 1 ? e.attempts - 1 : 0), 0),
  }
}

export function formatStats(s) {
  if (!s.decisions) return 'no decisions recorded yet'
  const rate = s.quizzed ? `${s.firstTry}/${s.quizzed} (${Math.round((100 * s.firstTry) / s.quizzed)}%)` : 'none recorded'
  return [`decisions ${s.decisions} · no ${s.no}`, `first-try quiz passes ${rate}`, `re-explanations ${s.reExplanations}`].join('\n')
}
