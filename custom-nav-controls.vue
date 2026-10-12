<script setup lang="ts">
// Presenter-only time of day (spec 003, FR-002). Slidev renders this in the presenter bar.
import { onBeforeUnmount, ref } from 'vue'
import { useNav } from '@slidev/client'

const { isPresenter } = useNav()
const now = ref(new Date())
const tick = setInterval(() => (now.value = new Date()), 1000)
onBeforeUnmount(() => clearInterval(tick))

const fmt = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' })
</script>

<template>
  <div
    v-if="isPresenter"
    data-testid="presenter-clock"
    class="flex items-center px-3 text-xl font-mono op-80 select-none"
    title="Current time"
  >
    <div class="i-carbon:time mr-2" />
    {{ fmt.format(now) }}
  </div>
</template>
