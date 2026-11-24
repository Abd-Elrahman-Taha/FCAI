/**
 * Frontend-Only Preview Data Layer (Unintegrated Future Phases)
 *
 * IMPORTANT:
 * - Used ONLY by existing frontend-only UI pages whose backend APIs belong to
 *   unfinished future phases (Phases 3–18).
 * - NOT used for Authentication, Academic Years, Academic Levels, or Active Semester.
 * - NOT an API fallback proxy — integrated features call `src/services/api.ts` directly.
 */

import { mockDataApi } from './mockDataApi';

export const fakeApi = mockDataApi;
export default mockDataApi;
