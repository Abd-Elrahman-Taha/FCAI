/**
 * Student Portal Service
 * 
 * Interacts with backend student endpoints:
 * Dashboard, Course Registrations, Timetable, QR Attendance, Assignments,
 * Examinations, Grades, Tuition Fees, and Official Requests.
 */

import { apiClient } from './apiClient';
import type {
  Course,
  TimetableSession,
  AttendanceSession,
  Assignment,
  Exam,
  CourseGrade,
  StudentFee,
  Receipt,
  ServiceRequest,
  User
} from '../types';

export const studentService = {
  /** Fetch overview KPI metrics and upcoming schedule for student dashboard */
  async getDashboard() {
    return apiClient.get('/student/dashboard');
  },

  /** Fetch all courses the student is currently enrolled in */
  async getMyCourses(): Promise<Course[]> {
    return apiClient.get<Course[]>('/student/courses');
  },

  /** Fetch comprehensive details of a single course by code or id */
  async getCourseDetails(courseId: string): Promise<Course> {
    return apiClient.get<Course>(`/courses/${courseId}`);
  },

  /** Drop a currently enrolled course during the drop/add window */
  async dropCourse(courseId: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete(`/student/courses/${courseId}`);
  },

  /** Fetch open courses available for credit hour registration */
  async getCourseRegistrationOfferings(): Promise<Course[]> {
    return apiClient.get<Course[]>('/student/registration/offerings');
  },

  /** Register for an academic course offering */
  async registerCourse(offeringId: string): Promise<{ success: boolean; course: Course }> {
    return apiClient.post('/student/registration/enroll', { offeringId });
  },

  /** Fetch student assignments by filter ('all' | 'pending' | 'submitted' | 'graded') */
  async getAssignments(tab: string = 'all'): Promise<Assignment[]> {
    return apiClient.get<Assignment[]>('/student/assignments', { tab });
  },

  /** Submit completed assignment file */
  async submitAssignment(assignmentId: string, fileOrName: string | File): Promise<Assignment> {
    if (fileOrName instanceof File) {
      const formData = new FormData();
      formData.append('file', fileOrName);
      return apiClient.upload<Assignment>(`/student/assignments/${assignmentId}/submit`, formData);
    }
    return apiClient.post<Assignment>(`/student/assignments/${assignmentId}/submit`, { fileName: fileOrName });
  },

  /** Fetch student weekly schedule / timetable */
  async getTimetable(): Promise<TimetableSession[]> {
    return apiClient.get<TimetableSession[]>('/student/timetable');
  },

  /** Fetch student attendance records */
  async getAttendanceOverview(): Promise<AttendanceSession[]> {
    return apiClient.get<AttendanceSession[]>('/student/attendance');
  },

  /** Verify rotating dynamic QR code and GPS location for lecture attendance */
  async verifyQrAttendance(qrKey: string, coords: { lat: number; lng: number }): Promise<{ success: boolean; message: string; courseName?: string }> {
    return apiClient.post('/student/attendance/verify-qr', { qrKey, coords });
  },

  /** Fetch published grades for all semesters */
  async getGrades(): Promise<CourseGrade[]> {
    return apiClient.get<CourseGrade[]>('/student/grades');
  },

  /** Fetch GPA progression history across all academic terms */
  async getStudentGpaHistory() {
    return apiClient.get('/student/gpa-history');
  },

  /** Fetch billing fees and tuition dues */
  async getFees(): Promise<StudentFee[]> {
    return apiClient.get<StudentFee[]>('/student/fees');
  },

  /** Pay tuition fee via Fawry gateway integration */
  async payFeeFawry(feeId: string): Promise<{ success: boolean; referenceNumber: string; expiryDate: string }> {
    return apiClient.post(`/student/fees/${feeId}/pay-fawry`);
  },

  /** Fetch official payment receipt by receipt id */
  async getReceipt(receiptId: string): Promise<Receipt> {
    return apiClient.get<Receipt>(`/student/receipts/${receiptId}`);
  },

  /** Fetch all exams (quizzes, midterms, finals) */
  async getExams(): Promise<Exam[]> {
    return apiClient.get<Exam[]>('/student/exams');
  },

  /** Fetch single exam by ID for the secure exam player */
  async getExam(examId: string): Promise<Exam> {
    return apiClient.get<Exam>(`/student/exams/${examId}`);
  },

  /** Fetch upcoming examination hall timetable */
  async getExamSchedule() {
    return apiClient.get('/student/exams/schedule');
  },

  /** Submit answers for active online exam */
  async submitExam(examId: string, answers: Record<string, any>): Promise<{ score: number; totalMarks: number; passed: boolean }> {
    return apiClient.post(`/student/exams/${examId}/submit`, { answers });
  },

  /** Fetch graded exam review results */
  async getExamResult(examId: string) {
    return apiClient.get(`/student/exams/${examId}/result`);
  },

  /** Fetch submitted administrative service requests */
  async getServiceRequests(): Promise<ServiceRequest[]> {
    return apiClient.get<ServiceRequest[]>('/student/service-requests');
  },

  /** Submit new administrative service request */
  async createServiceRequest(data: Partial<ServiceRequest>): Promise<ServiceRequest> {
    return apiClient.post<ServiceRequest>('/student/service-requests', data);
  },

  /** Cancel pending service request */
  async cancelServiceRequest(requestId: string): Promise<{ success: boolean }> {
    return apiClient.delete(`/student/service-requests/${requestId}`);
  },

  /** Fetch student personal and academic profile */
  async getStudentProfile(): Promise<User> {
    return apiClient.get<User>('/student/profile');
  },

  /** Update editable student contact details */
  async updateStudentProfile(data: { phone?: string; email?: string }): Promise<User> {
    return apiClient.patch<User>('/student/profile', data);
  },

  /** Fetch official verifiable university documents */
  async getUniversityDocuments() {
    return apiClient.get('/student/documents');
  },

  /** Fetch course study materials, lecture slides, and reference PDFs */
  async getLearningMaterials(courseId: string) {
    return apiClient.get(`/courses/${courseId}/materials`);
  }
};
