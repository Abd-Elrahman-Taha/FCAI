import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Icon, FCAILogo } from '../icons/Icon';
import type { Role } from '../../types';

export const Topbar: React.FC = () => {
  const {
    currentUser,
    isAuthenticated,
    role,
    switchRole,
    logout,
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    markAllNotificationsRead,
    toggleSidebar,
    isSidebarCollapsed,
    toggleMobileMenu,
    theme,
    toggleTheme
  } = useAuth();


  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleChange = async (newRole: Role) => {
    await switchRole(newRole);
    window.location.hash = `#/${newRole}/dashboard`;
    setIsUserMenuOpen(false);
  };

  const rolesList: { id: Role; label: string; icon: string }[] = [
    { id: 'student', label: 'Student', icon: 'graduation' },
    { id: 'doctor', label: 'Doctor / Instructor', icon: 'briefcase' },
    { id: 'ta', label: 'Teaching Assistant (TA)', icon: 'users' },
    { id: 'admin', label: 'College Admin', icon: 'shield' },
    { id: 'employee', label: 'Employee (Student Affairs)', icon: 'idCard' }
  ];

  return (
    <header className="topbar">
      {/* Desktop sidebar toggle - Big screens only */}
      <button
        type="button"
        className="hidden lg:inline-grid hover:border-cyan-400/50 transition-all text-decoration-none group cursor-pointer"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
        title="Toggle sidebar"
      >
        <Icon name="sidebar" />
      </button>

      {/* Desktop Brand Pill on Big Screens — ONLY appears when sidebar is collapsed (closed) */}
      {isSidebarCollapsed && (
        <a
          href="#/home"
          className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/70 border border-cyan-500/20 hover:border-cyan-400/50 transition-all text-decoration-none group cursor-pointer"
          title="Go to Home Landing Page"
        >
          <FCAILogo size={26} />
          <span className="font-extrabold text-[13.5px] text-white group-hover:text-cyan-300 transition-colors">
            FCAI BSU
          </span>
          <span className="px-1.5 py-0.5 rounded text-[8.5px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            2026/2027
          </span>
        </a>
      )}

      {/* Mobile & Tablet Brand Identity matching HomePage */}
      <a href="#/home" className="mobile-brand-pill lg:hidden cursor-pointer group" style={{ textDecoration: 'none' }} title="Go to FCAI BSU Home">
        <div className="relative flex-shrink-0">
          <FCAILogo size={32} />
          <div className="absolute -inset-1 rounded-full bg-cyan-400/25 blur-sm pointer-events-none" />
        </div>
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="mobile-brand-name font-extrabold text-[15px] tracking-tight text-white whitespace-nowrap">
            FCAI BSU
          </span>
          <span className="px-1.5 py-0.5 rounded text-[8.5px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 whitespace-nowrap">
            2026/2027
          </span>
        </div>
      </a>

      {/* Global Search */}
      <label className="search">
        <span><Icon name="search" size="sm" /></span>
        <input
          placeholder={
            role === 'admin'
              ? 'Search students, doctors, offerings, requests…'
              : 'Search courses, assignments, exams, files…'
          }
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          aria-label="Search platform"
        />
        <span className="kbd">Ctrl K</span>
      </label>

      {/* Topbar Right Actions */}
      <div className="topbar-right">
        {/* Quick Home Landing Link */}
        <a
          href="#/home"
          className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-800 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-300 bg-slate-100 dark:bg-slate-900/60 hover:bg-slate-200 dark:hover:bg-slate-800/80 border border-slate-300 dark:border-slate-700/60 transition-all mr-1"
          title="Return to Home Landing Page"
        >
          <Icon name="home" size="sm" className="text-cyan-500 dark:text-cyan-400" />
          <span>Home</span>
        </a>

        {/* Theme Mode Toggle (Light / Dark) */}
        <button
          type="button"
          className="icon-btn theme-toggle-btn"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} size="md" />
        </button>

        {/* Notifications Popover */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            type="button"
            className="icon-btn"
            onClick={() => setIsNotifOpen(prev => !prev)}
            aria-label="Notifications"
            title="Notifications"
          >
            <Icon name="bell" />
            {unreadNotificationsCount > 0 && (
              <span className="badge-dot">{unreadNotificationsCount}</span>
            )}
          </button>


          {isNotifOpen && (
            <div className="popover" style={{ width: '380px' }}>
              <div className="row-between" style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
                <div className="row gap-2">
                  <b style={{ fontSize: '14px' }}>Notifications</b>
                  <span className="badge b-info no-dot" style={{ fontSize: '11px', height: '20px' }}>
                    {unreadNotificationsCount} unread
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={markAllNotificationsRead}
                  style={{ fontSize: '12px' }}
                >
                  Mark all as read
                </button>
              </div>

              <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                {notifications.slice(0, 5).map(n => (
                  <div
                    key={n.id}
                    className={`notif ${n.unread ? 'unread' : ''}`}
                    onClick={() => {
                      markNotificationRead(n.id);
                      window.location.hash = n.link;
                      setIsNotifOpen(false);
                    }}
                  >
                    <div className="li-ico" style={{ width: '32px', height: '32px' }}>
                      <Icon name={n.icon} size="sm" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <b>{n.title}</b>
                      <p>{n.message}</p>
                      <time>{n.date}</time>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ padding: '10px 14px', textAlign: 'center', borderTop: '1px solid var(--border)', background: 'var(--surface-2)' }}>
                <a
                  className="card-link"
                  href={`#/${role}/notifications`}
                  onClick={() => setIsNotifOpen(false)}
                >
                  View all alerts in Center <Icon name="arrowRight" size="sm" />
                </a>
              </div>
            </div>
          )}
        </div>


        {/* User Avatar Menu or Sign In Button */}
        {isAuthenticated ? (
          <>
            <div style={{ position: 'relative' }} ref={userRef}>
              <button
                type="button"
                className="user-chip"
                onClick={() => setIsUserMenuOpen(prev => !prev)}
                aria-label="User account menu"
              >
                <div className="avatar">{currentUser?.short || 'AH'}</div>
                <div className="hide-m">
                  <b>{currentUser?.name || 'Ahmed Hassan'}</b>
                  <span>{currentUser?.roleLabel}</span>
                </div>
                <Icon name="chevronDown" size="sm" className="hide-m muted" />
              </button>

              {isUserMenuOpen && (
                <div className="popover menu user-menu-popover">
                  <div style={{ padding: '10px 12px 12px', borderBottom: '1px solid var(--border)', marginBottom: '6px' }}>
                    <b style={{ fontSize: '13.5px', display: 'block' }}>{currentUser?.name}</b>
                    <span className="text-xs muted" style={{ display: 'block' }}>{currentUser?.meta}</span>
                    <span className="badge b-info no-dot mt-1" style={{ fontSize: '11px', height: '20px' }}>
                      {currentUser?.roleLabel}
                    </span>
                  </div>

                  <a href={`#/${role}/profile`} onClick={() => setIsUserMenuOpen(false)}>
                    <Icon name="user" size="sm" /> My Profile
                  </a>
                  <a href={`#/${role}/notifications`} onClick={() => setIsUserMenuOpen(false)}>
                    <Icon name="bell" size="sm" /> Notifications ({unreadNotificationsCount})
                  </a>
                  <a href="#/screens" onClick={() => setIsUserMenuOpen(false)}>
                    <Icon name="grid" size="sm" /> All Screens Directory
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      toggleTheme();
                      setIsUserMenuOpen(false);
                    }}
                  >
                    <Icon name={theme === 'dark' ? 'sun' : 'moon'} size="sm" />
                    <span>Theme: {theme === 'dark' ? 'Dark Mode (Active)' : 'Light Mode (Active)'}</span>
                  </button>

                  <div className="divider" style={{ margin: '6px 0' }} />

                  <div style={{ padding: '4px 10px 6px', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                    SWITCH ACTIVE ROLE:
                  </div>
                  {rolesList.map(r => (
                    <button
                      key={r.id}
                      type="button"
                      style={{
                        fontWeight: role === r.id ? 700 : 400,
                        background: role === r.id ? 'var(--blue-50)' : 'transparent',
                        color: role === r.id ? 'var(--navy-800)' : 'inherit'
                      }}
                      onClick={() => handleRoleChange(r.id)}
                    >
                      <Icon name={r.icon} size="sm" />
                      {r.label} {role === r.id && '✓'}
                    </button>
                  ))}

                  <div className="divider" style={{ margin: '6px 0' }} />

                  <button
                    type="button"
                    className="danger user-menu-signout"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                  >
                    <Icon name="logout" size="sm" /> Sign out
                  </button>
                </div>
              )}
            </div>

            {/* Direct Navbar Sign Out Button - Large screens only */}
            <button
              type="button"
              className="topbar-signout-btn hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ml-1.5"
              onClick={logout}
              aria-label="Sign Out of Account"
              title="Sign Out of Platform"
            >
              <Icon name="logout" size="sm" />
              <span>Sign Out</span>
            </button>
          </>
        ) : (
          <a
            href="#/login"
            className="cta-primary inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all shadow-md cursor-pointer whitespace-nowrap"
          >
            <Icon name="user" size="sm" />
            <span>Sign In</span>
          </a>
        )}

        {/* Mobile & Tablet hamburger menu toggle — Positioned on the FAR RIGHT */}
       
      </div>
    </header>
  );
};
