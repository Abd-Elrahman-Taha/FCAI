/**
 * Semesters Service — Active Semester (All Authenticated Roles) & Admin Semesters (11 endpoints)
 *
 * - GET  /api/semesters/active
 * - GET  /api/admin/semesters?yearId=
 * - POST /api/admin/semesters
 * - GET  /api/admin/semesters/{id}
 * - PUT  /api/admin/semesters/{id}
 * - POST /api/admin/semesters/{id}/activate
 * - PUT  /api/admin/semesters/{id}/windows/registration
 * - PUT  /api/admin/semesters/{id}/windows/drop
 * - PUT  /api/admin/semesters/{id}/windows/withdrawal
 * - PUT  /api/admin/semesters/{id}/windows/preference
 * - POST /api/admin/semesters/{id}/calculate-levels
 */

import { apiClient, ApiError } from './apiClient';
import { ADMIN_ENDPOINTS, SEMESTER_ENDPOINTS } from './endpoints';
import type { ActiveSemester } from '../types/api/academic.types';
import type {
  CalculateLevelsRequest,
  CalculateLevelsResultDto,
  CreateSemesterRequest,
  SemesterDto,
  SetDropPeriodRequest,
  SetWindowRequest,
  UpdateSemesterRequest,
} from '../types/api/swagger.types';

export const semesterService = {
  /** GET /api/semesters/active — returns null strictly on 404 */
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

  /** GET /api/admin/semesters?yearId={yearId} */
  async getAll(yearId?: number): Promise<SemesterDto[]> {
    const data = await apiClient.get<SemesterDto[] | null>(
      ADMIN_ENDPOINTS.SEMESTERS,
      yearId !== undefined ? { yearId } : undefined
    );
    return Array.isArray(data) ? data : [];
  },

  /** GET /api/admin/semesters/{id} */
  async getById(id: number): Promise<SemesterDto> {
    const data = await apiClient.get<SemesterDto | null>(ADMIN_ENDPOINTS.SEMESTER_BY_ID(id));
    if (!data) throw new ApiError('Semester not found.', 404);
    return data;
  },

  /** POST /api/admin/semesters */
  async create(payload: CreateSemesterRequest): Promise<{ data: SemesterDto; message: string }> {
    const env = await apiClient.postEnvelope<SemesterDto>(ADMIN_ENDPOINTS.SEMESTERS, payload);
    if (!env.data) throw new ApiError(env.message || 'Semester creation failed.', 500, env.errors, env);
    return { data: env.data, message: env.message || 'Semester created.' };
  },

  /** PUT /api/admin/semesters/{id} */
  async update(
    id: number,
    payload: UpdateSemesterRequest
  ): Promise<{ data: SemesterDto; message: string }> {
    const env = await apiClient.putEnvelope<SemesterDto>(ADMIN_ENDPOINTS.SEMESTER_BY_ID(id), payload);
    if (!env.data) throw new ApiError(env.message || 'Semester update failed.', 500, env.errors, env);
    return { data: env.data, message: env.message || 'Semester updated.' };
  },

  /** POST /api/admin/semesters/{id}/activate */
  async activate(id: number): Promise<{ data: ActiveSemester; message: string }> {
    const env = await apiClient.postEnvelope<ActiveSemester>(ADMIN_ENDPOINTS.SEMESTER_ACTIVATE(id));
    if (!env.data) throw new ApiError(env.message || 'Activation failed.', 500, env.errors, env);
    return { data: env.data, message: env.message || 'Semester activated.' };
  },

  /** PUT /api/admin/semesters/{id}/windows/registration */
  async setRegistrationWindow(
    id: number,
    payload: SetWindowRequest
  ): Promise<{ data: SemesterDto; message: string }> {
    const env = await apiClient.putEnvelope<SemesterDto>(
      ADMIN_ENDPOINTS.SEMESTER_WINDOW_REGISTRATION(id),
      payload
    );
    if (!env.data) throw new ApiError(env.message || 'Failed to set registration window.', 500, env.errors, env);
    return { data: env.data, message: env.message || 'Registration window updated.' };
  },

  /** PUT /api/admin/semesters/{id}/windows/drop */
  async setDropWindow(
    id: number,
    payload: SetDropPeriodRequest
  ): Promise<{ data: SemesterDto; message: string }> {
    const env = await apiClient.putEnvelope<SemesterDto>(
      ADMIN_ENDPOINTS.SEMESTER_WINDOW_DROP(id),
      payload
    );
    if (!env.data) throw new ApiError(env.message || 'Failed to set drop window.', 500, env.errors, env);
    return { data: env.data, message: env.message || 'Drop window updated.' };
  },

  /** PUT /api/admin/semesters/{id}/windows/withdrawal */
  async setWithdrawalWindow(
    id: number,
    payload: SetWindowRequest
  ): Promise<{ data: SemesterDto; message: string }> {
    const env = await apiClient.putEnvelope<SemesterDto>(
      ADMIN_ENDPOINTS.SEMESTER_WINDOW_WITHDRAWAL(id),
      payload
    );
    if (!env.data) throw new ApiError(env.message || 'Failed to set withdrawal window.', 500, env.errors, env);
    return { data: env.data, message: env.message || 'Withdrawal window updated.' };
  },

  /** PUT /api/admin/semesters/{id}/windows/preference */
  async setPreferenceWindow(
    id: number,
    payload: SetWindowRequest
  ): Promise<{ data: SemesterDto; message: string }> {
    const env = await apiClient.putEnvelope<SemesterDto>(
      ADMIN_ENDPOINTS.SEMESTER_WINDOW_PREFERENCE(id),
      payload
    );
    if (!env.data) throw new ApiError(env.message || 'Failed to set preference window.', 500, env.errors, env);
    return { data: env.data, message: env.message || 'Preference window updated.' };
  },

  /** POST /api/admin/semesters/{id}/calculate-levels */
  async calculateLevels(
    id: number,
    payload: CalculateLevelsRequest = { force: false }
  ): Promise<{ data: CalculateLevelsResultDto; message: string }> {
    const env = await apiClient.postEnvelope<CalculateLevelsResultDto>(
      ADMIN_ENDPOINTS.SEMESTER_CALCULATE_LEVELS(id),
      payload
    );
    if (!env.data) throw new ApiError(env.message || 'Level calculation failed.', 500, env.errors, env);
    return { data: env.data, message: env.message || 'Levels calculated.' };
  },
};
