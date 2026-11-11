/**
 * Common API Types & Generic Response Contracts
 * 
 * Standard interfaces for REST API communication.
 */

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore?: boolean;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
  timestamp?: string;
  path?: string;
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, any>;
  timeoutMs?: number;
}
