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

const { theme, toggleTheme, initTheme } = useTheme()

const isCompact = ref(true)

const themeLabel = computed((): string =>
  theme.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
)

let compactMediaQuery: MediaQueryList | null = null

const updateCompact = (): void => {
  isCompact.value = !window.matchMedia('(min-width: 640px)').matches
}

onMounted(() => {
  initTheme()
  compactMediaQuery = window.matchMedia('(min-width: 640px)')
  updateCompact()
  compactMediaQuery.addEventListener('change', updateCompact)
})

onUnmounted(() => {
  compactMediaQuery?.removeEventListener('change', updateCompact)
})
</script>
