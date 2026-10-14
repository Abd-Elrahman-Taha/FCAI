import React, { useState } from 'react';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';

export const TaSectionAssignments: React.FC = () => {
  const { showToast } = useAuth();
  const [selectedSection, setSelectedSection] = useState('S3');
  const [newModalOpen, setNewModalOpen] = useState(false);

  // New exercise state
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [maxScore, setMaxScore] = useState(10);
  const [instructions, setInstructions] = useState('');

  const [exercises, setExercises] = useState([
    {
      id: 'lab_ex_4',
      title: 'Lab Exercise 4: Graph BFS/DFS Implementation & Cycle Detection',
      course: 'CS301 · Algorithms',
      dueDate: 'Oct 18, 2026 · 11:59 PM',
      totalEnrolled: 21,
      submitted: 18,
      graded: 12,
      maxScore: 10,
      weight: '5% of Lab Component',
      status: 'In Progress'
    },
    {
      id: 'lab_ex_3',
      title: 'Lab Exercise 3: Dynamic Programming Memoization Benchmarking',
      course: 'CS301 · Algorithms',
      dueDate: 'Oct 08, 2026 · 11:59 PM',
      totalEnrolled: 21,
      submitted: 20,
      graded: 20,
      maxScore: 10,
      weight: '5% of Lab Component',
      status: 'Fully Graded'
    },
    {
      id: 'lab_ex_2',
      title: 'Lab Exercise 2: Divide & Conquer Strassen Matrix Multiplication',
      course: 'CS301 · Algorithms',
      dueDate: 'Sep 28, 2026 · 11:59 PM',
      totalEnrolled: 21,
      submitted: 21,
      graded: 21,
      maxScore: 10,
      weight: '5% of Lab Component',
      status: 'Fully Graded'
    },
    {
      id: 'lab_ex_1',
      title: 'Lab Exercise 1: Asymptotic Runtime Profiling in Python/C++',
      course: 'CS301 · Algorithms',
      dueDate: 'Sep 20, 2026 · 11:59 PM',
      totalEnrolled: 21,
      submitted: 21,
      graded: 21,
      maxScore: 10,
      weight: '5% of Lab Component',
      status: 'Fully Graded'
    }
  ]);

  const handleCreateExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate) {
      showToast('Please complete title and due date.', 'warning');
      return;
    }
    const created = {
      id: `lab_ex_${Date.now()}`,
      title,
      course: 'CS301 · Algorithms',
      dueDate,
      totalEnrolled: 21,
      submitted: 0,
      graded: 0,
      maxScore,
      weight: '5% of Lab Component',
      status: 'Active'
    };
    setExercises(prev => [created, ...prev]);
    setNewModalOpen(false);
    setTitle('');
    setInstructions('');
    showToast('New practical lab assignment posted for students.', 'success');
  };

  return (
    <div>
      <PageHead
        title="Screen 69: Practical Lab Exercises & Project Milestones"
        subtitle="Manage practical coding assignments, track submission counts, and review grading pipelines"
        breadcrumbs={[
          { label: 'TA Portal', href: '#/ta/dashboard' },
          { label: 'Sections', href: '#/ta/sections' },
          { label: 'Screen 69: Lab Exercises' }
        ]}
        actions={
          <div className="row gap-2">
            <button className="btn btn-secondary" onClick={() => showToast('Batch zip download started for all submissions.', 'info')}>
              <Icon name="download" /> Download All Zips
            </button>
            <button className="btn btn-primary" onClick={() => setNewModalOpen(true)}>
              <Icon name="plus" /> Post Practical Exercise
            </button>
          </div>
        }
      />

      {/* Filter Bar */}
      <div className="card p-3 mb-4">
        <div className="row-between wrap gap-3">
          <div className="row gap-3">
            <div>
              <label className="text-xs bold sub block mb-1">Current Section</label>
              <select
                className="input"
                value={selectedSection}
                onChange={e => setSelectedSection(e.target.value)}
              >
                <option value="S3">Section S3 · Algorithms (21 Students)</option>
                <option value="S1">Section S1 · Algorithms (22 Students)</option>
                <option value="S2">Section S2 · Machine Learning (21 Students)</option>
              </select>
            </div>
          </div>
          <div className="text-sm sub self-center">
            Supervising Professor: <strong>Dr. Mona Abdelrahman</strong>
          </div>
        </div>
      </div>

      {/* Exercises List */}
      <div className="stack gap-3">
        {exercises.map(ex => {
          const gradingPct = ex.submitted > 0 ? ((ex.graded / ex.submitted) * 100).toFixed(0) : '0';
          return (
            <div key={ex.id} className="card p-4">
              <div className="row-between wrap gap-2 mb-2">
                <div className="row gap-2">
                  <span className="badge badge-primary">{ex.course}</span>
                  <span className="badge badge-neutral"><Icon name="clock" size="sm" /> Due {ex.dueDate}</span>
                  <span className={`badge ${ex.status === 'Fully Graded' ? 'badge-success' : 'badge-warning'}`}>
                    {ex.status}
                  </span>
                </div>
                <div className="row gap-2">
                  <a href="#/ta/section-grading" className="btn btn-primary btn-sm">
                    <Icon name="checkCircle" /> Grade Submissions ({ex.submitted - ex.graded} Pending)
                  </a>
                </div>
              </div>

              <h3 className="mb-2">{ex.title}</h3>

              <div className="row-between text-xs sub mb-2">
                <span>Weight: <strong>{ex.weight}</strong> · Max Marks: <strong>{ex.maxScore} pts</strong></span>
                <span>Submissions: <strong>{ex.submitted} / {ex.totalEnrolled}</strong> &nbsp;|&nbsp; Graded: <strong>{ex.graded} / {ex.submitted}</strong> ({gradingPct}%)</span>
              </div>

              {/* Progress bar */}
              <div style={{ height: '6px', background: 'var(--color-border)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${gradingPct}%`, height: '100%', background: 'var(--color-primary)' }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Exercise Modal */}
      {newModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '560px' }}>
            <div className="modal-head">
              <h3>Post Practical Lab Assignment</h3>
              <button className="btn-close" onClick={() => setNewModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleCreateExercise} className="modal-body p-4 stack gap-3">
              <div>
                <label className="text-xs bold sub block mb-1">Lab Exercise Title</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Lab Exercise 5: Shortest Path Dijkstra & Bellman-Ford"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid g-2">
                <div>
                  <label className="text-xs bold sub block mb-1">Due Date &amp; Time</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. Oct 25, 2026 · 11:59 PM"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs bold sub block mb-1">Max Score</label>
                  <input
                    type="number"
                    className="input"
                    value={maxScore}
                    onChange={e => setMaxScore(parseInt(e.target.value) || 10)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs bold sub block mb-1">Lab Instructions &amp; Deliverables</label>
                <textarea
                  className="input"
                  rows={4}
                  placeholder="Provide input test specifications, code skeleton requirements, and zip formatting..."
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                />
              </div>

              <div className="row-between gap-2 mt-2">
                <button type="button" className="btn btn-secondary" onClick={() => setNewModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Icon name="checkCircle" /> Publish Lab Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
