<script setup lang="ts">
defineProps<{
  message: string
}>()
</script>

<template>
  <div
    class="rounded-md border-2 border-primary-700 bg-primary-50 p-4 text-primary-900"
    role="status"
    aria-live="polite"
  >
    <p class="font-semibold">
      {{ message }}
    </p>
  </div>
</template>
