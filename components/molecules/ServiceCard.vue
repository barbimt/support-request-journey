<template>
  <article class="card flex h-full flex-col">
    <CategoryBadge :category="service.category" wrapper-class="mb-4" />
    <h2 class="text-xl font-bold leading-tight text-slate-950">
      {{ service.title }}
    </h2>
    <p class="mt-4 flex-1 text-base leading-relaxed text-slate-800">
      {{ service.description }}
    </p>
    <p class="mt-6">
      <NuxtLink
        :to="`/services/${service.id}`"
        class="link-inline"
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
