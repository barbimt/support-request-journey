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
    class="rounded-md border-2 border-red-800 bg-red-50 p-4"
    role="alert"
    tabindex="-1"
  >
    <h2 class="text-lg font-bold text-red-900">
      There is a problem
    </h2>
    <ul class="mt-2 list-disc space-y-1 pl-5 text-red-900">
      <li v-for="error in errors" :key="error.field">
        <a :href="`#${error.field}`" class="font-medium underline underline-offset-2">
          {{ error.message }}
        </a>
      </li>
    </ul>
  </div>
</template>
