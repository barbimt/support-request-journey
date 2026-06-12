// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/test-utils/module', '@nuxt/a11y', '@vueuse/nuxt'],
  a11y: {
    // Dev-only feedback via Nuxt DevTools; disabled in production builds
    enabled: process.env.NODE_ENV !== 'production',
    defaultHighlight: false,
    logIssues: true,
  },
  // Do not SWR-cache /services: SSR embeds the services list in the HTML payload.
  // After create/delete on /manage/services, a cached /services page would stay stale for minutes.
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    apiBase: process.env.NUXT_API_BASE || 'http://localhost:3001/api',
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Support Request Journey',
      titleTemplate: '%s – Support Request Journey',
      script: [
        {
          key: 'theme-init',
          innerHTML: `(function(){try{var k='support-journey-theme';var t=localStorage.getItem(k);var d=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d)}catch(e){}})();`,
          type: 'text/javascript',
        },
      ],
    },
  },
})
