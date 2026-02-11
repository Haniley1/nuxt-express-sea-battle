// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/icon', '@nuxt/image', '@nuxt/fonts'],

  css: [
    '~/styles/main.scss'
  ],
  
  compatibilityDate: '2024-11-01',
  telemetry: false,
  devtools: { enabled: true },
})