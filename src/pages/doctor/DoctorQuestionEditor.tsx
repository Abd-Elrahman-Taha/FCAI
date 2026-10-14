import React, { useState } from 'react';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';

export const DoctorQuestionEditor: React.FC = () => {
  const { showToast } = useAuth();
  const [qType, setQType] = useState<'MCQ' | 'True/False' | 'Short Answer'>('MCQ');
  const [questionText, setQuestionText] = useState('Prove that the optimal substructure property holds for 0/1 Knapsack.');
  const [marks, setMarks] = useState(5);
  const [course, setCourse] = useState('CS301');
  const [difficulty, setDifficulty] = useState('Medium');
  const [rubricGuide, setRubricGuide] = useState('Student must derive the cut-and-paste argument demonstrating subproblem optimality.');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Question saved into repository with immutability guarantees.', 'success');
    window.location.hash = '#/doctor/question-banks';
  };

  return (
    <div>
      <PageHead
        title="Screen 51: Question Editor &amp; Rubric Authoring"
        subtitle="Author reusable assessment questions with automated scoring keys and subjective rubrics"
        breadcrumbs={[
          { label: 'Doctor Portal', href: '#/doctor/dashboard' },
          { label: 'Question Banks', href: '#/doctor/question-banks' },
          { label: 'Question Editor' }
        ]}
      />

      <div className="card p-6 mb-6" style={{ maxWidth: '820px' }}>
        <form onSubmit={handleSave}>
          <div className="grid g-3 mb-4">
            <div className="form-group">
              <label className="form-label">Course Repository</label>
              <select className="select" value={course} onChange={e => setCourse(e.target.value)}>
                <option value="CS301">CS301 · Design &amp; Analysis of Algorithms</option>
                <option value="CS305">CS305 · Operating Systems Internals</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Question Type</label>
              <select className="select" value={qType} onChange={e => setQType(e.target.value as any)}>
                <option value="MCQ">Multiple Choice (Single/Multi)</option>
                <option value="True/False">True / False</option>
                <option value="Short Answer">Short Answer (Subjective Doctor Rubric)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Difficulty Level</label>
              <select className="select" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                <option value="Easy">Easy (Bloom: Remember/Understand)</option>
                <option value="Medium">Medium (Bloom: Apply/Analyze)</option>
                <option value="Hard">Hard (Bloom: Evaluate/Prove)</option>
              </select>
            </div>
          </div>

          <div className="form-group mb-4">
            <label className="form-label">Question Prompt (Markdown &amp; Math supported)</label>
            <textarea
              className="textarea"
              rows={4}
              value={questionText}
              onChange={e => setQuestionText(e.target.value)}
              required
            />
          </div>

          {qType === 'MCQ' && (
            <div className="card p-4 mb-4" style={{ background: 'var(--color-bg-page)' }}>
              <label className="form-label mb-2">Options &amp; Correct Answer Key</label>
              <div className="stack gap-2">
                <div className="row gap-2">
                  <input type="radio" name="correct" defaultChecked />
                  <input type="text" className="input flex-1" defaultValue="O(n log n) divide and conquer solution" />
                </div>
                <div className="row gap-2">
                  <input type="radio" name="correct" />
                  <input type="text" className="input flex-1" defaultValue="O(n^2) brute force search" />
                </div>
                <div className="row gap-2">
                  <input type="radio" name="correct" />
                  <input type="text" className="input flex-1" defaultValue="O(2^n) exhaustive recursion" />
                </div>
              </div>
            </div>
          )}

          {qType === 'Short Answer' && (
            <div className="form-group mb-4">
              <label className="form-label">Official Rubric &amp; Marking Guidance (for Doctor Manual Evaluation)</label>
              <textarea
                className="textarea"
                rows={3}
                value={rubricGuide}
                onChange={e => setRubricGuide(e.target.value)}
                placeholder="Key concepts, recurrence equations, and counterexamples the student must present..."
              />
            </div>
          )}

          <div className="form-group mb-5" style={{ maxWidth: '200px' }}>
            <label className="form-label">Default Marks</label>
            <input
              type="number"
              className="input"
              value={marks}
              onChange={e => setMarks(parseInt(e.target.value) || 1)}
              min={1}
              max={20}
            />
          </div>

          <div className="row-between pt-3 border-t">
            <a href="#/doctor/question-banks" className="btn btn-secondary">Cancel</a>
            <button type="submit" className="btn btn-primary">
              <Icon name="checkCircle" /> Save Question to Bank
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
