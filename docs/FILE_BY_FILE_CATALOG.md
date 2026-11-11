# File-by-File Architectural & Integration Catalog

This catalog documents every architectural and API file in the codebase. Use this as your reference to understand what each file does, its dependencies, and what you need to implement next.

---

## 1. Central API Layer (`src/api/`)

### 1.1 `src/api/client.ts`
- **Location**: `src/api/client.ts`
- **What it does**: Provides the centralized HTTP transport client wrapper around browser `fetch`.
- **Why it exists**: To eliminate repeated fetch/axios boilerplate, automatically inject JWT Bearer tokens from localStorage, apply timeout AbortControllers, and standardize error handling throwing `ApiError`.
- **How it works**:
  - `apiClient.get(url, params)`
  - `apiClient.post(url, body)`
  - `apiClient.put(url, body)`
  - `apiClient.patch(url, body)`
  - `apiClient.delete(url)`
  - `apiClient.upload(url, formData)`
- **Dependencies**: `src/config/env.ts`, `src/types/api/common.types.ts`.
- **Consumers**: All `src/api/*.api.ts` domain modules.
- **What to do next**: Leave as is, or replace the internal `fetch` call with `axios` if your backend team standardizes on Axios.

---

### 1.2 `src/api/endpoints.ts`
- **Location**: `src/api/endpoints.ts`
- **What it does**: Contains the centralized catalog of all backend REST API endpoint path constants.
- **Why it exists**: Single source of truth. Prevents hardcoded URLs scattered across hundreds of components.
- **How it works**: Exports grouped constant objects: `AUTH_ENDPOINTS`, `STUDENT_ENDPOINTS`, `DOCTOR_ENDPOINTS`, `TA_ENDPOINTS`, `ADMIN_ENDPOINTS`, `SUPERADMIN_ENDPOINTS`, `NOTIFICATION_ENDPOINTS`, `AI_ENDPOINTS`.
- **Dependencies**: None.
- **Consumers**: All `src/api/*.api.ts` domain modules.
- **What to do next**: When your backend routes are finalized, update the path strings in this file to match your backend's exact route naming.

---

### 1.3 `src/api/auth.api.ts`
- **Location**: `src/api/auth.api.ts`
- **What it does**: Dedicated API module for authentication and account security.
- **Why it exists**: Separates authentication transport logic from React UI components.
- **How it works**: Exports `authApi` with functions: `login`, `register`, `getCurrentUser`, `logout`, `forgotPassword`, `resetPassword`, `completeFirstLoginSetup`, `refreshToken`.
- **Dependencies**: `src/api/client.ts`, `src/api/endpoints.ts`, `src/types/api/auth.types.ts`.
- **Consumers**: `src/context/AuthContext.tsx`, `src/pages/auth/Login.tsx`, `src/pages/auth/Signup.tsx`.
- **API Operations to implement**:
  - `POST /auth/login` (send credentials, receive token and user object)
  - `POST /auth/register` (new student/staff enrollment request)
  - `GET /auth/me` (fetch current authenticated user profile)
  - `POST /auth/logout` (revoke session)
  - `POST /auth/forgot-password` & `POST /auth/reset-password`
  - `POST /auth/first-login-setup`
- **What to do next**: Open this file and replace the `throw new Error(...)` placeholders with your real `apiClient.post` calls.

---

### 1.4 `src/api/student.api.ts`
- **Location**: `src/api/student.api.ts`
- **What it does**: Dedicated API module for all Student Portal operations.
- **Why it exists**: Provides clean functions for courses, grades, exams, fees, timetable, and attendance.
- **How it works**: Exports `studentApi` with 25+ typed functions matching student screens 8 to 41.
- **Dependencies**: `src/api/client.ts`, `src/api/endpoints.ts`, `src/types/api/student.types.ts`.
- **Consumers**: `src/context/AcademicContext.tsx`, `src/pages/student/*`.
- **API Operations to implement**:
  - `GET /student/dashboard`
  - `GET /student/courses` & `DELETE /student/courses/:id`
  - `GET /student/registration/offerings` & `POST /student/registration/enroll`
  - `GET /student/timetable`
  - `GET /student/attendance` & `POST /student/attendance/verify-qr`
  - `GET /student/assignments` & `POST /student/assignments/:id/submit`
  - `GET /student/grades` & `GET /student/gpa-history`
  - `GET /student/fees` & `POST /student/fees/:id/pay-fawry`
  - `GET /student/exams` & `POST /student/exams/:id/submit`
  - `GET /student/service-requests` & `POST /student/service-requests`
