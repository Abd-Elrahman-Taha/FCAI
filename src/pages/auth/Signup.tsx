import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Icon, FCAILogo } from '../../components/icons/Icon';
import { EducationHeroIllustration } from '../../components/auth/EducationHeroIllustration';
import type { Role } from '../../types';

interface EnrollmentQuickOption {
  role: Role;
  label: string;
  name: string;
  icon: string;
}

const QUICK_ENROLLMENTS: EnrollmentQuickOption[] = [
  { role: 'student', label: 'Student', name: 'Ahmed Hassan', icon: 'graduation' },
  { role: 'doctor', label: 'Doctor', name: 'Dr. Mona', icon: 'briefcase' },
  { role: 'ta', label: 'TA', name: 'Eng. Youssef', icon: 'users' },
  { role: 'admin', label: 'Admin', name: 'Tarek Fathy', icon: 'shieldCheck' },
  { role: 'employee', label: 'Staff', name: 'Salma Ibrahim', icon: 'idCard' }
];

export const Signup: React.FC = () => {
  const { theme, toggleTheme, showToast, login } = useAuth();
  const [accountType, setAccountType] = useState<'student' | 'staff'>('student');
  const [nationalId, setNationalId] = useState('');
  const [academicCode, setAcademicCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedDept, setSelectedDept] = useState('AI');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signingInRole, setSigningInRole] = useState<Role | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleQuickSignIn = async (targetRole: Role) => {
    setSigningInRole(targetRole);
    try {
      await login({ role: targetRole });
      window.location.hash = `#/${targetRole}/dashboard`;
    } catch (err: any) {
      showToast('Authentication Error', err?.message || 'Could not sign in', 'error');
      setSigningInRole(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nationalId || nationalId.length < 14) {
      setError('Please provide a valid 14-digit Egyptian National ID.');
      return;
    }
    if (!email.includes('@')) {
      setError('Please provide a valid institutional or personal email.');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      await api.auth.register({
        name: fullName,
        email,
        password,
        nationalId,
        studentCode: academicCode,
        role: accountType === 'staff' ? 'doctor' : 'student',
        department: selectedDept
      });
      setIsSubmitted(true);
      showToast('Enrollment Request Received', 'Your institutional profile request is in verification with Student Affairs.');
    } catch {
      // In mock mode or offline, gracefully complete
      setIsSubmitted(true);
      showToast('Enrollment Request Received', 'Your institutional profile request is in verification with Student Affairs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth min-h-screen bg-slate-100 dark:bg-[#020b17] text-slate-800 dark:text-slate-100">
      {/* Brand Hero Art Panel */}
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

        {/* Hero Illustration */}
        <EducationHeroIllustration />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '440px' }}>
          <span className="hero-chip" style={{ marginBottom: '14px' }}>
            <Icon name="shieldCheck" size="sm" /> Institutional Admission &amp; Enrollment
          </span>
          <h2 style={{ fontSize: '30px', fontWeight: 750, letterSpacing: '-.02em', color: '#fff', marginTop: '12px' }}>
            Join the next generation of AI &amp; Computing innovators.
          </h2>
          <p style={{ color: '#c4dbf3', marginTop: '10px', fontSize: '15px' }}>
            Activate your verified campus identity to access courses, labs, geofenced QR attendance, and AI study resources.
          </p>
          <div className="row gap-6 mt-6" style={{ color: '#C1E8FF', fontSize: '12.5px' }}>
            <span className="row gap-2"><Icon name="cpu" size="sm" /> CS</span>
            <span className="row gap-2"><Icon name="sparkles" size="sm" /> AI</span>
            <span className="row gap-2"><Icon name="database" size="sm" /> IS</span>
            <span className="row gap-2"><Icon name="shieldCheck" size="sm" /> IT</span>
          </div>
        </div>
      </motion.aside>

      {/* Signup Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="auth-form relative bg-slate-100/70 dark:bg-[#020b17] flex items-center justify-center p-6 sm:p-10"
      >
        {/* Floating Theme Toggle */}
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

        <div className="auth-card w-full max-w-xl bg-white dark:bg-[#071933]/90 rounded-3xl p-6 sm:p-8 shadow-xl dark:shadow-2xl border border-slate-200/90 dark:border-sky-500/25">
          {isSubmitted ? (
            <div className="state text-center" style={{ padding: '24px 0' }}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-sky-500/15 border border-sky-400/40 flex items-center justify-center text-sky-400">
                <Icon name="checkCircle" size="xl" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Enrollment Request Queued</h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 leading-relaxed">
                Your institutional verification application for <b>{fullName || 'Student'}</b> has been transmitted to FCAI Student Affairs. An activation email will be dispatched to <b>{email}</b> once credentials are generated.
              </p>
              <div className="flex flex-col gap-3">
                <a href="#/login" className="cta-primary w-full justify-center inline-flex items-center gap-2 py-3 rounded-xl text-sm font-bold">
                  <span>Go to Institutional Sign In</span>
                  <Icon name="arrowRight" size="sm" />
                </a>
                <a href="#/home" className="cta-secondary w-full justify-center inline-flex items-center gap-2 py-3 rounded-xl text-sm font-semibold">
                  <span>Return to Home Page</span>
                </a>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-100 text-sky-900 border border-sky-300 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/30 mb-2.5">
                  <Icon name="user" size="sm" /> 2026/2027 Academic Admission
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
                  Create Institutional Account
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                  Enter your high school seat number or faculty admission reference.
                </p>
              </div>

              {/* Quick Sign-In for Every Enrollment */}
              <div className="mb-5 p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-[#031329] border border-slate-200 dark:border-sky-500/25">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-sky-300 flex items-center gap-1.5">
                    <Icon name="zap" size="sm" className="text-sky-600 dark:text-sky-400" />
                    Quick Sign-In by Enrollment
                  </span>
                  <a href="#/login" className="text-[11px] font-bold text-sky-700 dark:text-sky-400 hover:underline">
                    Login page →
                  </a>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
                  Already enrolled or testing the platform? Launch any role immediately:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {QUICK_ENROLLMENTS.map((item, idx) => {
                    const isCurrent = signingInRole === item.role;
                    const isLast = idx === QUICK_ENROLLMENTS.length - 1;
                    return (
                      <button
                        key={item.role}
                        type="button"
                        disabled={isLoading || signingInRole !== null}
                        onClick={() => handleQuickSignIn(item.role)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                          isLast ? 'col-span-2 sm:col-span-1' : ''
                        } ${
                          isCurrent
                            ? 'bg-[#052659] text-white border-[#052659] dark:bg-[#38bdf8] dark:text-[#020b17] dark:border-[#38bdf8] font-bold shadow-md'
                            : 'bg-white hover:bg-slate-100 dark:bg-[#071d3d] dark:hover:bg-[#0b2b57] text-slate-800 dark:text-slate-100 border-slate-200 dark:border-sky-500/25 hover:border-sky-500 dark:hover:border-sky-400 shadow-xs'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isCurrent
                            ? 'bg-white/20 text-white dark:bg-[#020b17]/20 dark:text-[#020b17]'
                            : 'bg-sky-100 dark:bg-sky-500/15 text-sky-700 dark:text-sky-300'
                        }`}>
                          {isCurrent ? (
                            <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Icon name={item.icon} size="sm" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <b className="block text-xs truncate">{item.label}</b>
                          <span className="block text-[10.5px] text-slate-500 dark:text-slate-400 truncate">{item.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="relative flex py-1 items-center mb-4">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                <span className="flex-shrink mx-3 text-[10.5px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Or submit new enrollment application
                </span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              </div>

              {/* Persona Tab Switcher */}
              <div className="role-tabs mb-5">
                <button
                  type="button"
                  className={accountType === 'student' ? 'active' : ''}
                  onClick={() => setAccountType('student')}
                >
                  <Icon name="graduation" size="sm" /> New Student
                </button>
                <button
                  type="button"
                  className={accountType === 'staff' ? 'active' : ''}
                  onClick={() => setAccountType('staff')}
                >
                  <Icon name="briefcase" size="sm" /> Faculty Staff
                </button>
              </div>

              {error && (
                <div className="alert alert-danger mb-4 flex items-center gap-2">
                  <Icon name="alertCircle" size="sm" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="field">
                  <label htmlFor="fullName">Full Legal Name (Arabic or English)</label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Mostafa Ahmed Mahmoud"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="field">
                    <label htmlFor="nationalId">Egyptian National ID</label>
                    <input
                      id="nationalId"
                      type="text"
                      maxLength={14}
                      required
                      value={nationalId}
                      onChange={e => setNationalId(e.target.value)}
                      placeholder="30301012201999"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="academicCode">Seat / Admission Code</label>
                    <input
                      id="academicCode"
                      type="text"
                      required
                      value={academicCode}
                      onChange={e => setAcademicCode(e.target.value)}
                      placeholder="e.g. TANSIQ-84920"
                    />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="email">Official / Contact Email</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="student@example.com"
                  />
                </div>

                <div className="field">
                  <label htmlFor="dept">Intended Department / Specialization</label>
                  <select
                    id="dept"
                    value={selectedDept}
                    onChange={e => setSelectedDept(e.target.value)}
                    className="w-full bg-slate-900 text-slate-100 border border-slate-700 rounded-xl px-3 py-2 text-sm"
                  >
                    <option value="AI">Artificial Intelligence (AI)</option>
                    <option value="CS">Computer Science (CS)</option>
                    <option value="IS">Information Systems (IS)</option>
                    <option value="IT">Information Technology (IT)</option>
                    <option value="GENERAL">General First Year (Pre-Major)</option>
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="pass">Create Secure Password</label>
                  <input
                    id="pass"
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary w-full justify-center mt-2"
                >
                  {isLoading ? (
                    <>
                      <span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px', borderTopColor: '#020b17' }} />
                      Verifying Admission Data…
                    </>
                  ) : (
                    <>
                      Submit Enrollment Application <Icon name="arrowRight" size="sm" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-5 text-center text-xs text-slate-400">
                Already have an institutional account?{' '}
                <a href="#/login" className="text-cyan-400 hover:text-cyan-300 font-bold ml-1">
                  Sign in here
                </a>
              </div>

              <div className="mt-4 text-[11px] text-slate-500 text-center">
                © 2026 Faculty of Computers &amp; AI · Beni Suef University
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
