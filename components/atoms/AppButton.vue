<template>
  <NuxtLink v-if="to" :to="to" :class="variantClass">
    <slot />
  </NuxtLink>
  <button
    v-else
    :type="type"
    :class="variantClass"
    :disabled="disabled"
    :aria-busy="ariaBusy"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import type { AppButtonProps } from '~/interfaces/components/atoms/AppButtonProps'

const props = withDefaults(defineProps<AppButtonProps>(), {
  variant: 'primary',
  type: 'button',
  disabled: false,
  ariaBusy: false,
})

const variantClass = computed((): string =>
  props.variant === 'secondary' ? 'btn-secondary' : 'btn-primary',
)
</script>
