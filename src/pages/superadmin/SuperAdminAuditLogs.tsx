import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

export const SuperAdminAuditLogs: React.FC = () => {
  const { showToast } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  useEffect(() => {
    fakeApi.getSuperAdminAuditLogs().then(res => {
      setLogs(res);
      setLoading(false);
    });
  }, []);

  if (loading) return <CardSkeleton count={5} />;

  const filtered = logs.filter(l => {
    const matchesAction = actionFilter === 'ALL' || l.action.includes(actionFilter);
    const matchesSearch = l.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.ip.includes(searchQuery);
    return matchesAction && matchesSearch;
  });

  return (
    <div>
      <PageHead
        title="Screen 106: Immutable Faculty Security & Audit Trail Logs"
        subtitle="Forensic operational log of academic actions, financial verifications, grade transitions, and security events"
        breadcrumbs={[
          { label: 'System Admin', href: '#/superadmin/system-config' },
          { label: 'Screen 106: Audit Trail' }
        ]}
        actions={
          <div className="row gap-2">
            <button className="btn btn-secondary" onClick={() => showToast('Exported complete SHA256 immutable audit ledger to CSV.', 'info')}>
              <Icon name="download" /> Export Audit Ledger
            </button>
            <button className="btn btn-primary" onClick={() => showToast('Audit cryptographic integrity verified: zero log mutations detected.', 'success')}>
              <Icon name="checkCircle" /> Verify Cryptographic Hashes
            </button>
          </div>
        }
      />

      {/* KPI Stats */}
      <div className="grid g-4 mb-4">
        <div className="card p-3">
          <div className="text-xs sub bold">Logged Audit Records</div>
          <div className="h3 bold text-primary mt-1">{logs.length} <span className="text-xs sub">Critical Events</span></div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Grade Approvals Tracked</div>
          <div className="h3 bold text-success mt-1">100% Signed</div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Payment Confirmations</div>
          <div className="h3 bold text-info mt-1">Fawry Verified</div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Log Storage Mode</div>
          <div className="h3 bold text-neutral mt-1">Append-Only Immutable</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card p-3 mb-4">
        <div className="row-between wrap gap-3">
          <div className="row gap-3">
            <div>
              <label className="text-xs bold sub block mb-1">Action Category</label>
              <select
                className="input"
                value={actionFilter}
                onChange={e => setActionFilter(e.target.value)}
              >
                <option value="ALL">All Recorded Actions</option>
                <option value="GRADE">Grade Approvals &amp; Submissions</option>
                <option value="PAYMENT">Fawry Financial Webhooks</option>
                <option value="QR">QR Attendance Check-ins</option>
                <option value="SERVICE">Service Request Handlers</option>
                <option value="FEE">Batch Billing Cycles</option>
              </select>
            </div>
            <div>
              <label className="text-xs bold sub block mb-1">Search Audit Stream</label>
              <div className="input-search">
                <input
                  type="text"
                  placeholder="Filter actor, IP, or resource..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ minWidth: '260px' }}
                />
              </div>
            </div>
          </div>
          <div className="text-sm sub self-center">
            Showing <strong>{filtered.length}</strong> Forensic Log Entries
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="card overflow-hidden">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '170px' }}>Timestamp</th>
                <th>Actor &amp; Role</th>
                <th>Security Action</th>
                <th>Target Resource</th>
                <th>Origin IP</th>
                <th style={{ width: '100px' }} className="text-center">Outcome</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(l => (
                <tr key={l.id}>
                  <td>
                    <span className="font-mono text-xs">{l.timestamp}</span>
                  </td>
                  <td>
                    <div className="bold text-sm">{l.actor}</div>
                  </td>
                  <td>
                    <span className="badge badge-primary font-mono text-xs">{l.action}</span>
                  </td>
                  <td>
                    <span className="text-sm">{l.resource}</span>
                  </td>
                  <td>
                    <code className="text-xs">{l.ip}</code>
                  </td>
                  <td className="text-center">
                    <span className="badge badge-success font-mono">{l.result}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
