<template>
  <header class="border-b border-surface-border bg-surface-elevated">
    <div class="container-app flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-lg font-bold text-primary-900">
        <NuxtLink to="/" class="rounded hover:text-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
          Support Request Journey
        </NuxtLink>
      </p>
      <nav aria-label="Main">
        <ul class="flex flex-wrap gap-2 sm:gap-4">
          <li v-for="link in navLinks" :key="link.to">
            <NuxtLink
              :to="link.to"
              class="rounded px-2 py-1 font-medium text-slate-800 hover:bg-primary-50 hover:text-primary-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
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
