<template>
  <PageContainer>
    <p class="mb-8">
      <BackLink to="/" text="Back to home" />
    </p>

    <div ref="resultsTop">
      <PageHeader
        heading-id="services-heading"
        title="Support services"
        intro="Search and filter services to find support that matches your situation."
      />

      <ServiceFilters
        v-model:search="search"
        v-model:category="category"
      />
    </div>

    <section aria-labelledby="services-results-heading">
      <h2 id="services-results-heading" class="sr-only">
        Service directory results
      </h2>

      <ServiceListLoadState
        :pending="isLoadingServices"
        :error="servicesLoadError"
        :has-data="hasServices"
        @retry="retryLoad"
      />

      <div
        v-if="showServiceResults"
        class="services-results"
      >
        <div
          id="services-results-grid"
          class="grid gap-6 md:grid-cols-2 md:gap-8"
        >
          <ServiceCard
            v-for="service in paginatedServices"
            :key="service.id"
            :service="service"
          />
        </div>

        <PaginationControls
          v-if="totalPages > 1"
          label="Support services pagination"
          :current-page="currentPage"
          :total-pages="totalPages"
          :range-start="rangeStart"
          :range-end="rangeEnd"
          :total-items="filteredServices.length"
          @previous="goToPreviousPage"
          @next="goToNextPage"
        />
      </div>

      <EmptyState
        v-else-if="showFilterEmptyState"
        message="No services match your search. Try a different keyword or category."
      />

      <EmptyState
        v-else-if="showDirectoryEmptyState"
        message="No services are listed in the directory yet."
      />
    </section>

    <aside
      class="theme-divider card-panel mt-10 w-full sm:mt-12"
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
        <BaseButton to="/manage/services" variant="secondary">
          Add a service to the directory
        </BaseButton>
      </div>
    </aside>
  </PageContainer>
</template>

<script setup lang="ts">
const resultsTop = ref<HTMLElement | null>(null)

const {
  search,
  category,
  filteredServices,
  paginatedServices,
  currentPage,
  totalPages,
  rangeStart,
  rangeEnd,
  goToPreviousPage,
  goToNextPage,
  isLoadingServices,
  servicesLoadError,
  hasServices,
  retryLoad,
} = useServiceList({ scrollTarget: resultsTop })

const showServiceResults = computed(
  () => !isLoadingServices.value && !servicesLoadError.value && filteredServices.value.length > 0,
)

const showFilterEmptyState = computed(
  () => !isLoadingServices.value && !servicesLoadError.value && hasServices.value && filteredServices.value.length === 0,
)

const showDirectoryEmptyState = computed(
  () => !isLoadingServices.value && !servicesLoadError.value && !hasServices.value,
)

useHead({ title: 'Support services' })
</script>
