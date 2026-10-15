/**
 * Unified API Facade
 * 
 * Provides a single, clean interface for all frontend data access.
 * Automatically toggles between Real REST API and Simulated Mock API
 * based on `VITE_USE_MOCK_API` in `.env`.
 * 
 * To connect to your real backend server:
 * Set `VITE_USE_MOCK_API=false` in `.env`
 */

import { config, isRealApiActive, isMockApiActive } from '../config/env';
import { apiClient, tokenStorage, ApiError } from './apiClient';
import { authService } from './authService';
import { studentService } from './studentService';
import { doctorService } from './doctorService';
import { taService } from './taService';
import { adminService } from './adminService';
import { superAdminService } from './superAdminService';
import { aiService } from './aiService';
import { mockDataApi } from './mockDataApi';
import type { Role } from '../types';

/** Handlers that dispatch to real REST backend when isRealApiActive() is true */
const realServiceHandlers: Record<string, (...args: any[]) => any> = {
  // ---- Auth & Identity ----
  getCurrentUser: (role?: Role) => authService.getCurrentUser(role),
  login: (creds: any) => {
    if (typeof creds === 'string') {
      return authService.login({ role: creds as Role });
    }
    return authService.login(creds);
  },
  logout: () => authService.logout(),
  getNotifications: () => authService.getNotifications(),
  markNotificationRead: (id: string) => authService.markNotificationRead(id),
  markAllNotificationsRead: () => authService.markAllNotificationsRead(),

  // ---- Student Portal ----
  getStudentDashboard: () => studentService.getDashboard(),
  getStudentProfile: () => studentService.getStudentProfile(),
  updateStudentProfile: (patch: any) => studentService.updateStudentProfile(patch),
  getMyCourses: () => studentService.getMyCourses(),
  getCourseDetails: (id: string) => studentService.getCourseDetails(id),
  dropCourse: (id: string) => studentService.dropCourse(id),
  getCourseRegistrationOfferings: () => studentService.getCourseRegistrationOfferings(),
  registerCourse: (id: string) => studentService.registerCourse(id),
  getTimetable: () => studentService.getTimetable(),
  getAttendanceOverview: () => studentService.getAttendanceOverview(),
  verifyQrAttendance: (qrKey: string, coords: any) => studentService.verifyQrAttendance(qrKey, coords),
  getAssignments: (tab?: string) => studentService.getAssignments(tab),
  getAssignment: (id: string) => studentService.getAssignments().then(list => list.find(a => a.id === id) || null),
  getAssignmentDetails: (id: string) => studentService.getAssignments().then(list => list.find(a => a.id === id) || null),
  submitAssignment: (id: string, fileOrName: any) => studentService.submitAssignment(id, fileOrName),
  getGrades: () => studentService.getGrades(),
  getStudentGpaHistory: () => studentService.getStudentGpaHistory(),
  getFees: () => studentService.getFees(),
  payFeeFawry: (feeId: string) => studentService.payFeeFawry(feeId),
  getReceipt: (receiptId: string) => studentService.getReceipt(receiptId),
  getExams: () => studentService.getExams(),
  getExam: (examId: string) => studentService.getExam(examId),
  getExamSchedule: () => studentService.getExamSchedule(),
  submitExam: (examId: string, answers: any) => studentService.submitExam(examId, answers),
  getExamResult: (examId: string) => studentService.getExamResult(examId),
  getServiceRequests: () => studentService.getServiceRequests(),
  createServiceRequest: (data: any) => studentService.createServiceRequest(data),
  cancelServiceRequest: (id: string) => studentService.cancelServiceRequest(id),
  getUniversityDocuments: () => studentService.getUniversityDocuments(),
  getLearningMaterials: (courseId: string) => studentService.getLearningMaterials(courseId),

  // ---- Doctor / Instructor Portal ----
  getDoctorDashboard: () => doctorService.getDashboard(),
  getDoctorOfferings: () => doctorService.getCourses(),
  getDoctorCourseDetail: (courseId: string) => doctorService.getCourses().then(list => list.find(c => c.code === courseId) || null),
  getDoctorExams: () => doctorService.getExams(),
  createExam: (data: any) => doctorService.createExam(data),
  publishExam: (id: string) => doctorService.publishExam(id),
  getDoctorGradePackages: () => doctorService.getGradePackages(),
  submitDoctorGradePackage: (courseId: string, grades: any[]) => doctorService.submitGradePackage(courseId, grades),
  getDoctorAttendance: (courseId: string) => doctorService.getAttendance(courseId),
  generateAttendanceQrSession: (courseId: string) => doctorService.generateAttendanceSession(courseId),
  getInstructorSchedule: () => doctorService.getSchedule(),

  // ---- Teaching Assistant (TA) Portal ----
  getTaDashboard: () => taService.getDashboard(),
  getTaAssignedSections: () => taService.getAssignedSections(),
  getTaSectionAttendance: (secId: string) => taService.getSectionAttendance(secId),
  getTaSectionSubmissions: (secId: string) => taService.getSectionSubmissions(secId),
  saveTaSectionGrade: (subId: string, grade: any, feedback?: string) => taService.saveSectionGrade(subId, grade, feedback),
  getTaDiscussionsSchedule: () => taService.getDiscussionsSchedule(),

  // ---- Admin Portal ----
  getAdminDashboard: () => adminService.getDashboard(),
  getAdminStudents: (query?: string) => adminService.getStudents(query),
  getAdminDoctors: () => adminService.getDoctors(),
  getAdminCourseOfferings: () => adminService.getCourseOfferings(),
  getAdminGradePackages: () => adminService.getGradePackages(),
  approveGradePackage: (id: string) => adminService.approveGradePackage(id),
  rejectGradePackage: (id: string, reason: string) => adminService.rejectGradePackage(id, reason),
  getAdminRooms: () => adminService.getRooms(),
  getAdminDepartments: () => adminService.getDepartments(),
  getAdminServiceRequests: () => adminService.getServiceRequests(),
  resolveServiceRequest: (id: string, notes: string) => adminService.resolveServiceRequest(id, notes),

  // ---- SuperAdmin Portal ----
  getSuperAdminRoles: () => superAdminService.getRoles(),
  getSuperAdminSystemConfig: () => superAdminService.getSystemConfig(),
  saveSuperAdminSystemConfig: (cfg: any) => superAdminService.saveSystemConfig(cfg),
  getSuperAdminSecurityConfig: () => superAdminService.getSecurityConfig(),
  getSuperAdminIntegrations: () => superAdminService.getIntegrations(),
  getSuperAdminAuditLogs: (query?: string) => superAdminService.getAuditLogs(query),

  // ---- AI Tutor & Assistant ----
  getStudyDocuments: () => aiService.getStudyDocuments(),
  uploadStudyPdf: (fileOrName: any, size?: string) => aiService.uploadStudyPdf(fileOrName, size),
  getPdfChat: (docId: string) => aiService.getPdfChat(docId),
  sendPdfChatMessage: (docId: string, msg: string) => aiService.sendPdfChatMessage(docId, msg),
};

