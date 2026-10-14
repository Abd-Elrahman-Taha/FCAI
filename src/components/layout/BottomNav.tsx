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
  const { role, toggleMobileMenu, isMobileMenuOpen, closeMobileMenu } = useAuth();

  const configs: Record<Role, BottomNavItem[]> = {
    student: [
      { label: 'Home', path: 'home', icon: 'home' },
      { label: 'Portal', path: 'dashboard', icon: 'dashboard' },
      { label: 'Courses', path: 'courses', icon: 'book' },
      { label: 'Scan QR', path: 'qr-attendance', icon: 'qr' }
    ],
    doctor: [
      { label: 'Home', path: 'home', icon: 'home' },
      { label: 'Portal', path: 'dashboard', icon: 'dashboard' },
      { label: 'Offerings', path: 'offerings', icon: 'layers' },
      { label: 'Attend', path: 'attendance', icon: 'qr' }
    ],
    ta: [
      { label: 'Home', path: 'home', icon: 'home' },
      { label: 'Portal', path: 'dashboard', icon: 'dashboard' },
      { label: 'Sections', path: 'sections', icon: 'layers' },
      { label: 'Attend', path: 'attendance', icon: 'qr' }
    ],
    admin: [
      { label: 'Home', path: 'home', icon: 'home' },
      { label: 'Portal', path: 'dashboard', icon: 'dashboard' },
      { label: 'Students', path: 'students', icon: 'graduation' },
      { label: 'Requests', path: 'requests', icon: 'inbox' }
    ],
    employee: [
      { label: 'Home', path: 'home', icon: 'home' },
      { label: 'Portal', path: 'dashboard', icon: 'dashboard' },
      { label: 'Queue', path: 'requests', icon: 'inbox' },
      { label: 'Lookup', path: 'students', icon: 'search' }
    ]
  };

  const items = configs[role] || configs.student;
  const hash = window.location.hash || '';
  const clean = (activePath || hash || '').replace(/^#\/?/, '').toLowerCase().trim();
  const segments = clean.split('/').filter(Boolean);
  const currentSub = segments[0] === role ? (segments[1] || 'dashboard') : (segments[0] || (clean === '' || clean === 'home' ? 'home' : 'dashboard'));

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.scrollTo({ top: 0, behavior: 'smooth' });
    const contentEl = document.getElementById('content');
    if (contentEl) contentEl.scrollTo({ top: 0, behavior: 'smooth' });
    const mainEl = document.querySelector('.main');
    if (mainEl) mainEl.scrollTo({ top: 0, behavior: 'smooth' });
    const appEl = document.querySelector('.app');
    if (appEl) appEl.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, isActive: boolean) => {
    if (isMobileMenuOpen) {
      closeMobileMenu();
    }
    if (isActive) {
      e.preventDefault();
      scrollToTop();
    }
  };

  return (
    <nav className="bottom-nav" aria-label="Mobile navigation bar">
      {items.map(item => {
        const fullHash = item.path === 'home' ? '#/home' : `#/${role}/${item.path}`;
        const isActive = item.path === 'home'
          ? (clean === 'home' || clean === '' || clean === 'landing')
          : (currentSub === item.path || clean === `${role}/${item.path}` || clean === item.path);
        return (
          <a
            key={item.path}
            href={fullHash}
            onClick={e => handleNavClick(e, isActive)}
            className={`bottom-nav-btn ${isActive && !isMobileMenuOpen ? 'active' : ''}`}
          >
            <Icon name={item.icon} size="md" />
            <span>{item.label}</span>
          </a>
        );
      })}

      {/* 5th Tab: Menu Drawer Trigger */}
      <button
        type="button"
        className={`bottom-nav-btn ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={toggleMobileMenu}
        aria-label="Open full mobile menu"
      >
        <Icon name="menu" size="md" />
        <span>Menu</span>
      </button>
    </nav>
  );
};
