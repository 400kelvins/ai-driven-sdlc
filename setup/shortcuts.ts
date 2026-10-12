// Story 4 (spec 004, FR-001/002): press M to jump to the monitoring slide and M again to return.
import type { NavOperations, ShortcutOptions } from '@slidev/types'
import { defineShortcutsSetup } from '@slidev/types'
import { useNav } from '@slidev/client'
import { watch } from 'vue'

// Slide to return to; set only by an M jump, cleared by any other navigation
let origin: number | null = null
let jumping = false
let modifierHeld = false

if (typeof window !== 'undefined') {
  const track = (e: KeyboardEvent) => (modifierHeld = e.metaKey || e.ctrlKey || e.altKey)
  window.addEventListener('keydown', track, true)
  window.addEventListener('keyup', track, true)
}

function isTyping() {
  const el = document.activeElement as HTMLElement | null
  return !!el?.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"]')
}

export default defineShortcutsSetup((nav: NavOperations, base: ShortcutOptions[]) => {
  const { slides, currentSlideNo } = useNav()

  const monitorNo = () =>
    slides.value.find((s) => s.meta.slide?.frontmatter?.monitor === true)?.no

  watch(currentSlideNo, () => {
    if (!jumping) origin = null
    jumping = false
  })

  const go = (no: number) => {
    jumping = true
    nav.go(no)
  }

  return [
    ...base,
    {
      name: 'toggle_monitor',
      key: 'm',
      fn: () => {
        if (modifierHeld || isTyping()) return
        const target = monitorNo()
        if (!target) return
        if (currentSlideNo.value !== target) {
          const from = currentSlideNo.value
          go(target)
          origin = from
        } else if (origin !== null) {
          const back = origin
          origin = null
          go(back)
        }
      },
    },
  ]
})
