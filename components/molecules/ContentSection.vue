<template>
  <section
    :class="sectionClass"
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

const props = withDefaults(defineProps<ContentSectionProps>(), {
  panel: false,
  divider: true,
})

const sectionClass = computed(() => {
  if (props.panel) {
    return 'info-panel'
  }

  if (!props.divider) {
    return ''
  }

  return 'theme-divider mt-8 border-t pt-8 first:mt-0 first:border-t-0 first:pt-0 sm:mt-10 sm:pt-10'
})
</script>
