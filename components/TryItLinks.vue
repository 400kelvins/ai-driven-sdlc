<script setup lang="ts">
// The two QR codes for "Try It Yourself": shown at the start (slide 2) and at the end of the deck.
</script>

<template>
  <div class="grid grid-cols-2 gap-20 mt-8">
    <div class="flex flex-col items-center">
      <img src="/qr/deck.svg" data-testid="qr-deck" alt="QR code: live deck" class="h-56 w-56 bg-white rounded-lg p-1" />
      <div class="text-xl font-bold mt-4">Live deck</div>
      <div class="text-sm op-70">ai-driven-sdlc.vercel.app</div>
    </div>
    <div class="flex flex-col items-center">
      <img src="/qr/repo.svg" data-testid="qr-repo" alt="QR code: blueprint repository" class="h-56 w-56 bg-white rounded-lg p-1" />
      <div class="text-xl font-bold mt-4">Blueprint repo</div>
      <div class="text-sm op-70">github.com/400kelvins/ai-driven-sdlc</div>
    </div>
  </div>
</template>
