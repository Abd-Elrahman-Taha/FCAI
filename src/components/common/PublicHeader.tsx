import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Icon, FCAILogo } from '../icons/Icon';

export type PublicNavId = 'home' | 'departments' | 'features' | 'assistant' | 'metrics' | 'faq' | 'screens';

interface PublicHeaderProps {
  activeNav?: PublicNavId;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({ activeNav = 'home' }) => {
  const { role, isAuthenticated, logout, theme, toggleTheme, toggleMobileMenu } = useAuth();

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (activeNav === 'home') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
      document.body.scrollTo({ top: 0, behavior: 'smooth' });
      const mainEl = document.querySelector('.main');
      if (mainEl) mainEl.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navLinks: { id: PublicNavId; label: string; href: string; isExternal?: boolean }[] = [
    { id: 'departments', label: 'Departments', href: '#/departments' },
    { id: 'features', label: 'Smart Features', href: '#/features' },
    { id: 'assistant', label: 'AI Assistant', href: '#/assistant' },
    { id: 'metrics', label: 'Platform Numbers', href: '#/metrics' },
    { id: 'faq', label: 'FAQ', href: '#/faq' },
    { id: 'screens', label: 'All 106 Screens', href: '#/screens', isExternal: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-white/90 dark:bg-[#020b17]/92 border-b border-slate-200/80 dark:border-cyan-500/25 px-4 sm:px-6 lg:px-14 py-3.5 sm:py-4 transition-all shadow-sm dark:shadow-xl dark:shadow-cyan-950/40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Identity with Logo */}
        <a
          href="#/home"
          onClick={handleLogoClick}
          className="flex items-center gap-3 group cursor-pointer text-decoration-none select-none"
          title={activeNav === 'home' ? 'Scroll to Top' : 'Return to Home Landing Page'}
        >
          <div className="relative flex-shrink-0">
            <FCAILogo size={38} />
            <div className="absolute -inset-1 rounded-full bg-cyan-400/25 blur-sm group-hover:bg-cyan-400/50 transition-all pointer-events-none" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white group-hover:text-cyan-400 transition-colors">
                FCAI BSU
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-cyan-500/15 text-cyan-600 border border-cyan-500/30 dark:bg-cyan-500/20 dark:text-cyan-300 whitespace-nowrap">
                2026/2027
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block -mt-0.5 hidden sm:block">
              Faculty of Computers &amp; Artificial Intelligence
            </span>
          </div>
        </a>

        {/* Center Navigation Links (Desktop) - Text Strictly on One Line Next to Each Other (Visible on big screens >= 1024px) */}
        <nav className="hidden lg:flex items-center gap-5 lg:gap-7 xl:gap-8 text-xs font-semibold text-slate-700 dark:text-slate-300">
          {navLinks.map(link => {
            const isActive = activeNav === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                className={`py-1 whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 relative group ${
                  isActive
                    ? 'text-cyan-600 dark:text-cyan-400 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-300'
                }`}
              >
                <span>{link.label}</span>
                {link.isExternal && <Icon name="arrowUpRight" size="sm" />}
                {isActive && (
                  <span className="absolute -bottom-2.5 left-0 right-0 h-[2px] bg-[#38bdf8] rounded-full shadow-[0_0_8px_#38bdf8]" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button (Light / Dark) */}
          <button
            type="button"
            className="icon-btn theme-toggle-btn shadow-xs bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 backdrop-blur-md rounded-xl text-slate-700 dark:text-amber-400 cursor-pointer"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size="md" />
          </button>

          {/* Launch Portal or Login CTA Button */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <a
                href={`#/${role}/dashboard`}
                className="cta-primary inline-flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-black transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <span>Enter Portal</span>
                <Icon name="arrowRight" size="sm" />
              </a>

              {/* Sign Out button: Visible ONLY on large screens (hidden on phones; on phones it is in the mobile drawer list) */}
              <button
                type="button"
                onClick={logout}
                className="hidden md:inline-flex signout-nav-btn items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                title="Sign Out of Account"
              >
                <Icon name="logout" size="sm" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <a
              href="#/login"
              className="cta-primary inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs font-black transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <Icon name="user" size="sm" />
              <span>Login</span>
            </a>
          )}

          {/* Mobile & Tablet hamburger menu toggle — ONLY on phones and tablets, strictly hidden on big screens */}
          <button
            type="button"
            className="icon-btn lg:hidden mobile-hamburger-btn text-slate-700 dark:text-slate-200"
            onClick={toggleMobileMenu}
            aria-label="Open mobile navigation menu"
            title="Open menu"
          >
            <Icon name="menu" size="lg" />
          </button>
        </div>
      </div>
    </header>
  );
};
