<template>
  <button
    type="button"
    class="theme-toggle"
    :aria-pressed="theme === 'dark'"
    :aria-label="isCompact ? themeLabel : undefined"
    @click="toggleTheme"
  >
    <span class="theme-toggle-icon" aria-hidden="true">
      <SunIcon v-if="theme === 'dark'" class="h-6 w-6" />
      <MoonIcon v-else class="h-6 w-6" />
    </span>
    <span class="theme-toggle-label hidden sm:inline">
      {{ theme === 'dark' ? 'Light mode' : 'Dark mode' }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { MoonIcon, SunIcon } from '@heroicons/vue/24/outline'
import { breakpointsTailwind } from '@vueuse/core'

const { theme, toggleTheme, initTheme } = useTheme()

const breakpoints = useBreakpoints(breakpointsTailwind)
const isCompact = breakpoints.smaller('sm')

const themeLabel = computed((): string =>
  theme.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
)

onMounted(() => {
  initTheme()
})
</script>
