import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';
import { ServiceRequest } from '../../types';

export const AdminServiceRequests: React.FC = () => {
  const { showToast } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  // Action modal
  const [activeReq, setActiveReq] = useState<ServiceRequest | null>(null);
  const [actionType, setActionType] = useState<'In Progress' | 'Resolved' | 'Rejected'>('Resolved');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fakeApi.getAdminServiceRequests().then(res => {
      setRequests(res);
      setLoading(false);
    });
  }, []);

  if (loading) return <CardSkeleton count={4} />;

  const handleProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReq) return;

    if (actionType === 'Rejected' && !notes.trim()) {
      showToast('A formal rejection reason is mandatory.', 'error');
      return;
    }

    const updated = await fakeApi.processAdminServiceRequest(activeReq.id, actionType, notes);
    setRequests(prev => prev.map(r => r.id === activeReq.id ? updated : r));
    showToast(`Request ${activeReq.id} marked as ${actionType}.`, 'success');
    setActiveReq(null);
    setNotes('');
  };

  const filtered = requests.filter(r => statusFilter === 'All' || r.status === statusFilter);

  return (
    <div>
      <PageHead
        title="Institutional Service Requests &amp; Petitions"
        subtitle="Process official student applications, enrollment certificates, transcripts, and medical excuses"
        breadcrumbs={[
          { label: 'College Admin', href: '#/admin/dashboard' },
          { label: 'Service Requests' }
        ]}
      />

      {/* Filter Tabs */}
      <div className="card p-4 mb-5">
        <div className="row-between wrap gap-2">
          <div className="row gap-2">
            {['All', 'Pending', 'In Progress', 'Resolved', 'Rejected'].map(s => (
              <button
                key={s}
                className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setStatusFilter(s)}
              >
                {s} ({s === 'All' ? requests.length : requests.filter(r => r.status === s).length})
              </button>
            ))}
          </div>
          <div className="chip chip-info">{filtered.length} Requests Listed</div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Student</th>
                <th>Request Type</th>
                <th>Department</th>
                <th>Subject &amp; Details</th>
                <th>Attachment</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(req => (
                <tr key={req.id}>
                  <td><code>{req.id}</code></td>
                  <td>
                    <div className="bold">{req.studentName}</div>
                    <div className="sub text-xs">{req.studentCode}</div>
                  </td>
                  <td><span className="badge badge-primary">{req.type}</span></td>
                  <td>{req.department}</td>
                  <td style={{ maxWidth: '280px' }}>
                    <div className="bold truncate">{req.subject}</div>
                    <div className="sub text-xs truncate">{req.description}</div>
                    {req.otherDescription && (
                      <div className="text-xs text-primary italic">Custom note: {req.otherDescription}</div>
                    )}
                  </td>
                  <td>
                    {req.attachmentName ? (
                      <span className="chip chip-neutral" style={{ fontSize: '11px' }}>
                        <Icon name="file" size="sm" /> {req.attachmentName}
                      </span>
                    ) : (
                      <span className="sub text-xs">—</span>
                    )}
                  </td>
                  <td className="text-xs sub">{req.submittedDate}</td>
                  <td>
                    <span className={`badge ${
                      req.status === 'Resolved' ? 'badge-success' :
                      req.status === 'In Progress' ? 'badge-info' :
                      req.status === 'Pending' ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td>
                    <div className="row gap-1">
                      {req.status !== 'Resolved' && req.status !== 'Rejected' ? (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => { setActiveReq(req); setActionType('Resolved'); }}
                        >
                          Process
                        </button>
                      ) : (
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => { setActiveReq(req); setActionType(req.status as any); }}
                        >
                          View Notes
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Processing Modal */}
      {activeReq && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '540px' }}>
            <div className="modal-head">
              <h3>Process Service Request · {activeReq.id}</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setActiveReq(null)}>
                <Icon name="x" />
              </button>
            </div>
            <form onSubmit={handleProcess} className="p-5">
              <div className="card p-3 mb-4" style={{ background: 'var(--color-bg-page)' }}>
                <div className="row-between mb-1">
                  <strong>{activeReq.studentName} ({activeReq.studentCode})</strong>
                  <span className="badge badge-primary">{activeReq.type}</span>
                </div>
                <div className="sub text-xs">{activeReq.subject}</div>
                <div className="text-xs mt-2">{activeReq.description}</div>
              </div>

              <div className="form-group mb-4">
                <label className="form-label">Set Lifecycle Status</label>
                <div className="row gap-2">
                  {(['In Progress', 'Resolved', 'Rejected'] as const).map(act => (
                    <button
                      key={act}
                      type="button"
                      className={`btn btn-sm flex-1 ${actionType === act ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setActionType(act)}
                    >
                      {act}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group mb-5">
                <label className="form-label">
                  {actionType === 'Rejected' ? 'Mandatory Rejection Reason' : 'Fulfillment Notes / Official Record'}
                </label>
                <textarea
                  className="textarea"
                  rows={3}
                  placeholder={
                    actionType === 'Rejected'
                      ? 'Specify regulatory reason for denial...'
                      : 'Signed and certified by Student Affairs Officer...'
                  }
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  required={actionType === 'Rejected'}
                />
              </div>

              <div className="row-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => setActiveReq(null)}>
                  Close
                </button>
                <button
                  type="submit"
                  className={`btn ${actionType === 'Rejected' ? 'btn-danger' : actionType === 'Resolved' ? 'btn-success' : 'btn-primary'}`}
                >
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
