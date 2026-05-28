export type ThemeMode = 'light' | 'dark'

const STORAGE_KEY = 'support-journey-theme'

const readStoredTheme = (): ThemeMode | null => {
  if (!import.meta.client) {
    return null
  }
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'light' || stored === 'dark' ? stored : null
}

const readSystemTheme = (): ThemeMode => {
  if (!import.meta.client) {
    return 'light'
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const applyThemeClass = (mode: ThemeMode): void => {
  if (!import.meta.client) {
    return
  }
  document.documentElement.classList.toggle('dark', mode === 'dark')
}

export const useTheme = () => {
  const theme = useState<ThemeMode>('theme-mode', () => 'light')

  const setTheme = (mode: ThemeMode): void => {
    theme.value = mode
    applyThemeClass(mode)
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, mode)
    }
  }

  const initTheme = (): void => {
    const mode = readStoredTheme() ?? readSystemTheme()
    setTheme(mode)
  }

  const toggleTheme = (): void => {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  return {
    theme,
    setTheme,
    initTheme,
    toggleTheme,
  }
}
