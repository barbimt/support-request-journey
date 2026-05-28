<script setup lang="ts">
import type { ServiceCategory } from '~/types/service'
import type { Service } from '~/types/service'

const { getServices, filterServices } = useServices()

const search = ref('')
const category = ref<ServiceCategory | '' | 'all'>('all')
const services = ref<Service[]>([])

onMounted(async () => {
  services.value = await getServices()
})

const filteredServices = computed(() =>
  filterServices(services.value, {
    search: search.value,
    category: category.value,
  }),
)
</script>

<template>
  <div class="container-app">
    <header class="mb-10">
      <h1 class="text-3xl font-bold leading-tight text-ink">
        Support services
      </h1>
      <p class="mt-3 max-w-2xl text-lg leading-relaxed text-ink-secondary">
        Search and filter services to find support that matches your situation.
      </p>
    </header>

    <ServiceFilters
      v-model:search="search"
      v-model:category="category"
      class="mb-10"
    />

    <div v-if="filteredServices.length" class="grid gap-6 sm:grid-cols-2">
      <ServiceCard
        v-for="service in filteredServices"
        :key="service.id"
        :service="service"
      />
    </div>
    <div v-else class="rounded-lg border-2 border-surface-border bg-surface-elevated p-6 text-center">
      <p class="text-lg text-ink-secondary">
        No services match your search. Try a different keyword or category.
      </p>
    </div>
  </div>
</template>
