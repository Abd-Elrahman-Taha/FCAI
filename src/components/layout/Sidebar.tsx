import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Icon, FCAILogo } from '../icons/Icon';
import type { Role } from '../../types';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  count?: number;
}

interface NavSection {
  section: string;
  items: NavItem[];
}

export const Sidebar: React.FC<{ activePath: string }> = ({ activePath }) => {
  const { role, isSidebarCollapsed } = useAuth();

  const navConfig: Record<Role, NavSection[]> = {
    student: [
      {
        section: 'Overview',
        items: [
          { label: 'Dashboard', path: 'dashboard', icon: 'dashboard' },
          { label: 'My Profile', path: 'profile', icon: 'user' },
          { label: 'Academic Information', path: 'academic', icon: 'graduation' }
        ]
      },
      {
        section: 'Learning',
        items: [
          { label: 'My Courses', path: 'courses', icon: 'book' },
          { label: 'Course Registration', path: 'registration', icon: 'plusSquare' },
          { label: 'Timetable', path: 'timetable', icon: 'calendar' },
          { label: 'Exam Schedule', path: 'exam-schedule', icon: 'calendarCheck' },
          { label: 'Attendance', path: 'attendance', icon: 'userCheck' },
          { label: 'Assignments', path: 'assignments', icon: 'clipboard', count: 3 },
          { label: 'Exams', path: 'exams', icon: 'fileText' },
          { label: 'Grades & GPA', path: 'grades', icon: 'award' }
        ]
      },
      {
        section: 'Services',
        items: [
          { label: 'Fees & Payments', path: 'fees', icon: 'wallet', count: 1 },
          { label: 'Service Requests', path: 'requests', icon: 'inbox' },
          { label: 'Study Assistant', path: 'study-assistant', icon: 'sparkles' },
          { label: 'Notifications', path: 'notifications', icon: 'bell', count: 5 }
        ]
      }
    ],
    doctor: [
      {
        section: 'Overview',
        items: [
          { label: 'Dashboard', path: 'dashboard', icon: 'dashboard' },
          { label: 'My CourseOfferings', path: 'offerings', icon: 'layers' },
          { label: 'Students', path: 'students', icon: 'users' }
        ]
      },
      {
        section: 'Teaching',
        items: [
          { label: 'Attendance', path: 'attendance', icon: 'qr' },
          { label: 'Assignments', path: 'assignments', icon: 'clipboard' },
          { label: 'Submissions', path: 'submissions', icon: 'inbox', count: 23 },
          { label: 'Gradebook', path: 'gradebook', icon: 'table' },
          { label: 'Question Banks', path: 'question-banks', icon: 'database' },
          { label: 'Exams', path: 'exams', icon: 'fileText' },
          { label: 'Reports', path: 'reports', icon: 'barChart' }
        ]
      },
      {
        section: 'Account',
        items: [
          { label: 'Notifications', path: 'notifications', icon: 'bell', count: 4 },
          { label: 'Profile', path: 'profile', icon: 'user' }
        ]
      }
    ],
    ta: [
      {
        section: 'Overview',
        items: [
          { label: 'Dashboard', path: 'dashboard', icon: 'dashboard' },
          { label: 'Assigned Sections', path: 'sections', icon: 'layers' }
        ]
      },
      {
        section: 'Teaching',
        items: [
          { label: 'Attendance', path: 'attendance', icon: 'qr' },
          { label: 'Assignments', path: 'assignments', icon: 'clipboard' },
          { label: 'Submissions', path: 'submissions', icon: 'inbox', count: 14 },
          { label: 'Grades', path: 'grades', icon: 'table' }
        ]
      },
      {
        section: 'Account',
        items: [
          { label: 'Notifications', path: 'notifications', icon: 'bell', count: 2 },
          { label: 'Profile', path: 'profile', icon: 'user' }
        ]
      }
    ],
    admin: [
      {
        section: 'Overview',
        items: [
          { label: 'Dashboard', path: 'dashboard', icon: 'dashboard' },
          { label: 'Reports', path: 'reports', icon: 'barChart' }
        ]
      },
      {
        section: 'People',
        items: [
          { label: 'Students', path: 'students', icon: 'graduation' },
          { label: 'Doctors', path: 'doctors', icon: 'briefcase' },
          { label: 'Teaching Assistants', path: 'tas', icon: 'users' },
          { label: 'Employees', path: 'employees', icon: 'idCard' },
          { label: 'Departments', path: 'departments', icon: 'building' },
          { label: 'Permissions', path: 'permissions', icon: 'shield' }
        ]
      },
      {
        section: 'Academic Structure',
        items: [
          { label: 'Academic Years', path: 'academic-years', icon: 'calendar' },
          { label: 'Semesters', path: 'semesters', icon: 'calendarCheck' },
          { label: 'Academic Levels', path: 'levels', icon: 'layers' },
          { label: 'Student Credit Load', path: 'credit-load', icon: 'sliders' },
          { label: 'Courses', path: 'courses', icon: 'book' },
          { label: 'CourseOfferings', path: 'offerings', icon: 'bookOpen' },
          { label: 'Sections', path: 'sections', icon: 'grid' },
          { label: 'Rooms', path: 'rooms', icon: 'door' },
          { label: 'Timetable', path: 'timetable', icon: 'clock' }
        ]
      },
      {
        section: 'Operations',
        items: [
          { label: 'Registration', path: 'registration', icon: 'plusSquare' },
          { label: 'Attendance', path: 'attendance', icon: 'userCheck' },
          { label: 'Grades', path: 'grades', icon: 'award', count: 6 },
          { label: 'Grade Scale', path: 'grade-scale', icon: 'scale' },
          { label: 'Service Requests', path: 'requests', icon: 'inbox', count: 34 },
          { label: 'College Regulations', path: 'regulations', icon: 'gavel' }
        ]
      },
      {
        section: 'Finance',
        items: [
          { label: 'Fee Types', path: 'fee-types', icon: 'tag' },
          { label: 'Fee Definitions', path: 'fee-definitions', icon: 'fileText' },
          { label: 'Student Fees', path: 'student-fees', icon: 'wallet' },
          { label: 'Discounts', path: 'discounts', icon: 'percent' },
          { label: 'Payments', path: 'payments', icon: 'creditCard' },
          { label: 'Receipts', path: 'receipts', icon: 'receipt' }
        ]
      },
      {
        section: 'System',
        items: [
          { label: 'Notifications', path: 'notifications', icon: 'bell', count: 8 },
          { label: 'Settings', path: 'settings', icon: 'settings' }
        ]
      }
    ],
    employee: [
      {
        section: 'Student Affairs · Authorized',
        items: [
          { label: 'Dashboard', path: 'dashboard', icon: 'dashboard' },
          { label: 'Service Requests', path: 'requests', icon: 'inbox', count: 12 },
          { label: 'Student Lookup', path: 'students', icon: 'search' }
        ]
      },
      {
        section: 'Account',
        items: [
          { label: 'My Permissions', path: 'permissions', icon: 'shield' },
          { label: 'Notifications', path: 'notifications', icon: 'bell', count: 3 },
          { label: 'Profile', path: 'profile', icon: 'user' }
        ]
      }
    ]
  };

  const sections = navConfig[role] || navConfig.student;
  const roleLabelMap: Record<Role, string> = {
    student: 'Student Portal',
    doctor: 'Doctor Portal',
    ta: 'TA Portal',
    admin: 'College Admin',
    employee: 'Employee Portal'
  };

  const checkIsActive = (itemPath: string): boolean => {
    const clean = (activePath || '').replace(/^#\/?/, '').toLowerCase().trim();
    const segments = clean.split('/').filter(Boolean);
    const target = itemPath.toLowerCase();

    // 1. Exact match e.g. "student/courses" === "student/courses"
    if (clean === `${role}/${target}` || clean === target) return true;

    // 2. Direct prefix e.g. "student/assignments/a3" -> "assignments"
    if (clean.startsWith(`${role}/${target}/`) || clean.startsWith(`${target}/`)) return true;

    // 3. Fallback extraction: role subsegment
    const currentSub = segments[0] === role 
      ? (segments[1] || 'dashboard') 
      : (segments[0] || 'dashboard');

    if (currentSub === target) return true;

    // 4. Common semantic sub-routes
    if (target === 'dashboard' && (clean === role || clean === `${role}/dashboard` || clean === '')) return true;
    if (target === 'academic' && (clean.includes('academic') || clean.includes('gpa'))) return true;
    if (target === 'courses' && (clean.includes('course') || clean.includes('learning-materials'))) return true;
    if (target === 'registration' && clean.includes('registration')) return true;
    if (target === 'attendance' && (clean.includes('attendance') || clean.includes('qr'))) return true;
    if (target === 'assignments' && clean.includes('assignment')) return true;
    if (target === 'exams' && (clean.includes('exam') && !clean.includes('exam-schedule'))) return true;
    if (target === 'exam-schedule' && clean.includes('exam-schedule')) return true;
    if (target === 'grades' && (clean.includes('grade') || clean.includes('gpa'))) return true;
    if (target === 'fees' && (clean.includes('fee') || clean.includes('payment') || clean.includes('receipt') || clean.includes('checkout'))) return true;
    if (target === 'requests' && (clean.includes('request') || clean.includes('service'))) return true;
    if (target === 'study-assistant' && clean.includes('study-assistant')) return true;
    if (target === 'notifications' && clean.includes('notification')) return true;

    // Doctor / TA aliases
    if (target === 'offerings' && clean.includes('offering')) return true;
    if (target === 'gradebook' && clean.includes('grade')) return true;
    if (target === 'question-banks' && clean.includes('question')) return true;
    if (target === 'submissions' && clean.includes('submission')) return true;
    if (target === 'students' && (clean.includes('student') && !clean.includes('create-student'))) return true;
    if (target === 'sections' && clean.includes('section')) return true;

    // 5. Screen number mapping
    const screenMatch = clean.match(/^screen\/(\d+)$/);
    if (screenMatch) {
      const num = parseInt(screenMatch[1], 10);
      if (role === 'student') {
        if (num === 8 && target === 'dashboard') return true;
        if (num === 9 && target === 'profile') return true;
        if (num === 10 && target === 'academic') return true;
        if (num === 11 && target === 'courses') return true;
        if ((num === 12 || num === 13 || num === 14) && target === 'registration') return true;
        if (num === 15 && target === 'timetable') return true;
        if (num === 16 && target === 'exam-schedule') return true;
        if ((num === 17 || num === 18) && target === 'assignments') return true;
        if (num === 19 && target === 'courses') return true;
        if ((num >= 20 && num <= 22) && target === 'exams') return true;
        if ((num === 23 || num === 24) && target === 'attendance') return true;
        if ((num >= 25 && num <= 27) && target === 'grades') return true;
        if ((num >= 28 && num <= 30) && target === 'requests') return true;
        if ((num >= 31 && num <= 36) && target === 'fees') return true;
        if (num === 39 && target === 'notifications') return true;
        if ((num === 40 || num === 41) && target === 'study-assistant') return true;
      }
      if (role === 'doctor') {
        if (num === 42 && target === 'dashboard') return true;
        if (num === 43 && target === 'offerings') return true;
        if (num === 44 && target === 'students') return true;
        if ((num === 45 || num === 46) && target === 'offerings') return true;
        if ((num >= 47 && num <= 49) && target === 'assignments') return true;
        if ((num === 50 || num === 51) && target === 'question-banks') return true;
        if ((num >= 52 && num <= 55) && target === 'exams') return true;
        if ((num >= 56 && num <= 61) && target === 'attendance') return true;
        if ((num === 62 || num === 63) && target === 'gradebook') return true;
        if (num === 64 && target === 'reports') return true;
      }
    }

    return false;
  };

  return (
    <aside className="sidebar" aria-label="Main navigation">
      <a className="sb-brand" href={`#/${role}/dashboard`}>
        <FCAILogo size={40} />
        {!isSidebarCollapsed && (
          <div className="sb-brand-text">
            <b>FCAI BSU</b>
            <span>Computers &amp; AI · Beni Suef</span>
          </div>
        )}
      </a>

      {!isSidebarCollapsed && (
        <div className="sb-role">
          <span className="dot"></span>
          <div>
            <b>{roleLabelMap[role]}</b>
            <div style={{ color: '#8fb0d6', fontSize: '11.5px' }}>Fall 2026 · Active</div>
          </div>
        </div>
      )}

      <nav className="sb-nav">
        {sections.map(section => (
          <div key={section.section}>
            {!isSidebarCollapsed && <div className="sb-section">{section.section}</div>}
            {section.items.map(item => {
              const fullPath = `#/${role}/${item.path}`;
              const isActive = checkIsActive(item.path);
              return (
                <a
                  key={item.path}
                  href={fullPath}
                  className={`sb-link ${isActive ? 'active' : ''}`}
                  title={item.label}
                >
                  <Icon name={item.icon} />
                  {!isSidebarCollapsed && <span>{item.label}</span>}
                  {!isSidebarCollapsed && item.count !== undefined && (
                    <span className="count">{item.count}</span>
                  )}
                </a>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sb-foot">
        <a className="sb-help" href="#/screens" title="All Screens & Roles Switcher">
          <Icon name="grid" />
          {!isSidebarCollapsed && <span>All screens &amp; roles</span>}
        </a>
      </div>
    </aside>
  );
};
