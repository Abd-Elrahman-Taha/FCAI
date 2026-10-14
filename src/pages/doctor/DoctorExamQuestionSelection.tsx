import React, { useState } from 'react';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';

export const DoctorExamQuestionSelection: React.FC = () => {
  const { showToast } = useAuth();
  const [selectedIds, setSelectedIds] = useState<string[]>(['q1', 'q2', 'q3']);

  const questionsPool = [
    { id: 'q1', text: 'What is the tightest time complexity of Merge Sort on array of size n?', type: 'MCQ', marks: 2, topic: 'Divide and Conquer' },
    { id: 'q2', text: 'True or False: Every Dynamic Programming problem can be solved with greedy choice.', type: 'True/False', marks: 1, topic: 'DP Foundations' },
    { id: 'q3', text: 'Explain why greedy strategy fails on 0/1 Knapsack with a 3-item counterexample.', type: 'Short Answer', marks: 5, topic: 'Greedy vs DP' },
    { id: 'q4', text: 'Calculate the total number of subproblems in Matrix Chain Multiplication for n matrices.', type: 'MCQ', marks: 2, topic: 'DP Optimization' },
    { id: 'q5', text: 'Derive Bellman-Ford recurrence and state the negative-cycle detection criterion.', type: 'Short Answer', marks: 5, topic: 'Graph Theory' }
  ];

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const totalMarks = questionsPool.filter(q => selectedIds.includes(q.id)).reduce((acc, q) => acc + q.marks, 0);

  return (
    <div>
      <PageHead
        title="Screen 53: Exam Question Selection &amp; Ordering"
        subtitle="Curate questions from active course question banks into the Midterm Assessment pool"
        breadcrumbs={[
          { label: 'Doctor Portal', href: '#/doctor/dashboard' },
          { label: 'Exam Builder', href: '#/doctor/exam-builder' },
          { label: 'Question Selection' }
        ]}
        actions={
          <div className="row gap-2">
            <a href="#/doctor/exam-publish" className="btn btn-primary">
              <Icon name="checkCircle" /> Continue to Exam Preview ({totalMarks} pts) &rarr;
            </a>
          </div>
        }
      />

      <div className="grid g-3 mb-6">
        <div className="col-span-2">
          <div className="card">
            <div className="card-head">
              <h3>Available Questions in Bank (CS301)</h3>
              <span className="badge badge-primary">{questionsPool.length} Questions in Pool</span>
            </div>
            <div className="stack gap-0">
              {questionsPool.map(q => {
                const isSelected = selectedIds.includes(q.id);
                return (
                  <div
                    key={q.id}
                    className="p-4 border-b row-between hover"
                    style={{ background: isSelected ? 'var(--color-bg-subtle)' : '#fff', cursor: 'pointer' }}
                    onClick={() => toggleSelect(q.id)}
                  >
                    <div className="row gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}} // handled by row click
                      />
                      <div>
                        <div className="row gap-2 mb-1">
                          <span className="badge badge-neutral text-xs">{q.type}</span>
                          <span className="sub text-xs">{q.topic}</span>
                        </div>
                        <strong className="text-sm block">{q.text}</strong>
                      </div>
                    </div>
                    <div className="row gap-2">
                      <span className="badge badge-primary">{q.marks} pts</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          {/* Selected Questions Summary */}
          <div className="card p-5" style={{ position: 'sticky', top: '90px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px' }}>Assessment Pool Summary</h4>
            <div className="stack gap-2 text-sm mb-4">
              <div className="row-between">
                <span className="sub">Selected Questions:</span>
                <strong>{selectedIds.length} Questions</strong>
              </div>
              <div className="row-between">
                <span className="sub">Total Accumulated Marks:</span>
                <strong style={{ fontSize: '18px', color: 'var(--color-primary)' }}>{totalMarks} pts</strong>
              </div>
              <div className="row-between">
                <span className="sub">Target Exam Total:</span>
                <strong>20 pts</strong>
              </div>
            </div>

            <a href="#/doctor/exam-publish" className="btn btn-primary w-full">
              Proceed to Preview &amp; Publish &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
