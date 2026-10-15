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
    isAuthenticated,
    role,
    switchRole,
    logout,
    unreadNotificationsCount,
    theme,
    toggleTheme,
    showToast
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
    if (!isAuthenticated) {
      closeMobileMenu();
      showToast('Sign In Required', 'Please sign in to access your institutional portal.', 'info');
      sessionStorage.setItem('fcai_redirect_after_login', `#/${newRole}/dashboard`);
      window.location.hash = '#/login';
      return;
    }
    await switchRole(newRole);
    window.location.hash = `#/${newRole}/dashboard`;
    closeMobileMenu();
  };

  const handleItemClick = (path: string) => {
    if (!isAuthenticated) {
      closeMobileMenu();
      showToast('Sign In Required', 'Please sign in to access your institutional portal.', 'info');
      sessionStorage.setItem('fcai_redirect_after_login', `#/${role}/${path}`);
      window.location.hash = '#/login';
      return;
    }
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
          <a href="#/home" onClick={closeMobileMenu} className="row gap-3 cursor-pointer" style={{ textDecoration: 'none' }} title="Go to FCAI BSU Home">
            <FCAILogo size={38} />
            <div>
              <b style={{ color: '#fff', fontSize: '15px', display: 'block', lineHeight: 1.2 }}>FCAI BSU</b>
              <span style={{ color: '#8fb0d6', fontSize: '11px' }}>Faculty of Computers &amp; AI</span>
            </div>
          </a>
          <button
            type="button"
            className="mobile-close-btn"
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            <Icon name="x" size="lg" />
          </button>
        </div>

        {/* User Profile Card or Guest Visitor Banner */}
        {isAuthenticated ? (
          <div className="mobile-user-card">
            {/* User Profile Information Row */}
            <div className="row align-center gap-3" style={{ minWidth: 0 }}>
              <div
                className="avatar shrink-0 font-bold"
                style={{
                  width: '42px',
                  height: '42px',
                  fontSize: '14px',
                  borderRadius: '12px',
                  background: '#38bdf8',
                  color: '#020b17',
                  border: '1.5px solid rgba(255, 255, 255, 0.4)',
                  boxShadow: '0 0 12px rgba(56, 189, 248, 0.35)'
                }}
              >
                {currentUser?.short || 'AH'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <strong
                  style={{ color: '#ffffff', fontSize: '14px', fontWeight: 700, display: 'block', lineHeight: 1.25 }}
                  className="truncate"
                >
                  {currentUser?.name || 'Ahmed Hassan'}
                </strong>
                <div className="row align-center gap-2 mt-1" style={{ flexWrap: 'wrap' }}>
                  <span
                    className="badge b-info no-dot"
                    style={{
                      fontSize: '10px',
                      padding: '2px 7px',
                      borderRadius: '6px',
                      fontWeight: 700,
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {currentUser?.roleLabel}
                  </span>
                  {(currentUser?.department || currentUser?.studentCode) && (
                    <span
                      style={{
                        color: '#93c5fd',
                        fontSize: '11px',
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '150px'
                      }}
                      title={currentUser?.department || currentUser?.studentCode}
                    >
                      {currentUser?.department || currentUser?.studentCode}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Dedicated Action Row - Eliminates any text collision or overlap */}
            <div
              className="row-between align-center mt-3 pt-2.5"
              style={{ borderTop: '1px solid rgba(56, 189, 248, 0.16)' }}
            >
              <div className="row align-center gap-1.5">
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: '#38bdf8',
                    boxShadow: '0 0 8px #38bdf8'
                  }}
                />
                <span style={{ fontSize: '11px', color: '#7dd3fc', fontWeight: 600 }}>
                  Active Session
                </span>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                title="Sign Out of Session"
                className="cursor-pointer"
                style={{
                  background: 'rgba(239, 68, 68, 0.18)',
                  color: '#fca5a5',
                  border: '1px solid rgba(239, 68, 68, 0.45)',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  height: '28px',
                  padding: '0 10px',
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon name="logout" size="sm" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="mobile-user-card" style={{ background: '#071933', border: '1px solid rgba(56, 189, 248, 0.35)' }}>
            <div className="row-between align-center gap-3">
              <div>
                <b style={{ color: '#fff', fontSize: '13.5px', display: 'block' }}>Guest Visitor</b>
                <span style={{ color: '#C1E8FF', fontSize: '11px' }}>Sign in to access your portal</span>
              </div>
              <a
                href="#/login"
                onClick={closeMobileMenu}
                className="cta-primary inline-flex items-center justify-center font-black text-xs rounded-xl px-4 py-2 cursor-pointer"
              >
                Sign In
              </a>
            </div>
          </div>
        )}

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

          {/* Public Pages & Quick Hub Links */}
          <div className="mobile-nav-group">
            <div className="mobile-group-title">CAMPUS SHOWCASE PAGES</div>
            <div className="col gap-1">
              <button
                type="button"
                className={`mobile-nav-item ${clean === 'home' || clean === '' ? 'active' : ''}`}
                onClick={() => { window.location.hash = '#/home'; closeMobileMenu(); }}
              >
                <Icon name="home" size="md" />
                <span style={{ flex: 1, textAlign: 'left' }}>Home Landing Page</span>
                <Icon name="chevronRight" size="sm" className="mobile-chevron" />
              </button>
              <button
                type="button"
                className={`mobile-nav-item ${clean === 'departments' ? 'active' : ''}`}
                onClick={() => { window.location.hash = '#/departments'; closeMobileMenu(); }}
              >
                <Icon name="layers" size="md" />
                <span style={{ flex: 1, textAlign: 'left' }}>Academic Departments</span>
                <Icon name="chevronRight" size="sm" className="mobile-chevron" />
              </button>
              <button
                type="button"
                className={`mobile-nav-item ${clean === 'features' ? 'active' : ''}`}
                onClick={() => { window.location.hash = '#/features'; closeMobileMenu(); }}
              >
                <Icon name="sparkles" size="md" />
                <span style={{ flex: 1, textAlign: 'left' }}>Smart Features</span>
                <Icon name="chevronRight" size="sm" className="mobile-chevron" />
              </button>
              <button
                type="button"
                className={`mobile-nav-item ${clean === 'assistant' ? 'active' : ''}`}
                onClick={() => { window.location.hash = '#/assistant'; closeMobileMenu(); }}
              >
                <Icon name="sparkles" size="md" />
                <span style={{ flex: 1, textAlign: 'left' }}>AI Study Assistant</span>
                <Icon name="chevronRight" size="sm" className="mobile-chevron" />
              </button>
              <button
                type="button"
                className={`mobile-nav-item ${clean === 'metrics' ? 'active' : ''}`}
                onClick={() => { window.location.hash = '#/metrics'; closeMobileMenu(); }}
              >
                <Icon name="barChart" size="md" />
                <span style={{ flex: 1, textAlign: 'left' }}>Platform Numbers</span>
                <Icon name="chevronRight" size="sm" className="mobile-chevron" />
              </button>
              <button
                type="button"
                className={`mobile-nav-item ${clean === 'faq' ? 'active' : ''}`}
                onClick={() => { window.location.hash = '#/faq'; closeMobileMenu(); }}
              >
                <Icon name="helpCircle" size="md" />
                <span style={{ flex: 1, textAlign: 'left' }}>Help &amp; FAQ</span>
                <Icon name="chevronRight" size="sm" className="mobile-chevron" />
              </button>
              <button
                type="button"
                className={`mobile-nav-item ${clean === 'screens' ? 'active' : ''}`}
                onClick={() => { window.location.hash = '#/screens'; closeMobileMenu(); }}
              >
                <Icon name="grid" size="md" />
                <span style={{ flex: 1, textAlign: 'left' }}>All 106 Screens Directory</span>
                <Icon name="chevronRight" size="sm" className="mobile-chevron" />
              </button>
            </div>
          </div>


        </div>

        {/* Drawer Footer with Prominent Button */}
        <div className="mobile-drawer-foot">
          {isAuthenticated ? (
            <button
              type="button"
              className="mobile-signout-btn"
              onClick={handleSignOut}
            >
              <Icon name="logout" size="lg" />
              <span>Sign Out of FCAI Platform</span>
            </button>
          ) : (
            <a
              href="#/login"
              onClick={closeMobileMenu}
              className="btn btn-block"
              style={{
                background: '#38bdf8',
                color: '#020b17',
                fontWeight: 800,
                fontSize: '13.5px',
                borderRadius: '12px',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                textDecoration: 'none'
              }}
            >
              <Icon name="user" size="md" />
              <span>Sign In / Login to Portal</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
