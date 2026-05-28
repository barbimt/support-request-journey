<template>
  <button
    type="button"
    class="theme-toggle"
    :aria-pressed="theme === 'dark'"
    :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="toggleTheme"
  >
    <span class="theme-toggle-icon" aria-hidden="true">
      <SunIcon v-if="theme === 'dark'" class="h-5 w-5" />
      <MoonIcon v-else class="h-5 w-5" />
    </span>
    <span class="theme-toggle-label">
      {{ theme === 'dark' ? 'Light mode' : 'Dark mode' }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { MoonIcon, SunIcon } from '@heroicons/vue/24/outline'

const { theme, toggleTheme, initTheme } = useTheme()

onMounted(() => {
  initTheme()
})
</script>
