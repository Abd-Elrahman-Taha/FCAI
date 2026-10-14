import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

export const DoctorQuestionBanks: React.FC = () => {
  const { showToast } = useAuth();
  const [banks, setBanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [qType, setQType] = useState<'MCQ' | 'True/False' | 'Short Answer'>('MCQ');
  const [qText, setQText] = useState('');
  const [qMarks, setQMarks] = useState(2);

  useEffect(() => {
    fakeApi.getDoctorQuestionBanks().then(res => {
      setBanks(res);
      setLoading(false);
    });
  }, []);

  if (loading) return <CardSkeleton count={3} />;

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText.trim()) return;
    showToast(`New ${qType} question added to Question Bank.`, 'success');
    setShowAddModal(false);
    setQText('');
  };

  return (
    <div>
      <PageHead
        title="Question Banks &amp; Assessment Repositories"
        subtitle="Manage secure question repositories across courses with immutability guarantees"
        breadcrumbs={[
          { label: 'Doctor Portal', href: '#/doctor/dashboard' },
          { label: 'Question Banks' }
        ]}
        actions={
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Icon name="plus" /> Add New Question
          </button>
        }
      />

      {/* Regulation Alert */}
      <div className="alert alert-info mb-5">
        <Icon name="shield" />
        <div>
          <strong>Audit Compliance &amp; Immutability:</strong> In accordance with FCAI BSU examination standards, any question already assigned to an active or archived exam becomes permanently immutable. You may only deprecate or fork questions into a new revision.
        </div>
      </div>

      <div className="grid g-3 mb-6">
        {banks.map(bank => (
          <div key={bank.id} className="card p-5" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div className="row-between mb-3">
                <span className="badge badge-primary">{bank.courseCode}</span>
                {bank.usedInExam ? (
                  <span className="badge badge-warning">
                    <Icon name="lock" size="sm" /> Locked (Used in Exam)
                  </span>
                ) : (
                  <span className="badge badge-success">
                    <Icon name="checkCircle" size="sm" /> Unlocked &amp; Editable
                  </span>
                )}
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>{bank.name}</h3>
              <p className="sub text-xs mb-4">
                Structured bank with multiple question formats including automated grading test-cases and model answers.
              </p>
              <div className="grid g-2 p-3 mb-4" style={{ background: 'var(--color-bg-page)', borderRadius: 'var(--radius-md)', fontSize: '13px' }}>
                <div>
                  <span className="sub block text-xs">Total Questions</span>
                  <strong>{bank.questionCount} Questions</strong>
                </div>
                <div>
                  <span className="sub block text-xs">Active Pool</span>
                  <strong>{bank.activeCount} Available</strong>
                </div>
              </div>
            </div>

            <div className="row gap-2">
              <button className="btn btn-secondary btn-sm flex-1" onClick={() => showToast(`Opened ${bank.name}`, 'info')}>
                <Icon name="layers" /> Browse Pool
              </button>
              <a href="#/doctor/exam-builder" className="btn btn-primary btn-sm">
                <Icon name="clock" /> Build Exam
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Add Question Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '540px' }}>
            <div className="modal-head">
              <h3>Add Question to Bank</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowAddModal(false)}>
                <Icon name="x" />
              </button>
            </div>
            <form onSubmit={handleAddQuestion} className="p-4">
              <div className="form-group mb-3">
                <label className="form-label">Target Question Bank</label>
                <select className="select">
                  <option>Algorithms Bank 2026 (CS301)</option>
                  <option>Graph Theory &amp; Network Flows (CS301)</option>
                </select>
              </div>

              <div className="form-group mb-3">
                <label className="form-label">Question Type</label>
                <div className="row gap-2">
                  {(['MCQ', 'True/False', 'Short Answer'] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      className={`btn btn-sm flex-1 ${qType === type ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setQType(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group mb-3">
                <label className="form-label">Question Text (Markdown &amp; Math supported)</label>
                <textarea
                  className="textarea"
                  rows={3}
                  placeholder="e.g. Prove that the optimal substructure property holds for 0/1 Knapsack..."
                  value={qText}
                  onChange={e => setQText(e.target.value)}
                  required
                />
              </div>

              {qType === 'MCQ' && (
                <div className="form-group mb-3">
                  <label className="form-label">Options (Mark correct answer)</label>
                  <div className="stack gap-2">
                    <input type="text" className="input" placeholder="Option A (Correct)" defaultValue="O(n log n)" />
                    <input type="text" className="input" placeholder="Option B" defaultValue="O(n^2)" />
                    <input type="text" className="input" placeholder="Option C" defaultValue="O(2^n)" />
                    <input type="text" className="input" placeholder="Option D" defaultValue="O(1)" />
                  </div>
                </div>
              )}

              {qType === 'Short Answer' && (
                <div className="form-group mb-3">
                  <label className="form-label">Model Answer / Rubric for Doctor Manual Correction</label>
                  <textarea
                    className="textarea"
                    rows={2}
                    placeholder="Key concepts student must mention: recurrence relation, memoization array, subproblem overlapping..."
                  />
                </div>
              )}

              <div className="form-group mb-4">
                <label className="form-label">Default Marks</label>
                <input
                  type="number"
                  className="input"
                  min={1}
                  max={20}
                  value={qMarks}
                  onChange={e => setQMarks(parseInt(e.target.value) || 1)}
                />
              </div>

              <div className="row-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save to Bank
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
