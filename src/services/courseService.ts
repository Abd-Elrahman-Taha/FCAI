/**
 * Courses Service — Public Catalog (3) & Admin Courses/Prerequisites (7) = 10 endpoints
 */

import { apiClient, ApiError } from './apiClient';
import { ADMIN_ENDPOINTS, COURSE_ENDPOINTS } from './endpoints';
import type {
  CourseCatalogItemDto,
  CourseDto,
  CourseListItemDtoPagedResult,
  CreateCourseRequest,
  PrerequisiteDto,
  SetPrerequisitesRequest,
  UpdateCourseRequest,
} from '../types/api/swagger.types';

export interface CourseSearchQuery {
  Search?: string;
  DepartmentId?: number;
  RequirementGroupId?: number;
  CurriculumVersionId?: number;
  IsCreditBearing?: boolean;
  Level?: number;
  Page?: number;
  PageSize?: number;
}

const EMPTY_META = {
  pageIndex: 1,
  pageSize: 20,
  totalCount: 0,
  totalPages: 0,
  hasPreviousPage: false,
  hasNextPage: false,
};

export const courseService = {
  /** GET /api/courses (public read-only paged search) */
  async searchPublic(query?: CourseSearchQuery): Promise<CourseListItemDtoPagedResult> {
    const data = await apiClient.get<CourseListItemDtoPagedResult | null>(
      COURSE_ENDPOINTS.LIST,
      query ? { ...query } : undefined,
      { skipAuth: false }
    );
    return data ?? { items: [], meta: EMPTY_META };
  },

  /** GET /api/courses/catalog?curriculumVersionId= */
  async getPublicCatalog(curriculumVersionId?: number): Promise<CourseCatalogItemDto[]> {
    const data = await apiClient.get<CourseCatalogItemDto[] | null>(
      COURSE_ENDPOINTS.CATALOG,
      curriculumVersionId !== undefined ? { curriculumVersionId } : undefined
    );
    return Array.isArray(data) ? data : [];
  },

  /** GET /api/courses/{id} */
  async getPublicById(id: number): Promise<CourseDto> {
    const data = await apiClient.get<CourseDto | null>(COURSE_ENDPOINTS.BY_ID(id));
    if (!data) throw new ApiError('Course not found.', 404);
    return data;
  },

  /** GET /api/admin/courses */
  async adminSearch(query?: CourseSearchQuery): Promise<CourseListItemDtoPagedResult> {
    const data = await apiClient.get<CourseListItemDtoPagedResult | null>(
      ADMIN_ENDPOINTS.COURSES,
      query ? { ...query } : undefined
    );
    return data ?? { items: [], meta: EMPTY_META };
  },

  /** POST /api/admin/courses */
  async adminCreate(payload: CreateCourseRequest): Promise<{ data: CourseDto; message: string }> {
    const env = await apiClient.postEnvelope<CourseDto>(ADMIN_ENDPOINTS.COURSES, payload);
    if (!env.data) throw new ApiError(env.message || 'Course creation failed.', 500, env.errors, env);
    return { data: env.data, message: env.message || 'Course created.' };
  },

  /** GET /api/admin/courses/{id} */
  async adminGetById(id: number): Promise<CourseDto> {
    const data = await apiClient.get<CourseDto | null>(ADMIN_ENDPOINTS.COURSE_BY_ID(id));
    if (!data) throw new ApiError('Course not found.', 404);
    return data;
  },

  /** PUT /api/admin/courses/{id} */
  async adminUpdate(
    id: number,
    payload: UpdateCourseRequest
  ): Promise<{ data: CourseDto; message: string }> {
    const env = await apiClient.putEnvelope<CourseDto>(ADMIN_ENDPOINTS.COURSE_BY_ID(id), payload);
    if (!env.data) throw new ApiError(env.message || 'Course update failed.', 500, env.errors, env);
    return { data: env.data, message: env.message || 'Course updated.' };
  },

  /** DELETE /api/admin/courses/{id} */
  async adminDelete(id: number): Promise<string> {
    const env = await apiClient.deleteEnvelope<unknown>(ADMIN_ENDPOINTS.COURSE_BY_ID(id));
    return env.message || 'Course deleted.';
  },

  /** GET /api/admin/courses/{id}/prerequisites */
  async getPrerequisites(id: number): Promise<PrerequisiteDto[]> {
    const data = await apiClient.get<PrerequisiteDto[] | null>(ADMIN_ENDPOINTS.COURSE_PREREQUISITES(id));
    return Array.isArray(data) ? data : [];
  },

  /** PUT /api/admin/courses/{id}/prerequisites */
  async setPrerequisites(
    id: number,
    payload: SetPrerequisitesRequest
  ): Promise<{ data: PrerequisiteDto[]; message: string }> {
    const env = await apiClient.putEnvelope<PrerequisiteDto[]>(
      ADMIN_ENDPOINTS.COURSE_PREREQUISITES(id),
      payload
    );
    return {
      data: Array.isArray(env.data) ? env.data : [],
      message: env.message || 'Prerequisites updated.',
    };
  },
};
