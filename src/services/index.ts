/**
 * Central Services Index
 *
 * Exports the shared API client, in-memory session store, confirmed endpoints,
 * and integrated backend domain services.
 */

export {
  api,
  ApiError,
  apiClient,
  authSession,
  authService,
  academicYearService,
  academicLevelService,
  semesterService,
} from './api';
export * from './endpoints';
