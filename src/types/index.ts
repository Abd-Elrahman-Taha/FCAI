export type Role = 'student' | 'doctor' | 'ta' | 'admin' | 'employee';

export interface User {
  id: string;
  name: string;
  short: string;
  role: Role;
  roleLabel: string;
  meta: string;
  email: string;
  phone?: string;
  nationalId?: string;
  studentCode?: string;
  department?: string;
  academicLevel?: string;
  academicStatus?: 'Active' | 'Suspended' | 'Graduated' | 'Withdrawn' | 'Dismissed' | 'On Leave';
  gpa?: number;
  completedCredits?: number;
  totalCredits?: number;
  birthDate?: string;
  gender?: string;
  academicYear?: string;
  isFirstLogin?: boolean;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  creditHours: number;
  department: string;
  doctor: string;
  ta?: string;
  section?: string;
  attendancePercent: number;
  publishedGrade?: string | null;
  colorIndex: number;
  schedule: string;
  room: string;
  capacity?: number;
  availableSeats?: number;
  prerequisites?: string[];
  description?: string;
  hall?: string;
  enrolledStudents?: number;
}

export interface TimetableSession {
  id: string;
  courseCode: string;
  courseName: string;
  sessionType: 'Lecture' | 'Section';
  instructor: string;
  room: string;
  day: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday';
  startTime: string; // "10:00"
  endTime: string;   // "12:00"
  colorClass: string;
}

export interface AttendanceSession {
  id: string;
  courseCode: string;
  courseName: string;
  date: string;
  sessionType: 'Lecture' | 'Section';
  time: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  checkInTime?: string;
  room: string;
}

export interface Assignment {
  id: string;
  courseCode: string;
  courseName: string;
  title: string;
  description: string;
  scope: string; // 'Course-wide' or 'Section S3 (TA)'
  dueDate: string;
  totalMarks: number;
  status: 'Pending' | 'Submitted' | 'Graded' | 'Overdue';
  grade?: string;
  feedback?: string;
  submittedFiles?: { name: string; size: string; date: string }[];
  submittedAt?: string;
  attachedInstructions?: string;
}

export type QuestionType = 'MCQ' | 'TrueFalse' | 'ShortAnswer';

export interface ExamQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  options?: string[];
  correctOptionIndex?: number;
  marks: number;
  imageUrl?: string;
}

export interface Exam {
  id: string;
  courseCode: string;
  courseName: string;
  title: string;
  type: 'Quiz' | 'Midterm' | 'Final' | 'Practical Exam';
  startTime: string;
  endTime: string;
  durationMinutes: number;
  questionCount: number;
  status: 'Upcoming' | 'Available' | 'In Progress' | 'Submitted' | 'Result Pending' | 'Completed';
  instructions: string[];
  rules: string[];
  questions?: ExamQuestion[];
  score?: number;
  totalMarks?: number;
  hasPendingShortAnswers?: boolean;
}

export interface GradeComponent {
  name: string;
  obtained: number;
  max: number;
}

export interface CourseGrade {
  courseCode: string;
  courseName: string;
  creditHours: number;
  components: GradeComponent[];
  totalMarks: number;
  letterGrade: string;
  gradePoints: number;
  isPublished: boolean;
}

export interface StudentFee {
  id: string;
  feeType: string;
  academicYear: string;
  semester: string;
  originalAmount: number;
  discount: number;
  finalAmount: number;
  dueDate: string;
  status: 'Unpaid' | 'Paid' | 'Cancelled';
  paymentDate?: string;
  transactionRef?: string;
  provider?: string;
}

export interface Receipt {
  receiptNumber: string;
  issueDate: string;
  amount: number;
  currency: string;
  feeType: string;
  paymentDate: string;
  paymentStatus: string;
  studentName: string;
  studentCode: string;
  nationalId: string;
  department: string;
  paymentMethod: string;
}

export interface ServiceRequest {
  id: string;
  type: 'Transcript' | 'Student Card' | 'Certificate' | 'Enrollment Certificate' | 'Complaint' | 'Other';
  department: string;
  subject: string;
  description: string;
  otherDescription?: string;
  attachmentName?: string;
  submittedDate: string;
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Rejected' | 'Cancelled';
  handlerName?: string;
  resolvedDate?: string;
  resolutionNotes?: string;
  rejectionReason?: string;
  studentName?: string;
  studentCode?: string;
}

export interface StudyDocument {
  id: string;
  title: string;
  uploadDate: string;
  fileSize: string;
  pageCount: number;
  summary: string;
}

export interface ChatMessage {
  id: string;
  sender: 'student' | 'ai';
  text: string;
  timestamp: string;
  citation?: string;
  isOutOfScope?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  unread: boolean;
  icon: string;
  tone: string;
  link: string;
  category?: string;
  time?: string;
}

export interface Department {
  id: string;
  name: string;
  type: 'Academic' | 'Administrative';
  code?: string;
  description?: string;
  head?: string;
  officeLocation?: string;
  staffCount?: number;
  doctorsCount?: number;
  tasCount?: number;
  employeesCount?: number;
  studentsCount?: number;
  coursesCount?: number;
  permissions: string[];
}

export interface Room {
  id: string;
  name: string;
  type: string;
  capacity: number;
  latitude?: number;
  longitude?: number;
  building?: string;
  floor?: string;
  equipment?: string[];
  mapCoordinates?: { x: number; y: number };
  active: boolean;
}

export interface GradePackage {
  id: string;
  courseCode: string;
  courseName: string;
  leadDoctor: string;
  enrolledStudents: number;
  submissionTime: string;
  status: 'Draft' | 'Doctor Submitted' | 'Admin Approval' | 'Published' | 'Locked';
  averageGrade: string;
  failuresCount: number;
  auditNotes?: string;
}

export interface GradeScaleRow {
  letter: string;
  points: number;
  minPercent?: number;
  maxPercent?: number;
  minMarks?: number;
  maxMarks?: number;
  description?: string;
}

// Runtime token exports for bundler and browser ESM compatibility under verbatimModuleSyntax
export const Role = undefined as unknown as any;
export const User = undefined as unknown as any;
export const Course = undefined as unknown as any;
export const TimetableSession = undefined as unknown as any;
export const AttendanceSession = undefined as unknown as any;
export const Assignment = undefined as unknown as any;
export const QuestionType = undefined as unknown as any;
export const ExamQuestion = undefined as unknown as any;
export const Exam = undefined as unknown as any;
export const GradeComponent = undefined as unknown as any;
export const CourseGrade = undefined as unknown as any;
export const StudentFee = undefined as unknown as any;
export const Receipt = undefined as unknown as any;
export const ServiceRequest = undefined as unknown as any;
export const StudyDocument = undefined as unknown as any;
export const ChatMessage = undefined as unknown as any;
export const NotificationItem = undefined as unknown as any;
export const Department = undefined as unknown as any;
export const Room = undefined as unknown as any;
export const GradePackage = undefined as unknown as any;
export const GradeScaleRow = undefined as unknown as any;
