<template>
  <header class="site-header">
    <div class="site-header-accent" aria-hidden="true" />
    <div class="container-app flex flex-col gap-4 py-4 sm:py-5">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p class="m-0">
          <NuxtLink to="/" class="site-title">
            Support Request Journey
          </NuxtLink>
        </p>
        <ThemeToggle />
      </div>
      <nav aria-label="Main">
        <ul class="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:gap-2">
          <li v-for="link in navLinks" :key="link.to">
            <NuxtLink
              :to="link.to"
              class="nav-link"
              :aria-current="isCurrent(link.to) ? 'page' : undefined"
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
const route = useRoute()

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
</script>
