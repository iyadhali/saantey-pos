export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',

  modules: [
    '@nuxthub/core',
    '@nuxt/eslint',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/test-utils/module',
  ],

  hub: {},

  eslint: {
    config: {
      stylistic: false,
    },
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL || '',
    sessionSecret: process.env.SESSION_SECRET || 'dev-secret-change-me',
  },

  app: {
    head: {
      title: 'Saantey POS',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Restaurant point of sale and back-office management' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
        },
      ],
    },
  },

  devtools: { enabled: true },

  nitro: {
    preset: 'cloudflare_pages',
    rollupConfig: {
      external: ['pg-native'],
    },
  },
})