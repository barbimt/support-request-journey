<template>
  <AppContainer>
    <div class="form-page">
      <p class="mb-8">
        <BackLink to="/" text="Back to home" />
      </p>

      <div ref="pageTop">
        <PageHeader
          heading-id="manage-services-heading"
          title="Manage services"
          intro="Add a new support service to the directory. Fields marked as required must be filled in."
        />

        <ServiceSaveSuccessMessage
          v-if="lastCreatedService"
          :service-id="lastCreatedService.id"
          :service-title="lastCreatedService.title"
          mode="created"
        />
      </div>

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

      <section
        class="theme-divider mt-12 border-t pt-10"
        aria-labelledby="existing-services-heading"
      >
        <h2 id="existing-services-heading" class="text-xl font-bold sm:text-2xl">
          Existing services
        </h2>

        <ServiceListLoadState
          :pending="isLoadingServices"
          :error="servicesLoadError"
          :has-data="hasExistingServices"
          @retry="refreshExistingServices"
        />

        <template v-if="!isLoadingServices && !servicesLoadError && existingServices?.length">
          <p class="body-text mt-2">
            {{ existingServices.length }} {{ existingServices.length === 1 ? 'service' : 'services' }} currently listed.
          </p>

          <div class="manage-services-list mt-6">
          <ServiceSearchField
            id="existingServicesSearch"
            v-model="searchQuery"
          />

          <div
            v-if="deleteError"
            class="alert-error mt-6"
            role="alert"
            tabindex="-1"
          >
            <p class="text-base font-semibold leading-relaxed sm:text-lg">
              {{ deleteError }}
            </p>
          </div>

          <p
            v-if="searchQuery.trim() && !filteredExistingServices.length"
            class="body-text mt-6"
          >
            No services match your search.
          </p>

          <template v-else-if="filteredExistingServices.length">
            <div class="manage-services-table-wrap">
            <table
              id="existing-services-table"
              class="manage-services-table"
            >
              <thead>
                <tr>
                  <th scope="col">
                    Service
                  </th>
                  <th scope="col">
                    Category
                  </th>
                  <th scope="col">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <template
                  v-for="service in paginatedExistingServices"
                  :key="service.id"
                >
                  <tr>
                    <td>
                      <NuxtLink
                        :to="`/services/${service.id}`"
                        class="manage-services-table__title link-inline"
                      >
                        {{ service.title }}
                        <span class="sr-only">View details for {{ service.title }}</span>
                      </NuxtLink>
                    </td>
                    <td>
                      <CategoryBadge :category="service.category" />
                    </td>
                    <td>
                      <div class="manage-services-table__actions">
                        <AppButton
                          :to="`/manage/services/${service.id}`"
                          variant="secondary"
                          size="compact"
                        >
                          Edit
                        </AppButton>
                        <AppButton
                          v-show="confirmDeleteId !== service.id"
                          variant="danger"
                          size="compact"
                          :disabled="isDeleting"
                          @click="openDeleteConfirm(service.id, $event)"
                        >
                          Delete
                        </AppButton>
                      </div>
                    </td>
                  </tr>
                  <tr
                    v-if="confirmDeleteId === service.id"
                    class="manage-services-table__confirm"
                  >
                    <td colspan="3">
                      <div
                        ref="deleteDialogRef"
                        role="alertdialog"
                        aria-modal="true"
                        :aria-labelledby="`delete-heading-${service.id}`"
                        :aria-describedby="`delete-description-${service.id}`"
                      >
                        <p :id="`delete-heading-${service.id}`" class="font-semibold text-slate-950 dark:text-slate-50">
                          Delete this service?
                        </p>
                        <p :id="`delete-description-${service.id}`" class="body-text mt-2">
                          "{{ service.title }}" will be removed from the directory. This cannot be undone.
                        </p>
                        <div class="mt-4 flex flex-wrap gap-3">
                          <AppButton
                            variant="danger"
                            size="compact"
                            :disabled="isDeleting"
                            :aria-busy="isDeleting"
                            @click="handleDelete(service.id)"
                          >
                            {{ isDeleting ? 'Deleting…' : 'Yes, delete service' }}
                          </AppButton>
                          <AppButton
                            variant="secondary"
                            size="compact"
                            :disabled="isDeleting"
                            @click="closeDeleteConfirm()"
                          >
                            Cancel
                          </AppButton>
                        </div>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
            </div>

            <PaginationControls
              v-if="totalPages > 1"
              label="Existing services pagination"
              controls-id="existing-services-table"
              :current-page="currentPage"
              :total-pages="totalPages"
              :range-start="rangeStart"
              :range-end="rangeEnd"
              :total-items="filteredExistingServices.length"
              @previous="goToPreviousPage"
              @next="goToNextPage"
            />
          </template>
          </div>
        </template>

        <p v-else-if="!isLoadingServices && !servicesLoadError" class="body-text mt-2">
          No services listed yet.
        </p>
      </section>
    </div>
  </AppContainer>
