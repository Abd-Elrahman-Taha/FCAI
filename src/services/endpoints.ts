/**
 * Centralized API Endpoints Catalog
 * 
 * Defines all backend REST API routes in one single, maintainable file.
 * Used by domain services in src/services/ (studentService, doctorService, etc.)
 */

export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',                                  // POST: Authenticate user & return JWT token
  REGISTER: '/auth/register',                            // POST: Student / Staff enrollment request
  LOGOUT: '/auth/logout',                                // POST: Revoke active session token
  ME: '/auth/me',                                        // GET: Fetch authenticated user profile
  REFRESH_TOKEN: '/auth/refresh-token',                  // POST: Refresh expired access token
  FORGOT_PASSWORD: '/auth/forgot-password',              // POST: Request reset code/link to email
  RESET_PASSWORD: '/auth/reset-password',                // POST: Set new password with token
  FIRST_LOGIN_SETUP: '/auth/first-login-setup',          // POST: Mandatory initial security setup
  UPDATE_PASSWORD: '/auth/change-password',              // POST: Update existing password
} as const;

export const STUDENT_ENDPOINTS = {
  DASHBOARD: '/student/dashboard',                       // GET: Overview KPI stats, timetable, alerts
  PROFILE: '/student/profile',                           // GET / PATCH: Personal & contact info
  COURSES: '/student/courses',                           // GET: Enrolled courses list
  COURSE_DETAILS: (id: string) => `/courses/${id}`,      // GET: Course syllabus, instructors, rooms
  COURSE_MATERIALS: (id: string) => `/courses/${id}/materials`, // GET: Lecture slides & study PDFs
  DROP_COURSE: (id: string) => `/student/courses/${id}`, // DELETE: Drop enrolled course
  REGISTRATION_OFFERINGS: '/student/registration/offerings', // GET: Available courses for current semester
  REGISTER_COURSE: '/student/registration/enroll',       // POST: Submit course selection
  TIMETABLE: '/student/timetable',                       // GET: Weekly class schedule
  ATTENDANCE: '/student/attendance',                     // GET: Attendance overview & quota limits
  VERIFY_QR_ATTENDANCE: '/student/attendance/verify-qr', // POST: Scan rotating QR + GPS check-in
  ASSIGNMENTS: '/student/assignments',                   // GET: Pending & graded assignments
  ASSIGNMENT_DETAILS: (id: string) => `/student/assignments/${id}`, // GET: Single assignment
  SUBMIT_ASSIGNMENT: (id: string) => `/student/assignments/${id}/submit`, // POST: Upload solution
  GRADES: '/student/grades',                             // GET: Semester grade reports
  GPA_HISTORY: '/student/gpa-history',                   // GET: Historical GPA progression
  FEES: '/student/fees',                                 // GET: Tuition dues & payment status
  PAY_FEE_FAWRY: (feeId: string) => `/student/fees/${feeId}/pay-fawry`, // POST: Generate Fawry code
  RECEIPT: (receiptId: string) => `/student/receipts/${receiptId}`, // GET: Payment receipt voucher
  EXAMS: '/student/exams',                               // GET: Available exams & quizzes
  EXAM_DETAILS: (id: string) => `/student/exams/${id}`,  // GET: Exam questions & timer
  EXAM_SCHEDULE: '/student/exams/schedule',              // GET: Midterm & final exam hall schedule
  SUBMIT_EXAM: (id: string) => `/student/exams/${id}/submit`, // POST: Submit answers
  EXAM_RESULT: (id: string) => `/student/exams/${id}/result`, // GET: Graded scorecard
  SERVICE_REQUESTS: '/student/service-requests',         // GET / POST: Student Affairs petitions
  CANCEL_SERVICE_REQUEST: (id: string) => `/student/service-requests/${id}`, // DELETE: Cancel petition
  DOCUMENTS: '/student/documents',                       // GET: Official verifiable transcripts/letters
} as const;

