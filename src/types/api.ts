/**
 * Generic API & Backend Data Transfer Types
 * 
 * Clean, standard contracts for communicating with any REST API backend.
 */

import type { User, Role } from './index';

/** Standard wrapped API response format */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  timestamp?: string;
}

/** Standard paginated response format */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore?: boolean;
}

/** Authentication Login Request */
export interface LoginRequest {
  email?: string;
  studentCode?: string;
  nationalId?: string;
  password?: string;
  role?: Role;
  rememberMe?: boolean;
}

/** Authentication Login Response containing JWT tokens */
export interface LoginResponse {
  user: User;
  token: string;
  refreshToken?: string;
  expiresIn?: number;
}

/** Registration Request */
export interface RegisterRequest {
  name: string;
  email: string;
  password?: string;
  nationalId: string;
  studentCode?: string;
  role: Role;
  phone?: string;
  department?: string;
  academicYear?: string;
}

/** Service Request Creation DTO */
export interface CreateServiceRequestDto {
  type: string;
  department: string;
  subject: string;
  description: string;
  attachmentName?: string;
}

/** QR Attendance Verification DTO */
export interface VerifyAttendanceDto {
  qrKey: string;
  location: {
    lat: number;
    lng: number;
  };
}

/** Exam Submission DTO */
export interface SubmitExamDto {
  examId: string;
  answers: Record<string, any>;
  timeSpentSeconds?: number;
}

/** Grade Package Submission DTO */
export interface SubmitGradePackageDto {
  courseId: string;
  leadDoctor: string;
  grades: {
    studentId: string;
    studentName: string;
    obtainedMarks: number;
    letterGrade: string;
    notes?: string;
  }[];
}

/** Detailed API Error Structure */
export interface ApiErrorDetail {
  field?: string;
  message: string;
  code?: string;
}
