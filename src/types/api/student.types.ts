/**
 * Student Domain API Types
 */

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
  User,
} from '../index';

export interface StudentDashboardResponse {
  student: User;
  kpis: {
    gpa: number;
    attendance: number;
    coursesCount: number;
    assignmentsPending: number;
    completedCredits: number;
    totalCredits: number;
  };
  todaySchedule: TimetableSession[];
  pendingAssignments: Assignment[];
  attendanceAlerts: {
    courseCode: string;
    courseName: string;
    rate: number;
    absencesCount: number;
    warning: boolean;
  }[];
}

export interface CourseRegistrationRequest {
  offeringId: string;
}

export interface CourseDropRequest {
  courseId: string;
  reason?: string;
}

export interface AssignmentSubmissionRequest {
  assignmentId: string;
  file?: File;
  fileName?: string;
  githubUrl?: string;
  notes?: string;
}

export interface VerifyQrAttendanceRequest {
  qrKey: string;
  coords: {
    lat: number;
    lng: number;
  };
}

export interface VerifyQrAttendanceResponse {
  success: boolean;
  message: string;
  courseCode?: string;
  courseName?: string;
  timestamp?: string;
}

export interface SubmitExamAnswersRequest {
  examId: string;
  answers: Record<string, any>;
  timeSpentSeconds?: number;
}

export interface ExamSubmissionResponse {
  score: number;
  totalMarks: number;
  passed: boolean;
  hasPendingManualReview?: boolean;
}

export interface CreateServiceRequestPayload {
  type: ServiceRequest['type'];
  department: string;
  subject: string;
  description: string;
  otherDescription?: string;
  attachment?: File;
  attachmentName?: string;
}

export interface PayFeeFawryResponse {
  success: boolean;
  referenceNumber: string;
  expiryDate: string;
  amount: number;
  feeType: string;
}

export interface StudentGpaHistoryResponse {
  cumulativeGpa: number;
  totalCredits: number;
  totalPoints: number;
  semesters: {
    term: string;
    gpa: number;
    credits: number;
    standing: string;
    courses: {
      code: string;
      name: string;
      creditHours: number;
      grade: string;
      points: number;
    }[];
  }[];
}
