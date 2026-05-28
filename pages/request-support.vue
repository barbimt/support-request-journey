<template>
  <AppContainer>
    <PageHeader
      heading-id="request-support-heading"
      title="Request support"
      intro="Complete this form and we will contact you using your preferred method. Fields marked as required must be filled in."
    />

    <StatusMessage
      v-if="submitSuccess"
      class="mb-6"
      message="Your support request has been sent. We will contact you soon."
    />

    <form novalidate class="max-w-2xl space-y-6" @submit.prevent="handleSubmit">
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
        class="rounded-md border border-surface-border p-4"
        :aria-describedby="errorFor('preferredContact') ? 'preferredContact-error' : undefined"
        :aria-invalid="errorFor('preferredContact') ? 'true' : undefined"
      >
        <legend class="form-label px-1">
          Preferred contact method <span class="text-red-800">(required)</span>
        </legend>
        <div class="space-y-2">
          <label
            v-for="option in contactOptions"
            :key="option.value"
            class="flex items-center gap-2 text-base text-slate-900"
          >
            <input
              v-model="form.preferredContact"
              type="radio"
              name="preferredContact"
              class="h-4 w-4 border-slate-500 text-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              :value="option.value"
            >
            {{ option.label }}
          </label>
        </div>
        <p v-if="errorFor('preferredContact')" id="preferredContact-error" class="form-error">
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
          <div class="flex items-start gap-2">
            <input
              id="consent"
              v-model="form.consent"
              type="checkbox"
              class="mt-1 h-4 w-4 rounded border-slate-500 text-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              :aria-describedby="describedBy"
              :aria-invalid="invalid"
            >
            <label for="consent" class="text-base text-slate-900">
              I agree that my details can be used to respond to this request.
            </label>
          </div>
        </template>
      </FormField>

      <AppButton
        type="submit"
        variant="primary"
        :disabled="isSubmitting"
        :aria-busy="isSubmitting"
      >
        {{ isSubmitting ? 'Sending request…' : 'Send support request' }}
      </AppButton>
    </form>
  </AppContainer>
</template>

<script setup lang="ts">
import { ALL_CATEGORIES, getCategoryLabel } from '~/utils/categories'

const {
  form,
  errors,
  isSubmitting,
  submitSuccess,
  errorSummaryRef,
  supportForOptions,
  contactOptions,
  errorFor,
  handleSubmit,
} = useSupportRequestForm()
</script>
