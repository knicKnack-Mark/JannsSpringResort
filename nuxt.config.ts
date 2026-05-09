// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  devServer: {
    host: '0.0.0.0',
    port: 3000
  },

  vite: {
    server: {
      allowedHosts: ['jannsspringresort.dev']
    }
  },

  devtools: {
    enabled: true,
    timeline: {
      enabled: true
    }
  },

  ssr: true,

  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    '@/assets/styles/global.css',
    '~/assets/scss/main.scss'
  ],

  modules: [
    '@nuxt/image',
    '@nuxt/icon',
    'dayjs-nuxt',
    '@formkit/auto-animate/nuxt',
    '@samk-dev/nuxt-vcalendar',
    '@nuxt/fonts',
  ],

  app: {
    head: {
      title: 'Janns Spring Resort',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { name: 'description', content: 'Escape to Janns Spring Resort, a hidden paradise surrounded by lush greenery and crystal-clear spring waters. Perfect for relaxation, swimming, and nature retreats.' },
        { name: 'keywords', content: 'spring resort, vacation, nature getaway, relaxation, swimming, eco-tourism' },
        { name: 'author', content: 'Janns Spring Resort' },
        { property: 'og:title', content: 'Janns Spring Resort - A Nature Lover’s Paradise' },
        { property: 'og:description', content: 'Discover the beauty of Janns Spring Resort, where nature meets relaxation. Enjoy refreshing spring waters, scenic views, and a peaceful retreat from city life.' },
        { property: 'og:image', content: '/resort.jpg' },
        { property: 'og:url', content: 'http://jannsspringresort.dev:3000' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'en_US' },
        { name: 'twitter:title', content: 'Janns Spring Resort - A Nature Lover’s Paradise' },
        { name: 'twitter:description', content: 'Unwind in the serene environment of Janns Spring Resort, featuring natural spring pools, fresh air, and breathtaking landscapes.' },
        { name: 'twitter:image', content: '/resort.jpg' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'robots', content: 'index, follow' }
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico'
        }
      ]
    }
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE
    }
  }
})