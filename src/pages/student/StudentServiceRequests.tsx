import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { useAuth } from '../../context/AuthContext';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { Modal } from '../../components/common/Modal';
import type { ServiceRequest } from '../../types';

export const StudentServiceRequests: React.FC = () => {
  const { showToast } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);

  // Form State
  const [reqType, setReqType] = useState<ServiceRequest['type']>('Transcript');
  const [department, setDepartment] = useState('Student Affairs');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [otherDescription, setOtherDescription] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadRequests = () => {
    setLoading(true);
    fakeApi.getServiceRequests().then(res => {
      setRequests(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reqType === 'Other' && !otherDescription.trim()) {
      setFormError('When selecting "Other", the detailed Other Request Description is required by regulation.');
      return;
    }
    if (!subject.trim() || !description.trim()) {
      setFormError('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const created = await fakeApi.createServiceRequest({
        type: reqType,
        department,
        subject,
        description,
        otherDescription: reqType === 'Other' ? otherDescription : undefined,
        attachmentName: attachment ? attachment.name : undefined
      });
      showToast('Request Created', `Ticket ${created.id} submitted to ${department}.`, 'success');
      setIsCreateModalOpen(false);
      setSubject('');
      setDescription('');
      setOtherDescription('');
      setAttachment(null);
      loadRequests();
    } catch (err: any) {
      setFormError(err?.message || 'Failed to submit request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelRequest = async (id: string) => {
    const ok = await fakeApi.cancelServiceRequest(id);
    if (ok) {
      showToast('Request Cancelled', `Ticket ${id} has been cancelled.`);
      loadRequests();
      if (selectedRequest?.id === id) {
        setSelectedRequest(prev => prev ? { ...prev, status: 'Cancelled' } : null);
      }
    }
  };

  const getStatusBadge = (status: ServiceRequest['status']) => {
    switch (status) {
      case 'Resolved':
        return <span className="badge b-success no-dot">Resolved</span>;
      case 'In Progress':
        return <span className="badge b-info">In Progress</span>;
      case 'Pending':
        return <span className="badge b-warning">Pending Review</span>;
      case 'Rejected':
        return <span className="badge b-danger">Rejected</span>;
      case 'Cancelled':
      default:
        return <span className="badge b-neutral">Cancelled</span>;
    }
  };

  return (
    <div>
      <PageHead
        title="Student Service Requests"
        desc="Submit official administrative petitions, transcripts, certificate requests, and student inquiries."
        crumbs={[['Student Portal', '#/student/dashboard'], ['Service Requests']]}
        actions={
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setIsCreateModalOpen(true);
              setFormError(null);
            }}
          >
            <Icon name="plus" /> Submit New Request
          </button>
        }
      />

      {/* Requests Table */}
      <div className="card">
        <div className="card-head">
          <div>
            <h3><Icon name="inbox" size="sm" /> My Service Tickets ({requests.length})</h3>
            <p>Track processing progress and handler notes in real time.</p>
          </div>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Category</th>
                <th>Assigned Department</th>
                <th>Subject</th>
                <th>Submitted Date</th>
                <th>Current Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req.id}>
                  <td><b className="mono">{req.id}</b></td>
                  <td><span className="badge b-navy no-dot">{req.type}</span></td>
                  <td>{req.department}</td>
                  <td><b>{req.subject}</b></td>
                  <td>{req.submittedDate}</td>
                  <td>{getStatusBadge(req.status)}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedRequest(req)}
                    >
                      Track Ticket
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Request Modal */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create Student Service Request"
          subtitle="Direct ticket dispatched to responsible College department"
          iconName="inbox"
          tone="info"
          size="lg"
          footer={
            <div className="row gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCreateSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting Ticket…' : 'Submit Service Request'}
              </button>
            </div>
          }
        >
          <form className="col gap-4 text-sm" onSubmit={handleCreateSubmit}>
            {formError && (
              <div className="alert alert-danger">
                <Icon name="alertCircle" size="sm" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid g-2">
              <div className="field">
                <label className="label">Request Type <span className="req">*</span></label>
                <select
                  className="select"
                  value={reqType}
                  onChange={e => setReqType(e.target.value as any)}
                >
                  <option value="Transcript">Transcript (Official Transcript)</option>
                  <option value="Student Card">Student Card (ID Replacement)</option>
                  <option value="Certificate">Certificate (Enrollment Proof)</option>
                  <option value="Complaint">Complaint / Academic Grievance</option>
                  <option value="Other">Other Administrative Request</option>
                </select>
              </div>

              <div className="field">
                <label className="label">Receiving Department <span className="req">*</span></label>
                <select
                  className="select"
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                >
                  <option value="Student Affairs">Student Affairs Department</option>
                  <option value="Financial Affairs">Financial Affairs Unit</option>
                  <option value="Examinations Control">Examinations Control Committee</option>
                  <option value="IT Services">Faculty IT Services</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label className="label">Subject Summary <span className="req">*</span></label>
              <input
                className="input"
                placeholder="Brief summary of your request"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label className="label">Detailed Explanation <span className="req">*</span></label>
              <textarea
                className="textarea"
                placeholder="Provide complete justification and specifics…"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Conditional field if Type = Other */}
            {reqType === 'Other' && (
              <div className="field" style={{ background: 'var(--blue-50)', padding: '14px', borderRadius: '10px' }}>
                <label className="label" style={{ color: 'var(--navy-900)' }}>
                  Other Request Description <span className="req">* (Mandatory by By-law)</span>
                </label>
                <textarea
                  className="textarea"
                  placeholder="Specify the exact nature and regulatory justification for this custom request…"
                  value={otherDescription}
                  onChange={e => setOtherDescription(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="field">
              <label className="label">Supporting Document Attachment (Optional Single PDF)</label>
              <input
                type="file"
                className="input"
                style={{ paddingTop: '8px' }}
                accept=".pdf,.png,.jpg"
                onChange={e => setAttachment(e.target.files?.[0] || null)}
              />
            </div>
          </form>
        </Modal>
      )}

      {/* Ticket Details & Tracking Modal */}
      {selectedRequest && (
        <Modal
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          title={`Ticket ${selectedRequest.id}`}
          subtitle={`${selectedRequest.type} • Assigned to ${selectedRequest.department}`}
          iconName="inbox"
          tone="info"
          size="md"
          footer={
            <div className="row gap-2">
              {selectedRequest.status === 'Pending' && (
                <button
                  type="button"
                  className="btn btn-danger-soft"
                  onClick={() => handleCancelRequest(selectedRequest.id)}
                >
                  Cancel Request (Only while Pending)
                </button>
              )}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedRequest(null)}
              >
                Close
              </button>
            </div>
          }
        >
          <div className="col gap-4 text-sm">
            <div className="row-between">
              <span className="badge b-navy no-dot">{selectedRequest.type}</span>
              {getStatusBadge(selectedRequest.status)}
            </div>

            <div className="info-tile">
              <small>Subject</small>
              <b style={{ fontSize: '15px' }}>{selectedRequest.subject}</b>
              <p className="text-xs muted mt-2">{selectedRequest.description}</p>
            </div>

            {selectedRequest.otherDescription && (
              <div className="info-tile" style={{ background: 'var(--blue-50)' }}>
                <small>Other Custom Specification</small>
                <p className="text-xs">{selectedRequest.otherDescription}</p>
              </div>
            )}

            <div className="kv text-xs">
              <dt>Assigned Department:</dt>
              <dd>{selectedRequest.department}</dd>
              <dt>Submitted Date:</dt>
              <dd>{selectedRequest.submittedDate}</dd>
              <dt>Assigned Handler:</dt>
              <dd>{selectedRequest.handlerName || 'Pending queue assignment'}</dd>
              {selectedRequest.resolvedDate && (
                <>
                  <dt>Resolved On:</dt>
                  <dd className="trend-up fw-7">{selectedRequest.resolvedDate}</dd>
                  <dt>Resolution Notes:</dt>
                  <dd>{selectedRequest.resolutionNotes}</dd>
                </>
              )}
              {selectedRequest.rejectionReason && (
                <>
                  <dt>Rejection Reason:</dt>
                  <dd className="trend-down fw-7">{selectedRequest.rejectionReason}</dd>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
