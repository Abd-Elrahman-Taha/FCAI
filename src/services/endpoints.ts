/**
 * Centralized API Endpoints Catalog — All 136 Confirmed Swagger Endpoints
 *
 * Verified against https://fcaibsu.runasp.net/swagger/v1/swagger.json (FCAI BSU Platform API v1).
 * All paths are relative to VITE_API_BASE_URL (which includes the /api prefix).
 */

export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
  LOGOUT_ALL: '/auth/logout-all',
  ME: '/auth/me',
  CHANGE_PASSWORD: '/auth/change-password',
  FORGOT_PASSWORD: '/auth/forgot-password',
  VERIFY_RESET_TOKEN: '/auth/verify-reset-token',
  RESET_PASSWORD: '/auth/reset-password',
} as const;

export const SEMESTER_ENDPOINTS = {
  ACTIVE: '/semesters/active',
} as const;

export const COURSE_ENDPOINTS = {
  LIST: '/courses',
  CATALOG: '/courses/catalog',
  BY_ID: (id: number) => `/courses/${id}`,
} as const;

export const DEPARTMENT_ENDPOINTS = {
  LOOKUP: '/departments/lookup',
  BY_ID: (id: number) => `/departments/${id}`,
} as const;

export const STUDENT_ME_ENDPOINTS = {
  ME: '/students/me',
  LEVEL: '/students/me/level',
  CREDIT_LOAD: '/students/me/credit-load',
} as const;

export const DOCTOR_ME_ENDPOINTS = {
  ME: '/doctors/me',
} as const;

export const TA_ME_ENDPOINTS = {
  ME: '/teaching-assistants/me',
} as const;

export const EMPLOYEE_ME_ENDPOINTS = {
  ME: '/employees/me',
} as const;

