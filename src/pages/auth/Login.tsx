/**
 * Screen 1: Institutional Portal Sign-In (Sliding Split-Screen)
 *
 * Connected strictly to POST /api/auth/login:
 * - Student Login: { nationalId, studentCode, password }
 * - Staff Login (Admin, Doctor, TeachingAssistant, Employee): { email, password }
 *
 * Zero hardcoded credentials. Zero mock fallbacks. Zero browser storage.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, type LoginResult } from '../../context/AuthContext';
import { ApiError } from '../../services/api';
import { Icon, FCAILogo } from '../../components/icons/Icon';
import { EducationHeroIllustration } from '../../components/auth/EducationHeroIllustration';

export interface LoginProps {
  onLoginSuccess?: (result: LoginResult) => void;
  initialMode?: 'signin' | 'signup';
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, initialMode }) => {
  const { login, theme, toggleTheme } = useAuth();

  const detectModeFromHash = (): 'signin' | 'signup' => {
    if (initialMode) return initialMode;
    const h = (window.location.hash || '').replace(/^#\/?/, '').toLowerCase().trim();
    if (h === 'signup' || h === 'register' || h === 'enrollment') return 'signup';
    return 'signin';
  };

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(detectModeFromHash);
  const [prevInitialMode, setPrevInitialMode] = useState(initialMode);

  if (initialMode !== prevInitialMode) {
    setPrevInitialMode(initialMode);
    if (initialMode) {
      setAuthMode(initialMode);
    }
  }

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
    setApiError(null);
    setAuthMode(targetMode);
    const targetHash = targetMode === 'signup' ? '#/signup' : '#/login';
    if (window.location.hash !== targetHash) {
      window.history.replaceState(null, '', targetHash);
    }
  };

  // Sign-In Form State (no pre-filled hardcoded credentials)
  const [loginType, setLoginType] = useState<'student' | 'staff'>('student');
  const [nationalId, setNationalId] = useState('');
  const [studentCode, setStudentCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [apiError, setApiError] = useState<ApiError | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fieldErrors = (field: string): string[] => apiError?.getFieldErrors(field) ?? [];

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setClientError(null);

    if (loginType === 'student') {
      if (!nationalId.trim() || !studentCode.trim() || !password) {
        setClientError('Please enter your National ID, Student Code, and Password.');
        return;
      }
    } else {
      if (!email.trim() || !password) {
        setClientError('Please enter your institutional email and password.');
        return;
      }
    }

    setIsLoading(true);
    try {
      const payload =
        loginType === 'student'
          ? {
              nationalId: nationalId.trim(),
              studentCode: studentCode.trim(),
              password,
            }
          : {
              email: email.trim(),
              password,
            };

      const result = await login(payload);

      if (onLoginSuccess) {
        onLoginSuccess(result);
      } else if (result.requiresPasswordChange) {
        window.location.hash = '#/first-login';
      } else {
        window.location.hash = `#/${result.routeRole}/dashboard`;
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setApiError(err);
      } else {
        setClientError(err instanceof Error ? err.message : 'Authentication failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const bannerError = clientError || apiError?.message || null;

  return (
    <div className={`auth-sliding-shell ${authMode === 'signup' ? 'is-signup' : ''}`}>
      {/* PANEL 1: BRAND SHOWCASE PANEL */}
      <aside className="auth-sliding-art" aria-label="FCAI BSU Institutional Showcase">
        <div className="cyber-grid-overlay" style={{ opacity: 0.45 }} />

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
            Official Portal
          </span>
        </div>

        <div style={{ position: 'relative', zIndex: 2, margin: 'auto 0' }}>
          <EducationHeroIllustration />
        </div>

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
                  Sign in with your verified FCAI BSU institutional credentials. Your role and portal access are assigned securely by the backend.
                </p>

                <div className="auth-switch-banner">
                  <div>
                    <b style={{ display: 'block', fontSize: '13.5px', color: '#ffffff' }}>
                      Need an institutional account?
                    </b>
                    <span style={{ fontSize: '12px', color: '#94b8df' }}>
                      View account provisioning &amp; enrollment guidance.
                    </span>
                  </div>
                  <button
                    type="button"
                    className="auth-switch-banner-btn"
                    onClick={() => switchAuthMode('signup')}
                  >
                    <span>Enrollment Info</span>
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
                  <Icon name="info" size="sm" /> Institutional Account Provisioning
                </span>
                <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff', lineHeight: 1.2 }}>
                  Verified accounts managed by College Administration.
                </h2>
                <p style={{ color: '#b8d4f2', marginTop: '8px', fontSize: '14px', lineHeight: 1.55, maxWidth: '480px' }}>
                  Student, Doctor, Teaching Assistant, Admin, and Employee accounts are issued directly by FCAI BSU Administration for institutional security.
                </p>

                <div className="auth-switch-banner">
                  <div>
                    <b style={{ display: 'block', fontSize: '13.5px', color: '#ffffff' }}>
                      Already have your credentials?
                    </b>
                    <span style={{ fontSize: '12px', color: '#94b8df' }}>
                      Slide back to sign in with your Student Code or institutional email.
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

      {/* PANEL 2: INTERACTIVE FORM PANEL */}
      <div className="auth-sliding-form">
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

        <div className="auth-modern-card">
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
              <span>Account Info</span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {authMode === 'signin' ? (
              <motion.div
                key="form-signin"
                initial={{ opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -28 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="mb-4">
                  <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Sign In to FCAI BSU
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                    Select Student or Staff login below. Your role and permissions are verified by the backend.
                  </p>
                </div>

                {/* Account Type Switch: Student vs Staff (Admin, Doctor, TA, Employee) */}
                <div className="p-1 rounded-xl bg-slate-100 dark:bg-[#041124] border border-slate-200 dark:border-sky-500/25 grid grid-cols-2 gap-1 mb-4" role="tablist" aria-label="Login type">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={loginType === 'student'}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      loginType === 'student'
                        ? 'btn-primary shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    }`}
                    onClick={() => {
                      setLoginType('student');
                      setApiError(null);
                      setClientError(null);
                    }}
                  >
                    <Icon name="graduation" size="sm" />
                    <span>Student</span>
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={loginType === 'staff'}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      loginType === 'staff'
                        ? 'btn-primary shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    }`}
                    onClick={() => {
                      setLoginType('staff');
                      setApiError(null);
                      setClientError(null);
                    }}
                  >
                    <Icon name="briefcase" size="sm" />
                    <span>Faculty, Admin &amp; Staff</span>
                  </button>
                </div>

                {bannerError && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-500/40 text-xs text-red-900 dark:text-red-200 flex items-start gap-2.5 mb-4" role="alert">
                    <Icon name="alertCircle" size="sm" className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <b className="block font-bold">
                        {apiError?.status ? `Sign-In Failed (HTTP ${apiError.status})` : 'Sign-In Error'}
                      </b>
                      <p className="mt-0.5">{bannerError}</p>
                    </div>
                  </div>
                )}

                <form className="space-y-4" onSubmit={handleSignInSubmit} noValidate>
                  {loginType === 'student' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="login-national-id" className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                          National ID (14 Digits)
                        </label>
                        <div className="relative flex items-center">
                          <span className="absolute left-3 text-slate-400 dark:text-sky-400 pointer-events-none flex items-center">
                            <Icon name="idCard" size="sm" />
                          </span>
                          <input
                            id="login-national-id"
                            className="w-full h-10 pl-9 pr-3 rounded-xl bg-white dark:bg-[#041124] border border-slate-300 dark:border-sky-500/30 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-sky-500"
                            type="text"
                            inputMode="numeric"
                            maxLength={14}
                            value={nationalId}
                            onChange={e => setNationalId(e.target.value)}
                            placeholder="14-digit National ID"
                            autoComplete="username"
                            required
                          />
                        </div>
                        {fieldErrors('nationalId').map((msg, i) => (
                          <p key={i} className="text-xs text-red-600 dark:text-red-400 mt-1">{msg}</p>
                        ))}
                      </div>

                      <div>
                        <label htmlFor="login-student-code" className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                          Student Code
                        </label>
                        <div className="relative flex items-center">
                          <span className="absolute left-3 text-slate-400 dark:text-sky-400 pointer-events-none flex items-center">
                            <Icon name="hash" size="sm" />
                          </span>
                          <input
                            id="login-student-code"
                            className="w-full h-10 pl-9 pr-3 rounded-xl bg-white dark:bg-[#041124] border border-slate-300 dark:border-sky-500/30 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-sky-500"
                            type="text"
                            value={studentCode}
                            onChange={e => setStudentCode(e.target.value)}
                            placeholder="e.g. 240001"
                            required
                          />
                        </div>
                        {fieldErrors('studentCode').map((msg, i) => (
                          <p key={i} className="text-xs text-red-600 dark:text-red-400 mt-1">{msg}</p>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                        For <b>Admin</b>, <b>Doctor</b>, <b>Teaching Assistant</b>, and <b>Employee</b> accounts.
                      </p>
                      <label htmlFor="login-email" className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                        Institutional Email
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-slate-400 dark:text-sky-400 pointer-events-none flex items-center">
                          <Icon name="mail" size="sm" />
                        </span>
                        <input
                          id="login-email"
                          className="w-full h-10 pl-9 pr-3 rounded-xl bg-white dark:bg-[#041124] border border-slate-300 dark:border-sky-500/30 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-sky-500"
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="name@fcai.bsu"
                          autoComplete="email"
                          required
                        />
                      </div>
                      {fieldErrors('email').map((msg, i) => (
                        <p key={i} className="text-xs text-red-600 dark:text-red-400 mt-1">{msg}</p>
                      ))}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label htmlFor="login-password" className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
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
                        id="login-password"
                        className="w-full h-10 pl-9 pr-10 rounded-xl bg-white dark:bg-[#041124] border border-slate-300 dark:border-sky-500/30 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-sky-500"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        autoComplete="current-password"
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
                    {fieldErrors('password').map((msg, i) => (
                      <p key={i} className="text-xs text-red-600 dark:text-red-400 mt-1">{msg}</p>
                    ))}
                  </div>

                  <p className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Session tokens are stored exclusively in memory for security. Reloading the browser tab will require signing in again.
                  </p>

                  <button
                    className="btn btn-primary w-full h-11 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all mt-2"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Authenticating…</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In to Platform</span>
                        <Icon name="arrowRight" size="sm" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400">
                    Have a reset token already?
                  </span>
                  <a
                    href="#/reset-password"
                    className="font-bold text-sky-700 dark:text-sky-400 hover:underline inline-flex items-center gap-1"
                  >
                    <span>Reset Password</span>
                    <Icon name="arrowRight" size="sm" />
                  </a>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form-signup"
                initial={{ opacity: 0, x: -28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 28 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="py-2">
                  <div className="state-art info mb-4" style={{ width: '56px', height: '56px', borderRadius: '16px' }}>
                    <Icon name="shieldCheck" size="lg" />
                  </div>
                  <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Institutional Account Provisioning
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    Self-registration is not exposed on the backend API. All institutional accounts are created and verified by <b>FCAI BSU College Administration</b> and <b>Student Affairs</b>.
                  </p>

                  <div className="mt-4 space-y-2.5 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#041124] border border-slate-200 dark:border-sky-500/20">
                      <b className="block text-slate-900 dark:text-white mb-1">Students</b>
                      <p className="text-slate-600 dark:text-slate-300">
                        Use your 14-digit Egyptian National ID, assigned Student Code, and initial password issued by Student Affairs. On first login, you will be prompted to set a permanent password.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#041124] border border-slate-200 dark:border-sky-500/20">
                      <b className="block text-slate-900 dark:text-white mb-1">Admin, Doctors, TAs &amp; Employees</b>
                      <p className="text-slate-600 dark:text-slate-300">
                        Sign in under the Staff tab using your official institutional email and password provisioned by College IT Administration.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => switchAuthMode('signin')}
                    className="btn btn-primary w-full h-11 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer mt-5"
                  >
                    <Icon name="chevronLeft" size="sm" />
                    <span>Back to Sign In</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4">
          © 2026/2027 Faculty of Computers &amp; Artificial Intelligence · Beni Suef University
        </div>
      </div>
    </div>
  );
};
