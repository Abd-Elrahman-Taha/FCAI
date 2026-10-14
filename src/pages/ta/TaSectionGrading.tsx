import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

export const TaSectionGrading: React.FC = () => {
  const { showToast } = useAuth();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string>('');
  const [gradeInput, setGradeInput] = useState<number | string>('');
  const [feedbackInput, setFeedbackInput] = useState<string>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fakeApi.getTaSectionSubmissions('sec1').then(res => {
      setSubmissions(res);
      if (res.length > 0) {
        setSelectedId(res[0].id);
        setGradeInput(res[0].grade ?? '');
        setFeedbackInput(res[0].notes ?? '');
      }
      setLoading(false);
    });
  }, []);

  const activeSub = submissions.find(s => s.id === selectedId) || submissions[0];

  const handleSelectSub = (sub: any) => {
    setSelectedId(sub.id);
    setGradeInput(sub.grade ?? '');
    setFeedbackInput(sub.notes ?? '');
  };

  const handleSaveGrade = async () => {
    if (gradeInput === '' || isNaN(Number(gradeInput))) {
      showToast('Please enter a valid numeric grade.', 'warning');
      return;
    }
    const score = Number(gradeInput);
    if (score < 0 || score > (activeSub?.maxGrade || 10)) {
      showToast(`Grade must be between 0 and ${activeSub?.maxGrade || 10}.`, 'warning');
      return;
    }

    setSaving(true);
    await fakeApi.saveTaSectionGrade(activeSub.id, score, feedbackInput);
    setSubmissions(prev =>
      prev.map(s => s.id === activeSub.id ? { ...s, grade: score, notes: feedbackInput, status: 'Graded' } : s)
    );
    setSaving(false);
    showToast(`Saved grade for ${activeSub.studentName}: ${score} / ${activeSub.maxGrade}`, 'success');
  };

  if (loading) return <CardSkeleton count={4} />;

  return (
    <div>
      <PageHead
        title="Screen 70: Practical Lab Submission Grading & Feedback"
        subtitle="Review student source code, evaluate algorithmic correctness, and submit lab marks"
        breadcrumbs={[
          { label: 'TA Portal', href: '#/ta/dashboard' },
          { label: 'Exercises', href: '#/ta/section-assignments' },
          { label: 'Screen 70: Lab Grading' }
        ]}
        actions={
          <div className="row gap-2">
            <a href="#/ta/section-assignments" className="btn btn-secondary">
              <Icon name="arrowLeft" /> Back to Exercises (Screen 69)
            </a>
          </div>
        }
      />

      <div className="grid g-3 mb-4" style={{ gridTemplateColumns: '1fr 2fr' }}>
        {/* Left Column: Submissions Queue */}
        <div className="card p-4">
          <div className="row-between mb-3 border-b pb-2">
            <h3>Submissions Queue</h3>
            <span className="badge badge-primary">{submissions.length} Total</span>
          </div>

          <div className="stack gap-2">
            {submissions.map(s => {
              const isSelected = s.id === selectedId;
              const isGraded = s.status === 'Graded';
              return (
                <div
                  key={s.id}
                  onClick={() => handleSelectSub(s)}
                  className={`card p-3 cursor-pointer transition ${isSelected ? 'border-primary' : ''}`}
                  style={{
                    background: isSelected ? 'var(--color-bg-page)' : 'transparent',
                    border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)'
                  }}
                >
                  <div className="row-between mb-1">
                    <span className="bold text-sm">{s.studentName}</span>
                    <span className={`badge ${isGraded ? 'badge-success' : 'badge-warning'}`}>
                      {isGraded ? `${s.grade} / ${s.maxGrade}` : 'Pending'}
                    </span>
                  </div>
                  <div className="text-xs sub row-between">
                    <span><code>{s.studentCode}</code></span>
                    <span>{s.submittedDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Grading & Review Panel */}
        {activeSub && (
          <div className="card p-4">
            <div className="row-between mb-3 border-b pb-2">
              <div>
                <h3 className="bold">{activeSub.studentName}</h3>
                <span className="text-xs sub">Student Code: <code>{activeSub.studentCode}</code> &nbsp;•&nbsp; Submitted {activeSub.submittedDate}</span>
              </div>
              <span className={`badge ${activeSub.status === 'Graded' ? 'badge-success' : 'badge-warning'}`}>
                {activeSub.status}
              </span>
            </div>

            {/* Assignment & Attached File */}
            <div className="card p-3 mb-4" style={{ background: 'var(--color-bg-page)' }}>
              <div className="row-between wrap gap-2">
                <div>
                  <div className="text-xs sub bold">Task / Deliverable:</div>
                  <div className="text-sm bold mt-1">{activeSub.task}</div>
                </div>
                <div className="row gap-2">
                  <button className="btn btn-neutral btn-sm" onClick={() => showToast('Simulated download of student archive code.', 'info')}>
                    <Icon name="download" /> Download Code (.zip)
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={() => showToast('Viewing diff against reference solution.', 'info')}>
                    <Icon name="eye" /> Inspect Code
                  </button>
                </div>
              </div>
            </div>

            {/* Rubrics Checklist */}
            <div className="card p-3 mb-4">
              <h4 className="bold text-xs sub mb-2">Grading Rubric Breakdown:</h4>
              <div className="stack gap-2 text-xs">
                <div className="row-between py-1 border-b">
                  <span>1. Graph DFS/BFS Recursive &amp; Queue Traversal (Max 5 pts)</span>
                  <strong>5 / 5</strong>
                </div>
                <div className="row-between py-1 border-b">
                  <span>2. Cycle Detection with Visited &amp; Recursion Stack Arrays (Max 3 pts)</span>
                  <strong>3 / 3</strong>
                </div>
                <div className="row-between py-1">
                  <span>3. Clean C++ Coding Standards &amp; Header Documentation (Max 2 pts)</span>
                  <strong>2 / 2</strong>
                </div>
              </div>
            </div>

            {/* Grading Form */}
            <div className="stack gap-3">
              <div>
                <label className="text-xs bold sub block mb-1">
                  Awarded Score (Out of {activeSub.maxGrade} Points)
                </label>
                <div className="row gap-2">
                  <input
                    type="number"
                    min="0"
                    max={activeSub.maxGrade}
                    className="input bold"
                    style={{ maxWidth: '140px', fontSize: '16px' }}
                    value={gradeInput}
                    onChange={e => setGradeInput(e.target.value)}
                  />
                  <span className="self-center text-sm sub">/ {activeSub.maxGrade} Max Points</span>
                </div>
              </div>

              <div>
                <label className="text-xs bold sub block mb-1">TA Feedback &amp; Correction Comments</label>
                <textarea
                  className="input"
                  rows={4}
                  placeholder="Provide constructive feedback on memory efficiency, algorithmic edge cases..."
                  value={feedbackInput}
                  onChange={e => setFeedbackInput(e.target.value)}
                />
              </div>

              <div className="row-between gap-2 pt-2 border-t">
                <span className="text-xs sub">
                  Scores immediately reflect on the Student Portal &amp; Course Gradebook.
                </span>
                <button
                  className="btn btn-primary"
                  onClick={handleSaveGrade}
                  disabled={saving}
                >
                  <Icon name="checkCircle" /> {saving ? 'Saving...' : 'Submit Lab Grade'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
