<template>
  <div
    class="alert-success"
    role="status"
    aria-live="polite"
  >
    <CheckCircleIcon class="alert-success-icon" aria-hidden="true" />
    <p class="text-base font-semibold leading-relaxed sm:text-lg">
      <slot>{{ message }}</slot>
    </p>
  </div>
</template>

<script setup lang="ts">
import { CheckCircleIcon } from '@heroicons/vue/24/outline'
import type { StatusMessageProps } from '~/interfaces/components/atoms/StatusMessageProps'

defineProps<StatusMessageProps>()
</script>
