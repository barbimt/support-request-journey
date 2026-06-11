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
import type { BaseButtonProps, ButtonVariant } from '~/interfaces/components/atoms/BaseButtonProps'

const props = withDefaults(defineProps<BaseButtonProps>(), {
  variant: 'primary',
  size: 'default',
  block: false,
  type: 'button',
  disabled: false,
  ariaBusy: false,
})

const variantClass = computed((): string => {
  const variantMap: Record<ButtonVariant, string> = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
  }

  const classes = [
    variantMap[props.variant],
    props.size === 'compact' ? 'btn-compact' : '',
    props.block ? 'btn-block' : '',
  ]

  return classes.filter(Boolean).join(' ')
})
</script>
