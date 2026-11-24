/**
 * Admin People & Student Governance Service (48 endpoints)
 *
 * Covers:
 * - AdminAdmins (7)
 * - AdminDoctors (8)
 * - AdminEmployees (8)
 * - AdminTeachingAssistants (8)
 * - AdminStudents (11)
 * - StudentCreditLoadOverride (2)
 * - TransferredStudents (4)
 */

import { apiClient, ApiError } from './apiClient';
import { ADMIN_ENDPOINTS } from './endpoints';
import type {
  AcademicStatus,
  AdminDetailDto,
  AdminListItemDtoPagedResult,
  AdminResetDoctorPasswordDto,
  AdminResetEmployeePasswordDto,
  AdminResetPasswordDto,
  AdminResetStudentPasswordDto,
  AdminResetTeachingAssistantPasswordDto,
  BulkResetResultDto,
  BulkResetStudentsPasswordDto,
  CreateAdminDto,
  CreateDoctorRequestDto,
  CreateDoctorResponseDto,
  CreateEmployeeRequestDto,
  CreateEmployeeResponseDto,
  CreateStudentRequestDto,
  CreateStudentResponseDto,
  CreateTeachingAssistantRequestDto,
  CreateTeachingAssistantResponseDto,
  CreateTransferredStudentRequestDto,
  CreateTransferredStudentResponseDto,
  CreditLoadOverrideDto,
  DoctorListItemDtoPagedResult,
  DoctorProfileResponseDto,
  EmployeeListItemDtoPagedResult,
  EmployeeProfileResponseDto,
  SetCreditLoadOverrideRequest,
  StudentAcademicStandingDto,
  StudentListItemDtoPagedResult,
  StudentProfileResponseDto,
  StudentTransferCreditsResponseDto,
  TeachingAssistantListItemDtoPagedResult,
  TeachingAssistantProfileResponseDto,
  TransferDepartmentDto,
  TransferDoctorDepartmentDto,
  TransferEmployeeDepartmentDto,
  TransferTeachingAssistantDepartmentDto,
  UpdateAdminDto,
  UpdateDoctorAdminDto,
  UpdateEmployeeAdminDto,
  UpdateStudentAdminDto,
  UpdateStudentTransferCreditsRequest,
  UpdateTeachingAssistantAdminDto,
} from '../types/api/swagger.types';

export interface BasePagedQuery {
  IsActive?: boolean;
  PageIndex?: number;
  PageSize?: number;
  SearchTerm?: string;
  SortBy?: string;
  SortDescending?: boolean;
}

export interface DoctorAdminQuery extends BasePagedQuery {
  DepartmentId?: number;
  Title?: string;
}

export interface EmployeeAdminQuery extends BasePagedQuery {
  DepartmentId?: number;
  JobTitle?: string;
}

export interface TaAdminQuery extends BasePagedQuery {
  DepartmentId?: number;
  AcademicDegree?: string;
}

export interface StudentAdminQuery extends BasePagedQuery {
  DepartmentId?: number;
  AcademicStatus?: AcademicStatus;
}

