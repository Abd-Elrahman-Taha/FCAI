import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

export const StudentAssignmentDetails: React.FC = () => {
  const { showToast } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fileSelected, setFileSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fakeApi.getAssignmentDetails('a3').then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) return <CardSkeleton count={4} />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileSelected) {
      showToast('Please select a file to submit.', 'error');
      return;
    }
    setSubmitting(true);
    await fakeApi.submitAssignment(data.id, fileSelected);
    setData((prev: any) => ({
      ...prev,
      previousSubmission: {
        file: fileSelected,
        submittedAt: 'Just now (Updated)',
        fileSize: '3.1 MB',
        grade: null,
        feedback: null
      }
    }));
    setSubmitting(false);
    setFileSelected(null);
    showToast('Assignment submitted successfully!', 'success');
  };

  return (
    <div>
      <PageHead
        title={`Screen 18: Assignment Submission · ${data.courseCode}`}
        subtitle={`${data.title} · Due: ${data.dueDate}`}
        breadcrumbs={[
          { label: 'Student Portal', href: '#/student/dashboard' },
          { label: 'Assignments', href: '#/student/assignments' },
          { label: 'Details & Submission' }
        ]}
      />

      <div className="grid g-3 mb-6">
        <div className="col-span-2">
          {/* Instructions Card */}
          <div className="card p-5 mb-5">
            <div className="row-between mb-2">
              <span className="badge badge-primary">{data.weight}</span>
              <span className="badge badge-warning">Due {data.dueDate}</span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>{data.title}</h3>
            <p className="sub leading-relaxed mb-4">{data.instructions}</p>

            <div className="card p-4 row-between" style={{ background: 'var(--color-bg-page)' }}>
              <div className="row gap-2">
                <Icon name="file" />
                <div>
                  <strong className="text-sm block">Official Assignment Template / Skeleton</strong>
                  <span className="sub text-xs">{data.attachedTemplate}</span>
                </div>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => showToast('Downloading template...', 'info')}>
                <Icon name="download" /> Download Starter Code
              </button>
            </div>
          </div>

          {/* Submission Uploader Form */}
          <div className="card p-5">
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px' }}>Submit Your Solution</h3>
            <form onSubmit={handleSubmit}>
              <div
                className="file-drop-area p-8 text-center border-dashed rounded mb-4"
                style={{
                  border: '2px dashed var(--color-border)',
                  background: fileSelected ? 'var(--color-bg-subtle)' : '#fff',
                  cursor: 'pointer'
                }}
                onClick={() => setFileSelected('ahmed_hassan_algo_ass3_final.zip')}
              >
                <Icon name="upload" size="lg" className="mx-auto mb-2 text-primary" />
                {fileSelected ? (
                  <div>
                    <strong className="text-primary block">{fileSelected}</strong>
                    <span className="sub text-xs">File ready to submit (Click to replace)</span>
                  </div>
                ) : (
                  <div>
                    <strong className="block text-sm">Click or drag your assignment .ZIP / .PDF here</strong>
                    <span className="sub text-xs">Maximum file size: 25 MB</span>
                  </div>
                )}
              </div>

              <div className="row-end gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting || !fileSelected}
                >
                  <Icon name="checkCircle" /> {submitting ? 'Uploading...' : 'Submit Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div>
          {/* Previous Submission Status */}
          <div className="card p-5 mb-5">
            <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Current Submission Status</h4>
            {data.previousSubmission ? (
              <div className="stack gap-3 text-sm">
                <div className="badge badge-success">Submitted for Grading</div>
                <div className="pb-2 border-b">
                  <span className="sub text-xs block">Submitted File:</span>
                  <code className="text-primary font-bold">{data.previousSubmission.file}</code>
                </div>
                <div className="pb-2 border-b">
                  <span className="sub text-xs block">Submission Timestamp:</span>
                  <span>{data.previousSubmission.submittedAt}</span>
                </div>
                <div>
                  <span className="sub text-xs block">Evaluation Grade:</span>
                  <strong>{data.previousSubmission.grade !== null ? `${data.previousSubmission.grade} / ${data.maxGrade}` : 'Pending Doctor / TA Review'}</strong>
                </div>
              </div>
            ) : (
              <p className="sub text-xs">No previous submission uploaded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
