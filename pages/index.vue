<template>
  <AppContainer>
    <PageHeader
      tag="section"
      heading-id="home-heading"
      title="Find support when you need it"
      title-class="text-3xl font-bold text-slate-900 sm:text-4xl"
      section-class=""
      intro="Browse local support services, learn what help is available, and send a request if you need someone to contact you."
    >
      <div class="mt-8 flex flex-col gap-4 sm:flex-row">
        <AppButton to="/services" variant="primary">
          Browse support services
        </AppButton>
        <AppButton to="/request-support" variant="secondary">
          Request support
        </AppButton>
      </div>
    </PageHeader>
  </AppContainer>
</template>
