/**
 * Academic Years Service (Admin)
 *
 * Strictly integrates confirmed Swagger endpoints under /api/admin/academic-years:
 * - GET  /api/admin/academic-years
 * - POST /api/admin/academic-years
 * - GET  /api/admin/academic-years/{id}
 * - PUT  /api/admin/academic-years/{id}
 */

import { apiClient, ApiError } from './apiClient';
import { ADMIN_ENDPOINTS } from './endpoints';
import type {
  AcademicYear,
  CreateAcademicYearRequest,
  UpdateAcademicYearRequest,
} from '../types/api/academic.types';

export const academicYearService = {
  /** GET /api/admin/academic-years — ordered by startDate descending with nested semesters */
  async getAll(): Promise<AcademicYear[]> {
    const data = await apiClient.get<AcademicYear[] | null>(ADMIN_ENDPOINTS.ACADEMIC_YEARS);
    if (!Array.isArray(data)) {
      throw new ApiError('Unexpected academic years response format from server.', 500, null, data);
    }
    return data.map(year => ({
      ...year,
      semesters: Array.isArray(year.semesters) ? year.semesters : [],
    }));
  },

  /** GET /api/admin/academic-years/{id} */
  async getById(id: number): Promise<AcademicYear> {
    const data = await apiClient.get<AcademicYear | null>(ADMIN_ENDPOINTS.ACADEMIC_YEAR_BY_ID(id));
    if (!data) {
      throw new ApiError('Academic year details were not returned by the server.', 404, null, data);
    }
    return {
      ...data,
      semesters: Array.isArray(data.semesters) ? data.semesters : [],
    };
  },

  /** POST /api/admin/academic-years — returns 201 with created AcademicYear (409 on conflict) */
  async create(payload: CreateAcademicYearRequest): Promise<{ data: AcademicYear; message: string }> {
    const envelope = await apiClient.postEnvelope<AcademicYear>(
      ADMIN_ENDPOINTS.ACADEMIC_YEARS,
      payload
    );
    if (!envelope.data) {
      throw new ApiError(
        envelope.message || 'Server did not return the created academic year.',
        500,
        envelope.errors,
        envelope
      );
    }
    return {
      data: {
        ...envelope.data,
        semesters: Array.isArray(envelope.data.semesters) ? envelope.data.semesters : [],
      },
      message: envelope.message || 'Academic year created successfully.',
    };
  },

  /** PUT /api/admin/academic-years/{id} — returns updated AcademicYear (409 conflict / 422 range error) */
  async update(
    id: number,
    payload: UpdateAcademicYearRequest
  ): Promise<{ data: AcademicYear; message: string }> {
    const envelope = await apiClient.putEnvelope<AcademicYear>(
      ADMIN_ENDPOINTS.ACADEMIC_YEAR_BY_ID(id),
      payload
    );
    if (!envelope.data) {
      throw new ApiError(
        envelope.message || 'Server did not return the updated academic year.',
        500,
        envelope.errors,
        envelope
      );
    }
    return {
      data: {
        ...envelope.data,
        semesters: Array.isArray(envelope.data.semesters) ? envelope.data.semesters : [],
      },
      message: envelope.message || 'Academic year updated successfully.',
    };
  },
};
