import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { Modal } from '../../components/common/Modal';
import type { Exam } from '../../types';

export const StudentExams: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExamForInstructions, setSelectedExamForInstructions] = useState<Exam | null>(null);

  useEffect(() => {
    fakeApi.getExams().then(res => {
      setExams(res);
      setLoading(false);
    });
  }, []);

  const getStatusBadge = (status: Exam['status']) => {
    switch (status) {
      case 'Available':
        return <span className="badge b-warning">Available Now</span>;
      case 'In Progress':
        return <span className="badge b-info">In Progress</span>;
      case 'Completed':
        return <span className="badge b-success no-dot">Completed</span>;
      case 'Result Pending':
        return <span className="badge b-warning">Short-Answer Pending</span>;
      default:
        return <span className="badge b-neutral">Upcoming</span>;
    }
  };

  return (
    <div>
      <PageHead
        title="Online Examination Center"
        desc="Digital timed assessments, quizzes, and formal exam players for Fall 2026."
        crumbs={[['Student Portal', '#/student/dashboard'], ['Online Exams']]}
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
                <dt>Assessment Type:</dt>
                <dd><span className="badge b-info no-dot">{exam.type}</span></dd>
                <dt>Duration:</dt>
                <dd><b>{exam.durationMinutes} Minutes</b> (Timed)</dd>
                <dt>Questions:</dt>
                <dd>{exam.questionCount} Questions (MCQ &amp; Written)</dd>
                <dt>Max Marks:</dt>
                <dd>{exam.totalMarks || 20} Marks</dd>
                {exam.status === 'Completed' && (
                  <>
                    <dt>Final Score:</dt>
                    <dd className="trend-up fw-7">{exam.score} / {exam.totalMarks} Marks</dd>
                  </>
                )}
              </div>
            </div>

            <div className="card-foot" style={{ margin: '14px -20px -20px', borderRadius: '0 0 var(--r-lg) var(--r-lg)' }}>
              {exam.status === 'Available' ? (
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  onClick={() => setSelectedExamForInstructions(exam)}
                >
                  <Icon name="play" size="sm" /> View Instructions &amp; Start
                </button>
              ) : exam.status === 'Completed' ? (
                <button
                  type="button"
                  className="btn btn-secondary btn-block"
                  onClick={() => window.location.hash = `#/student/exams/${exam.id}/player`}
                >
                  Review Graded Attempt
                </button>
              ) : exam.status === 'Result Pending' ? (
                <span className="text-xs muted center block w-full">
                  Short answers waiting for instructor grading
                </span>
              ) : (
                <span className="text-xs muted center block w-full">
                  Opens {exam.startTime.split('T')[0]} at {exam.startTime.split('T')[1]?.slice(0, 5)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Exam Instructions Modal */}
      {selectedExamForInstructions && (
        <Modal
          isOpen={!!selectedExamForInstructions}
          onClose={() => setSelectedExamForInstructions(null)}
          title={`Instructions: ${selectedExamForInstructions.title}`}
          subtitle={`${selectedExamForInstructions.courseCode} · Duration: ${selectedExamForInstructions.durationMinutes} mins`}
          iconName="fileText"
          tone="warning"
          size="lg"
          footer={
            <div className="row gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedExamForInstructions(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  const eid = selectedExamForInstructions.id;
                  setSelectedExamForInstructions(null);
                  window.location.hash = `#/student/exams/${eid}/player`;
                }}
              >
                <Icon name="play" size="sm" /> Start Official Exam Attempt
              </button>
            </div>
          }
        >
          <div className="col gap-4 text-sm">
            <div className="alert alert-warning">
              <Icon name="alert" />
              <div>
                <b>Strict Single Attempt Rule:</b>
                <p>Once you click "Start Official Exam Attempt", the timer will begin immediately and cannot be paused. Tab switches and minimization are monitored.</p>
              </div>
            </div>

            <div className="info-tile">
              <small>Exam Parameters</small>
              <div className="grid g-3 mt-1 text-xs">
                <div><b>Duration:</b> {selectedExamForInstructions.durationMinutes} Minutes</div>
                <div><b>Questions:</b> {selectedExamForInstructions.questionCount} Questions</div>
                <div><b>Total Weight:</b> {selectedExamForInstructions.totalMarks || 20} Marks</div>
              </div>
            </div>

            <div>
              <h4 className="fw-7 mb-2">Examination Rules &amp; Protocols:</h4>
              <ul className="col gap-2 muted text-xs" style={{ paddingLeft: '18px' }}>
                <li>Questions appear in randomized order per student.</li>
                <li>Multiple Choice and True/False questions are graded automatically.</li>
                <li>Short Answer questions will remain in <b>Pending Verification</b> until the course doctor completes grading.</li>
                <li>Do not refresh or leave the examination player page until submitting.</li>
              </ul>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
