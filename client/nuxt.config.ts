// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/icon', '@nuxt/image'],
  css: [
    '~/styles/main.scss'
  ],
  // fonts: {
  //   defaults: {
  //     weights: [400, 700],
  //     styles: ['normal', 'italic'],
  //   }
  // }
})