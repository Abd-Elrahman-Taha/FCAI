import React, { useState } from 'react';
import { Icon, FCAILogo } from '../../components/icons/Icon';

export const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const rules = [
    { label: 'At least 8 characters', valid: newPassword.length >= 8 },
    { label: 'One uppercase letter', valid: /[A-Z]/.test(newPassword) },
    { label: 'One number', valid: /[0-9]/.test(newPassword) },
    { label: 'One special character (!@#$%^&*)', valid: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) },
    { label: 'Passwords match', valid: newPassword !== '' && newPassword === confirmPassword }
  ];

  const allValid = rules.every(r => r.valid);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allValid) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 400);
  };

  return (
    <div className="auth">
      <aside className="auth-art" aria-hidden="false">
        <div className="row" style={{ position: 'relative', zIndex: 2 }}>
          <FCAILogo size={46} />
          <div>
            <b style={{ fontSize: '16px', display: 'block', color: 'var(--text)' }}>FCAI · Beni Suef University</b>
            <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: 500 }}>Faculty of Computers &amp; AI</span>
          </div>
        </div>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '440px' }}>
          <span className="hero-chip mb-4"><Icon name="key" size="sm" /> Password Reset</span>
          <h2 style={{ fontSize: '30px', fontWeight: 750, color: '#fff', marginTop: '12px' }}>Choose a new password</h2>
          <p style={{ color: '#c4dbf3', marginTop: '10px', fontSize: '15px' }}>
            Set a secure new password for your FCAI BSU institutional profile.
          </p>
        </div>
      </aside>

      <div className="auth-form">
        <div className="auth-card">
          {isSuccess ? (
            <div className="state" style={{ padding: 0 }}>
              <div className="state-art success"><Icon name="checkCircle" size="xl" /></div>
              <h3 style={{ fontSize: '22px' }}>Password Successfully Reset</h3>
              <p>You can now sign in with your new institutional password.</p>
              <a href="#/login" className="btn btn-primary mt-4">Sign In Now</a>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: '26px', fontWeight: 750, letterSpacing: '-.02em' }}>Set new password</h1>
              <p className="muted mt-2 mb-6">Create a strong password that meets our faculty credential standards.</p>

              <form className="col gap-4" onSubmit={handleSubmit}>
                <div className="field">
                  <label className="label">New Password</label>
                  <input
                    className="input"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="field">
                  <label className="label">Confirm New Password</label>
                  <input
                    className="input"
                    type="password"
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                  />
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};
