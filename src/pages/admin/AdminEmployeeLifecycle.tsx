import React, { useState } from 'react';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';

export const AdminEmployeeLifecycle: React.FC = () => {
  const { showToast } = useAuth();
  const [activeTab, setActiveTab] = useState<'onboarding' | 'transfers' | 'leaves' | 'offboarding'>('onboarding');

  // Lifecycle events data
  const [onboardings, setOnboardings] = useState([
    { id: 'ONB-101', name: 'Yasmine Adel', dept: 'Student Affairs', role: 'Affairs Specialist', step: 'Badge & Email Created', progress: 75, date: 'Oct 12, 2026' },
    { id: 'ONB-102', name: 'Sherif Talaat', dept: 'IT Systems', role: 'Lab Hardware Technician', step: 'Biometric Access Configuration', progress: 50, date: 'Oct 14, 2026' }
  ]);

  const [leaves] = useState([
    { id: 'LV-401', name: 'Dr. Samy Mahmoud', dept: 'Information Systems', type: 'Academic Sabbatical', from: 'Oct 01, 2026', to: 'Jan 15, 2027', status: 'Approved by Dean' },
    { id: 'LV-402', name: 'Amr Mamdouh', dept: 'Student Affairs', type: 'Annual Statutory Leave', from: 'Oct 15, 2026', to: 'Oct 22, 2026', status: 'Active' }
  ]);

  const handleAdvanceStep = (id: string) => {
    setOnboardings(prev =>
      prev.map(o => o.id === id ? { ...o, step: 'Account Fully Activated & RBAC Ready', progress: 100 } : o)
    );
    showToast('Onboarding milestone finalized: Account active.', 'success');
  };

  return (
    <div>
      <PageHead
        title="Screen 78: Staff Lifecycle & Onboarding Operations"
        subtitle="Track institutional onboarding, department transfers, leaves of absence, and secure offboarding"
        breadcrumbs={[
          { label: 'College Admin', href: '#/admin/dashboard' },
          { label: 'Screen 77: Employees', href: '#/admin/employees' },
          { label: 'Screen 78: Staff Lifecycle' }
        ]}
        actions={
          <div className="row gap-2">
            <a href="#/admin/employees" className="btn btn-secondary">
              <Icon name="arrowLeft" /> Back to Staff (Screen 77)
            </a>
            <button className="btn btn-primary" onClick={() => showToast('Initiated new staff onboarding ticket.', 'info')}>
              <Icon name="plus" /> Initiate Onboarding Workflow
            </button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="tabs mb-4">
        <button
          className={`tab ${activeTab === 'onboarding' ? 'active' : ''}`}
          onClick={() => setActiveTab('onboarding')}
        >
          <Icon name="userCheck" size="sm" /> Onboarding &amp; Clearance ({onboardings.length})
        </button>
        <button
          className={`tab ${activeTab === 'leaves' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaves')}
        >
          <Icon name="calendar" size="sm" /> Leaves &amp; Sabbaticals ({leaves.length})
        </button>
        <button
          className={`tab ${activeTab === 'transfers' ? 'active' : ''}`}
          onClick={() => setActiveTab('transfers')}
        >
          <Icon name="refresh" size="sm" /> Department Transfers
        </button>
        <button
          className={`tab ${activeTab === 'offboarding' ? 'active' : ''}`}
          onClick={() => setActiveTab('offboarding')}
        >
          <Icon name="lock" size="sm" /> Account De-provisioning
        </button>
      </div>

      {activeTab === 'onboarding' && (
        <div className="stack gap-3">
          {onboardings.map(o => (
            <div key={o.id} className="card p-4">
              <div className="row-between wrap gap-2 mb-2">
                <div>
                  <div className="row gap-2 mb-1">
                    <span className="bold text-base">{o.name}</span>
                    <span className="badge badge-primary">{o.dept}</span>
                    <span className="badge badge-ice">{o.role}</span>
                  </div>
                  <div className="text-xs sub">Reference ID: <code>{o.id}</code> · Started {o.date}</div>
                </div>

                <div className="row gap-2">
                  {o.progress < 100 && (
                    <button className="btn btn-primary btn-sm" onClick={() => handleAdvanceStep(o.id)}>
                      <Icon name="checkCircle" /> Complete Onboarding
                    </button>
                  )}
                  <button className="btn btn-secondary btn-sm" onClick={() => showToast('Printing institutional ID card badge.', 'info')}>
                    <Icon name="creditCard" /> Print ID Badge
                  </button>
                </div>
              </div>

              <div className="row-between text-xs sub mb-1">
                <span>Current Stage: <strong>{o.step}</strong></span>
                <span>{o.progress}% Completed</span>
              </div>

              <div style={{ height: '6px', background: 'var(--color-border)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${o.progress}%`, height: '100%', background: o.progress === 100 ? 'var(--color-success)' : 'var(--color-primary)' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'leaves' && (
        <div className="card overflow-hidden">
          <div className="card-head">
            <h3>Leaves &amp; Sabbaticals Registry</h3>
            <span className="badge badge-neutral">{leaves.length} Recorded</span>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Staff Member / Doctor</th>
                  <th>Department</th>
                  <th>Leave Type</th>
                  <th>Period (From – To)</th>
                  <th className="text-center">Approval Status</th>
                  <th style={{ width: '120px' }} className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map(l => (
                  <tr key={l.id}>
                    <td>
                      <div className="bold">{l.name}</div>
                      <code className="text-xs sub">{l.id}</code>
                    </td>
                    <td>{l.dept}</td>
                    <td><span className="badge badge-ice">{l.type}</span></td>
                    <td className="text-xs">{l.from} – {l.to}</td>
                    <td className="text-center"><span className="badge badge-success">{l.status}</span></td>
                    <td className="text-center">
                      <button className="btn btn-secondary btn-sm" onClick={() => showToast('Opening leave documentation file.', 'info')}>
                        <Icon name="file" size="sm" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'transfers' && (
        <div className="card p-6 text-center">
          <div className="mb-2"><Icon name="refresh" size="lg" /></div>
          <h3>Department Transfer Requests</h3>
          <p className="text-sm sub mt-1 max-w-md mx-auto">
            No pending inter-departmental transfers. All faculty and administrative officers are actively stationed at their assigned posts.
          </p>
          <button className="btn btn-secondary mt-3" onClick={() => showToast('Transfer request ticket template opened.', 'info')}>
            <Icon name="plus" /> Request Staff Transfer
          </button>
        </div>
      )}

      {activeTab === 'offboarding' && (
        <div className="card p-6 text-center">
          <div className="mb-2"><Icon name="lock" size="lg" /></div>
          <h3>Secure Account De-provisioning</h3>
          <p className="text-sm sub mt-1 max-w-md mx-auto">
            When an employee resigns or completes their contract, use this protocol to automatically revoke institutional email, VPN access, and electronic gradebook rights.
          </p>
          <button className="btn btn-danger mt-3" onClick={() => showToast('De-provisioning checklist opened.', 'warning')}>
            <Icon name="xCircle" /> Initiate Secure Offboarding
          </button>
        </div>
      )}
    </div>
  );
};
