<template>
  <article class="card flex h-full flex-col">
    <CategoryBadge :category="service.category" wrapper-class="mb-3" />
    <h2 class="text-xl font-bold text-slate-900">
      {{ service.title }}
    </h2>
    <p class="mt-3 flex-1 text-slate-700">
      {{ service.description }}
    </p>
    <p class="mt-4">
      <NuxtLink
        :to="`/services/${service.id}`"
        class="font-semibold text-primary-800 underline decoration-primary-600 underline-offset-2 hover:text-primary-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
      >
        View service details<span class="sr-only"> for {{ service.title }}</span>
      </NuxtLink>
    </p>
  </article>
</template>

<script setup lang="ts">
import type { ServiceCardProps } from '~/interfaces/components/molecules/ServiceCardProps'

defineProps<ServiceCardProps>()
</script>
