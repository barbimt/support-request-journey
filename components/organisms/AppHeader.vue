<template>
  <header class="site-header">
    <div class="site-header-accent" aria-hidden="true" />
    <div class="container-app py-4 sm:py-5">
      <div class="flex items-center justify-between gap-4">
        <p class="m-0 min-w-0">
          <NuxtLink to="/" class="site-title">
            Support Request Journey
          </NuxtLink>
        </p>
        <div class="flex shrink-0 items-center gap-2">
          <button
            ref="menuToggleRef"
            type="button"
            class="nav-menu-toggle sm:hidden"
            :aria-expanded="menuOpen"
            aria-controls="main-nav"
            :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
            @click="toggleMenu"
          >
            <Bars3Icon v-if="!menuOpen" class="h-6 w-6" aria-hidden="true" />
            <XMarkIcon v-else class="h-6 w-6" aria-hidden="true" />
          </button>
          <ThemeToggle />
        </div>
      </div>

      <nav
        id="main-nav"
        ref="mainNavRef"
        class="main-nav"
        :class="{ 'main-nav--open': menuOpen }"
        aria-label="Main"
        @keydown="onMenuKeydown"
      >
        <ul class="nav-list">
          <li v-for="link in navLinks" :key="link.to">
            <NuxtLink
              :to="link.to"
              class="nav-link"
              :aria-current="isCurrent(link.to) ? 'page' : undefined"
              @click="closeMenu(false)"
            >
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const menuOpen = ref(false)
const menuToggleRef = ref<HTMLButtonElement | null>(null)
const mainNavRef = ref<HTMLElement | null>(null)

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Request support', to: '/request-support' },
] as const

const isCurrent = (path: string): boolean => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path === path || route.path.startsWith(`${path}/`)
}

const isMobileViewport = (): boolean =>
  window.matchMedia('(max-width: 639px)').matches

const getMenuLinks = (): HTMLElement[] => {
  if (!mainNavRef.value) {
    return []
  }

  return Array.from(mainNavRef.value.querySelectorAll<HTMLElement>('a.nav-link'))
}

const closeMenu = (returnFocus: boolean): void => {
  if (!menuOpen.value) {
    return
  }

  menuOpen.value = false

  if (returnFocus) {
    nextTick(() => {
      menuToggleRef.value?.focus()
    })
  }
}

const toggleMenu = (): void => {
  if (menuOpen.value) {
    closeMenu(true)
    return
  }

  menuOpen.value = true

  nextTick(() => {
    getMenuLinks()[0]?.focus()
  })
}

const onMenuKeydown = (event: KeyboardEvent): void => {
  if (!menuOpen.value || !isMobileViewport()) {
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    closeMenu(true)
    return
  }

  if (event.key !== 'Tab') {
    return
  }

  const links = getMenuLinks()
  if (links.length === 0) {
    return
  }

  const first = links[0]
  const last = links[links.length - 1]
  const active = document.activeElement

  if (event.shiftKey && active === first) {
    event.preventDefault()
    last.focus()
    return
  }

  if (!event.shiftKey && active === last) {
    event.preventDefault()
    first.focus()
  }
}

watch(
  () => route.path,
  () => {
    closeMenu(false)
  },
)

const onWindowKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape' && menuOpen.value) {
    event.preventDefault()
    closeMenu(true)
  }
}

onMounted(() => {
  window.addEventListener('keydown', onWindowKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onWindowKeydown)
})
</script>
