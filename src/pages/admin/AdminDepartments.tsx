import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';
import type { Department } from '../../types';

export const AdminDepartments: React.FC = () => {
  const { showToast } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<'All' | 'Academic' | 'Administrative'>('All');

  useEffect(() => {
    fakeApi.getAdminDepartments().then(res => {
      setDepartments(res);
      setLoading(false);
    });
  }, []);

  if (loading) return <CardSkeleton count={4} />;

  const filtered = departments.filter(d => typeFilter === 'All' || d.type === typeFilter);

  return (
    <div>
      <PageHead
        title="Departments &amp; Units Governance"
        subtitle="Manage academic departments and administrative units with inherited permission sets"
        breadcrumbs={[
          { label: 'College Admin', href: '#/admin/dashboard' },
          { label: 'Departments' }
        ]}
        actions={
          <button className="btn btn-primary" onClick={() => showToast('New Department modal', 'info')}>
            <Icon name="plus" /> Create Department
          </button>
        }
      />

      {/* Filter Tabs */}
      <div className="card p-4 mb-5">
        <div className="row-between wrap gap-2">
          <div className="row gap-2">
            <button
              className={`btn btn-sm ${typeFilter === 'All' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTypeFilter('All')}
            >
              All Units ({departments.length})
            </button>
            <button
              className={`btn btn-sm ${typeFilter === 'Academic' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTypeFilter('Academic')}
            >
              Academic Departments (4)
            </button>
            <button
              className={`btn btn-sm ${typeFilter === 'Administrative' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTypeFilter('Administrative')}
            >
              Administrative Units (4)
            </button>
          </div>
          <div className="chip chip-info">Faculty of Computers &amp; AI · BSU</div>
        </div>
      </div>

      <div className="grid g-2">
        {filtered.map(dept => (
          <div key={dept.id} className="card p-5" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div className="row-between mb-3">
                <span className={`badge ${dept.type === 'Academic' ? 'badge-primary' : 'badge-info'}`}>
                  {dept.type} Department
                </span>
                <span className="badge badge-neutral">Code: {dept.code}</span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>{dept.name}</h3>
              <p className="sub text-xs mb-3">{dept.description}</p>

              <div className="card p-3 mb-4" style={{ background: 'var(--color-bg-page)', fontSize: '12px' }}>
                <div className="row-between mb-2">
                  <span className="sub">Department Head / Director:</span>
                  <strong>{dept.head}</strong>
                </div>
                <div className="row-between mb-2">
                  <span className="sub">Office Location:</span>
                  <strong>{dept.officeLocation}</strong>
                </div>
                <div className="row-between">
                  <span className="sub">Assigned Staff:</span>
                  <span className="badge badge-success">{dept.staffCount} Staff Members</span>
                </div>
              </div>

              {/* Department Inherited Permissions */}
              <div className="mb-3">
                <span className="sub text-xs block mb-1">Inherited Permission Scope:</span>
                <div className="row gap-1 wrap">
                  {dept.permissions.map((perm, idx) => (
                    <span key={idx} className="chip chip-neutral" style={{ fontSize: '11px', padding: '2px 8px' }}>
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="row gap-2 mt-2">
              <button className="btn btn-secondary btn-sm flex-1" onClick={() => showToast(`Editing ${dept.name}`, 'info')}>
                <Icon name="edit" /> Configure
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => showToast(`Staff roster for ${dept.name}`, 'info')}>
                <Icon name="users" /> Staff List
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
