import React, { useEffect } from 'react';
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

export const MobileDrawer: React.FC<{ activePath: string }> = ({ activePath }) => {
  const {
    isMobileMenuOpen,
    closeMobileMenu,
    currentUser,
    role,
    switchRole,
    logout,
    unreadNotificationsCount,
    theme,
    toggleTheme
  } = useAuth();


  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobileMenu();
    };
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen, closeMobileMenu]);

  if (!isMobileMenuOpen) return null;

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
        section: 'Learning & Exams',
        items: [
          { label: 'My Courses', path: 'courses', icon: 'book' },
          { label: 'Course Registration', path: 'registration', icon: 'plusSquare' },
          { label: 'Timetable', path: 'timetable', icon: 'calendar' },
          { label: 'Exam Schedule', path: 'exam-schedule', icon: 'calendarCheck' },
          { label: 'Attendance & QR', path: 'attendance', icon: 'userCheck' },
          { label: 'Assignments', path: 'assignments', icon: 'clipboard', count: 3 },
          { label: 'Exams & Quizzes', path: 'exams', icon: 'fileText' },
          { label: 'Grades & GPA', path: 'grades', icon: 'award' }
        ]
      },
      {
        section: 'Services & Support',
        items: [
          { label: 'Fees & Fawry Pay', path: 'fees', icon: 'wallet', count: 1 },
          { label: 'Service Petitions', path: 'requests', icon: 'inbox' },
          { label: 'AI Study Assistant', path: 'study-assistant', icon: 'sparkles' },
          { label: 'Notifications', path: 'notifications', icon: 'bell', count: unreadNotificationsCount }
        ]
      }
    ],
    doctor: [
      {
        section: 'Overview',
        items: [
          { label: 'Dashboard', path: 'dashboard', icon: 'dashboard' },
          { label: 'My CourseOfferings', path: 'offerings', icon: 'layers' },
          { label: 'Enrolled Students', path: 'students', icon: 'users' }
        ]
      },
      {
        section: 'Academic Operations',
        items: [
          { label: 'Live QR Attendance', path: 'attendance', icon: 'qr' },
          { label: 'Coursework Submissions', path: 'submissions', icon: 'inbox', count: 23 },
          { label: 'Gradebook & Scoring', path: 'gradebook', icon: 'table' },
          { label: 'Question Banks', path: 'question-banks', icon: 'database' },
          { label: 'Exam Builder', path: 'exams', icon: 'fileText' },
          { label: 'Course Reports', path: 'reports', icon: 'barChart' }
        ]
      },
      {
        section: 'Account',
        items: [
          { label: 'Notifications', path: 'notifications', icon: 'bell', count: unreadNotificationsCount },
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
        section: 'Section Lab Operations',
        items: [
          { label: 'Lab Attendance', path: 'attendance', icon: 'qr' },
          { label: 'Submissions', path: 'submissions', icon: 'inbox', count: 14 },
          { label: 'Practical Grades', path: 'grades', icon: 'table' }
        ]
      },
      {
        section: 'Account',
        items: [
          { label: 'Notifications', path: 'notifications', icon: 'bell', count: unreadNotificationsCount },
          { label: 'Profile', path: 'profile', icon: 'user' }
        ]
      }
    ],
    admin: [
      {
        section: 'Overview',
        items: [
          { label: 'Dashboard', path: 'dashboard', icon: 'dashboard' },
          { label: 'Students Directory', path: 'students', icon: 'graduation' },
          { label: 'Faculty Staff', path: 'faculty', icon: 'briefcase' }
        ]
      },
      {
        section: 'College Control',
        items: [
          { label: 'Departments', path: 'departments', icon: 'building' },
          { label: 'Course Offerings', path: 'offerings', icon: 'layers' },
          { label: 'Grade Approvals', path: 'grades', icon: 'award' },
          { label: 'Rooms & Labs', path: 'rooms', icon: 'mapPin' },
          { label: 'Service Petitions', path: 'requests', icon: 'inbox' }
        ]
      },
      {
        section: 'Finance & System',
        items: [
          { label: 'Fee Generation', path: 'fees', icon: 'wallet' },
          { label: 'Notifications', path: 'notifications', icon: 'bell', count: unreadNotificationsCount }
        ]
      }
    ],
    employee: [
      {
        section: 'Student Affairs',
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
          { label: 'Notifications', path: 'notifications', icon: 'bell', count: unreadNotificationsCount },
          { label: 'Profile', path: 'profile', icon: 'user' }
        ]
      }
    ]
  };

  const sections = navConfig[role] || navConfig.student;

  const rolesList: { id: Role; label: string; icon: string }[] = [
    { id: 'student', label: 'Student', icon: 'graduation' },
    { id: 'doctor', label: 'Doctor', icon: 'briefcase' },
    { id: 'ta', label: 'TA', icon: 'users' },
    { id: 'admin', label: 'Admin', icon: 'shield' },
    { id: 'employee', label: 'Employee', icon: 'idCard' }
  ];

  const handleRoleSelect = async (newRole: Role) => {
    await switchRole(newRole);
    window.location.hash = `#/${newRole}/dashboard`;
    closeMobileMenu();
  };

  const handleItemClick = (path: string) => {
    window.location.hash = `#/${role}/${path}`;
    closeMobileMenu();
  };

  const handleSignOut = () => {
    closeMobileMenu();
    logout();
  };

  const clean = (activePath || '').replace(/^#\/?/, '').toLowerCase().trim();
  const currentSub = clean.split('/')[1] || clean.split('/')[0] || 'dashboard';

  return (
    <div className="mobile-drawer-overlay" onClick={closeMobileMenu} role="dialog" aria-modal="true" aria-label="Mobile Navigation">
      <div className="mobile-drawer-content" onClick={e => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="mobile-drawer-head">
          <div className="row gap-3">
            <FCAILogo size={38} />
            <div>
              <b style={{ color: '#fff', fontSize: '15px', display: 'block', lineHeight: 1.2 }}>FCAI BSU</b>
              <span style={{ color: '#8fb0d6', fontSize: '11px' }}>Faculty of Computers &amp; AI</span>
            </div>
          </div>
          <button
            type="button"
            className="mobile-close-btn"
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            <Icon name="x" size="lg" />
          </button>
        </div>

        {/* User Profile Card */}
        <div className="mobile-user-card">
          <div className="row gap-3">
            <div className="avatar sm" style={{ width: '42px', height: '42px', fontSize: '14px' }}>
              {currentUser?.short || 'AH'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <strong style={{ color: '#fff', fontSize: '14px', display: 'block' }} className="truncate">
                {currentUser?.name || 'Ahmed Hassan'}
              </strong>
              <div className="row gap-2 mt-1">
                <span className="badge b-info no-dot" style={{ fontSize: '10.5px', padding: '1px 8px', height: '18px' }}>
                  {currentUser?.roleLabel}
                </span>
                <span style={{ color: '#C1E8FF', fontSize: '11px' }}>
                  {currentUser?.studentCode || currentUser?.department}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Role Switcher */}
        <div className="mobile-role-selector">
          <div className="mobile-role-label">SWITCH ACTIVE PORTAL</div>
          <div className="mobile-role-chips">
            {rolesList.map(r => (
              <button
                key={r.id}
                type="button"
                className={`mobile-role-chip ${role === r.id ? 'active' : ''}`}
                onClick={() => handleRoleSelect(r.id)}
              >
                <Icon name={r.icon} size="sm" />
                <span>{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dark / Light Mode Switcher */}
        <div className="mobile-theme-row">
          <div className="flex items-center gap-2">
            <Icon name={theme === 'dark' ? 'moon' : 'sun'} size="sm" />
            <span style={{ fontSize: '13px', fontWeight: 600 }}>
              {theme === 'dark' ? 'Dark Theme (Active)' : 'Light Theme (Active)'}
            </span>
          </div>
          <button
            type="button"
            className={`switch ${theme === 'dark' ? 'on' : ''}`}
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
          />
        </div>

        {/* Main Navigation Sections */}

        <div className="mobile-nav-scroll">
          {sections.map(section => (
            <div key={section.section} className="mobile-nav-group">
              <div className="mobile-group-title">{section.section}</div>
              <div className="col gap-1">
                {section.items.map(item => {
                  const isActive = currentSub === item.path || clean === `${role}/${item.path}`;
                  return (
                    <button
                      key={item.path}
                      type="button"
                      className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                      onClick={() => handleItemClick(item.path)}
                    >
                      <Icon name={item.icon} size="md" />
                      <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                      {item.count !== undefined && item.count > 0 && (
                        <span className="count">{item.count}</span>
                      )}
                      <Icon name="chevronRight" size="sm" className="mobile-chevron" />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quick Hub Links */}
          <div className="mobile-nav-group">
            <div className="mobile-group-title">DIRECT DIRECTORIES</div>
            <div className="col gap-1">
              <button
                type="button"
                className="mobile-nav-item"
                onClick={() => { window.location.hash = '#/screens'; closeMobileMenu(); }}
              >
                <Icon name="grid" size="md" />
                <span style={{ flex: 1, textAlign: 'left' }}>All 106 Screens Directory</span>
                <Icon name="chevronRight" size="sm" className="mobile-chevron" />
              </button>
            </div>
          </div>
        </div>

        {/* Drawer Footer with Prominent, Easy-to-Reach Red Sign Out Button */}
        <div className="mobile-drawer-foot">
          <button
            type="button"
            className="mobile-signout-btn"
            onClick={handleSignOut}
          >
            <Icon name="logout" size="lg" />
            <span>Sign Out of FCAI Platform</span>
          </button>
        </div>
      </div>
    </div>
  );
};
