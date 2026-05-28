<template>
  <div
    class="alert-success"
    role="status"
    aria-live="polite"
  >
    <p class="text-base font-semibold leading-relaxed text-green-900 sm:text-lg">
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { StatusMessageProps } from '~/interfaces/components/atoms/StatusMessageProps'

defineProps<StatusMessageProps>()
</script>
