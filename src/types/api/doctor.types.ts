/**
 * Doctor / Instructor Domain API Types
 */

import type { Course, Exam, GradePackage, User } from '../index';

export interface DoctorDashboardResponse {
  doctor: User;
  activeOffering: Course | null;
  totalStudentsTaught: number;
  pendingGradeApprovals: number;
  upcomingLectures: {
    courseCode: string;
    courseName: string;
    room: string;
    time: string;
    day: string;
  }[];
}

export interface CreateExamBlueprintRequest {
  courseCode: string;
  courseName: string;
  title: string;
  type: Exam['type'];
  startTime: string;
  endTime: string;
  durationMinutes: number;
  instructions: string[];
  rules: string[];
  questions: any[];
}

export interface StartAttendanceSessionRequest {
  courseId: string;
  durationMinutes?: number;
  hallName?: string;
  geoFence?: {
    lat: number;
    lng: number;
    radiusMeters: number;
  };
}

export interface AttendanceSessionResponse {
  sessionId: string;
  courseId: string;
  tokenHash: string;
  rotationIntervalSeconds: number;
  expiresAt: string;
  totalEnrolled: number;
  checkedInCount: number;
}

export interface SubmitGradePackageRequest {
  courseId: string;
  grades: {
    studentId: string;
    studentName: string;
    midtermMarks: number;
    courseworkMarks: number;
    finalExamMarks: number;
    totalMarks: number;
    letterGrade: string;
  }[];
  auditNotes?: string;
}
