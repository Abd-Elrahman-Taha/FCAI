import React, { useState } from 'react';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';

export const AdminDiscounts: React.FC = () => {
  const { showToast } = useAuth();
  const [activeTab, setActiveTab] = useState<'applications' | 'policies'>('applications');

  // Applications queue
  const [applications, setApplications] = useState([
    {
      id: 'DISC-01',
      student: 'Ahmed Mohamed Hassan',
      code: '2021170045',
      level: 'Level 3',
      type: 'Academic Excellence Merit Scholarship',
      gpa: 3.42,
      discount: '15% Waiver (1,147 EGP)',
      status: 'Approved',
      date: 'Oct 02, 2026'
    },
    {
      id: 'DISC-02',
      student: 'Mariam Ahmed Saeed',
      code: '2021170112',
      level: 'Level 3',
      type: 'Academic Excellence Merit Scholarship',
      gpa: 3.88,
      discount: '25% Waiver (1,912 EGP)',
      status: 'Approved',
      date: 'Oct 04, 2026'
    },
    {
      id: 'DISC-03',
      student: 'Ziad Hany Nabil',
      code: '2022170881',
      level: 'Level 2',
      type: 'Faculty Staff Children Exemption',
      gpa: 2.95,
      discount: '50% Waiver (3,825 EGP)',
      status: 'Pending Dean Approval',
      date: 'Oct 11, 2026'
    },
    {
      id: 'DISC-04',
      student: 'Mohamed Tarek Adel',
      code: '2023170419',
      level: 'Level 1',
      type: 'Youth Care Sports Championship Award',
      gpa: 3.10,
      discount: '20% Waiver (1,530 EGP)',
      status: 'Pending Dean Approval',
      date: 'Oct 13, 2026'
    }
  ]);

  const handleApprove = (id: string) => {
    setApplications(prev =>
      prev.map(a => a.id === id ? { ...a, status: 'Approved' } : a)
    );
    showToast('Tuition fee discount approved and applied to student ledger.', 'success');
  };

  const handleReject = (id: string) => {
    setApplications(prev =>
      prev.map(a => a.id === id ? { ...a, status: 'Rejected' } : a)
    );
    showToast('Discount request rejected.', 'warning');
  };

  return (
    <div>
      <PageHead
        title="Screen 101: Tuition Discounts, Scholarships & Financial Aid Waivers"
        subtitle="Manage statutory merit scholarships, staff exemptions, hardship waivers, and Dean approval queues"
        breadcrumbs={[
          { label: 'College Admin', href: '#/admin/dashboard' },
          { label: 'Screen 99: Fee Definitions', href: '#/admin/fee-definitions' },
          { label: 'Screen 101: Discounts & Waivers' }
        ]}
        actions={
          <div className="row gap-2">
            <a href="#/admin/fee-definitions" className="btn btn-secondary">
              <Icon name="arrowLeft" /> Back to Fee Definitions (Screen 99)
            </a>
          </div>
        }
      />

      {/* Tabs */}
      <div className="tabs mb-4">
        <button
          className={`tab ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          <Icon name="file" size="sm" /> Student Exemption Applications ({applications.filter(a => a.status.includes('Pending')).length} Pending)
        </button>
        <button
          className={`tab ${activeTab === 'policies' ? 'active' : ''}`}
          onClick={() => setActiveTab('policies')}
        >
          <Icon name="settings" size="sm" /> Faculty Discount Policies
        </button>
      </div>

      {activeTab === 'applications' ? (
        <div className="card overflow-hidden">
          <div className="card-head">
            <h3>Student Tuition Waiver Applications</h3>
            <span className="badge badge-neutral">{applications.length} Records</span>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Level / GPA</th>
                  <th>Discount Category</th>
                  <th>Waiver Amount</th>
                  <th>Application Date</th>
                  <th className="text-center">Status</th>
                  <th style={{ width: '180px' }} className="text-center">Dean Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => {
                  const isPending = app.status.includes('Pending');
                  return (
                    <tr key={app.id}>
                      <td>
                        <div className="bold">{app.student}</div>
                        <code className="text-xs sub">{app.code}</code>
                      </td>
                      <td>
                        <div className="text-xs">{app.level}</div>
                        <div className="bold text-xs text-primary">GPA: {app.gpa}</div>
                      </td>
                      <td>
                        <span className="badge badge-ice">{app.type}</span>
                      </td>
                      <td>
                        <strong className="text-success text-sm">{app.discount}</strong>
                      </td>
                      <td>
                        <span className="text-xs sub">{app.date}</span>
                      </td>
                      <td className="text-center">
                        <span className={`badge ${app.status === 'Approved' ? 'badge-success' : isPending ? 'badge-warning' : 'badge-danger'}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="text-center">
                        {isPending ? (
                          <div className="row gap-1 justify-center">
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleApprove(app.id)}
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleReject(app.id)}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs sub">Processed</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid g-2">
          <div className="card p-4">
            <h3 className="mb-2">Merit Scholarship Rules</h3>
            <p className="text-sm sub mb-3 leading-relaxed">
              Tiered tuition reductions automatically evaluated upon completion of semester grade audits:
            </p>
            <ul className="stack gap-2 text-xs">
              <li className="row-between p-2 rounded border">
                <span>Cumulative GPA &gt;= 3.80</span>
                <strong className="text-success">25% Tuition Waiver</strong>
              </li>
              <li className="row-between p-2 rounded border">
                <span>Cumulative GPA 3.40 – 3.79</span>
                <strong className="text-success">15% Tuition Waiver</strong>
              </li>
            </ul>
          </div>

          <div className="card p-4">
            <h3 className="mb-2">Institutional Staff Exemption</h3>
            <p className="text-sm sub mb-3 leading-relaxed">
              Children of Beni Suef University faculty members and tenured administrative staff receive a statutory <strong>50% tuition reduction</strong> upon presenting verified university HR documentation.
            </p>
            <button className="btn btn-neutral btn-sm" onClick={() => showToast('Statutory rules verified against university regulations.', 'info')}>
              <Icon name="checkCircle" size="sm" /> Validate Bylaw
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
