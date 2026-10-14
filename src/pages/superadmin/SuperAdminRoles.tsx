import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

export const SuperAdminRoles: React.FC = () => {
  const { showToast } = useAuth();
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fakeApi.getSuperAdminRoles().then(res => {
      setRoles(res);
      setLoading(false);
    });
  }, []);

  if (loading) return <CardSkeleton count={4} />;

  return (
    <div>
      <PageHead
        title="Screen 102: Institutional Roles & Global Permission Catalogs"
        subtitle="Manage system-level security roles, privilege scopes, and account inheritance policies"
        breadcrumbs={[
          { label: 'System Admin', href: '#/superadmin/system-config' },
          { label: 'Screen 102: Global Roles' }
        ]}
        actions={
          <div className="row gap-2">
            <button className="btn btn-secondary" onClick={() => showToast('Exported system role schema as JSON.', 'info')}>
              <Icon name="download" /> Export Schema JSON
            </button>
            <a href="#/superadmin/system-config" className="btn btn-primary">
              <Icon name="settings" /> System Config (Screen 103)
            </a>
          </div>
        }
      />

      {/* KPI Stats */}
      <div className="grid g-4 mb-4">
        <div className="card p-3">
          <div className="text-xs sub bold">Defined Global Roles</div>
          <div className="h3 bold text-primary mt-1">{roles.length} <span className="text-xs sub">Roles</span></div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Total Institutional Accounts</div>
          <div className="h3 bold text-success mt-1">{roles.reduce((acc, r) => acc + r.count, 0).toLocaleString()} <span className="text-xs sub">Users</span></div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Fine-Grained Permissions</div>
          <div className="h3 bold text-info mt-1">106 <span className="text-xs sub">Endpoints</span></div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">RBAC Enforcement</div>
          <div className="h3 bold text-neutral mt-1">JWT + App Context</div>
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid g-2">
        {roles.map(r => (
          <div key={r.id} className="card p-4">
            <div className="row-between mb-2">
              <div className="row gap-2">
                <span className="badge badge-primary">{r.id}</span>
                <span className="badge badge-ice">{r.perms} Permissions</span>
              </div>
              <span className="bold text-sm text-primary">{r.count.toLocaleString()} Users</span>
            </div>

            <h3 className="mb-1">{r.name}</h3>
            <p className="text-xs sub mb-3">{r.desc}</p>

            <div className="row-between text-xs sub pt-3 border-t">
              <span>Status: <strong className="text-success">Active &amp; Enforced</strong></span>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => showToast(`Opened permissions catalog for ${r.name}`, 'info')}
              >
                <Icon name="lock" size="sm" /> Inspect Perms
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
