// Story 4 (spec 004, FR-001/002): press M to jump to the monitoring slide and M again to return.
import type { NavOperations, ShortcutOptions } from '@slidev/types'
import { defineShortcutsSetup } from '@slidev/types'
import { useNav } from '@slidev/client'

let origin: number | null = null

export default defineShortcutsSetup((nav: NavOperations, base: ShortcutOptions[]) => {
  const { slides, currentSlideNo } = useNav()

  const monitorNo = () =>
    slides.value.find((s) => s.meta.slide?.frontmatter?.monitor === true)?.no

  return [
    ...base,
    {
      name: 'toggle_monitor',
      key: 'm',
      fn: () => {
        const target = monitorNo()
        if (!target) return
        if (currentSlideNo.value !== target) {
          origin = currentSlideNo.value
          nav.go(target)
        } else if (origin !== null) {
          nav.go(origin)
          origin = null
        }
      },
    },
  ]
})
