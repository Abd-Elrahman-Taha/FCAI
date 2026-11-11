/**
 * Teaching Assistant (TA) Domain API Types
 */

import type { User } from '../index';

export interface TaDashboardResponse {
  ta: User;
  assignedSectionsCount: number;
  totalStudentsCount: number;
  pendingSubmissionsCount: number;
  upcomingDiscussions: {
    sectionCode: string;
    courseName: string;
    room: string;
    time: string;
    day: string;
  }[];
}

export interface SectionAttendanceResponse {
  sectionId: string;
  sectionName: string;
  courseCode: string;
  room: string;
  schedule: string;
  roster: {
    code: string;
    name: string;
    status: 'Present' | 'Late' | 'Absent';
    time: string;
    method: string;
  }[];
}

export interface GradeSectionSubmissionRequest {
  submissionId: string;
  score: number;
  feedback?: string;
  rubricScores?: Record<string, number>;
}
