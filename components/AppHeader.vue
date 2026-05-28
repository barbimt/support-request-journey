<script setup lang="ts">
const route = useRoute()

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Request support', to: '/request-support' },
]

function isCurrent(path: string): boolean {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path === path || route.path.startsWith(`${path}/`)
}
</script>

<template>
  <header class="border-b-2 border-surface-border bg-surface-elevated">
    <div class="container-app flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-xl font-bold text-content">
        <NuxtLink
          to="/"
          class="rounded-sm transition-colors hover:text-primary-700 focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
        >
          Support Request Journey
        </NuxtLink>
      </p>
      <nav aria-label="Main">
        <ul class="flex flex-wrap gap-1 sm:gap-2">
          <li v-for="link in navLinks" :key="link.to">
            <NuxtLink
              :to="link.to"
              class="inline-flex min-h-[44px] items-center rounded-md px-3 py-2 text-base font-semibold text-content transition-colors hover:bg-primary-50 hover:text-primary-800 focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
              :class="isCurrent(link.to) ? 'bg-primary-100 text-primary-900' : ''"
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
