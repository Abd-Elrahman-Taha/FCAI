/**
 * Academic Years, Active Semester & Academic Levels API Contracts
 *
 * Strictly aligned with confirmed Swagger DTOs:
 * - /api/admin/academic-years
 * - /api/semesters/active
 * - /api/admin/academic-levels
 */

import type { SemesterType, WindowStatus } from './swagger.types';
export type { SemesterType, WindowStatus };

export interface SemesterSummary {
  id: number;
  name: string;
  semesterType: SemesterType;
  startDate: string; // yyyy-MM-dd
  endDate: string;   // yyyy-MM-dd
  isActive: boolean;
}

export interface AcademicYear {
  id: number;
  name: string;
  startDate: string; // yyyy-MM-dd
  endDate: string;   // yyyy-MM-dd
  isActive: boolean;
  semesters: SemesterSummary[];
}

export interface CreateAcademicYearRequest {
  name: string;
  startDate: string; // yyyy-MM-dd
  endDate: string;   // yyyy-MM-dd
}

export interface UpdateAcademicYearRequest {
  name: string;
  startDate: string; // yyyy-MM-dd
  endDate: string;   // yyyy-MM-dd
}

export interface SemesterWindow {
  start: string | null; // ISO-8601 UTC or null
  end: string | null;   // ISO-8601 UTC or null
  status: WindowStatus;
}

export interface SemesterWindows {
  registration: SemesterWindow;
  drop: SemesterWindow;
  withdrawal: SemesterWindow;
  preference: SemesterWindow;
}

export interface ActiveSemester {
  id: number;
  academicYearId: number;
  academicYearName: string;
  name: string;
  semesterType: SemesterType;
  startDate: string;     // yyyy-MM-dd
  endDate: string;       // yyyy-MM-dd
  windows: SemesterWindows;
  serverTimeUtc: string; // ISO-8601 UTC
}

export interface AcademicLevel {
  id: number;
  levelNumber: number;
  name: string;
  nameAr: string;
  fromCredits: number;
  toCredits: number;
  isLastLevel: boolean;
}

export interface AcademicLevelsResponse {
  policyVersionId: number;
  policyTotalCredits: number;
  levels: AcademicLevel[];
}

export interface UpdateAcademicLevelItem {
  levelNumber: number;
  fromCredits: number;
  toCredits: number;
}

export interface UpdateAcademicLevelsRequest {
  policyVersionId: number;
  levels: UpdateAcademicLevelItem[];
}
