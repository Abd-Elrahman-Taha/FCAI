import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Icon, FCAILogo } from '../../components/icons/Icon';
import { EducationHeroIllustration } from '../../components/auth/EducationHeroIllustration';
import type { Role } from '../../types';

interface EnrollmentQuickAccount {
  role: Role;
  roleLabel: string;
  name: string;
  meta: string;
  icon: string;
  code?: string;
  nationalId?: string;
  email?: string;
  badge: string;
}

const ENROLLMENTS: EnrollmentQuickAccount[] = [
  {
    role: 'student',
    roleLabel: 'Student Enrollment',
    name: 'Ahmed Mohamed Hassan',
    meta: 'Level 3 · CS (Code: 2021170045)',
    icon: 'graduation',
    code: '2021170045',
    nationalId: '30302152201234',
    badge: 'Undergraduate'
  },
  {
    role: 'doctor',
    roleLabel: 'Faculty Doctor Enrollment',
    name: 'Dr. Mona Abdelrahman',
    meta: 'Assoc. Professor · Computer Science',
    icon: 'briefcase',
    email: 'mona.abdelrahman@fcai.bsu.edu.eg',
    badge: 'Faculty Member'
  },
  {
    role: 'ta',
    roleLabel: 'Teaching Assistant Enrollment',
    name: 'Eng. Youssef Khaled',
    meta: 'Teaching Assistant · CS Dept',
    icon: 'users',
    email: 'youssef.khaled@fcai.bsu.edu.eg',
    badge: 'Assisting Staff'
  },
  {
    role: 'admin',
    roleLabel: 'College Admin Enrollment',
    name: 'Tarek Fathy',
    meta: 'Dean Executive Administration',
    icon: 'shieldCheck',
    email: 'tarek.fathy@fcai.bsu.edu.eg',
    badge: 'Executive Admin'
  },
  {
    role: 'employee',
    roleLabel: 'Staff Employee Enrollment',
    name: 'Salma Ibrahim',
    meta: 'Senior Officer · Student Affairs',
    icon: 'idCard',
    email: 'salma.ibrahim@fcai.bsu.edu.eg',
    badge: 'Student Affairs'
  }
];

