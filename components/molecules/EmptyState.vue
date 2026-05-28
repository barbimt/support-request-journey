<template>
  <div class="card-panel" role="status">
    <p class="body-text">
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { EmptyStateProps } from '~/interfaces/components/molecules/EmptyStateProps'

defineProps<EmptyStateProps>()
</script>
