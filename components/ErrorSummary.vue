<script setup lang="ts">
import type { ValidationError } from '~/types/supportRequest'

defineProps<{
  errors: ValidationError[]
}>()

const root = ref<HTMLElement | null>(null)

defineExpose({
  focus: () => root.value?.focus(),
})
</script>

<template>
  <div
    v-if="errors.length"
    ref="root"
    class="rounded-lg border-2 border-error-700 bg-error-50 p-5 sm:p-6"
    role="alert"
    tabindex="-1"
  >
    <div class="flex items-start gap-3">
      <svg class="mt-0.5 h-6 w-6 shrink-0 text-error-700" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
      </svg>
      <div>
        <h2 class="text-lg font-bold text-error-800">
          There is a problem
        </h2>
        <ul class="mt-3 list-disc space-y-2 pl-5">
          <li v-for="error in errors" :key="error.field" class="text-base text-error-800">
            <a
              :href="`#${error.field}`"
              class="font-semibold underline decoration-2 underline-offset-2 hover:text-error-700 focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
            >
              {{ error.message }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
