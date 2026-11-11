# FCAI BSU Education Platform — Frontend Architecture & Backend Integration Blueprint

## 1. Executive Summary

This document describes the frontend software architecture of the **Faculty of Computers & Artificial Intelligence (FCAI) Beni Suef University Education Platform**.

The platform is designed to support **106 user-facing screens** across 5 distinct institutional roles:
- **Student Portal** (Academic courses, timetable, attendance, assignments, exams, grades, fees, service requests)
- **Doctor / Instructor Portal** (Course management, syllabus, exam builder, live QR attendance, grade packages)
- **Teaching Assistant Portal** (Lab sections, lab attendance, assignment grading, office hours)
- **College Administration Portal** (Governance, master student/staff directories, grade approval, fee generation)
- **SuperAdmin / System Operations** (RBAC permissions, system toggles, cybersecurity policies, audit logs)

The frontend architecture is organized around **unidirectional data flow**, **clean separation of presentation from data transport**, and a **dedicated, human-ready API layer** prepared for manual backend integration.

---

## 2. High-Level Architectural Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE LAYER                            │
│  (106 Screens: Student, Doctor, TA, Admin, SuperAdmin, Public, Auth)   │
└─────────────────────────────────┬──────────────────────────────────────┘
                                  │ (Consumes via Custom Hooks)
                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     STATE MANAGEMENT LAYER (Context)                   │
│   • UIContext          (Theme, Sidebar, Mobile Drawer, Toasts)         │
│   • AuthContext        (Session, User Profile, Active Role, Tokens)    │
│   • NotificationContext(Notifications list, Unread badges, Actions)    │
│   • AcademicContext    (Student courses, Semester registration status) │
└─────────────────────────────────┬──────────────────────────────────────┘
                                  │ (Dispatches asynchronous actions)
                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       DEDICATED API LAYER                              │
│   • src/api/auth.api.ts         (Authentication, Passwords, Tokens)    │
│   • src/api/student.api.ts      (Courses, Timetable, Attendance, Fees) │
│   • src/api/doctor.api.ts       (Exams, QR Attendance, Grade Packages)│
│   • src/api/ta.api.ts           (Lab Sections, Lab Grading, Schedule)  │
│   • src/api/admin.api.ts        (Governance, Directories, Approvals)   │
│   • src/api/superadmin.api.ts   (RBAC, Policies, Gateways, Audit Logs) │
│   • src/api/notification.api.ts (Inbox, Read Status, Count)            │
│   • src/api/ai.api.ts           (Study PDFs, RAG Copilot, Chat)        │
└─────────────────────────────────┬──────────────────────────────────────┘
                                  │ (Uses Centralized Endpoints Catalog)
                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   HTTP TRANSPORT & CLIENT CONFIGURATION                │
│   • src/api/endpoints.ts   (Single source of truth for API paths)      │
│   • src/api/client.ts      (Fetch/Axios wrapper, Bearer token, Timeout)│
│   • src/config/env.ts      (VITE_API_BASE_URL, VITE_USE_MOCK_API)      │
└─────────────────────────────────┬──────────────────────────────────────┘
                                  │ (HTTP REST Requests / JSON)
                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  PRODUCTION BACKEND REST API SERVER                    │
│        (FastAPI, Node.js/Express, Spring Boot, ASP.NET, Django)        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Directory Layout & Layer Responsibilities

