<script setup lang="ts">
import type { Service } from '~/types/service'
import { getCategoryLabel } from '~/utils/categories'

defineProps<{
  service: Service
}>()
</script>

<template>
  <article class="card flex h-full flex-col transition-shadow hover:shadow-md">
    <p class="badge mb-4">
      {{ getCategoryLabel(service.category) }}
    </p>
    <h2 class="text-xl font-bold text-content">
      {{ service.title }}
    </h2>
    <p class="mt-3 flex-1 text-base leading-relaxed text-content-secondary">
      {{ service.description }}
    </p>
    <p class="mt-5">
      <NuxtLink
        :to="`/services/${service.id}`"
        class="inline-flex items-center gap-1 text-base font-semibold text-primary-700 underline decoration-2 underline-offset-2 transition-colors hover:text-primary-900 focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
      >
        View service details<span class="sr-only"> for {{ service.title }}</span>
        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      </NuxtLink>
    </p>
  </article>
</template>
