<script setup lang="ts">
import type { Service } from '~/types/service'
import { getCategoryLabel } from '~/utils/categories'

const route = useRoute()
const { getServiceById } = useServices()

const service = ref<Service | null>(null)

onMounted(async () => {
  service.value = await getServiceById(String(route.params.id))
})
</script>

<template>
  <div class="container-app">
    <div v-if="service">
      <p class="badge mb-4">
        {{ getCategoryLabel(service.category) }}
      </p>
      <h1 class="text-3xl font-bold text-slate-900">
        {{ service.title }}
      </h1>

      <section class="mt-8" aria-labelledby="description-heading">
        <h2 id="description-heading" class="text-2xl font-bold text-slate-900">
          Description
        </h2>
        <p class="mt-2 text-lg text-slate-700">
          {{ service.description }}
        </p>
      </section>

      <section class="mt-8" aria-labelledby="eligibility-heading">
        <h2 id="eligibility-heading" class="text-2xl font-bold text-slate-900">
          Eligibility
        </h2>
        <p class="mt-2 text-lg text-slate-700">
          {{ service.eligibility }}
        </p>
      </section>

      <section class="mt-8" aria-labelledby="contact-heading">
        <h2 id="contact-heading" class="text-2xl font-bold text-slate-900">
          Contact details
        </h2>
        <ul class="mt-2 list-none space-y-2 text-lg text-slate-700">
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
      </section>

      <section class="mt-8" aria-labelledby="hours-heading">
        <h2 id="hours-heading" class="text-2xl font-bold text-slate-900">
          Opening hours
        </h2>
        <p class="mt-2 text-lg text-slate-700">
          {{ service.openingHours }}
        </p>
      </section>

      <section class="mt-8" aria-labelledby="accessibility-heading">
        <h2 id="accessibility-heading" class="text-2xl font-bold text-slate-900">
          Accessibility notes
        </h2>
        <p class="mt-2 text-lg text-slate-700">
          {{ service.accessibilityNotes }}
        </p>
      </section>

      <p class="mt-10">
        <NuxtLink to="/request-support" class="btn-primary">
          Request support
        </NuxtLink>
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
        <NuxtLink to="/services" class="btn-secondary">
          Back to services
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