```
Education platform/
├── src/
│   ├── api/                       # Dedicated API Layer for Manual Backend Integration
│   │   ├── client.ts              # Centralized HTTP transport client (Bearer token, timeouts, ApiError)
│   │   ├── endpoints.ts           # Centralized catalog of all backend endpoint route constants
│   │   ├── auth.api.ts            # Auth & Identity API functions
│   │   ├── student.api.ts         # Student Portal API functions
│   │   ├── doctor.api.ts          # Doctor / Instructor Portal API functions
│   │   ├── ta.api.ts              # Teaching Assistant Portal API functions
│   │   ├── admin.api.ts           # College Administration API functions
│   │   ├── superadmin.api.ts      # SuperAdmin & System Governance API functions
│   │   ├── notification.api.ts    # Notifications API functions
│   │   ├── ai.api.ts              # AI Study Assistant & RAG Copilot API functions
│   │   └── index.ts               # Central barrel export
│   │
│   ├── config/                    # Application Configuration
│   │   └── env.ts                 # Type-safe environment variable reader (VITE_API_BASE_URL, etc.)
│   │
│   ├── context/                   # Global State Management (React Context API)
│   │   ├── UIContext.tsx          # Shell layout, theme (light/dark), sidebar, toasts
│   │   ├── AuthContext.tsx        # Authentication, JWT session, active user, portal role
│   │   ├── NotificationContext.tsx# Notifications inbox, unread counter badge
│   │   ├── AcademicContext.tsx    # Student semester courses, registration open/closed status
│   │   └── index.tsx              # Root AppProviders wrapper and custom hook exports
│   │
│   ├── types/                     # TypeScript Type Definitions
│   │   ├── index.ts               # Core domain entities (User, Course, Exam, Assignment, Fee, etc.)
│   │   ├── api.ts                 # Central API barrel re-exporting all request/response DTOs
│   │   └── api/                   # Modular request/response interfaces per domain
│   │       ├── common.types.ts    # ApiResponse<T>, PaginatedResponse<T>, ApiErrorResponse
│   │       ├── auth.types.ts      # LoginRequest, RegisterRequest, RefreshTokenResponse
│   │       ├── student.types.ts   # StudentDashboardResponse, CourseRegistrationRequest, etc.
│   │       ├── doctor.types.ts    # CreateExamBlueprintRequest, AttendanceSessionResponse, etc.
│   │       ├── ta.types.ts        # SectionAttendanceResponse, GradeSectionSubmissionRequest
│   │       ├── admin.types.ts     # CreateStudentAccountRequest, ResolveServiceRequestPayload
│   │       ├── superadmin.types.ts# SystemConfigResponse, SecurityConfigResponse, AuditLogEntry
│   │       ├── notification.types.ts
│   │       └── ai.types.ts
│   │
│   ├── components/                # Reusable UI Component Library
│   │   ├── auth/                  # Login illustration and authentication widgets
│   │   ├── common/                # Radial gauges, animated counters, skeletons, modals, badges
│   │   ├── icons/                 # SVG icon system (Icon.tsx, FCAILogo)
│   │   └── layout/                # AppShell, Topbar, Sidebar, BottomNav, MobileDrawer, Breadcrumbs
│   │
│   ├── pages/                     # 106 Screen Pages grouped by domain
│   │   ├── auth/                  # Login, Signup, ForgotPassword, ResetPassword, FirstLogin
│   │   ├── student/               # 34 Student screens (Courses, Grades, Fees, Exams, Timetable)
│   │   ├── doctor/                # 25 Doctor screens (Offerings, QR Attendance, Exam Builder)
│   │   ├── ta/                    # 6 TA screens (Lab Sections, Lab Attendance, Grading)
│   │   ├── admin/                 # 29 Admin screens (Directories, Bylaws, Approvals, Fees)
│   │   ├── superadmin/            # 5 SuperAdmin screens (RBAC, Audit Logs, Gateways)
│   │   ├── employee/              # 3 Staff screens (Student lookup, Service requests)
│   │   ├── public/                # 5 Public landing pages (Departments, Metrics, FAQ)
│   │   └── common/                # HomePage, ScreensDirectory, FigmaExportHub, Notifications
│   │
│   ├── services/                  # Fallback & Mock Data Layer (preserves prototype functionality)
│   │   ├── api.ts                 # Unified facade routing to real vs mock data
│   │   ├── fakeApi.ts             # Compatibility bridge for legacy components
│   │   └── mockDataApi.ts         # In-memory mock database for offline previews
│   │
│   ├── styles/                    # Stylesheets
│   │   └── app.css                # Platform-wide CSS design system, cyber glass, buttons, themes
│   │
│   ├── App.tsx                    # Root hash router and screen mapper
│   └── main.tsx                   # React 19 entry point
│
├── docs/                          # Comprehensive Architectural & Integration Documentation
│   ├── FRONTEND_ARCHITECTURE.md   # This document
│   ├── API_INTEGRATION_GUIDE.md   # Step-by-step endpoint implementation manual
│   ├── STATE_MANAGEMENT_GUIDE.md  # Context & hook guide
│   ├── FILE_BY_FILE_CATALOG.md    # Exhaustive breakdown of every relevant file
│   └── DEVELOPER_HANDOFF.md       # Quick-start manual integration checklist
│
├── .env                           # Local environment configuration
├── .env.example                   # Template environment configuration
├── package.json                   # React 19, TypeScript 6, Tailwind CSS 4, Vite 8
└── tsconfig.app.json              # TypeScript compiler configuration
```

---

## 4. Architectural Principles

### 4.1 Strict Separation of Concerns
- **UI Components** (`src/pages/*`, `src/components/*`): Only render markup, bind form inputs, and invoke actions from hooks or dedicated API modules. Zero HTTP request formatting or URL logic lives inside JSX.
- **Context / Hooks** (`src/context/*`): Hold shared cross-component state (authentication, theme, notifications, active courses).
- **API Modules** (`src/api/*`): Pure functions taking typed parameters and returning typed promises. No UI state or JSX.
- **Endpoints Catalog** (`src/api/endpoints.ts`): Single source of truth for URL paths. Never hardcode `/api/v1/...` strings in components.

### 4.2 Safe Offline Prototyping & Incremental Backend Integration
- The platform contains a robust fallback layer (`src/services/api.ts` & `src/services/mockDataApi.ts`).
- When `VITE_USE_MOCK_API=true` in `.env`, the entire application runs offline with mock data.
- When `VITE_USE_MOCK_API=false`, calls flow to your real backend.
- You can integrate endpoints **one by one** without breaking the rest of the application!

### 4.3 Human-Readable, Standard TypeScript
- No complex or obscure metaprogramming.
- Explicit TypeScript interfaces for every request payload and response body.
- Clear `TODO: [Backend Integration]` comments in every file indicating where to implement real calls.
