import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

export const AdminFeeManagement: React.FC = () => {
  const { showToast } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showGenModal, setShowGenModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genResult, setGenResult] = useState<any>(null);

  useEffect(() => {
    fakeApi.getAdminFeesOverview().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) return <CardSkeleton count={4} />;

  const handleGenerateBatch = async () => {
    setGenerating(true);
    const result = await fakeApi.generateStudentFees('2026/2027', 'Fall', 'All Levels');
    setGenerating(false);
    setGenResult(result);
    showToast(`Batch generated: ${result.generatedCount} student fees applied. ${result.skippedCount} skipped (already billed).`, 'success');
  };

  return (
    <div>
      <PageHead
        title="Fee Governance &amp; Payment Reconciliation"
        subtitle="Manage semester fee schedules, idempotent batch billing, and Fawry electronic payment records"
        breadcrumbs={[
          { label: 'College Admin', href: '#/admin/dashboard' },
          { label: 'Fee Management' }
        ]}
        actions={
          <div className="row gap-2">
            <button className="btn btn-primary" onClick={() => { setShowGenModal(true); setGenResult(null); }}>
              <Icon name="creditCard" /> Idempotent Fee Generator
            </button>
          </div>
        }
      />

      {/* Financial KPIs */}
      <div className="grid g-4 mb-6">
        <div className="card p-4 text-center">
          <div className="sub text-xs">Total Invoiced Fees</div>
          <div style={{ fontSize: '24px', fontWeight: 750 }}>
            {(data.totalInvoiced).toLocaleString()} <small style={{ fontSize: '12px' }}>EGP</small>
          </div>
        </div>
        <div className="card p-4 text-center">
          <div className="sub text-xs">Collected Revenue</div>
          <div style={{ fontSize: '24px', fontWeight: 750, color: 'var(--color-success)' }}>
            {(data.totalCollected).toLocaleString()} <small style={{ fontSize: '12px' }}>EGP</small>
          </div>
        </div>
        <div className="card p-4 text-center">
          <div className="sub text-xs">Unpaid Balance</div>
          <div style={{ fontSize: '24px', fontWeight: 750, color: 'var(--color-danger)' }}>
            {(data.unpaidBalance).toLocaleString()} <small style={{ fontSize: '12px' }}>EGP</small>
          </div>
        </div>
        <div className="card p-4 text-center">
          <div className="sub text-xs">Collection Rate</div>
          <div style={{ fontSize: '24px', fontWeight: 750, color: 'var(--color-primary)' }}>
            {data.collectionRate}%
          </div>
        </div>
      </div>

      <div className="grid g-2 mb-6">
        {/* Fee Definitions Catalog */}
        <div className="card p-5">
          <div className="card-head">
            <h3>Standard Fee Definitions</h3>
            <span className="badge badge-primary">Fall 2026</span>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Fee Name</th>
                  <th>Amount (EGP)</th>
                  <th>Term</th>
                  <th>Target Group</th>
                </tr>
              </thead>
              <tbody>
                {data.definitions.map((def: any) => (
                  <tr key={def.id}>
                    <td className="bold">{def.name}</td>
                    <td className="bold" style={{ color: 'var(--color-primary)' }}>{def.amount.toLocaleString()} EGP</td>
                    <td>{def.term}</td>
                    <td><span className="badge badge-neutral">{def.appliesTo}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fawry Reconciled Payments Log */}
        <div className="card p-5">
          <div className="card-head">
            <h3>Recent Fawry Gateway Settlements</h3>
            <span className="badge badge-success">Live Webhook Synced</span>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Fawry Ref</th>
                  <th>Student</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentTransactions.map((tx: any) => (
                  <tr key={tx.ref}>
                    <td><code>{tx.ref}</code></td>
                    <td>
                      <div className="bold">{tx.student}</div>
                      <div className="sub text-xs">{tx.code}</div>
                    </td>
                    <td className="bold">{tx.amount.toLocaleString()} EGP</td>
                    <td className="sub text-xs">{tx.date}</td>
                    <td><span className="badge badge-success">{tx.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Idempotent Batch Generation Modal */}
      {showGenModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '540px' }}>
            <div className="modal-head">
              <h3>Idempotent Student Fee Generator</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowGenModal(false)}>
                <Icon name="x" />
              </button>
            </div>
            <div className="p-5">
              <p className="sub leading-relaxed mb-4" style={{ fontSize: '13px' }}>
                Generate official tuition charges across all enrolled student accounts. This operation is strictly <strong>idempotent</strong>: running it repeatedly will never double-bill any student who has already had semester fee records generated.
              </p>

              <div className="form-group mb-3">
                <label className="form-label">Academic Year</label>
                <input type="text" className="input" defaultValue="2026/2027" disabled />
              </div>

              <div className="form-group mb-4">
                <label className="form-label">Academic Term</label>
                <select className="select">
                  <option>Fall Semester 2026 (Tuition + Labs + Union)</option>
                  <option>Spring Semester 2027</option>
                </select>
              </div>

              {genResult && (
                <div className="card p-4 mb-4" style={{ background: '#f0fdf4', border: '1px solid #86efac' }}>
                  <div className="bold text-success mb-2">Batch Fee Generation Complete!</div>
                  <div className="row-between text-xs mb-1">
                    <span>Enrolled Accounts Inspected:</span>
                    <strong>{genResult.affectedStudents}</strong>
                  </div>
                  <div className="row-between text-xs mb-1">
                    <span>New Invoices Created:</span>
                    <strong>{genResult.generatedCount}</strong>
                  </div>
                  <div className="row-between text-xs">
                    <span>Already Billed (Idempotently Skipped):</span>
                    <strong>{genResult.skippedCount}</strong>
                  </div>
                </div>
              )}

              <div className="row-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => setShowGenModal(false)}>
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleGenerateBatch}
                  disabled={generating}
                >
                  <Icon name="checkCircle" /> {generating ? 'Processing Batch...' : 'Execute Idempotent Generation'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
