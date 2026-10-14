import React, { useState, useEffect } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { useAuth } from '../../context/AuthContext';
import { Icon } from '../../components/icons/Icon';
import { Modal } from '../../components/common/Modal';
import type { Exam, ExamQuestion } from '../../types';

export const StudentExamPlayer: React.FC<{ examId?: string }> = ({ examId = 'ex1' }) => {
  const { showToast } = useAuth();
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(3595); // 59:55
  const [isSubmitWarningOpen, setIsSubmitWarningOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [examResult, setExamResult] = useState<any>(null);

  useEffect(() => {
    fakeApi.getExam(examId || 'e1').then(res => {
      setExam(res);
      setLoading(false);
    });
  }, [examId]);

  // Countdown timer
  useEffect(() => {
    if (examResult) return;
    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitFinal();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [examResult]);

  const handleSubmitFinal = async () => {
    setIsSubmitting(true);
    try {
      const res = await fakeApi.submitExam(exam?.id || 'e1', answers);
      setExamResult(res);
      setIsSubmitWarningOpen(false);
      showToast('Exam Submitted', 'Your answers have been recorded.', 'success');
    } catch (err: any) {
      showToast('Error', 'Submission failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !exam) {
    return <div className="card card-pad text-center py-12"><div className="spinner lg mx-auto" /></div>;
  }

  const questions = exam.questions || [];
  const currentQ: ExamQuestion | undefined = questions[currentIndex];
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).filter(k => answers[k] !== undefined && answers[k] !== '').length;

  // If exam has been submitted, show Result Screen with Short-Answer Pending status
  if (examResult) {
    return (
      <div className="exam-shell" style={{ padding: '40px 24px', alignItems: 'center' }}>
        <div className="card card-pad" style={{ maxWidth: '640px', width: '100%' }}>
          <div className="state" style={{ padding: '24px 0' }}>
            <div className={`state-art ${examResult.pendingShortAnswers ? 'warning' : 'success'}`}>
              <Icon name={examResult.pendingShortAnswers ? 'clock' : 'award'} size="xl" />
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: 750 }}>
              {examResult.pendingShortAnswers ? 'Submission Received: Manual Grading Pending' : 'Examination Completed'}
            </h2>

            {examResult.pendingShortAnswers ? (
              <div className="alert alert-warning text-left mt-3 mb-4" style={{ width: '100%' }}>
                <Icon name="info" />
                <div>
                  <b>Notice to Student:</b>
                  <p>
                    This assessment includes subjective Short Answer questions. In compliance with faculty regulations, your final score will be locked until the instructor (Dr. Mona Abdelrahman) evaluates the written responses.
                  </p>
                </div>
              </div>
            ) : (
              <div className="alert alert-success text-left mt-3 mb-4" style={{ width: '100%' }}>
                <Icon name="checkCircle" />
                <div>
                  <b>Final Verified Result:</b>
                  <p>All automated questions scored. Final score published to your gradebook.</p>
                </div>
              </div>
            )}

            <div className="grid g-3 text-center my-4" style={{ width: '100%' }}>
              <div className="info-tile">
                <small>Auto-Graded Marks</small>
                <b className="text-primary" style={{ fontSize: '20px' }}>{examResult.score} Marks</b>
              </div>
              <div className="info-tile">
                <small>Short Answer Marks</small>
                <b className="trend-down" style={{ fontSize: '15px' }}>Pending Review</b>
              </div>
              <div className="info-tile">
                <small>Total Exam Weight</small>
                <b style={{ fontSize: '20px' }}>{examResult.total} Marks</b>
              </div>
            </div>

            <a href="#/student/exams" className="btn btn-primary btn-block mt-4">
              Return to Examination Center
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="exam-shell">
      {/* Top Distraction-Free Header */}
      <header className="exam-top">
        <div className="row gap-3">
          <span className="badge b-navy no-dot">{exam.courseCode}</span>
          <div>
            <b style={{ fontSize: '15px' }}>{exam.title}</b>
            <span className="text-xs muted block">Candidate: Ahmed Mohamed Hassan (2021170045)</span>
          </div>
        </div>

        <div className="topbar-right row gap-4">
          <div className={`timer ${secondsRemaining < 300 ? 'warn' : ''}`}>
            <Icon name="clock" size="sm" /> {formatTime(secondsRemaining)}
          </div>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setIsSubmitWarningOpen(true)}
          >
            Submit Exam
          </button>
        </div>
      </header>

      {/* Main Exam Player Body */}
      <div style={{ maxWidth: '1200px', width: '100%', margin: '24px auto', padding: '0 24px', flex: 1 }}>
        <div className="grid g-main">
          {/* Question Presentation Panel */}
          <div className="card card-pad col" style={{ minHeight: '440px', justifyContent: 'space-between' }}>
            {currentQ && (
              <div>
                <div className="row-between mb-4">
                  <span className="badge b-info no-dot">
                    Question {currentIndex + 1} of {questions.length} ({currentQ.marks} Marks)
                  </span>
                  <button
                    type="button"
                    className={`btn btn-sm ${flagged[currentQ.id] ? 'btn-danger' : 'btn-ghost'}`}
                    onClick={() => setFlagged(prev => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }))}
                  >
                    <Icon name="flag" size="sm" />
                    {flagged[currentQ.id] ? 'Flagged for Review' : 'Flag Question'}
                  </button>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 650, lineHeight: 1.5, marginBottom: '24px' }}>
                  {currentQ.prompt}
                </h3>

                {/* Multiple Choice & True/False options */}
                {(currentQ.type === 'MCQ' || currentQ.type === 'TrueFalse') && currentQ.options && (
                  <div className="col gap-3">
                    {currentQ.options.map((opt, oIndex) => {
                      const isSelected = answers[currentQ.id] === oIndex;
                      return (
                        <div
                          key={oIndex}
                          className={`option ${isSelected ? 'selected' : ''}`}
                          onClick={() => setAnswers(prev => ({ ...prev, [currentQ.id]: oIndex }))}
                        >
                          <span className="opt-key">{String.fromCharCode(65 + oIndex)}</span>
                          <span style={{ flex: 1 }}>{opt}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Short Answer text area */}
                {currentQ.type === 'ShortAnswer' && (
                  <div className="field">
                    <label className="label">Type your detailed theoretical answer:</label>
                    <textarea
                      className="textarea"
                      placeholder="Write your recurrence derivation, complexity proof, or written response here…"
                      value={answers[currentQ.id] || ''}
                      onChange={e => setAnswers(prev => ({ ...prev, [currentQ.id]: e.target.value }))}
                      style={{ minHeight: '160px', fontFamily: 'var(--mono)' }}
                    />
                    <span className="hint">This answer will be reviewed manually by the instructor.</span>
                  </div>
                )}
              </div>
            )}

            {/* Previous / Next Controls */}
            <div className="card-foot" style={{ margin: '24px -20px -20px', borderRadius: '0 0 var(--r-lg) var(--r-lg)' }}>
              <button
                type="button"
                className="btn btn-secondary"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(prev => prev - 1)}
              >
                <Icon name="arrowLeft" size="sm" /> Previous
              </button>
              <span className="text-xs muted">
                {answeredCount} of {questions.length} Answered
              </span>
              <button
                type="button"
                className="btn btn-primary"
                disabled={currentIndex === questions.length - 1}
                onClick={() => setCurrentIndex(prev => prev + 1)}
              >
                Next <Icon name="arrowRight" size="sm" />
              </button>
            </div>
          </div>

          {/* Right Question Navigator Palette */}
          <div className="col gap-4">
            <div className="card card-pad">
              <h4 className="text-sm fw-7 mb-3">Question Navigation</h4>
              <div className="q-nav mb-4">
                {questions.map((q, idx) => {
                  const isAnswered = answers[q.id] !== undefined && answers[q.id] !== '';
                  const isCurrent = currentIndex === idx;
                  const isFlagged = flagged[q.id];
                  return (
                    <button
                      key={q.id}
                      type="button"
                      className={`${isAnswered ? 'answered' : ''} ${isCurrent ? 'current' : ''} ${isFlagged ? 'flagged' : ''}`}
                      onClick={() => setCurrentIndex(idx)}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="col gap-2 text-xs muted pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                <span className="row gap-2"><span style={{ width: '12px', height: '12px', background: 'var(--navy-800)', borderRadius: '2px' }} /> Answered</span>
                <span className="row gap-2"><span style={{ width: '12px', height: '12px', border: '1px solid var(--border-strong)', background: '#fff', borderRadius: '2px' }} /> Unanswered</span>
                <span className="row gap-2"><span style={{ width: '12px', height: '12px', background: 'var(--warning-600)', borderRadius: '50%' }} /> Flagged for review</span>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-danger btn-block btn-lg"
              onClick={() => setIsSubmitWarningOpen(true)}
            >
              Finish &amp; Submit Assessment
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Warning Modal */}
      {isSubmitWarningOpen && (
        <Modal
          isOpen={isSubmitWarningOpen}
          onClose={() => setIsSubmitWarningOpen(false)}
          title="Submit Final Examination?"
          subtitle="One-attempt submission confirmation"
          iconName="alertCircle"
          tone="warning"
          footer={
            <div className="row gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsSubmitWarningOpen(false)}
              >
                Return to Exam
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmitFinal}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting…' : 'Yes, Submit Answers'}
              </button>
            </div>
          }
        >
          <div className="col gap-3">
            <div className="alert alert-warning">
              <Icon name="alert" />
              <div>
                <b>Are you certain you wish to conclude your attempt?</b>
                <p>
                  You have answered <b>{answeredCount} of {questions.length}</b> questions. Once submitted, you cannot resume or amend any responses.
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
