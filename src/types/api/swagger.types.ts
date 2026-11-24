/**
 * Auto-generated from https://fcaibsu.runasp.net/swagger/v1/swagger.json
 * Exact DTO & Enum contracts for all 136 confirmed Swagger endpoints.
 */

import type { PaginationMetadata } from './common.types';

export interface AcademicLevelDto {
  id: number;
  levelNumber: number;
  name: string | null;
  nameAr: string | null;
  fromCredits: number;
  toCredits: number;
  isLastLevel: boolean;
}

export interface AcademicLevelsDto {
  policyVersionId: number;
  policyTotalCredits: number;
  levels: AcademicLevelDto[] | null;
}

export type AcademicStatus = "Active" | "Suspended" | "Graduated" | "Withdrawn" | "Dismissed";

export interface AcademicYearDto {
  id: number;
  name: string | null;
  startDate: string;
  endDate: string;
  isActive: boolean;
  semesters: SemesterSummaryDto[] | null;
}

export interface ActivateGradeScaleResponse {
  version: GradeScaleVersionDto;
  retiredVersionId: number | null;
  warnings: string[] | null;
}

export interface ActiveSemesterDto {
  id: number;
  academicYearId: number;
  academicYearName: string | null;
  name: string | null;
  semesterType: SemesterType;
  startDate: string;
  endDate: string;
  windows: SemesterWindowsDto;
  serverTimeUtc: string;
}

