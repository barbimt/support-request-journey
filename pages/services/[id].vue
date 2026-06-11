<template>
  <PageContainer>
    <div v-if="service">
      <p class="mb-8">
        <BackLink to="/" text="Back to home" />
      </p>

      <article>
        <CategoryBadge :category="service.category" wrapper-class="mb-4" />
        <h1 class="page-title">
          {{ service.title }}
        </h1>

        <ContentSection title="Description" heading-id="description-heading">
          <p class="body-text">
            {{ service.description }}
          </p>
        </ContentSection>

        <ContentSection
          v-if="service.eligibility.trim()"
          title="Eligibility"
          heading-id="eligibility-heading"
        >
          <p class="body-text">
            {{ service.eligibility }}
          </p>
        </ContentSection>

        <ContentSection title="Contact details" heading-id="contact-heading">
          <ul class="list-none space-y-4">
            <li v-if="service.contactEmail.trim()" class="body-text">
              <span class="text-strong">Email:</span>
              <a
                :href="`mailto:${service.contactEmail}`"
                class="link-inline ml-1"
              >
                {{ service.contactEmail }}
              </a>
            </li>
            <li v-if="service.phone.trim()" class="body-text">
              <span class="text-strong">Phone:</span>
              <a
                :href="`tel:${service.phone.replace(/\s/g, '')}`"
                class="link-inline ml-1"
              >
                {{ service.phone }}
              </a>
            </li>
            <li class="body-text">
              <span class="text-strong">Online support:</span>
              {{ service.onlineSupport ? 'Available' : 'Not available' }}
            </li>
          </ul>
        </ContentSection>

        <ContentSection
          v-if="service.openingHours.trim()"
          title="Opening hours"
          heading-id="hours-heading"
        >
          <p class="body-text">
            {{ service.openingHours }}
          </p>
        </ContentSection>

        <ContentSection
          v-if="service.accessibilityNotes.trim()"
          title="Accessibility notes"
          heading-id="accessibility-heading"
        >
          <p class="body-text">
            {{ service.accessibilityNotes }}
          </p>
        </ContentSection>

        <p class="theme-divider mt-10 flex flex-wrap gap-4 border-t pt-8 sm:mt-12 sm:pt-10">
          <BaseButton to="/request-support" variant="primary">
            Request support
          </BaseButton>
          <BaseButton :to="`/manage/services/${service.id}`" variant="secondary">
            Edit service
          </BaseButton>
        </p>
      </article>
    </div>

    <div v-else>
      <h1 class="page-title">
        Service not found
      </h1>
      <p class="mt-4 body-text">
        We could not find a service with that reference.
      </p>
      <p class="mt-8 flex flex-wrap gap-4">
        <BackLink to="/" text="Back to home" />
        <BaseButton to="/services" variant="secondary">
          Back to services
        </BaseButton>
      </p>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
const route = useRoute()
const { getServiceById } = useServices()

const { data: service } = await useAsyncData(
  () => `service-${route.params.id}`,
  () => getServiceById(String(route.params.id)),
  { default: () => null },
)

useHead({
  title: computed(() => service.value?.title ?? 'Service not found'),
})
</script>
