<template>
  <article class="card-interactive flex h-full flex-col">
    <CategoryBadge :category="service.category" wrapper-class="mb-4" />
    <h2 class="section-heading text-xl">
      {{ service.title }}
    </h2>
    <p class="body-text mt-4 flex-1">
      {{ service.description }}
    </p>
    <p class="mt-6">
      <NuxtLink
        :to="`/services/${service.id}`"
        class="link-inline"
      >
        View service details
        <ArrowRightIcon class="h-4 w-4" aria-hidden="true" />
        <span class="sr-only"> for {{ service.title }}</span>
      </NuxtLink>
    </p>
  </article>
</template>

<script setup lang="ts">
import { ArrowRightIcon } from '@heroicons/vue/24/outline'
import type { ServiceCardProps } from '~/interfaces/components/molecules/ServiceCardProps'

defineProps<ServiceCardProps>()
</script>
