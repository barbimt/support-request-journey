<template>
  <div class="container-app">
    <section aria-labelledby="home-heading" class="py-8 sm:py-12">
      <h1 id="home-heading" class="text-3xl font-bold leading-tight text-ink sm:text-4xl">
        Find support when you need it
      </h1>
      <p class="mt-5 max-w-2xl text-lg leading-relaxed text-ink-secondary">
        Browse local support services, learn what help is available, and send a request if you need someone to contact you.
      </p>
      <div class="mt-10 flex flex-col gap-4 sm:flex-row">
        <NuxtLink to="/services" class="btn-primary">
          Browse support services
        </NuxtLink>
        <NuxtLink to="/request-support" class="btn-secondary">
          Request support
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
