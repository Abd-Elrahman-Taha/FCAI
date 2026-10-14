import React, { useState } from 'react';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';
import { fakeApi } from '../../services/fakeApi';

export const DoctorShortAnswerGrading: React.FC = () => {
  const { showToast } = useAuth();
  const [marks, setMarks] = useState<number>(4.5);
  const [feedback, setFeedback] = useState('Accurate counterexample. Clean explanation of ratio insufficiency.');

  const candidate = {
    examTitle: 'Midterm Assessment · CS301',
    studentCode: '2021170045',
    studentName: 'Ahmed Mohamed Hassan',
    question: 'Explain why greedy choice strategy fails for the 0/1 Knapsack problem with a counterexample.',
    studentAnswer: 'In 0/1 Knapsack, taking the item with highest value-to-weight ratio can leave empty capacity that cannot be filled by remaining items. Counterexample: Capacity W=50. Item 1: (v=60, w=10, ratio=6), Item 2: (v=100, w=20, ratio=5), Item 3: (v=120, w=30, ratio=4). Greedy takes items 1 & 2 (wt=30, val=160), whereas optimal picks items 2 & 3 (wt=50, val=220).',
    modelGuidance: 'Student must demonstrate that picking the maximum ratio item does not guarantee optimal packing when fractions of items cannot be taken. Must provide a valid counterexample.',
    maxMarks: 5
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await fakeApi.gradeShortAnswer('midterm_cs301', candidate.studentCode, marks, feedback);
    showToast(`Awarded ${marks}/${candidate.maxMarks} to ${candidate.studentName}!`, 'success');
    window.location.hash = '#/doctor/dashboard';
  };

  return (
    <div>
      <PageHead
        title="Screen 55: Short Answer Manual Grading"
        subtitle={`Candidate: ${candidate.studentName} (${candidate.studentCode}) · ${candidate.examTitle}`}
        breadcrumbs={[
          { label: 'Doctor Portal', href: '#/doctor/dashboard' },
          { label: 'Short Answer Grading' }
        ]}
      />

      <div className="card p-6 mb-6" style={{ maxWidth: '820px' }}>
        {/* Question Prompt */}
        <div className="card p-4 mb-4" style={{ background: 'var(--color-bg-page)' }}>
          <span className="sub text-xs block mb-1">Subjective Question Prompt:</span>
          <strong className="text-sm block">{candidate.question}</strong>
        </div>

        {/* Candidate Submitted Response */}
        <div className="card p-4 mb-4" style={{ borderLeft: '4px solid var(--color-primary)' }}>
          <span className="sub text-xs block mb-1">Student's Submitted Answer:</span>
          <p className="text-sm leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>
            {candidate.studentAnswer}
          </p>
        </div>

        {/* Model Marking Guidance */}
        <div className="card p-4 mb-5" style={{ background: '#f8fafc', border: '1px dashed var(--color-border)' }}>
          <span className="sub text-xs block mb-1">Official Doctor Marking Guidance / Rubric:</span>
          <p className="sub text-xs leading-relaxed">{candidate.modelGuidance}</p>
        </div>

        <form onSubmit={handleSave}>
          <div className="form-group mb-4" style={{ maxWidth: '240px' }}>
            <label className="form-label">Awarded Score (Max: {candidate.maxMarks} pts)</label>
            <input
              type="number"
              step={0.5}
              min={0}
              max={candidate.maxMarks}
              className="input"
              value={marks}
              onChange={e => setMarks(parseFloat(e.target.value) || 0)}
              required
            />
          </div>

          <div className="form-group mb-5">
            <label className="form-label">Instructor Feedback &amp; Justification</label>
            <textarea
              className="textarea"
              rows={2}
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
            />
          </div>

          <div className="row-between pt-3 border-t">
            <a href="#/doctor/dashboard" className="btn btn-secondary">Cancel</a>
            <button type="submit" className="btn btn-primary">
              <Icon name="checkCircle" /> Submit Evaluation ({marks} / {candidate.maxMarks})
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
