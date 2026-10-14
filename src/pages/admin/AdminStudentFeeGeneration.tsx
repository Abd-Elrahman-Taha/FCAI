import React, { useState } from 'react';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';

export const AdminStudentFeeGeneration: React.FC = () => {
  const { showToast } = useAuth();
  const [targetLevel, setTargetLevel] = useState('ALL');
  const [term, setTerm] = useState('Fall 2026');
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const [batches, setBatches] = useState([
    {
      id: 'BAT-2026-F1',
      date: 'Oct 01, 2026 · 08:30 AM',
      term: 'Fall 2026',
      target: 'All Enrolled Students (Levels 1–4)',
      invoicesCount: 1540,
      totalAmount: 11781000,
      status: 'Completed & Published',
      idempotentHash: 'sha256-88a291f0c2'
    },
    {
      id: 'BAT-2026-F2',
      date: 'Oct 08, 2026 · 10:00 AM',
      term: 'Fall 2026',
      target: 'Late Add/Drop Credit Adjustments',
      invoicesCount: 42,
      totalAmount: 126000,
      status: 'Completed & Reconciled',
      idempotentHash: 'sha256-3190abf4e1'
    }
  ]);

  const handleRunBatch = () => {
    if (!window.confirm(`Execute idempotent fee assessment engine for ${targetLevel} in ${term}?`)) {
      return;
    }
    setRunning(true);
    setProgress(15);
    const step1 = setTimeout(() => setProgress(50), 300);
    const step2 = setTimeout(() => setProgress(85), 600);
    const step3 = setTimeout(() => {
      setProgress(100);
      setRunning(false);
      const newBatch = {
        id: `BAT-${Date.now()}`,
        date: 'Just now',
        term,
        target: targetLevel === 'ALL' ? 'All Enrolled Students' : targetLevel,
        invoicesCount: 1540,
        totalAmount: 11781000,
        status: 'Completed & Published',
        idempotentHash: `sha256-${Math.random().toString(16).substring(2, 10)}`
      };
      setBatches(prev => [newBatch, ...prev]);
      showToast('Idempotent billing run complete: 1,540 student ledger statements generated.', 'success');
    }, 900);
  };

  return (
    <div>
      <PageHead
        title="Screen 100: Batch Fee Assessment & Billing Generation Engine"
        subtitle="Execute idempotent credit-hour tuition generation, apply statutory fee definitions, and dispatch student invoices"
        breadcrumbs={[
          { label: 'College Admin', href: '#/admin/dashboard' },
          { label: 'Screen 99: Fee Definitions', href: '#/admin/fee-definitions' },
          { label: 'Screen 100: Fee Generation' }
        ]}
        actions={
          <div className="row gap-2">
            <a href="#/admin/discounts" className="btn btn-secondary">
              <Icon name="award" /> Discounts &amp; Waivers (Screen 101)
            </a>
            <a href="#/admin/payment-monitoring" className="btn btn-secondary">
              <Icon name="creditCard" /> Fawry Monitoring (Screen 83)
            </a>
          </div>
        }
      />

      {/* Generation Engine Controller Card */}
      <div className="card p-4 mb-4">
        <h3 className="mb-2">Execute Batch Student Assessment</h3>
        <p className="text-xs sub mb-4">
          The engine runs with <strong>Idempotency Enforcement</strong>: if a student invoice already exists for the selected academic term, the billing engine skips duplication and computes only net adjustments.
        </p>

        <div className="grid g-3 mb-4">
          <div>
            <label className="text-xs bold sub block mb-1">Target Academic Term</label>
            <select
              className="input"
              value={term}
              onChange={e => setTerm(e.target.value)}
            >
              <option value="Fall 2026">Fall 2026 / 2027</option>
              <option value="Spring 2027">Spring 2027</option>
              <option value="Summer 2027">Summer 2027 Intensive</option>
            </select>
          </div>

          <div>
            <label className="text-xs bold sub block mb-1">Student Scope Cohort</label>
            <select
              className="input"
              value={targetLevel}
              onChange={e => setTargetLevel(e.target.value)}
            >
              <option value="ALL">All Enrolled Students (1,540 Students)</option>
              <option value="Level 1">Level 1 (Freshman Cohort)</option>
              <option value="Level 2">Level 2 (Sophomore Cohort)</option>
              <option value="Level 3">Level 3 (Junior Cohort)</option>
              <option value="Level 4">Level 4 (Senior Cohort)</option>
            </select>
          </div>

          <div className="self-end">
            <button
              className="btn btn-primary w-full"
              onClick={handleRunBatch}
              disabled={running}
            >
              <Icon name="play" /> {running ? `Generating (${progress}%)...` : 'Execute Billing Run'}
            </button>
          </div>
        </div>

        {running && (
          <div className="mt-2">
            <div className="row-between text-xs sub mb-1">
              <span>Evaluating Registered Credit Hours &amp; Applying Discounts...</span>
              <span>{progress}%</span>
            </div>
            <div style={{ height: '8px', background: 'var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: 'var(--color-primary)' }} />
            </div>
          </div>
        )}
      </div>

      {/* Historical Batches Table */}
      <div className="card overflow-hidden">
        <div className="card-head">
          <h3>Assessment Run Audit History</h3>
          <span className="badge badge-neutral">{batches.length} Execution Batches</span>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Batch Run ID</th>
                <th>Execution Timestamp</th>
                <th>Term</th>
                <th>Target Cohort</th>
                <th className="text-center">Invoices</th>
                <th className="text-right">Total Assessment (EGP)</th>
                <th className="text-center">Audit Status</th>
              </tr>
            </thead>
            <tbody>
              {batches.map(b => (
                <tr key={b.id}>
                  <td>
                    <code>{b.id}</code>
                    <div className="text-xs sub font-mono">{b.idempotentHash}</div>
                  </td>
                  <td>
                    <span className="text-xs sub">{b.date}</span>
                  </td>
                  <td>
                    <span className="badge badge-neutral">{b.term}</span>
                  </td>
                  <td>
                    <span className="text-sm bold">{b.target}</span>
                  </td>
                  <td className="text-center bold text-primary">
                    {b.invoicesCount} Invoices
                  </td>
                  <td className="text-right bold text-success">
                    {b.totalAmount.toLocaleString()} EGP
                  </td>
                  <td className="text-center">
                    <span className="badge badge-success">{b.status}</span>
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
