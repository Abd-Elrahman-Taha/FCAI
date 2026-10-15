import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppShell } from './components/layout/AppShell';

// Authentication & Account (1-7)
import { Login } from './pages/auth/Login';
import { FirstLogin } from './pages/auth/FirstLogin';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';
import { Signup } from './pages/auth/Signup';
import { AccountSecurity } from './pages/auth/AccountSecurity';
import { CreateStudentAccount } from './pages/admin/CreateStudentAccount';
import { UserAccountManagement } from './pages/admin/UserAccountManagement';

// Student Portal (8-41)
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentProfile } from './pages/student/StudentProfile';
import { StudentAcademicInfo } from './pages/student/StudentAcademicInfo';
import { StudentCourses } from './pages/student/StudentCourses';
import { StudentRegistration } from './pages/student/StudentRegistration';
import { StudentRegistrationConfirmation } from './pages/student/StudentRegistrationConfirmation';
import { StudentCourseDetails } from './pages/student/StudentCourseDetails';
import { StudentTimetable } from './pages/student/StudentTimetable';
import { StudentExamSchedule } from './pages/student/StudentExamSchedule';
import { StudentAssignments } from './pages/student/StudentAssignments';
import { StudentAssignmentDetails } from './pages/student/StudentAssignmentDetails';
import { StudentLearningMaterials } from './pages/student/StudentLearningMaterials';
import { StudentExams } from './pages/student/StudentExams';
import { StudentExamPlayer } from './pages/student/StudentExamPlayer';
import { StudentExamResult } from './pages/student/StudentExamResult';
import { StudentQrAttendance } from './pages/student/StudentQrAttendance';
import { StudentAttendance } from './pages/student/StudentAttendance';
import { StudentGrades } from './pages/student/StudentGrades';
import { StudentGpa } from './pages/student/StudentGpa';
import { StudentGradeDetails } from './pages/student/StudentGradeDetails';
import { StudentServiceRequests } from './pages/student/StudentServiceRequests';
import { StudentCreateServiceRequest } from './pages/student/StudentCreateServiceRequest';
import { StudentServiceRequestDetails } from './pages/student/StudentServiceRequestDetails';
import { StudentFees } from './pages/student/StudentFees';
import { StudentPaymentCheckout } from './pages/student/StudentPaymentCheckout';
import { StudentPaymentResult } from './pages/student/StudentPaymentResult';
import { StudentPaymentHistory } from './pages/student/StudentPaymentHistory';
import { StudentReceipt } from './pages/student/StudentReceipt';
import { StudentUniversityDocuments } from './pages/student/StudentUniversityDocuments';
import { MessagesList } from './pages/common/MessagesList';
import { ConversationView } from './pages/common/ConversationView';
import { NotificationsPage } from './pages/common/NotificationsPage';
import { StudentStudyAssistant } from './pages/student/StudentStudyAssistant';
import { StudentStudyAssistantChat } from './pages/student/StudentStudyAssistantChat';

// Doctor / Instructor Portal (42-66)
import { DoctorDashboard } from './pages/doctor/DoctorDashboard';
import { DoctorCourseOfferings } from './pages/doctor/DoctorCourseOfferings';
import { DoctorCourseEnrolled } from './pages/doctor/DoctorCourseEnrolled';
import { DoctorCourseContent } from './pages/doctor/DoctorCourseContent';
import { DoctorLecturesMaterials } from './pages/doctor/DoctorLecturesMaterials';
import { DoctorAssignments } from './pages/doctor/DoctorAssignments';
import { DoctorAssignmentSubmissions } from './pages/doctor/DoctorAssignmentSubmissions';
import { DoctorAssignmentGrading } from './pages/doctor/DoctorAssignmentGrading';
import { DoctorQuestionBanks } from './pages/doctor/DoctorQuestionBanks';
import { DoctorQuestionEditor } from './pages/doctor/DoctorQuestionEditor';
import { DoctorExamBuilder } from './pages/doctor/DoctorExamBuilder';
import { DoctorExamQuestionSelection } from './pages/doctor/DoctorExamQuestionSelection';
import { DoctorExamPreviewPublish } from './pages/doctor/DoctorExamPreviewPublish';
import { DoctorShortAnswerGrading } from './pages/doctor/DoctorShortAnswerGrading';
import { DoctorAttendanceSession } from './pages/doctor/DoctorAttendanceSession';
import { DoctorAttendanceQrDisplay } from './pages/doctor/DoctorAttendanceQrDisplay';
import { DoctorAttendanceMonitor } from './pages/doctor/DoctorAttendanceMonitor';
import { DoctorManualAttendance } from './pages/doctor/DoctorManualAttendance';
import { DoctorEditAttendance } from './pages/doctor/DoctorEditAttendance';
import { DoctorAttendanceReview } from './pages/doctor/DoctorAttendanceReview';
import { DoctorGradeEntry } from './pages/doctor/DoctorGradeEntry';
import { DoctorGradeSubmission } from './pages/doctor/DoctorGradeSubmission';
import { DoctorReports } from './pages/doctor/DoctorReports';
import { DoctorAnnouncements } from './pages/doctor/DoctorAnnouncements';
import { DoctorSchedule } from './pages/doctor/DoctorSchedule';

