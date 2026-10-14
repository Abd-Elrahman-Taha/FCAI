import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

export const TaAssignedSections: React.FC = () => {
  const { showToast } = useAuth();
  const [sections, setSections] = useState<any[]>([]);
  const [selectedSection, setSelectedSection] = useState<string>('sec1');
  const [activeTab, setActiveTab] = useState<'attendance' | 'submissions' | 'grades'>('attendance');
  const [attendanceData, setAttendanceData] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected submission modal
  const [gradingSub, setGradingSub] = useState<any>(null);
  const [gradeInput, setGradeInput] = useState<number>(10);
  const [notesInput, setNotesInput] = useState<string>('Verified lab execution.');

  useEffect(() => {
    Promise.all([
      fakeApi.getTaAssignedSections(),
      fakeApi.getTaSectionAttendance(selectedSection),
      fakeApi.getTaSectionSubmissions(selectedSection)
    ]).then(([secRes, attRes, subRes]) => {
      setSections(secRes);
      setAttendanceData(attRes);
      setSubmissions(subRes);
      setLoading(false);
    });
  }, [selectedSection]);

  if (loading) return <CardSkeleton count={4} />;

  const handleSaveGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSub) return;
    await fakeApi.saveTaSectionGrade(gradingSub.id, gradeInput, notesInput);
    setSubmissions(prev =>
      prev.map(s => s.id === gradingSub.id ? { ...s, grade: gradeInput, status: 'Graded', notes: notesInput } : s)
    );
    showToast(`Saved grade for ${gradingSub.studentName}: ${gradeInput}/${gradingSub.maxGrade}`, 'success');
    setGradingSub(null);
  };

  return (
    <div>
      <PageHead
        title="Assigned Lab Sections &amp; Practical Grading"
        subtitle="Manage section attendance QR codes, lab assignments, and practical component marks"
        breadcrumbs={[
          { label: 'TA Portal', href: '#/ta/dashboard' },
          { label: 'Assigned Sections' }
        ]}
      />

      {/* Role Constraint Notice */}
      <div className="alert alert-info mb-5">
        <Icon name="info" />
        <div>
          <strong>Department Notice:</strong> Teaching Assistants can record practical lab marks and section attendance. As per faculty bylaws, only the Course Doctor can finalize and submit the whole CourseOffering grade package.
        </div>
      </div>

      {/* Section Selector Pills */}
      <div className="card p-4 mb-5">
        <div className="row-between wrap gap-2">
          <div className="row gap-2">
            <span className="sub">Active Section:</span>
            {sections.map(sec => (
              <button
                key={sec.id}
                className={`btn btn-sm ${selectedSection === sec.id ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => { setSelectedSection(sec.id); setLoading(true); }}
              >
                {sec.courseCode} · {sec.sectionName}
              </button>
            ))}
          </div>
          <div className="chip chip-info">{attendanceData?.room} · {attendanceData?.schedule}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-bar mb-5">
        <button
          className={`tab-btn ${activeTab === 'attendance' ? 'active' : ''}`}
          onClick={() => setActiveTab('attendance')}
        >
          <Icon name="qr" size="sm" />
          <span>Lab QR Attendance ({attendanceData?.presentCount} / {attendanceData?.totalEnrolled})</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'submissions' ? 'active' : ''}`}
          onClick={() => setActiveTab('submissions')}
        >
          <Icon name="file" size="sm" />
          <span>Lab Submissions ({submissions.length})</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'grades' ? 'active' : ''}`}
          onClick={() => setActiveTab('grades')}
        >
          <Icon name="table" size="sm" />
          <span>Practical Marks Entry</span>
        </button>
      </div>

      {/* TAB 1: ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div className="grid g-3">
          <div className="card p-5 text-center">
            <span className="badge badge-success mb-2">Live Lab QR</span>
            <h4 style={{ fontSize: '16px', fontWeight: 700 }}>Lab Session Scan Code</h4>
            <div
              className="p-4 my-3"
              style={{
                background: '#fff',
                borderRadius: 'var(--radius-md)',
                display: 'inline-block',
                border: '2px solid var(--color-primary)'
              }}
            >
              <svg width="160" height="160" viewBox="0 0 100 100" fill="none">
                <rect width="100" height="100" fill="#ffffff" />
                <rect x="5" y="5" width="24" height="24" fill="#052659" rx="2" />
                <rect x="9" y="9" width="16" height="16" fill="#ffffff" />
                <rect x="13" y="13" width="8" height="8" fill="#052659" />

                <rect x="71" y="5" width="24" height="24" fill="#052659" rx="2" />
                <rect x="75" y="9" width="16" height="16" fill="#ffffff" />
                <rect x="79" y="13" width="8" height="8" fill="#052659" />

                <rect x="5" y="71" width="24" height="24" fill="#052659" rx="2" />
                <rect x="9" y="75" width="16" height="16" fill="#ffffff" />
                <rect x="13" y="79" width="8" height="8" fill="#052659" />

                <rect x="36" y="36" width="28" height="28" fill="#C1E8FF" rx="4" />
                <text x="50" y="53" textAnchor="middle" fill="#052659" fontSize="9" fontWeight="bold">LAB</text>
              </svg>
            </div>
            <div className="sub text-xs">Dynamic 5s rotating token active</div>
          </div>

          <div className="col-span-2">
            <div className="card">
              <div className="card-head">
                <h3>Lab Section Attendance Roster</h3>
                <span className="sub text-xs">Section S3</span>
              </div>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Student Name</th>
                      <th>Status</th>
                      <th>Time</th>
                      <th>Method</th>
                      <th>Override</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceData?.roster?.map((r: any) => (
                      <tr key={r.code}>
                        <td><code>{r.code}</code></td>
                        <td className="bold">{r.name}</td>
                        <td>
                          <span className={`badge ${r.status === 'Present' ? 'badge-success' : r.status === 'Late' ? 'badge-warning' : 'badge-danger'}`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="sub text-xs">{r.time}</td>
                        <td className="sub text-xs">{r.method}</td>
                        <td>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => showToast(`Toggled attendance for ${r.name}`, 'info')}
                          >
                            Toggle Status
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LAB SUBMISSIONS */}
      {activeTab === 'submissions' && (
        <div className="card">
          <div className="card-head">
            <h3>Student Lab Exercises</h3>
            <span className="sub text-xs">Lab Exercise 4: Graphs DFS/BFS</span>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Student Name</th>
                  <th>Task</th>
                  <th>Submitted</th>
                  <th>Grade</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map(sub => (
                  <tr key={sub.id}>
                    <td><code>{sub.studentCode}</code></td>
                    <td className="bold">{sub.studentName}</td>
                    <td>{sub.task}</td>
                    <td className="sub text-xs">{sub.submittedDate}</td>
                    <td className="bold">{sub.grade !== null ? `${sub.grade} / ${sub.maxGrade}` : '—'}</td>
                    <td>
                      <span className={`badge ${sub.status === 'Graded' ? 'badge-success' : 'badge-warning'}`}>
                        {sub.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setGradingSub(sub);
                          setGradeInput(sub.grade || 10);
                        }}
                      >
                        <Icon name="edit" /> Grade
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SECTION GRADE ENTRY */}
      {activeTab === 'grades' && (
        <div className="card p-5">
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>
            Section Practical Component Marks (Max: 20 pts)
          </h3>
          <p className="sub text-xs mb-4">
            Enter marks for weekly practical lab quizzes and project checkpoints. These automatically feed into the Lead Doctor's Master Gradebook.
          </p>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Student Name</th>
                  <th>Lab Quizzes (10)</th>
                  <th>Practical Exam (10)</th>
                  <th>Total Practical (20)</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData?.roster?.map((std: any, idx: number) => (
                  <tr key={std.code}>
                    <td><code>{std.code}</code></td>
                    <td className="bold">{std.name}</td>
                    <td>
                      <input
                        type="number"
                        className="input"
                        style={{ width: '80px', padding: '4px 8px' }}
                        defaultValue={idx === 3 ? 0 : 9.5}
                        max={10}
                        min={0}
                        onChange={() => showToast('Saved quiz mark', 'info')}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="input"
                        style={{ width: '80px', padding: '4px 8px' }}
                        defaultValue={idx === 3 ? 0 : 9.5}
                        max={10}
                        min={0}
                        onChange={() => showToast('Saved practical exam mark', 'info')}
                      />
                    </td>
                    <td className="bold" style={{ color: 'var(--color-primary)' }}>
                      {idx === 3 ? '0 / 20' : '19 / 20'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grade Modal */}
      {gradingSub && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div className="modal-head">
              <h3>Grade Lab Submission</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setGradingSub(null)}>
                <Icon name="x" />
              </button>
            </div>
            <form onSubmit={handleSaveGrade} className="p-4">
              <p className="sub mb-2">
                Student: <strong>{gradingSub.studentName}</strong> ({gradingSub.studentCode})
              </p>
              <p className="sub mb-4">
                Exercise: <strong>{gradingSub.task}</strong>
              </p>

              <div className="form-group mb-3">
                <label className="form-label">Marks (Max: {gradingSub.maxGrade})</label>
                <input
                  type="number"
                  min={0}
                  max={gradingSub.maxGrade}
                  step={0.5}
                  className="input"
                  value={gradeInput}
                  onChange={e => setGradeInput(parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              <div className="form-group mb-4">
                <label className="form-label">TA Review Notes</label>
                <textarea
                  className="textarea"
                  rows={2}
                  value={notesInput}
                  onChange={e => setNotesInput(e.target.value)}
                />
              </div>

              <div className="row-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => setGradingSub(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
