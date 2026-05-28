<template>
  <p class="badge" :class="wrapperClass">
    {{ getCategoryLabel(category) }}
  </p>
</template>

<script setup lang="ts">
import type { CategoryBadgeProps } from '~/interfaces/components/atoms/CategoryBadgeProps'
import { getCategoryLabel } from '~/utils/categories'

defineProps<CategoryBadgeProps>()
</script>
