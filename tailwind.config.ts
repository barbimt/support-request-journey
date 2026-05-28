import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{js,vts,ts,vue}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        // Deep teal primary - warm, trustworthy, accessible
        primary: {
          50: '#f0f9f7',
          100: '#d9f0eb',
          200: '#b5e0d9',
          300: '#84cbc1',
          400: '#55afa4',
          500: '#3a9489',
          600: '#2d7770',
          700: '#275f5b',
          800: '#234d4a',
          900: '#1f3f3d',
        },
        // Warm neutral surfaces
        surface: {
          DEFAULT: '#faf9f7',
          muted: '#f5f3f0',
          border: '#d4d0c8',
          elevated: '#ffffff',
        },
        // Dark slate for text colors - near black, warm undertone
        ink: {
          DEFAULT: '#1a1d1c',
          secondary: '#4a4f4d',
          muted: '#6b726f',
        },
        // Semantic colors with strong contrast
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          600: '#b91c1c',
          700: '#991b1b',
          800: '#7f1d1d',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          600: '#16803c',
          700: '#15603a',
          800: '#14532d',
        },
        // Focus color - strong amber for visibility
        focus: {
          DEFAULT: '#d97706',
          ring: '#f59e0b',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
