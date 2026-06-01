export type ThemeMode = 'light' | 'dark'

export interface UseThemeReturn {
  theme: Ref<ThemeMode>
  setTheme: (mode: ThemeMode) => void
  initTheme: () => void
  toggleTheme: () => void
}
