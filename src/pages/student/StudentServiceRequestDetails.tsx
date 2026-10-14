import React from 'react';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';

export const StudentServiceRequestDetails: React.FC = () => {
  const request = {
    id: 'REQ-24101',
    type: 'Official Academic Transcript',
    department: 'Student Affairs',
    subject: 'Request for Sealed English Transcript for Graduate Internship',
    submittedDate: 'Oct 08, 2026',
    status: 'Resolved',
    resolvedDate: 'Oct 11, 2026',
    resolutionNotes: 'Official English transcript sealed, certified by Dean Office, and ready at Student Affairs counter #3.',
    attachmentName: 'internship_offer_letter.pdf',
    description: 'Applying for the summer research fellowship. Requires sealed official credit-hour transcript with college stamp.',
    timeline: [
      { title: 'Application Submitted', date: 'Oct 08, 2026 · 10:14 AM', actor: 'Ahmed Mohamed Hassan (Student)', status: 'Done' },
      { title: 'Identity & Fee Verification', date: 'Oct 09, 2026 · 11:30 AM', actor: 'Salma Ibrahim (Student Affairs)', status: 'Done' },
      { title: 'Executive Seal & Signature', date: 'Oct 10, 2026 · 02:15 PM', actor: 'Dean Executive Administration', status: 'Done' },
      { title: 'Resolved & Ready for Collection', date: 'Oct 11, 2026 · 09:00 AM', actor: 'Counter Service', status: 'Done' }
    ]
  };

  return (
    <div>
      <PageHead
        title={`Screen 30: Service Request Tracking · ${request.id}`}
        subtitle={`${request.type} · ${request.department}`}
        breadcrumbs={[
          { label: 'Student Portal', href: '#/student/dashboard' },
          { label: 'Service Requests', href: '#/student/service-requests' },
          { label: request.id }
        ]}
      />

      <div className="grid g-3 mb-6">
        <div className="col-span-2">
          {/* Main Request Information */}
          <div className="card p-5 mb-5">
            <div className="row-between mb-2">
              <span className="badge badge-primary">{request.type}</span>
              <span className="badge badge-success">{request.status}</span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{request.subject}</h3>
            <p className="sub leading-relaxed mb-4">{request.description}</p>

            <div className="card p-3 row-between" style={{ background: 'var(--color-bg-page)' }}>
              <div className="row gap-2">
                <Icon name="file" />
                <div>
                  <span className="sub text-xs block">Attached Supporting Document:</span>
                  <strong className="text-sm">{request.attachmentName}</strong>
                </div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => alert('Viewing attachment...')}>
                <Icon name="eye" /> View File
              </button>
            </div>
          </div>

          {/* Official Resolution Notes */}
          {request.resolutionNotes && (
            <div className="card p-4" style={{ background: '#ecfdf5', border: '1px solid #10b981' }}>
              <div className="row gap-2 mb-1">
                <Icon name="checkCircle" style={{ color: 'var(--color-success)' }} />
                <strong style={{ color: '#065f46' }}>Official Fulfillment &amp; Resolution:</strong>
              </div>
              <p className="sub leading-relaxed text-sm" style={{ color: '#047857' }}>
                {request.resolutionNotes}
              </p>
              <div className="sub text-xs mt-2" style={{ color: '#059669' }}>
                Resolved Date: {request.resolvedDate}
              </div>
            </div>
          )}
        </div>

        <div>
          {/* Lifecycle Timeline */}
          <div className="card p-5">
            <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px' }}>Status Lifecycle Timeline</h4>
            <div className="stack gap-3">
              {request.timeline.map((item, idx) => (
                <div key={idx} className="card p-3 border" style={{ background: '#fff' }}>
                  <div className="row-between mb-1">
                    <strong className="text-xs">{item.title}</strong>
                    <span className="badge badge-success text-xs">Completed</span>
                  </div>
                  <div className="sub text-xs">{item.actor}</div>
                  <div className="sub text-xs mt-1" style={{ fontSize: '11px' }}>{item.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
