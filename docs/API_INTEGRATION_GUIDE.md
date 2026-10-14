# FCAI BSU Platform - Real API Integration & Backend Guide

This document explains the architecture of the API layer and provides clear, step-by-step instructions to connect this frontend to your real backend server (such as **FastAPI, Node.js/Express, Spring Boot, ASP.NET, or Django**).

---

## 1. Architecture Overview

The frontend uses a **layered, decoupled service architecture**:

```
[ React 19 UI Pages & Components ]
             │
             ▼
  [ Unified API Facade (`api`) ] ─── (`api.auth`, `api.student`, `api.doctor`, etc.)
             │
      ┌──────┴────────────────────────────────┐
      │ Checks VITE_USE_MOCK_API in `.env`   │
      ▼                                       ▼
[ Real REST Client (`apiClient`) ]    [ In-Memory Mock (`mockDataApi`) ]
      │                                       │
      ▼                                       ▼
(HTTP Fetch + Bearer Token)           (Instant Local Demo Data)
      │
      ▼
[ Real Backend Server ]
(FastAPI / Node / Spring / etc.)
```

### Key Advantages
1. **Single Switch**: Toggle between real backend and simulated demo data simply by changing `VITE_USE_MOCK_API` in `.env`.
2. **Zero Breaking Changes**: Existing screens importing `fakeApi` automatically route through the real backend when mock mode is disabled.
3. **Modular Domain Services**: Clean, typed services in `src/services/` for every domain (`authService`, `studentService`, `doctorService`, `taService`, `adminService`, `superAdminService`, `aiService`).
4. **Automatic JWT Authentication**: The `apiClient` automatically injects `Authorization: Bearer <token>` on all requests once logged in.
5. **Automatic 401 Session Expiration**: If the backend returns HTTP 401, the client automatically clears tokens and redirects to the login screen with a toast notification.

---

## 2. Quick Start: Connecting to Your Real Backend

### Step 1: Configure your `.env` file
In the project root, open or create `.env` (you can copy `.env.example`):

```bash
# 1. Point to your backend URL (e.g. FastAPI / Express / Spring Boot)
VITE_API_BASE_URL=http://localhost:8000/api/v1

# 2. Set mock mode to "false" to enable real HTTP calls
VITE_USE_MOCK_API=false

# 3. Enable debug logging in the browser console
VITE_ENABLE_API_LOGGING=true
```

### Step 2: Configure CORS in your Backend
Your backend must allow requests from the Vite frontend development server (usually `http://localhost:5173` or `http://localhost:5174`).

#### Example: FastAPI (Python)
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

#### Example: Express (Node.js)
```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());
```

---

## 3. Authentication & JWT Tokens

### Login Request Payload (`POST /auth/login`)
When a student or staff member logs in, the frontend sends:

```json
{
  "email": "ahmed.hassan@fcai.bsu.edu.eg",
  "studentCode": "2021170045",
  "nationalId": "30302152201234",
  "password": "UserSecurePassword123!",
  "role": "student",
  "rememberMe": true
}
```

