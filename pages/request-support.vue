<script setup lang="ts">
import type { SupportRequestForm, ValidationError } from '~/types/supportRequest'
import { ALL_CATEGORIES, getCategoryLabel } from '~/utils/categories'
import { validateSupportRequest } from '~/utils/validateSupportRequest'

const { submitSupportRequest } = useSupportRequest()

const form = reactive<SupportRequestForm>({
  fullName: '',
  email: '',
  phone: '',
  supportFor: '',
  supportType: '',
  preferredContact: '',
  message: '',
  consent: false,
})

const errors = ref<ValidationError[]>([])
const isSubmitting = ref(false)
const submitSuccess = ref(false)
const errorSummaryRef = ref<{ focus: () => void } | null>(null)

const supportForOptions = [
  { value: 'myself', label: 'Myself' },
  { value: 'family-member', label: 'A family member' },
  { value: 'friend', label: 'A friend' },
  { value: 'someone-i-support', label: 'Someone I support professionally' },
  { value: 'other', label: 'Someone else' },
] as const

const contactOptions = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'either', label: 'Either email or phone' },
] as const

function errorFor(field: keyof SupportRequestForm): string | undefined {
  return errors.value.find((entry) => entry.field === field)?.message
}

async function handleSubmit() {
  submitSuccess.value = false
  errors.value = validateSupportRequest(form)

  if (errors.value.length) {
    await nextTick()
    errorSummaryRef.value?.focus()
    return
  }

  isSubmitting.value = true
  try {
    await submitSupportRequest({ ...form })
    submitSuccess.value = true
    Object.assign(form, {
      fullName: '',
      email: '',
      phone: '',
      supportFor: '',
      supportType: '',
      preferredContact: '',
      message: '',
      consent: false,
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="container-app">
    <header class="mb-10">
      <h1 class="text-3xl font-bold leading-tight text-ink">
        Request support
      </h1>
      <p class="mt-3 max-w-2xl text-lg leading-relaxed text-ink-secondary">
        Complete this form and we will contact you using your preferred method. Fields marked as required must be filled in.
      </p>
    </header>

    <StatusMessage
      v-if="submitSuccess"
      class="mb-8"
      message="Your support request has been sent. We will contact you soon."
    />

    <form novalidate class="max-w-2xl space-y-8" @submit.prevent="handleSubmit">
      <ErrorSummary
        v-if="errors.length"
        ref="errorSummaryRef"
        :errors="errors"
      />

      <FormField id="fullName" label="Full name" :error="errorFor('fullName')" required>
        <template #default="{ describedBy, invalid }">
          <input
            id="fullName"
            v-model="form.fullName"
            type="text"
            class="form-input"
            autocomplete="name"
            :aria-describedby="describedBy"
            :aria-invalid="invalid"
          >
        </template>
      </FormField>

      <FormField id="email" label="Email address" :error="errorFor('email')" required>
        <template #default="{ describedBy, invalid }">
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="form-input"
            autocomplete="email"
            :aria-describedby="describedBy"
            :aria-invalid="invalid"
          >
        </template>
      </FormField>

      <FormField
        id="phone"
        label="Phone number"
        hint="Optional. Include if you would like us to call you."
        :error="errorFor('phone')"
      >
        <template #default="{ describedBy, invalid }">
          <input
            id="phone"
            v-model="form.phone"
            type="tel"
            class="form-input"
            autocomplete="tel"
            :aria-describedby="describedBy"
            :aria-invalid="invalid"
          >
        </template>
      </FormField>

      <FormField id="supportFor" label="Who are you asking support for?" :error="errorFor('supportFor')" required>
        <template #default="{ describedBy, invalid }">
          <select
            id="supportFor"
            v-model="form.supportFor"
            class="form-input"
            :aria-describedby="describedBy"
            :aria-invalid="invalid"
          >
            <option value="">
              Select an option
            </option>
            <option v-for="option in supportForOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </template>
      </FormField>

      <FormField id="supportType" label="Type of support needed" :error="errorFor('supportType')" required>
        <template #default="{ describedBy, invalid }">
          <select
            id="supportType"
            v-model="form.supportType"
            class="form-input"
            :aria-describedby="describedBy"
            :aria-invalid="invalid"
          >
            <option value="">
              Select a type
            </option>
            <option v-for="cat in ALL_CATEGORIES" :key="cat" :value="cat">
              {{ getCategoryLabel(cat) }}
            </option>
          </select>
        </template>
      </FormField>

      <fieldset
        id="preferredContact"
        class="rounded-lg border-2 border-surface-border bg-surface-elevated p-5"
        :aria-describedby="errorFor('preferredContact') ? 'preferredContact-error' : undefined"
        :aria-invalid="errorFor('preferredContact') ? 'true' : undefined"
      >
        <legend class="form-label px-2">
          Preferred contact method <span class="font-semibold text-error-700">(required)</span>
        </legend>
        <div class="mt-3 space-y-3">
          <label
            v-for="option in contactOptions"
            :key="option.value"
            class="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-base text-ink transition-colors hover:bg-surface-muted"
          >
            <input
              v-model="form.preferredContact"
              type="radio"
              name="preferredContact"
              class="h-5 w-5 border-2 border-surface-border text-primary-700 focus:ring-2 focus:ring-focus focus:ring-offset-2"
              :value="option.value"
            >
            {{ option.label }}
          </label>
        </div>
        <p v-if="errorFor('preferredContact')" id="preferredContact-error" class="form-error mt-3">
          {{ errorFor('preferredContact') }}
        </p>
      </fieldset>

      <FormField id="message" label="Your message" :error="errorFor('message')" required>
        <template #default="{ describedBy, invalid }">
          <textarea
            id="message"
            v-model="form.message"
            rows="5"
            class="form-input"
            :aria-describedby="describedBy"
            :aria-invalid="invalid"
          />
        </template>
      </FormField>

      <FormField id="consent" label="Consent" :error="errorFor('consent')" required>
        <template #default="{ describedBy, invalid }">
          <div class="flex min-h-[44px] items-start gap-3 rounded-md bg-surface-muted p-4">
            <input
              id="consent"
              v-model="form.consent"
              type="checkbox"
              class="mt-0.5 h-5 w-5 rounded border-2 border-surface-border text-primary-700 focus:ring-2 focus:ring-focus focus:ring-offset-2"
              :aria-describedby="describedBy"
              :aria-invalid="invalid"
            >
            <label for="consent" class="text-base leading-relaxed text-ink">
              I agree that my details can be used to respond to this request.
            </label>
          </div>
        </template>
      </FormField>

      <div class="pt-4">
        <button type="submit" class="btn-primary" :disabled="isSubmitting" :aria-busy="isSubmitting">
          {{ isSubmitting ? 'Sending request...' : 'Send support request' }}
        </button>
      </div>
    </form>
  </div>
</template>
