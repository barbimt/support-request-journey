<template>
  <section :aria-labelledby="headingId">
    <h2 :id="headingId" class="section-heading">
      {{ title }}
    </h2>
    <div class="mt-4">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ContentSectionProps } from '~/interfaces/components/molecules/ContentSectionProps'

defineProps<ContentSectionProps>()
</script>
