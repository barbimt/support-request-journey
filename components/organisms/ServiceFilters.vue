<template>
  <section aria-labelledby="service-filters-heading" class="card-panel mb-8 sm:mb-10">
    <h2 id="service-filters-heading" class="sr-only">
      Filter support services
    </h2>
    <div class="flex flex-col gap-6">
      <div class="form-field">
        <label for="service-search" class="form-label">Search services</label>
        <input
          id="service-search"
          type="search"
          class="form-input"
          :value="search"
          autocomplete="off"
          @input="emit('update:search', ($event.target as HTMLInputElement).value)"
        >
      </div>
      <div class="form-field">
        <label for="service-category" class="form-label">Filter by category</label>
        <select
          id="service-category"
          class="form-input"
          :value="category"
          @change="emit('update:category', ($event.target as HTMLSelectElement).value as ServiceCategory | '' | 'all')"
        >
          <option value="all">
            All categories
          </option>
          <option v-for="cat in ALL_CATEGORIES" :key="cat" :value="cat">
            {{ getCategoryLabel(cat) }}
          </option>
        </select>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ServiceCategory } from '~/interfaces/service'
import type { ServiceFiltersEmits, ServiceFiltersProps } from '~/interfaces/components/organisms/ServiceFiltersProps'
import { ALL_CATEGORIES, getCategoryLabel } from '~/utils/categories'

defineProps<ServiceFiltersProps>()

const emit = defineEmits<ServiceFiltersEmits>()
</script>