// Teaching Assistant Portal (67-72)
import { TaDashboard } from './pages/ta/TaDashboard';
import { TaSectionEnrolled } from './pages/ta/TaSectionEnrolled';
import { TaSectionAssignments } from './pages/ta/TaSectionAssignments';
import { TaSectionGrading } from './pages/ta/TaSectionGrading';
import { TaAttendance } from './pages/ta/TaAttendance';
import { TaDiscussionsSchedule } from './pages/ta/TaDiscussionsSchedule';

// College Admin Portal (73-101)
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminStudents } from './pages/admin/AdminStudents';
import { AdminDoctors } from './pages/admin/AdminDoctors';
import { AdminTeachingAssistants } from './pages/admin/AdminTeachingAssistants';
import { AdminEmployees } from './pages/admin/AdminEmployees';
import { AdminEmployeeLifecycle } from './pages/admin/AdminEmployeeLifecycle';
import { AdminDepartments } from './pages/admin/AdminDepartments';
import { AdminPermissions } from './pages/admin/AdminPermissions';
import { AdminContentManagement } from './pages/admin/AdminContentManagement';
import { AdminServiceRequests } from './pages/admin/AdminServiceRequests';
import { AdminPaymentMonitoring } from './pages/admin/AdminPaymentMonitoring';
import { AdminReports } from './pages/admin/AdminReports';
import { AdminRegulations } from './pages/admin/AdminRegulations';
import { AdminAcademicYears } from './pages/admin/AdminAcademicYears';
import { AdminLevels } from './pages/admin/AdminLevels';
import { AdminCourses } from './pages/admin/AdminCourses';
import { AdminCourseOfferings } from './pages/admin/AdminCourseOfferings';
import { AdminSections } from './pages/admin/AdminSections';
import { AdminRegistrationPeriods } from './pages/admin/AdminRegistrationPeriods';
import { AdminExamManagement } from './pages/admin/AdminExamManagement';
import { AdminGradeManagement } from './pages/admin/AdminGradeManagement';
import { AdminGradeApproval } from './pages/admin/AdminGradeApproval';
import { AdminGradeScale } from './pages/admin/AdminGradeScale';
import { AdminTimetable } from './pages/admin/AdminTimetable';
import { AdminRooms } from './pages/admin/AdminRooms';
import { AdminExamScheduleManagement } from './pages/admin/AdminExamScheduleManagement';
import { AdminFeeDefinitions } from './pages/admin/AdminFeeDefinitions';
import { AdminStudentFeeGeneration } from './pages/admin/AdminStudentFeeGeneration';
import { AdminDiscounts } from './pages/admin/AdminDiscounts';

// SuperAdmin / System Admin (102-106)
import { SuperAdminRoles } from './pages/superadmin/SuperAdminRoles';
import { SuperAdminSystemConfig } from './pages/superadmin/SuperAdminSystemConfig';
import { SuperAdminSecurityConfig } from './pages/superadmin/SuperAdminSecurityConfig';
import { SuperAdminIntegrations } from './pages/superadmin/SuperAdminIntegrations';
import { SuperAdminAuditLogs } from './pages/superadmin/SuperAdminAuditLogs';