export const ADMIN_ENDPOINTS = {
  // Academic Years (4)
  ACADEMIC_YEARS: '/admin/academic-years',
  ACADEMIC_YEAR_BY_ID: (id: number) => `/admin/academic-years/${id}`,

  // Academic Levels (2)
  ACADEMIC_LEVELS: '/admin/academic-levels',

  // Semesters (10)
  SEMESTERS: '/admin/semesters',
  SEMESTER_BY_ID: (id: number) => `/admin/semesters/${id}`,
  SEMESTER_ACTIVATE: (id: number) => `/admin/semesters/${id}/activate`,
  SEMESTER_WINDOW_REGISTRATION: (id: number) => `/admin/semesters/${id}/windows/registration`,
  SEMESTER_WINDOW_DROP: (id: number) => `/admin/semesters/${id}/windows/drop`,
  SEMESTER_WINDOW_WITHDRAWAL: (id: number) => `/admin/semesters/${id}/windows/withdrawal`,
  SEMESTER_WINDOW_PREFERENCE: (id: number) => `/admin/semesters/${id}/windows/preference`,
  SEMESTER_CALCULATE_LEVELS: (id: number) => `/admin/semesters/${id}/calculate-levels`,

  // Departments (7)
  DEPARTMENTS: '/admin/departments',
  DEPARTMENT_BY_ID: (id: number) => `/admin/departments/${id}`,
  DEPARTMENT_ACTIVATE: (id: number) => `/admin/departments/${id}/activate`,
  DEPARTMENT_DEACTIVATE: (id: number) => `/admin/departments/${id}/deactivate`,
  DEPARTMENT_HEAD_DOCTOR: (id: number) => `/admin/departments/${id}/head-doctor`,

  // Courses & Prerequisites (7)
  COURSES: '/admin/courses',
  COURSE_BY_ID: (id: number) => `/admin/courses/${id}`,
  COURSE_PREREQUISITES: (id: number) => `/admin/courses/${id}/prerequisites`,

  // Credit Load Rules (2)
  CREDIT_LOAD_RULES: '/admin/credit-load-rules',

  // Policy Versions (7)
  POLICY_VERSIONS: '/admin/policy-versions',
  POLICY_VERSION_BY_ID: (id: number) => `/admin/policy-versions/${id}`,
  POLICY_VERSION_FOR_COHORT: (cohortYear: number) => `/admin/policy-versions/for-cohort/${cohortYear}`,
  POLICY_VERSION_ACTIVATE: (id: number) => `/admin/policy-versions/${id}/activate`,
  POLICY_VERSION_COHORT_RANGE: (id: number) => `/admin/policy-versions/${id}/cohort-range`,

  // Requirement Groups (4)
  REQUIREMENT_GROUPS: '/admin/requirement-groups',
  REQUIREMENT_GROUP_BY_ID: (id: number) => `/admin/requirement-groups/${id}`,

  // Curriculum Versions (9) & Curriculum Courses (3)
  CURRICULUM_VERSIONS: '/admin/curriculum-versions',
  CURRICULUM_VERSION_BY_ID: (id: number) => `/admin/curriculum-versions/${id}`,
  CURRICULUM_VERSION_FOR_COHORT: (cohortYear: number) => `/admin/curriculum-versions/for-cohort/${cohortYear}`,
  CURRICULUM_VERSION_GROUPS: (id: number) => `/admin/curriculum-versions/${id}/groups`,
  CURRICULUM_VERSION_ACTIVATE: (id: number) => `/admin/curriculum-versions/${id}/activate`,
  CURRICULUM_VERSION_VALIDATE: (id: number) => `/admin/curriculum-versions/${id}/validate`,
  CURRICULUM_VERSION_COHORT_RANGE: (id: number) => `/admin/curriculum-versions/${id}/cohort-range`,
  CURRICULUM_COURSES: (versionId: number) => `/admin/curriculum-versions/${versionId}/courses`,
  CURRICULUM_COURSE_BY_ID: (versionId: number, courseId: number) =>
    `/admin/curriculum-versions/${versionId}/courses/${courseId}`,

  // Grade Scale Versions (5)
  GRADE_SCALE_VERSIONS: '/admin/grade-scale-versions',
  GRADE_SCALE_VERSION_BY_ID: (id: number) => `/admin/grade-scale-versions/${id}`,
  GRADE_SCALE_VERSION_SCALES: (id: number) => `/admin/grade-scale-versions/${id}/scales`,
  GRADE_SCALE_VERSION_ACTIVATE: (id: number) => `/admin/grade-scale-versions/${id}/activate`,

  // Secondary Track Requirements (3)
  SECONDARY_TRACK_REQUIREMENTS: '/admin/secondary-track-requirements',
  SECONDARY_TRACK_REQUIREMENT_BY_TRACK: (track: string) => `/admin/secondary-track-requirements/${track}`,

  // Admins (7)
  ADMINS: '/admin/admins',
  ADMIN_BY_ID: (id: number) => `/admin/admins/${id}`,
  ADMIN_ACTIVATE: (id: number) => `/admin/admins/${id}/activate`,
  ADMIN_DEACTIVATE: (id: number) => `/admin/admins/${id}/deactivate`,
  ADMIN_RESET_PASSWORD: (id: number) => `/admin/admins/${id}/reset-password`,

  // Doctors (8)
  DOCTORS: '/admin/doctors',
  DOCTOR_BY_ID: (id: number) => `/admin/doctors/${id}`,
  DOCTOR_ACTIVATE: (id: number) => `/admin/doctors/${id}/activate`,
  DOCTOR_DEACTIVATE: (id: number) => `/admin/doctors/${id}/deactivate`,
  DOCTOR_TRANSFER: (id: number) => `/admin/doctors/${id}/transfer`,
  DOCTOR_RESET_PASSWORD: (id: number) => `/admin/doctors/${id}/reset-password`,

  // Teaching Assistants (8)
  TEACHING_ASSISTANTS: '/admin/teaching-assistants',
  TEACHING_ASSISTANT_BY_ID: (id: number) => `/admin/teaching-assistants/${id}`,
  TEACHING_ASSISTANT_ACTIVATE: (id: number) => `/admin/teaching-assistants/${id}/activate`,
  TEACHING_ASSISTANT_DEACTIVATE: (id: number) => `/admin/teaching-assistants/${id}/deactivate`,
  TEACHING_ASSISTANT_TRANSFER: (id: number) => `/admin/teaching-assistants/${id}/transfer`,
  TEACHING_ASSISTANT_RESET_PASSWORD: (id: number) => `/admin/teaching-assistants/${id}/reset-password`,

  // Employees (8)
  EMPLOYEES: '/admin/employees',
  EMPLOYEE_BY_ID: (id: number) => `/admin/employees/${id}`,
  EMPLOYEE_ACTIVATE: (id: number) => `/admin/employees/${id}/activate`,
  EMPLOYEE_DEACTIVATE: (id: number) => `/admin/employees/${id}/deactivate`,
  EMPLOYEE_TRANSFER: (id: number) => `/admin/employees/${id}/transfer`,
  EMPLOYEE_RESET_PASSWORD: (id: number) => `/admin/employees/${id}/reset-password`,

  // Students (11) + Credit Load Override (2) + Transferred Students (4)
  STUDENTS: '/admin/students',
  STUDENT_BY_ID: (id: number) => `/admin/students/${id}`,
  STUDENT_LEVEL: (id: number) => `/admin/students/${id}/level`,
  STUDENT_ACTIVATE: (id: number) => `/admin/students/${id}/activate`,
  STUDENT_DEACTIVATE: (id: number) => `/admin/students/${id}/deactivate`,
  STUDENT_TRANSFER: (id: number) => `/admin/students/${id}/transfer`,
  STUDENT_RESET_PASSWORD: (id: number) => `/admin/students/${id}/reset-password`,
  STUDENTS_BULK_RESET_PASSWORDS: '/admin/students/reset-passwords-bulk',
  STUDENT_CREDIT_LOAD_OVERRIDE: (id: number) => `/admin/students/${id}/credit-load-override`,
  STUDENTS_TRANSFERRED: '/admin/students/transferred',
  STUDENT_TRANSFER_CREDITS: (id: number) => `/admin/students/${id}/transfer-credits`,
  STUDENT_TRANSFER_CREDIT_BY_ID: (id: number, creditId: number) =>
    `/admin/students/${id}/transfer-credits/${creditId}`,
} as const;
