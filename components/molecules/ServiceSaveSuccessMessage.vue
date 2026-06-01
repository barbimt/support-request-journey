<template>
  <StatusMessage class="mb-8">
    "{{ serviceTitle }}" has been {{ actionLabel }}.
    <NuxtLink
      :to="`/services/${serviceId}`"
      class="link-inline ml-1"
    >
      View service details
    </NuxtLink>
  </StatusMessage>
</template>

<script setup lang="ts">
import type { ServiceSaveSuccessMessageProps } from '~/interfaces/components/molecules/ServiceSaveSuccessMessageProps'

const props = defineProps<ServiceSaveSuccessMessageProps>()

const actionLabel = computed(() =>
  props.mode === 'created' ? 'added' : 'updated',
)
</script>
