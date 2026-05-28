<template>
  <div class="grid gap-4 sm:grid-cols-2">
    <div>
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
    <div>
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
</template>

<script setup lang="ts">
import type { ServiceCategory } from '~/interfaces/service'
import type { ServiceFiltersEmits, ServiceFiltersProps } from '~/interfaces/components/ServiceFiltersProps'
import { ALL_CATEGORIES, getCategoryLabel } from '~/utils/categories'

defineProps<ServiceFiltersProps>()

const emit = defineEmits<ServiceFiltersEmits>()
</script>
