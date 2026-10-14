import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Icon, FCAILogo } from '../../components/icons/Icon';
import { EducationHeroIllustration } from '../../components/auth/EducationHeroIllustration';
import type { Role } from '../../types';

export const Login: React.FC<{ onLoginSuccess?: () => void }> = ({ onLoginSuccess }) => {
  const { switchRole, theme, toggleTheme } = useAuth();
  const [isStaff, setIsStaff] = useState(false);

  const [nationalId, setNationalId] = useState('30302152201234');
  const [studentCode, setStudentCode] = useState('2021170045');
  const [email, setEmail] = useState('mona.abdelrahman@fcai.bsu.edu.eg');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const targetRole: Role = isStaff ? 'doctor' : 'student';
      await switchRole(targetRole);
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        window.location.hash = `#/${targetRole}/dashboard`;
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth">
      {/* Brand panel with palette pill stack & shine */}
      <aside className="auth-art" aria-hidden="false">
        <div className="row" style={{ position: 'relative', zIndex: 2 }}>
          <FCAILogo size={46} />
          <div>
            <b style={{ fontSize: '16px', display: 'block', color: '#ffffff' }}>
              FCAI · Beni Suef University
            </b>
            <span style={{ fontSize: '12.5px', color: '#f8f8f8', fontWeight: 500 }}>
              Faculty of Computers &amp; Artificial Intelligence
            </span>
          </div>
        </div>

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
      </aside>

      {/* Login form */}
      <div className="auth-form relative">
        {/* Floating Theme Mode Toggle */}
        <div className="absolute top-5 right-5 z-20">
          <button
            type="button"
            className="icon-btn theme-toggle-btn shadow-xs bg-white/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 backdrop-blur-md rounded-xl"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size="md" />
          </button>
        </div>

        <div className="auth-card">

          <div style={{ marginBottom: '26px' }}>
            <span className="badge b-info no-dot mb-4">
              <Icon name="lock" size="sm" /> Institutional Single Sign-On
            </span>
            <h1 style={{ fontSize: '28px', fontWeight: 750, letterSpacing: '-.02em', marginTop: '14px' }}>
              Welcome back
            </h1>
            <p className="muted mt-2">
              Sign in to the FCAI BSU Platform with credentials provided by the College Administration.
            </p>
          </div>

          {/* Account type switch */}
          <div className="role-tabs mb-6" role="tablist" aria-label="Account type">
            <button
              type="button"
              className={!isStaff ? 'active' : ''}
              onClick={() => { setIsStaff(false); setError(null); }}
            >
              <Icon name="graduation" size="sm" /> Student
            </button>
            <button
              type="button"
              className={isStaff ? 'active' : ''}
              onClick={() => { setIsStaff(true); setError(null); }}
            >
              <Icon name="briefcase" size="sm" /> Faculty &amp; Staff
            </button>
          </div>

          {error && (
            <div className="alert alert-danger mb-4">
              <Icon name="alertCircle" />
              <div>
                <b>We couldn't sign you in</b>
                <p>{error}</p>
              </div>
            </div>
          )}

          <form className="col gap-4" onSubmit={handleSubmit}>
            {!isStaff ? (
              <>
                <div className="field">
                  <label className="label">National ID (14 Digits)</label>
                  <div className="input-group">
                    <span className="lead"><Icon name="idCard" size="sm" /></span>
                    <input
                      className="input"
                      type="text"
                      maxLength={14}
                      value={nationalId}
                      onChange={e => setNationalId(e.target.value)}
                      placeholder="Enter 14-digit National ID"
                      required
                    />
                  </div>
                  <span className="hint">Enter the 14 digits exactly as on your Egyptian National ID card.</span>
                </div>

                <div className="field">
                  <label className="label">Student Code</label>
                  <div className="input-group">
                    <span className="lead"><Icon name="hash" size="sm" /></span>
                    <input
                      className="input"
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
              <div className="field">
                <label className="label">Institutional Email</label>
                <div className="input-group">
                  <span className="lead"><Icon name="mail" size="sm" /></span>
                  <input
                    className="input"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@fcai.bsu.edu.eg"
                    required
                  />
                </div>
                <span className="hint">Must end with @fcai.bsu.edu.eg</span>
              </div>
            )}

            <div className="field">
              <div className="row-between">
                <label className="label">Password</label>
                <a href="#/forgot-password" className="text-sm fw-6" style={{ color: 'var(--navy-800)' }}>
                  Forgot password?
                </a>
              </div>
              <div className="input-group">
                <span className="lead"><Icon name="lock" size="sm" /></span>
                <input
                  className="input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="icon-btn trail"
                  onClick={() => setShowPassword(p => !p)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{ width: '34px', height: '34px' }}
                >
                  <Icon name={showPassword ? 'eyeOff' : 'eye'} size="sm" />
                </button>
              </div>
            </div>

            <label className="check">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
              />
              Keep me signed in on this device for 7 days
            </label>

            <button className="btn btn-primary btn-lg btn-block mt-2" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px', borderTopColor: '#fff' }} />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in to Platform <Icon name="arrowRight" size="sm" />
                </>
              )}
            </button>
          </form>

          <div className="alert alert-info mt-6">
            <Icon name="info" />
            <div>
              <b>No account yet?</b>
              <p>Accounts are issued strictly by the College Administration. Public self-registration is disabled.</p>
            </div>
          </div>

          <div className="mt-6 text-xs faint center">
            Demo quick routes: <a href="#/first-login">First login (temp password)</a> · <a href="#/screens">All 60+ screens catalog</a>
          </div>

          <p className="text-xs faint center mt-4">
            © 2026 Faculty of Computers &amp; AI · Beni Suef University
          </p>
        </div>
      </div>
    </div>
  );
};
