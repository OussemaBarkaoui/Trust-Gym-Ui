/**
 * Common API response interface
 */
export interface ApiResponse<T = any> {
  data: T;
  totalItems?: number;
  statusCode: number;
  message: string;
  success?: boolean;
}

/**
 * API error response interface
 */
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
  en?: string; // English message fallback
}

/**
 * Base API options for requests
 */
export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * Search parameters
 */
export interface SearchParams {
  query?: string;
  filters?: Record<string, any>;
}
