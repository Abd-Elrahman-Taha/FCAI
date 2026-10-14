import React, { useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';
import type { ServiceRequest } from '../../types';

export const StudentCreateServiceRequest: React.FC = () => {
  const { showToast } = useAuth();
  const [type, setType] = useState<ServiceRequest['type']>('Enrollment Certificate');
  const [department, setDepartment] = useState('Student Affairs');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [otherDescription, setOtherDescription] = useState('');
  const [attachment, setAttachment] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      showToast('Please provide both subject and detailed description.', 'error');
      return;
    }
    if (type === 'Other' && !otherDescription.trim()) {
      showToast('Mandatory clarification is required when selecting Other.', 'error');
      return;
    }

    setSubmitting(true);
    const newReq = await fakeApi.createServiceRequest({
      type,
      department,
      subject,
      description,
      otherDescription: type === 'Other' ? otherDescription : undefined,
      attachmentName: attachment || undefined
    });
    setSubmitting(false);
    showToast(`Service request ${newReq.id} submitted successfully!`, 'success');
    window.location.hash = '#/student/service-requests';
  };

  return (
    <div>
      <PageHead
        title="Screen 29: Create Official Service Request"
        subtitle="Submit administrative petitions, transcript requests, medical excuse reviews, or inquiries"
        breadcrumbs={[
          { label: 'Student Portal', href: '#/student/dashboard' },
          { label: 'Service Requests', href: '#/student/service-requests' },
          { label: 'Create Request' }
        ]}
      />

      <div className="card p-6 mb-6" style={{ maxWidth: '780px' }}>
        <form onSubmit={handleSubmit}>
          <div className="grid g-2 mb-3">
            <div className="form-group">
              <label className="form-label">Request Type</label>
              <select
                className="select"
                value={type}
                onChange={e => setType(e.target.value as any)}
              >
                <option value="Enrollment Certificate">Enrollment Certificate</option>
                <option value="Official Transcript">Official Academic Transcript</option>
                <option value="Medical Excuse">Medical Attendance Excuse</option>
                <option value="Course Registration Petition">Course Registration Petition</option>
                <option value="Tuition Fee Installment">Tuition Fee Installment Inquiry</option>
                <option value="Military Status Certificate">Military Status Certificate</option>
                <option value="Other">Other (Requires Detailed Purpose)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Target Administrative Department</label>
              <select
                className="select"
                value={department}
                onChange={e => setDepartment(e.target.value)}
              >
                <option value="Student Affairs">Student Affairs Department</option>
                <option value="Dean Executive Office">Dean Executive Office</option>
                <option value="Youth Care & Activities">Youth Care &amp; Activities</option>
                <option value="Financial & Tuition Affairs">Financial &amp; Tuition Affairs</option>
              </select>
            </div>
          </div>

          {type === 'Other' && (
            <div className="form-group mb-3">
              <label className="form-label">
                Specify Custom Request Purpose <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="input"
                placeholder="Clearly state what document or exemption is requested..."
                value={otherDescription}
                onChange={e => setOtherDescription(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group mb-3">
            <label className="form-label">Subject</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Request for Bilingual Graduation Verification Certificate"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-4">
            <label className="form-label">Detailed Request Body / Justification</label>
            <textarea
              className="textarea"
              rows={4}
              placeholder="Provide all background information required for administrative review..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-5">
            <label className="form-label">Supporting Evidence / Attachment (Optional PDF/JPG &lt; 10MB)</label>
            <div
              className="file-drop-area p-5 text-center border-dashed rounded"
              style={{
                border: '1px dashed var(--color-border)',
                background: attachment ? 'var(--color-bg-subtle)' : '#fff',
                cursor: 'pointer'
              }}
              onClick={() => setAttachment('hospital_excuse_report_oct2026.pdf')}
            >
              <Icon name="upload" size="md" className="mx-auto mb-1 text-primary" />
              {attachment ? (
                <div>
                  <strong className="text-primary block text-xs">{attachment}</strong>
                  <span className="sub text-xs">Attached (Click to change)</span>
                </div>
              ) : (
                <div>
                  <strong className="block text-xs">Click or drag medical reports or supporting letters here</strong>
                  <span className="sub text-xs">PDF, PNG, JPG accepted</span>
                </div>
              )}
            </div>
          </div>

          <div className="row-between pt-3 border-t">
            <a href="#/student/service-requests" className="btn btn-secondary">Cancel</a>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              <Icon name="checkCircle" /> {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
