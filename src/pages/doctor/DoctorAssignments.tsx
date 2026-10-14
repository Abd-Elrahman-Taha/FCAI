import React, { useState } from 'react';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';

export const DoctorAssignments: React.FC = () => {
  const { showToast } = useAuth();
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('2026-10-28T23:59');
  const [maxGrade, setMaxGrade] = useState(15);
  const [desc, setDesc] = useState('');

  const [assignments, setAssignments] = useState([
    { id: 'a1', title: 'Assignment 1: Asymptotic proofs & Recurrences', course: 'CS301', dueDate: 'Oct 05, 2026', maxGrade: 15, submissionsCount: '64 / 64', status: 'Closed' },
    { id: 'a2', title: 'Assignment 2: Divide and Conquer Algorithms', course: 'CS301', dueDate: 'Oct 12, 2026', maxGrade: 15, submissionsCount: '64 / 64', status: 'Graded' },
    { id: 'a3', title: 'Assignment 3: Dynamic Programming Implementations', course: 'CS301', dueDate: 'Oct 20, 2026', maxGrade: 15, submissionsCount: '58 / 64', status: 'Active (Open)' }
  ]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newAss = {
      id: `a_${Date.now()}`,
      title,
      course: 'CS301',
      dueDate: new Date(dueDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      maxGrade,
      submissionsCount: '0 / 64',
      status: 'Active (Open)'
    };
    setAssignments(prev => [...prev, newAss]);
    showToast(`Assignment "${title}" posted to student portal!`, 'success');
    setShowCreate(false);
    setTitle('');
  };

  return (
    <div>
      <PageHead
        title="Screen 47: Instructor Course Assignments Authoring"
        subtitle="Create course-wide assignments, specify submission specifications, and set deadlines"
        breadcrumbs={[
          { label: 'Doctor Portal', href: '#/doctor/dashboard' },
          { label: 'Course Assignments' }
        ]}
        actions={
          <div className="row gap-2">
            <a href="#/doctor/submissions" className="btn btn-secondary">
              <Icon name="checkCircle" /> Review Submissions (23)
            </a>
            <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
              <Icon name="plus" /> Author New Assignment
            </button>
          </div>
        }
      />

      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Assignment Title</th>
                <th>Target Course</th>
                <th>Due Date</th>
                <th>Max Marks</th>
                <th>Submissions</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map(a => (
                <tr key={a.id}>
                  <td className="bold">{a.title}</td>
                  <td><span className="badge badge-primary">{a.course}</span></td>
                  <td className="sub text-xs">{a.dueDate}</td>
                  <td>{a.maxGrade} pts</td>
                  <td><strong>{a.submissionsCount}</strong></td>
                  <td>
                    <span className={`badge ${a.status.includes('Active') ? 'badge-success' : 'badge-neutral'}`}>
                      {a.status}
                    </span>
                  </td>
                  <td>
                    <div className="row gap-1">
                      <a href="#/doctor/submissions" className="btn btn-secondary btn-sm">
                        Submissions
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showCreate && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-head">
              <h3>Create Course Assignment</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowCreate(false)}>
                <Icon name="x" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-4">
              <div className="form-group mb-3">
                <label className="form-label">Assignment Title</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Assignment 4: Greedy Algorithms & Huffman Coding"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid g-2 mb-3">
                <div className="form-group">
                  <label className="form-label">Due Date &amp; Time</label>
                  <input
                    type="datetime-local"
                    className="input"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Max Evaluation Marks</label>
                  <input
                    type="number"
                    className="input"
                    value={maxGrade}
                    onChange={e => setMaxGrade(parseInt(e.target.value) || 15)}
                    max={20}
                  />
                </div>
              </div>

              <div className="form-group mb-3">
                <label className="form-label">Assignment Specification &amp; Deliverables</label>
                <textarea
                  className="textarea"
                  rows={3}
                  placeholder="Detail instructions, required source code files, and test case constraints..."
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                />
              </div>

              <div className="form-group mb-4">
                <label className="form-label">Starter Files / Template ZIP (Optional)</label>
                <div className="file-drop-area p-4 text-center border-dashed">
                  <Icon name="upload" className="mx-auto mb-1" />
                  <div className="bold text-xs">Attach starter code or test runner</div>
                </div>
              </div>

              <div className="row-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreate(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
