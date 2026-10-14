import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

export const SuperAdminSecurityConfig: React.FC = () => {
  const { showToast } = useAuth();
  const [sec, setSec] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fakeApi.getSuperAdminSecurityConfig().then(res => {
      setSec(res);
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    setSaving(false);
    showToast('Institutional security & authentication policies persisted.', 'success');
  };

  if (loading || !sec) return <CardSkeleton count={4} />;

  return (
    <div>
      <PageHead
        title="Screen 104: Institutional Security, Auth & Session Policies"
        subtitle="Manage password complexity, session timeouts, brute force lockouts, and multi-factor enforcement"
        breadcrumbs={[
          { label: 'System Admin', href: '#/superadmin/system-config' },
          { label: 'Screen 104: Security Policies' }
        ]}
        actions={
          <div className="row gap-2">
            <a href="#/superadmin/integrations" className="btn btn-secondary">
              <Icon name="link" /> Gateway Integrations (Screen 105)
            </a>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              <Icon name="checkCircle" /> {saving ? 'Saving...' : 'Apply Security Rules'}
            </button>
          </div>
        }
      />

      <form onSubmit={handleSave} className="stack gap-4">
        {/* Password Complexity Matrix */}
        <div className="card p-4">
          <h3 className="mb-3">Password Complexity &amp; Hygiene Policies</h3>
          <div className="grid g-3">
            <div>
              <label className="text-xs bold sub block mb-1">Minimum Password Length</label>
              <input
                type="number"
                min="6"
                max="32"
                className="input"
                value={sec.minPasswordLength}
                onChange={e => setSec({ ...sec, minPasswordLength: parseInt(e.target.value) || 8 })}
                required
              />
            </div>

            <div>
              <label className="text-xs bold sub block mb-1">Mandatory Password Rotation (Days)</label>
              <input
                type="number"
                min="30"
                max="365"
                className="input"
                value={sec.enforcePasswordRotationDays}
                onChange={e => setSec({ ...sec, enforcePasswordRotationDays: parseInt(e.target.value) || 90 })}
                required
              />
            </div>

            <div>
              <label className="text-xs bold sub block mb-1">Brute Force Lockout Threshold</label>
              <input
                type="number"
                min="3"
                max="10"
                className="input"
                value={sec.maxFailedAttempts}
                onChange={e => setSec({ ...sec, maxFailedAttempts: parseInt(e.target.value) || 5 })}
                required
              />
              <span className="text-xs sub mt-1 block">Account locked after N consecutive failed attempts.</span>
            </div>
          </div>

          <div className="stack gap-2 mt-4 pt-3 border-t">
            <label className="row gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={sec.requireSpecialChar}
                onChange={e => setSec({ ...sec, requireSpecialChar: e.target.checked })}
              />
              <span>Require at least one special character (!@#$%^&amp;*)</span>
            </label>
            <label className="row gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={sec.requireNumbers}
                onChange={e => setSec({ ...sec, requireNumbers: e.target.checked })}
              />
              <span>Require at least one numeric digit (0-9)</span>
            </label>
          </div>
        </div>

        {/* Session Management */}
        <div className="card p-4">
          <h3 className="mb-3">Session Lifecycles &amp; Device Concurrency</h3>
          <div className="grid g-2">
            <div>
              <label className="text-xs bold sub block mb-1">
                Inactivity Session Timeout (Minutes)
              </label>
              <input
                type="number"
                min="15"
                max="480"
                className="input"
                value={sec.sessionTimeoutMinutes}
                onChange={e => setSec({ ...sec, sessionTimeoutMinutes: parseInt(e.target.value) || 120 })}
                required
              />
              <span className="text-xs sub mt-1 block">Users are automatically signed out after inactivity.</span>
            </div>

            <div>
              <label className="text-xs bold sub block mb-1">Multi-Device Concurrent Logins</label>
              <select
                className="input"
                value={sec.allowConcurrentLogins ? 'ALLOW' : 'DISALLOW'}
                onChange={e => setSec({ ...sec, allowConcurrentLogins: e.target.value === 'ALLOW' })}
              >
                <option value="DISALLOW">Disallowed (Single Active Session Enforcement)</option>
                <option value="ALLOW">Allowed (Simultaneous Web + Mobile)</option>
              </select>
              <span className="text-xs sub mt-1 block">Prevents credential sharing during exams.</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
