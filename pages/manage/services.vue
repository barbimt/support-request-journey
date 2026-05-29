<template>
  <AppContainer>
    <div class="form-page">
      <PageHeader
        heading-id="manage-services-heading"
        title="Manage services"
        intro="Add a new support service to the directory. Fields marked as required must be filled in."
      />

      <StatusMessage
        v-if="submitSuccess"
        class="mb-8"
        :message="successMessage || 'The service has been created successfully.'"
      />

      <div
        v-if="serverError"
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

      <FormField id="title" label="Service title" :error="errorFor('title')" required>
        <template #default="{ describedBy, invalid }">
          <input
            id="title"
            v-model="form.title"
            type="text"
            class="form-input"
            :aria-describedby="describedBy"
            :aria-invalid="invalid"
          >
        </template>
      </FormField>

      <FormField id="category" label="Category" :error="errorFor('category')" required>
        <template #default="{ describedBy, invalid }">
          <select
            id="category"
            v-model="form.category"
            class="form-input"
            :aria-describedby="describedBy"
            :aria-invalid="invalid"
          >
            <option value="">
              Select a category
            </option>
            <option v-for="cat in ALL_CATEGORIES" :key="cat" :value="cat">
              {{ getCategoryLabel(cat) }}
            </option>
          </select>
        </template>
      </FormField>

      <FormField id="description" label="Description" :error="errorFor('description')" required>
        <template #default="{ describedBy, invalid }">
          <textarea
            id="description"
            v-model="form.description"
            rows="5"
            class="form-input min-h-[6rem]"
            :aria-describedby="describedBy"
            :aria-invalid="invalid"
          />
        </template>
      </FormField>

      <FormField
        id="eligibility"
        label="Eligibility"
        hint="Who can use this service?"
        :error="errorFor('eligibility')"
      >
        <template #default="{ describedBy, invalid }">
          <textarea
            id="eligibility"
            v-model="form.eligibility"
            rows="4"
            class="form-input min-h-[5rem]"
            :aria-describedby="describedBy"
            :aria-invalid="invalid"
          />
        </template>
      </FormField>

      <FormField id="contactEmail" label="Contact email" :error="errorFor('contactEmail')">
        <template #default="{ describedBy, invalid }">
          <input
            id="contactEmail"
            v-model="form.contactEmail"
            type="email"
            class="form-input"
            autocomplete="email"
            :aria-describedby="describedBy"
            :aria-invalid="invalid"
          >
        </template>
      </FormField>

      <FormField
        id="phone"
        label="Phone number"
        hint="Optional."
        :error="errorFor('phone')"
      >
        <template #default="{ describedBy, invalid }">
          <input
            id="phone"
            v-model="form.phone"
            type="tel"
            class="form-input"
            autocomplete="tel"
            :aria-describedby="describedBy"
            :aria-invalid="invalid"
          >
        </template>
      </FormField>

      <FormField
        id="openingHours"
        label="Opening hours"
        hint="For example: Monday to Friday, 9am to 5pm."
        :error="errorFor('openingHours')"
      >
        <template #default="{ describedBy, invalid }">
          <input
            id="openingHours"
            v-model="form.openingHours"
            type="text"
            class="form-input"
            :aria-describedby="describedBy"
            :aria-invalid="invalid"
          >
        </template>
      </FormField>

      <FormField
        id="accessibilityNotes"
        label="Accessibility notes"
        hint="Any information about physical access, communication support, or other adjustments."
        :error="errorFor('accessibilityNotes')"
      >
        <template #default="{ describedBy, invalid }">
          <textarea
            id="accessibilityNotes"
            v-model="form.accessibilityNotes"
            rows="4"
            class="form-input min-h-[5rem]"
            :aria-describedby="describedBy"
            :aria-invalid="invalid"
          />
        </template>
      </FormField>

      <FormField id="onlineSupport" label="Online support" :error="errorFor('onlineSupport')">
        <template #default="{ describedBy, invalid }">
          <div class="flex items-start gap-3">
            <input
              id="onlineSupport"
              v-model="form.onlineSupport"
              type="checkbox"
              class="form-choice mt-1"
              :aria-describedby="describedBy"
              :aria-invalid="invalid"
            >
            <label for="onlineSupport" class="body-text">
              This service can be accessed online or by phone.
            </label>
          </div>
        </template>
      </FormField>

      <div class="theme-divider border-t pt-8">
        <AppButton
          type="submit"
          variant="primary"
          :disabled="isSubmitting"
          :aria-busy="isSubmitting"
        >
          {{ isSubmitting ? 'Creating service…' : 'Create service' }}
        </AppButton>
      </div>
      </form>

      <section v-if="existingServices.length" class="theme-divider mt-12 border-t pt-10">
        <h2 class="text-xl font-bold sm:text-2xl">
          Existing services
        </h2>
        <p class="body-text mt-2">
          {{ existingServices.length }} {{ existingServices.length === 1 ? 'service' : 'services' }} currently listed.
        </p>
        <ul class="mt-6 space-y-3">
          <li v-for="service in existingServices" :key="service.id">
            <NuxtLink
              :to="`/services/${service.id}`"
              class="flex flex-wrap items-baseline justify-between gap-2 rounded-lg border border-stone-200 bg-white px-4 py-3 no-underline transition-colors hover:border-emerald-700/40 hover:bg-stone-50 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-amber-400 dark:border-stone-700 dark:bg-stone-900 dark:hover:border-emerald-500/40 dark:hover:bg-stone-800 dark:focus-visible:outline-amber-300"
            >
              <span class="font-medium text-slate-950 dark:text-slate-50">{{ service.title }}</span>
              <CategoryBadge :category="service.category" />
              <span class="sr-only">View details for {{ service.title }}</span>
            </NuxtLink>
          </li>
        </ul>
      </section>

      <p v-else-if="!isLoadingServices" class="body-text theme-divider mt-12 border-t pt-10">
        No services listed yet.
      </p>
    </div>
  </AppContainer>
</template>

<script setup lang="ts">
import { ALL_CATEGORIES, getCategoryLabel } from '~/utils/categories'

const { getServices } = useServices()
const {
  form,
  errors,
  isSubmitting,
  submitSuccess,
  successMessage,
  serverError,
  errorSummaryRef,
  errorFor,
  handleSubmit: submitServiceForm,
} = useServiceForm()

const { data: existingServices, pending: isLoadingServices, refresh } = await useAsyncData(
  'services',
  () => getServices(),
  { default: () => [] },
)

const handleSubmit = async (): Promise<void> => {
  const created = await submitServiceForm()

  if (created) {
    await refresh()
  }
}
</script>
