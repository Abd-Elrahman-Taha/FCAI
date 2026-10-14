/**
 * Doctor / Instructor Portal Service
 * 
 * Interacts with backend doctor endpoints:
 * Dashboard, Course Instruction, Examination Authoring & Publishing,
 * Grade Entry & Submission, QR Code Generation, and Student Rosters.
 */

import { apiClient } from './apiClient';
import type { Course, Exam, GradePackage } from '../types';

export const doctorService = {
  /** Fetch doctor overview metrics and active lecture status */
  async getDashboard() {
    return apiClient.get('/doctor/dashboard');
  },

  /** Fetch courses taught by the logged-in doctor */
  async getCourses(): Promise<Course[]> {
    return apiClient.get<Course[]>('/doctor/courses');
  },

  /** Fetch student roster enrolled in a doctor course */
  async getCourseRoster(courseId: string) {
    return apiClient.get(`/doctor/courses/${courseId}/roster`);
  },

  /** Fetch exams authored or managed by the doctor */
  async getExams(): Promise<Exam[]> {
    return apiClient.get<Exam[]>('/doctor/exams');
  },

  /** Create and save an exam blueprint (quizzes, midterms, finals) */
  async createExam(examData: Partial<Exam>): Promise<Exam> {
    return apiClient.post<Exam>('/doctor/exams', examData);
  },

  /** Publish an exam to make it accessible to enrolled students */
  async publishExam(examId: string): Promise<{ success: boolean; exam: Exam }> {
    return apiClient.patch(`/doctor/exams/${examId}/publish`);
  },

  /** Fetch course grade package status for submission to administration */
  async getGradePackages(): Promise<GradePackage[]> {
    return apiClient.get<GradePackage[]>('/doctor/grade-packages');
  },

  /** Submit grade package to Dean / College Administration for final approval */
  async submitGradePackage(courseId: string, grades: any[]): Promise<{ success: boolean; package: GradePackage }> {
    return apiClient.post('/doctor/grade-packages/submit', { courseId, grades });
  },

  /** Fetch course attendance overview */
  async getAttendance(courseId: string) {
    return apiClient.get(`/doctor/courses/${courseId}/attendance`);
  },

  /** Generate dynamic QR code attendance session for lecture hall */
  async generateAttendanceSession(courseId: string, durationMinutes: number = 15) {
    return apiClient.post(`/doctor/courses/${courseId}/attendance-session`, { durationMinutes });
  },

  /** Fetch doctor weekly lecture schedule */
  async getSchedule() {
    return apiClient.get('/doctor/schedule');
  }
};
