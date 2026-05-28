<template>
  <AppContainer>
    <div v-if="service">
      <CategoryBadge :category="service.category" wrapper-class="mb-4" />
      <h1 class="text-3xl font-bold text-slate-900">
        {{ service.title }}
      </h1>

      <ContentSection title="Description" heading-id="description-heading">
        <p class="text-lg text-slate-700">
          {{ service.description }}
        </p>
      </ContentSection>

      <ContentSection title="Eligibility" heading-id="eligibility-heading">
        <p class="text-lg text-slate-700">
          {{ service.eligibility }}
        </p>
      </ContentSection>

      <ContentSection title="Contact details" heading-id="contact-heading">
        <ul class="list-none space-y-2 text-lg text-slate-700">
          <li>
            <span class="font-semibold">Email:</span>
            <a :href="`mailto:${service.contactEmail}`" class="ml-1 text-primary-800 underline">{{ service.contactEmail }}</a>
          </li>
          <li>
            <span class="font-semibold">Phone:</span>
            <a :href="`tel:${service.phone.replace(/\s/g, '')}`" class="ml-1 text-primary-800 underline">{{ service.phone }}</a>
          </li>
          <li>
            <span class="font-semibold">Online support:</span>
            {{ service.onlineSupport ? 'Available' : 'Not available' }}
          </li>
        </ul>
      </ContentSection>

      <ContentSection title="Opening hours" heading-id="hours-heading">
        <p class="text-lg text-slate-700">
          {{ service.openingHours }}
        </p>
      </ContentSection>

      <ContentSection title="Accessibility notes" heading-id="accessibility-heading">
        <p class="text-lg text-slate-700">
          {{ service.accessibilityNotes }}
        </p>
      </ContentSection>

      <p class="mt-10">
        <AppButton to="/request-support" variant="primary">
          Request support
        </AppButton>
      </p>
    </div>

    <div v-else>
      <h1 class="text-3xl font-bold text-slate-900">
        Service not found
      </h1>
      <p class="mt-4 text-lg text-slate-700">
        We could not find a service with that reference.
      </p>
      <p class="mt-6">
        <AppButton to="/services" variant="secondary">
          Back to services
        </AppButton>
      </p>
    </div>
  </AppContainer>
</template>

<script setup lang="ts">
import type { Service } from '~/interfaces/service'

const route = useRoute()
const { getServiceById } = useServices()

const service = ref<Service | null>(null)

onMounted(async () => {
  service.value = await getServiceById(String(route.params.id))
})
</script>
