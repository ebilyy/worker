// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  // TypeScript
  typescript: {
    strict: true
    // typeCheck: true
  },

  // Modules
  modules: [
    // UI
    '@nuxt/ui',
    '@nuxtjs/color-mode',
    'nuxt-icon',
    '@nuxt/image',

    // State Management
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',

    // Development Tools
    '@nuxtjs/eslint-module',
    '@nuxtjs/device'
  ],

  // UI Configuration
  icon: {
    provider: 'simple-icons',
    size: '24px',
    class: 'icon',
    iconifyApiOptions: {
      url: 'https://api.iconify.design',
    },
    aliases: {
      'heroicons': 'heroicons-outline',
      'heroicons-solid': 'heroicons-solid',
    }
  },
  ui: {
    global: true,
  },

  // Color Mode Configuration
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light'
  },

  // Runtime Config
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001/api',
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY
    }
  },

  // App Config
  app: {
    head: {
      title: 'IT Job Search Platform',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          key: 'description',
          name: 'description',
          content: 'Find your next IT job opportunity in Ukraine and beyond'
        }
      ]
    }
  },
  vite: {
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3001/api',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})
