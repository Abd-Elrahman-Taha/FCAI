/**
 * Real Backend API Facade — All 136 Confirmed Swagger Endpoints
 *
 * Single unified entry point exposing the shared API client, auth session,
 * and every Swagger-confirmed domain service. Zero mock fallbacks.
 */

import { config } from '../config/env';
import { apiClient, ApiError } from './apiClient';
import { authSession } from './authSession';
import { authService } from './authService';
import { academicYearService } from './academicYearService';
import { academicLevelService } from './academicLevelService';
import { semesterService } from './semesterService';
import { courseService } from './courseService';
import { departmentService } from './departmentService';
import { policyService } from './policyService';
import { curriculumService } from './curriculumService';
import { adminPeopleService } from './adminPeopleService';
import { profileService } from './profileService';

export const api = {
  config,
  client: apiClient,
  session: authSession,
  auth: authService,
  academicYears: academicYearService,
  academicLevels: academicLevelService,
  semesters: semesterService,
  courses: courseService,
  departments: departmentService,
  policies: policyService,
  curriculum: curriculumService,
  people: adminPeopleService,
  profile: profileService,
} as const;

export {
  ApiError,
  apiClient,
  authSession,
  authService,
  academicYearService,
  academicLevelService,
  semesterService,
  courseService,
  departmentService,
  policyService,
  curriculumService,
  adminPeopleService,
  profileService,
};

export default api;
