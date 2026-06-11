<template>
  <BaseButton :to="to" variant="secondary">
    <ArrowLeftIcon class="h-5 w-5 shrink-0" aria-hidden="true" />
    {{ text }}
  </BaseButton>
</template>

<script setup lang="ts">
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'

defineProps<{ to: string, text: string }>()
</script>
