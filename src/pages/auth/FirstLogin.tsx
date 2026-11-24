/**
 * Screen 2: Mandatory First-Login Change Password
 *
 * Connected strictly to POST /api/auth/change-password.
 * Enforced whenever POST /api/auth/login returns `requiresPasswordChange: true`.
 * Users cannot access any dashboard or protected page until password change succeeds.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { ApiError } from '../../services/api';
import { Icon, FCAILogo } from '../../components/icons/Icon';

export const FirstLogin: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const { role, currentUser, completePasswordChange, logout, showToast } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<ApiError | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);

  const rules = [
    { label: 'At least 8 characters', valid: newPassword.length >= 8 },
    { label: 'One uppercase letter', valid: /[A-Z]/.test(newPassword) },
    { label: 'One number', valid: /[0-9]/.test(newPassword) },
    { label: 'One special character (!@#$%^&*)', valid: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) },
    { label: 'Passwords match', valid: newPassword !== '' && newPassword === confirmNewPassword }
  ];

  const allValid = rules.every(r => r.valid) && currentPassword.length > 0;
  const fieldErrors = (field: string): string[] => apiError?.getFieldErrors(field) ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setClientError(null);

    if (!currentPassword) {
      setClientError('Please enter your current password.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setClientError('New password and confirmation do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const message = await completePasswordChange({
        currentPassword,
        newPassword,
        confirmNewPassword,
      });
      setIsSuccess(true);
      showToast('Password Updated', message, 'success');
      setTimeout(() => {
        if (onComplete) {
          onComplete();
        } else {
          window.location.hash = `#/${role}/dashboard`;
        }
      }, 1200);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setApiError(err);
      } else {
        setClientError(err instanceof Error ? err.message : 'Failed to update password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const bannerError = clientError || apiError?.message || null;

  return (
    <div className="auth min-h-screen bg-slate-100 dark:bg-[#020b17] text-slate-800 dark:text-slate-100">
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
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '440px' }}>
          <span className="hero-chip mb-4">
            <Icon name="key" size="sm" /> Mandatory Security Initialization
          </span>
          <h2 style={{ fontSize: '30px', fontWeight: 750, color: '#fff', marginTop: '12px' }}>
            Secure your institutional account.
          </h2>
          <p style={{ color: '#c4dbf3', marginTop: '10px', fontSize: '15px' }}>
            Your account requires a password change before you can access your portal dashboard or academic services.
          </p>
        </div>
      </motion.aside>

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="auth-form relative bg-slate-100/70 dark:bg-[#020b17] flex items-center justify-center p-6 sm:p-10"
      >
        <div className="auth-card bg-white dark:bg-[#071933]/90 rounded-3xl p-7 sm:p-9 shadow-xl dark:shadow-2xl border border-slate-200/90 dark:border-sky-500/25">
          {isSuccess ? (
            <div className="state" style={{ padding: 0 }}>
              <div className="state-art success">
                <Icon name="shieldCheck" size="xl" />
              </div>
              <h3 style={{ fontSize: '22px' }}>Password Successfully Updated</h3>
              <p>
                Your credentials are now secured. Redirecting you to your {currentUser?.roleLabel || 'Portal'} Dashboard…
              </p>
              <div className="spinner mt-3" />
            </div>
          ) : (
            <>
              <div className="row-between mb-3">
                <span className="badge b-warning">Password Change Required</span>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => logout()}>
                  <Icon name="logout" size="sm" /> Sign Out
                </button>
              </div>
              <h1 style={{ fontSize: '26px', fontWeight: 750, letterSpacing: '-.02em', marginTop: '8px' }}>
                Change your temporary password
              </h1>
              <p className="muted mt-2 mb-6">
                Signed in as <b>{currentUser?.name || currentUser?.email}</b>. Choose a strong personal password to unlock your portal.
              </p>

              {bannerError && (
                <div className="alert alert-danger mb-4" role="alert">
                  <Icon name="alertCircle" />
                  <div>
                    <b>Unable to update password</b>
                    <p>{bannerError}</p>
                  </div>
                </div>
              )}

              <form className="col gap-4" onSubmit={handleSubmit} noValidate>
                <div className="field">
                  <label className="label" htmlFor="fl-current-password">Current Password</label>
                  <input
                    id="fl-current-password"
                    className="input"
                    type="password"
                    placeholder="Enter current temporary password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  {fieldErrors('currentPassword').map((msg, i) => (
                    <span key={i} className="text-xs text-red-600 dark:text-red-400">{msg}</span>
                  ))}
                </div>

                <div className="field">
                  <label className="label" htmlFor="fl-new-password">New Password</label>
                  <input
                    id="fl-new-password"
                    className="input"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  {fieldErrors('newPassword').map((msg, i) => (
                    <span key={i} className="text-xs text-red-600 dark:text-red-400">{msg}</span>
                  ))}
                </div>

                <div className="field">
                  <label className="label" htmlFor="fl-confirm-password">Confirm New Password</label>
                  <input
                    id="fl-confirm-password"
                    className="input"
                    type="password"
                    placeholder="Re-type new password"
                    value={confirmNewPassword}
                    onChange={e => setConfirmNewPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  {fieldErrors('confirmNewPassword').map((msg, i) => (
                    <span key={i} className="text-xs text-red-600 dark:text-red-400">{msg}</span>
                  ))}
                </div>

                <div className="info-tile">
                  <small className="fw-6" style={{ color: 'var(--text)' }}>Password Security Requirements:</small>
                  <div className="pw-rules mt-2">
                    {rules.map((rule, idx) => (
                      <div key={idx} className={rule.valid ? 'ok' : ''}>
                        <Icon name={rule.valid ? 'checkCircle' : 'alertCircle'} size="sm" />
                        {rule.label}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  className="btn btn-primary btn-lg btn-block mt-2"
                  type="submit"
                  disabled={isLoading || !allValid}
                >
                  {isLoading ? 'Updating Password…' : 'Save New Password & Continue'}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
