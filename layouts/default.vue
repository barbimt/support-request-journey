<template>
  <div class="flex min-h-screen flex-col">
    <SkipLink />
    <AppHeader />
    <main id="main-content" tabindex="-1" class="flex-1 py-6 sm:py-10">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
