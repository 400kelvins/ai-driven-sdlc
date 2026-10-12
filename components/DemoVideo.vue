<script setup lang="ts">
// Story 5 (spec 005): plays the bundled demo recording; shows a fallback if it is missing.
import { ref } from 'vue'

const props = withDefaults(defineProps<{ src?: string }>(), { src: '/demo/demo.mp4' })
const failed = ref(false)
</script>

<template>
  <div class="w-full flex justify-center">
    <video
      v-if="!failed"
      data-testid="demo-video"
      :src="props.src"
      controls
      preload="auto"
      playsinline
      class="max-h-[70vh] rounded shadow-lg"
      @error="failed = true"
    />
    <div
      v-else
      data-testid="demo-fallback"
      class="p-8 border-2 border-dashed rounded op-70 text-xl"
    >
      Recording not added yet — see <code>public/demo/README.md</code>
    </div>
  </div>
</template>
