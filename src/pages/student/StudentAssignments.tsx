import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { useAuth } from '../../context/AuthContext';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { Modal } from '../../components/common/Modal';
import type { Assignment } from '../../types';

export const StudentAssignments: React.FC = () => {
  const { showToast } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'all' | 'pending' | 'submitted' | 'graded' | 'overdue'>('all');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  // File upload state in modal
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    fakeApi.getAssignments(tab).then(res => {
      setAssignments(res);
      setLoading(false);
    });
  }, [tab]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      setUploadError('File size exceeds the 20MB limit.');
      return;
    }
    setUploadFile(file);
    setUploadError(null);
  };

  const handleSubmitDeliverable = async () => {
    if (!selectedAssignment || !uploadFile) {
      setUploadError('Please select a file archive or solution document first.');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(25);

    const interval = setInterval(() => {
      setUploadProgress(p => {
        if (p >= 90) {
          clearInterval(interval);
          return 90;
        }
        return p + 25;
      });
    }, 150);

    try {
      const updated = await fakeApi.submitAssignment(selectedAssignment.id, uploadFile.name);
      clearInterval(interval);
      setUploadProgress(100);
      setSelectedAssignment(updated);
      setAssignments(prev => prev.map(a => a.id === updated.id ? updated : a));
      showToast('Assignment Submitted', 'Your coursework has been uploaded to the instructor.', 'success');
    } catch (err: any) {
      setUploadError(err?.message || 'Upload failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: Assignment['status']) => {
    switch (status) {
      case 'Graded':
        return <span className="badge b-success no-dot">Graded</span>;
      case 'Submitted':
        return <span className="badge b-info">Submitted</span>;
      case 'Pending':
        return <span className="badge b-warning">Pending</span>;
      case 'Overdue':
        return <span className="badge b-danger">Overdue</span>;
      default:
        return <span className="badge b-neutral">{status}</span>;
    }
  };

  return (
    <div>
      <PageHead
        title="Assignments &amp; Deliverables"
        desc="Coursework submissions for Fall 2026. Submit deliverables directly to instructors and TAs."
        crumbs={[['Student Portal', '#/student/dashboard'], ['Assignments']]}
      />

      {/* Tabs Row */}
      <div className="row-between mb-4 wrap gap-2">
        <div className="tabs" role="tablist">
          <button
            type="button"
            className={`tab ${tab === 'all' ? 'active' : ''}`}
            onClick={() => setTab('all')}
          >
            All Assignments <span className="count">5</span>
          </button>
          <button
            type="button"
            className={`tab ${tab === 'pending' ? 'active' : ''}`}
            onClick={() => setTab('pending')}
          >
            Pending <span className="count">1</span>
          </button>
          <button
            type="button"
            className={`tab ${tab === 'submitted' ? 'active' : ''}`}
            onClick={() => setTab('submitted')}
          >
            Submitted <span className="count">1</span>
          </button>
          <button
            type="button"
            className={`tab ${tab === 'graded' ? 'active' : ''}`}
            onClick={() => setTab('graded')}
          >
            Graded <span className="count">3</span>
          </button>
          <button
            type="button"
            className={`tab ${tab === 'overdue' ? 'active' : ''}`}
            onClick={() => setTab('overdue')}
          >
            Overdue <span className="count">0</span>
          </button>
        </div>
      </div>

      {/* Assignments Table */}
      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Assignment Title</th>
                <th>Scope</th>
                <th>Deadline</th>
                <th>Total Marks</th>
                <th>Status</th>
                <th>Grade</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map(a => (
                <tr key={a.id}>
                  <td><span className="badge b-navy no-dot">{a.courseCode}</span></td>
                  <td><b>{a.title}</b></td>
                  <td><span className="text-xs muted">{a.scope}</span></td>
                  <td>
                    <span className={a.status === 'Pending' ? 'trend-down fw-6' : ''}>{a.dueDate}</span>
                  </td>
                  <td>{a.totalMarks} Marks</td>
                  <td>{getStatusBadge(a.status)}</td>
                  <td><b>{a.grade || '—'}</b></td>
                  <td>
                    <button
                      type="button"
                      className={`btn btn-sm ${a.status === 'Pending' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => {
                        setSelectedAssignment(a);
                        setUploadFile(null);
                        setUploadProgress(0);
                        setUploadError(null);
                      }}
                    >
                      {a.status === 'Pending' ? 'Submit' : 'View'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assignment Details & Upload Modal */}
      {selectedAssignment && (
        <Modal
          isOpen={!!selectedAssignment}
          onClose={() => setSelectedAssignment(null)}
          title={selectedAssignment.title}
          subtitle={`${selectedAssignment.courseCode} · ${selectedAssignment.courseName}`}
          iconName="clipboard"
          tone="info"
          size="lg"
          footer={
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setSelectedAssignment(null)}
            >
              Close
            </button>
          }
        >
          <div className="col gap-4">
            <div className="row-between">
              <span className="badge b-navy no-dot">{selectedAssignment.courseCode}</span>
              {getStatusBadge(selectedAssignment.status)}
            </div>

            <p className="text-sm muted">{selectedAssignment.description}</p>

            <div className="grid g-3 text-xs info-tile">
              <div><span className="muted">Deadline:</span><br /><b>{selectedAssignment.dueDate}</b></div>
              <div><span className="muted">Max Score:</span><br /><b>{selectedAssignment.totalMarks} Marks</b></div>
              <div><span className="muted">Scope:</span><br /><b>{selectedAssignment.scope}</b></div>
            </div>

            {/* If already graded, show grade & feedback */}
            {selectedAssignment.status === 'Graded' && (
              <div className="alert alert-success">
                <Icon name="checkCircle" />
                <div>
                  <b>Awarded Grade: {selectedAssignment.grade}</b>
                  <p>{selectedAssignment.feedback}</p>
                </div>
              </div>
            )}

            {/* If submitted, show submitted file */}
            {selectedAssignment.submittedFiles && selectedAssignment.submittedFiles.length > 0 && (
              <div>
                <h4 className="text-sm fw-6 mb-2">Uploaded Deliverables:</h4>
                {selectedAssignment.submittedFiles.map((f, idx) => (
                  <div key={idx} className="file-row">
                    <div className="file-ico zip">ZIP</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <b style={{ fontSize: '13px' }}>{f.name}</b>
                      <span className="text-xs muted block">{f.size} • Uploaded {f.date}</span>
                    </div>
                    <span className="badge b-success no-dot">Verified Upload</span>
                  </div>
                ))}
              </div>
            )}

            {/* Upload form for Pending or Re-submission */}
            {selectedAssignment.status !== 'Graded' && (
              <div className="col gap-3 mt-2">
                <h4 className="text-sm fw-6">Submit Your Solution:</h4>
                {uploadError && (
                  <div className="alert alert-danger" style={{ padding: '8px 12px', fontSize: '12px' }}>
                    <Icon name="alertCircle" size="sm" />
                    <span>{uploadError}</span>
                  </div>
                )}

                <label className="upload">
                  <div className="u-ico"><Icon name="uploadCloud" size="lg" /></div>
                  <b>{uploadFile ? uploadFile.name : 'Choose archive file or drag & drop'}</b>
                  <p className="text-xs muted mt-1">Accepts .zip, .tar.gz, .pdf (Max 20MB)</p>
                  <input
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    accept=".zip,.tar.gz,.pdf,.py,.cpp,.ipynb"
                  />
                </label>

                {uploadProgress > 0 && (
                  <div>
                    <div className="row-between text-xs mb-1">
                      <span>Upload Progress</span>
                      <b>{uploadProgress}%</b>
                    </div>
                    <div className="progress success thin">
                      <span style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  onClick={handleSubmitDeliverable}
                  disabled={!uploadFile || isSubmitting}
                >
                  {isSubmitting ? 'Uploading…' : 'Submit Assignment Deliverable'}
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