// Employee Portal
import { EmployeeDashboard } from './pages/employee/EmployeeDashboard';
import { EmployeeRequests } from './pages/employee/EmployeeRequests';
import { EmployeeStudentLookup } from './pages/employee/EmployeeStudentLookup';

// Common Directory & Figma Hub
import { ScreensDirectory } from './pages/common/ScreensDirectory';
import { FigmaExportHub } from './pages/common/FigmaExportHub';
import { HomePage } from './pages/common/HomePage';
import { DepartmentsPage } from './pages/public/DepartmentsPage';
import { SmartFeaturesPage } from './pages/public/SmartFeaturesPage';
import { AIAssistantLandingPage } from './pages/public/AIAssistantLandingPage';
import { PlatformMetricsPage } from './pages/public/PlatformMetricsPage';
import { FaqPage } from './pages/public/FaqPage';

const isPublicRoute = (path: string): boolean => {
  const clean = path.replace(/^#\/?/, '').toLowerCase().trim();
  // 1. Landing and Homepage
  if (!clean || clean === 'home' || clean === 'landing' || clean === 'welcome') {
    return true;
  }
  // 2. Showcase / Public Information Pages
  if (
    clean === 'departments' ||
    clean === 'features' || clean === 'smart-features' ||
    clean === 'assistant' || clean === 'ai-assistant' ||
    clean === 'metrics' || clean === 'numbers' || clean === 'platform-numbers' ||
    clean === 'faq' || clean === 'help'
  ) {
    return true;
  }
  // 3. Auth and Onboarding pages
  if (
    clean === 'login' || clean === 'screen/1' ||
    clean === 'first-login' || clean === 'screen/2' ||
    clean === 'forgot-password' || clean === 'screen/3' ||
    clean === 'reset-password' || clean === 'screen/4' ||
    clean === 'signup' || clean === 'register' || clean === 'enrollment'
  ) {
    return true;
  }
  return false;
};

const RouterView: React.FC = () => {
  const { role, switchRole, isAuthenticated, showToast } = useAuth();
  const [currentHash, setCurrentHash] = useState<string>(() => window.location.hash || '');

  const cleanPath = currentHash.replace(/^#\/?/, '').toLowerCase().trim();
  const isPublic = isPublicRoute(cleanPath);

  useEffect(() => {
    const handleHashChange = () => {
      const h = window.location.hash || '';
      setCurrentHash(h);

      const clean = h.replace(/^#\/?/, '').toLowerCase().trim();
      const first = clean.split('/')[0];

      // Route Protection: If not authenticated and trying to access a protected portal page
      if (!isAuthenticated && !isPublicRoute(clean)) {
        sessionStorage.setItem('fcai_redirect_after_login', h);
        showToast('Sign In Required', 'Please sign in to access your institutional portal.', 'info');
        window.location.hash = '#/login';
        return;
      }

      if (isAuthenticated && ['student', 'doctor', 'ta', 'admin', 'employee'].includes(first) && first !== role) {
        switchRole(first as any);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [role, switchRole, isAuthenticated, showToast]);

  // Initial check on mount: If user opens app on a protected portal route without being signed in
  useEffect(() => {
    if (!isAuthenticated && !isPublic) {
      sessionStorage.setItem('fcai_redirect_after_login', window.location.hash || '');
      showToast('Sign In Required', 'Please sign in to access your institutional portal.', 'info');
      window.location.hash = '#/login';
    }
  }, [isAuthenticated, isPublic, showToast]);

  // If not authenticated and on a protected route, render Login with auto-redirect
  if (!isAuthenticated && !isPublic) {
    return (
      <Login
        onLoginSuccess={() => {
          const redirect = sessionStorage.getItem('fcai_redirect_after_login');
          if (redirect) {
            sessionStorage.removeItem('fcai_redirect_after_login');
            window.location.hash = redirect;
          } else {
            window.location.hash = `#/${role}/dashboard`;
          }
        }}
      />
    );
  }

  // Standalone Modern Futuristic Public Landing & Feature Showcase Pages
  if (cleanPath === '' || cleanPath === 'home' || cleanPath === 'landing' || cleanPath === 'welcome') {
    return <HomePage />;
  }
  if (cleanPath === 'departments') {
    return <DepartmentsPage />;
  }
  if (cleanPath === 'features' || cleanPath === 'smart-features') {
    return <SmartFeaturesPage />;
  }
  if (cleanPath === 'assistant' || cleanPath === 'ai-assistant') {
    return <AIAssistantLandingPage />;
  }
  if (cleanPath === 'metrics' || cleanPath === 'numbers' || cleanPath === 'platform-numbers') {
    return <PlatformMetricsPage />;
  }
  if (cleanPath === 'faq' || cleanPath === 'help') {
    return <FaqPage />;
  }

  // Standalone Authentication & Fullscreen screens
  if (cleanPath === 'login' || cleanPath === 'screen/1') {
    return (
      <Login
        onLoginSuccess={() => {
          const redirect = sessionStorage.getItem('fcai_redirect_after_login');
          if (redirect) {
            sessionStorage.removeItem('fcai_redirect_after_login');
            window.location.hash = redirect;
          } else {
            window.location.hash = `#/${role}/dashboard`;
          }
        }}
      />
    );
  }
  if (cleanPath === 'first-login' || cleanPath === 'screen/2') {
    return <FirstLogin onComplete={() => { window.location.hash = `#/${role}/dashboard`; }} />;
  }
  if (cleanPath === 'forgot-password' || cleanPath === 'screen/3') {
    return <ForgotPassword />;
  }
  if (cleanPath === 'reset-password' || cleanPath === 'screen/4') {
    return <ResetPassword />;
  }
  if (cleanPath === 'signup' || cleanPath === 'register' || cleanPath === 'enrollment') {
    return <Signup />;
  }
  if (cleanPath === 'student/exam-player' || cleanPath === 'screen/21') {
    return (
      <AppShell currentPath={cleanPath} isFullShell={false}>
        <StudentExamPlayer />
      </AppShell>
    );
  }

  // Master Switcher for All 106 Screens & Hubs
  const renderScreen = () => {
    // Hubs & Common
    if (cleanPath === 'screens' || cleanPath === 'sitemap') return <ScreensDirectory />;
    if (cleanPath === 'figma-export' || cleanPath === 'figma') return <FigmaExportHub />;
    if (cleanPath === 'notifications' || cleanPath.endsWith('/notifications') || cleanPath === 'screen/39') return <NotificationsPage />;
    if (cleanPath === 'messages' || cleanPath === 'screen/37') return <MessagesList />;
    if (cleanPath === 'conversation' || cleanPath.startsWith('conversation/') || cleanPath === 'screen/38') return <ConversationView />;

    // 1-7: Auth & Account
    if (cleanPath === 'screen/5' || cleanPath === 'auth/account-security' || cleanPath === 'account-security') return <AccountSecurity />;
    if (cleanPath === 'screen/6' || cleanPath === 'admin/create-student') return <CreateStudentAccount />;
    if (cleanPath === 'screen/7' || cleanPath === 'admin/users' || cleanPath === 'admin/user-accounts') return <UserAccountManagement />;

    // 8-41: Student Portal
    if (cleanPath === 'screen/8' || cleanPath === 'student' || cleanPath === 'student/dashboard') return <StudentDashboard />;
    if (cleanPath === 'screen/9' || cleanPath === 'student/profile') return <StudentProfile />;
    if (cleanPath === 'screen/10' || cleanPath === 'student/academic-info' || cleanPath === 'student/academic') return <StudentAcademicInfo />;
    if (cleanPath === 'screen/11' || cleanPath === 'student/courses') return <StudentCourses />;
    if (cleanPath === 'screen/12' || cleanPath === 'student/registration' || cleanPath === 'student/course-catalog') return <StudentRegistration />;
    if (cleanPath === 'screen/13' || cleanPath === 'student/registration-confirmation') return <StudentRegistrationConfirmation />;
    if (cleanPath === 'screen/14' || cleanPath === 'student/course-details') return <StudentCourseDetails />;
    if (cleanPath === 'screen/15' || cleanPath === 'student/timetable') return <StudentTimetable />;
    if (cleanPath === 'screen/16' || cleanPath === 'student/exam-schedule') return <StudentExamSchedule />;
    if (cleanPath === 'screen/17' || cleanPath === 'student/assignments') return <StudentAssignments />;
    if (cleanPath === 'screen/18' || cleanPath === 'student/assignment-details') return <StudentAssignmentDetails />;
    if (cleanPath === 'screen/19' || cleanPath === 'student/learning-materials') return <StudentLearningMaterials />;
    if (cleanPath === 'screen/20' || cleanPath === 'student/exams') return <StudentExams />;
    if (cleanPath === 'screen/22' || cleanPath === 'student/exam-result') return <StudentExamResult />;
    if (cleanPath === 'screen/23' || cleanPath === 'student/qr-attendance') return <StudentQrAttendance />;
    if (cleanPath === 'screen/24' || cleanPath === 'student/attendance') return <StudentAttendance />;
    if (cleanPath === 'screen/25' || cleanPath === 'student/grades') return <StudentGrades />;
    if (cleanPath === 'screen/26' || cleanPath === 'student/gpa') return <StudentGpa />;
    if (cleanPath === 'screen/27' || cleanPath === 'student/grade-details') return <StudentGradeDetails />;
    if (cleanPath === 'screen/28' || cleanPath === 'student/service-requests' || cleanPath === 'student/requests') return <StudentServiceRequests />;
    if (cleanPath === 'screen/29' || cleanPath === 'student/create-request') return <StudentCreateServiceRequest />;
    if (cleanPath === 'screen/30' || cleanPath === 'student/request-details') return <StudentServiceRequestDetails />;
    if (cleanPath === 'screen/31' || cleanPath === 'student/fees') return <StudentFees />;
    if (cleanPath === 'screen/32' || cleanPath === 'student/payment-checkout' || cleanPath === 'student/checkout') return <StudentPaymentCheckout />;
    if (cleanPath === 'screen/33' || cleanPath === 'student/payment-result') return <StudentPaymentResult />;
    if (cleanPath === 'screen/34' || cleanPath === 'student/payment-history') return <StudentPaymentHistory />;
    if (cleanPath === 'screen/35' || cleanPath === 'student/receipt') return <StudentReceipt />;
    if (cleanPath === 'screen/36' || cleanPath === 'student/documents' || cleanPath === 'student/university-documents') return <StudentUniversityDocuments />;
    if (cleanPath === 'screen/40' || cleanPath === 'student/study-assistant') return <StudentStudyAssistant />;
    if (cleanPath === 'screen/41' || cleanPath === 'student/study-assistant-chat') return <StudentStudyAssistantChat />;

    // 42-66: Doctor / Instructor Portal
    if (cleanPath === 'screen/42' || cleanPath === 'doctor' || cleanPath === 'doctor/dashboard') return <DoctorDashboard />;
    if (cleanPath === 'screen/43' || cleanPath === 'doctor/offerings') return <DoctorCourseOfferings />;
    if (cleanPath === 'screen/44' || cleanPath === 'doctor/course-enrolled') return <DoctorCourseEnrolled />;
    if (cleanPath === 'screen/45' || cleanPath === 'doctor/course-content') return <DoctorCourseContent />;
    if (cleanPath === 'screen/46' || cleanPath === 'doctor/lectures-materials') return <DoctorLecturesMaterials />;
    if (cleanPath === 'screen/47' || cleanPath === 'doctor/assignments') return <DoctorAssignments />;
    if (cleanPath === 'screen/48' || cleanPath === 'doctor/assignment-submissions') return <DoctorAssignmentSubmissions />;
    if (cleanPath === 'screen/49' || cleanPath === 'doctor/assignment-grading') return <DoctorAssignmentGrading />;
    if (cleanPath === 'screen/50' || cleanPath === 'doctor/question-banks') return <DoctorQuestionBanks />;
    if (cleanPath === 'screen/51' || cleanPath === 'doctor/question-editor') return <DoctorQuestionEditor />;
    if (cleanPath === 'screen/52' || cleanPath === 'doctor/exam-builder' || cleanPath === 'doctor/exams') return <DoctorExamBuilder />;
    if (cleanPath === 'screen/53' || cleanPath === 'doctor/exam-questions') return <DoctorExamQuestionSelection />;
    if (cleanPath === 'screen/54' || cleanPath === 'doctor/exam-preview') return <DoctorExamPreviewPublish />;
    if (cleanPath === 'screen/55' || cleanPath === 'doctor/short-answer-grading') return <DoctorShortAnswerGrading />;
    if (cleanPath === 'screen/56' || cleanPath === 'doctor/attendance-session' || cleanPath === 'doctor/attendance') return <DoctorAttendanceSession />;
    if (cleanPath === 'screen/57' || cleanPath === 'doctor/attendance-qr-display') return <DoctorAttendanceQrDisplay />;
    if (cleanPath === 'screen/58' || cleanPath === 'doctor/attendance-monitor') return <DoctorAttendanceMonitor />;
    if (cleanPath === 'screen/59' || cleanPath === 'doctor/manual-attendance') return <DoctorManualAttendance />;
    if (cleanPath === 'screen/60' || cleanPath === 'doctor/edit-attendance') return <DoctorEditAttendance />;
    if (cleanPath === 'screen/61' || cleanPath === 'doctor/attendance-review') return <DoctorAttendanceReview />;
    if (cleanPath === 'screen/62' || cleanPath === 'doctor/grade-entry' || cleanPath === 'doctor/gradebook') return <DoctorGradeEntry />;
    if (cleanPath === 'screen/63' || cleanPath === 'doctor/grade-submission') return <DoctorGradeSubmission />;
    if (cleanPath === 'screen/64' || cleanPath === 'doctor/reports') return <DoctorReports />;
    if (cleanPath === 'screen/65' || cleanPath === 'doctor/announcements') return <DoctorAnnouncements />;
    if (cleanPath === 'screen/66' || cleanPath === 'doctor/schedule') return <DoctorSchedule />;

    // 67-72: Teaching Assistant Portal
    if (cleanPath === 'screen/67' || cleanPath === 'ta' || cleanPath === 'ta/dashboard') return <TaDashboard />;
    if (cleanPath === 'screen/68' || cleanPath === 'ta/section-enrolled') return <TaSectionEnrolled />;
    if (cleanPath === 'screen/69' || cleanPath === 'ta/section-assignments') return <TaSectionAssignments />;
    if (cleanPath === 'screen/70' || cleanPath === 'ta/section-grading') return <TaSectionGrading />;
    if (cleanPath === 'screen/71' || cleanPath === 'ta/attendance' || cleanPath === 'ta/sections') return <TaAttendance />;
    if (cleanPath === 'screen/72' || cleanPath === 'ta/discussions' || cleanPath === 'ta/schedule') return <TaDiscussionsSchedule />;

    // 73-101: College Admin Portal
    if (cleanPath === 'screen/73' || cleanPath === 'admin' || cleanPath === 'admin/dashboard') return <AdminDashboard />;
    if (cleanPath === 'screen/74' || cleanPath === 'admin/students') return <AdminStudents />;
    if (cleanPath === 'screen/75' || cleanPath === 'admin/doctors' || cleanPath === 'admin/faculty') return <AdminDoctors />;
    if (cleanPath === 'screen/76' || cleanPath === 'admin/tas' || cleanPath === 'admin/teaching-assistants') return <AdminTeachingAssistants />;
    if (cleanPath === 'screen/77' || cleanPath === 'admin/employees') return <AdminEmployees />;
    if (cleanPath === 'screen/78' || cleanPath === 'admin/employee-lifecycle') return <AdminEmployeeLifecycle />;
    if (cleanPath === 'screen/79' || cleanPath === 'admin/departments') return <AdminDepartments />;
    if (cleanPath === 'screen/80' || cleanPath === 'admin/permissions') return <AdminPermissions />;
    if (cleanPath === 'screen/81' || cleanPath === 'admin/content' || cleanPath === 'admin/content-management') return <AdminContentManagement />;
    if (cleanPath === 'screen/82' || cleanPath === 'admin/service-requests' || cleanPath === 'admin/requests') return <AdminServiceRequests />;
    if (cleanPath === 'screen/83' || cleanPath === 'admin/payment-monitoring' || cleanPath === 'admin/payments') return <AdminPaymentMonitoring />;
    if (cleanPath === 'screen/84' || cleanPath === 'admin/reports') return <AdminReports />;
    if (cleanPath === 'screen/85' || cleanPath === 'admin/regulations') return <AdminRegulations />;
    if (cleanPath === 'screen/86' || cleanPath === 'admin/academic-years' || cleanPath === 'admin/academic-structure') return <AdminAcademicYears />;
    if (cleanPath === 'screen/87' || cleanPath === 'admin/levels') return <AdminLevels />;
    if (cleanPath === 'screen/88' || cleanPath === 'admin/courses') return <AdminCourses />;
    if (cleanPath === 'screen/89' || cleanPath === 'admin/course-offerings' || cleanPath === 'admin/offerings') return <AdminCourseOfferings />;
    if (cleanPath === 'screen/90' || cleanPath === 'admin/sections') return <AdminSections />;
    if (cleanPath === 'screen/91' || cleanPath === 'admin/registration-periods') return <AdminRegistrationPeriods />;
    if (cleanPath === 'screen/92' || cleanPath === 'admin/exam-management') return <AdminExamManagement />;
    if (cleanPath === 'screen/93' || cleanPath === 'admin/grade-management') return <AdminGradeManagement />;
    if (cleanPath === 'screen/94' || cleanPath === 'admin/grade-approval' || cleanPath === 'admin/grades') return <AdminGradeApproval />;
    if (cleanPath === 'screen/95' || cleanPath === 'admin/grade-scale') return <AdminGradeScale />;
    if (cleanPath === 'screen/96' || cleanPath === 'admin/timetable') return <AdminTimetable />;
    if (cleanPath === 'screen/97' || cleanPath === 'admin/rooms') return <AdminRooms />;
    if (cleanPath === 'screen/98' || cleanPath === 'admin/exam-schedule-management' || cleanPath === 'admin/exam-schedule') return <AdminExamScheduleManagement />;
    if (cleanPath === 'screen/99' || cleanPath === 'admin/fee-definitions' || cleanPath === 'admin/fees') return <AdminFeeDefinitions />;
    if (cleanPath === 'screen/100' || cleanPath === 'admin/student-fee-generation') return <AdminStudentFeeGeneration />;
    if (cleanPath === 'screen/101' || cleanPath === 'admin/discounts') return <AdminDiscounts />;

    // 102-106: SuperAdmin Portal
    if (cleanPath === 'screen/102' || cleanPath === 'superadmin/roles') return <SuperAdminRoles />;
    if (cleanPath === 'screen/103' || cleanPath === 'superadmin/system-config' || cleanPath === 'superadmin') return <SuperAdminSystemConfig />;
    if (cleanPath === 'screen/104' || cleanPath === 'superadmin/security-config') return <SuperAdminSecurityConfig />;
    if (cleanPath === 'screen/105' || cleanPath === 'superadmin/integrations') return <SuperAdminIntegrations />;
    if (cleanPath === 'screen/106' || cleanPath === 'superadmin/audit-logs') return <SuperAdminAuditLogs />;

    // Employee Portal
    if (cleanPath === 'employee' || cleanPath === 'employee/dashboard') return <EmployeeDashboard />;
    if (cleanPath === 'employee/requests') return <EmployeeRequests />;
    if (cleanPath === 'employee/students' || cleanPath === 'employee/lookup') return <EmployeeStudentLookup />;

    // Fallback: Current role dashboard
    return role === 'doctor' ? <DoctorDashboard /> :
           role === 'ta' ? <TaDashboard /> :
           role === 'admin' ? <AdminDashboard /> :
           role === 'employee' ? <EmployeeDashboard /> :
           <StudentDashboard />;
  };

  return (
    <AppShell currentPath={cleanPath}>
      {renderScreen()}
    </AppShell>
  );
};

export function App() {
  return (
    <AuthProvider>
      <RouterView />
    </AuthProvider>
  );
}

export default App;
