import { SessionManager } from "@/services/SessionManager";
import type { ApiError, ApiRequestOptions } from "@/types/api";

// Base configuration
const API_BASE_URL = "http://192.168.1.18:3000/api";
const DEFAULT_TIMEOUT = 30000; // 30 seconds

/**
 * Enhanced API client with error handling and authentication
 */
export class ApiClient {
  private baseUrl: string;
  private defaultTimeout: number;

  constructor(
    baseUrl: string = API_BASE_URL,
    timeout: number = DEFAULT_TIMEOUT
  ) {
    this.baseUrl = baseUrl;
    this.defaultTimeout = timeout;
  }

  /**
   * Get authentication headers
   */
  private getAuthHeaders(): Record<string, string> {
    const sessionManager = SessionManager.getInstance();
    const session = sessionManager.getSessionState();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (session.accessToken) {
      headers.Authorization = `Bearer ${session.accessToken}`;
    }

    return headers;
  }

  /**
   * Handle API errors consistently
   */
  private async handleApiError(response: Response): Promise<never> {
    let errorData: ApiError;

    try {
      errorData = await response.json();
    } catch {
      errorData = {
        message: "Network error occurred",
        statusCode: response.status,
      };
    }

    const errorMessage =
      errorData.message || errorData.en || `HTTP ${response.status}`;
    const error = new Error(errorMessage);

    // Add status code to error for handling
    (error as any).statusCode = response.status;
    (error as any).apiError = errorData;

    throw error;
  }

  /**
   * Create abort controller with timeout
   */
  private createAbortController(timeout?: number): AbortController {
    const controller = new AbortController();
    const timeoutMs = timeout || this.defaultTimeout;

    setTimeout(() => {
      controller.abort();
    }, timeoutMs);

    return controller;
  }

  /**
   * Make API request with enhanced error handling
   */
  async request<T = any>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const {
      method = "GET",
      body,
      headers: customHeaders = {},
      timeout,
    } = options;

    const url = `${this.baseUrl}${endpoint}`;
    const controller = this.createAbortController(timeout);

    const requestHeaders = {
      ...this.getAuthHeaders(),
      ...customHeaders,
    };

    const requestInit: RequestInit = {
      method,
      headers: requestHeaders,
      signal: controller.signal,
    };

    // Add body for non-GET requests
    if (body && method !== "GET") {
      requestInit.body = typeof body === "string" ? body : JSON.stringify(body);
    }

    try {
      // Lightweight request log without leaking secrets
      const hasAuth = Boolean(requestHeaders["Authorization"]);
      console.log(`[api] ${method} ${url} auth=${hasAuth}`);
      const response = await fetch(url, requestInit);

      if (!response.ok) {
        await this.handleApiError(response);
      }

      // Handle empty responses
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        return {} as T;
      }

      const data = await response.json();
      // Helpful debug for common envelope shapes
      if (data && typeof data === "object") {
        const total = (data as any).totalItems;
        const arr = (data as any).data;
        if (typeof total !== "undefined") {
          console.log(`[api] ok ${method} ${url} totalItems=${total}`);
        } else if (Array.isArray(arr)) {
          console.log(`[api] ok ${method} ${url} data.length=${arr.length}`);
        }
      }
      return data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error("Request timeout");
        }
        throw error;
      }
      throw new Error("Unknown error occurred");
    }
  }

  /**
   * GET request
   */
  async get<T = any>(
    endpoint: string,
    options?: Omit<ApiRequestOptions, "method">
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  /**
   * POST request
   */
  async post<T = any>(
    endpoint: string,
    body?: any,
    options?: Omit<ApiRequestOptions, "method" | "body">
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "POST", body });
  }

  /**
   * PUT request
   */
  async put<T = any>(
    endpoint: string,
    body?: any,
    options?: Omit<ApiRequestOptions, "method" | "body">
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "PUT", body });
  }

  /**
   * DELETE request
   */
  async delete<T = any>(
    endpoint: string,
    options?: Omit<ApiRequestOptions, "method">
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }

  /**
   * PATCH request
   */
  async patch<T = any>(
    endpoint: string,
    body?: any,
    options?: Omit<ApiRequestOptions, "method" | "body">
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "PATCH", body });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
