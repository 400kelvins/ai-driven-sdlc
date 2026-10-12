<script setup lang="ts">
// Story 6: readable step flows that wrap onto rows (Mermaid shrinks long chains to unreadable).
// A step is a label, or { label, kind } where kind is 'gate' (human decision) or 'muted'.
type Step = string | { label: string, kind?: 'gate' | 'muted' }

defineProps<{ steps: Step[] }>()

const label = (s: Step) => (typeof s === 'string' ? s : s.label)
const kind = (s: Step) => (typeof s === 'string' ? undefined : s.kind)
</script>

<template>
  <div class="flex flex-wrap items-center gap-y-5 gap-x-2 text-lg leading-tight" data-testid="flow">
    <template v-for="(s, i) in steps" :key="i">
      <div
        class="px-4 py-3 rounded-lg border-2 text-center"
        :class="{
          'border-amber-500 bg-amber-500/15 font-bold': kind(s) === 'gate',
          'border-gray-400/50 op-60 italic': kind(s) === 'muted',
          'border-indigo-400/60 bg-indigo-500/10': !kind(s),
        }"
        v-html="label(s)"
      />
      <div v-if="i < steps.length - 1" class="text-2xl op-50">→</div>
    </template>
  </div>
</template>
