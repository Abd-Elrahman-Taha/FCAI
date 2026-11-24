/**
 * Central API Request & Response Types Barrel
 *
 * Re-exports common envelopes, auth contracts, academic contracts,
 * and all 147 OpenAPI-confirmed Swagger DTOs & enums.
 */

export * from './api/common.types';
export * from './api/auth.types';
export * from './api/academic.types';
export * from './api/swagger.types';
export type {
  CreateAcademicYearRequest,
  UpdateAcademicYearRequest,
  UpdateAcademicLevelsRequest,
} from './api/academic.types';