### Expected Login Response
Your backend should return a JSON response with the user profile and a JWT token:

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "usr_std_01",
      "name": "Ahmed Mohamed Hassan",
      "short": "AH",
      "role": "student",
      "roleLabel": "Student",
      "email": "ahmed.hassan@fcai.bsu.edu.eg",
      "studentCode": "2021170045",
      "nationalId": "30302152201234",
      "department": "Computer Science",
      "academicLevel": "Level 3 · Junior",
      "academicStatus": "Active",
      "gpa": 3.42,
      "completedCredits": 74,
      "totalCredits": 132
    }
  }
}
```

*Note: The frontend automatically unwraps `{ success: true, data: { ... } }` and stores `token` in `localStorage` under `fcai_token`.*

---

## 4. Complete REST Endpoints Specification

### 4.1 Authentication & Profile (`src/services/authService.ts`)

| HTTP Method | Endpoint | Description | Request Body / Params |
|---|---|---|---|
| `POST` | `/auth/login` | Institutional login | `{ email?, studentCode?, nationalId?, password, role }` |
| `POST` | `/auth/register` | Student/Staff registration | `{ name, email, password, nationalId, studentCode?, role, department }` |
| `GET` | `/auth/me` | Fetch active user profile | Headers: `Bearer <token>` |
| `POST` | `/auth/logout` | Invalidate active session | Headers: `Bearer <token>` |
| `POST` | `/auth/forgot-password` | Send reset link | `{ email }` |
| `POST` | `/auth/reset-password` | Reset password with token | `{ token, newPassword }` |
| `POST` | `/auth/first-login-setup` | Mandatory initial password change | `{ newPassword, phone }` |
| `GET` | `/notifications` | User notifications list | Query: `?unreadOnly=false` |
| `PATCH` | `/notifications/:id/read` | Mark notification read | — |
| `PATCH` | `/notifications/read-all` | Mark all read | — |

---

### 4.2 Student Portal (`src/services/studentService.ts`)

| HTTP Method | Endpoint | Description | Response Model |
|---|---|---|---|
| `GET` | `/student/dashboard` | Student KPIs, upcoming deadlines, attendance rate | `StudentDashboardDto` |
| `GET` | `/student/courses` | List of enrolled courses | `Course[]` |
| `GET` | `/courses/:id` | Detailed course syllabus, schedule, instructors | `Course` |
| `DELETE` | `/student/courses/:id` | Drop enrolled course | `{ success: boolean }` |
| `GET` | `/student/registration/offerings` | Available courses for credit hour registration | `Course[]` |
| `POST` | `/student/registration/enroll` | Enroll in course | `{ offeringId: string }` |
| `GET` | `/student/timetable` | Weekly timetable sessions | `TimetableSession[]` |
| `GET` | `/student/attendance` | Attendance records and absences | `AttendanceSession[]` |
| `POST` | `/student/attendance/verify-qr` | Verify rotating dynamic QR and GPS location | `{ qrKey, coords: { lat, lng } }` |
| `GET` | `/student/assignments` | Course assignments | `Assignment[]` (filter: `?tab=all/pending/submitted/graded`) |
| `POST` | `/student/assignments/:id/submit`| Submit assignment file | `multipart/form-data` |
| `GET` | `/student/grades` | Semester academic grades & GPA components | `CourseGrade[]` |
| `GET` | `/student/gpa-history` | Cumulative GPA progression chart | `GpaHistoryDto` |
| `GET` | `/student/fees` | Tuition invoices and due payments | `StudentFee[]` |
| `POST` | `/student/fees/:id/pay-fawry` | Generate Fawry payment reference code | `{ referenceNumber, expiryDate }` |
| `GET` | `/student/receipts/:id` | Official paid receipt | `Receipt` |
| `GET` | `/student/exams` | Quizzes, midterms, and finals | `Exam[]` |
| `GET` | `/student/exams/:id` | Single exam with questions for exam player | `Exam` |
| `POST` | `/student/exams/:id/submit` | Submit answers for exam | `{ answers: Record<string, any> }` |
| `GET` | `/student/exams/:id/result` | Exam score breakdown and feedback | `ExamResultDto` |
| `GET` | `/student/service-requests` | Student administrative petitions | `ServiceRequest[]` |
| `POST` | `/student/service-requests` | Submit new petition (Transcript, Student Card, etc.) | `ServiceRequest` |
| `DELETE` | `/student/service-requests/:id`| Cancel pending request | `{ success: boolean }` |
| `GET` | `/student/profile` | Student academic record & contact data | `User` |
| `PATCH` | `/student/profile` | Update contact phone or email | `{ phone, email }` |

---

### 4.3 Doctor / Instructor Portal (`src/services/doctorService.ts`)

| HTTP Method | Endpoint | Description |
|---|---|---|
| `GET` | `/doctor/dashboard` | Doctor overview, teaching schedule, pending grading |
| `GET` | `/doctor/courses` | Courses assigned to this instructor |
| `GET` | `/doctor/courses/:id/roster` | List of enrolled students in course |
| `GET` | `/doctor/exams` | Exam blueprints created by doctor |
| `POST` | `/doctor/exams` | Create new exam / quiz |
| `PATCH` | `/doctor/exams/:id/publish` | Publish exam to student portals |
| `GET` | `/doctor/grade-packages` | Semester grade packages status |
| `POST` | `/doctor/grade-packages/submit`| Submit final grades to Administration |
| `POST` | `/doctor/courses/:id/attendance-session` | Generate dynamic rotating QR code for lecture |
| `GET` | `/doctor/schedule` | Weekly teaching schedule |

---

### 4.4 Teaching Assistant Portal (`src/services/taService.ts`)

| HTTP Method | Endpoint | Description |
|---|---|---|
| `GET` | `/ta/dashboard` | TA section summaries and pending lab grading |
| `GET` | `/ta/sections` | Lab sections assigned to TA |
| `GET` | `/ta/sections/:id/attendance` | Section lab attendance roster |
| `GET` | `/ta/sections/:id/submissions` | Student practical assignment submissions |
| `POST` | `/ta/submissions/:id/grade` | Submit grade and feedback for lab submission |
| `GET` | `/ta/discussions/schedule` | TA office hours and lab discussion schedule |

---

### 4.5 Administration & Governance (`src/services/adminService.ts`)

| HTTP Method | Endpoint | Description |
|---|---|---|
| `GET` | `/admin/dashboard` | College KPIs, active registrations, faculty metrics |
| `GET` | `/admin/students` | Search and filter all college students |
| `GET` | `/admin/doctors` | Faculty professor directory |
| `GET` | `/admin/course-offerings` | Curriculum offerings for term planning |
| `GET` | `/admin/grade-packages` | Grade packages awaiting Dean approval |
| `POST` | `/admin/grade-packages/:id/approve` | Approve and publish official grades |
| `POST` | `/admin/grade-packages/:id/reject` | Return grade package to doctor with revision notes |
| `GET` | `/admin/rooms` | Campus lecture halls, smart labs, and capacities |
| `GET` | `/admin/departments` | Academic & administrative departments |
| `GET` | `/admin/service-requests` | Student affairs requests |
| `POST` | `/admin/service-requests/:id/resolve` | Mark service request resolved with official notes |

---

### 4.6 AI Study Assistant (`src/services/aiService.ts`)

| HTTP Method | Endpoint | Description |
|---|---|---|
| `GET` | `/ai/documents` | List of indexed lecture notes and PDFs |
| `POST` | `/ai/documents/upload` | Upload PDF for semantic embedding (`multipart/form-data`) |
| `GET` | `/ai/documents/:id/chat` | Chat history for document |
| `POST` | `/ai/documents/:id/chat` | Send question to AI tutor (grounded RAG context) |

---

## 5. How to Add or Modify Endpoints

All service methods are clean and concise. For example, to add an endpoint to `studentService.ts`:

```typescript
// in src/services/studentService.ts
export const studentService = {
  // Existing methods...

  /** Example: Download an academic transcript PDF */
  async downloadTranscriptPdf(): Promise<Blob> {
    return apiClient.get('/student/transcript/download', undefined, {
      headers: { Accept: 'application/pdf' }
    });
  }
};
```

And in your component:
```tsx
import { studentService } from '../../services/studentService';

const handleDownload = async () => {
  try {
    const blob = await studentService.downloadTranscriptPdf();
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  } catch (err: any) {
    showToast('Download Failed', err.message, 'error');
  }
};
```

---

## 6. Testing & Development Summary

- When `VITE_USE_MOCK_API=true`: The application runs completely in browser memory with full instant data for all 106 screens.
- When `VITE_USE_MOCK_API=false`: The application sends real HTTP requests with JWT tokens to `VITE_API_BASE_URL`.
- Build verification: Run `npm run build` anytime to verify 100% type safety and zero compilation errors.
