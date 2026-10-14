import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';

export const StudentExamResult: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fakeApi.getExamResult('midterm_cs301').then(res => {
      setResult(res);
      setLoading(false);
    });
  }, []);

  if (loading || !result) return <CardSkeleton count={3} />;

  return (
    <div>
      <PageHead
        title="Screen 22: Exam Submission &amp; Result State"
        subtitle={`${result.examTitle} · Course: ${result.courseCode}`}
        breadcrumbs={[
          { label: 'Student Portal', href: '#/student/dashboard' },
          { label: 'Online Exams', href: '#/student/exams' },
          { label: 'Result Summary' }
        ]}
      />

      <div className="card p-6 mb-6" style={{ maxWidth: '780px' }}>
        <div className="row-between pb-4 border-b mb-4">
          <div>
            <span className="badge badge-success mb-2">{result.status}</span>
            <h2 style={{ fontSize: '20px', fontWeight: 750 }}>{result.examTitle}</h2>
            <div className="sub text-xs mt-1">Submitted on: {result.submittedAt}</div>
          </div>
          <div className="text-right">
            <span className="sub text-xs block">Official Score</span>
            <strong style={{ fontSize: '24px', color: 'var(--color-primary)' }}>
              {result.totalScore} / {result.maxScore} pts
            </strong>
            <span className="badge badge-primary block mt-1">{result.percentage}</span>
          </div>
        </div>

        {/* Component Breakdown */}
        <div className="grid g-2 mb-5">
          <div className="card p-4" style={{ background: 'var(--color-bg-page)' }}>
            <span className="sub text-xs block mb-1">Section 1: Automated Questions (MCQ &amp; T/F)</span>
            <div className="bold text-lg" style={{ color: 'var(--color-success)' }}>
              {result.autoScore} / {result.autoMax} pts
            </div>
            <span className="sub text-xs">Instantly verified by computer scoring</span>
          </div>
          <div className="card p-4" style={{ background: 'var(--color-bg-page)' }}>
            <span className="sub text-xs block mb-1">Section 2: Short-Answer (Doctor Correction)</span>
            <div className="bold text-lg" style={{ color: 'var(--color-primary)' }}>
              {result.shortAnswerScore} / {result.shortAnswerMax} pts
            </div>
            <span className="sub text-xs">Evaluated and certified by Dr. Mona Abdelrahman</span>
          </div>
        </div>

        {/* Doctor Feedback */}
        <div className="card p-4 mb-5" style={{ borderLeft: '4px solid var(--color-primary)' }}>
          <strong className="block text-sm mb-1">Instructor Feedback &amp; Rubric Remarks:</strong>
          <p className="sub leading-relaxed" style={{ fontSize: '13.5px' }}>{result.feedback}</p>
        </div>

        <div className="row-between pt-3 border-t">
          <a href="#/student/exams" className="btn btn-secondary">&larr; Back to Exams Directory</a>
          <a href="#/student/grades" className="btn btn-primary">View in Official Gradebook &rarr;</a>
        </div>
      </div>
    </div>
  );
};
