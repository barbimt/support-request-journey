<template>
  <AppContainer>
    <PageHeader
      heading-id="services-heading"
      title="Support services"
      intro="Search and filter services to find support that matches your situation."
    />

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
    <EmptyState
      v-else
      message="No services match your search. Try a different keyword or category."
    />
  </AppContainer>
</template>

<script setup lang="ts">
const { search, category, filteredServices } = useServiceList()
</script>
