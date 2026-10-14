import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Icon } from '../icons/Icon';
import type { Role } from '../../types';

interface BottomNavItem {
  label: string;
  path: string;
  icon: string;
}

export const BottomNav: React.FC<{ activePath: string }> = ({ activePath }) => {
  const { role, toggleMobileMenu, isMobileMenuOpen } = useAuth();

  const configs: Record<Role, BottomNavItem[]> = {
    student: [
      { label: 'Home', path: 'dashboard', icon: 'home' },
      { label: 'Courses', path: 'courses', icon: 'book' },
      { label: 'Scan QR', path: 'qr-attendance', icon: 'qr' },
      { label: 'Tasks', path: 'assignments', icon: 'clipboard' }
    ],
    doctor: [
      { label: 'Home', path: 'dashboard', icon: 'home' },
      { label: 'Offerings', path: 'offerings', icon: 'layers' },
      { label: 'Attend', path: 'attendance', icon: 'qr' },
      { label: 'Grades', path: 'gradebook', icon: 'table' }
    ],
    ta: [
      { label: 'Home', path: 'dashboard', icon: 'home' },
      { label: 'Sections', path: 'sections', icon: 'layers' },
      { label: 'Attend', path: 'attendance', icon: 'qr' },
      { label: 'Grades', path: 'grades', icon: 'table' }
    ],
    admin: [
      { label: 'Home', path: 'dashboard', icon: 'home' },
      { label: 'Students', path: 'students', icon: 'graduation' },
      { label: 'Requests', path: 'requests', icon: 'inbox' },
      { label: 'Grades', path: 'grades', icon: 'award' }
    ],
    employee: [
      { label: 'Home', path: 'dashboard', icon: 'home' },
      { label: 'Queue', path: 'requests', icon: 'inbox' },
      { label: 'Lookup', path: 'students', icon: 'search' },
      { label: 'Alerts', path: 'notifications', icon: 'bell' }
    ]
  };

  const items = configs[role] || configs.student;
  const clean = (activePath || '').replace(/^#\/?/, '').toLowerCase().trim();
  const segments = clean.split('/').filter(Boolean);
  const currentSub = segments[0] === role ? (segments[1] || 'dashboard') : (segments[0] || 'dashboard');

  return (
    <nav className="bottom-nav" aria-label="Mobile navigation bar">
      {items.map(item => {
        const fullHash = `#/${role}/${item.path}`;
        const isActive = currentSub === item.path || clean === `${role}/${item.path}` || clean === item.path;
        return (
          <a
            key={item.path}
            href={fullHash}
            className={`bottom-nav-btn ${isActive && !isMobileMenuOpen ? 'active' : ''}`}
          >
            <Icon name={item.icon} size="md" />
            <span>{item.label}</span>
          </a>
        );
      })}

      {/* 5th Tab: Menu & Sign Out Drawer Trigger */}
      <button
        type="button"
        className={`bottom-nav-btn ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={toggleMobileMenu}
        aria-label="Open full mobile menu and sign out"
      >
        <Icon name="menu" size="md" />
        <span>Menu</span>
      </button>
    </nav>
  );
};