</template>

<script setup lang="ts">
import { MANAGE_SERVICES_PAGE_SIZE } from '~/constants/serviceList'
import type { Service } from '~/interfaces/service'

const pageTop = ref<HTMLElement | null>(null)
const lastCreatedService = ref<Service | null>(null)

const { getServices, filterServices } = useServices()
const { deleteService } = useServiceManagement()
const {
  form,
  errors,
  isSubmitting,
  serverError,
  errorSummaryRef,
  serverErrorRef,
  errorFor,
  handleSubmit: submitServiceForm,
} = useServiceForm({ scrollTarget: pageTop })

const { data: existingServices, pending: isLoadingServices, refresh, error: servicesFetchError } = useAsyncData(
  'manage-services-list',
  () => getServices(),
  { default: () => [] as Service[] },
)

const hasExistingServices = computed(() => (existingServices.value?.length ?? 0) > 0)
const servicesLoadError = computed(() => Boolean(servicesFetchError.value) && !hasExistingServices.value)

const refreshExistingServices = async (): Promise<void> => {
  await refresh()
}

const searchQuery = ref('')
const confirmDeleteId = ref<string | null>(null)
const isDeleting = ref(false)
const deleteError = ref('')
const deleteDialogRef = ref<HTMLElement | null>(null)
const deleteTriggerRef = ref<HTMLElement | null>(null)

const openDeleteConfirm = (id: string, event: Event): void => {
  deleteTriggerRef.value = event.currentTarget as HTMLElement
  confirmDeleteId.value = id
}

const closeDeleteConfirm = (returnFocus = true): void => {
  const trigger = deleteTriggerRef.value
  confirmDeleteId.value = null

  if (returnFocus) {
    nextTick(() => {
      trigger?.focus()
    })
  }
}

const focusDeleteConfirmButton = (): void => {
  const confirmButton = document.querySelector<HTMLButtonElement>('[role="alertdialog"] button')
  confirmButton?.focus()
}

const onDeleteDialogKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape' && confirmDeleteId.value && !isDeleting.value) {
    event.preventDefault()
    closeDeleteConfirm()
  }
}

watch(confirmDeleteId, async (id) => {
  if (id) {
    document.addEventListener('keydown', onDeleteDialogKeydown)
    await nextTick()
    focusDeleteConfirmButton()
    return
  }

  document.removeEventListener('keydown', onDeleteDialogKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onDeleteDialogKeydown)
})

const filteredExistingServices = computed(() =>
  filterServices(existingServices.value ?? [], {
    search: searchQuery.value,
    category: 'all',
  }),
)

const {
  currentPage,
  totalPages,
  paginatedItems: paginatedExistingServices,
  rangeStart,
  rangeEnd,
  goToPreviousPage,
  goToNextPage,
  resetPage,
} = usePagination(filteredExistingServices, MANAGE_SERVICES_PAGE_SIZE)

watch(searchQuery, () => {
  closeDeleteConfirm(false)
  resetPage()
})

const handleSubmit = async (): Promise<void> => {
  lastCreatedService.value = null
  const service = await submitServiceForm()

  if (!service) {
    return
  }

  lastCreatedService.value = service

  if (!existingServices.value?.some((item) => item.id === service.id)) {
    existingServices.value = [...(existingServices.value ?? []), service]
      .sort((a, b) => a.title.localeCompare(b.title))
  }

  await refresh()
}

const handleDelete = async (id: string): Promise<void> => {
  deleteError.value = ''
  isDeleting.value = true

  try {
    const result = await deleteService(id)

    if (result.success) {
      closeDeleteConfirm(false)
      await refresh()
      return
    }

    if ('notFound' in result && result.notFound) {
      deleteError.value = 'That service could not be found. It may have already been removed.'
    } else if ('serverError' in result) {
      deleteError.value = result.serverError
    }

    closeDeleteConfirm(false)
    await refresh()
  } finally {
    isDeleting.value = false
  }
}

useHead({ title: 'Manage services' })
</script>
