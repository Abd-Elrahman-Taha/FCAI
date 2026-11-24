/**
 * Screen 5: Account & Credentials Security
 *
 * Connected strictly to confirmed backend endpoints:
 * - GET  /api/auth/me
 * - POST /api/auth/change-password
 * - POST /api/auth/logout
 * - POST /api/auth/logout-all
 */

import React, { useEffect, useState } from 'react';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';
import { ApiError } from '../../services/api';

export const AccountSecurity: React.FC = () => {
  const {
    role,
    backendRole,
    currentUser,
    profile,
    expiresAt,
    refreshProfile,
    completePasswordChange,
    logout,
    logoutAll,
    showToast,
  } = useAuth();

  const [loading, setLoading] = useState<boolean>(!profile);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [submittingPw, setSubmittingPw] = useState(false);
  const [pwError, setPwError] = useState<ApiError | null>(null);
  const [pwClientError, setPwClientError] = useState<string | null>(null);
  const [revokingAll, setRevokingAll] = useState(false);

  const loadMe = async () => {
    setLoading(true);
    setProfileError(null);
    try {
      const data = await refreshProfile();
      if (!data) {
        setProfileError('Could not load your authenticated account profile from /api/auth/me.');
      }
    } catch (err: unknown) {
      setProfileError(err instanceof Error ? err.message : 'Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    refreshProfile()
      .then(data => {
        if (cancelled) return;
        if (!data) {
          setProfileError('Could not load your authenticated account profile from /api/auth/me.');
        } else {
          setProfileError(null);
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setProfileError(err instanceof Error ? err.message : 'Failed to load profile.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshProfile]);

  const fieldErrors = (field: string): string[] => pwError?.getFieldErrors(field) ?? [];

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);
    setPwClientError(null);

    if (newPassword !== confirmNewPassword) {
      setPwClientError('New password and confirmation do not match.');
      return;
    }

    setSubmittingPw(true);
    try {
      const msg = await completePasswordChange({
        currentPassword,
        newPassword,
        confirmNewPassword,
      });
      showToast('Password Updated', msg, 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setPwError(err);
      } else {
        setPwClientError(err instanceof Error ? err.message : 'Failed to change password.');
      }
    } finally {
      setSubmittingPw(false);
    }
  };

  const handleLogoutAll = async () => {
    setRevokingAll(true);
    try {
      await logoutAll();
    } catch (err: unknown) {
      showToast(
        'Session Revocation Error',
        err instanceof Error ? err.message : 'Failed to revoke all sessions.',
        'error'
      );
      setRevokingAll(false);
    }
  };

  if (loading && !profile) return <CardSkeleton count={3} />;

  const pwBannerError = pwClientError || pwError?.message || null;

  return (
    <div>
      <PageHead
        title="Account &amp; Credentials Security"
        subtitle="Manage your verified institutional profile, update your password, and revoke active sessions"
        breadcrumbs={[
          { label: 'Dashboard', href: `#/${role}/dashboard` },
          { label: 'Account Security' }
        ]}
        actions={
          <button type="button" className="btn btn-secondary btn-sm" onClick={loadMe} disabled={loading}>
            <Icon name="refresh" size="sm" /> {loading ? 'Refreshing…' : 'Refresh Profile'}
          </button>
        }
      />

      {profileError && (
        <div className="alert alert-danger mb-5" role="alert">
          <Icon name="alertCircle" />
          <div>
            <b>Profile Load Error</b>
            <p>{profileError}</p>
          </div>
        </div>
      )}

      <div className="grid g-2 mb-6">
        {/* Authenticated Profile from GET /api/auth/me */}
        <div className="card p-5">
          <div className="card-head">
            <h3>Authenticated Identity</h3>
            <span className={`badge ${profile?.isActive === false ? 'badge-danger' : 'badge-success'}`}>
              {profile?.isActive === false ? 'Inactive' : 'Active'}
            </span>
          </div>
          <div className="stack gap-3 text-sm mt-3">
            <div className="row-between pb-2 border-b">
              <span className="sub">Full Name (English):</span>
              <strong>{profile?.fullNameEn || currentUser?.name || '—'}</strong>
            </div>
            <div className="row-between pb-2 border-b">
              <span className="sub">Full Name (Arabic):</span>
              <strong>{profile?.fullNameAr || '—'}</strong>
            </div>
            <div className="row-between pb-2 border-b">
              <span className="sub">Username:</span>
              <code>{profile?.username || '—'}</code>
            </div>
            <div className="row-between pb-2 border-b">
              <span className="sub">Email:</span>
              <strong>{profile?.email || currentUser?.email || '—'}</strong>
            </div>
            <div className="row-between pb-2 border-b">
              <span className="sub">Phone Number:</span>
              <span>{profile?.phoneNumber || '—'}</span>
            </div>
            <div className="row-between pb-2 border-b">
              <span className="sub">Assigned Role:</span>
              <span className="badge badge-primary no-dot">{profile?.role || backendRole || '—'}</span>
            </div>
            <div className="row-between pb-2 border-b">
              <span className="sub">Last Login (UTC):</span>
              <span className="mono text-xs">{profile?.lastLoginAt ? new Date(profile.lastLoginAt).toUTCString() : '—'}</span>
            </div>
            <div className="row-between">
              <span className="sub">Access Token Expires (UTC):</span>
              <span className="mono text-xs">{expiresAt ? new Date(expiresAt).toUTCString() : '—'}</span>
            </div>
          </div>
        </div>

        {/* Change Password Form -> POST /api/auth/change-password */}
        <div className="card p-5">
          <div className="card-head">
            <h3>Change Password</h3>
            <span className="sub text-xs">POST /api/auth/change-password</span>
          </div>

          {pwBannerError && (
            <div className="alert alert-danger mt-3 mb-3" role="alert">
              <Icon name="alertCircle" size="sm" />
              <div>
                <b>Update Failed</b>
                <p>{pwBannerError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="mt-3" noValidate>
            <div className="form-group mb-3">
              <label className="form-label" htmlFor="sec-current-pw">Current Password</label>
              <input
                id="sec-current-pw"
                type="password"
                className="input"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              {fieldErrors('currentPassword').map((msg, i) => (
                <div key={i} className="text-xs text-red-600 dark:text-red-400 mt-1">{msg}</div>
              ))}
            </div>

            <div className="form-group mb-3">
              <label className="form-label" htmlFor="sec-new-pw">New Password</label>
              <input
                id="sec-new-pw"
                type="password"
                className="input"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Min 8 chars, uppercase, number, symbol"
                autoComplete="new-password"
                required
              />
              {fieldErrors('newPassword').map((msg, i) => (
                <div key={i} className="text-xs text-red-600 dark:text-red-400 mt-1">{msg}</div>
              ))}
            </div>

            <div className="form-group mb-4">
              <label className="form-label" htmlFor="sec-confirm-pw">Confirm New Password</label>
              <input
                id="sec-confirm-pw"
                type="password"
                className="input"
                value={confirmNewPassword}
                onChange={e => setConfirmNewPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              {fieldErrors('confirmNewPassword').map((msg, i) => (
                <div key={i} className="text-xs text-red-600 dark:text-red-400 mt-1">{msg}</div>
              ))}
            </div>

            <div className="row-end gap-2">
              <button type="submit" className="btn btn-primary" disabled={submittingPw}>
                <Icon name="checkCircle" size="sm" />
                {submittingPw ? 'Updating…' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Session Controls -> POST /api/auth/logout & POST /api/auth/logout-all */}
      <div className="card p-5">
        <div className="row-between wrap gap-3">
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Session Revocation Controls</h3>
            <p className="sub text-xs mt-1">
              Sign out from this browser tab or revoke all active refresh tokens across all devices.
            </p>
          </div>
          <div className="row gap-2 wrap">
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => logout()}>
              <Icon name="logout" size="sm" /> Sign Out Current Device
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={handleLogoutAll}
              disabled={revokingAll}
            >
              <Icon name="shield" size="sm" />
              {revokingAll ? 'Revoking Sessions…' : 'Sign Out From All Devices'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
