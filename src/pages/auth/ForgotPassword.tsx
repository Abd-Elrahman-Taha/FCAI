/**
 * Screen 3: Forgot Password
 *
 * Connected strictly to POST /api/auth/forgot-password.
 * Handles backend response honestly:
 * - Never fabricates a reset token.
 * - Never falsely claims an email was delivered when resetToken is null or email delivery is unconfigured.
 * - Preserves and displays the exact backend message and validation errors.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { api, ApiError } from '../../services/api';
import { Icon, FCAILogo } from '../../components/icons/Icon';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [returnedResetToken, setReturnedResetToken] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<ApiError | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);

  const fieldErrors = (field: string): string[] => apiError?.getFieldErrors(field) ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setClientError(null);

    if (!email.trim() || !email.includes('@')) {
      setClientError('Please enter a valid institutional email address.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.auth.forgotPassword({ email: email.trim() });
      const msg =
        res.data?.message ||
        res.envelopeMessage ||
        'Your password reset request was received by the server.';
      setResponseMessage(msg);
      setReturnedResetToken(res.data?.resetToken ?? null);
      setIsSubmitted(true);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setApiError(err);
      } else {
        setClientError(err instanceof Error ? err.message : 'Unable to submit reset request.');
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
          <span className="hero-chip mb-4"><Icon name="shieldCheck" size="sm" /> Account Recovery</span>
          <h2 style={{ fontSize: '30px', fontWeight: 750, color: '#fff', marginTop: '12px' }}>Reset your institutional password</h2>
          <p style={{ color: '#c4dbf3', marginTop: '10px', fontSize: '15px' }}>
            Submit your registered institutional email address to initiate a backend password reset request.
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
          {isSubmitted ? (
            <div className="state" style={{ padding: 0 }}>
              <div className="state-art info"><Icon name="mail" size="xl" /></div>
              <h3 style={{ fontSize: '22px' }}>Reset Request Processed</h3>
              <p>{responseMessage}</p>

              {returnedResetToken ? (
                <div className="info-tile w-full text-left mt-3">
                  <small className="fw-6">Reset Token Returned by Server:</small>
                  <code className="block mt-1 break-all text-xs">{returnedResetToken}</code>
                  <a
                    href={`#/reset-password?email=${encodeURIComponent(email.trim())}&token=${encodeURIComponent(returnedResetToken)}`}
                    className="btn btn-primary btn-sm mt-3"
                  >
                    Continue to Verify &amp; Reset Password
                  </a>
                </div>
              ) : (
                <div className="alert alert-info mt-3 text-left w-full">
                  <Icon name="info" size="sm" />
                  <div>
                    <b>No Reset Token Returned</b>
                    <p className="text-xs mt-1">
                      If email delivery is not configured yet on the backend server, please contact FCAI IT Administration to obtain a verified reset token, or enter your token on the Reset Password screen once received.
                    </p>
                  </div>
                </div>
              )}

              <div className="row gap-2 mt-4">
                <a href="#/reset-password" className="btn btn-primary btn-sm">Enter Reset Token</a>
                <a href="#/login" className="btn btn-secondary btn-sm">Return to Sign In</a>
              </div>
            </div>
          ) : (
            <>
              <a href="#/login" className="card-link mb-4 inline-flex"><Icon name="arrowLeft" size="sm" /> Back to sign in</a>
              <h1 style={{ fontSize: '26px', fontWeight: 750, letterSpacing: '-.02em', marginTop: '8px' }}>Forgot password?</h1>
              <p className="muted mt-2 mb-6">Enter your registered institutional email address.</p>

              {bannerError && (
                <div className="alert alert-danger mb-4" role="alert">
                  <Icon name="alertCircle" />
                  <div><b>Request Failed</b><p>{bannerError}</p></div>
                </div>
              )}

              <form className="col gap-4" onSubmit={handleSubmit} noValidate>
                <div className="field">
                  <label className="label" htmlFor="fp-email">Institutional Email</label>
                  <div className="input-group">
                    <span className="lead"><Icon name="mail" size="sm" /></span>
                    <input
                      id="fp-email"
                      className="input"
                      type="email"
                      placeholder="name@fcai.bsu"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>
                  {fieldErrors('email').map((msg, i) => (
                    <span key={i} className="text-xs text-red-600 dark:text-red-400">{msg}</span>
                  ))}
                </div>

                <button className="btn btn-primary btn-lg btn-block mt-2" type="submit" disabled={isLoading}>
                  {isLoading ? 'Submitting Request…' : 'Request Password Reset'}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
