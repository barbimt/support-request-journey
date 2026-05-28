<template>
  <div class="card-panel" role="status">
    <p class="text-base leading-relaxed text-slate-800 sm:text-lg">
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { EmptyStateProps } from '~/interfaces/components/molecules/EmptyStateProps'

defineProps<EmptyStateProps>()
</script>
