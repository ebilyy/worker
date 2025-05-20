export interface ApiError {
  statusCode: number
  message: string
  errors?: Record<string, string[]>
}

export interface ApiResponse<T> {
  data: T
  message?: string
  meta?: {
    total?: number
    page?: number
    limit?: number
  }
}

export interface ApiConfig {
  baseURL: string
  timeout?: number
  headers?: Record<string, string>
}

export interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | null | undefined>
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' 