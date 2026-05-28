<template>
  <AppContainer>
    <div class="hero-panel">
      <PageHeader
        tag="section"
        heading-id="home-heading"
        title="Find support when you need it"
        section-class="mb-0"
        intro="Browse local support services, learn what help is available, and send a request if you need someone to contact you."
      >
        <div class="mt-8 flex flex-col gap-4 sm:mt-10">
          <AppButton to="/services" variant="primary">
            Browse support services
          </AppButton>
          <AppButton to="/request-support" variant="secondary">
            Request support
          </AppButton>
        </div>
      </PageHeader>
    </div>

    <div class="mt-8 space-y-6 sm:mt-10">
      <ContentSection title="How this works" heading-id="how-it-works-heading" panel>
        <ol class="body-text list-decimal space-y-4 pl-6">
          <li>Browse services to see what support is available near you.</li>
          <li>Open a service to read who it helps, how to contact them, and when they are open.</li>
          <li>Send a support request if you would like someone to get in touch with you.</li>
        </ol>
      </ContentSection>

      <ContentSection title="Who this is for" heading-id="who-heading" panel>
        <p class="body-text">
          This service is for anyone looking for local help, including families, young people, carers, parents, and adults who need social care or extra support.
        </p>
      </ContentSection>

      <ContentSection title="If you need help now" heading-id="urgent-heading" panel>
        <p class="body-text">
          If you or someone else is in immediate danger, call 999. For urgent mental health support, contact NHS 111 or your local crisis service.
        </p>
      </ContentSection>
    </div>
  </AppContainer>
</template>
