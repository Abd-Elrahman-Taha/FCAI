/**
 * Screen 1 & Enrollment: Institutional Portal Sign-In & Sign-Up (Sliding Split-Screen)
 *
 * - Sign In Mode: Brand Showcase Panel on Left (0%), Form Panel on Right (50%)
 * - Sign Up Mode: Brand Showcase Panel slides to Right (+100%), Form Panel slides to Left (-100%)
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Icon, FCAILogo } from '../../components/icons/Icon';
import { EducationHeroIllustration } from '../../components/auth/EducationHeroIllustration';
import type { Role } from '../../types';

interface EnrollmentQuickAccount {
  role: Role;
  roleLabel: string;
  shortLabel: string;
  name: string;
  meta: string;
  icon: string;
  code?: string;
  nationalId?: string;
  email?: string;
}

const ENROLLMENTS: EnrollmentQuickAccount[] = [
  {
    role: 'student',
    roleLabel: 'Student Portal',
    shortLabel: 'Student',
    name: 'Ahmed Hassan',
    meta: 'Level 3 · CS',
    icon: 'graduation',
    code: '2021170045',
    nationalId: '30302152201234'
  },
  {
    role: 'doctor',
    roleLabel: 'Doctor Portal',
    shortLabel: 'Doctor',
    name: 'Dr. Mona',
    meta: 'Computer Science',
    icon: 'briefcase',
    email: 'mona.abdelrahman@fcai.bsu.edu.eg'
  },
  {
    role: 'ta',
    roleLabel: 'TA Portal',
    shortLabel: 'TA',
    name: 'Eng. Youssef',
    meta: 'CS Department',
    icon: 'users',
    email: 'youssef.khaled@fcai.bsu.edu.eg'
  },
  {
    role: 'admin',
    roleLabel: 'College Admin',
    shortLabel: 'Admin',
    name: 'Tarek Fathy',
    meta: 'Executive Admin',
    icon: 'shieldCheck',
    email: 'tarek.fathy@fcai.bsu.edu.eg'
  },
  {
    role: 'employee',
    roleLabel: 'Affairs Staff',
    shortLabel: 'Staff',
    name: 'Salma Ibrahim',
    meta: 'Student Affairs',
    icon: 'idCard',
    email: 'salma.ibrahim@fcai.bsu.edu.eg'
  }
];

export interface LoginProps {
  onLoginSuccess?: () => void;
  initialMode?: 'signin' | 'signup';
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, initialMode }) => {
  const { login, theme, toggleTheme, showToast } = useAuth();

  const detectModeFromHash = (): 'signin' | 'signup' => {
    if (initialMode) return initialMode;
    const h = (window.location.hash || '').replace(/^#\/?/, '').toLowerCase().trim();
    if (h === 'signup' || h === 'register' || h === 'enrollment') return 'signup';
    return 'signin';
  };

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(detectModeFromHash);

  // Sync mode when initialMode prop or URL hash changes
  useEffect(() => {
    if (initialMode) {
      setAuthMode(initialMode);
    }
  }, [initialMode]);

  useEffect(() => {
    const onHash = () => {
      const h = (window.location.hash || '').replace(/^#\/?/, '').toLowerCase().trim();
      if (h === 'signup' || h === 'register' || h === 'enrollment') {
        setAuthMode('signup');
      } else if (h === 'login' || h === 'screen/1') {
        setAuthMode('signin');
      }
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const switchAuthMode = (targetMode: 'signin' | 'signup') => {
    setError(null);
    setIsSubmitted(false);
    setAuthMode(targetMode);
    const targetHash = targetMode === 'signup' ? '#/signup' : '#/login';
    if (window.location.hash !== targetHash) {
      window.history.replaceState(null, '', targetHash);
    }
  };

  // Sign-In Form State
  const [isStaff, setIsStaff] = useState(false);
  const [selectedStaffRole, setSelectedStaffRole] = useState<Role>('doctor');
  const [signingInRole, setSigningInRole] = useState<Role | null>(null);
  const [nationalId, setNationalId] = useState('30302152201234');
  const [studentCode, setStudentCode] = useState('2021170045');
  const [email, setEmail] = useState('mona.abdelrahman@fcai.bsu.edu.eg');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign-Up Form State
  const [signupAccountType, setSignupAccountType] = useState<'student' | 'staff'>('student');
  const [signupFullName, setSignupFullName] = useState('');
  const [signupNationalId, setSignupNationalId] = useState('');
  const [signupAcademicCode, setSignupAcademicCode] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupDept, setSignupDept] = useState('AI');
  const [signupPassword, setSignupPassword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Shared Status State
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickSignIn = async (targetRole: Role) => {
    setSigningInRole(targetRole);
    setError(null);

    if (targetRole === 'student') {
      setIsStaff(false);
      setNationalId('30302152201234');
      setStudentCode('2021170045');
    } else {
      setIsStaff(true);
      setSelectedStaffRole(targetRole);
      if (targetRole === 'doctor') setEmail('mona.abdelrahman@fcai.bsu.edu.eg');
      else if (targetRole === 'ta') setEmail('youssef.khaled@fcai.bsu.edu.eg');
      else if (targetRole === 'admin') setEmail('tarek.fathy@fcai.bsu.edu.eg');
      else if (targetRole === 'employee') setEmail('salma.ibrahim@fcai.bsu.edu.eg');
    }
    setPassword('••••••••••••');

    try {
      await login({ role: targetRole });
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        const redirect = sessionStorage.getItem('fcai_redirect_after_login');
        if (redirect) {
          sessionStorage.removeItem('fcai_redirect_after_login');
          window.location.hash = redirect;
        } else {
          window.location.hash = `#/${targetRole}/dashboard`;
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify credentials.');
      setSigningInRole(null);
    }
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const targetRole: Role = isStaff ? selectedStaffRole : 'student';
      await login({
        email: isStaff ? email : undefined,
        studentCode: !isStaff ? studentCode : undefined,
        nationalId: !isStaff ? nationalId : undefined,
        password,
        role: targetRole,
        rememberMe
      });
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        const redirect = sessionStorage.getItem('fcai_redirect_after_login');
        if (redirect) {
          sessionStorage.removeItem('fcai_redirect_after_login');
          window.location.hash = redirect;
        } else {
          window.location.hash = `#/${targetRole}/dashboard`;
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupNationalId || signupNationalId.length < 14) {
      setError('Please provide a valid 14-digit Egyptian National ID.');
      return;
    }
    if (!signupEmail.includes('@')) {
      setError('Please provide a valid institutional or personal email address.');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      await api.auth.register({
        name: signupFullName,
        email: signupEmail,
        password: signupPassword,
        nationalId: signupNationalId,
        studentCode: signupAcademicCode,
        role: signupAccountType === 'staff' ? 'doctor' : 'student',
        department: signupDept
      });
      setIsSubmitted(true);
      showToast('Enrollment Request Received', 'Your institutional profile request is in verification with Student Affairs.');
    } catch {
      setIsSubmitted(true);
      showToast('Enrollment Request Received', 'Your institutional profile request is in verification with Student Affairs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`auth-sliding-shell ${authMode === 'signup' ? 'is-signup' : ''}`}>
      {/* =====================================================================
          PANEL 1: BRAND SHOWCASE PANEL
          - Sign In Mode: Sits on the LEFT side (0%)
          - Sign Up Mode: Smoothly slides across to the RIGHT side (+100%)
          ===================================================================== */}
      <aside className="auth-sliding-art" aria-label="FCAI BSU Institutional Showcase">
        <div className="cyber-grid-overlay" style={{ opacity: 0.45 }} />

        {/* Brand Identity Header */}
        <div className="row-between" style={{ position: 'relative', zIndex: 2 }}>
          <a
            href="#/home"
            className="row gap-3 cursor-pointer"
            style={{ textDecoration: 'none' }}
            title="Return to FCAI BSU Home"
          >
            <FCAILogo size={44} />
            <div>
              <b style={{ fontSize: '16px', display: 'block', color: '#ffffff', letterSpacing: '-0.01em' }}>
                FCAI · Beni Suef University
              </b>
              <span style={{ fontSize: '12px', color: '#94b8df', fontWeight: 500 }}>
                Faculty of Computers &amp; Artificial Intelligence
              </span>
            </div>
          </a>

          <span
            style={{
              padding: '5px 12px',
              borderRadius: '99px',
              fontSize: '11px',
              fontWeight: 700,
              background: 'rgba(5, 38, 89, 0.75)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              color: '#C1E8FF'
            }}
          >
            2026 / 2027
          </span>
        </div>

        {/* Centerpiece Illustration */}
        <div style={{ position: 'relative', zIndex: 2, margin: 'auto 0' }}>
          <EducationHeroIllustration />
        </div>

        {/* Dynamic Bottom Copy + Sliding Trigger Banner */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <AnimatePresence mode="wait">
            {authMode === 'signin' ? (
              <motion.div
                key="art-signin"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="hero-chip" style={{ marginBottom: '12px' }}>
                  <Icon name="shieldCheck" size="sm" /> Official Faculty Academic Platform
                </span>
                <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff', lineHeight: 1.2 }}>
                  Your academic life, unified in one trusted place.
                </h2>
                <p style={{ color: '#b8d4f2', marginTop: '8px', fontSize: '14px', lineHeight: 1.55, maxWidth: '480px' }}>
                  Courses, synchronized timetables, geofenced QR attendance, grades, and AI study tools — secured with your institutional account.
                </p>

                <div className="auth-switch-banner">
                  <div>
                    <b style={{ display: 'block', fontSize: '13.5px', color: '#ffffff' }}>
                      New student or faculty member?
                    </b>
                    <span style={{ fontSize: '12px', color: '#94b8df' }}>
                      Slide over to submit your institutional enrollment request.
                    </span>
                  </div>
                  <button
                    type="button"
                    className="auth-switch-banner-btn"
                    onClick={() => switchAuthMode('signup')}
                  >
                    <span>Sign Up</span>
                    <Icon name="arrowRight" size="sm" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="art-signup"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="hero-chip" style={{ marginBottom: '12px' }}>
                  <Icon name="sparkles" size="sm" /> Institutional Admission &amp; Verification
                </span>
                <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff', lineHeight: 1.2 }}>
                  Join the next generation of AI &amp; Computing innovators.
                </h2>
                <p style={{ color: '#b8d4f2', marginTop: '8px', fontSize: '14px', lineHeight: 1.55, maxWidth: '480px' }}>
                  Activate your verified campus identity across CS, AI, IS, and IT departments to access lectures, lab sections, and digital services.
                </p>

                <div className="auth-switch-banner">
                  <div>
                    <b style={{ display: 'block', fontSize: '13.5px', color: '#ffffff' }}>
                      Already have an institutional account?
                    </b>
                    <span style={{ fontSize: '12px', color: '#94b8df' }}>
                      Slide back to sign in with your National ID or faculty email.
                    </span>
                  </div>
                  <button
                    type="button"
                    className="auth-switch-banner-btn"
                    onClick={() => switchAuthMode('signin')}
                  >
                    <Icon name="chevronLeft" size="sm" />
                    <span>Sign In</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>

      {/* =====================================================================
          PANEL 2: INTERACTIVE FORM PANEL
          - Sign In Mode: Sits on the RIGHT side (50%)
          - Sign Up Mode: Smoothly slides across to the LEFT side (-100%)
          ===================================================================== */}
      <div className="auth-sliding-form">
        {/* Top Utility Navigation Bar */}
        <div className="row-between" style={{ width: '100%', maxWidth: '540px', margin: '0 auto 16px' }}>
          <a
            href="#/home"
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: '10px', gap: '6px', textDecoration: 'none' }}
          >
            <Icon name="home" size="sm" />
            <span>Home</span>
          </a>

          <div className="row gap-2">
            <a
              href="#/screens"
              className="btn btn-secondary btn-sm"
              style={{ borderRadius: '10px', textDecoration: 'none' }}
            >
              <Icon name="grid" size="sm" />
              <span>All Screens</span>
            </a>
            <button
              type="button"
              className="icon-btn theme-toggle-btn shadow-xs bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-700 dark:text-amber-400 cursor-pointer"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} size="md" />
            </button>
          </div>
        </div>

        {/* Main Card Container */}
        <div className="auth-modern-card">
          {/* Top Sliding Mode Switcher: Sign In vs Sign Up */}
          <div className="auth-mode-switcher" role="tablist" aria-label="Authentication mode">
            <button
              type="button"
              role="tab"
              aria-selected={authMode === 'signin'}
              className={`auth-mode-btn ${authMode === 'signin' ? 'active' : ''}`}
              onClick={() => switchAuthMode('signin')}
            >
              <Icon name="lock" size="sm" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={authMode === 'signup'}
              className={`auth-mode-btn ${authMode === 'signup' ? 'active' : ''}`}
              onClick={() => switchAuthMode('signup')}
            >
              <Icon name="user" size="sm" />
              <span>Sign Up / Enroll</span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {authMode === 'signin' ? (
              /* ===============================================================
                 VIEW A: SIGN IN FORM
                 =============================================================== */
              <motion.div
                key="form-signin"
                initial={{ opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -28 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="mb-4">
                  <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Welcome back
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                    Sign in with your institutional credentials or use 1-click demo role access.
                  </p>
                </div>

                {/* Compact 1-Click Quick Sign-In Bar */}
                <div className="mb-4 p-3 rounded-2xl bg-slate-50 dark:bg-[#041124] border border-slate-200 dark:border-sky-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-sky-300 flex items-center gap-1.5">
                      <Icon name="zap" size="sm" />
                      1-Click Demo Portal Access
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                      Instant Launch
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-1.5">
                    {ENROLLMENTS.map(item => {
                      const isCurrent = signingInRole === item.role;
                      return (
                        <button
                          key={item.role}
                          type="button"
                          disabled={isLoading || signingInRole !== null}
                          onClick={() => handleQuickSignIn(item.role)}
                          title={`Sign in as ${item.name} (${item.roleLabel})`}
                          className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                            isCurrent
                              ? 'bg-[#052659] text-white border-sky-400 shadow-md'
                              : 'bg-white hover:bg-slate-100 dark:bg-[#081d3a] dark:hover:bg-[#0b2a52] text-slate-800 dark:text-slate-100 border-slate-200 dark:border-sky-500/25 hover:border-sky-500/60'
                          }`}
                        >
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#052659] text-white border border-sky-400/30">
                            {isCurrent ? (
                              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Icon name={item.icon} size="sm" />
                            )}
                          </div>
                          <span className="text-[11px] font-bold leading-tight truncate max-w-full">
                            {item.shortLabel}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Account Type Switch: Student vs Faculty & Staff */}
                <div className="p-1 rounded-xl bg-slate-100 dark:bg-[#041124] border border-slate-200 dark:border-sky-500/25 grid grid-cols-2 gap-1 mb-4">
                  <button
                    type="button"
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      !isStaff
                        ? 'btn-primary shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    }`}
                    onClick={() => { setIsStaff(false); setError(null); }}
                  >
                    <Icon name="graduation" size="sm" />
                    <span>Student</span>
                  </button>
                  <button
                    type="button"
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isStaff
                        ? 'btn-primary shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    }`}
                    onClick={() => { setIsStaff(true); setError(null); }}
                  >
                    <Icon name="briefcase" size="sm" />
                    <span>Faculty &amp; Staff</span>
                  </button>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-500/40 text-xs text-red-900 dark:text-red-200 flex items-start gap-2.5 mb-4">
                    <Icon name="alertCircle" size="sm" className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <b className="block font-bold">Authentication Notice</b>
                      <p className="mt-0.5">{error}</p>
                    </div>
                  </div>
                )}

                <form className="space-y-3.5" onSubmit={handleSignInSubmit}>
                  {!isStaff ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                          National ID (14 Digits)
                        </label>
                        <div className="relative flex items-center">
                          <span className="absolute left-3 text-slate-400 dark:text-sky-400 pointer-events-none flex items-center">
                            <Icon name="idCard" size="sm" />
                          </span>
                          <input
                            className="w-full h-10 pl-9 pr-3 rounded-xl bg-white dark:bg-[#041124] border border-slate-300 dark:border-sky-500/30 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-sky-500"
                            type="text"
                            maxLength={14}
                            value={nationalId}
                            onChange={e => setNationalId(e.target.value)}
                            placeholder="14-digit National ID"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                          Student Code
                        </label>
                        <div className="relative flex items-center">
                          <span className="absolute left-3 text-slate-400 dark:text-sky-400 pointer-events-none flex items-center">
                            <Icon name="hash" size="sm" />
                          </span>
                          <input
                            className="w-full h-10 pl-9 pr-3 rounded-xl bg-white dark:bg-[#041124] border border-slate-300 dark:border-sky-500/30 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-sky-500"
                            type="text"
                            value={studentCode}
                            onChange={e => setStudentCode(e.target.value)}
                            placeholder="e.g. 2021170045"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="grid grid-cols-4 gap-1.5 mb-3">
                        {[
                          { role: 'doctor' as Role, label: 'Doctor', email: 'mona.abdelrahman@fcai.bsu.edu.eg' },
                          { role: 'ta' as Role, label: 'TA', email: 'youssef.khaled@fcai.bsu.edu.eg' },
                          { role: 'admin' as Role, label: 'Admin', email: 'tarek.fathy@fcai.bsu.edu.eg' },
                          { role: 'employee' as Role, label: 'Staff', email: 'salma.ibrahim@fcai.bsu.edu.eg' }
                        ].map(s => (
                          <button
                            key={s.role}
                            type="button"
                            onClick={() => {
                              setSelectedStaffRole(s.role);
                              setEmail(s.email);
                            }}
                            className={`py-1.5 px-2 rounded-lg text-xs transition-all cursor-pointer border ${
                              selectedStaffRole === s.role
                                ? 'btn-primary font-bold'
                                : 'bg-white dark:bg-[#041124] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 font-medium'
                            }`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>

                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                        Institutional Email
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-slate-400 dark:text-sky-400 pointer-events-none flex items-center">
                          <Icon name="mail" size="sm" />
                        </span>
                        <input
                          className="w-full h-10 pl-9 pr-3 rounded-xl bg-white dark:bg-[#041124] border border-slate-300 dark:border-sky-500/30 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-sky-500"
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="name@fcai.bsu.edu.eg"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Password
                      </label>
                      <a href="#/forgot-password" className="text-xs font-bold text-sky-700 dark:text-sky-400 hover:underline">
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-slate-400 dark:text-sky-400 pointer-events-none flex items-center">
                        <Icon name="lock" size="sm" />
                      </span>
                      <input
                        className="w-full h-10 pl-9 pr-10 rounded-xl bg-white dark:bg-[#041124] border border-slate-300 dark:border-sky-500/30 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-sky-500"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                        onClick={() => setShowPassword(p => !p)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        <Icon name={showPassword ? 'eyeOff' : 'eye'} size="sm" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-0.5">
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                        className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                      />
                      <span>Keep me signed in for 7 days</span>
                    </label>
                    <a href="#/first-login" className="text-xs font-semibold text-sky-700 dark:text-sky-400 hover:underline">
                      First-time activation
                    </a>
                  </div>

                  <button
                    className="btn btn-primary w-full h-11 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all mt-2"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Signing in…</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In to Platform</span>
                        <Icon name="arrowRight" size="sm" />
                      </>
                    )}
                  </button>
                </form>

                {/* Bottom Slide Trigger */}
                <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400">
                    New student or faculty member?
                  </span>
                  <button
                    type="button"
                    onClick={() => switchAuthMode('signup')}
                    className="font-bold text-sky-700 dark:text-sky-400 hover:underline inline-flex items-center gap-1 cursor-pointer bg-transparent border-0 p-0"
                  >
                    <span>Sign Up / Enroll</span>
                    <Icon name="arrowRight" size="sm" />
                  </button>
                </div>
              </motion.div>
            ) : (
              /* ===============================================================
                 VIEW B: SIGN UP / ENROLLMENT FORM (SLIDES TO THE LEFT SIDE)
                 =============================================================== */
              <motion.div
                key="form-signup"
                initial={{ opacity: 0, x: -28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 28 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {isSubmitted ? (
                  <div className="text-center py-6">
                    <div className="state-art info mx-auto mb-4" style={{ width: '64px', height: '64px', borderRadius: '18px' }}>
                      <Icon name="checkCircle" size="xl" />
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
                      Enrollment Application Received
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mb-6 leading-relaxed">
                      Your institutional verification request for <b>{signupFullName || 'Applicant'}</b> has been sent to FCAI Student Affairs. Activation details will be sent to <b>{signupEmail}</b>.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <button
                        type="button"
                        onClick={() => switchAuthMode('signin')}
                        className="btn btn-primary flex-1 h-11 rounded-xl text-xs font-bold"
                      >
                        <Icon name="chevronLeft" size="sm" />
                        <span>Slide Back to Sign In</span>
                      </button>
                      <a
                        href="#/home"
                        className="btn btn-secondary flex-1 h-11 rounded-xl text-xs font-semibold"
                      >
                        <span>Return to Home</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Create Institutional Account
                      </h1>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                        Submit your 2026/2027 admission details for Student Affairs verification.
                      </p>
                    </div>

                    {/* Persona Switcher */}
                    <div className="p-1 rounded-xl bg-slate-100 dark:bg-[#041124] border border-slate-200 dark:border-sky-500/25 grid grid-cols-2 gap-1 mb-4">
                      <button
                        type="button"
                        className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          signupAccountType === 'student'
                            ? 'btn-primary shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                        }`}
                        onClick={() => setSignupAccountType('student')}
                      >
                        <Icon name="graduation" size="sm" />
                        <span>New Student</span>
                      </button>
                      <button
                        type="button"
                        className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          signupAccountType === 'staff'
                            ? 'btn-primary shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                        }`}
                        onClick={() => setSignupAccountType('staff')}
                      >
                        <Icon name="briefcase" size="sm" />
                        <span>Faculty &amp; Staff</span>
                      </button>
                    </div>

                    {error && (
                      <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-500/40 text-xs text-red-900 dark:text-red-200 flex items-start gap-2.5 mb-4">
                        <Icon name="alertCircle" size="sm" className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                        <span>{error}</span>
                      </div>
                    )}

                    <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                          Full Legal Name (Arabic or English)
                        </label>
                        <div className="relative flex items-center">
                          <span className="absolute left-3 text-slate-400 dark:text-sky-400 pointer-events-none flex items-center">
                            <Icon name="user" size="sm" />
                          </span>
                          <input
                            type="text"
                            required
                            value={signupFullName}
                            onChange={e => setSignupFullName(e.target.value)}
                            placeholder="e.g. Mostafa Ahmed Mahmoud"
                            className="w-full h-10 pl-9 pr-3 rounded-xl bg-white dark:bg-[#041124] border border-slate-300 dark:border-sky-500/30 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-sky-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                            Egyptian National ID
                          </label>
                          <div className="relative flex items-center">
                            <span className="absolute left-3 text-slate-400 dark:text-sky-400 pointer-events-none flex items-center">
                              <Icon name="idCard" size="sm" />
                            </span>
                            <input
                              type="text"
                              maxLength={14}
                              required
                              value={signupNationalId}
                              onChange={e => setSignupNationalId(e.target.value)}
                              placeholder="14-digit National ID"
                              className="w-full h-10 pl-9 pr-3 rounded-xl bg-white dark:bg-[#041124] border border-slate-300 dark:border-sky-500/30 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-sky-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                            Seat / Admission Code
                          </label>
                          <div className="relative flex items-center">
                            <span className="absolute left-3 text-slate-400 dark:text-sky-400 pointer-events-none flex items-center">
                              <Icon name="hash" size="sm" />
                            </span>
                            <input
                              type="text"
                              required
                              value={signupAcademicCode}
                              onChange={e => setSignupAcademicCode(e.target.value)}
                              placeholder="e.g. TANSIQ-84920"
                              className="w-full h-10 pl-9 pr-3 rounded-xl bg-white dark:bg-[#041124] border border-slate-300 dark:border-sky-500/30 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-sky-500"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                            Official / Contact Email
                          </label>
                          <div className="relative flex items-center">
                            <span className="absolute left-3 text-slate-400 dark:text-sky-400 pointer-events-none flex items-center">
                              <Icon name="mail" size="sm" />
                            </span>
                            <input
                              type="email"
                              required
                              value={signupEmail}
                              onChange={e => setSignupEmail(e.target.value)}
                              placeholder="student@fcai.bsu.edu.eg"
                              className="w-full h-10 pl-9 pr-3 rounded-xl bg-white dark:bg-[#041124] border border-slate-300 dark:border-sky-500/30 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-sky-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                            Academic Department
                          </label>
                          <select
                            value={signupDept}
                            onChange={e => setSignupDept(e.target.value)}
                            className="w-full h-10 px-3 rounded-xl bg-white dark:bg-[#041124] border border-slate-300 dark:border-sky-500/30 text-slate-900 dark:text-white text-xs sm:text-sm font-medium focus:outline-none focus:border-sky-500"
                          >
                            <option value="AI">Artificial Intelligence (AI)</option>
                            <option value="CS">Computer Science (CS)</option>
                            <option value="IS">Information Systems (IS)</option>
                            <option value="IT">Information Technology (IT)</option>
                            <option value="GENERAL">General First Year</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                          Create Secure Password
                        </label>
                        <div className="relative flex items-center">
                          <span className="absolute left-3 text-slate-400 dark:text-sky-400 pointer-events-none flex items-center">
                            <Icon name="lock" size="sm" />
                          </span>
                          <input
                            type="password"
                            required
                            value={signupPassword}
                            onChange={e => setSignupPassword(e.target.value)}
                            placeholder="At least 8 characters"
                            className="w-full h-10 pl-9 pr-3 rounded-xl bg-white dark:bg-[#041124] border border-slate-300 dark:border-sky-500/30 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-sky-500"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary w-full h-11 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all mt-2"
                      >
                        {isLoading ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Verifying Admission Data…</span>
                          </>
                        ) : (
                          <>
                            <span>Submit Enrollment Application</span>
                            <Icon name="arrowRight" size="sm" />
                          </>
                        )}
                      </button>
                    </form>

                    {/* Bottom Slide Trigger */}
                    <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-slate-600 dark:text-slate-400">
                        Already have an institutional account?
                      </span>
                      <button
                        type="button"
                        onClick={() => switchAuthMode('signin')}
                        className="font-bold text-sky-700 dark:text-sky-400 hover:underline inline-flex items-center gap-1 cursor-pointer bg-transparent border-0 p-0"
                      >
                        <Icon name="chevronLeft" size="sm" />
                        <span>Back to Sign In</span>
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Copyright */}
        <div className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4">
          © 2026/2027 Faculty of Computers &amp; Artificial Intelligence · Beni Suef University
        </div>
      </div>
    </div>
  );
};
