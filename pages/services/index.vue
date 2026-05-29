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

    <aside
      class="theme-divider card-panel mt-10 max-w-2xl sm:mt-12"
      aria-labelledby="service-providers-heading"
    >
      <p class="text-sm font-semibold uppercase tracking-wide text-stone-600 dark:text-slate-400">
        Service providers
      </p>
      <h2 id="service-providers-heading" class="section-heading mt-2 text-lg sm:text-xl">
        Add your organisation to this directory
      </h2>
      <p class="body-text mt-3">
        This section is for teams and organisations that offer support locally. If you run a service, you can publish it here for people to find.
      </p>
      <div class="mt-6">
        <AppButton to="/manage/services" variant="secondary">
          Add a service to the directory
        </AppButton>
      </div>
    </aside>
  </AppContainer>
</template>

<script setup lang="ts">
const { search, category, filteredServices } = useServiceList()
</script>
