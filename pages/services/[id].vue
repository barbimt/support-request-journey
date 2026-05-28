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
    <div v-if="service" class="max-w-3xl">
      <p class="badge mb-5">
        {{ getCategoryLabel(service.category) }}
      </p>
      <h1 class="text-3xl font-bold leading-tight text-ink">
        {{ service.title }}
      </h1>

      <section class="mt-10" aria-labelledby="description-heading">
        <h2 id="description-heading" class="text-xl font-bold text-ink">
          Description
        </h2>
        <p class="mt-3 text-base leading-relaxed text-ink-secondary">
          {{ service.description }}
        </p>
      </section>

      <section class="mt-10" aria-labelledby="eligibility-heading">
        <h2 id="eligibility-heading" class="text-xl font-bold text-ink">
          Eligibility
        </h2>
        <p class="mt-3 text-base leading-relaxed text-ink-secondary">
          {{ service.eligibility }}
        </p>
      </section>

      <section class="mt-10" aria-labelledby="contact-heading">
        <h2 id="contact-heading" class="text-xl font-bold text-ink">
          Contact details
        </h2>
        <ul class="mt-3 list-none space-y-3 text-base text-ink-secondary">
          <li class="flex flex-wrap items-baseline gap-x-2">
            <span class="font-semibold text-ink">Email:</span>
            <a
              :href="`mailto:${service.contactEmail}`"
              class="text-primary-700 underline decoration-2 underline-offset-2 hover:text-primary-900 focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
            >
              {{ service.contactEmail }}
            </a>
          </li>
          <li class="flex flex-wrap items-baseline gap-x-2">
            <span class="font-semibold text-ink">Phone:</span>
            <a
              :href="`tel:${service.phone.replace(/\s/g, '')}`"
              class="text-primary-700 underline decoration-2 underline-offset-2 hover:text-primary-900 focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
            >
              {{ service.phone }}
            </a>
          </li>
          <li class="flex flex-wrap items-baseline gap-x-2">
            <span class="font-semibold text-ink">Online support:</span>
            <span>{{ service.onlineSupport ? 'Available' : 'Not available' }}</span>
          </li>
        </ul>
      </section>

      <section class="mt-10" aria-labelledby="hours-heading">
        <h2 id="hours-heading" class="text-xl font-bold text-ink">
          Opening hours
        </h2>
        <p class="mt-3 text-base leading-relaxed text-ink-secondary">
          {{ service.openingHours }}
        </p>
      </section>

      <section class="mt-10" aria-labelledby="accessibility-heading">
        <h2 id="accessibility-heading" class="text-xl font-bold text-ink">
          Accessibility notes
        </h2>
        <p class="mt-3 text-base leading-relaxed text-ink-secondary">
          {{ service.accessibilityNotes }}
        </p>
      </section>

      <p class="mt-12">
        <NuxtLink to="/request-support" class="btn-primary">
          Request support
        </NuxtLink>
      </p>
    </div>

    <div v-else class="max-w-3xl">
      <h1 class="text-3xl font-bold text-ink">
        Service not found
      </h1>
      <p class="mt-4 text-lg text-ink-secondary">
        We could not find a service with that reference.
      </p>
      <p class="mt-8">
        <NuxtLink to="/services" class="btn-secondary">
          Back to services
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
