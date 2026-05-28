<script setup lang="ts">
defineProps<{
  message: string
}>()
</script>

<template>
  <div
    class="rounded-lg border-2 border-success-600 bg-success-50 p-5 sm:p-6"
    role="status"
    aria-live="polite"
  >
    <div class="flex items-start gap-3">
      <svg class="mt-0.5 h-6 w-6 shrink-0 text-success-700" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
      </svg>
      <p class="text-base font-semibold text-success-800">
        {{ message }}
      </p>
    </div>
  </div>
</template>
