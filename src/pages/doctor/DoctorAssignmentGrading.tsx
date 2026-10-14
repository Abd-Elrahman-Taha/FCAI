import React, { useState } from 'react';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';
import { fakeApi } from '../../services/fakeApi';

export const DoctorAssignmentGrading: React.FC = () => {
  const { showToast } = useAuth();
  const [marks, setMarks] = useState<number>(14);
  const [rubricScore1, setRubricScore1] = useState(5); // Correctness
  const [rubricScore2, setRubricScore2] = useState(5); // Time Complexity
  const [rubricScore3, setRubricScore3] = useState(4); // Code Quality
  const [feedback, setFeedback] = useState('Excellent bottom-up table construction. Recurrence proof is clean.');

  const submission = {
    id: 'sub2',
    studentCode: '2021170112',
    studentName: 'Mariam Ahmed Saeed',
    assignment: 'Assignment 3: Dynamic Programming Implementations',
    courseCode: 'CS301',
    submittedAt: 'Oct 09, 2026 · 02:45 PM',
    file: 'mariam_saeed_ass3.zip',
    maxMarks: 15
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const totalAwarded = rubricScore1 + rubricScore2 + rubricScore3;
    await fakeApi.gradeSubmission(submission.id, totalAwarded, feedback);
    showToast(`Graded submission for ${submission.studentName}: ${totalAwarded}/${submission.maxMarks}`, 'success');
    window.location.hash = '#/doctor/submissions';
  };

  return (
    <div>
      <PageHead
        title="Screen 49: Assignment Submission Grading"
        subtitle={`Student: ${submission.studentName} (${submission.studentCode}) · ${submission.assignment}`}
        breadcrumbs={[
          { label: 'Doctor Portal', href: '#/doctor/dashboard' },
          { label: 'Submissions', href: '#/doctor/submissions' },
          { label: 'Grading' }
        ]}
      />

      <div className="grid g-3 mb-6" style={{ maxWidth: '920px' }}>
        <div className="col-span-2">
          {/* Submission Info and Code Artifact */}
          <div className="card p-5 mb-5">
            <div className="row-between mb-2">
              <span className="badge badge-primary">{submission.courseCode}</span>
              <span className="sub text-xs">Submitted: {submission.submittedAt}</span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>{submission.studentName}</h3>
            <p className="sub text-xs mb-4">File Artifact: <code>{submission.file}</code></p>

            <div className="card p-4 row-between" style={{ background: 'var(--color-bg-page)' }}>
              <div className="row gap-2">
                <Icon name="file" />
                <div>
                  <strong className="text-sm block">{submission.file}</strong>
                  <span className="sub text-xs">ZIP archive containing Python scripts and unit tests</span>
                </div>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => showToast('Opening submission file viewer...', 'info')}>
                <Icon name="download" /> Inspect Code
              </button>
            </div>
          </div>

          {/* Rubric Evaluation Form */}
          <div className="card p-5">
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px' }}>Grading Rubric (Max: 15 pts)</h3>
            <form onSubmit={handleSave}>
              <div className="stack gap-4 mb-5">
                <div className="card p-3" style={{ background: 'var(--color-bg-page)' }}>
                  <div className="row-between mb-2">
                    <div>
                      <strong className="text-sm block">1. Algorithm Correctness (Max: 5 pts)</strong>
                      <span className="sub text-xs">Accurate memoization recurrence and edge cases</span>
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={5}
                      className="input"
                      style={{ width: '80px' }}
                      value={rubricScore1}
                      onChange={e => setRubricScore1(parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="card p-3" style={{ background: 'var(--color-bg-page)' }}>
                  <div className="row-between mb-2">
                    <div>
                      <strong className="text-sm block">2. Complexity Proof &amp; Benchmarks (Max: 5 pts)</strong>
                      <span className="sub text-xs">O(n·W) pseudo-polynomial time analysis</span>
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={5}
                      className="input"
                      style={{ width: '80px' }}
                      value={rubricScore2}
                      onChange={e => setRubricScore2(parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="card p-3" style={{ background: 'var(--color-bg-page)' }}>
                  <div className="row-between mb-2">
                    <div>
                      <strong className="text-sm block">3. Code Quality &amp; Cleanliness (Max: 5 pts)</strong>
                      <span className="sub text-xs">Modular functions, docstrings, and tests</span>
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={5}
                      className="input"
                      style={{ width: '80px' }}
                      value={rubricScore3}
                      onChange={e => setRubricScore3(parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group mb-5">
                <label className="form-label">Doctor Feedback to Student</label>
                <textarea
                  className="textarea"
                  rows={3}
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                />
              </div>

              <div className="row-between pt-3 border-t">
                <a href="#/doctor/submissions" className="btn btn-secondary">Cancel</a>
                <button type="submit" className="btn btn-primary">
                  <Icon name="checkCircle" /> Save Grade ({rubricScore1 + rubricScore2 + rubricScore3} / 15)
                </button>
              </div>
            </form>
          </div>
        </div>

        <div>
          {/* Summary Box */}
          <div className="card p-5" style={{ position: 'sticky', top: '90px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Evaluation Total</h4>
            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-primary)' }}>
              {rubricScore1 + rubricScore2 + rubricScore3} <small style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>/ 15 pts</small>
            </div>
            <span className="badge badge-success mt-2">Will sync to Master Gradebook</span>
          </div>
        </div>
      </div>
    </div>
  );
};
