import { defineStore } from 'pinia'
import type { PiniaPluginContext } from 'pinia'
import type { User } from '@/types/user'
import { AuthenticationException, ValidationException } from '@/utils/api/errors'

// Add type for persist plugin options
declare module 'pinia' {
  export interface DefineSetupStoreOptions<Id extends string, S, G, A> {
    persist?: boolean | object
  }
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const currentUser = computed(() => user.value)
  const isLoading = computed(() => loading.value)
  const hasError = computed(() => !!error.value)

  // Actions
  async function login(email: string, password: string) {
    loading.value = true
    error.value = null

    try {
      const { $api } = useNuxtApp()
      // @ts-expect-error - $api type
      const response = await $api.post<{ user: User; token: string }>('/api/auth/login', { email, password })
      user.value = response.user
      localStorage.setItem('auth_token', response.token)
      return response
    } catch (err) {
      if (err instanceof AuthenticationException) {
        error.value = 'Invalid email or password'
      } else if (err instanceof ValidationException) {
        error.value = err.message
      } else {
        error.value = 'An error occurred during login'
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  async function register(email: string, password: string, firstName: string, lastName: string, role: string) {
    loading.value = true
    error.value = null

    try {
      const { $api } = useNuxtApp()
      // @ts-expect-error - $api type
      const response = await $api.post<{ user: User; token: string }>('/api/auth/register', { email, password, firstName, lastName, role })
      user.value = response.data.user
      localStorage.setItem('auth_token', response.data.token)
      return response
    } catch (err) {
      if (err instanceof ValidationException) {
        error.value = err.message
      } else {
        error.value = 'An error occurred during registration'
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    error.value = null

    try {
      const { $api } = useNuxtApp()
      // @ts-expect-error - $api type
      await $api.post('/api/auth/logout')
      user.value = null
      localStorage.removeItem('auth_token')
    } catch (err) {
      error.value = 'An error occurred during logout'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function checkAuth() {
    loading.value = true
    error.value = null

    try {
      const { $api } = useNuxtApp()
      // @ts-expect-error - $api type
      const response = await $api.get<{ user: User }>('/api/auth/session')
      user.value = response.data.user
      return response.data
    } catch (err) {
      user.value = null
      localStorage.removeItem('auth_token')
      if (err instanceof AuthenticationException) {
        throw err
      }
    } finally {
      loading.value = false
    }
  }

  async function requestPasswordReset(email: string) {
    loading.value = true
    error.value = null

    try {
      const { $api } = useNuxtApp()
      // @ts-expect-error - $api type
      await $api.post('/api/auth/forgot-password', { email })
    } catch (err) {
      if (err instanceof ValidationException) {
        error.value = err.message
      } else {
        error.value = 'An error occurred while requesting password reset'
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  async function resetPassword(token: string, newPassword: string) {
    loading.value = true
    error.value = null

    try {
      const { $api } = useNuxtApp()
      // @ts-expect-error - $api type
      await $api.post('/api/auth/reset-password', { token, newPassword })
    } catch (err) {
      if (err instanceof ValidationException) {
        error.value = err.message
      } else {
        error.value = 'An error occurred while resetting password'
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  // Return public state and methods
  return {
    // State
    user,
    loading,
    error,
    // Getters
    isAuthenticated,
    currentUser,
    isLoading,
    hasError,
    // Actions
    login,
    register,
    logout,
    checkAuth,
    requestPasswordReset,
    resetPassword
  }
}, {
  persist: true
})
