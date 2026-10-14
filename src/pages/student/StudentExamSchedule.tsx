import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { Exam } from '../../types';

export const StudentExamSchedule: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fakeApi.getExamSchedule().then(res => {
      setExams(res);
      setLoading(false);
    });
  }, []);

  const getStatusBadge = (status: Exam['status']) => {
    switch (status) {
      case 'Available':
      case 'In Progress':
        return <span className="badge b-warning">Active Now</span>;
      case 'Completed':
        return <span className="badge b-success no-dot">Completed</span>;
      case 'Result Pending':
        return <span className="badge b-info">Grading Pending</span>;
      case 'Upcoming':
      default:
        return <span className="badge b-neutral">Upcoming</span>;
    }
  };

  return (
    <div>
      <PageHead
        title="Official Examination Schedule"
        desc="Scheduled institutional quizzes, midterms, practical exams, and final assessments for Fall 2026."
        crumbs={[['Student Portal', '#/student/dashboard'], ['Exam Schedule']]}
      />

      <div className="grid g-3">
        {exams.map(exam => (
          <div key={exam.id} className="card card-pad col" style={{ justifyContent: 'space-between' }}>
            <div>
              <div className="row-between mb-3">
                <span className="badge b-navy no-dot">{exam.courseCode}</span>
                {getStatusBadge(exam.status)}
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{exam.title}</h3>
              <p className="text-xs muted mt-1">{exam.courseName}</p>

              <div className="divider" />

              <div className="kv text-xs">
                <dt>Exam Category:</dt>
                <dd><span className="badge b-info no-dot">{exam.type}</span></dd>
                <dt>Scheduled Date:</dt>
                <dd><b>{exam.startTime.split('T')[0]}</b></dd>
                <dt>Time Window:</dt>
                <dd>{exam.startTime.split('T')[1]?.slice(0, 5)} – {exam.endTime.split('T')[1]?.slice(0, 5)}</dd>
                <dt>Duration:</dt>
                <dd>{exam.durationMinutes} Minutes</dd>
                <dt>Total Marks:</dt>
                <dd className="fw-7">{exam.totalMarks || 20} Marks</dd>
              </div>

              {exam.instructions && exam.instructions.length > 0 && (
                <div className="alert alert-info mt-4" style={{ fontSize: '11.5px', padding: '10px 12px' }}>
                  <Icon name="info" size="sm" />
                  <div>
                    <b>Instructions:</b>
                    <p>{exam.instructions[0]}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="card-foot" style={{ margin: '14px -20px -20px', borderRadius: '0 0 var(--r-lg) var(--r-lg)' }}>
              {exam.status === 'Available' ? (
                <a href="#/student/exams" className="btn btn-primary btn-block">
                  <Icon name="play" size="sm" /> Take Online Exam Now
                </a>
              ) : exam.status === 'Completed' ? (
                <span className="text-xs muted">
                  Score: <b className="text-primary">{exam.score} / {exam.totalMarks} Marks</b>
                </span>
              ) : (
                <span className="text-xs muted">
                  Scheduled · Seating plan assigned in College Hall
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
