import { defineNuxtPlugin } from '#app'
import { ApiClient } from '@/utils/api/client'

declare module '#app' {
  interface NuxtApp {
    $api: ApiClient
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $api: ApiClient
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  
  const apiClient = new ApiClient({
    baseURL: config.public.apiBase,
    timeout: 30000,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })

  return {
    provide: {
      api: apiClient
    }
  }
}) 