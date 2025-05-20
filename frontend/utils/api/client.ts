import type { ApiConfig, ApiResponse, RequestConfig } from './types'
import type { Interceptor } from './interceptors'
import { authInterceptor, errorInterceptor, loggingInterceptor } from './interceptors'

export class ApiClient {
  private config: ApiConfig
  private interceptors: Interceptor[] = []

  constructor(config: ApiConfig) {
    this.config = {
      timeout: 30000,
      ...config
    }

    // Add default interceptors
    this.addInterceptor(authInterceptor)
    this.addInterceptor(errorInterceptor)
    this.addInterceptor(loggingInterceptor)
  }

  addInterceptor(interceptor: Interceptor) {
    this.interceptors.push(interceptor)
  }

  private async applyRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
    let finalConfig = { ...config }
    for (const interceptor of this.interceptors) {
      if (interceptor.request) {
        finalConfig = await interceptor.request(finalConfig)
      }
    }
    return finalConfig
  }

  private async applyResponseInterceptors(response: Response): Promise<Response> {
    let finalResponse = response
    for (const interceptor of this.interceptors) {
      if (interceptor.response) {
        finalResponse = await interceptor.response(finalResponse)
      }
    }
    return finalResponse
  }

  private async applyErrorInterceptors(error: unknown): Promise<never> {
    let finalError = error
    for (const interceptor of this.interceptors) {
      if (interceptor.error) {
        try {
          await interceptor.error(finalError)
        } catch (e) {
          finalError = e
        }
      }
    }
    throw finalError
  }

  private async fetchWithTimeout(
    input: RequestInfo,
    init?: RequestConfig
  ): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

    try {
      const response = await fetch(input, {
        ...init,
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }

  private async retryRequest(
    input: RequestInfo,
    init?: RequestConfig,
    retries = 3
  ): Promise<Response> {
    try {
      return await this.fetchWithTimeout(input, init)
    } catch (error) {
      if (retries > 0 && error instanceof TypeError && error.message === 'Failed to fetch') {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return this.retryRequest(input, init, retries - 1)
      }
      throw error
    }
  }

  private buildUrl(path: string, params?: RequestConfig['params']): string {
    const url = new URL(path, this.config.baseURL)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value != null) {
          url.searchParams.append(key, String(value))
        }
      })
    }
    return url.toString()
  }

  async request<T>(
    path: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    try {
      const finalConfig = await this.applyRequestInterceptors({
        ...config,
        headers: {
          'Content-Type': 'application/json',
          ...this.config.headers,
          ...config.headers
        }
      })

      const url = this.buildUrl(path, finalConfig.params)
      const response = await this.retryRequest(url, finalConfig)
      const interceptedResponse = await this.applyResponseInterceptors(response)

      if (!interceptedResponse.ok) {
        throw interceptedResponse
      }

      return await interceptedResponse.json()
    } catch (error) {
      return this.applyErrorInterceptors(error)
    }
  }

  get<T>(path: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(path, { ...config, method: 'GET' })
  }

  post<T>(path: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(path, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  put<T>(path: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(path, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  patch<T>(path: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(path, {
      ...config,
      method: 'PATCH',
      body: JSON.stringify(data)
    })
  }

  delete<T>(path: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(path, { ...config, method: 'DELETE' })
  }
} 