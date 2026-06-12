<template>
  <PageContainer>
    <div v-if="service" class="form-page">
      <div ref="pageTop">
        <PageHeader
          heading-id="edit-service-heading"
          title="Edit service"
          :intro="`Update details for “${service.title}”. Fields marked as required must be filled in.`"
        />

        <ServiceSaveSuccessMessage
          v-if="submitSuccess && savedServiceId"
          :service-id="savedServiceId"
          :service-title="savedServiceTitle"
          mode="updated"
        />
      </div>

      <p class="mb-8">
        <BackLink to="/manage/services" text="Back to manage services" />
      </p>

      <div
        v-if="serverError"
        ref="serverErrorRef"
        class="alert-error mb-8"
        role="alert"
        tabindex="-1"
      >
        <p class="text-base font-semibold leading-relaxed sm:text-lg">
          {{ serverError }}
        </p>
      </div>

      <form novalidate class="space-y-8" @submit.prevent="handleSubmit">
        <ErrorSummary
          v-if="errors.length"
          ref="errorSummaryRef"
          :errors="errors"
        />

        <ServiceFormFields :form="form" :error-for="errorFor" />

        <div class="theme-divider border-t pt-8">
          <BaseButton
            type="submit"
            variant="primary"
            :disabled="isSubmitting"
            :aria-busy="isSubmitting"
          >
            {{ isSubmitting ? 'Saving changes…' : 'Save changes' }}
          </BaseButton>
        </div>
      </form>
    </div>

    <div v-else class="form-page">
      <h1 class="page-title">
        Service not found
      </h1>
      <p class="mt-4 body-text">
        We could not find a service with that reference.
      </p>
      <p class="mt-8">
        <BackLink to="/manage/services" text="Back to manage services" />
      </p>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import type { Service } from '~/interfaces/service'
import { mapServiceToForm } from '~/utils/apiMappers'

definePageMeta({
  key: (route) => route.fullPath,
})

const route = useRoute()
const serviceId = String(route.params.id)
const pageTop = ref<HTMLElement | null>(null)

const { data: service } = await useAsyncData(
  () => `manage-service-${serviceId}`,
  () => $fetch<Service>(`/api/services/${serviceId}`).catch(() => null),
  { default: () => null },
)

const {
  form,
  errors,
  isSubmitting,
  submitSuccess,
  savedServiceId,
  savedServiceTitle,
  serverError,
  errorSummaryRef,
  serverErrorRef,
  errorFor,
  handleSubmit: submitServiceForm,
} = useServiceForm(
  service.value
    ? {
        serviceId,
        initial: mapServiceToForm(service.value),
        scrollTarget: pageTop,
      }
    : { serviceId, scrollTarget: pageTop },
)

const handleSubmit = async (): Promise<void> => {
  await submitServiceForm()
}

useHead({
  title: computed(() =>
    service.value ? `Edit ${service.value.title}` : 'Service not found',
  ),
})
</script>
