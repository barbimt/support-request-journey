<template>
  <section class="mt-8" :aria-labelledby="headingId">
    <h2 :id="headingId" class="text-2xl font-bold text-slate-900">
      {{ title }}
    </h2>
    <slot />
  </section>
</template>

<script setup lang="ts">
import type { ContentSectionProps } from '~/interfaces/components/ContentSectionProps'

defineProps<ContentSectionProps>()
</script>
