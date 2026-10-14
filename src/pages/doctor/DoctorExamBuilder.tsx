import React, { useState } from 'react';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';
import { fakeApi } from '../../services/fakeApi';

interface GradingQueueItem {
  id: string;
  studentCode: string;
  studentName: string;
  courseCode: string;
  examTitle: string;
  question: string;
  studentAnswer: string;
  modelRubric: string;
  maxMarks: number;
  awardedMarks: number | null;
  status: string;
}

export const DoctorExamBuilder: React.FC = () => {
  const { showToast } = useAuth();
  const [activeTab, setActiveTab] = useState<'queue' | 'builder'>('queue');
  const [examTitle, setExamTitle] = useState('Midterm Assessment · Fall 2026');
  const [courseCode, setCourseCode] = useState('CS301');
  const [durationMins, setDurationMins] = useState(60);
  const [randomize, setRandomize] = useState(true);

  // Short Answer Correction Queue
  const [gradingQueue, setGradingQueue] = useState<GradingQueueItem[]>([
    {
      id: 'sa1',
      studentCode: '2021170045',
      studentName: 'Ahmed Mohamed Hassan',
      courseCode: 'CS301',
      examTitle: 'Midterm Assessment',
      question: 'Explain why greedy choice strategy fails for the 0/1 Knapsack problem with a counterexample.',
      studentAnswer: 'In 0/1 Knapsack, taking the item with highest value-to-weight ratio can lead to empty remaining capacity that cannot be filled by other valuable items. For example, W=50, items: (v=60, w=10, ratio=6), (v=100, w=20, ratio=5), (v=120, w=30, ratio=4). Greedy takes item 1 and item 2 (w=30, v=160), but optimal is items 2 and 3 (w=50, v=220).',
      modelRubric: 'Must show counterexample where picking highest ratio results in suboptimal total value compared to picking lower ratio items that fill capacity better.',
      maxMarks: 5,
      awardedMarks: null,
      status: 'Pending'
    },
    {
      id: 'sa2',
      studentCode: '2021170112',
      studentName: 'Mariam Ahmed Saeed',
      courseCode: 'CS301',
      examTitle: 'Midterm Assessment',
      question: 'Explain why greedy choice strategy fails for the 0/1 Knapsack problem with a counterexample.',
      studentAnswer: 'Because greedy does not explore fractional items and cannot reconsider choices once an item is placed. If capacity is 50, item A has wt 10 val 60, item B wt 20 val 100, item C wt 30 val 120. Greedy gets 160 whereas optimum is 220.',
      modelRubric: 'Must show counterexample where picking highest ratio results in suboptimal total value compared to picking lower ratio items that fill capacity better.',
      maxMarks: 5,
      awardedMarks: null,
      status: 'Pending'
    }
  ]);

  const [activeGradingItem, setActiveGradingItem] = useState<any>(null);
  const [marksInput, setMarksInput] = useState<number>(5);
  const [feedbackInput, setFeedbackInput] = useState<string>('Accurate counterexample and clear justification.');

  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGradingItem) return;

    await fakeApi.gradeShortAnswer('midterm_cs301', activeGradingItem.studentCode, marksInput, feedbackInput);
    setGradingQueue(prev =>
      prev.map(item => item.id === activeGradingItem.id ? { ...item, awardedMarks: marksInput, status: 'Graded' } : item)
    );
    showToast(`Awarded ${marksInput}/${activeGradingItem.maxMarks} to ${activeGradingItem.studentName}`, 'success');
    setActiveGradingItem(null);
  };

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Exam "${examTitle}" published successfully to student portal!`, 'success');
    setActiveTab('queue');
  };

  return (
    <div>
      <PageHead
        title="Assessment Management &amp; Short Answer Correction"
        subtitle="Author new online assessments and review subjective questions awaiting doctor evaluation"
        breadcrumbs={[
          { label: 'Doctor Portal', href: '#/doctor/dashboard' },
          { label: 'Exam Builder' }
        ]}
        actions={
          <div className="row gap-2">
            <button
              className={`btn ${activeTab === 'queue' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('queue')}
            >
              <Icon name="checkCircle" /> Short Answer Queue ({gradingQueue.filter(q => q.status === 'Pending').length})
            </button>
            <button
              className={`btn ${activeTab === 'builder' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('builder')}
            >
              <Icon name="plus" /> Author New Exam
            </button>
          </div>
        }
      />

      {/* Mode Switcher Tabs */}
      <div className="tab-bar mb-5">
        <button
          className={`tab-btn ${activeTab === 'queue' ? 'active' : ''}`}
          onClick={() => setActiveTab('queue')}
        >
          <Icon name="edit" size="sm" />
          <span>Short Answer Manual Correction Queue</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'builder' ? 'active' : ''}`}
          onClick={() => setActiveTab('builder')}
        >
          <Icon name="clock" size="sm" />
          <span>New Assessment Creator</span>
        </button>
      </div>

      {activeTab === 'queue' && (
        <div>
          <div className="alert alert-info mb-4">
            <Icon name="info" />
            <div>
              <strong>Doctor Manual Correction:</strong> MCQs and True/False questions are auto-scored by the platform. The Short-Answer section requires direct instructor evaluation before exam scores are officially released to students.
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <h3>Pending Short Answer Submissions</h3>
              <span className="sub text-xs">Midterm Assessment · CS301</span>
            </div>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Student Code</th>
                    <th>Student Name</th>
                    <th>Question Snippet</th>
                    <th>Max Marks</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {gradingQueue.map(item => (
                    <tr key={item.id}>
                      <td><code>{item.studentCode}</code></td>
                      <td className="bold">{item.studentName}</td>
                      <td style={{ maxWidth: '300px' }} className="truncate">
                        {item.question}
                      </td>
                      <td>{item.maxMarks} pts</td>
                      <td>
                        <span className={`badge ${item.status === 'Graded' ? 'badge-success' : 'badge-warning'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setActiveGradingItem(item);
                            setMarksInput(item.awardedMarks || item.maxMarks);
                          }}
                        >
                          <Icon name="edit" /> {item.status === 'Graded' ? 'Review / Edit' : 'Evaluate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'builder' && (
        <div className="card p-6" style={{ maxWidth: '800px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px' }}>
            Configure Online Assessment
          </h3>
          <form onSubmit={handleCreateExam}>
            <div className="grid g-2 mb-4">
              <div className="form-group">
                <label className="form-label">Exam Title</label>
                <input
                  type="text"
                  className="input"
                  value={examTitle}
                  onChange={e => setExamTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">CourseOffering</label>
                <select className="select" value={courseCode} onChange={e => setCourseCode(e.target.value)}>
                  <option value="CS301">CS301 · Design &amp; Analysis of Algorithms</option>
                  <option value="CS305">CS305 · Operating Systems Internals</option>
                </select>
              </div>
            </div>

            <div className="grid g-3 mb-4">
              <div className="form-group">
                <label className="form-label">Duration (Minutes)</label>
                <input
                  type="number"
                  className="input"
                  min={15}
                  max={180}
                  value={durationMins}
                  onChange={e => setDurationMins(parseInt(e.target.value) || 60)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Total Exam Marks</label>
                <input type="number" className="input" defaultValue={20} />
              </div>
              <div className="form-group">
                <label className="form-label">Assessment Window</label>
                <input type="datetime-local" className="input" defaultValue="2026-10-25T10:00" />
              </div>
            </div>

            <div className="form-group mb-4">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={randomize}
                  onChange={e => setRandomize(e.target.checked)}
                />
                <span><strong>Randomize Question Order:</strong> Prevent student screen-sharing collusion by shuffling questions for each examinee</span>
              </label>
            </div>

            <div className="card p-4 mb-5" style={{ background: 'var(--color-bg-page)' }}>
              <div className="row-between mb-3">
                <h4 style={{ fontSize: '15px', fontWeight: 750 }}>Question Pool Selection</h4>
                <span className="badge badge-primary">15 Questions Selected</span>
              </div>
              <p className="sub text-xs mb-3">Questions drawn from active Algorithm Bank 2026 (10 MCQ, 3 True/False, 2 Short-Answer)</p>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => showToast('Question picker opened', 'info')}>
                <Icon name="layers" /> Pick from Question Bank
              </button>
            </div>

            <div className="row-end gap-2">
              <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('queue')}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Publish Assessment to Students
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Short Answer Evaluation Modal */}
      {activeGradingItem && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '640px' }}>
            <div className="modal-head">
              <h3>Evaluate Short Answer Question</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setActiveGradingItem(null)}>
                <Icon name="x" />
              </button>
            </div>
            <form onSubmit={handleGradeSubmit} className="p-5">
              <div className="row-between mb-3">
                <div>
                  <span className="bold">{activeGradingItem.studentName}</span>{' '}
                  <span className="sub">({activeGradingItem.studentCode})</span>
                </div>
                <span className="badge badge-primary">{activeGradingItem.courseCode}</span>
              </div>

              <div className="card p-3 mb-4" style={{ background: 'var(--color-bg-page)' }}>
                <span className="sub block text-xs mb-1">Question:</span>
                <strong>{activeGradingItem.question}</strong>
              </div>

              <div className="card p-3 mb-4" style={{ borderLeft: '4px solid var(--color-primary)' }}>
                <span className="sub block text-xs mb-1">Student's Submitted Answer:</span>
                <p className="leading-relaxed" style={{ fontSize: '14px', whiteSpace: 'pre-wrap' }}>
                  {activeGradingItem.studentAnswer}
                </p>
              </div>

              <div className="card p-3 mb-4" style={{ background: '#f8fafc', border: '1px dashed var(--color-border)' }}>
                <span className="sub block text-xs mb-1">Official Rubric / Model Solution:</span>
                <p className="sub leading-relaxed" style={{ fontSize: '13px' }}>
                  {activeGradingItem.modelRubric}
                </p>
              </div>

              <div className="form-group mb-4">
                <label className="form-label">Awarded Score (Max: {activeGradingItem.maxMarks} pts)</label>
                <input
                  type="number"
                  step={0.5}
                  min={0}
                  max={activeGradingItem.maxMarks}
                  className="input"
                  value={marksInput}
                  onChange={e => setMarksInput(parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              <div className="form-group mb-5">
                <label className="form-label">Instructor Feedback to Student</label>
                <textarea
                  className="textarea"
                  rows={2}
                  value={feedbackInput}
                  onChange={e => setFeedbackInput(e.target.value)}
                />
              </div>

              <div className="row-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => setActiveGradingItem(null)}>
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
