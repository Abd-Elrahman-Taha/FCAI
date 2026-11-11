# Manual Backend API Integration Guide

This guide is written specifically for the backend/frontend engineer who will **manually write the API requests, connect endpoints, and handle responses**.

---

## 1. Intended Developer Workflow

For every feature you want to integrate with your real backend, follow these 5 steps:

```
Step 1: Check/Update Endpoint Path
   └── Open `src/api/endpoints.ts`
       Verify or adjust the route constant (e.g. `STUDENT_ENDPOINTS.COURSES`)

Step 2: Implement the HTTP Call
   └── Open the domain API file (e.g. `src/api/student.api.ts`)
       Replace the placeholder throw statement with your `apiClient` call (or Axios)

Step 3: Define/Verify TypeScript Types
   └── Check `src/types/api/` for the expected request payload and response DTO

Step 4: Connect to Context or Component
   └── If global state is needed, connect to `src/context/`
   └── If local to a page, import the API function directly in `src/pages/...`

Step 5: Test with Backend Server
   └── In `.env`, set `VITE_USE_MOCK_API=false`
   └── Ensure your backend server is running on `VITE_API_BASE_URL` (e.g. http://localhost:8000/api/v1)
   └── Test in your browser and check browser console (`[API REQ]`, `[API RES]`)
```

---

## 2. Using the Centralized HTTP Client (`src/api/client.ts`)

The project provides a pre-configured `apiClient` singleton. It automatically handles:
- Base URL (`VITE_API_BASE_URL`)
- Authorization header injection (`Bearer <token>` from `localStorage`)
- Request timeout via `AbortController` (defaults to 15,000ms, configurable via `VITE_API_TIMEOUT_MS`)
- Automatic JSON serialization and header setting (`Content-Type: application/json`)
- Multipart/FormData file uploads
- Automatic unwrapping of standard `{ success: true, data: T }` responses
- 401 Unauthorized event dispatching to gracefully expire sessions

### Syntax Examples:

#### GET Request with query parameters:
```ts
import { apiClient } from './client';
import { STUDENT_ENDPOINTS } from './endpoints';
import type { Course } from '../types';

export async function getMyCourses(): Promise<Course[]> {
  return apiClient.get<Course[]>(STUDENT_ENDPOINTS.COURSES, { semester: 'Fall2026' });
}
```

#### POST Request with JSON payload:
```ts
import { apiClient } from './client';
import { STUDENT_ENDPOINTS } from './endpoints';
import type { CourseRegistrationRequest, Course } from '../types/api';

export async function registerCourse(payload: CourseRegistrationRequest): Promise<{ success: boolean; course: Course }> {
  return apiClient.post<{ success: boolean; course: Course }>(STUDENT_ENDPOINTS.REGISTER_COURSE, payload);
}
```

#### POST Multipart File Upload:
```ts
import { apiClient } from './client';
import { STUDENT_ENDPOINTS } from './endpoints';

export async function submitAssignmentFile(assignmentId: string, file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return apiClient.upload(STUDENT_ENDPOINTS.SUBMIT_ASSIGNMENT(assignmentId), formData);
}
```

#### Custom Axios Option (Alternative):
If your backend team prefers `axios`, simply install it (`npm install axios`) and replace the transport inside `src/api/client.ts`. All domain API functions will instantly use Axios with zero changes to your components!

---

## 3. Endpoints Catalog & Status Matrix

