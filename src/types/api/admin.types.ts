/**
 * College Administration Domain API Types
 */

import type { User, Department, Room, GradePackage, ServiceRequest } from '../index';

export interface AdminDashboardResponse {
  stats: {
    totalStudents: number;
    totalDoctors: number;
    totalTas: number;
    totalEmployees: number;
    pendingServiceRequests: number;
    pendingGradeApprovals: number;
    tuitionCollectionRate: number;
  };
  recentActivities: {
    id: string;
    description: string;
    timestamp: string;
    actor: string;
    category: string;
  }[];
}

export interface CreateStudentAccountRequest {
  name: string;
  nationalId: string;
  email: string;
  department: string;
  academicYear: string;
  academicLevel: string;
  phone?: string;
  birthDate?: string;
}

export interface RejectGradePackageRequest {
  packageId: string;
  reason: string;
}

export interface ResolveServiceRequestPayload {
  requestId: string;
  resolutionNotes: string;
  status: 'Resolved' | 'Rejected';
}

export interface GenerateStudentFeesRequest {
  academicYear: string;
  semester: string;
  level?: string;
  department?: string;
}
