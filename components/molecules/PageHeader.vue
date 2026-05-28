<template>
  <component :is="tag" :class="sectionClass" :aria-labelledby="headingId">
    <h1 :id="headingId" :class="titleClass">
      {{ title }}
    </h1>
    <p v-if="intro" class="mt-2 max-w-3xl text-lg text-slate-700">
      {{ intro }}
    </p>
    <slot />
  </component>
</template>

<script setup lang="ts">
import type { PageHeaderProps } from '~/interfaces/components/molecules/PageHeaderProps'

withDefaults(defineProps<PageHeaderProps>(), {
  tag: 'header',
  sectionClass: 'mb-8',
  titleClass: 'text-3xl font-bold text-slate-900',
})
</script>
