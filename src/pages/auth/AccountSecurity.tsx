import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

export const AccountSecurity: React.FC = () => {
  const { showToast, logout } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  useEffect(() => {
    fakeApi.getAccountSecurity().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) return <CardSkeleton count={4} />;

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) {
      showToast('New passwords do not match!', 'error');
      return;
    }
    if (newPw.length < 8) {
      showToast('Password must be at least 8 characters.', 'error');
      return;
    }
    await fakeApi.changeAccountPassword(currentPw, newPw);
    showToast('Account password changed successfully.', 'success');
    setCurrentPw('');
    setNewPw('');
    setConfirmPw('');
  };

  return (
    <div>
      <PageHead
        title="Screen 5: Account &amp; Credentials Security"
        subtitle="Manage institutional account identity, password rotation, and active device sessions"
        breadcrumbs={[
          { label: 'Overview', href: '#/student/dashboard' },
          { label: 'Account Security' }
        ]}
      />

      <div className="grid g-2 mb-6">
        {/* Account Identity Info */}
        <div className="card p-5">
          <div className="card-head">
            <h3>Institutional Identity</h3>
            <span className="badge badge-success">{data.status}</span>
          </div>
          <div className="stack gap-3 text-sm">
            <div className="row-between pb-2 border-b">
              <span className="sub">Account Identifier:</span>
              <strong>{data.identifier}</strong>
            </div>
            <div className="row-between pb-2 border-b">
              <span className="sub">Username / Student Code:</span>
              <code>{data.username}</code>
            </div>
            <div className="row-between pb-2 border-b">
              <span className="sub">National ID:</span>
              <code>{data.nationalId}</code>
            </div>
            <div className="row-between pb-2 border-b">
              <span className="sub">Last Password Rotation:</span>
              <span>{data.lastPasswordChange}</span>
            </div>
            <div className="row-between">
              <span className="sub">Session Policy:</span>
              <span className="badge badge-primary">{data.twoFactorStatus}</span>
            </div>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="card p-5">
          <div className="card-head">
            <h3>Update Password</h3>
            <span className="sub text-xs">Faculty credential policy</span>
          </div>
          <form onSubmit={handlePasswordChange}>
            <div className="form-group mb-3">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="input"
                value={currentPw}
                onChange={e => setCurrentPw(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="input"
                value={newPw}
                onChange={e => setNewPw(e.target.value)}
                placeholder="Min 8 chars, 1 uppercase, 1 symbol"
                required
              />
            </div>
            <div className="form-group mb-4">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="input"
                value={confirmPw}
                onChange={e => setConfirmPw(e.target.value)}
                required
              />
            </div>
            <div className="row-end gap-2">
              <button type="submit" className="btn btn-primary">
                <Icon name="checkCircle" /> Update Credentials
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Active Sessions & Sign Out */}
      <div className="card p-5">
        <div className="row-between mb-4">
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Active Device Sessions</h3>
            <p className="sub text-xs">Devices authenticated to your FCAI BSU account</p>
          </div>
          <button className="btn btn-danger btn-sm" onClick={logout}>
            <Icon name="logout" /> Sign Out From All Devices
          </button>
        </div>
        <div className="stack gap-3">
          {data.activeSessions.map((s: any, idx: number) => (
            <div key={idx} className="card p-3 row-between" style={{ background: 'var(--color-bg-page)' }}>
              <div>
                <strong>{s.device}</strong>
                <div className="sub text-xs">IP Address: {s.ip}</div>
              </div>
              <span className="badge badge-neutral">{s.lastActive}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
