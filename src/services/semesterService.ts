/**
 * Active Semester Service — All Authenticated Roles
 *
 * Strictly integrates confirmed Swagger endpoint:
 * - GET /api/semesters/active
 *
 * Important:
 * - Requires authentication (never call before login).
 * - HTTP 404 means no semester is currently active -> returns `null`.
 * - All other errors (401, 403, 500, network) are rethrown faithfully.
 */

import { apiClient, ApiError } from './apiClient';
import { SEMESTER_ENDPOINTS } from './endpoints';
import type { ActiveSemester } from '../types/api/academic.types';

export const semesterService = {
  /** GET /api/semesters/active — returns null on 404 (no active semester configured) */
  async getActive(): Promise<ActiveSemester | null> {
    try {
      const data = await apiClient.get<ActiveSemester | null>(SEMESTER_ENDPOINTS.ACTIVE);
      return data ?? null;
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 404) {
        return null;
      }
      throw err;
    }
  },
};
