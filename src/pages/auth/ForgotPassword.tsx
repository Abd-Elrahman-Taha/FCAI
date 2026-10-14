import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon, FCAILogo } from '../../components/icons/Icon';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.endsWith('@fcai.bsu.edu.eg') && !email.includes('@')) {
      setError('Please provide a valid university institutional email.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 400);
  };

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
            We'll send an official recovery link to your registered university email inbox.
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
              <div className="state-art success"><Icon name="mail" size="xl" /></div>
              <h3 style={{ fontSize: '22px' }}>Reset Link Dispatched</h3>
              <p>
                An authenticated password recovery email has been sent to <b>{email}</b>. Please check your inbox and click the link within 30 minutes.
              </p>
              <a href="#/login" className="btn btn-secondary mt-4">Return to Sign In</a>
            </div>
          ) : (
            <>
              <a href="#/login" className="card-link mb-4 inline-flex"><Icon name="arrowLeft" size="sm" /> Back to sign in</a>
              <h1 style={{ fontSize: '26px', fontWeight: 750, letterSpacing: '-.02em', marginTop: '8px' }}>Forgot password?</h1>
              <p className="muted mt-2 mb-6">Enter your institutional FCAI BSU email address associated with your student or staff profile.</p>

              {error && (
                <div className="alert alert-danger mb-4">
                  <Icon name="alertCircle" />
                  <div><b>Invalid email</b><p>{error}</p></div>
                </div>
              )}

              <form className="col gap-4" onSubmit={handleSubmit}>
                <div className="field">
                  <label className="label">Institutional Email</label>
                  <div className="input-group">
                    <span className="lead"><Icon name="mail" size="sm" /></span>
                    <input
                      className="input"
                      type="email"
                      placeholder="name@fcai.bsu.edu.eg"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button className="btn btn-primary btn-lg btn-block mt-2" type="submit" disabled={isLoading}>
                  {isLoading ? 'Sending Link…' : 'Send Reset Link'}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
