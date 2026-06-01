<template>
  <div class="form-field">
    <label :for="id" class="form-label">
      {{ label }}
    </label>
    <div class="relative">
      <MagnifyingGlassIcon
        class="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-700 dark:text-slate-400"
        aria-hidden="true"
      />
      <input
        :id="id"
        ref="inputRef"
        v-model="searchValue"
        type="text"
        role="searchbox"
        class="form-input search-field-input w-full"
        autocomplete="off"
      >
      <button
        v-if="searchValue"
        type="button"
        class="search-field-clear"
        aria-label="Clear search"
        @click="clearSearch"
      >
        <XMarkIcon class="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import type {
  ServiceSearchFieldEmits,
  ServiceSearchFieldProps,
} from '~/interfaces/components/molecules/ServiceSearchFieldProps'

const props = withDefaults(defineProps<ServiceSearchFieldProps>(), {
  id: 'service-search',
  label: 'Search services',
})

const emit = defineEmits<ServiceSearchFieldEmits>()

const inputRef = ref<HTMLInputElement | null>(null)

const searchValue = computed({
  get: (): string => props.modelValue,
  set: (value: string): void => emit('update:modelValue', value),
})

const clearSearch = (): void => {
  searchValue.value = ''
  nextTick(() => {
    inputRef.value?.focus()
  })
}
</script>
