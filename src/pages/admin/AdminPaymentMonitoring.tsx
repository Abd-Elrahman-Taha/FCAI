import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

export const AdminPaymentMonitoring: React.FC = () => {
  const { showToast } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [reconciling, setReconciling] = useState(false);

  useEffect(() => {
    fakeApi.getAdminFeesOverview().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  const handleTriggerReconcile = async () => {
    setReconciling(true);
    await new Promise(r => setTimeout(r, 600));
    setReconciling(false);
    showToast('Fawry gateway reconciliation cycle completed: 142 webhooks validated.', 'success');
  };

  if (loading || !data) return <CardSkeleton count={4} />;

  const transactions = [
    ...data.recentTransactions,
    { ref: 'FWY-55192831', student: 'Omar Khaled Fathy', code: '2022170033', amount: 7650, date: 'Oct 12, 2026', provider: 'Fawry Verified', status: 'Reconciled' },
    { ref: 'FWY-38192014', student: 'Hana Mostafa Kamal', code: '2021170078', amount: 7650, date: 'Oct 13, 2026', provider: 'Fawry Verified', status: 'Reconciled' },
    { ref: 'VSA-99182341', student: 'Nour El-Din Mostafa', code: '2021170204', amount: 7650, date: 'Oct 14, 2026', provider: 'Visa / Mastercard', status: 'Pending Gateway' }
  ];

  const filtered = transactions.filter((t: any) => {
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesSearch = t.student.toLowerCase().includes(searchQuery.toLowerCase()) || t.code.includes(searchQuery) || t.ref.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      <PageHead
        title="Screen 83: Institutional Payments & Fawry Reconciliation Monitoring"
        subtitle="Live payment gateway transaction telemetry, clearing house reconciliations, and fee audit trails"
        breadcrumbs={[
          { label: 'College Admin', href: '#/admin/dashboard' },
          { label: 'Screen 99: Fee Definitions', href: '#/admin/fee-definitions' },
          { label: 'Screen 83: Payment Monitoring' }
        ]}
        actions={
          <div className="row gap-2">
            <button className="btn btn-secondary" onClick={() => showToast('Exported transaction log to audit CSV.', 'info')}>
              <Icon name="download" /> Export Ledger
            </button>
            <button className="btn btn-primary" onClick={handleTriggerReconcile} disabled={reconciling}>
              <Icon name="refresh" /> {reconciling ? 'Reconciling Webhooks...' : 'Run Fawry Reconciliation'}
            </button>
          </div>
        }
      />

      {/* KPI Stats */}
      <div className="grid g-4 mb-4">
        <div className="card p-3">
          <div className="text-xs sub bold">Total Invoiced (Fall 2026)</div>
          <div className="h3 bold text-primary mt-1">{(data.totalInvoiced).toLocaleString()} <span className="text-xs sub">EGP</span></div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Total Cleared &amp; Collected</div>
          <div className="h3 bold text-success mt-1">{(data.totalCollected).toLocaleString()} <span className="text-xs sub">EGP</span></div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Outstanding Unpaid Balance</div>
          <div className="h3 bold text-warning mt-1">{(data.unpaidBalance).toLocaleString()} <span className="text-xs sub">EGP</span></div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Faculty Collection Rate</div>
          <div className="h3 bold text-info mt-1">{data.collectionRate}%</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card p-3 mb-4">
        <div className="row-between wrap gap-3">
          <div className="row gap-3">
            <div>
              <label className="text-xs bold sub block mb-1">Status Filter</label>
              <select
                className="input"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Transactions</option>
                <option value="Reconciled">Reconciled (Settled)</option>
                <option value="Pending Gateway">Pending Gateway</option>
                <option value="Failed">Failed / Expired</option>
              </select>
            </div>
            <div>
              <label className="text-xs bold sub block mb-1">Search Transaction</label>
              <div className="input-search">
                <input
                  type="text"
                  placeholder="Reference, Student Name, or Code..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ minWidth: '240px' }}
                />
              </div>
            </div>
          </div>

          <div className="row gap-2 align-end">
            <span className="badge badge-success">Fawry Production Webhook Active · 42ms Latency</span>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card overflow-hidden">
        <div className="card-head">
          <h3>Real-Time Payment Transactions Stream</h3>
          <span className="badge badge-neutral">{filtered.length} Recorded Entries</span>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Payment Reference</th>
                <th>Student</th>
                <th>Payment Channel</th>
                <th>Transaction Date</th>
                <th className="text-right">Amount (EGP)</th>
                <th className="text-center">Status</th>
                <th style={{ width: '130px' }} className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t: any) => (
                <tr key={t.ref}>
                  <td>
                    <code>{t.ref}</code>
                  </td>
                  <td>
                    <div className="bold">{t.student}</div>
                    <code className="text-xs sub">{t.code}</code>
                  </td>
                  <td>
                    <span className="badge badge-ice">{t.provider}</span>
                  </td>
                  <td>
                    <span className="text-xs sub">{t.date}</span>
                  </td>
                  <td className="text-right bold text-primary">
                    {t.amount.toLocaleString()} EGP
                  </td>
                  <td className="text-center">
                    <span className={`badge ${t.status === 'Reconciled' ? 'badge-success' : 'badge-warning'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => showToast(`Electronic receipt for ${t.ref} loaded.`, 'info')}
                    >
                      <Icon name="file" size="sm" /> Receipt
                    </button>
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