export const DOCTOR_ENDPOINTS = {
  DASHBOARD: '/doctor/dashboard',                        // GET: Doctor overview & active class status
  COURSES: '/doctor/courses',                            // GET: Courses taught by doctor
  COURSE_ROSTER: (courseId: string) => `/doctor/courses/${courseId}/roster`, // GET: Enrolled students
  COURSE_CONTENT: (courseId: string) => `/doctor/courses/${courseId}/content`, // GET / PUT: Syllabus
  LECTURE_MATERIALS: (courseId: string) => `/doctor/courses/${courseId}/materials`, // GET / POST: Upload slides
  ASSIGNMENTS: '/doctor/assignments',                    // GET / POST: Create & view assignments
  ASSIGNMENT_SUBMISSIONS: (assignmentId: string) => `/doctor/assignments/${assignmentId}/submissions`, // GET
  GRADE_SUBMISSION: (subId: string) => `/doctor/submissions/${subId}/grade`, // POST: Grade assignment
  QUESTION_BANKS: '/doctor/question-banks',              // GET / POST: MCQs & questions bank
  EXAMS: '/doctor/exams',                                // GET / POST: Exam authoring & blueprints
  PUBLISH_EXAM: (id: string) => `/doctor/exams/${id}/publish`, // PATCH: Make exam available to cohort
  GRADE_SHORT_ANSWERS: (examId: string) => `/doctor/exams/${examId}/grade-short-answers`, // POST
  START_ATTENDANCE_SESSION: '/doctor/attendance/session', // POST: Generate dynamic 10s rotating QR
  ATTENDANCE_MONITOR: (sessionId: string) => `/doctor/attendance/session/${sessionId}/live`, // GET: Live ticker
  MANUAL_ATTENDANCE: '/doctor/attendance/manual',        // POST: Doctor manual roster override
  EDIT_ATTENDANCE: '/doctor/attendance/edit',            // PUT: Update past attendance session
  FINALIZE_ATTENDANCE: '/doctor/attendance/close',       // POST: Finalize attendance & flag absences
  GRADE_PACKAGES: '/doctor/grade-packages',              // GET: Semester grade packages status
  SUBMIT_GRADE_PACKAGE: '/doctor/grade-packages/submit', // POST: Submit grades to Dean for approval
  REPORTS: '/doctor/reports',                            // GET: Grade distributions & pass/fail statistics
  ANNOUNCEMENTS: '/doctor/announcements',                // GET / POST: Course announcements
  SCHEDULE: '/doctor/schedule',                          // GET: Instructor weekly teaching timetable
} as const;

export const TA_ENDPOINTS = {
  DASHBOARD: '/ta/dashboard',                            // GET: TA overview & sections count
  ASSIGNED_SECTIONS: '/ta/sections',                     // GET: Sections assigned to teaching assistant
  SECTION_ROSTER: (secId: string) => `/ta/sections/${secId}/roster`, // GET: Enrolled lab students
  SECTION_ATTENDANCE: (secId: string) => `/ta/sections/${secId}/attendance`, // GET / POST: Lab check-in
  SECTION_QR: (secId: string) => `/ta/sections/${secId}/qr-token`, // GET: 10s rotating lab QR token
  SECTION_ASSIGNMENTS: (secId: string) => `/ta/sections/${secId}/assignments`, // GET: Lab practical tasks
  GRADE_SUBMISSION: (subId: string) => `/ta/submissions/${subId}/grade`, // POST: Lab rubric grading
  DISCUSSIONS_SCHEDULE: '/ta/discussions/schedule',      // GET: Office hours & lab schedule
} as const;

