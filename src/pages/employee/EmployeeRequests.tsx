import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';
import { ServiceRequest } from '../../types';

export const EmployeeRequests: React.FC = () => {
  const { showToast } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeReq, setActiveReq] = useState<ServiceRequest | null>(null);
  const [notes, setNotes] = useState('');
  const [statusAction, setStatusAction] = useState<'In Progress' | 'Resolved' | 'Rejected'>('Resolved');

  useEffect(() => {
    fakeApi.getServiceRequests().then(res => {
      // Filter requests relevant to Student Affairs
      setRequests(res.filter(r => r.department === 'Student Affairs' || !r.department));
      setLoading(false);
    });
  }, []);

  if (loading) return <CardSkeleton count={4} />;

  const handleProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReq) return;

    if (statusAction === 'Rejected' && !notes.trim()) {
      showToast('A formal rejection reason is mandatory.', 'error');
      return;
    }

    const updated = await fakeApi.processAdminServiceRequest(activeReq.id, statusAction, notes);
    setRequests(prev => prev.map(r => r.id === activeReq.id ? updated : r));
    showToast(`Request ${activeReq.id} marked as ${statusAction}.`, 'success');
    setActiveReq(null);
    setNotes('');
  };

  return (
    <div>
      <PageHead
        title="Student Affairs Service Requests Queue"
        subtitle="Review, verify, fulfill and issue official academic certificates and petitions"
        breadcrumbs={[
          { label: 'Employee Portal', href: '#/employee/dashboard' },
          { label: 'Requests Queue' }
        ]}
      />

      <div className="card">
        <div className="card-head">
          <h3>Active Applications Queue</h3>
          <span className="badge badge-primary">{requests.length} Requests Assigned</span>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Student Name</th>
                <th>Code</th>
                <th>Request Type</th>
                <th>Subject</th>
                <th>Submitted</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.id}>
                  <td><code>{r.id}</code></td>
                  <td className="bold">{r.studentName}</td>
                  <td><code>{r.studentCode}</code></td>
                  <td><span className="badge badge-primary">{r.type}</span></td>
                  <td>{r.subject}</td>
                  <td className="text-xs sub">{r.submittedDate}</td>
                  <td>
                    <span className={`badge ${
                      r.status === 'Resolved' ? 'badge-success' :
                      r.status === 'In Progress' ? 'badge-info' : 'badge-warning'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => { setActiveReq(r); setStatusAction('Resolved'); }}
                    >
                      Process
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {activeReq && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-head">
              <h3>Process Request · {activeReq.id}</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setActiveReq(null)}>
                <Icon name="x" />
              </button>
            </div>
            <form onSubmit={handleProcess} className="p-5">
              <p className="sub text-xs mb-2">Student: <strong>{activeReq.studentName}</strong> ({activeReq.studentCode})</p>
              <p className="sub text-xs mb-4">Subject: <strong>{activeReq.subject}</strong></p>

              <div className="form-group mb-4">
                <label className="form-label">Set Status</label>
                <div className="row gap-2">
                  {(['In Progress', 'Resolved', 'Rejected'] as const).map(act => (
                    <button
                      key={act}
                      type="button"
                      className={`btn btn-sm flex-1 ${statusAction === act ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setStatusAction(act)}
                    >
                      {act}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group mb-5">
                <label className="form-label">
                  {statusAction === 'Rejected' ? 'Mandatory Reason' : 'Processing / Delivery Notes'}
                </label>
                <textarea
                  className="textarea"
                  rows={3}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder={statusAction === 'Rejected' ? 'Specify reason...' : 'e.g. Official stamp applied and certificate ready at counter.'}
                  required={statusAction === 'Rejected'}
                />
              </div>

              <div className="row-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => setActiveReq(null)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn ${statusAction === 'Rejected' ? 'btn-danger' : statusAction === 'Resolved' ? 'btn-success' : 'btn-primary'}`}
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
