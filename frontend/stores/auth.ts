import { defineStore } from 'pinia'
import type { User } from '@/types/user'
import { AuthenticationException, ValidationException } from '@/utils/api/errors'
import type { ApiClient } from '@/utils/api/client'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => state.user,
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error
  },

  actions: {
    setUser(user: User | null) {
      this.user = user
    },

    setLoading(loading: boolean) {
      this.loading = loading
    },

    setError(error: string | null) {
      this.error = error
    },

    async login(email: string, password: string) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $api } = useNuxtApp()
        const response = await $api.post<{ user: User; token: string }>('/api/auth/login', { email, password })
        this.setUser(response.data.user)
        localStorage.setItem('auth_token', response.data.token)
        return response
      } catch (error) {
        if (error instanceof AuthenticationException) {
          this.setError('Invalid email or password')
        } else if (error instanceof ValidationException) {
          this.setError(error.message)
        } else {
          this.setError('An error occurred during login')
        }
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    async register(email: string, password: string, firstName: string, lastName: string, role: string) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $api } = useNuxtApp()
        const response = await $api.post<{ user: User; token: string }>('/api/auth/register', { email, password, firstName, lastName, role })
        this.setUser(response.data.user)
        localStorage.setItem('auth_token', response.data.token)
        return response
      } catch (error) {
        if (error instanceof ValidationException) {
          this.setError(error.message)
        } else {
          this.setError('An error occurred during registration')
        }
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    async logout() {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $api } = useNuxtApp()
        await $api.post('/api/auth/logout')
        this.setUser(null)
        localStorage.removeItem('auth_token')
      } catch (error) {
        this.setError('An error occurred during logout')
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    async checkAuth() {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $api } = useNuxtApp()
        const response = await $api.get<{ user: User }>('/api/auth/session')
        this.setUser(response.data.user)
        return response.data
      } catch (error) {
        this.setUser(null)
        localStorage.removeItem('auth_token')
        if (error instanceof AuthenticationException) {
          throw error
        }
      } finally {
        this.setLoading(false)
      }
    },

    async requestPasswordReset(email: string) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $api } = useNuxtApp()
        await $api.post('/api/auth/forgot-password', { email })
      } catch (error) {
        if (error instanceof ValidationException) {
          this.setError(error.message)
        } else {
          this.setError('An error occurred while requesting password reset')
        }
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    async resetPassword(token: string, newPassword: string) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $api } = useNuxtApp()
        await $api.post('/api/auth/reset-password', { token, newPassword })
      } catch (error) {
        if (error instanceof ValidationException) {
          this.setError(error.message)
        } else {
          this.setError('An error occurred while resetting password')
        }
        throw error
      } finally {
        this.setLoading(false)
      }
    }
  }
})
