<template>
  <nav
    class="pagination"
    :aria-label="label"
  >
    <p class="body-text text-sm" role="status">
      Showing {{ rangeStart }}–{{ rangeEnd }} of {{ totalItems }}
    </p>

    <div class="pagination-controls">
      <BaseButton
        variant="secondary"
        size="compact"
        :disabled="currentPage <= 1"
        @click="emit('previous')"
      >
        Previous
      </BaseButton>

      <span class="pagination-current">
        Page {{ currentPage }} of {{ totalPages }}
      </span>

      <BaseButton
        variant="secondary"
        size="compact"
        :disabled="currentPage >= totalPages"
        @click="emit('next')"
      >
        Next
      </BaseButton>
    </div>
  </nav>
</template>

<script setup lang="ts">
import type {
  PaginationControlsEmits,
  PaginationControlsProps,
} from '~/interfaces/components/molecules/PaginationControlsProps'

withDefaults(defineProps<PaginationControlsProps>(), {
  label: 'Pagination',
})

const emit = defineEmits<PaginationControlsEmits>()
</script>
