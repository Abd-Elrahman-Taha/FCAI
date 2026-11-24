/**
 * Screen 4: Verify Reset Token & Reset Password
 *
 * Connected strictly to confirmed Swagger endpoints:
 * - Step 1: POST /api/auth/verify-reset-token ({ email, token })
 * - Step 2: POST /api/auth/reset-password ({ email, token, newPassword, confirmNewPassword })
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api, ApiError } from '../../services/api';
import { Icon, FCAILogo } from '../../components/icons/Icon';

function extractResetParams(): { email: string; token: string } {
  const hashQueryIndex = window.location.hash.indexOf('?');
  const rawQuery =
    hashQueryIndex >= 0
      ? window.location.hash.slice(hashQueryIndex + 1)
      : window.location.search.replace(/^\?/, '');
  const params = new URLSearchParams(rawQuery);
  return {
    email: params.get('email') || '',
    token: params.get('token') || '',
  };
}

export const ResetPassword: React.FC = () => {
  const initialParams = extractResetParams();

  const [email, setEmail] = useState(initialParams.email);
  const [token, setToken] = useState(initialParams.token);
  const [tokenVerified, setTokenVerified] = useState(false);
  const [verifyingToken, setVerifyingToken] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
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

  const allValid = rules.every(r => r.valid);
  const fieldErrors = (field: string): string[] => apiError?.getFieldErrors(field) ?? [];

  const handleVerifyToken = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setApiError(null);
    setClientError(null);
    setVerifyMessage(null);

    if (!email.trim() || !token.trim()) {
      setClientError('Please provide both your email address and reset token.');
      return;
    }

    setVerifyingToken(true);
    try {
      const msg = await api.auth.verifyResetToken({
        email: email.trim(),
        token: token.trim(),
      });
      setTokenVerified(true);
      setVerifyMessage(msg);
    } catch (err: unknown) {
      setTokenVerified(false);
      if (err instanceof ApiError) {
        setApiError(err);
      } else {
        setClientError(err instanceof Error ? err.message : 'Failed to verify reset token.');
      }
    } finally {
      setVerifyingToken(false);
    }
  };

  // Auto-verify if both email and token were provided via query parameters
  useEffect(() => {
    const autoEmail = initialParams.email.trim();
    const autoToken = initialParams.token.trim();
    if (!autoEmail || !autoToken) return;

    let cancelled = false;
    api.auth
      .verifyResetToken({ email: autoEmail, token: autoToken })
      .then(msg => {
        if (cancelled) return;
        setTokenVerified(true);
        setVerifyMessage(msg);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setTokenVerified(false);
        if (err instanceof ApiError) {
          setApiError(err);
        } else {
          setClientError(err instanceof Error ? err.message : 'Failed to verify reset token.');
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setClientError(null);

    if (!tokenVerified) {
      setClientError('Please verify your reset token first.');
      return;
    }
    if (!allValid) {
      setClientError('Please satisfy all password requirements.');
      return;
    }

    setIsLoading(true);
    try {
      const msg = await api.auth.resetPassword({
        email: email.trim(),
        token: token.trim(),
        newPassword,
        confirmNewPassword,
      });
      setSuccessMessage(msg);
      setIsSuccess(true);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setApiError(err);
      } else {
        setClientError(err instanceof Error ? err.message : 'Failed to reset password.');
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
            <b style={{ fontSize: '16px', display: 'block', color: '#ffffff' }}>FCAI · Beni Suef University</b>
            <span style={{ fontSize: '12.5px', color: '#c4dbf3', fontWeight: 500 }}>Faculty of Computers &amp; AI</span>
          </div>
        </a>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '440px' }}>
          <span className="hero-chip mb-4"><Icon name="key" size="sm" /> Password Reset</span>
          <h2 style={{ fontSize: '30px', fontWeight: 750, color: '#fff', marginTop: '12px' }}>Verify token &amp; choose a new password</h2>
          <p style={{ color: '#c4dbf3', marginTop: '10px', fontSize: '15px' }}>
            Verify your reset token first, then set a secure new password for your FCAI BSU institutional profile.
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
              <div className="state-art success"><Icon name="checkCircle" size="xl" /></div>
              <h3 style={{ fontSize: '22px' }}>Password Reset Complete</h3>
              <p>{successMessage || 'You can now sign in with your new institutional password.'}</p>
              <a href="#/login" className="btn btn-primary mt-4">Sign In Now</a>
            </div>
          ) : (
            <>
              <a href="#/login" className="card-link mb-4 inline-flex"><Icon name="arrowLeft" size="sm" /> Back to sign in</a>
              <h1 style={{ fontSize: '26px', fontWeight: 750, letterSpacing: '-.02em', marginTop: '6px' }}>
                {tokenVerified ? 'Set new password' : 'Verify reset token'}
              </h1>
              <p className="muted mt-2 mb-5">
                {tokenVerified
                  ? 'Your reset token has been verified. Enter your new password below.'
                  : 'Enter your institutional email and the reset token to verify it with the server.'}
              </p>

              {bannerError && (
                <div className="alert alert-danger mb-4" role="alert">
                  <Icon name="alertCircle" />
                  <div><b>Error</b><p>{bannerError}</p></div>
                </div>
              )}

              {verifyMessage && tokenVerified && (
                <div className="alert alert-success mb-4">
                  <Icon name="checkCircle" />
                  <div><b>Token Verified</b><p>{verifyMessage}</p></div>
                </div>
              )}

              {!tokenVerified ? (
                <form className="col gap-4" onSubmit={handleVerifyToken} noValidate>
                  <div className="field">
                    <label className="label" htmlFor="rp-email">Institutional Email</label>
                    <input
                      id="rp-email"
                      className="input"
                      type="email"
                      placeholder="name@fcai.bsu"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                    {fieldErrors('email').map((msg, i) => (
                      <span key={i} className="text-xs text-red-600 dark:text-red-400">{msg}</span>
                    ))}
                  </div>

                  <div className="field">
                    <label className="label" htmlFor="rp-token">Reset Token</label>
                    <input
                      id="rp-token"
                      className="input"
                      type="text"
                      placeholder="Paste your reset token"
                      value={token}
                      onChange={e => setToken(e.target.value)}
                      required
                    />
                    {fieldErrors('token').map((msg, i) => (
                      <span key={i} className="text-xs text-red-600 dark:text-red-400">{msg}</span>
                    ))}
                  </div>

                  <button className="btn btn-primary btn-lg btn-block mt-2" type="submit" disabled={verifyingToken}>
                    {verifyingToken ? 'Verifying Token…' : 'Verify Reset Token'}
                  </button>
                </form>
              ) : (
                <form className="col gap-4" onSubmit={handleResetSubmit} noValidate>
                  <div className="field">
                    <label className="label" htmlFor="rp-new-pw">New Password</label>
                    <input
                      id="rp-new-pw"
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
                    <label className="label" htmlFor="rp-confirm-pw">Confirm New Password</label>
                    <input
                      id="rp-confirm-pw"
                      className="input"
                      type="password"
                      placeholder="Re-enter new password"
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
                    <small className="fw-6" style={{ color: 'var(--text)' }}>Password requirements:</small>
                    <div className="pw-rules mt-2">
                      {rules.map((rule, idx) => (
                        <div key={idx} className={rule.valid ? 'ok' : ''}>
                          <Icon name={rule.valid ? 'checkCircle' : 'alertCircle'} size="sm" />
                          {rule.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="btn btn-primary btn-lg btn-block mt-2" type="submit" disabled={isLoading || !allValid}>
                    {isLoading ? 'Resetting…' : 'Reset Password'}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
