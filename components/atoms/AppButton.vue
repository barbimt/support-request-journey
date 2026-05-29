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
  size: 'default',
  block: false,
  type: 'button',
  disabled: false,
  ariaBusy: false,
})

const variantClass = computed((): string => {
  const classes = [
    props.variant === 'secondary'
      ? 'btn-secondary'
      : props.variant === 'ghost'
        ? 'btn-ghost'
        : 'btn-primary',
    props.size === 'compact' ? 'btn-compact' : '',
    props.block ? 'btn-block' : '',
  ]

  return classes.filter(Boolean).join(' ')
})
</script>
