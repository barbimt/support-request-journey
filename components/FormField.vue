<template>
  <div class="form-field">
    <label :for="id" class="form-label">
      {{ label }}
      <span v-if="required" class="text-red-800"> (required)</span>
    </label>
    <p v-if="hint" :id="`${id}-hint`" class="form-hint">
      {{ hint }}
    </p>
    <slot :described-by="describedBy" :invalid="!!error" />
    <p v-if="error" :id="`${id}-error`" class="form-error">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { FormFieldProps } from '~/interfaces/components/FormFieldProps'

const props = defineProps<FormFieldProps>()

const describedBy = computed((): string | undefined => {
  const ids: string[] = []
  if (props.hint) {
    ids.push(`${props.id}-hint`)
  }
  if (props.error) {
    ids.push(`${props.id}-error`)
  }
  return ids.length ? ids.join(' ') : undefined
})
</script>