- **What to do next**: Implement the HTTP requests using `apiClient.get/post/delete`.

---

### 1.5 `src/api/doctor.api.ts`
- **Location**: `src/api/doctor.api.ts`
- **What it does**: Dedicated API module for Doctor / Instructor portal operations.
- **Why it exists**: Provides functions for lecture syllabus, assignments, exam blueprints, live QR attendance, and grade packages.
- **How it works**: Exports `doctorApi` matching doctor screens 42 to 66.
- **Dependencies**: `src/api/client.ts`, `src/api/endpoints.ts`, `src/types/api/doctor.types.ts`.
- **Consumers**: `src/pages/doctor/*`.
- **API Operations to implement**:
  - `GET /doctor/dashboard`
  - `GET /doctor/courses` & `GET /doctor/courses/:id/roster`
  - `POST /doctor/courses/:id/materials` (upload slides)
  - `POST /doctor/exams` (save blueprint) & `PATCH /doctor/exams/:id/publish`
  - `POST /doctor/attendance/session` (start rotating QR) & `POST /doctor/attendance/close`
  - `POST /doctor/grade-packages/submit` (submit grades to Dean)
- **What to do next**: Open this file and write the HTTP requests.

---

### 1.6 `src/api/ta.api.ts`
- **Location**: `src/api/ta.api.ts`
- **What it does**: Dedicated API module for Teaching Assistant operations.
- **Why it exists**: Handles lab sections, lab attendance check-ins, lab practical submissions, and grading.
- **How it works**: Exports `taApi` matching TA screens 67 to 72.
- **Dependencies**: `src/api/client.ts`, `src/api/endpoints.ts`, `src/types/api/ta.types.ts`.
- **Consumers**: `src/pages/ta/*`.
- **API Operations to implement**:
  - `GET /ta/dashboard`
  - `GET /ta/sections` & `GET /ta/sections/:id/attendance`
  - `POST /ta/submissions/:id/grade`
- **What to do next**: Open this file and connect to your TA backend endpoints.

---

### 1.7 `src/api/admin.api.ts`
- **Location**: `src/api/admin.api.ts`
- **What it does**: Dedicated API module for College Administration & Governance.
- **Why it exists**: Handles directories, curriculum management, grade package approvals, and fee generation.
- **How it works**: Exports `adminApi` matching admin screens 73 to 101.
- **Dependencies**: `src/api/client.ts`, `src/api/endpoints.ts`, `src/types/api/admin.types.ts`.
- **Consumers**: `src/pages/admin/*`.
- **API Operations to implement**:
  - `GET /admin/dashboard`
  - `GET /admin/students` & `POST /admin/students`
  - `GET /admin/departments`
  - `POST /admin/grade-packages/:id/approve` & `POST /admin/grade-packages/:id/reject`
  - `POST /admin/service-requests/:id/resolve`
- **What to do next**: Open this file and connect to your administration endpoints.

---

### 1.8 `src/api/superadmin.api.ts`
- **Location**: `src/api/superadmin.api.ts`
- **What it does**: Dedicated API module for SuperAdmin operations.
- **Why it exists**: System configuration, RBAC permissions, audit logs, security policies.
- **How it works**: Exports `superAdminApi` matching screens 102 to 106.
- **Dependencies**: `src/api/client.ts`, `src/api/endpoints.ts`, `src/types/api/superadmin.types.ts`.
- **Consumers**: `src/pages/superadmin/*`.
- **What to do next**: Implement the HTTP requests when setting up system governance.

---

