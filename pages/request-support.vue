<template>
  <AppContainer>
    <PageHeader
      heading-id="request-support-heading"
      title="Request support"
      intro="Complete this form and we will contact you using your preferred method. Fields marked as required must be filled in."
    />

    <StatusMessage
      v-if="submitSuccess"
      class="mb-8"
      :message="successMessage || 'Your support request has been sent. We will contact you soon.'"
    />

    <div
      v-if="serverError"
      class="alert-error mb-8"
      role="alert"
      tabindex="-1"
    >
      <p class="text-base font-semibold leading-relaxed sm:text-lg">
        {{ serverError }}
      </p>
    </div>

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
        class="form-fieldset"
        :aria-describedby="errorFor('preferredContact') ? 'preferredContact-error' : undefined"
        :aria-invalid="errorFor('preferredContact') ? 'true' : undefined"
      >
        <legend class="form-label px-1">
          Preferred contact method <span class="form-error inline">(required)</span>
        </legend>
        <div class="space-y-1">
          <label
            v-for="option in contactOptions"
            :key="option.value"
            class="form-choice-label"
          >
            <input
              v-model="form.preferredContact"
              type="radio"
              name="preferredContact"
              class="form-choice"
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
            rows="6"
            class="form-input min-h-[8rem]"
            :aria-describedby="describedBy"
            :aria-invalid="invalid"
          />
        </template>
      </FormField>

      <FormField id="consent" label="Consent" :error="errorFor('consent')" required>
        <template #default="{ describedBy, invalid }">
          <div class="flex items-start gap-3">
            <input
              id="consent"
              v-model="form.consent"
              type="checkbox"
              class="form-choice mt-1"
              :aria-describedby="describedBy"
              :aria-invalid="invalid"
            >
            <label for="consent" class="body-text">
              I agree that my details can be used to respond to this request.
            </label>
          </div>
        </template>
      </FormField>

      <div class="theme-divider border-t pt-8">
        <AppButton
          type="submit"
          variant="primary"
          :disabled="isSubmitting"
          :aria-busy="isSubmitting"
        >
          {{ isSubmitting ? 'Sending request…' : 'Send support request' }}
        </AppButton>
      </div>
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
  successMessage,
  serverError,
  errorSummaryRef,
  supportForOptions,
  contactOptions,
  errorFor,
  handleSubmit,
} = useSupportRequestForm()
</script>
