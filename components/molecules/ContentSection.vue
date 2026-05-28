<template>
  <section
    :class="panel ? 'info-panel' : 'theme-divider mt-8 border-t pt-8 first:mt-0 first:border-t-0 first:pt-0 sm:mt-10 sm:pt-10'"
    :aria-labelledby="headingId"
  >
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

withDefaults(defineProps<ContentSectionProps>(), {
  panel: false,
})
</script>
