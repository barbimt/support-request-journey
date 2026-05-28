<template>
  <div class="container-app">
    <section aria-labelledby="home-heading">
      <h1 id="home-heading" class="text-3xl font-bold text-slate-900 sm:text-4xl">
        Find support when you need it
      </h1>
      <p class="mt-4 max-w-3xl text-lg text-slate-700">
        Browse local support services, learn what help is available, and send a request if you need someone to contact you.
      </p>
      <div class="mt-8 flex flex-col gap-4 sm:flex-row">
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
