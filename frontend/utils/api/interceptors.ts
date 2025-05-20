import type { RequestConfig } from './types'
import { ApiException, NetworkException } from './errors'

export interface Interceptor {
  request?: (config: RequestConfig) => Promise<RequestConfig> | RequestConfig
  response?: (response: Response) => Promise<Response> | Response
  error?: (error: unknown) => Promise<never> | never
}

export const authInterceptor: Interceptor = {
  request: async (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`
      }
    }
    return config
  },
  error: async (error) => {
    if (error instanceof ApiException && error.statusCode === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/auth/login'
    }
    throw error
  }
}

export const errorInterceptor: Interceptor = {
  error: async (error) => {
    if (error instanceof Response) {
      const data = await error.json().catch(() => ({}))
      throw ApiException.fromResponse({
        statusCode: error.status,
        message: data.message || 'An error occurred',
        errors: data.errors
      })
    }

    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new NetworkException()
    }

    throw error
  }
}

export const loggingInterceptor: Interceptor = {
  request: (config) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Request:', config)
    }
    return config
  },
  response: (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Response:', response)
    }
    return response
  },
  error: (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error:', error)
    }
    throw error
  }
} 