<template>
  <span class="badge" :class="wrapperClass">
    {{ getCategoryLabel(category) }}
  </span>
</template>

<script setup lang="ts">
import type { CategoryBadgeProps } from '~/interfaces/components/atoms/CategoryBadgeProps'
import { getCategoryLabel } from '~/utils/categories'

defineProps<CategoryBadgeProps>()
</script>
