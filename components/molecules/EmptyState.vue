<template>
  <p class="text-lg text-slate-700">
    {{ message }}
  </p>
</template>

<script setup lang="ts">
import type { EmptyStateProps } from '~/interfaces/components/molecules/EmptyStateProps'

defineProps<EmptyStateProps>()
</script>
