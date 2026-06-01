<template>
  <AppContainer>
    <PageHeader
      tag="header"
      heading-id="home-heading"
      title="Find support when you need it"
      section-class="hero mb-0"
      title-class="hero-title"
      intro="Browse local support services, learn what help is available, and send a request if you need someone to contact you."
    >
      <div class="hero-actions">
        <AppButton to="/services" variant="primary" size="compact">
          Browse support services
        </AppButton>
        <AppButton to="/request-support" variant="ghost">
          Request support
        </AppButton>
      </div>
    </PageHeader>

    <div class="home-sections">
      <ContentSection title="How this works" heading-id="how-it-works-heading" :divider="false">
        <ol class="body-text list-decimal space-y-3 pl-5 sm:pl-6">
          <li>Browse services to see what support is available near you.</li>
          <li>Open a service to read who it helps, how to contact them, and when they are open.</li>
          <li>Send a support request if you would like someone to get in touch with you.</li>
        </ol>
      </ContentSection>

      <ContentSection title="Who this is for" heading-id="who-heading" :divider="false">
        <p class="body-text max-w-2xl">
          This service is for anyone looking for local help, including families, young people, carers, parents, and adults who need social care or extra support.
        </p>
      </ContentSection>

      <ContentSection title="If you need help now" heading-id="urgent-heading" :divider="false">
        <p class="body-text max-w-2xl">
          If you or someone else is in immediate danger, call 999. For urgent mental health support, contact NHS 111 or your local crisis service.
        </p>
      </ContentSection>
    </div>
  </AppContainer>
</template>

<script setup lang="ts">
useHead({ title: 'Home' })
</script>
