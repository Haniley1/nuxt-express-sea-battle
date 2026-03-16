import { fileURLToPath } from 'node:url';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/image', '@nuxt/fonts'],

  nitro: {
    experimental: {
      websocket: true,
    },
  },

  alias: {
    '@shared': fileURLToPath(new URL('../shared', import.meta.url)),
  },

  css: ['~/styles/main.scss'],

  compatibilityDate: '2024-11-01',
  telemetry: false,
  devtools: { enabled: true },
});
