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

<script setup lang="ts">
import type { StatusMessageProps } from '~/interfaces/components/StatusMessageProps'

defineProps<StatusMessageProps>()
</script>
