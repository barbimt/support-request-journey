<template>
  <AppContainer>
    <PageHeader
      heading-id="services-heading"
      title="Support services"
      intro="Search and filter services to find support that matches your situation."
    />

    <p class="body-text mb-8 max-w-2xl">
      <NuxtLink
        to="/manage/services"
        class="font-semibold text-emerald-800 underline underline-offset-2 hover:text-emerald-900 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-amber-400 dark:text-emerald-300 dark:hover:text-emerald-200 dark:focus-visible:outline-amber-300"
      >
        Manage services
      </NuxtLink>
      — add a new service to the directory.
    </p>

    <ServiceFilters
      v-model:search="search"
      v-model:category="category"
    />

    <div v-if="filteredServices.length" class="grid gap-6 md:grid-cols-2 md:gap-8">
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
