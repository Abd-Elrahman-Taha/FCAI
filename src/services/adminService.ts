/**
 * College Administration & Governance Service
 * 
 * Interacts with backend Admin & Dean endpoints:
 * Official Grade Approvals & Publishing, Department Governance,
 * Room / Hall Scheduling, Student Affairs Requests, and Faculty KPI Oversight.
 */

import { apiClient } from './apiClient';
import type { GradePackage, Department, Room, ServiceRequest, User } from '../types';

export const adminService = {
  /** Fetch comprehensive college administration dashboard overview */
  async getDashboard() {
    return apiClient.get('/admin/dashboard');
  },

  /** Fetch student directory with optional search / filter query */
  async getStudents(query?: string): Promise<User[]> {
    return apiClient.get<User[]>('/admin/students', { query });
  },

  /** Fetch faculty professors directory */
  async getDoctors(): Promise<User[]> {
    return apiClient.get<User[]>('/admin/doctors');
  },

  /** Fetch course offerings for semester curriculum planning */
  async getCourseOfferings() {
    return apiClient.get('/admin/course-offerings');
  },

  /** Fetch grade packages submitted by instructors awaiting Dean approval */
  async getGradePackages(): Promise<GradePackage[]> {
    return apiClient.get<GradePackage[]>('/admin/grade-packages');
  },

  /** Approve and officially publish grade package to student portals */
  async approveGradePackage(packageId: string): Promise<{ success: boolean; message: string }> {
    return apiClient.post(`/admin/grade-packages/${packageId}/approve`);
  },

  /** Reject grade package back to doctor with audit notes */
  async rejectGradePackage(packageId: string, reason: string): Promise<{ success: boolean; message: string }> {
    return apiClient.post(`/admin/grade-packages/${packageId}/reject`, { reason });
  },

  /** Fetch campus lecture halls, smart labs, and examination rooms */
  async getRooms(): Promise<Room[]> {
    return apiClient.get<Room[]>('/admin/rooms');
  },

  /** Fetch academic and administrative departments */
  async getDepartments(): Promise<Department[]> {
    return apiClient.get<Department[]>('/admin/departments');
  },

  /** Fetch all student affairs service requests */
  async getServiceRequests(): Promise<ServiceRequest[]> {
    return apiClient.get<ServiceRequest[]>('/admin/service-requests');
  },

  /** Resolve student service request */
  async resolveServiceRequest(requestId: string, resolutionNotes: string): Promise<ServiceRequest> {
    return apiClient.post<ServiceRequest>(`/admin/service-requests/${requestId}/resolve`, { resolutionNotes });
  }
};
