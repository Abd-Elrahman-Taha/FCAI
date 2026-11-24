/**
 * Departments Service — Public (2) & Admin Departments (7) = 9 endpoints
 */

import { apiClient, ApiError } from './apiClient';
import { ADMIN_ENDPOINTS, DEPARTMENT_ENDPOINTS } from './endpoints';
import type {
  CreateDepartmentDto,
  DepartmentDetailDto,
  DepartmentListItemDtoPagedResult,
  DepartmentLookupDto,
  DepartmentType,
  SetHeadDoctorDto,
  UpdateDepartmentDto,
} from '../types/api/swagger.types';

export interface DepartmentAdminQuery {
  Type?: DepartmentType;
  IsActive?: boolean;
  PageIndex?: number;
  PageSize?: number;
  SearchTerm?: string;
  SortBy?: string;
  SortDescending?: boolean;
}

export const departmentService = {
  /** GET /api/departments/lookup */
  async getLookup(): Promise<DepartmentLookupDto[]> {
    const data = await apiClient.get<DepartmentLookupDto[] | null>(DEPARTMENT_ENDPOINTS.LOOKUP);
    return Array.isArray(data) ? data : [];
  },

  /** GET /api/departments/{id} */
  async getPublicById(id: number): Promise<DepartmentDetailDto> {
    const data = await apiClient.get<DepartmentDetailDto | null>(DEPARTMENT_ENDPOINTS.BY_ID(id));
    if (!data) throw new ApiError('Department not found.', 404);
    return data;
  },

  /** GET /api/admin/departments */
  async adminList(query?: DepartmentAdminQuery): Promise<DepartmentListItemDtoPagedResult> {
    const data = await apiClient.get<DepartmentListItemDtoPagedResult | null>(
      ADMIN_ENDPOINTS.DEPARTMENTS,
      query ? { ...query } : undefined
    );
    return (
      data ?? {
        items: [],
        meta: {
          pageIndex: 1,
          pageSize: 20,
          totalCount: 0,
          totalPages: 0,
          hasPreviousPage: false,
          hasNextPage: false,
        },
      }
    );
  },

  /** POST /api/admin/departments */
  async adminCreate(payload: CreateDepartmentDto): Promise<{ data: DepartmentDetailDto; message: string }> {
    const env = await apiClient.postEnvelope<DepartmentDetailDto>(ADMIN_ENDPOINTS.DEPARTMENTS, payload);
    if (!env.data) throw new ApiError(env.message || 'Department creation failed.', 500, env.errors, env);
    return { data: env.data, message: env.message || 'Department created.' };
  },

  /** GET /api/admin/departments/{id} */
  async adminGetById(id: number): Promise<DepartmentDetailDto> {
    const data = await apiClient.get<DepartmentDetailDto | null>(ADMIN_ENDPOINTS.DEPARTMENT_BY_ID(id));
    if (!data) throw new ApiError('Department not found.', 404);
    return data;
  },

  /** PUT /api/admin/departments/{id} */
  async adminUpdate(
    id: number,
    payload: UpdateDepartmentDto
  ): Promise<{ data: DepartmentDetailDto; message: string }> {
    const env = await apiClient.putEnvelope<DepartmentDetailDto>(
      ADMIN_ENDPOINTS.DEPARTMENT_BY_ID(id),
      payload
    );
    if (!env.data) throw new ApiError(env.message || 'Department update failed.', 500, env.errors, env);
    return { data: env.data, message: env.message || 'Department updated.' };
  },

  /** POST /api/admin/departments/{id}/activate */
  async activate(id: number): Promise<string> {
    const env = await apiClient.postEnvelope<unknown>(ADMIN_ENDPOINTS.DEPARTMENT_ACTIVATE(id));
    return env.message || 'Department activated.';
  },

  /** POST /api/admin/departments/{id}/deactivate */
  async deactivate(id: number): Promise<string> {
    const env = await apiClient.postEnvelope<unknown>(ADMIN_ENDPOINTS.DEPARTMENT_DEACTIVATE(id));
    return env.message || 'Department deactivated.';
  },

  /** POST /api/admin/departments/{id}/head-doctor */
  async setHeadDoctor(
    id: number,
    payload: SetHeadDoctorDto
  ): Promise<{ data: DepartmentDetailDto; message: string }> {
    const env = await apiClient.postEnvelope<DepartmentDetailDto>(
      ADMIN_ENDPOINTS.DEPARTMENT_HEAD_DOCTOR(id),
      payload
    );
    if (!env.data) throw new ApiError(env.message || 'Failed to set head doctor.', 500, env.errors, env);
    return { data: env.data, message: env.message || 'Head doctor assigned.' };
  },
};
