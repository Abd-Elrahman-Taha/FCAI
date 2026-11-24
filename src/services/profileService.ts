/**
 * Authenticated Role Self-Service Profile & Standing Service (10 endpoints)
 *
 * - Students (4): GET/PUT /api/students/me, GET /api/students/me/level, GET /api/students/me/credit-load
 * - Doctors (2): GET/PUT /api/doctors/me
 * - TeachingAssistants (2): GET/PUT /api/teaching-assistants/me
 * - Employees (2): GET/PUT /api/employees/me
 */

import { apiClient, ApiError } from './apiClient';
import {
  DOCTOR_ME_ENDPOINTS,
  EMPLOYEE_ME_ENDPOINTS,
  STUDENT_ME_ENDPOINTS,
  TA_ME_ENDPOINTS,
} from './endpoints';
import type {
  DoctorProfileResponseDto,
  EmployeeProfileResponseDto,
  ResolvedCreditLoadDto,
  StudentAcademicStandingDto,
  StudentProfileResponseDto,
  TeachingAssistantProfileResponseDto,
  UpdateDoctorContactDto,
  UpdateEmployeeContactDto,
  UpdateStudentContactDto,
  UpdateTeachingAssistantContactDto,
} from '../types/api/swagger.types';

export const profileService = {
  student: {
    async getMe(): Promise<StudentProfileResponseDto> {
      const data = await apiClient.get<StudentProfileResponseDto | null>(STUDENT_ME_ENDPOINTS.ME);
      if (!data) throw new ApiError('Student profile not found.', 404);
      return data;
    },
    async updateContact(
      payload: UpdateStudentContactDto
    ): Promise<{ data: StudentProfileResponseDto; message: string }> {
      const env = await apiClient.putEnvelope<StudentProfileResponseDto>(
        STUDENT_ME_ENDPOINTS.ME,
        payload
      );
      if (!env.data) throw new ApiError(env.message || 'Profile update failed.', 500, env.errors, env);
      return { data: env.data, message: env.message || 'Contact info updated.' };
    },
    async getLevel(): Promise<StudentAcademicStandingDto> {
      const data = await apiClient.get<StudentAcademicStandingDto | null>(STUDENT_ME_ENDPOINTS.LEVEL);
      if (!data) throw new ApiError('Academic standing not found.', 404);
      return data;
    },
    async getCreditLoad(semesterId?: number): Promise<ResolvedCreditLoadDto> {
      const data = await apiClient.get<ResolvedCreditLoadDto | null>(
        STUDENT_ME_ENDPOINTS.CREDIT_LOAD,
        semesterId !== undefined ? { semesterId } : undefined
      );
      if (!data) throw new ApiError('Credit load not found.', 404);
      return data;
    },
  },

  doctor: {
    async getMe(): Promise<DoctorProfileResponseDto> {
      const data = await apiClient.get<DoctorProfileResponseDto | null>(DOCTOR_ME_ENDPOINTS.ME);
      if (!data) throw new ApiError('Doctor profile not found.', 404);
      return data;
    },
    async updateContact(
      payload: UpdateDoctorContactDto
    ): Promise<{ data: DoctorProfileResponseDto; message: string }> {
      const env = await apiClient.putEnvelope<DoctorProfileResponseDto>(DOCTOR_ME_ENDPOINTS.ME, payload);
      if (!env.data) throw new ApiError(env.message || 'Profile update failed.', 500, env.errors, env);
      return { data: env.data, message: env.message || 'Contact info updated.' };
    },
  },

  ta: {
    async getMe(): Promise<TeachingAssistantProfileResponseDto> {
      const data = await apiClient.get<TeachingAssistantProfileResponseDto | null>(TA_ME_ENDPOINTS.ME);
      if (!data) throw new ApiError('Teaching assistant profile not found.', 404);
      return data;
    },
    async updateContact(
      payload: UpdateTeachingAssistantContactDto
    ): Promise<{ data: TeachingAssistantProfileResponseDto; message: string }> {
      const env = await apiClient.putEnvelope<TeachingAssistantProfileResponseDto>(
        TA_ME_ENDPOINTS.ME,
        payload
      );
      if (!env.data) throw new ApiError(env.message || 'Profile update failed.', 500, env.errors, env);
      return { data: env.data, message: env.message || 'Contact info updated.' };
    },
  },

  employee: {
    async getMe(): Promise<EmployeeProfileResponseDto> {
      const data = await apiClient.get<EmployeeProfileResponseDto | null>(EMPLOYEE_ME_ENDPOINTS.ME);
      if (!data) throw new ApiError('Employee profile not found.', 404);
      return data;
    },
    async updateContact(
      payload: UpdateEmployeeContactDto
    ): Promise<{ data: EmployeeProfileResponseDto; message: string }> {
      const env = await apiClient.putEnvelope<EmployeeProfileResponseDto>(
        EMPLOYEE_ME_ENDPOINTS.ME,
        payload
      );
      if (!env.data) throw new ApiError(env.message || 'Profile update failed.', 500, env.errors, env);
      return { data: env.data, message: env.message || 'Contact info updated.' };
    },
  },
};
