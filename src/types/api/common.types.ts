/**
 * Common API Types & Standard Backend Envelope Contracts
 *
 * Matches the FCAI BSU ASP.NET Core backend ApiResponse<T> envelope.
 */

export interface PaginationMetadata {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors: Record<string, string[]> | null;
  meta: PaginationMetadata | Record<string, unknown> | null;
}

export type QueryParamValue = string | number | boolean | null | undefined;

export interface RequestOptions extends RequestInit {
  params?: Record<string, QueryParamValue>;
  timeoutMs?: number;
  /** Do not attach Authorization header (e.g. public auth endpoints) */
  skipAuth?: boolean;
  /** Do not attempt automatic token refresh on 401 (e.g. login/refresh endpoints) */
  skipAuthRefresh?: boolean;
}
