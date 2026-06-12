<template>
  <header :class="sectionClass" :aria-labelledby="headingId">
    <h1 :id="headingId" :class="titleClass">
      {{ title }}
    </h1>
    <p v-if="intro" class="page-intro">
      {{ intro }}
    </p>
    <slot />
  </header>
</template>

<script setup lang="ts">
import type { PageHeaderProps } from '~/interfaces/components/molecules/PageHeaderProps'

withDefaults(defineProps<PageHeaderProps>(), {
  sectionClass: 'mb-8 sm:mb-10',
  titleClass: 'page-title',
})
</script>