export const adminPeopleService = {
  // ============================= ADMINS (7) =============================
  admins: {
    async list(query?: BasePagedQuery): Promise<AdminListItemDtoPagedResult> {
      const data = await apiClient.get<AdminListItemDtoPagedResult | null>(
        ADMIN_ENDPOINTS.ADMINS,
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
    async create(payload: CreateAdminDto): Promise<{ data: AdminDetailDto; message: string }> {
      const env = await apiClient.postEnvelope<AdminDetailDto>(ADMIN_ENDPOINTS.ADMINS, payload);
      if (!env.data) throw new ApiError(env.message || 'Admin creation failed.', 500, env.errors, env);
      return { data: env.data, message: env.message || 'Admin created.' };
    },
    async getById(id: number): Promise<AdminDetailDto> {
      const data = await apiClient.get<AdminDetailDto | null>(ADMIN_ENDPOINTS.ADMIN_BY_ID(id));
      if (!data) throw new ApiError('Admin not found.', 404);
      return data;
    },
    async update(id: number, payload: UpdateAdminDto): Promise<{ data: AdminDetailDto; message: string }> {
      const env = await apiClient.putEnvelope<AdminDetailDto>(ADMIN_ENDPOINTS.ADMIN_BY_ID(id), payload);
      if (!env.data) throw new ApiError(env.message || 'Admin update failed.', 500, env.errors, env);
      return { data: env.data, message: env.message || 'Admin updated.' };
    },
    async activate(id: number): Promise<string> {
      const env = await apiClient.postEnvelope<unknown>(ADMIN_ENDPOINTS.ADMIN_ACTIVATE(id));
      return env.message || 'Admin activated.';
    },
    async deactivate(id: number): Promise<string> {
      const env = await apiClient.postEnvelope<unknown>(ADMIN_ENDPOINTS.ADMIN_DEACTIVATE(id));
      return env.message || 'Admin deactivated.';
    },
    async resetPassword(id: number, payload: AdminResetPasswordDto): Promise<string> {
      const env = await apiClient.postEnvelope<unknown>(ADMIN_ENDPOINTS.ADMIN_RESET_PASSWORD(id), payload);
      return env.message || 'Admin password reset.';
    },
  },

  // ============================= DOCTORS (8) =============================
  doctors: {
    async list(query?: DoctorAdminQuery): Promise<DoctorListItemDtoPagedResult> {
      const data = await apiClient.get<DoctorListItemDtoPagedResult | null>(
        ADMIN_ENDPOINTS.DOCTORS,
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
    async create(
      payload: CreateDoctorRequestDto
    ): Promise<{ data: CreateDoctorResponseDto; message: string }> {
      const env = await apiClient.postEnvelope<CreateDoctorResponseDto>(ADMIN_ENDPOINTS.DOCTORS, payload);
      if (!env.data) throw new ApiError(env.message || 'Doctor creation failed.', 500, env.errors, env);
      return { data: env.data, message: env.message || 'Doctor created.' };
    },
    async getById(id: number): Promise<DoctorProfileResponseDto> {
      const data = await apiClient.get<DoctorProfileResponseDto | null>(ADMIN_ENDPOINTS.DOCTOR_BY_ID(id));
      if (!data) throw new ApiError('Doctor not found.', 404);
      return data;
    },
    async update(
      id: number,
      payload: UpdateDoctorAdminDto
    ): Promise<{ data: DoctorProfileResponseDto; message: string }> {
      const env = await apiClient.putEnvelope<DoctorProfileResponseDto>(
        ADMIN_ENDPOINTS.DOCTOR_BY_ID(id),
        payload
      );
      if (!env.data) throw new ApiError(env.message || 'Doctor update failed.', 500, env.errors, env);
      return { data: env.data, message: env.message || 'Doctor updated.' };
    },
    async activate(id: number): Promise<string> {
      const env = await apiClient.postEnvelope<unknown>(ADMIN_ENDPOINTS.DOCTOR_ACTIVATE(id));
      return env.message || 'Doctor activated.';
    },
    async deactivate(id: number): Promise<string> {
      const env = await apiClient.postEnvelope<unknown>(ADMIN_ENDPOINTS.DOCTOR_DEACTIVATE(id));
      return env.message || 'Doctor deactivated.';
    },
    async transfer(
      id: number,
      payload: TransferDoctorDepartmentDto
    ): Promise<{ data: DoctorProfileResponseDto; message: string }> {
      const env = await apiClient.postEnvelope<DoctorProfileResponseDto>(
        ADMIN_ENDPOINTS.DOCTOR_TRANSFER(id),
        payload
      );
      if (!env.data) throw new ApiError(env.message || 'Department transfer failed.', 500, env.errors, env);
      return { data: env.data, message: env.message || 'Doctor transferred.' };
    },
    async resetPassword(id: number, payload: AdminResetDoctorPasswordDto): Promise<string> {
      const env = await apiClient.postEnvelope<unknown>(ADMIN_ENDPOINTS.DOCTOR_RESET_PASSWORD(id), payload);
      return env.message || 'Doctor password reset.';
    },
  },

  // ============================= EMPLOYEES (8) =============================
  employees: {
    async list(query?: EmployeeAdminQuery): Promise<EmployeeListItemDtoPagedResult> {
      const data = await apiClient.get<EmployeeListItemDtoPagedResult | null>(
        ADMIN_ENDPOINTS.EMPLOYEES,
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
    async create(
      payload: CreateEmployeeRequestDto
    ): Promise<{ data: CreateEmployeeResponseDto; message: string }> {
      const env = await apiClient.postEnvelope<CreateEmployeeResponseDto>(
        ADMIN_ENDPOINTS.EMPLOYEES,
        payload
      );
      if (!env.data) throw new ApiError(env.message || 'Employee creation failed.', 500, env.errors, env);
      return { data: env.data, message: env.message || 'Employee created.' };
    },
    async getById(id: number): Promise<EmployeeProfileResponseDto> {
      const data = await apiClient.get<EmployeeProfileResponseDto | null>(
        ADMIN_ENDPOINTS.EMPLOYEE_BY_ID(id)
      );
      if (!data) throw new ApiError('Employee not found.', 404);
      return data;
    },
    async update(
      id: number,
      payload: UpdateEmployeeAdminDto
    ): Promise<{ data: EmployeeProfileResponseDto; message: string }> {
      const env = await apiClient.putEnvelope<EmployeeProfileResponseDto>(
        ADMIN_ENDPOINTS.EMPLOYEE_BY_ID(id),
        payload
      );
      if (!env.data) throw new ApiError(env.message || 'Employee update failed.', 500, env.errors, env);
      return { data: env.data, message: env.message || 'Employee updated.' };
    },
    async activate(id: number): Promise<string> {
      const env = await apiClient.postEnvelope<unknown>(ADMIN_ENDPOINTS.EMPLOYEE_ACTIVATE(id));
      return env.message || 'Employee activated.';
    },
    async deactivate(id: number): Promise<string> {
      const env = await apiClient.postEnvelope<unknown>(ADMIN_ENDPOINTS.EMPLOYEE_DEACTIVATE(id));
      return env.message || 'Employee deactivated.';
    },
    async transfer(
      id: number,
      payload: TransferEmployeeDepartmentDto
    ): Promise<{ data: EmployeeProfileResponseDto; message: string }> {
      const env = await apiClient.postEnvelope<EmployeeProfileResponseDto>(
        ADMIN_ENDPOINTS.EMPLOYEE_TRANSFER(id),
        payload
      );
      if (!env.data) throw new ApiError(env.message || 'Department transfer failed.', 500, env.errors, env);
      return { data: env.data, message: env.message || 'Employee transferred.' };
    },
    async resetPassword(id: number, payload: AdminResetEmployeePasswordDto): Promise<string> {
      const env = await apiClient.postEnvelope<unknown>(ADMIN_ENDPOINTS.EMPLOYEE_RESET_PASSWORD(id), payload);
      return env.message || 'Employee password reset.';
    },
  },

  // ============================= TEACHING ASSISTANTS (8) =============================
  teachingAssistants: {
    async list(query?: TaAdminQuery): Promise<TeachingAssistantListItemDtoPagedResult> {
      const data = await apiClient.get<TeachingAssistantListItemDtoPagedResult | null>(
        ADMIN_ENDPOINTS.TEACHING_ASSISTANTS,
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
    async create(
      payload: CreateTeachingAssistantRequestDto
    ): Promise<{ data: CreateTeachingAssistantResponseDto; message: string }> {
      const env = await apiClient.postEnvelope<CreateTeachingAssistantResponseDto>(
        ADMIN_ENDPOINTS.TEACHING_ASSISTANTS,
        payload
      );
      if (!env.data) throw new ApiError(env.message || 'TA creation failed.', 500, env.errors, env);
      return { data: env.data, message: env.message || 'Teaching assistant created.' };
    },
    async getById(id: number): Promise<TeachingAssistantProfileResponseDto> {
      const data = await apiClient.get<TeachingAssistantProfileResponseDto | null>(
        ADMIN_ENDPOINTS.TEACHING_ASSISTANT_BY_ID(id)
      );
      if (!data) throw new ApiError('Teaching assistant not found.', 404);
      return data;
    },
    async update(
      id: number,
      payload: UpdateTeachingAssistantAdminDto
    ): Promise<{ data: TeachingAssistantProfileResponseDto; message: string }> {
      const env = await apiClient.putEnvelope<TeachingAssistantProfileResponseDto>(
        ADMIN_ENDPOINTS.TEACHING_ASSISTANT_BY_ID(id),
        payload
      );
      if (!env.data) throw new ApiError(env.message || 'TA update failed.', 500, env.errors, env);
      return { data: env.data, message: env.message || 'Teaching assistant updated.' };
    },
    async activate(id: number): Promise<string> {
      const env = await apiClient.postEnvelope<unknown>(ADMIN_ENDPOINTS.TEACHING_ASSISTANT_ACTIVATE(id));
      return env.message || 'Teaching assistant activated.';
    },
    async deactivate(id: number): Promise<string> {
      const env = await apiClient.postEnvelope<unknown>(ADMIN_ENDPOINTS.TEACHING_ASSISTANT_DEACTIVATE(id));
      return env.message || 'Teaching assistant deactivated.';
    },
    async transfer(
      id: number,
      payload: TransferTeachingAssistantDepartmentDto
    ): Promise<{ data: TeachingAssistantProfileResponseDto; message: string }> {
      const env = await apiClient.postEnvelope<TeachingAssistantProfileResponseDto>(
        ADMIN_ENDPOINTS.TEACHING_ASSISTANT_TRANSFER(id),
        payload
      );
      if (!env.data) throw new ApiError(env.message || 'Department transfer failed.', 500, env.errors, env);
      return { data: env.data, message: env.message || 'Teaching assistant transferred.' };
    },
    async resetPassword(id: number, payload: AdminResetTeachingAssistantPasswordDto): Promise<string> {
      const env = await apiClient.postEnvelope<unknown>(
        ADMIN_ENDPOINTS.TEACHING_ASSISTANT_RESET_PASSWORD(id),
        payload
      );
      return env.message || 'Teaching assistant password reset.';
    },
  },

  // ============================= STUDENTS (11 + 2 + 4 = 17) =============================
  students: {
    async list(query?: StudentAdminQuery): Promise<StudentListItemDtoPagedResult> {
      const data = await apiClient.get<StudentListItemDtoPagedResult | null>(
        ADMIN_ENDPOINTS.STUDENTS,
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
    async create(
      payload: CreateStudentRequestDto
    ): Promise<{ data: CreateStudentResponseDto; message: string }> {
      const env = await apiClient.postEnvelope<CreateStudentResponseDto>(ADMIN_ENDPOINTS.STUDENTS, payload);
      if (!env.data) throw new ApiError(env.message || 'Student creation failed.', 500, env.errors, env);
      return { data: env.data, message: env.message || 'Student created.' };
    },
    async getById(id: number): Promise<StudentProfileResponseDto> {
      const data = await apiClient.get<StudentProfileResponseDto | null>(ADMIN_ENDPOINTS.STUDENT_BY_ID(id));
      if (!data) throw new ApiError('Student not found.', 404);
      return data;
    },
    async update(
      id: number,
      payload: UpdateStudentAdminDto
    ): Promise<{ data: StudentProfileResponseDto; message: string }> {
      const env = await apiClient.putEnvelope<StudentProfileResponseDto>(
        ADMIN_ENDPOINTS.STUDENT_BY_ID(id),
        payload
      );
      if (!env.data) throw new ApiError(env.message || 'Student update failed.', 500, env.errors, env);
      return { data: env.data, message: env.message || 'Student updated.' };
    },
    async remove(id: number): Promise<string> {
      const env = await apiClient.deleteEnvelope<unknown>(ADMIN_ENDPOINTS.STUDENT_BY_ID(id));
      return env.message || 'Student deleted.';
    },
    async getLevel(id: number): Promise<StudentAcademicStandingDto> {
      const data = await apiClient.get<StudentAcademicStandingDto | null>(ADMIN_ENDPOINTS.STUDENT_LEVEL(id));
      if (!data) throw new ApiError('Student academic standing not found.', 404);
      return data;
    },
    async activate(id: number): Promise<string> {
      const env = await apiClient.postEnvelope<unknown>(ADMIN_ENDPOINTS.STUDENT_ACTIVATE(id));
      return env.message || 'Student activated.';
    },
    async deactivate(id: number): Promise<string> {
      const env = await apiClient.postEnvelope<unknown>(ADMIN_ENDPOINTS.STUDENT_DEACTIVATE(id));
      return env.message || 'Student deactivated.';
    },
    async transfer(
      id: number,
      payload: TransferDepartmentDto
    ): Promise<{ data: StudentProfileResponseDto; message: string }> {
      const env = await apiClient.postEnvelope<StudentProfileResponseDto>(
        ADMIN_ENDPOINTS.STUDENT_TRANSFER(id),
        payload
      );
      if (!env.data) throw new ApiError(env.message || 'Department transfer failed.', 500, env.errors, env);
      return { data: env.data, message: env.message || 'Student transferred.' };
    },
    async resetPassword(id: number, payload: AdminResetStudentPasswordDto): Promise<string> {
      const env = await apiClient.postEnvelope<unknown>(ADMIN_ENDPOINTS.STUDENT_RESET_PASSWORD(id), payload);
      return env.message || 'Student password reset.';
    },
    async bulkResetPasswords(
      payload: BulkResetStudentsPasswordDto
    ): Promise<{ data: BulkResetResultDto; message: string }> {
      const env = await apiClient.postEnvelope<BulkResetResultDto>(
        ADMIN_ENDPOINTS.STUDENTS_BULK_RESET_PASSWORDS,
        payload
      );
      if (!env.data) throw new ApiError(env.message || 'Bulk reset failed.', 500, env.errors, env);
      return { data: env.data, message: env.message || 'Bulk password reset completed.' };
    },

    // Credit Load Override (2)
    async setCreditLoadOverride(
      id: number,
      payload: SetCreditLoadOverrideRequest
    ): Promise<{ data: CreditLoadOverrideDto; message: string }> {
      const env = await apiClient.putEnvelope<CreditLoadOverrideDto>(
        ADMIN_ENDPOINTS.STUDENT_CREDIT_LOAD_OVERRIDE(id),
        payload
      );
      if (!env.data) throw new ApiError(env.message || 'Credit load override failed.', 500, env.errors, env);
      return { data: env.data, message: env.message || 'Credit load override saved.' };
    },
    async removeCreditLoadOverride(id: number, semesterId?: number): Promise<string> {
      const env = await apiClient.deleteEnvelope<unknown>(
        ADMIN_ENDPOINTS.STUDENT_CREDIT_LOAD_OVERRIDE(id),
        semesterId !== undefined ? { params: { semesterId } } : undefined
      );
      return env.message || 'Credit load override removed.';
    },

    // Transferred Students & Transfer Credits (4)
    async createTransferred(
      payload: CreateTransferredStudentRequestDto
    ): Promise<{ data: CreateTransferredStudentResponseDto; message: string }> {
      const env = await apiClient.postEnvelope<CreateTransferredStudentResponseDto>(
        ADMIN_ENDPOINTS.STUDENTS_TRANSFERRED,
        payload
      );
      if (!env.data) throw new ApiError(env.message || 'Transferred student creation failed.', 500, env.errors, env);
      return { data: env.data, message: env.message || 'Transferred student created.' };
    },
    async getTransferCredits(id: number): Promise<StudentTransferCreditsResponseDto> {
      const data = await apiClient.get<StudentTransferCreditsResponseDto | null>(
        ADMIN_ENDPOINTS.STUDENT_TRANSFER_CREDITS(id)
      );
      if (!data) throw new ApiError('Transfer credits not found.', 404);
      return data;
    },
    async updateTransferCredits(
      id: number,
      payload: UpdateStudentTransferCreditsRequest
    ): Promise<{ data: StudentTransferCreditsResponseDto; message: string }> {
      const env = await apiClient.putEnvelope<StudentTransferCreditsResponseDto>(
        ADMIN_ENDPOINTS.STUDENT_TRANSFER_CREDITS(id),
        payload
      );
      if (!env.data) throw new ApiError(env.message || 'Transfer credits update failed.', 500, env.errors, env);
      return { data: env.data, message: env.message || 'Transfer credits updated.' };
    },
    async deleteTransferCredit(id: number, creditId: number): Promise<string> {
      const env = await apiClient.deleteEnvelope<unknown>(
        ADMIN_ENDPOINTS.STUDENT_TRANSFER_CREDIT_BY_ID(id, creditId)
      );
      return env.message || 'Transfer credit deleted.';
    },
  },
};
