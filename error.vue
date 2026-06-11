<template>
  <NuxtLayout>
    <PageContainer>
      <article
        class="error-page error-page-card"
        :class="isNotFound ? 'error-page-card--not-found' : 'error-page-card--fault'"
        aria-labelledby="error-heading"
      >
        <header class="error-page-status">
          <LinkSlashIcon
            v-if="isNotFound"
            class="error-page-status-icon"
            aria-hidden="true"
          />
          <ExclamationTriangleIcon
            v-else
            class="error-page-status-icon"
            aria-hidden="true"
          />
          <div>
            <span class="error-page-status-code">{{ statusCode }}</span>
            <span class="error-page-status-label">{{ statusLabel }}</span>
          </div>
        </header>

        <div class="error-page-body">
          <h1 id="error-heading" class="page-title">
            {{ heading }}
          </h1>
          <p class="page-intro">
            {{ description }}
          </p>
        </div>

        <section class="error-page-next" aria-labelledby="error-help-heading">
          <h2 id="error-help-heading" class="section-heading text-lg">
            What you can do next
          </h2>
          <ul class="body-text mt-4 list-disc space-y-3 pl-6">
            <li v-for="step in helpSteps" :key="step">
              {{ step }}
            </li>
          </ul>
        </section>

        <div class="error-page-actions">
          <BaseButton variant="primary" @click="goHome">
            <ArrowLeftIcon class="h-5 w-5 shrink-0" aria-hidden="true" />
            Back to home
          </BaseButton>
          <BaseButton v-if="isNotFound" to="/services" variant="secondary">
            Browse support services
          </BaseButton>
          <BaseButton
            v-if="isNotFound"
            to="/request-support"
            variant="secondary"
          >
            Request support
          </BaseButton>
        </div>
      </article>
    </PageContainer>
  </NuxtLayout>
</template>

<script setup lang="ts">
import {
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  LinkSlashIcon,
} from '@heroicons/vue/24/outline'
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const statusCode = computed(() => props.error.statusCode ?? 500)
const isNotFound = computed(() => statusCode.value === 404)

const statusLabel = computed(() =>
  isNotFound.value ? 'Page not found' : 'Something went wrong',
)

const heading = computed(() =>
  isNotFound.value
    ? 'This page does not exist'
    : 'We could not load this page',
)

const description = computed(() => {
  if (isNotFound.value) {
    return 'The web address may be incorrect or the page may have been moved. You have not done anything wrong.'
  }
  return 'There was a problem loading this page. Please try again in a moment.'
})

const helpSteps = computed((): string[] => {
  if (isNotFound.value) {
    return [
      'Check the address in your browser for typing mistakes.',
      'Return to the home page and open the section you need from there.',
      'Browse support services or send a request if you need someone to contact you.',
    ]
  }
  return [
    'Return to the home page and try again.',
    'If it keeps happening, wait a few minutes and try once more.',
    'You can still browse services or request support from the home page.',
  ]
})

const goHome = (): void => {
  clearError({ redirect: '/' })
}

useHead({
  title: computed(() =>
    isNotFound.value ? 'Page not found' : 'Something went wrong',
  ),
})
</script>
