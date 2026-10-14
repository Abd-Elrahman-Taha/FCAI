import React, { useState } from 'react';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';

export const DoctorExamPreviewPublish: React.FC = () => {
  const { showToast } = useAuth();
  const [published, setPublished] = useState(false);

  const examSummary = {
    title: 'Midterm Assessment · CS301',
    courseCode: 'CS301 · Design & Analysis of Algorithms',
    instructor: 'Dr. Mona Abdelrahman',
    schedule: 'Sunday, Oct 25, 2026 · 10:00 AM – 11:30 AM',
    duration: '90 Minutes',
    totalMarks: 20,
    enrolledCandidates: 64,
    randomizeQuestions: true,
    questions: [
      { num: 1, text: 'What is the tightest time complexity of Merge Sort on array of size n?', type: 'MCQ', marks: 2 },
      { num: 2, text: 'True or False: Every Dynamic Programming problem can be solved with greedy choice.', type: 'True/False', marks: 1 },
      { num: 3, text: 'Explain why greedy strategy fails on 0/1 Knapsack with a 3-item counterexample.', type: 'Short Answer', marks: 5 }
    ],
    validationChecks: [
      { rule: 'All questions have valid scoring weights', status: 'OK' },
      { rule: 'Short answer questions include rubric instructions', status: 'OK' },
      { rule: 'No overlapping exam hall bookings detected in BSU schedule', status: 'OK' }
    ]
  };

  const handlePublish = () => {
    setPublished(true);
    showToast('Exam successfully published and scheduled in student portal!', 'success');
  };

  return (
    <div>
      <PageHead
        title="Screen 54: Assessment Preview &amp; Formal Release"
        subtitle="Final verification of exam rubric, timing, randomization policy, and candidate pool"
        breadcrumbs={[
          { label: 'Doctor Portal', href: '#/doctor/dashboard' },
          { label: 'Exam Builder', href: '#/doctor/exam-builder' },
          { label: 'Preview & Publish' }
        ]}
      />

      <div className="card p-6 mb-6" style={{ maxWidth: '840px' }}>
        <div className="row-between pb-4 border-b mb-4">
          <div>
            <span className="badge badge-primary mb-1">Assessment Final Preview</span>
            <h2 style={{ fontSize: '20px', fontWeight: 750 }}>{examSummary.title}</h2>
            <div className="sub text-xs mt-1">{examSummary.schedule} · Duration: {examSummary.duration}</div>
          </div>
          <div className="text-right">
            <span className="sub text-xs block">Total Marks</span>
            <strong style={{ fontSize: '24px', color: 'var(--color-primary)' }}>{examSummary.totalMarks} pts</strong>
          </div>
        </div>

        {/* Validation Checks */}
        <h4 className="bold mb-3" style={{ fontSize: '15px' }}>Pre-Flight Examination Checks</h4>
        <div className="stack gap-2 mb-5">
          {examSummary.validationChecks.map((v, idx) => (
            <div key={idx} className="card p-3 row-between" style={{ background: '#f0fdf4', border: '1px solid #86efac' }}>
              <div className="row gap-2">
                <Icon name="checkCircle" size="sm" style={{ color: 'var(--color-success)' }} />
                <span className="text-sm">{v.rule}</span>
              </div>
              <span className="badge badge-success">{v.status}</span>
            </div>
          ))}
        </div>

        {/* Questions Preview List */}
        <h4 className="bold mb-3" style={{ fontSize: '15px' }}>Questions Preview</h4>
        <div className="stack gap-3 mb-6">
          {examSummary.questions.map(q => (
            <div key={q.num} className="card p-4" style={{ background: 'var(--color-bg-page)' }}>
              <div className="row-between mb-2">
                <span className="badge badge-primary">Question {q.num} · {q.type}</span>
                <span className="bold text-sm">{q.marks} pts</span>
              </div>
              <p className="text-sm font-semibold">{q.text}</p>
            </div>
          ))}
        </div>

        {published ? (
          <div className="card p-5 text-center" style={{ background: '#f0f7ff', border: '1px solid #5483B3' }}>
            <Icon name="checkCircle" size="lg" style={{ color: 'var(--color-success)', marginBottom: '8px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#052659' }}>Exam Officially Released!</h3>
            <p className="sub text-xs mt-1 mb-4">Exam has been published to 64 enrolled candidates. It will automatically unlock at scheduled time.</p>
            <div className="row-center gap-2">
              <a href="#/doctor/dashboard" className="btn btn-primary">Return to Dashboard</a>
              <a href="#/doctor/exams" className="btn btn-secondary">Manage Exams</a>
            </div>
          </div>
        ) : (
          <div className="row-between pt-3 border-t">
            <a href="#/doctor/exam-question-select" className="btn btn-secondary">&larr; Back to Question Selection</a>
            <button className="btn btn-primary" onClick={handlePublish}>
              <Icon name="checkCircle" /> Publish Exam to Students
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
