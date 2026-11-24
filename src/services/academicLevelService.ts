/**
 * Academic Levels Service (Admin)
 *
 * Strictly integrates confirmed Swagger endpoints under /api/admin/academic-levels:
 * - GET /api/admin/academic-levels (optional policyVersionId query param)
 * - PUT /api/admin/academic-levels
 */

import { apiClient, ApiError } from './apiClient';
import { ADMIN_ENDPOINTS } from './endpoints';
import type {
  AcademicLevelsResponse,
  UpdateAcademicLevelsRequest,
} from '../types/api/academic.types';

export const academicLevelService = {
  /** GET /api/admin/academic-levels?policyVersionId={id} */
  async getAll(policyVersionId?: number): Promise<AcademicLevelsResponse> {
    const params = policyVersionId !== undefined ? { policyVersionId } : undefined;
    const data = await apiClient.get<AcademicLevelsResponse | null>(
      ADMIN_ENDPOINTS.ACADEMIC_LEVELS,
      params
    );

    if (!data || !Array.isArray(data.levels)) {
      throw new ApiError('Unexpected academic levels response format from server.', 500, null, data);
    }

    return data;
  },

  /** PUT /api/admin/academic-levels */
  async update(
    payload: UpdateAcademicLevelsRequest
  ): Promise<{ data: AcademicLevelsResponse; message: string }> {
    const envelope = await apiClient.putEnvelope<AcademicLevelsResponse>(
      ADMIN_ENDPOINTS.ACADEMIC_LEVELS,
      payload
    );

    if (!envelope.data || !Array.isArray(envelope.data.levels)) {
      throw new ApiError(
        envelope.message || 'Server did not return updated academic levels.',
        500,
        envelope.errors,
        envelope
      );
    }

    return {
      data: envelope.data,
      message: envelope.message || 'Academic levels updated successfully.',
    };
  },
};
