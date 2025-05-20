import type { ApiClient } from '@/utils/api/client'

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