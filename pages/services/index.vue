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
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-slate-900">
        Support services
      </h1>
      <p class="mt-2 max-w-3xl text-lg text-slate-700">
        Search and filter services to find support that matches your situation.
      </p>
    </header>

    <ServiceFilters
      v-model:search="search"
      v-model:category="category"
      class="mb-8"
    />

    <div v-if="filteredServices.length" class="grid gap-6 sm:grid-cols-2">
      <ServiceCard
        v-for="service in filteredServices"
        :key="service.id"
        :service="service"
      />
    </div>
    <p v-else class="text-lg text-slate-700">
      No services match your search. Try a different keyword or category.
    </p>
  </div>
</template>
