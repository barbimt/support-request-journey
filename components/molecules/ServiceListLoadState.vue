<template>
  <div
    class="service-list-load-state"
    aria-live="polite"
    :aria-busy="showLoading ? 'true' : undefined"
  >
    <p
      v-if="showLoading"
      class="body-text mt-2"
    >
      Loading services…
    </p>

    <div
      v-else-if="showError"
      class="alert-error mt-2"
      role="alert"
    >
    <p class="text-base font-semibold leading-relaxed sm:text-lg">
      We could not load services right now.
    </p>
    <p class="body-text mt-2">
      The directory may take up to a minute to wake up on the first visit. Please try again in a moment.
    </p>
    <BaseButton
      class="mt-4"
      variant="secondary"
      @click="emit('retry')"
    >
      Try again
    </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  ServiceListLoadStateEmits,
  ServiceListLoadStateProps,
} from '~/interfaces/components/molecules/ServiceListLoadStateProps'

const props = defineProps<ServiceListLoadStateProps>()
const emit = defineEmits<ServiceListLoadStateEmits>()

const showLoading = computed(() => props.pending && !props.hasData)
const showError = computed(() => props.error && !props.hasData)
</script>
