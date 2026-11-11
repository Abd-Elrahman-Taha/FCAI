# Developer Handoff & Quick Start Integration Guide

Welcome to the **FCAI BSU Education Platform** codebase!

This project has been thoroughly inspected, refactored, and prepared for your manual backend integration.

**The frontend is 100% prepared. You do NOT need to restructure files, rename folders, or build API infrastructure.**

All you need to do is write your API requests and connect your endpoints!

---

## 1. Quick Environment Setup

1. Verify dependencies are installed:
   ```bash
   npm install
   ```

2. Open `.env` (or copy from `.env.example`):
   ```bash
   # Set your backend server URL:
   VITE_API_BASE_URL=http://localhost:8000/api/v1

   # Keep "true" to test with offline mock data;
   # Change to "false" when your backend server is running:
   VITE_USE_MOCK_API=false

   # Enable helpful console logs for every request:
   VITE_ENABLE_API_LOGGING=true
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Verify production build at any time:
   ```bash
   npm run build
   ```

---

## 2. Recommended Order of Integration

To ensure smooth progress, we strongly recommend implementing backend endpoints in this sequence:

### Phase 1: Authentication & Identity (Priority 1)
- **Files**: `src/api/auth.api.ts`, `src/context/AuthContext.tsx`
- **Endpoints**:
  1. `POST /auth/login`: Authenticate student or staff member and return JWT token.
  2. `GET /auth/me`: Fetch authenticated user profile using Bearer token.
  3. `POST /auth/logout`: Revoke active session token.
- **Verification**: Sign in from `#/login` and verify that the user name, role badge, and profile load from your database.

---

### Phase 2: Student Core Features (Priority 2)
- **Files**: `src/api/student.api.ts`, `src/pages/student/*`
- **Endpoints**:
  1. `GET /student/dashboard`: KPIs (GPA, attendance rate, courses count), schedule, and alerts.
  2. `GET /student/courses`: Enrolled courses list.
  3. `GET /student/timetable`: Weekly lecture and lab schedule.
  4. `GET /student/attendance` & `POST /student/attendance/verify-qr`: Attendance history and QR verification.
  5. `GET /student/grades` & `GET /student/gpa-history`: Cumulative GPA trajectory and letter grades.
  6. `GET /student/fees` & `POST /student/fees/:id/pay-fawry`: Tuition dues and payment gateway.
- **Verification**: Navigate through student screens (`#/student/dashboard`, `#/student/courses`, `#/student/grades`, `#/student/fees`).

---

### Phase 3: Doctor / Instructor Operations (Priority 3)
- **Files**: `src/api/doctor.api.ts`, `src/pages/doctor/*`
- **Endpoints**:
  1. `GET /doctor/dashboard` & `GET /doctor/courses`: Courses taught by doctor.
  2. `GET /doctor/courses/:id/roster`: Enrolled student list.
  3. `POST /doctor/attendance/session` & `POST /doctor/attendance/close`: Live dynamic QR session with 10s token rotation.
  4. `POST /doctor/exams` & `PATCH /doctor/exams/:id/publish`: Exam builder blueprints.
  5. `POST /doctor/grade-packages/submit`: Submit semester grade package to Dean.
- **Verification**: Switch role to Doctor (`#/doctor/dashboard`) and test launching an attendance session (`#/doctor/attendance`).

---

### Phase 4: Teaching Assistant Portal (Priority 4)
- **Files**: `src/api/ta.api.ts`, `src/pages/ta/*`
- **Endpoints**:
  1. `GET /ta/dashboard` & `GET /ta/sections`: Assigned lab sections.
  2. `GET /ta/sections/:id/attendance`: Lab section attendance roster.
  3. `POST /ta/submissions/:id/grade`: Grade student lab practical task.
- **Verification**: Browse TA portal (`#/ta/dashboard`, `#/ta/sections`).

---

### Phase 5: College Administration & SuperAdmin (Priority 5)
- **Files**: `src/api/admin.api.ts`, `src/api/superadmin.api.ts`
- **Endpoints**:
  1. `GET /admin/dashboard` & `GET /admin/students`: Student master directory.
  2. `POST /admin/grade-packages/:id/approve` & `/reject`: Dean grade package approval.
  3. `POST /admin/service-requests/:id/resolve`: Resolve Student Affairs requests.
  4. `GET /superadmin/roles` & `GET /superadmin/audit-logs`.
- **Verification**: Browse Admin portal (`#/admin/dashboard`, `#/admin/students`).

---

## 3. How to Connect a Page to Your Real API

Example: Connecting `src/pages/student/StudentCourses.tsx`

1. Open `src/api/student.api.ts` and implement `getMyCourses`:
   ```ts
   // In src/api/student.api.ts:
   export const studentApi = {
     async getMyCourses(): Promise<Course[]> {
       return apiClient.get<Course[]>(STUDENT_ENDPOINTS.COURSES);
     },
     // ...
   };
   ```

2. In `src/pages/student/StudentCourses.tsx`, switch from `fakeApi` to `studentApi`:
   ```tsx
   // Replace:
   // fakeApi.getMyCourses().then(res => setCourses(res));

   // With:
   import { studentApi } from '../../api/student.api';

   useEffect(() => {
     studentApi.getMyCourses()
       .then(res => {
         setCourses(res);
         setLoading(false);
       })
       .catch(err => {
         showToast('Error', err.message, 'error');
         setLoading(false);
       });
   }, []);
   ```

That is all! You have full type safety, automatic error handling, and clean architecture.

---

## 4. Key Implementation Notes

1. **Tokens Storage**: JWT tokens are automatically read from and written to `localStorage` under `fcai_token` by `tokenStorage` (`src/api/client.ts`).
2. **Session Expiry (401)**: If any backend request returns HTTP `401 Unauthorized`, `apiClient` automatically removes the token, broadcasts a `fcai:unauthorized` window event, and `AuthContext` redirects to `#/login` with an informative toast message.
3. **Multipart File Uploads**: Use `apiClient.upload(url, formData)` for file uploads (e.g. assignment submissions, lecture slides, study PDFs). It avoids setting `Content-Type: application/json` so the browser properly formats multipart boundary headers.
4. **Offline Mode**: If your backend server goes down during development, set `VITE_USE_MOCK_API=true` in `.env` to keep working on the frontend without interruptions.
