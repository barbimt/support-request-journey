<template>
  <div class="flex min-h-screen flex-col bg-surface">
    <SkipLink />
    <AppHeader />
    <main id="main-content" tabindex="-1" class="flex-1 py-10 sm:py-12">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