export const Login: React.FC<{ onLoginSuccess?: () => void }> = ({ onLoginSuccess }) => {
  const { login, theme, toggleTheme } = useAuth();
  const [isStaff, setIsStaff] = useState(false);
  const [selectedStaffRole, setSelectedStaffRole] = useState<Role>('doctor');
  const [signingInRole, setSigningInRole] = useState<Role | null>(null);

  const [nationalId, setNationalId] = useState('30302152201234');
  const [studentCode, setStudentCode] = useState('2021170045');
  const [email, setEmail] = useState('mona.abdelrahman@fcai.bsu.edu.eg');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickSignIn = async (targetRole: Role) => {
    setSigningInRole(targetRole);
    setError(null);

    // Synchronize form fields
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

  const handleSubmit = async (e: React.FormEvent) => {
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

  return (
    <div className="auth min-h-screen bg-slate-100 dark:bg-[#020b17] text-slate-800 dark:text-slate-100">
      {/* Brand panel with palette pill stack & shine */}
      <motion.aside
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="auth-art"
        aria-hidden="false"
      >
        <a href="#/home" className="row cursor-pointer" style={{ position: 'relative', zIndex: 2, textDecoration: 'none' }} title="Go to FCAI BSU Home">
          <FCAILogo size={46} />
          <div>
            <b style={{ fontSize: '16px', display: 'block', color: '#ffffff' }}>
              FCAI · Beni Suef University
            </b>
            <span style={{ fontSize: '12.5px', color: '#c4dbf3', fontWeight: 500 }}>
              Faculty of Computers &amp; Artificial Intelligence
            </span>
          </div>
        </a>

        {/* Educational blue-themed illustration */}
        <EducationHeroIllustration />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '440px' }}>
          <span className="hero-chip" style={{ marginBottom: '14px' }}>
            <Icon name="shieldCheck" size="sm" /> Official Faculty Academic Platform
          </span>
          <h2 style={{ fontSize: '30px', fontWeight: 750, letterSpacing: '-.02em', color: '#fff', marginTop: '12px' }}>
            Your academic life, in one trusted place.
          </h2>
          <p style={{ color: '#c4dbf3', marginTop: '10px', fontSize: '15px' }}>
            Courses, attendance, examinations, grades, fees and administrative services — secured with your institutional account.
          </p>
          <div className="row gap-6 mt-6" style={{ color: '#C1E8FF', fontSize: '12.5px' }}>
            <span className="row gap-2"><Icon name="graduation" size="sm" /> Students</span>
            <span className="row gap-2"><Icon name="briefcase" size="sm" /> Faculty Doctors</span>
            <span className="row gap-2"><Icon name="users" size="sm" /> Teaching Assistants</span>
            <span className="row gap-2"><Icon name="idCard" size="sm" /> College Staff</span>
          </div>
        </div>
      </motion.aside>

      {/* Login form */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="auth-form relative bg-slate-100/70 dark:bg-[#020b17] flex items-center justify-center p-6 sm:p-10"
      >
        {/* Floating Theme Mode Toggle */}
        <div className="absolute top-5 right-5 z-20">
          <button
            type="button"
            className="icon-btn theme-toggle-btn shadow-xs bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 backdrop-blur-md rounded-xl text-slate-700 dark:text-amber-400 cursor-pointer"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size="md" />
          </button>
        </div>

        <div className="auth-card w-full max-w-xl bg-white dark:bg-[#071933]/90 rounded-3xl p-6 sm:p-8 shadow-xl dark:shadow-2xl border border-slate-200/90 dark:border-sky-500/25 backdrop-blur-xl transition-all">
          <div className="mb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-100 text-sky-900 border border-sky-300 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/30 mb-2.5">
              <Icon name="lock" size="sm" /> Institutional Single Sign-On
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Welcome back
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1.5">
              Sign in to the FCAI BSU Platform or use 1-click quick sign-in below.
            </p>
          </div>

          {/* Quick Sign-In for Every Enrollment */}
          <div className="mb-5 p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-[#031329] border border-slate-200 dark:border-sky-500/25">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-sky-300 flex items-center gap-1.5">
                <Icon name="zap" size="sm" className="text-sky-600 dark:text-sky-400" />
                Quick Sign-In by Enrollment
              </span>
              <span className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400">
                1-Click Direct Access
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
              Click any enrollment role below to sign in instantly with its pre-configured demo account:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ENROLLMENTS.map((item, idx) => {
                const isCurrentSigning = signingInRole === item.role;
                const isFullWidth = idx === ENROLLMENTS.length - 1;
                return (
                  <button
                    key={item.role}
                    type="button"
                    disabled={isLoading || signingInRole !== null}
                    onClick={() => handleQuickSignIn(item.role)}
                    aria-label={`Sign in as ${item.roleLabel}`}
                    className={`group text-left p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer relative flex items-center gap-2.5 ${
                      isFullWidth ? 'sm:col-span-2' : ''
                    } ${
                      isCurrentSigning
                        ? 'bg-[#052659] text-white border-[#052659] dark:bg-[#38bdf8] dark:text-[#020b17] dark:border-[#38bdf8] shadow-md'
                        : 'bg-white hover:bg-slate-100 dark:bg-[#071d3d] dark:hover:bg-[#0b2b57] text-slate-800 dark:text-slate-100 border-slate-200 dark:border-sky-500/25 hover:border-sky-500 dark:hover:border-sky-400 shadow-xs'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isCurrentSigning
                        ? 'bg-white/20 text-white dark:bg-[#020b17]/20 dark:text-[#020b17]'
                        : 'bg-sky-100 dark:bg-sky-500/15 text-sky-700 dark:text-sky-300 group-hover:bg-[#052659] group-hover:text-white dark:group-hover:bg-[#38bdf8] dark:group-hover:text-[#020b17]'
                    }`}>
                      {isCurrentSigning ? (
                        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Icon name={item.icon} size="sm" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold truncate">
                          {item.roleLabel}
                        </span>
                        <span className={`text-[10px] font-bold tracking-wider shrink-0 ml-1 transition-opacity ${
                          isCurrentSigning
                            ? 'opacity-100'
                            : 'text-sky-700 dark:text-sky-300 opacity-80 group-hover:opacity-100'
                        }`}>
                          {isCurrentSigning ? 'Signing in…' : 'Sign In →'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {item.name}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative flex py-1 items-center mb-4">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="flex-shrink mx-3 text-[10.5px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Or sign in manually
            </span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          {/* Account type switch */}
          <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-sky-500/30 grid grid-cols-2 gap-1 mb-5" role="tablist" aria-label="Account type">
            <button
              type="button"
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                !isStaff
                  ? 'cta-primary shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
              onClick={() => { setIsStaff(false); setError(null); }}
            >
              <Icon name="graduation" size="sm" /> <span>Student</span>
            </button>
            <button
              type="button"
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isStaff
                  ? 'cta-primary shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
              onClick={() => { setIsStaff(true); setError(null); }}
            >
              <Icon name="briefcase" size="sm" /> <span>Faculty &amp; Staff</span>
            </button>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-500/40 text-xs text-red-900 dark:text-red-200 flex items-start gap-3 mb-5">
              <Icon name="alertCircle" size="md" className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div>
                <b className="block font-bold">We couldn't sign you in</b>
                <p className="mt-0.5 text-red-800 dark:text-red-300">{error}</p>
              </div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isStaff ? (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    National ID (14 Digits)
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-slate-400 dark:text-sky-400 pointer-events-none flex items-center">
                      <Icon name="idCard" size="sm" />
                    </span>
                    <input
                      className="w-full h-11 pl-10 pr-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-sky-500/30 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-sm font-medium transition-all"
                      type="text"
                      maxLength={14}
                      value={nationalId}
                      onChange={e => setNationalId(e.target.value)}
                      placeholder="Enter 14-digit National ID"
                      required
                    />
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
                    Enter the 14 digits exactly as on your Egyptian National ID card.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Student Code
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-slate-400 dark:text-sky-400 pointer-events-none flex items-center">
                      <Icon name="hash" size="sm" />
                    </span>
                    <input
                      className="w-full h-11 pl-10 pr-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-sky-500/30 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-sm font-medium transition-all"
                      type="text"
                      value={studentCode}
                      onChange={e => setStudentCode(e.target.value)}
                      placeholder="e.g. 2021170045"
                      required
                    />
                  </div>
                </div>
              </>
            ) : (
              <div>
                <div className="mb-3">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Select Staff Enrollment Role:
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { role: 'doctor' as Role, label: 'Doctor', email: 'mona.abdelrahman@fcai.bsu.edu.eg' },
                      { role: 'ta' as Role, label: 'TA', email: 'youssef.khaled@fcai.bsu.edu.eg' },
                      { role: 'admin' as Role, label: 'Admin', email: 'tarek.fathy@fcai.bsu.edu.eg' },
                      { role: 'employee' as Role, label: 'Affairs Staff', email: 'salma.ibrahim@fcai.bsu.edu.eg' }
                    ].map(s => (
                      <button
                        key={s.role}
                        type="button"
                        onClick={() => {
                          setSelectedStaffRole(s.role);
                          setEmail(s.email);
                        }}
                        className={`py-1.5 px-2.5 rounded-lg text-xs transition-all cursor-pointer border ${
                          selectedStaffRole === s.role
                            ? 'bg-[#052659] text-white border-[#052659] dark:bg-[#38bdf8] dark:text-[#020b17] dark:border-[#38bdf8] font-bold shadow-xs'
                            : 'bg-white hover:bg-slate-50 dark:bg-slate-900/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 font-medium'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Institutional Email
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-slate-400 dark:text-sky-400 pointer-events-none flex items-center">
                    <Icon name="mail" size="sm" />
                  </span>
                  <input
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-sky-500/30 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-sm font-medium transition-all"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@fcai.bsu.edu.eg"
                    required
                  />
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
                  Must end with @fcai.bsu.edu.eg
                </span>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <a href="#/forgot-password" className="text-xs font-bold text-sky-700 hover:text-sky-900 dark:text-sky-400 dark:hover:text-sky-300">
                  Forgot password?
                </a>
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400 dark:text-sky-400 pointer-events-none flex items-center">
                  <Icon name="lock" size="sm" />
                </span>
                <input
                  className="w-full h-11 pl-10 pr-11 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-sky-500/30 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-sm font-medium transition-all"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
                  onClick={() => setShowPassword(p => !p)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <Icon name={showPassword ? 'eyeOff' : 'eye'} size="sm" />
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
              />
              <span>Keep me signed in on this device for 7 days</span>
            </label>

            <button
              className="cta-primary w-full h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-98 mt-2"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
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

          <div className="mt-6 p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-500/30 text-xs text-sky-950 dark:text-sky-200 flex items-start gap-3">
            <Icon name="info" size="md" className="text-sky-600 dark:text-sky-400 flex-shrink-0 mt-0.5" />
            <div>
              <b className="block font-bold">New student or faculty member?</b>
              <p className="mt-0.5 text-slate-600 dark:text-slate-300">
                Accounts are managed by College Administration. You can also{' '}
                <a href="#/signup" className="text-sky-700 dark:text-sky-400 font-bold hover:underline">
                  submit an enrollment request
                </a>.
              </p>
            </div>
          </div>

          <div className="mt-6 text-xs text-slate-500 dark:text-slate-400 text-center space-x-1">
            <span>Demo quick routes:</span>
            <a href="#/first-login" className="text-sky-700 dark:text-sky-400 hover:underline font-semibold">First login</a>
            <span>·</span>
            <a href="#/signup" className="text-sky-700 dark:text-sky-400 hover:underline font-semibold">Sign up / Enrollment</a>
            <span>·</span>
            <a href="#/screens" className="text-sky-700 dark:text-sky-400 hover:underline font-semibold">All 106 screens catalog</a>
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-4">
            © 2026 Faculty of Computers &amp; AI · Beni Suef University
          </p>
        </div>
      </motion.div>
    </div>
  );
};