export const ADMIN_ENDPOINTS = {
  DASHBOARD: '/admin/dashboard',                         // GET: College overview metrics
  STUDENTS: '/admin/students',                           // GET / POST: Student directory & account creation
  STUDENT_DETAIL: (id: string) => `/admin/students/${id}`, // GET / PATCH: Student file
  DOCTORS: '/admin/doctors',                             // GET / POST: Faculty professors directory
  TEACHING_ASSISTANTS: '/admin/teaching-assistants',     // GET / POST: TAs directory
  EMPLOYEES: '/admin/employees',                         // GET / POST: Staff directory
  EMPLOYEE_LIFECYCLE: (id: string) => `/admin/employees/${id}/lifecycle`, // PATCH: Status & promotion
  DEPARTMENTS: '/admin/departments',                     // GET / POST: Academic & administrative depts
  PERMISSIONS: '/admin/permissions',                     // GET / PUT: Role permission assignments
  CONTENT_MANAGEMENT: '/admin/content',                  // GET / PUT: Campus news & portals banners
  SERVICE_REQUESTS: '/admin/service-requests',           // GET: All student affairs petitions
  RESOLVE_SERVICE_REQUEST: (id: string) => `/admin/service-requests/${id}/resolve`, // POST: Approve / reject
  PAYMENT_MONITORING: '/admin/payments',                 // GET: Tuition collection reports
  REPORTS: '/admin/reports',                             // GET: College-wide analytical reports
  REGULATIONS: '/admin/regulations',                     // GET / PUT: By-laws, GPA rules, 75% policy
  ACADEMIC_YEARS: '/admin/academic-years',               // GET / POST: Terms & semesters setup
  LEVELS: '/admin/levels',                               // GET / PUT: Academic levels 1-4 definitions
  COURSES: '/admin/courses',                             // GET / POST: Master curriculum catalog
  COURSE_OFFERINGS: '/admin/course-offerings',           // GET / POST: Semester active course instances
  SECTIONS: '/admin/sections',                           // GET / POST: Lab & tutorial sections
  REGISTRATION_PERIODS: '/admin/registration-periods',   // GET / PUT: Course add/drop window toggles
  EXAMS: '/admin/exams',                                 // GET / POST: Midterm & final exam master control
  GRADE_PACKAGES: '/admin/grade-packages',               // GET: Submitted grade packages from doctors
  APPROVE_GRADE_PACKAGE: (id: string) => `/admin/grade-packages/${id}/approve`, // POST: Dean approval
  REJECT_GRADE_PACKAGE: (id: string) => `/admin/grade-packages/${id}/reject`,   // POST: Return for edits
  GRADE_SCALE: '/admin/grade-scale',                     // GET / PUT: Letter grade points mapping
  TIMETABLE: '/admin/timetable',                         // GET / PUT: Master campus timetable
  ROOMS: '/admin/rooms',                                 // GET / POST: Lecture halls & smart labs
  EXAM_SCHEDULE_MANAGEMENT: '/admin/exam-schedules',     // GET / POST: Master exam rooms allocations
  FEE_DEFINITIONS: '/admin/fee-definitions',             // GET / POST: Tuition rates per credit hour
  GENERATE_STUDENT_FEES: '/admin/fee-generation',        // POST: Bulk generate semester bills
  DISCOUNTS: '/admin/discounts',                         // GET / POST: Scholarships & tuition exemptions
} as const;

export const SUPERADMIN_ENDPOINTS = {
  ROLES: '/superadmin/roles',                            // GET / PUT: RBAC roles & system permissions
  SYSTEM_CONFIG: '/superadmin/system-config',            // GET / PUT: Global platform settings
  SECURITY_CONFIG: '/superadmin/security-config',        // GET / PUT: Cybersecurity policies
  INTEGRATIONS: '/superadmin/integrations',              // GET / PUT: Fawry, BSU SIS, RAG gateways
  AUDIT_LOGS: '/superadmin/audit-logs',                  // GET: Immutable platform access logs
} as const;

export const NOTIFICATION_ENDPOINTS = {
  LIST: '/notifications',                                // GET: User notifications
  MARK_READ: (id: string) => `/notifications/${id}/read`, // PATCH: Mark single notification read
  MARK_ALL_READ: '/notifications/read-all',              // PATCH: Mark all as read
  UNREAD_COUNT: '/notifications/unread-count',           // GET: Unread badge count
} as const;

export const AI_ENDPOINTS = {
  DOCUMENTS: '/ai/documents',                            // GET: Study PDFs uploaded to RAG
  UPLOAD: '/ai/upload',                                  // POST: Upload course material for AI analysis
  CHAT_HISTORY: (docId: string) => `/ai/documents/${docId}/chat`, // GET: Chat session history
  CHAT_MESSAGE: '/ai/chat',                              // POST: Send query to campus LLM
} as const;
