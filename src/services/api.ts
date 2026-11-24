/**
 * Real Backend API Facade
 *
 * Exposes ONLY the shared API client, in-memory auth session, and confirmed
 * backend domain services. Contains NO mock data imports and NO silent fallback proxy.
 */

import { config } from '../config/env';
import { apiClient, ApiError } from './apiClient';
import { authSession } from './authSession';
import { authService } from './authService';
import { academicYearService } from './academicYearService';
import { academicLevelService } from './academicLevelService';
import { semesterService } from './semesterService';

export const api = {
  config,
  client: apiClient,
  session: authSession,
  auth: authService,
  academicYears: academicYearService,
  academicLevels: academicLevelService,
  semesters: semesterService,
} as const;

export {
  ApiError,
  apiClient,
  authSession,
  authService,
  academicYearService,
  academicLevelService,
  semesterService,
};

export default api;
