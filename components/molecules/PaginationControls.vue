<template>
  <nav
    class="pagination"
    :aria-label="label"
  >
    <p
      :id="statusId"
      class="body-text text-sm"
    >
      Showing {{ rangeStart }}–{{ rangeEnd }} of {{ totalItems }}
    </p>

    <div class="pagination-controls">
      <AppButton
        variant="secondary"
        size="compact"
        :disabled="currentPage <= 1"
        :aria-controls="controlsId"
        :aria-describedby="statusId"
        @click="emit('previous')"
      >
        Previous
      </AppButton>

      <span
        class="pagination-current"
        aria-current="page"
      >
        Page {{ currentPage }} of {{ totalPages }}
      </span>

      <AppButton
        variant="secondary"
        size="compact"
        :disabled="currentPage >= totalPages"
        :aria-controls="controlsId"
        :aria-describedby="statusId"
        @click="emit('next')"
      >
        Next
      </AppButton>
    </div>
  </nav>
</template>

<script setup lang="ts">
import type {
  PaginationControlsEmits,
  PaginationControlsProps,
} from '~/interfaces/components/molecules/PaginationControlsProps'

const props = withDefaults(defineProps<PaginationControlsProps>(), {
  label: 'Pagination',
})

const emit = defineEmits<PaginationControlsEmits>()

const statusId = computed(() => `pagination-status-${props.currentPage}-${props.totalPages}`)
</script>
