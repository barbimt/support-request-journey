<template>
  <FormField id="title" label="Service title" :error="errorFor('title')" required>
    <template #default="{ describedBy, invalid }">
      <input
        id="title"
        v-model="form.title"
        type="text"
        class="form-input"
        :aria-describedby="describedBy"
        :aria-invalid="invalid"
      >
    </template>
  </FormField>

  <FormField id="category" label="Category" :error="errorFor('category')" required>
    <template #default="{ describedBy, invalid }">
      <select
        id="category"
        v-model="form.category"
        class="form-input"
        :aria-describedby="describedBy"
        :aria-invalid="invalid"
      >
        <option value="">
          Select a category
        </option>
        <option v-for="cat in ALL_CATEGORIES" :key="cat" :value="cat">
          {{ getCategoryLabel(cat) }}
        </option>
      </select>
    </template>
  </FormField>

  <FormField id="description" label="Description" :error="errorFor('description')" required>
    <template #default="{ describedBy, invalid }">
      <textarea
        id="description"
        v-model="form.description"
        rows="5"
        class="form-input min-h-[6rem]"
        :aria-describedby="describedBy"
        :aria-invalid="invalid"
      />
    </template>
  </FormField>

  <FormField
    id="eligibility"
    label="Eligibility"
    hint="Who can use this service?"
    :error="errorFor('eligibility')"
  >
    <template #default="{ describedBy, invalid }">
      <textarea
        id="eligibility"
        v-model="form.eligibility"
        rows="4"
        class="form-input min-h-[5rem]"
        :aria-describedby="describedBy"
        :aria-invalid="invalid"
      />
    </template>
  </FormField>

  <FormField id="contactEmail" label="Contact email" :error="errorFor('contactEmail')">
    <template #default="{ describedBy, invalid }">
      <input
        id="contactEmail"
        v-model="form.contactEmail"
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
    hint="Optional."
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

  <FormField
    id="openingHours"
    label="Opening hours"
    hint="For example: Monday to Friday, 9am to 5pm."
    :error="errorFor('openingHours')"
  >
    <template #default="{ describedBy, invalid }">
      <input
        id="openingHours"
        v-model="form.openingHours"
        type="text"
        class="form-input"
        :aria-describedby="describedBy"
        :aria-invalid="invalid"
      >
    </template>
  </FormField>

  <FormField
    id="accessibilityNotes"
    label="Accessibility notes"
    hint="Any information about physical access, communication support, or other adjustments."
    :error="errorFor('accessibilityNotes')"
  >
    <template #default="{ describedBy, invalid }">
      <textarea
        id="accessibilityNotes"
        v-model="form.accessibilityNotes"
        rows="4"
        class="form-input min-h-[5rem]"
        :aria-describedby="describedBy"
        :aria-invalid="invalid"
      />
    </template>
  </FormField>

  <FormField id="onlineSupport" label="Online support" :error="errorFor('onlineSupport')">
    <template #default="{ describedBy, invalid }">
      <div class="flex items-start gap-3">
        <input
          id="onlineSupport"
          v-model="form.onlineSupport"
          type="checkbox"
          class="form-choice mt-1"
          :aria-describedby="describedBy"
          :aria-invalid="invalid"
        >
        <label for="onlineSupport" class="body-text">
          This service can be accessed online or by phone.
        </label>
      </div>
    </template>
  </FormField>
</template>

<script setup lang="ts">
import type { ServiceFormFieldsProps } from '~/interfaces/components/organisms/ServiceFormFieldsProps'
import { ALL_CATEGORIES, getCategoryLabel } from '~/utils/categories'

defineProps<ServiceFormFieldsProps>()
</script>