| Domain | Feature / Operation | HTTP Method | Endpoint | Auth Required | Status |
| :--- | :--- | :---: | :--- | :---: | :--- |
| **Auth** | User Login | `POST` | `/auth/login` | None | `READY FOR INTEGRATION` |
| **Auth** | User Registration | `POST` | `/auth/register` | None | `BACKEND CONTRACT REQUIRED` |
| **Auth** | Current User Profile | `GET` | `/auth/me` | Bearer Token | `READY FOR INTEGRATION` |
| **Auth** | Session Logout | `POST` | `/auth/logout` | Bearer Token | `READY FOR INTEGRATION` |
| **Auth** | Forgot Password Link | `POST` | `/auth/forgot-password` | None | `READY FOR INTEGRATION` |
| **Auth** | Reset Password | `POST` | `/auth/reset-password` | None | `READY FOR INTEGRATION` |
| **Auth** | First-Login Security Setup | `POST` | `/auth/first-login-setup` | Bearer Token | `READY FOR INTEGRATION` |
| **Auth** | Refresh Access Token | `POST` | `/auth/refresh-token` | Refresh Token | `BACKEND CONTRACT REQUIRED` |
| **Student**| Dashboard KPI & Schedule | `GET` | `/student/dashboard` | Student Token | `READY FOR INTEGRATION` |
| **Student**| Student Profile | `GET` | `/student/profile` | Student Token | `READY FOR INTEGRATION` |
| **Student**| Enrolled Courses List | `GET` | `/student/courses` | Student Token | `READY FOR INTEGRATION` |
| **Student**| Course Details | `GET` | `/courses/:id` | Bearer Token | `READY FOR INTEGRATION` |
| **Student**| Course Learning Materials | `GET` | `/courses/:id/materials` | Student Token | `BACKEND CONTRACT REQUIRED` |
| **Student**| Drop Enrolled Course | `DELETE`| `/student/courses/:id` | Student Token | `READY FOR INTEGRATION` |
| **Student**| Registration Catalog | `GET` | `/student/registration/offerings` | Student Token | `READY FOR INTEGRATION` |
| **Student**| Register Course Offering | `POST` | `/student/registration/enroll` | Student Token | `READY FOR INTEGRATION` |
| **Student**| Weekly Timetable | `GET` | `/student/timetable` | Student Token | `READY FOR INTEGRATION` |
| **Student**| Attendance Overview | `GET` | `/student/attendance` | Student Token | `READY FOR INTEGRATION` |
| **Student**| Verify QR Attendance | `POST` | `/student/attendance/verify-qr` | Student Token | `READY FOR INTEGRATION` |
| **Student**| Assignments List | `GET` | `/student/assignments` | Student Token | `READY FOR INTEGRATION` |
| **Student**| Submit Assignment | `POST` | `/student/assignments/:id/submit`| Student Token | `READY FOR INTEGRATION` |
| **Student**| Published Grades | `GET` | `/student/grades` | Student Token | `READY FOR INTEGRATION` |
| **Student**| Cumulative GPA History | `GET` | `/student/gpa-history` | Student Token | `READY FOR INTEGRATION` |
| **Student**| Tuition Billing Fees | `GET` | `/student/fees` | Student Token | `READY FOR INTEGRATION` |
| **Student**| Fawry Payment Gateway | `POST` | `/student/fees/:id/pay-fawry` | Student Token | `BACKEND CONTRACT REQUIRED` |
| **Student**| Official Receipt Voucher | `GET` | `/student/receipts/:id` | Student Token | `READY FOR INTEGRATION` |
| **Student**| Exams List | `GET` | `/student/exams` | Student Token | `READY FOR INTEGRATION` |
| **Student**| Exam Player Questions | `GET` | `/student/exams/:id` | Student Token | `READY FOR INTEGRATION` |
| **Student**| Submit Exam Answers | `POST` | `/student/exams/:id/submit` | Student Token | `READY FOR INTEGRATION` |
| **Student**| Exam Result Review | `GET` | `/student/exams/:id/result` | Student Token | `READY FOR INTEGRATION` |
| **Student**| Service Requests List | `GET` | `/student/service-requests` | Student Token | `READY FOR INTEGRATION` |
| **Student**| Create Service Request | `POST` | `/student/service-requests` | Student Token | `READY FOR INTEGRATION` |
| **Doctor** | Doctor Dashboard KPIs | `GET` | `/doctor/dashboard` | Doctor Token | `READY FOR INTEGRATION` |
| **Doctor** | Doctor Assigned Courses | `GET` | `/doctor/courses` | Doctor Token | `READY FOR INTEGRATION` |
| **Doctor** | Course Enrolled Roster | `GET` | `/doctor/courses/:id/roster` | Doctor Token | `READY FOR INTEGRATION` |
| **Doctor** | Upload Lecture Material | `POST` | `/doctor/courses/:id/materials` | Doctor Token | `READY FOR INTEGRATION` |
| **Doctor** | Create Assignment | `POST` | `/doctor/assignments` | Doctor Token | `READY FOR INTEGRATION` |
| **Doctor** | Grade Submission | `POST` | `/doctor/submissions/:id/grade` | Doctor Token | `READY FOR INTEGRATION` |
| **Doctor** | Create Exam Blueprint | `POST` | `/doctor/exams` | Doctor Token | `READY FOR INTEGRATION` |
| **Doctor** | Publish Exam | `PATCH`| `/doctor/exams/:id/publish` | Doctor Token | `READY FOR INTEGRATION` |
| **Doctor** | Start QR Attendance | `POST` | `/doctor/attendance/session` | Doctor Token | `READY FOR INTEGRATION` |
| **Doctor** | Live Attendance Stream | `GET` | `/doctor/attendance/session/:id/live`| Doctor Token | `READY FOR INTEGRATION` |
| **Doctor** | Finalize Attendance | `POST` | `/doctor/attendance/close` | Doctor Token | `READY FOR INTEGRATION` |
| **Doctor** | Submit Grade Package | `POST` | `/doctor/grade-packages/submit`| Doctor Token | `READY FOR INTEGRATION` |
| **TA**     | TA Dashboard | `GET` | `/ta/dashboard` | TA Token | `READY FOR INTEGRATION` |
| **TA**     | Assigned Lab Sections | `GET` | `/ta/sections` | TA Token | `READY FOR INTEGRATION` |
| **TA**     | Lab Section Attendance | `GET` | `/ta/sections/:id/attendance` | TA Token | `READY FOR INTEGRATION` |
| **TA**     | Grade Lab Submission | `POST` | `/ta/submissions/:id/grade` | TA Token | `READY FOR INTEGRATION` |
| **Admin**  | Admin Dashboard Stats | `GET` | `/admin/dashboard` | Admin Token | `READY FOR INTEGRATION` |
| **Admin**  | Students Directory | `GET` | `/admin/students` | Admin Token | `READY FOR INTEGRATION` |
| **Admin**  | Create Student Account | `POST` | `/admin/students` | Admin Token | `READY FOR INTEGRATION` |
| **Admin**  | Approve Grade Package | `POST` | `/admin/grade-packages/:id/approve` | Dean/Admin Token | `READY FOR INTEGRATION` |
| **Admin**  | Reject Grade Package | `POST` | `/admin/grade-packages/:id/reject` | Dean/Admin Token | `READY FOR INTEGRATION` |
| **Admin**  | Resolve Service Request| `POST` | `/admin/service-requests/:id/resolve`| Admin Token | `READY FOR INTEGRATION` |
| **SuperAdmin**| RBAC Roles Matrix | `GET` | `/superadmin/roles` | SuperAdmin Token | `READY FOR INTEGRATION` |
| **SuperAdmin**| Global System Config | `GET` | `/superadmin/system-config` | SuperAdmin Token | `READY FOR INTEGRATION` |
| **SuperAdmin**| Security Policies | `GET` | `/superadmin/security-config` | SuperAdmin Token | `READY FOR INTEGRATION` |
| **SuperAdmin**| Audit Logs | `GET` | `/superadmin/audit-logs` | SuperAdmin Token | `READY FOR INTEGRATION` |
| **Notification**| User Notifications | `GET` | `/notifications` | Bearer Token | `READY FOR INTEGRATION` |
| **Notification**| Mark Single Read | `PATCH`| `/notifications/:id/read` | Bearer Token | `READY FOR INTEGRATION` |
| **Notification**| Mark All Read | `PATCH`| `/notifications/read-all` | Bearer Token | `READY FOR INTEGRATION` |

---

## 4. Error Handling & Status Codes

All API errors thrown by `apiClient` are instances of `ApiError` (`src/api/client.ts`):

```ts
import { ApiError } from '../api/client';

try {
  await studentApi.registerCourse({ offeringId: 'CS301-S2' });
} catch (err: unknown) {
  if (err instanceof ApiError) {
    console.error('Status Code:', err.status); // e.g. 400, 401, 403, 404, 409, 500
    console.error('Backend Detail:', err.data);  // Backend JSON error response body
    console.error('Network Error?', err.isNetworkError); // true if backend server is unreachable
  }
}
```

Standard HTTP status codes supported:
- `200 OK`: Request succeeded.
- `201 Created`: Resource successfully created.
- `400 Bad Request`: Payload validation failed (e.g. invalid student code or missing fields).
- `401 Unauthorized`: Token missing or expired. Automatically clears token and dispatches session expiry.
- `403 Forbidden`: Authenticated user does not possess the required institutional role/permission.
- `404 Not Found`: Resource does not exist.
- `409 Conflict`: Business rule violation (e.g. prerequisite not met, schedule clash, course full).
- `408 Request Timeout`: Backend took longer than `VITE_API_TIMEOUT_MS`.
- `500 Internal Server Error`: Backend exception.