const apiExtensions = {
  config,
  isRealApi: isRealApiActive,
  isMockApi: isMockApiActive,
  client: apiClient,
  tokens: tokenStorage,
  auth: authService,
  student: studentService,
  doctor: doctorService,
  ta: taService,
  admin: adminService,
  superAdmin: superAdminService,
  ai: aiService,
};

type ApiType = typeof mockDataApi & typeof apiExtensions;

/**
 * The Unified API instance
 * Delegates seamlessly between Real REST Backend and Mock Data Provider
 */
export const api: ApiType = new Proxy(mockDataApi, {
  get(target: any, prop: string | symbol) {
    if (typeof prop === 'string') {
      if (prop in apiExtensions) {
        return (apiExtensions as any)[prop];
      }
      if (isRealApiActive() && prop in realServiceHandlers) {
        return async (...args: any[]) => {
          try {
            return await realServiceHandlers[prop](...args);
          } catch (err: any) {
            if (
              err?.isNetworkError ||
              err?.message?.includes('Failed to fetch') ||
              err?.message?.includes('Network request failed')
            ) {
              console.warn(`[FCAI API] Backend server unreachable for ${prop}. Falling back to mock data.`);
              if (typeof target[prop] === 'function') {
                return await target[prop](...args);
              }
            }
            throw err;
          }
        };
      }
    }
    return target[prop];
  }
}) as ApiType;

export const fakeApi = api;

export { ApiError, apiClient, tokenStorage };
export default api;
