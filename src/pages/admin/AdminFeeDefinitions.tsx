import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

export const AdminFeeDefinitions: React.FC = () => {
  const { showToast } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [amount, setAmount] = useState<number>(1000);
  const [term, setTerm] = useState('Fall 2026');
  const [appliesTo, setAppliesTo] = useState('All Levels');

  useEffect(() => {
    fakeApi.getAdminFeesOverview().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  const handleCreateFee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) {
      showToast('Please provide fee item name and amount.', 'warning');
      return;
    }
    const newDef = {
      id: `fd_${Date.now()}`,
      name,
      amount,
      term,
      appliesTo
    };
    setData((prev: any) => ({
      ...prev,
      definitions: [...prev.definitions, newDef]
    }));
    setModalOpen(false);
    setName('');
    showToast('Fee charge item registered to official faculty catalog.', 'success');
  };

  if (loading || !data) return <CardSkeleton count={4} />;

  return (
    <div>
      <PageHead
        title="Screen 99: Institutional Fee Catalog & Charge Definitions"
        subtitle="Manage statutory tuition rates, laboratory equipment fees, student union charges, and medical insurance fees"
        breadcrumbs={[
          { label: 'College Admin', href: '#/admin/dashboard' },
          { label: 'Fees & Billing', href: '#/admin/fees' },
          { label: 'Screen 99: Fee Definitions' }
        ]}
        actions={
          <div className="row gap-2">
            <a href="#/admin/student-fee-generation" className="btn btn-secondary">
              <Icon name="table" /> Batch Fee Billing (Screen 100)
            </a>
            <a href="#/admin/discounts" className="btn btn-secondary">
              <Icon name="award" /> Discounts &amp; Waivers (Screen 101)
            </a>
            <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
              <Icon name="plus" /> Add Fee Definition
            </button>
          </div>
        }
      />

      {/* KPI Stats */}
      <div className="grid g-4 mb-4">
        <div className="card p-3">
          <div className="text-xs sub bold">Catalog Charge Items</div>
          <div className="h3 bold text-primary mt-1">{data.definitions.length} <span className="text-xs sub">Definitions</span></div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Standard Term Tuition</div>
          <div className="h3 bold text-success mt-1">6,500 <span className="text-xs sub">EGP / Term</span></div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Payment Gateway</div>
          <div className="h3 bold text-info mt-1">Fawry Verified</div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Billing Model</div>
          <div className="h3 bold text-neutral mt-1">Flat + Credit Hour</div>
        </div>
      </div>

      {/* Fee Definitions Table */}
      <div className="card overflow-hidden">
        <div className="card-head">
          <h3>Faculty Institutional Fee Definitions</h3>
          <span className="badge badge-neutral">Fall 2026 / 2027</span>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Fee Definition Name</th>
                <th>Academic Term</th>
                <th>Applicability Scope</th>
                <th className="text-right">Amount (EGP)</th>
                <th style={{ width: '140px' }} className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.definitions.map((def: any) => (
                <tr key={def.id}>
                  <td>
                    <div className="bold">{def.name}</div>
                    <code className="text-xs sub">{def.id}</code>
                  </td>
                  <td>
                    <span className="badge badge-neutral">{def.term}</span>
                  </td>
                  <td>
                    <span className="badge badge-ice">{def.appliesTo}</span>
                  </td>
                  <td className="text-right bold text-primary" style={{ fontSize: '15px' }}>
                    {def.amount.toLocaleString()} EGP
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => showToast(`Edit fee item ${def.name}`, 'info')}
                    >
                      <Icon name="edit" size="sm" /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Fee Modal */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '500px' }}>
            <div className="modal-head">
              <h3>Define Institutional Fee Item</h3>
              <button className="btn-close" onClick={() => setModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleCreateFee} className="modal-body p-4 stack gap-3">
              <div>
                <label className="text-xs bold sub block mb-1">Fee Item Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Graduation Capstone & Exhibition Fee"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>

              <div className="grid g-2">
                <div>
                  <label className="text-xs bold sub block mb-1">Charge Amount (EGP)</label>
                  <input
                    type="number"
                    className="input"
                    value={amount}
                    onChange={e => setAmount(parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs bold sub block mb-1">Academic Term</label>
                  <select
                    className="input"
                    value={term}
                    onChange={e => setTerm(e.target.value)}
                  >
                    <option value="Fall 2026">Fall 2026</option>
                    <option value="Spring 2027">Spring 2027</option>
                    <option value="Annual 2026/27">Annual 2026/27</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs bold sub block mb-1">Applies To Scope</label>
                <select
                  className="input"
                  value={appliesTo}
                  onChange={e => setAppliesTo(e.target.value)}
                >
                  <option value="All Levels">All Levels (Freshman to Senior)</option>
                  <option value="Level 1 only">Level 1 (Freshman) Only</option>
                  <option value="Level 4 only">Level 4 (Graduating Seniors) Only</option>
                  <option value="International Students">International Students</option>
                </select>
              </div>

              <div className="row-between gap-2 mt-2">
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Icon name="checkCircle" /> Register Fee Definition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
