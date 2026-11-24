/**
 * Curriculum Service — RequirementGroups (4), CurriculumVersions (9), CurriculumCourses (3) = 16 endpoints
 */

import { apiClient, ApiError } from './apiClient';
import { ADMIN_ENDPOINTS } from './endpoints';
import type {
  CoursePlacementDto,
  CoursePlacementRequest,
  CreateCurriculumVersionRequest,
  CreateRequirementGroupRequest,
  CurriculumValidationDto,
  CurriculumVersionDto,
  CurriculumVersionListItemDto,
  RequirementGroupDto,
  SetCurriculumCoursesRequest,
  SetCurriculumGroupsRequest,
  UpdateCurriculumCohortRangeRequest,
  UpdateCurriculumVersionRequest,
  UpdateRequirementGroupRequest,
} from '../types/api/swagger.types';

export const curriculumService = {
  // ---- Requirement Groups (4) ----
  async listRequirementGroups(includeInactive?: boolean): Promise<RequirementGroupDto[]> {
    const data = await apiClient.get<RequirementGroupDto[] | null>(
      ADMIN_ENDPOINTS.REQUIREMENT_GROUPS,
      includeInactive !== undefined ? { includeInactive } : undefined
    );
    return Array.isArray(data) ? data : [];
  },

  async createRequirementGroup(
    payload: CreateRequirementGroupRequest
  ): Promise<{ data: RequirementGroupDto; message: string }> {
    const env = await apiClient.postEnvelope<RequirementGroupDto>(
      ADMIN_ENDPOINTS.REQUIREMENT_GROUPS,
      payload
    );
    if (!env.data) throw new ApiError(env.message || 'Requirement group creation failed.', 500, env.errors, env);
    return { data: env.data, message: env.message || 'Requirement group created.' };
  },

  async getRequirementGroupById(id: number): Promise<RequirementGroupDto> {
    const data = await apiClient.get<RequirementGroupDto | null>(
      ADMIN_ENDPOINTS.REQUIREMENT_GROUP_BY_ID(id)
    );
    if (!data) throw new ApiError('Requirement group not found.', 404);
    return data;
  },

  async updateRequirementGroup(
    id: number,
    payload: UpdateRequirementGroupRequest
  ): Promise<{ data: RequirementGroupDto; message: string }> {
    const env = await apiClient.putEnvelope<RequirementGroupDto>(
      ADMIN_ENDPOINTS.REQUIREMENT_GROUP_BY_ID(id),
      payload
    );
    if (!env.data) throw new ApiError(env.message || 'Requirement group update failed.', 500, env.errors, env);
    return { data: env.data, message: env.message || 'Requirement group updated.' };
  },

  // ---- Curriculum Versions (9) ----
  async listVersions(isActive?: boolean): Promise<CurriculumVersionListItemDto[]> {
    const data = await apiClient.get<CurriculumVersionListItemDto[] | null>(
      ADMIN_ENDPOINTS.CURRICULUM_VERSIONS,
      isActive !== undefined ? { isActive } : undefined
    );
    return Array.isArray(data) ? data : [];
  },

  async createVersion(
    payload: CreateCurriculumVersionRequest
  ): Promise<{ data: CurriculumVersionDto; message: string }> {
    const env = await apiClient.postEnvelope<CurriculumVersionDto>(
      ADMIN_ENDPOINTS.CURRICULUM_VERSIONS,
      payload
    );
    if (!env.data) throw new ApiError(env.message || 'Curriculum version creation failed.', 500, env.errors, env);
    return { data: env.data, message: env.message || 'Curriculum version created.' };
  },

  async getVersionById(id: number): Promise<CurriculumVersionDto> {
    const data = await apiClient.get<CurriculumVersionDto | null>(
      ADMIN_ENDPOINTS.CURRICULUM_VERSION_BY_ID(id)
    );
    if (!data) throw new ApiError('Curriculum version not found.', 404);
    return data;
  },

  async updateVersion(
    id: number,
    payload: UpdateCurriculumVersionRequest
  ): Promise<{ data: CurriculumVersionDto; message: string }> {
    const env = await apiClient.putEnvelope<CurriculumVersionDto>(
      ADMIN_ENDPOINTS.CURRICULUM_VERSION_BY_ID(id),
      payload
    );
    if (!env.data) throw new ApiError(env.message || 'Curriculum version update failed.', 500, env.errors, env);
    return { data: env.data, message: env.message || 'Curriculum version updated.' };
  },

  async getVersionForCohort(cohortYear: number): Promise<CurriculumVersionDto | null> {
    return apiClient.get<CurriculumVersionDto | null>(
      ADMIN_ENDPOINTS.CURRICULUM_VERSION_FOR_COHORT(cohortYear)
    );
  },

  async setVersionGroups(
    id: number,
    payload: SetCurriculumGroupsRequest
  ): Promise<{ data: CurriculumVersionDto; message: string }> {
    const env = await apiClient.putEnvelope<CurriculumVersionDto>(
      ADMIN_ENDPOINTS.CURRICULUM_VERSION_GROUPS(id),
      payload
    );
    if (!env.data) throw new ApiError(env.message || 'Failed to update curriculum groups.', 500, env.errors, env);
    return { data: env.data, message: env.message || 'Curriculum groups updated.' };
  },

  async activateVersion(id: number): Promise<{ data: CurriculumVersionDto; message: string }> {
    const env = await apiClient.postEnvelope<CurriculumVersionDto>(
      ADMIN_ENDPOINTS.CURRICULUM_VERSION_ACTIVATE(id)
    );
    if (!env.data) throw new ApiError(env.message || 'Activation failed.', 500, env.errors, env);
    return { data: env.data, message: env.message || 'Curriculum version activated.' };
  },

  async validateVersion(id: number): Promise<CurriculumValidationDto> {
    const data = await apiClient.get<CurriculumValidationDto | null>(
      ADMIN_ENDPOINTS.CURRICULUM_VERSION_VALIDATE(id)
    );
    if (!data) throw new ApiError('Validation result unavailable.', 500);
    return data;
  },

  async updateVersionCohortRange(
    id: number,
    payload: UpdateCurriculumCohortRangeRequest
  ): Promise<{ data: CurriculumVersionDto; message: string }> {
    const env = await apiClient.patchEnvelope<CurriculumVersionDto>(
      ADMIN_ENDPOINTS.CURRICULUM_VERSION_COHORT_RANGE(id),
      payload
    );
    if (!env.data) throw new ApiError(env.message || 'Cohort range update failed.', 500, env.errors, env);
    return { data: env.data, message: env.message || 'Cohort range updated.' };
  },

  // ---- Curriculum Courses (3) ----
  async listVersionCourses(versionId: number): Promise<CoursePlacementDto[]> {
    const data = await apiClient.get<CoursePlacementDto[] | null>(
      ADMIN_ENDPOINTS.CURRICULUM_COURSES(versionId)
    );
    return Array.isArray(data) ? data : [];
  },

  async replaceVersionCourses(
    versionId: number,
    payload: SetCurriculumCoursesRequest
  ): Promise<{ data: CoursePlacementDto[]; message: string }> {
    const env = await apiClient.putEnvelope<CoursePlacementDto[]>(
      ADMIN_ENDPOINTS.CURRICULUM_COURSES(versionId),
      payload
    );
    return {
      data: Array.isArray(env.data) ? env.data : [],
      message: env.message || 'Curriculum course placements replaced.',
    };
  },

  async upsertVersionCourse(
    versionId: number,
    courseId: number,
    payload: CoursePlacementRequest
  ): Promise<{ data: CoursePlacementDto; message: string }> {
    const env = await apiClient.putEnvelope<CoursePlacementDto>(
      ADMIN_ENDPOINTS.CURRICULUM_COURSE_BY_ID(versionId, courseId),
      payload
    );
    if (!env.data) throw new ApiError(env.message || 'Course placement update failed.', 500, env.errors, env);
    return { data: env.data, message: env.message || 'Course placement saved.' };
  },
};