export interface AdminDetailDto {
  id: number;
  username: string | null;
  email: string | null;
  fullNameAr: string | null;
  fullNameEn: string | null;
  phoneNumber: string | null;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface AdminListItemDto {
  id: number;
  username: string | null;
  email: string | null;
  fullNameAr: string | null;
  fullNameEn: string | null;
  phoneNumber: string | null;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface AdminListItemDtoPagedResult {
  items: AdminListItemDto[] | null;
  meta: PaginationMetadata;
}

export interface AdminResetDoctorPasswordDto {
  newTemporaryPassword?: string | null;
}

export interface AdminResetEmployeePasswordDto {
  newTemporaryPassword?: string | null;
}

export interface AdminResetPasswordDto {
  newPassword?: string | null;
}

export interface AdminResetStudentPasswordDto {
  newTemporaryPassword?: string | null;
}

export interface AdminResetTeachingAssistantPasswordDto {
  newTemporaryPassword?: string | null;
}

export interface BulkResetResultDto {
  affectedStudentsCount: number;
  message?: string | null;
}

export interface BulkResetStudentsPasswordDto {
  newTemporaryPassword?: string | null;
  departmentId?: number | null;
  admissionYear?: number | null;
}

export interface CalculateLevelsRequest {
  force: boolean;
  studentIds?: number[] | null;
}

export interface CalculateLevelsResultDto {
  semesterId: number;
  semesterName?: string | null;
  totalStudentsProcessed: number;
  createdCount: number;
  updatedCount: number;
  skippedCount: number;
  failedCount: number;
  failures?: StudentLevelCalculationFailureDto[] | null;
}

export interface ChangePasswordDto {
  currentPassword: string | null;
  newPassword: string | null;
  confirmNewPassword: string | null;
}

export interface CourseCatalogItemDto {
  id: number;
  code: string | null;
  name: string | null;
  nameAr: string | null;
  creditHours: number;
  isCreditBearing: boolean;
  departmentName: string | null;
  groupCode: string | null;
  groupName: string | null;
  isCompulsory: boolean | null;
  level: number | null;
  suggestedSemester: number | null;
  prerequisites: PrerequisiteDto[] | null;
}

export interface CourseDto {
  id: number;
  code: string | null;
  name: string | null;
  nameAr: string | null;
  description: string | null;
  creditHours: number;
  isCreditBearing: boolean;
  departmentId: number;
  departmentName: string | null;
  placements: CoursePlacementDto[] | null;
  prerequisites: PrerequisiteDto[] | null;
}

export interface CourseListItemDto {
  id: number;
  code: string | null;
  name: string | null;
  nameAr: string | null;
  creditHours: number;
  isCreditBearing: boolean;
  departmentId: number;
  departmentName: string | null;
  groupCode: string | null;
  isCompulsory: boolean | null;
  level: number | null;
  suggestedSemester: number | null;
}

export interface CourseListItemDtoPagedResult {
  items: CourseListItemDto[] | null;
  meta: PaginationMetadata;
}

export interface CoursePlacementDto {
  curriculumVersionId: number;
  curriculumName: string | null;
  requirementGroupId: number;
  groupCode: string | null;
  groupName: string | null;
  isCompulsory: boolean;
  level: number;
  suggestedSemester: number;
}

export interface CoursePlacementRequest {
  curriculumVersionId?: number | null;
  requirementGroupId: number;
  isCompulsory: boolean;
  level?: number | null;
  suggestedSemester?: number | null;
}

export interface CreateAcademicYearRequest {
  name?: string | null;
  startDate: string;
  endDate: string;
}

export interface CreateAdminDto {
  fullNameAr?: string | null;
  fullNameEn?: string | null;
  email?: string | null;
  username?: string | null;
  phoneNumber?: string | null;
  password?: string | null;
}

export interface CreateCourseRequest {
  code?: string | null;
  name?: string | null;
  nameAr?: string | null;
  description?: string | null;
  creditHours: number;
  isCreditBearing: boolean;
  departmentId: number;
  placement: CoursePlacementRequest;
}

export interface CreateCurriculumVersionRequest {
  name?: string | null;
  academicPolicyVersionId: number;
  effectiveCohortFrom: number;
  effectiveCohortTo?: number | null;
  decisionReference?: string | null;
}

export interface CreateDepartmentDto {
  nameAr?: string | null;
  nameEn?: string | null;
  code?: string | null;
  type: DepartmentType;
  headDoctorId?: number | null;
}

export interface CreateDoctorRequestDto {
  fullNameAr?: string | null;
  fullNameEn?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  departmentId: number;
  title?: string | null;
  hireDate: string;
  maxSupervisedProjects: number;
  temporaryPassword?: string | null;
}

export interface CreateDoctorResponseDto {
  doctorId: number;
  userId: number;
  email?: string | null;
  fullNameAr?: string | null;
  fullNameEn?: string | null;
  temporaryPassword?: string | null;
}

export interface CreateEmployeeRequestDto {
  fullNameAr?: string | null;
  fullNameEn?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  departmentId: number;
  jobTitle?: string | null;
  hireDate: string;
  temporaryPassword?: string | null;
}

export interface CreateEmployeeResponseDto {
  employeeId: number;
  userId: number;
  email?: string | null;
  fullNameAr?: string | null;
  fullNameEn?: string | null;
  temporaryPassword?: string | null;
}

export interface CreateGradeScaleVersionRequest {
  name?: string | null;
  effectiveFrom: string;
  baseVersionId?: number | null;
  useDefaultScale: boolean;
}

export interface CreatePolicyVersionRequest {
  name?: string | null;
  effectiveCohortFrom: number;
  effectiveCohortTo?: number | null;
  decisionReference?: string | null;
  parameters: PolicyParametersDto;
}

export interface CreateRequirementGroupRequest {
  code?: string | null;
  name?: string | null;
  nameAr?: string | null;
  groupType: RequirementGroupType;
}

export interface CreateSemesterRequest {
  academicYearId: number;
  name?: string | null;
  semesterType: SemesterType;
  startDate: string;
  endDate: string;
}

export interface CreateStudentRequestDto {
  nationalId?: string | null;
  fullNameAr?: string | null;
  fullNameEn?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  nationality?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  governorate?: string | null;
  departmentId: number;
  secondaryTrack: SecondaryTrack;
  secondaryCertificateYear: number;
  seatNumber?: string | null;
  secondaryScore: number;
  admissionYear: number;
  curriculumVersionId?: number | null;
  academicAdvisorDoctorId?: number | null;
  temporaryPassword?: string | null;
}

export interface CreateStudentResponseDto {
  studentId: number;
  userId: number;
  studentCode?: string | null;
  email?: string | null;
  temporaryPassword?: string | null;
}

export interface CreateTeachingAssistantRequestDto {
  fullNameAr?: string | null;
  fullNameEn?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  departmentId: number;
  academicDegree?: string | null;
  hireDate: string;
  maxSupervisedProjects: number;
  temporaryPassword?: string | null;
}

export interface CreateTeachingAssistantResponseDto {
  teachingAssistantId: number;
  userId: number;
  email?: string | null;
  fullNameAr?: string | null;
  fullNameEn?: string | null;
  temporaryPassword?: string | null;
}

export interface CreateTransferredStudentRequestDto {
  nationalId?: string | null;
  fullNameAr?: string | null;
  fullNameEn?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  nationality?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  governorate?: string | null;
  departmentId: number;
  secondaryTrack: SecondaryTrack;
  secondaryCertificateYear: number;
  seatNumber?: string | null;
  secondaryScore: number;
  admissionYear: number;
  curriculumVersionId: number;
  academicAdvisorDoctorId?: number | null;
  previousInstitution?: string | null;
  previousFacultyName?: string | null;
  cgpa: number;
  completedCourseIds?: number[] | null;
  temporaryPassword?: string | null;
}

export interface CreateTransferredStudentResponseDto {
  studentId: number;
  userId: number;
  studentCode?: string | null;
  email?: string | null;
  temporaryPassword?: string | null;
  previousInstitution?: string | null;
  previousFacultyName?: string | null;
  cgpa: number;
  calculatedPassedCredits: number;
  transferredCoursesCount: number;
  transferredCourses?: TransferredCourseItemDto[] | null;
}

export interface CreditLoadOverrideDto {
  studentId: number;
  semesterId: number;
  minCreditHours: number | null;
  maxCreditHours: number;
  reason: string | null;
  setByUserId: number;
  setAt: string;
}

export interface CreditLoadRuleDto {
  id: number;
  ruleType: CreditLoadRuleType;
  name: string | null;
  minCgpa: number | null;
  maxCgpaExclusive: number | null;
  minCredits: number | null;
  maxCredits: number;
  priority: number;
  effectiveFrom: string;
  effectiveTo: string | null;
}

export type CreditLoadRuleType = "Summer" | "FirstRegularSemester" | "CgpaBand";

export interface CreditLoadRulesDto {
  policyVersionId: number;
  effectiveFrom: string;
  rules: CreditLoadRuleDto[] | null;
}

export type CreditLoadSource = "Override" | "Summer" | "FirstRegularSemester" | "CgpaBand";

export interface CurrentUserResponseDto {
  id: number;
  username: string | null;
  email: string | null;
  fullNameAr: string | null;
  fullNameEn: string | null;
  phoneNumber: string | null;
  role: string | null;
  isActive: boolean;
  lastLoginAt: string | null;
}

export interface CurriculumCheckDto {
  code: string | null;
  message: string | null;
  severity: string | null;
}

export interface CurriculumCourseItemRequest {
  courseId: number;
  requirementGroupId: number;
  isCompulsory: boolean;
  level?: number | null;
  suggestedSemester?: number | null;
}

export interface CurriculumGroupDto {
  requirementGroupId: number;
  code: string | null;
  name: string | null;
  nameAr: string | null;
  groupType: RequirementGroupType;
  requiredCredits: number;
  compulsoryCredits: number;
  electiveCredits: number | null;
}

export interface CurriculumValidationDto {
  canActivate: boolean;
  totalGroupCredits: number;
  policyTotalCredits: number;
  checks: CurriculumCheckDto[] | null;
}

export interface CurriculumVersionDto {
  id: number;
  name: string | null;
  versionNumber: number;
  academicPolicyVersionId: number;
  academicPolicyVersionName: string | null;
  policyTotalCredits: number;
  totalGroupCredits: number;
  effectiveCohortFrom: number;
  effectiveCohortTo: number | null;
  decisionReference: string | null;
  isActive: boolean;
  isEditable: boolean;
  createdAt: string;
  createdByUserName: string | null;
  groups: CurriculumGroupDto[] | null;
  validation: CurriculumValidationDto;
}

export interface CurriculumVersionListItemDto {
  id: number;
  name: string | null;
  versionNumber: number;
  academicPolicyVersionId: number;
  academicPolicyVersionName: string | null;
  effectiveCohortFrom: number;
  effectiveCohortTo: number | null;
  isActive: boolean;
  isEditable: boolean;
  totalGroupCredits: number;
  createdAt: string;
}

export interface DepartmentDetailDto {
  id: number;
  nameAr: string | null;
  nameEn: string | null;
  code: string | null;
  type: DepartmentType;
  isActive: boolean;
  headDoctorId: number | null;
  headDoctorNameAr: string | null;
  headDoctorNameEn: string | null;
}

export interface DepartmentListItemDto {
  id: number;
  nameAr: string | null;
  nameEn: string | null;
  code: string | null;
  type: string | null;
  isActive: boolean;
  headDoctorName: string | null;
}

export interface DepartmentListItemDtoPagedResult {
  items: DepartmentListItemDto[] | null;
  meta: PaginationMetadata;
}

export interface DepartmentLookupDto {
  id: number;
  nameAr: string | null;
  nameEn: string | null;
  code: string | null;
  type: string | null;
}

export type DepartmentType = "Academic" | "Administrative";

export interface DoctorListItemDto {
  id: number;
  userId: number;
  fullNameAr: string | null;
  fullNameEn: string | null;
  email: string | null;
  phoneNumber: string | null;
  departmentName: string | null;
  title: string | null;
  maxSupervisedProjects: number;
  isActive: boolean;
}

export interface DoctorListItemDtoPagedResult {
  items: DoctorListItemDto[] | null;
  meta: PaginationMetadata;
}

export interface DoctorProfileResponseDto {
  id: number;
  userId: number;
  fullNameAr: string | null;
  fullNameEn: string | null;
  email: string | null;
  phoneNumber: string | null;
  departmentId: number;
  departmentName: string | null;
  title: string | null;
  hireDate: string;
  maxSupervisedProjects: number;
  isActive: boolean;
}

export interface EmployeeListItemDto {
  id: number;
  userId: number;
  fullNameAr: string | null;
  fullNameEn: string | null;
  email: string | null;
  phoneNumber: string | null;
  departmentName: string | null;
  jobTitle: string | null;
  isActive: boolean;
}

export interface EmployeeListItemDtoPagedResult {
  items: EmployeeListItemDto[] | null;
  meta: PaginationMetadata;
}

export interface EmployeeProfileResponseDto {
  id: number;
  userId: number;
  fullNameAr: string | null;
  fullNameEn: string | null;
  email: string | null;
  phoneNumber: string | null;
  departmentId: number;
  departmentName: string | null;
  jobTitle: string | null;
  hireDate: string;
  isActive: boolean;
}

export interface ForgotPasswordRequestDto {
  email: string | null;
}

export interface ForgotPasswordResponseDto {
  message: string | null;
  resetToken: string | null;
}

export interface GradeScaleRowDto {
  id: number | null;
  symbol: string | null;
  scaleType: string | null;
  minPercentage: number | null;
  maxPercentage: number | null;
  gradePoints: number | null;
  includedInGpa: boolean;
  appliesTo: string | null;
  description: string | null;
  sortOrder: number;
}

export interface GradeScaleVersionDto {
  id: number;
  name: string | null;
  status: string | null;
  effectiveFrom: string;
  effectiveTo: string | null;
  isActive: boolean;
  isEditable: boolean;
  scales: GradeScaleRowDto[] | null;
  createdAt: string;
}

export interface GradeScaleVersionSummaryDto {
  id: number;
  name: string | null;
  status: string | null;
  effectiveFrom: string;
  effectiveTo: string | null;
  isActive: boolean;
  scaleRowsCount: number;
  createdAt: string;
}

export interface LoginRequestDto {
  email: string | null;
  nationalId: string | null;
  studentCode: string | null;
  password: string | null;
}

export interface LoginResponseDto {
  userId: number;
  email: string | null;
  fullName: string | null;
  role: string | null;
  token: string | null;
  refreshToken: string | null;
  expiresAt: string;
  requiresPasswordChange: boolean;
}

export interface LogoutRequestDto {
  refreshToken: string | null;
}

export interface PolicyParametersDto {
  totalRequiredCredits: number;
  minGraduationCGPA: number;
  warningCGPAThreshold: number;
  coursePassPercentage: number;
  finalExamWeight: number;
  finalExamPassPercentage: number;
  finalExamDurationMinutes: number;
  retakeCapPercentage: number;
  improvementRetakeLimit: number;
  projectEligibilityPercentage: number;
  projectPassPercentage: number;
  trainingEligibilityPercentage: number;
  trainingWeeks: number;
  trainingHoursPerWeek: number;
  prerequisiteAttendancePercentage: number;
  honorsMinCGPA: number;
  honorsMaxRegularSemesters: number;
  maxStudyDurationSemesters: number | null;
}

export interface PolicyVersionDto {
  id: number;
  versionNumber: number;
  name: string | null;
  isActive: boolean;
  effectiveCohortFrom: number;
  effectiveCohortTo: number | null;
  decisionReference: string | null;
  parameters: PolicyParametersDto;
  createdAt: string;
  createdByUserName: string | null;
  isEditable: boolean;
}

export interface PolicyVersionListItemDto {
  id: number;
  versionNumber: number;
  name: string | null;
  isActive: boolean;
  effectiveCohortFrom: number;
  effectiveCohortTo: number | null;
  createdAt: string;
  isEditable: boolean;
}

export interface PrerequisiteDto {
  prerequisiteCourseId: number;
  courseCode: string | null;
  courseName: string | null;
  mode: PrerequisiteMode;
}

export interface PrerequisiteItemRequest {
  prerequisiteCourseId: number;
  mode: PrerequisiteMode;
}

export type PrerequisiteMode = "Passed" | "Registered";

export interface RefreshTokenRequestDto {
  accessToken: string | null;
  refreshToken: string | null;
}

export interface RefreshTokenResponseDto {
  token: string | null;
  refreshToken: string | null;
  expiresAt: string;
}

export interface RequirementGroupDto {
  id: number;
  code: string | null;
  name: string | null;
  nameAr: string | null;
  groupType: RequirementGroupType;
  isActive: boolean;
}

export interface RequirementGroupProgressDto {
  groupCode: string | null;
  groupName: string | null;
  groupNameAr: string | null;
  earnedHours: number;
  remainingHours: number;
  requiredHours: number;
}

export type RequirementGroupType = "Credit" | "NonCredit";

export interface ResetPasswordRequestDto {
  email: string | null;
  token: string | null;
  newPassword: string | null;
  confirmNewPassword: string | null;
}

export interface ResolvedCreditLoadDto {
  semesterId: number;
  semesterName: string | null;
  minCredits: number | null;
  maxCredits: number;
  source: CreditLoadSource;
  ruleId: number | null;
  policyVersionId: number | null;
  cgpaUsed: number | null;
  registeredCredits: number;
  remainingCredits: number;
  explanation: string | null;
}

export type SecondaryTrack = "Science" | "Math";

export interface SecondaryTrackRequirementDto {
  track: SecondaryTrack;
  trackName: string | null;
  trackNameAr: string | null;
  courses: TrackRequirementCourseDto[] | null;
}

export interface SemesterDto {
  id: number;
  academicYearId: number;
  academicYearName: string | null;
  name: string | null;
  semesterType: SemesterType;
  startDate: string;
  endDate: string;
  isActive: boolean;
  windows: SemesterWindowsDto;
}

export interface SemesterSummaryDto {
  id: number;
  name: string | null;
  semesterType: SemesterType;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export type SemesterType = "Fall" | "Spring" | "Summer";

export interface SemesterWindowsDto {
  registration: WindowDto;
  drop: WindowDto;
  withdrawal: WindowDto;
  preference: WindowDto;
}

export interface SetCreditLoadOverrideRequest {
  semesterId: number;
  minCreditHours?: number | null;
  maxCreditHours: number;
  reason?: string | null;
}

export interface SetCreditLoadRuleItemDto {
  ruleType: CreditLoadRuleType;
  name?: string | null;
  minCgpa?: number | null;
  maxCgpaExclusive?: number | null;
  minCredits?: number | null;
  maxCredits: number;
}

export interface SetCreditLoadRulesRequest {
  policyVersionId?: number | null;
  effectiveFrom: string;
  rules?: SetCreditLoadRuleItemDto[] | null;
}

export interface SetCurriculumCoursesRequest {
  courses?: CurriculumCourseItemRequest[] | null;
}

export interface SetCurriculumGroupItemRequest {
  requirementGroupId: number;
  compulsoryCredits: number;
  electiveCredits?: number | null;
}

export interface SetCurriculumGroupsRequest {
  groups?: SetCurriculumGroupItemRequest[] | null;
}

export interface SetDropPeriodRequest {
  dropEnd: string;
}

export interface SetGradeScalesRequest {
  scales?: GradeScaleRowDto[] | null;
}

export interface SetHeadDoctorDto {
  headDoctorId?: number | null;
}

export interface SetPrerequisitesRequest {
  prerequisites?: PrerequisiteItemRequest[] | null;
}

export interface SetSecondaryTrackRequirementsRequest {
  requirements?: TrackRequirementItemRequest[] | null;
}

export interface SetWindowRequest {
  start: string;
  end: string;
}

export interface StudentAcademicStandingDto {
  studentCode: string | null;
  studentName: string | null;
  department: string | null;
  level: number;
  levelName: string | null;
  levelNameAr: string | null;
  cgpa: number;
  earnedHours: number;
  remainingHours: number;
  percentage: number;
  totalRequiredCredits: number;
  nextLevelNumber: number | null;
  creditsToNextLevel: number | null;
  groups: RequirementGroupProgressDto[] | null;
  curriculumName: string | null;
  requiredNonCreditCourses: StudentNonCreditCourseDto[] | null;
}

export interface StudentLevelCalculationFailureDto {
  studentId: number;
  error: string | null;
}

export interface StudentListItemDto {
  id: number;
  userId: number;
  studentCode: string | null;
  nationalId: string | null;
  fullNameAr: string | null;
  fullNameEn: string | null;
  email: string | null;
  phone: string | null;
  departmentName: string | null;
  cgpa: number;
  passedCredits: number;
}

export interface StudentListItemDtoPagedResult {
  items: StudentListItemDto[] | null;
  meta: PaginationMetadata;
}

export interface StudentNonCreditCourseDto {
  courseId: number;
  courseCode: string | null;
  courseName: string | null;
  status: string | null;
  courseNameAr: string | null;
}

export interface StudentProfileResponseDto {
  id: number;
  userId: number;
  studentCode: string | null;
  nationalId: string | null;
  firstName: string | null;
  lastName: string | null;
  fullNameAr: string | null;
  fullNameEn: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  nationality: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  governorate: string | null;
  departmentId: number;
  departmentName: string | null;
  secondaryTrack: string | null;
  secondaryCertificateYear: number;
  seatNumber: string | null;
  secondaryScore: number;
  admissionYear: number;
  curriculumVersionId: number;
  academicStatus: string | null;
  cgpa: number;
  passedCredits: number;
  totalWarningsCount: number;
  consecutiveWarningsCount: number;
  academicAdvisorDoctorId: number | null;
  academicAdvisorName: string | null;
  isActive: boolean;
}

export interface StudentTransferCreditsResponseDto {
  studentId: number;
  studentCode: string | null;
  fullNameAr: string | null;
  fullNameEn: string | null;
  previousInstitution: string | null;
  previousFacultyName: string | null;
  totalPassedCredits: number;
  cgpa: number;
  courses: TransferredCourseItemDto[] | null;
}

export interface TeachingAssistantListItemDto {
  id: number;
  userId: number;
  fullNameAr: string | null;
  fullNameEn: string | null;
  email: string | null;
  phoneNumber: string | null;
  departmentName: string | null;
  academicDegree: string | null;
  maxSupervisedProjects: number;
  isActive: boolean;
}

export interface TeachingAssistantListItemDtoPagedResult {
  items: TeachingAssistantListItemDto[] | null;
  meta: PaginationMetadata;
}

export interface TeachingAssistantProfileResponseDto {
  id: number;
  userId: number;
  fullNameAr: string | null;
  fullNameEn: string | null;
  email: string | null;
  phoneNumber: string | null;
  departmentId: number;
  departmentName: string | null;
  academicDegree: string | null;
  hireDate: string;
  maxSupervisedProjects: number;
  isActive: boolean;
}

export interface TrackRequirementCourseDto {
  courseId: number;
  code: string | null;
  name: string | null;
  creditHours: number;
  isCreditBearing: boolean;
}

export interface TrackRequirementItemRequest {
  secondaryTrack: SecondaryTrack;
  courseIds?: number[] | null;
}

export interface TransferDepartmentDto {
  departmentId: number;
}

export interface TransferDoctorDepartmentDto {
  departmentId: number;
}

export interface TransferEmployeeDepartmentDto {
  departmentId: number;
}

export interface TransferTeachingAssistantDepartmentDto {
  departmentId: number;
}

export interface TransferredCourseItemDto {
  courseId: number;
  courseCode?: string | null;
  courseName?: string | null;
  creditHours: number;
  requirementGroupId: number;
  requirementGroupName?: string | null;
  externalCourseCode?: string | null;
  externalCourseName?: string | null;
}

export interface UpdateAcademicLevelItemDto {
  levelNumber: number;
  fromCredits: number;
  toCredits: number;
}

export interface UpdateAcademicLevelsRequest {
  policyVersionId?: number | null;
  levels?: UpdateAcademicLevelItemDto[] | null;
}

export interface UpdateAcademicYearRequest {
  name?: string | null;
  startDate: string;
  endDate: string;
}

export interface UpdateAdminDto {
  fullNameAr?: string | null;
  fullNameEn?: string | null;
  email?: string | null;
  username?: string | null;
  phoneNumber?: string | null;
}

export interface UpdateCohortRangeRequest {
  effectiveCohortTo?: number | null;
}

export interface UpdateCourseRequest {
  name?: string | null;
  nameAr?: string | null;
  description?: string | null;
  creditHours: number;
  isCreditBearing: boolean;
  departmentId: number;
  placement: CoursePlacementRequest;
}

export interface UpdateCurriculumCohortRangeRequest {
  effectiveCohortTo?: number | null;
}

export interface UpdateCurriculumVersionRequest {
  name?: string | null;
  academicPolicyVersionId: number;
  effectiveCohortFrom: number;
  effectiveCohortTo?: number | null;
  decisionReference?: string | null;
}

export interface UpdateDepartmentDto {
  nameAr?: string | null;
  nameEn?: string | null;
  code?: string | null;
  type: DepartmentType;
}

export interface UpdateDoctorAdminDto {
  fullNameAr?: string | null;
  fullNameEn?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  departmentId: number;
  title?: string | null;
  hireDate: string;
  maxSupervisedProjects: number;
}

export interface UpdateDoctorContactDto {
  phoneNumber?: string | null;
  email?: string | null;
}

export interface UpdateEmployeeAdminDto {
  fullNameAr?: string | null;
  fullNameEn?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  departmentId: number;
  jobTitle?: string | null;
  hireDate: string;
}

export interface UpdateEmployeeContactDto {
  phoneNumber?: string | null;
  email?: string | null;
}

export interface UpdatePolicyVersionRequest {
  name?: string | null;
  effectiveCohortFrom: number;
  effectiveCohortTo?: number | null;
  decisionReference?: string | null;
  parameters: PolicyParametersDto;
}

export interface UpdateRequirementGroupRequest {
  code?: string | null;
  name?: string | null;
  nameAr?: string | null;
  groupType: RequirementGroupType;
  isActive: boolean;
}

export interface UpdateSemesterRequest {
  name?: string | null;
  startDate: string;
  endDate: string;
}

export interface UpdateStudentAdminDto {
  fullNameAr?: string | null;
  fullNameEn?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  nationality?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  governorate?: string | null;
  secondaryTrack: SecondaryTrack;
  secondaryCertificateYear: number;
  seatNumber?: string | null;
  secondaryScore: number;
  admissionYear: number;
  curriculumVersionId: number;
  academicAdvisorDoctorId?: number | null;
  academicStatus: AcademicStatus;
  previousInstitution?: string | null;
  previousFacultyName?: string | null;
  cgpa?: number | null;
}

export interface UpdateStudentContactDto {
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  governorate?: string | null;
}

export interface UpdateStudentTransferCreditsRequest {
  completedCourseIds?: number[] | null;
}

export interface UpdateTeachingAssistantAdminDto {
  fullNameAr?: string | null;
  fullNameEn?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  departmentId: number;
  academicDegree?: string | null;
  hireDate: string;
  maxSupervisedProjects: number;
}

export interface UpdateTeachingAssistantContactDto {
  phoneNumber?: string | null;
  email?: string | null;
}

export interface VerifyResetTokenRequestDto {
  email: string | null;
  token: string | null;
}

export interface WindowDto {
  start: string | null;
  end: string | null;
  status: WindowStatus;
}

export type WindowStatus = "NotConfigured" | "Upcoming" | "Open" | "Closed";
