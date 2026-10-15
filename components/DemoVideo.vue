<script setup lang="ts">
// Story 5 (spec 005): plays the bundled demo recording; shows a fallback if it cannot play.
import { ref } from 'vue'

const props = withDefaults(defineProps<{ src?: string }>(), { src: '/demo/demo.mp4' })
const failed = ref(false)
</script>

<template>
  <!-- Sized by the slide, not the viewport: Slidev scales the slide, so vh units overflow it -->
  <div class="w-full h-full min-h-0 flex justify-center">
    <video
      v-if="!failed"
      data-testid="demo-video"
      :src="props.src"
      controls
      preload="metadata"
      playsinline
      class="h-full max-w-full object-contain rounded shadow-lg"
      @error="failed = true"
    />
    <div
      v-else
      data-testid="demo-fallback"
      class="p-8 border-2 border-dashed rounded op-70 text-xl"
    >
      Demo video unavailable
    </div>
  </div>
</template>
