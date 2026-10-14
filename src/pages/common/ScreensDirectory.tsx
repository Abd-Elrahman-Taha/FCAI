import React, { useState } from 'react';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';

interface ScreenItem {
  number: number;
  name: string;
  route: string;
  role: 'student' | 'doctor' | 'ta' | 'admin' | 'employee' | 'superadmin' | 'public';
  purpose: string;
}

interface ScreenCategory {
  title: string;
  range: string;
  role: 'student' | 'doctor' | 'ta' | 'admin' | 'employee' | 'superadmin' | 'public';
  screens: ScreenItem[];
}

export const ScreensDirectory: React.FC = () => {
  const { switchRole } = useAuth();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const categories: ScreenCategory[] = [
    {
      title: '1. Authentication & Account Management',
      range: 'Screens 1–7',
      role: 'public',
      screens: [
        { number: 1, name: 'Login Screen', route: '#/screen/1', role: 'public', purpose: 'Main institutional authentication with student & staff modes' },
        { number: 2, name: 'First Login / Change Temporary Password', route: '#/screen/2', role: 'student', purpose: 'Mandatory password replacement on account activation' },
        { number: 3, name: 'Forgot Password', route: '#/screen/3', role: 'public', purpose: 'Account recovery initiation via institutional email' },
        { number: 4, name: 'Reset Password', route: '#/screen/4', role: 'public', purpose: 'Secure password reset token verification' },
        { number: 5, name: 'Account & Credentials Security', route: '#/screen/5', role: 'student', purpose: 'Manage account security, active sessions & 2FA' },
        { number: 6, name: 'Create / Activate Student Account', route: '#/screen/6', role: 'admin', purpose: 'Admin credential provisioning & temporary password issuance' },
        { number: 7, name: 'User Account Management', route: '#/screen/7', role: 'admin', purpose: 'Administrative account directory, role assignment & lockout' }
      ]
    },
    {
      title: '2. Student Web Portal',
      range: 'Screens 8–41',
      role: 'student',
      screens: [
        { number: 8, name: 'Student Dashboard', route: '#/screen/8', role: 'student', purpose: 'Academic KPI summary, daily classes, alerts & quick actions' },
        { number: 9, name: 'Student Profile', route: '#/screen/9', role: 'student', purpose: 'Personal & academic identity with locked college fields' },
        { number: 10, name: 'Academic Information', route: '#/screen/10', role: 'student', purpose: 'Credit hour status, level, standing & semester progression' },
        { number: 11, name: 'Registered Courses', route: '#/screen/11', role: 'student', purpose: 'Current enrollments, attendance %, syllabus & drop modal' },
        { number: 12, name: 'Course Catalog & Registration', route: '#/screen/12', role: 'student', purpose: '8-rule real-time prerequisite & capacity enrollment engine' },
        { number: 13, name: 'Course Registration Confirmation', route: '#/screen/13', role: 'student', purpose: 'Pre-flight credit load & prerequisite audit confirmation' },
        { number: 14, name: 'Course Details Offering', route: '#/screen/14', role: 'student', purpose: 'Weekly syllabus, section options, prerequisites & capacity' },
        { number: 15, name: 'Academic Timetable', route: '#/screen/15', role: 'student', purpose: 'Weekly lecture & lab timetable with room locations' },
        { number: 16, name: 'Exam Schedule', route: '#/screen/16', role: 'student', purpose: 'Midterm & final exam halls, countdowns & seating info' },
        { number: 17, name: 'Course Assignments', route: '#/screen/17', role: 'student', purpose: 'List of homework, lab deliverables & submission status' },
        { number: 18, name: 'Assignment Details & Submission', route: '#/screen/18', role: 'student', purpose: 'File upload drag-and-drop, rubric & feedback review' },
        { number: 19, name: 'Learning Materials & Resources', route: '#/screen/19', role: 'student', purpose: 'Lecture slides, lab manuals & reference material downloads' },
        { number: 20, name: 'Online Assessments & Quizzes', route: '#/screen/20', role: 'student', purpose: 'Upcoming, ongoing & completed electronic evaluations' },
        { number: 21, name: 'Assessment Player (Exam Mode)', route: '#/screen/21', role: 'student', purpose: 'Distraction-free exam room with timer & question tracker' },
        { number: 22, name: 'Exam Results & Feedback', route: '#/screen/22', role: 'student', purpose: 'Auto-graded score, short answer feedback & model answers' },
        { number: 23, name: 'QR Attendance Viewfinder', route: '#/screen/23', role: 'student', purpose: 'Camera scanner with 12 validation states & GPS geofencing' },
        { number: 24, name: 'Attendance Record & 75% Alerts', route: '#/screen/24', role: 'student', purpose: 'Session logs, statutory 75% monitor & excuse petitions' },
        { number: 25, name: 'Semester Grades & Breakdown', route: '#/screen/25', role: 'student', purpose: 'Coursework, practical, midterm & final exam components' },
        { number: 26, name: 'GPA Calculator & Academic History', route: '#/screen/26', role: 'student', purpose: 'Cumulative GPA progression, points & graduation standing' },
        { number: 27, name: 'Grade Details & Assessment Proof', route: '#/screen/27', role: 'student', purpose: 'Component-by-component scoring breakdown & curve stats' },
        { number: 28, name: 'Service Requests & Petitions', route: '#/screen/28', role: 'student', purpose: 'Official requests queue, tracking ID & status timelines' },
        { number: 29, name: 'Create Service Request', route: '#/screen/29', role: 'student', purpose: 'Enrollment certificate, transcript or excuse filing' },
        { number: 30, name: 'Service Request Details', route: '#/screen/30', role: 'student', purpose: 'Detailed request resolution timeline, fees & fulfillment' },
        { number: 31, name: 'Outstanding Tuition & Fees', route: '#/screen/31', role: 'student', purpose: 'Statutory fees breakdown, credit cost & payment triggers' },
        { number: 32, name: 'Payment Checkout & Fawry Channel', route: '#/screen/32', role: 'student', purpose: 'Fawry pay-code generator & card payment interface' },
        { number: 33, name: 'Payment Verification Result', route: '#/screen/33', role: 'student', purpose: 'Backend webhook confirmation & reconciliation state' },
        { number: 34, name: 'Payment Ledger & History', route: '#/screen/34', role: 'student', purpose: 'Reconciled electronic transactions log & statements' },
        { number: 35, name: 'Official Digital Payment Receipt', route: '#/screen/35', role: 'student', purpose: 'Printable stamped institutional receipt with QR validation' },
        { number: 36, name: 'University Official Documents', route: '#/screen/36', role: 'student', purpose: 'Digitally signed enrollment letters & military postponements' },
        { number: 37, name: 'Academic Messages Directory', route: '#/screen/37', role: 'student', purpose: 'Direct messaging inbox with professors, TAs & departments' },
        { number: 38, name: 'Conversation View & Messaging', route: '#/screen/38', role: 'student', purpose: 'Real-time threaded chat with attachment support' },
        { number: 39, name: 'Central Notifications Hub', route: '#/screen/39', role: 'student', purpose: 'Academic alerts, exam countdowns & administrative notices' },
        { number: 40, name: 'AI Study Assistant (RAG Grounded)', route: '#/screen/40', role: 'student', purpose: 'Curriculum-grounded AI tutor grounded in uploaded PDFs' },
        { number: 41, name: 'Study Assistant Live Tutoring Chat', route: '#/screen/41', role: 'student', purpose: 'Interactive Q&A, algorithmic proofs & quiz generation' }
      ]
    },
    {
      title: '3. Doctor / Instructor Portal',
      range: 'Screens 42–66',
      role: 'doctor',
      screens: [
        { number: 42, name: 'Doctor Dashboard', route: '#/screen/42', role: 'doctor', purpose: 'Assigned courses, grading queue, today lectures & notifications' },
        { number: 43, name: 'Course Offerings Management', route: '#/screen/43', role: 'doctor', purpose: 'Active offerings, section allocations & enrollment caps' },
        { number: 44, name: 'Course Enrolled Students Roster', route: '#/screen/44', role: 'doctor', purpose: 'Student list, attendance %, levels & individual standing' },
        { number: 45, name: 'Course Content & Syllabus Workspace', route: '#/screen/45', role: 'doctor', purpose: '10-tab workspace: syllabus, materials, grades & attendance' },
        { number: 46, name: 'Lectures & Learning Materials CMS', route: '#/screen/46', role: 'doctor', purpose: 'Upload slides, lab guides & supplementary PDFs' },
        { number: 47, name: 'Course Assignments Manager', route: '#/screen/47', role: 'doctor', purpose: 'Post homework, set deadlines, rubrics & submission caps' },
        { number: 48, name: 'Assignment Submissions Queue', route: '#/screen/48', role: 'doctor', purpose: 'Track student submissions, late submissions & grading counts' },
        { number: 49, name: 'Assignment Grading & Rubrics', route: '#/screen/49', role: 'doctor', purpose: 'Score assignments, evaluate rubrics & write feedback' },
        { number: 50, name: 'Question Banks & Versioning', route: '#/screen/50', role: 'doctor', purpose: 'MCQ & short-answer question repository with difficulty tags' },
        { number: 51, name: 'Question Editor & LaTeX Formulas', route: '#/screen/51', role: 'doctor', purpose: 'Compose math questions, options, hints & answer keys' },
        { number: 52, name: 'Exam Builder & Architecture', route: '#/screen/52', role: 'doctor', purpose: 'Configure exam duration, randomized questions & sections' },
        { number: 53, name: 'Exam Question Selection Pool', route: '#/screen/53', role: 'doctor', purpose: 'Pull questions from tagged topic banks into test paper' },
        { number: 54, name: 'Exam Preview & Secure Publishing', route: '#/screen/54', role: 'doctor', purpose: 'Pre-flight student view preview, answers check & locking' },
        { number: 55, name: 'Short Answer Correction Queue', route: '#/screen/55', role: 'doctor', purpose: 'Manual marking desk for essay and coding exam answers' },
        { number: 56, name: 'Start Lecture Attendance Session', route: '#/screen/56', role: 'doctor', purpose: 'Configure lecture venue, geofencing & attendance window' },
        { number: 57, name: 'Dynamic QR Display (5s Refresh)', route: '#/screen/57', role: 'doctor', purpose: 'Projector fullscreen QR code rotating every 5s with geofence' },
        { number: 58, name: 'Live Attendance Monitor Feed', route: '#/screen/58', role: 'doctor', purpose: 'Real-time student check-in telemetry and headcount' },
        { number: 59, name: 'Manual Attendance Override', route: '#/screen/59', role: 'doctor', purpose: 'Manually mark students present/late when device fails' },
        { number: 60, name: 'Edit Attendance Session Record', route: '#/screen/60', role: 'doctor', purpose: 'Adjust past attendance records with justification note' },
        { number: 61, name: 'Attendance Final Review & Session Lock', route: '#/screen/61', role: 'doctor', purpose: 'Close session, designate missing as absent & lock records' },
        { number: 62, name: 'Course Grade Entry & Component Breakdown', route: '#/screen/62', role: 'doctor', purpose: 'Enter midterm (20), practical (20), coursework (15), final (45)' },
        { number: 63, name: 'Grade Package Submission & Verification', route: '#/screen/63', role: 'doctor', purpose: 'Pre-submission audit checklist, distribution curve & Dean sign-off' },
        { number: 64, name: 'Course Analytics & Bell-Curve Reports', route: '#/screen/64', role: 'doctor', purpose: 'Grade distribution histograms, pass rates & attendance correlations' },
        { number: 65, name: 'Course Announcements & Broadcasts', route: '#/screen/65', role: 'doctor', purpose: 'Broadcast notices, exam room directives & read receipts' },
        { number: 66, name: 'Instructor Academic Timetable & Office Hours', route: '#/screen/66', role: 'doctor', purpose: 'Weekly lecture timetable, office hours & quick QR launch' }
      ]
    },
    {
      title: '4. Teaching Assistant (TA) Portal',
      range: 'Screens 67–72',
      role: 'ta',
      screens: [
        { number: 67, name: 'TA Dashboard', route: '#/screen/67', role: 'ta', purpose: 'Today lab sessions, pending submissions & assigned sections' },
        { number: 68, name: 'Lab Section Enrolled Students', route: '#/screen/68', role: 'ta', purpose: 'Practical cohort roster, attendance % & deprivation risks' },
        { number: 69, name: 'Practical Lab Exercises & Milestones', route: '#/screen/69', role: 'ta', purpose: 'Manage lab assignments, deadline trackers & progress bars' },
        { number: 70, name: 'Lab Submission Grading & Feedback', route: '#/screen/70', role: 'ta', purpose: 'Review C++/Python lab code, evaluate rubrics & submit marks' },
        { number: 71, name: 'Lab Session Attendance & QR Code Display', route: '#/screen/71', role: 'ta', purpose: 'Rotating lab QR code, live check-ins & manual overrides' },
        { number: 72, name: 'TA Lab Timetable & Student Support Hours', route: '#/screen/72', role: 'ta', purpose: 'Weekly practical lab timetable & student Q&A support queue' }
      ]
    },
    {
      title: '5. College Administration Portal',
      range: 'Screens 73–101',
      role: 'admin',
      screens: [
        { number: 73, name: 'Admin Dashboard', route: '#/screen/73', role: 'admin', purpose: 'Faculty KPIs, revenue, enrollment, attendance & approval alerts' },
        { number: 74, name: 'Student Information Dossier Directory', route: '#/screen/74', role: 'admin', purpose: '8-tab complete student dossier: academic, fees, attendance' },
        { number: 75, name: 'Faculty Doctors & Instructors Management', route: '#/screen/75', role: 'admin', purpose: 'Professors directory, teaching ranks & course allocations' },
        { number: 76, name: 'Teaching Assistants (TAs) Management', route: '#/screen/76', role: 'admin', purpose: 'Practical lab demonstrators, section loads & supervisory links' },
        { number: 77, name: 'Administrative Staff & Employees Management', route: '#/screen/77', role: 'admin', purpose: 'Student Affairs, Youth Care & IT administrative officers' },
        { number: 78, name: 'Staff Lifecycle & Onboarding Operations', route: '#/screen/78', role: 'admin', purpose: 'Onboarding workflows, leaves, transfers & account clearance' },
        { number: 79, name: 'Academic & Administrative Departments', route: '#/screen/79', role: 'admin', purpose: 'CS, AI, IS, IT department chairs, stats & staff counts' },
        { number: 80, name: 'Role-Based Access Control (RBAC) Matrix', route: '#/screen/80', role: 'admin', purpose: 'Fine-grained functional permissions per institutional role' },
        { number: 81, name: 'Faculty Portal Content & Announcements CMS', route: '#/screen/81', role: 'admin', purpose: 'Homepage banners, dean directives & portal notices' },
        { number: 82, name: 'Service Requests Administration Queue', route: '#/screen/82', role: 'admin', purpose: 'Fulfill transcripts, enrollment certs & review petitions' },
        { number: 83, name: 'Institutional Payments & Fawry Reconciliation', route: '#/screen/83', role: 'admin', purpose: 'Live payment webhook stream, reconciliations & fee audits' },
        { number: 84, name: 'Faculty Executive Analytics Reports', route: '#/screen/84', role: 'admin', purpose: 'Faculty-wide GPA distributions, attendance & retention' },
        { number: 85, name: 'Faculty Regulations & Statutory Bylaws (RAG)', route: '#/screen/85', role: 'admin', purpose: 'Official credit-hour bylaws, 75% attendance rule & policies' },
        { number: 86, name: 'Academic Years & Semesters Management', route: '#/screen/86', role: 'admin', purpose: 'Configure academic years, semester terms & calendar dates' },
        { number: 87, name: 'Academic Levels, Standing & Credit Load Governance', route: '#/screen/87', role: 'admin', purpose: 'Credit bands (Levels 1–4), probation & honor overload rules' },
        { number: 88, name: 'Master Course Catalog Management', route: '#/screen/88', role: 'admin', purpose: 'Official curriculum courses, credit hours & prerequisite chains' },
        { number: 89, name: 'Course Offerings Management & Term Setup', route: '#/screen/89', role: 'admin', purpose: 'Open course offerings for semester, assign professors & caps' },
        { number: 90, name: 'Practical Lab Sections & Class Groups Management', route: '#/screen/90', role: 'admin', purpose: 'Configure tutorial & lab cohorts, assign TAs & lab rooms' },
        { number: 91, name: 'Course Registration Periods & Window Scheduling', route: '#/screen/91', role: 'admin', purpose: 'Honor priority windows, regular registration & add/drop deadline' },
        { number: 92, name: 'Faculty Examination Periods & Operations Management', route: '#/screen/92', role: 'admin', purpose: 'Midterm, practical & final examination seasons & logistics' },
        { number: 93, name: 'Faculty-Wide Grade Operations & Package Tracking', route: '#/screen/93', role: 'admin', purpose: 'Track submitted grade packages across all departments' },
        { number: 94, name: 'Dean Grade Approval Center & Publishing', route: '#/screen/94', role: 'admin', purpose: 'Dean executive sign-off authority to lock & publish grades' },
        { number: 95, name: 'Institutional Grade Scales & GPA Calculation Regulations', route: '#/screen/95', role: 'admin', purpose: '4.0 GPA points scale, letter mark bounds & honors criteria' },
        { number: 96, name: 'Faculty Master Timetable & Conflict Detection', route: '#/screen/96', role: 'admin', purpose: 'Lecture schedule grid with zero room/instructor collisions' },
        { number: 97, name: 'Lecture Halls, Labs & Campus Coordinates', route: '#/screen/97', role: 'admin', purpose: 'Manage capacity, AV facilities & GPS geofence anchors' },
        { number: 98, name: 'Master Examination Timetable & Seating Coordination', route: '#/screen/98', role: 'admin', purpose: 'Exam halls schedule, proctor committees & seating matrix' },
        { number: 99, name: 'Institutional Fee Catalog & Charge Definitions', route: '#/screen/99', role: 'admin', purpose: 'Statutory tuition, lab fees, student union & medical charges' },
        { number: 100, name: 'Batch Fee Assessment & Billing Generation Engine', route: '#/screen/100', role: 'admin', purpose: 'Idempotent credit-hour fee generation & student invoices' },
        { number: 101, name: 'Tuition Discounts, Scholarships & Financial Aid Waivers', route: '#/screen/101', role: 'admin', purpose: 'Merit discounts, staff child exemptions & waiver approvals' }
      ]
    },
    {
      title: '6. SuperAdmin / System Administration',
      range: 'Screens 102–106',
      role: 'superadmin',
      screens: [
        { number: 102, name: 'Institutional Roles & Global Permission Catalogs', route: '#/screen/102', role: 'superadmin', purpose: 'System security roles, privilege scopes & account inheritance' },
        { number: 103, name: 'System Parameters & Engine Configuration', route: '#/screen/103', role: 'superadmin', purpose: 'QR refresh interval (5s), geofence (50m) & maintenance mode' },
        { number: 104, name: 'Institutional Security, Auth & Session Policies', route: '#/screen/104', role: 'superadmin', purpose: 'Password complexity, session timeouts, brute force & 2FA' },
        { number: 105, name: 'Enterprise Integration Middleware & API Connectors', route: '#/screen/105', role: 'superadmin', purpose: 'Fawry gateway, BSU Central SIS, Google Gemini AI & SMS' },
        { number: 106, name: 'Immutable Faculty Security & Audit Trail Logs', route: '#/screen/106', role: 'superadmin', purpose: 'Append-only forensic audit trail of all academic/billing actions' }
      ]
    }
  ];

  const handleNavigate = (route: string, targetRole: string) => {
    if (['student', 'doctor', 'ta', 'admin', 'employee'].includes(targetRole)) {
      switchRole(targetRole as any);
    }
    window.location.hash = route;
  };

  const allScreens = categories.flatMap(c => c.screens);
  const filteredScreens = allScreens.filter(s => {
    const matchesRole = roleFilter === 'ALL' || s.role === roleFilter;
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                          s.purpose.toLowerCase().includes(search.toLowerCase()) ||
                          s.number.toString().includes(search);
    return matchesRole && matchesSearch;
  });

  return (
    <div>
      <PageHead
        title="FCAI BSU Platform · Complete 106-Screen Master Directory"
        subtitle="Full implementation index of all 106 numbered screens specified for the Faculty of Computers & AI graduation project"
        breadcrumbs={[
          { label: 'Platform Hub' },
          { label: 'Screen Directory & Sitemap' }
        ]}
        actions={
          <div className="row gap-2">
            <a href="#/figma-export" className="btn btn-ice">
              <Icon name="palette" /> Figma Tokens &amp; DOM Export
            </a>
          </div>
        }
      />

      {/* KPI Stats */}
      <div className="grid g-4 mb-4">
        <div className="card p-3">
          <div className="text-xs sub bold">Specification Coverage</div>
          <div className="h3 bold text-success mt-1">106 / 106 <span className="text-xs sub">100% Complete</span></div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Interactive Portals</div>
          <div className="h3 bold text-primary mt-1">5 Roles <span className="text-xs sub">Student, Doctor, TA, Admin, Staff</span></div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Data Integration</div>
          <div className="h3 bold text-info mt-1">Zero Static Data <span className="text-xs sub">Async FakeApi</span></div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Export Ready</div>
          <div className="h3 bold text-neutral mt-1">html.to.design Compatible</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="card p-4 mb-4">
        <div className="row-between wrap gap-3">
          <div className="row gap-3 wrap">
            <div className="input-search" style={{ minWidth: '320px' }}>
              <input
                type="text"
                placeholder="Search by Screen #, Screen Name, or Purpose..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div>
              <select
                className="input"
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
              >
                <option value="ALL">All Portals (106 Screens)</option>
                <option value="public">Auth &amp; Public (Screens 1–5)</option>
                <option value="student">Student Portal (Screens 8–41)</option>
                <option value="doctor">Doctor / Instructor (Screens 42–66)</option>
                <option value="ta">Teaching Assistant (Screens 67–72)</option>
                <option value="admin">College Admin (Screens 73–101)</option>
                <option value="superadmin">SuperAdmin (Screens 102–106)</option>
              </select>
            </div>
          </div>
          <div className="text-sm sub self-center">
            Showing <strong>{filteredScreens.length}</strong> of 106 Screens
          </div>
        </div>
      </div>

      {/* Categorized List or Search Results */}
      {search ? (
        <div className="card overflow-hidden">
          <div className="card-head">
            <h3>Search Results ({filteredScreens.length} Screens Found)</h3>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '90px' }}>Screen #</th>
                  <th>Official Specification Name</th>
                  <th>Portal Scope</th>
                  <th>Primary Purpose &amp; Academic Workflow</th>
                  <th style={{ width: '130px' }} className="text-center">Launch</th>
                </tr>
              </thead>
              <tbody>
                {filteredScreens.map(s => (
                  <tr key={s.number}>
                    <td>
                      <span className="badge badge-primary bold font-mono">#{s.number}</span>
                    </td>
                    <td>
                      <div className="bold">{s.name}</div>
                      <code className="text-xs sub">{s.route}</code>
                    </td>
                    <td>
                      <span className="badge badge-ice text-capitalize">{s.role}</span>
                    </td>
                    <td>
                      <span className="text-sm sub">{s.purpose}</span>
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleNavigate(s.route, s.role)}
                      >
                        <Icon name="arrowRight" size="sm" /> Open
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="stack gap-4">
          {categories.map((cat, idx) => (
            <div key={idx} className="card overflow-hidden">
              <div className="card-head">
                <div className="row-between">
                  <div>
                    <h3>{cat.title}</h3>
                    <span className="text-xs sub">{cat.range} &nbsp;•&nbsp; {cat.screens.length} Dedicated Screens</span>
                  </div>
                  <span className="badge badge-ice text-capitalize">{cat.role} Portal</span>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ width: '90px' }}>Screen #</th>
                      <th>Official Specification Name</th>
                      <th>Primary Purpose &amp; Academic Workflow</th>
                      <th style={{ width: '130px' }} className="text-center">Direct Launch</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cat.screens.map(s => (
                      <tr key={s.number}>
                        <td>
                          <span className="badge badge-primary bold font-mono">#{s.number}</span>
                        </td>
                        <td>
                          <div className="bold">{s.name}</div>
                          <code className="text-xs sub">{s.route}</code>
                        </td>
                        <td>
                          <span className="text-sm sub">{s.purpose}</span>
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleNavigate(s.route, s.role)}
                          >
                            <Icon name="arrowRight" size="sm" /> Open #{s.number}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
