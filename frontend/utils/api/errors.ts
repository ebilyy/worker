import type { ApiError } from './types'

export class ApiException extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errors?: Record<string, string[]>
  ) {
    super(message)
    this.name = 'ApiException'
  }

  static fromResponse(error: ApiError): ApiException {
    return new ApiException(error.statusCode, error.message, error.errors)
  }

  static isApiError(error: unknown): error is ApiException {
    return error instanceof ApiException
  }
}

export class NetworkException extends Error {
  constructor(message = 'Network error occurred') {
    super(message)
    this.name = 'NetworkException'
  }
}

export class ValidationException extends ApiException {
  constructor(errors: Record<string, string[]>) {
    super(400, 'Validation failed', errors)
    this.name = 'ValidationException'
  }
}

export class AuthenticationException extends ApiException {
  constructor(message = 'Authentication failed') {
    super(401, message)
    this.name = 'AuthenticationException'
  }
}

export class AuthorizationException extends ApiException {
  constructor(message = 'Not authorized to perform this action') {
    super(403, message)
    this.name = 'AuthorizationException'
  }
}

export class NotFoundException extends ApiException {
  constructor(message = 'Resource not found') {
    super(404, message)
    this.name = 'NotFoundException'
  }
}

export class ServerException extends ApiException {
  constructor(message = 'Internal server error') {
    super(500, message)
    this.name = 'ServerException'
  }
} 