<template>
  <div
    v-if="errors.length"
    ref="root"
    class="alert-error"
    role="alert"
    tabindex="-1"
  >
    <ExclamationCircleIcon class="alert-error-icon" aria-hidden="true" />
    <div>
      <h2 class="text-lg font-bold sm:text-xl">
        There is a problem
      </h2>
      <p class="mt-2 text-base leading-relaxed">
        Please check the following {{ errors.length === 1 ? 'item' : 'items' }} before continuing.
      </p>
      <ul class="mt-4 list-disc space-y-2 pl-6 text-base leading-relaxed">
        <li v-for="error in errors" :key="error.field">
          <a :href="`#${error.field}`" class="font-semibold underline underline-offset-2 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-amber-400 dark:focus-visible:outline-amber-300">
            {{ error.message }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ExclamationCircleIcon } from '@heroicons/vue/24/outline'
import type { ErrorSummaryProps } from '~/interfaces/components/molecules/ErrorSummaryProps'

defineProps<ErrorSummaryProps>()

const root = ref<HTMLElement | null>(null)

defineExpose({
  focus: (): void => root.value?.focus(),
})
</script>