### 1.9 `src/api/notification.api.ts`
- **Location**: `src/api/notification.api.ts`
- **What it does**: Dedicated API module for user notification feed.
- **Why it exists**: Handles fetching notifications, marking read, and real-time badge counters.
- **How it works**: Exports `notificationApi` with `getNotifications`, `markAsRead`, `markAllAsRead`, `getUnreadCount`.
- **Dependencies**: `src/api/client.ts`, `src/api/endpoints.ts`, `src/types/api/notification.types.ts`.
- **Consumers**: `src/context/NotificationContext.tsx`, `src/pages/common/NotificationsPage.tsx`.
- **What to do next**: Implement `GET /notifications` and `PATCH /notifications/:id/read`.

---

### 1.10 `src/api/ai.api.ts`
- **Location**: `src/api/ai.api.ts`
- **What it does**: Dedicated API module for the AI Study Assistant & RAG Copilot.
- **Why it exists**: Handles lecture PDF upload for vector embedding and chat completions.
- **How it works**: Exports `aiApi` with `getStudyDocuments`, `uploadStudyPdf`, `getPdfChatHistory`, `sendChatMessage`.
- **Dependencies**: `src/api/client.ts`, `src/api/endpoints.ts`, `src/types/api/ai.types.ts`.
- **Consumers**: `src/pages/student/StudentStudyAssistant.tsx`, `src/components/common/AICopilotWidget.tsx`.
- **What to do next**: Implement endpoints connecting to your Python / FastAPI LLM service.

---

## 2. Context & State Management (`src/context/`)

### 2.1 `src/context/UIContext.tsx`
- **Location**: `src/context/UIContext.tsx`
- **What it does**: Manages presentation state: dark/light theme, sidebar collapse, mobile drawer, toast messages.
- **Why it exists**: Decouples presentation and layout state from authentication.
- **Consumers**: AppShell, Topbar, Sidebar, MobileDrawer, ToastContainer, all pages displaying toasts.

### 2.2 `src/context/AuthContext.tsx`
- **Location**: `src/context/AuthContext.tsx`
- **What it does**: Manages authentication state: `currentUser`, `isAuthenticated`, `role`, `login`, `logout`, `switchRole`.
- **Why it exists**: Single source of truth for the active institutional session.
- **Consumers**: App.tsx (route protection), Topbar, Login.tsx, and all pages needing user details.

### 2.3 `src/context/NotificationContext.tsx`
- **Location**: `src/context/NotificationContext.tsx`
- **What it does**: Manages notifications list, unread badge counter, and mark-as-read actions.
- **Why it exists**: Allows Topbar and NotificationsPage to share live notification state without prop drilling.
- **Consumers**: Topbar (bell badge), NotificationsPage.

### 2.4 `src/context/AcademicContext.tsx`
- **Location**: `src/context/AcademicContext.tsx`
- **What it does**: Manages student enrolled courses, active semester registration status, drop/add actions.
- **Why it exists**: Keeps course counts in Topbar, Dashboard, and Course Registration synchronized.
- **Consumers**: StudentDashboard, StudentCourses, StudentRegistration.

### 2.5 `src/context/index.tsx`
- **Location**: `src/context/index.tsx`
- **What it does**: Root barrel export providing `AppProviders` and re-exporting all custom hooks: `useAuth()`, `useUI()`, `useNotifications()`, `useAcademic()`.
- **Why it exists**: Mounts all providers in clean dependency order in `src/App.tsx`.
- **Consumers**: `src/App.tsx`.

---

## 3. Configuration & Types (`src/config/` & `src/types/`)

### 3.1 `src/config/env.ts`
- **Location**: `src/config/env.ts`
- **What it does**: Type-safe accessor for environment variables:
  - `apiBaseUrl`: Defaults to `http://localhost:8000/api/v1` (or `VITE_API_BASE_URL`)
  - `useMockApi`: Defaults to `true` (switch to `false` when backend is running)
  - `requestTimeoutMs`: Timeout in ms (defaults to 15,000)
  - `enableApiLogging`: Enables `[API REQ]` / `[API RES]` console logging in dev mode.
- **Consumers**: `src/api/client.ts`, `src/services/api.ts`.

### 3.2 `src/types/api.ts` & `src/types/api/*.types.ts`
- **Location**: `src/types/api.ts` and `src/types/api/`
- **What it does**: Contains all data transfer contracts (DTOs) for request payloads and response bodies.
- **Why it exists**: Guarantees type safety between frontend API calls and backend contracts.
