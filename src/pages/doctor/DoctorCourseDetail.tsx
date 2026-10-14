import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

export const DoctorCourseDetail: React.FC = () => {
  const { showToast } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'sections' | 'students' | 'attendance' | 'assignments' | 'submissions' | 'gradebook' | 'questionBanks' | 'exams' | 'reports'>('overview');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [gradebook, setGradebook] = useState<any>(null);
  const [selectedSub, setSelectedSub] = useState<any>(null);
  const [manualMarks, setManualMarks] = useState<number>(14);
  const [feedback, setFeedback] = useState<string>('Good algorithmic analysis.');

  useEffect(() => {
    Promise.all([
      fakeApi.getDoctorCourseDetail('CS301'),
      fakeApi.getDoctorSubmissions(),
      fakeApi.getDoctorGradebook('CS301')
    ]).then(([detailRes, subsRes, gbRes]) => {
      setData(detailRes);
      setSubmissions(subsRes);
      setGradebook(gbRes);
      setLoading(false);
    });
  }, []);

  if (loading || !data) return <CardSkeleton count={5} />;

  const { course, sections, students } = data;

  const handleGradeSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;
    await fakeApi.gradeSubmission(selectedSub.id, manualMarks, feedback);
    setSubmissions(prev =>
      prev.map(s => s.id === selectedSub.id ? { ...s, grade: manualMarks, status: 'Graded', feedback } : s)
    );
    showToast(`Graded submission for ${selectedSub.studentName}: ${manualMarks}/${selectedSub.maxGrade}`, 'success');
    setSelectedSub(null);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'layers' },
    { id: 'sections', label: 'Sections (3)', icon: 'users' },
    { id: 'students', label: 'Enrolled Students (64)', icon: 'user' },
    { id: 'attendance', label: 'Attendance', icon: 'qr' },
    { id: 'assignments', label: 'Assignments (3)', icon: 'file' },
    { id: 'submissions', label: `Submissions (${submissions.length})`, icon: 'checkCircle' },
    { id: 'gradebook', label: 'Gradebook', icon: 'table' },
    { id: 'questionBanks', label: 'Question Banks', icon: 'database' },
    { id: 'exams', label: 'Exams & Quizzes', icon: 'clock' },
    { id: 'reports', label: 'Reports', icon: 'chart' }
  ];

  return (
    <div>
      <PageHead
        title={`${course.code} · ${course.name}`}
        subtitle={`CourseOffering · Fall 2026 · ${course.department} Department · Room: ${course.hall}`}
        breadcrumbs={[
          { label: 'Doctor Portal', href: '#/doctor/dashboard' },
          { label: 'CourseOfferings', href: '#/doctor/offerings' },
          { label: course.code }
        ]}
        actions={
          <div className="row gap-2">
            <a href="#/doctor/attendance" className="btn btn-ice">
              <Icon name="qr" /> Launch QR Lecture
            </a>
            <a href="#/doctor/gradebook" className="btn btn-primary">
              <Icon name="table" /> Full Gradebook
            </a>
          </div>
        }
      />

      {/* Tabs navigation bar */}
      <div className="tab-bar mb-6" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
        {tabs.map(t => (
          <button
            key={t.id}
            className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id as any)}
          >
            <Icon name={t.icon as any} size="sm" />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid g-3">
          <div className="col-span-2">
            <div className="card p-5 mb-5">
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>Course Description</h3>
              <p className="sub leading-relaxed mb-4">{course.description}</p>
              <div className="grid g-3 p-4" style={{ background: 'var(--color-bg-page)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <span className="sub block text-xs">Course Level</span>
                  <strong>Level 3 · Junior</strong>
                </div>
                <div>
                  <span className="sub block text-xs">Credit Hours</span>
                  <strong>3.0 Credits (2h Lec + 2h Lab)</strong>
                </div>
                <div>
                  <span className="sub block text-xs">Lecture Slot</span>
                  <strong>{course.schedule}</strong>
                </div>
                <div>
                  <span className="sub block text-xs">Prerequisite</span>
                  <strong>CS204 (Data Structures)</strong>
                </div>
              </div>
            </div>

            <div className="card p-5">
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px' }}>Assessment Grading Scheme</h3>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Component</th>
                      <th>Max Marks</th>
                      <th>Weight</th>
                      <th>Evaluator</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>Midterm Written Assessment</td><td>20</td><td>20%</td><td>Doctor</td></tr>
                    <tr><td>Practical Lab Exam &amp; Quizzes</td><td>20</td><td>20%</td><td>Teaching Assistant</td></tr>
                    <tr><td>Assignments &amp; Coursework</td><td>15</td><td>15%</td><td>TA / Doctor</td></tr>
                    <tr><td>Final Written Examination</td><td>45</td><td>45%</td><td>Control Committee</td></tr>
                    <tr style={{ background: 'var(--color-bg-subtle)', fontWeight: 700 }}>
                      <td>Total</td><td>100</td><td>100%</td><td>Whole Course Package</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div>
            <div className="card p-5 mb-5">
              <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Enrollment Summary</h4>
              <div className="row-between mb-2">
                <span className="sub">Enrolled Students:</span>
                <strong>64</strong>
              </div>
              <div className="row-between mb-2">
                <span className="sub">Class Capacity:</span>
                <strong>80</strong>
              </div>
              <div className="row-between mb-4">
                <span className="sub">Capacity Utilized:</span>
                <span className="badge badge-success">80.0%</span>
              </div>
              <div className="progress-bar mb-4">
                <div className="progress-fill" style={{ width: '80%' }}></div>
              </div>
              <a href="#/doctor/gradebook" className="btn btn-secondary w-full">
                <Icon name="download" /> Export Roster PDF
              </a>
            </div>

            <div className="card p-5">
              <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Teaching Assistants</h4>
              <div className="row gap-3 mb-3">
                <div className="avatar">YK</div>
                <div>
                  <div className="bold" style={{ fontSize: '14px' }}>Eng. Youssef Khaled</div>
                  <div className="sub text-xs">Lead TA · Sections S1 &amp; S3</div>
                </div>
              </div>
              <div className="row gap-3">
                <div className="avatar">NH</div>
                <div>
                  <div className="bold" style={{ fontSize: '14px' }}>Eng. Nour Hesham</div>
                  <div className="sub text-xs">TA · Section S2</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SECTIONS */}
      {activeTab === 'sections' && (
        <div className="grid g-3">
          {sections.map((sec: any) => (
            <div key={sec.name} className="card p-5">
              <div className="row-between mb-3">
                <span className="badge badge-primary">{sec.name}</span>
                <span className="badge badge-neutral">{sec.studentsCount} Students</span>
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>Lab Practical Group</h4>
              <p className="sub text-xs mb-3">Assigned TA: <strong>{sec.ta}</strong></p>
              <div className="p-3 mb-4" style={{ background: 'var(--color-bg-page)', borderRadius: 'var(--radius-md)', fontSize: '12px' }}>
                <div className="row-between mb-1">
                  <span className="sub">Location:</span>
                  <strong>{sec.room}</strong>
                </div>
                <div className="row-between">
                  <span className="sub">Schedule:</span>
                  <strong>{sec.schedule}</strong>
                </div>
              </div>
              <button className="btn btn-secondary btn-sm w-full" onClick={() => showToast(`Viewing roster for ${sec.name}`, 'info')}>
                <Icon name="users" /> View Section Roster
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: STUDENTS */}
      {activeTab === 'students' && (
        <div className="card">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Student Code</th>
                  <th>Student Name</th>
                  <th>Section</th>
                  <th>Attendance %</th>
                  <th>Status</th>
                  <th>Overall Mark</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((std: any) => (
                  <tr key={std.code}>
                    <td><code>{std.code}</code></td>
                    <td className="bold">{std.name}</td>
                    <td><span className="badge badge-neutral">{std.section}</span></td>
                    <td>
                      <span className={`badge ${std.att >= 75 ? 'badge-success' : 'badge-danger'}`}>
                        {std.att}%
                      </span>
                    </td>
                    <td><span className="badge badge-success">{std.status}</span></td>
                    <td className="bold">{std.grade}</td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => showToast(`Academic file for ${std.name}`, 'info')}>
                        <Icon name="user" /> Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div className="card p-6">
          <div className="row-between mb-4">
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Attendance Management</h3>
              <p className="sub text-xs">Real-time QR scanning and manual override logs</p>
            </div>
            <a href="#/doctor/attendance" className="btn btn-primary">
              <Icon name="qr" /> Go to Live Session Monitor
            </a>
          </div>
          <div className="grid g-3 mb-5">
            <div className="card p-4 text-center">
              <div className="sub text-xs">Total Sessions Held</div>
              <div style={{ fontSize: '24px', fontWeight: 750 }}>6 Lectures</div>
            </div>
            <div className="card p-4 text-center">
              <div className="sub text-xs">Faculty Attendance Average</div>
              <div style={{ fontSize: '24px', fontWeight: 750, color: 'var(--color-success)' }}>88.5%</div>
            </div>
            <div className="card p-4 text-center">
              <div className="sub text-xs">Students &lt; 75% Risk</div>
              <div style={{ fontSize: '24px', fontWeight: 750, color: 'var(--color-danger)' }}>3 Students</div>
            </div>
          </div>
          <div className="alert alert-info">
            <Icon name="info" />
            <div>
              <strong>75% Deprivation Rule:</strong> Students falling below 75% attendance without Dean-approved hospital excuses will automatically receive an <strong>Fw</strong> grade and be deprived from sitting for the final exam.
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ASSIGNMENTS */}
      {activeTab === 'assignments' && (
        <div className="grid g-3">
          <div className="card p-5">
            <div className="row-between mb-2">
              <span className="badge badge-success">Active</span>
              <span className="sub text-xs">Due Oct 20, 2026</span>
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>Assignment 3: Dynamic Programming</h4>
            <p className="sub text-xs mb-3">Implementation of 0/1 Knapsack &amp; Matrix Chain Multiplication with test suites.</p>
            <div className="row-between pt-2 pb-2" style={{ borderTop: '1px solid var(--color-border)', fontSize: '13px' }}>
              <span className="sub">Submissions:</span>
              <strong>58 / 64 submitted</strong>
            </div>
            <div className="mt-3">
              <button className="btn btn-secondary btn-sm w-full" onClick={() => setActiveTab('submissions')}>
                <Icon name="checkCircle" /> Grade Submissions
              </button>
            </div>
          </div>
          <div className="card p-5">
            <div className="row-between mb-2">
              <span className="badge badge-neutral">Closed</span>
              <span className="sub text-xs">Ended Oct 05, 2026</span>
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>Assignment 2: Divide and Conquer</h4>
            <p className="sub text-xs mb-3">Karatsuba multiplication and closest pair of points analysis.</p>
            <div className="row-between pt-2 pb-2" style={{ borderTop: '1px solid var(--color-border)', fontSize: '13px' }}>
              <span className="sub">Graded:</span>
              <strong>64 / 64 (100%)</strong>
            </div>
            <div className="mt-3">
              <button className="btn btn-ghost btn-sm w-full" onClick={() => showToast('All submissions graded', 'info')}>
                View Archive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: SUBMISSIONS */}
      {activeTab === 'submissions' && (
        <div>
          <div className="card">
            <div className="card-head">
              <h3>Student Submissions · Assignment 3</h3>
            </div>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Student Code</th>
                    <th>File</th>
                    <th>Submitted</th>
                    <th>Grade / Max</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map(sub => (
                    <tr key={sub.id}>
                      <td className="bold">{sub.studentName}</td>
                      <td><code>{sub.studentCode}</code></td>
                      <td>
                        <span className="row gap-1">
                          <Icon name="file" size="sm" /> {sub.file}
                        </span>
                      </td>
                      <td className="sub text-xs">{sub.date}</td>
                      <td className="bold">{sub.grade !== null ? `${sub.grade} / ${sub.maxGrade}` : '—'}</td>
                      <td>
                        <span className={`badge ${sub.status === 'Graded' ? 'badge-success' : 'badge-warning'}`}>
                          {sub.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-secondary btn-sm" onClick={() => { setSelectedSub(sub); setManualMarks(sub.grade || 14); }}>
                          <Icon name="edit" /> Grade
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal for Grading */}
          {selectedSub && (
            <div className="modal-overlay">
              <div className="modal-content" style={{ maxWidth: '500px' }}>
                <div className="modal-head">
                  <h3>Grade Submission</h3>
                  <button className="btn btn-ghost btn-sm" onClick={() => setSelectedSub(null)}>
                    <Icon name="x" />
                  </button>
                </div>
                <form onSubmit={handleGradeSave} className="p-4">
                  <p className="sub mb-3">
                    Student: <strong>{selectedSub.studentName}</strong> ({selectedSub.studentCode})
                  </p>
                  <p className="sub mb-4">
                    Assignment: <strong>{selectedSub.assignment}</strong> · File: <code>{selectedSub.file}</code>
                  </p>

                  <div className="form-group mb-4">
                    <label className="form-label">Marks (Max: {selectedSub.maxGrade})</label>
                    <input
                      type="number"
                      min={0}
                      max={selectedSub.maxGrade}
                      step={0.5}
                      className="input"
                      value={manualMarks}
                      onChange={e => setManualMarks(parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>

                  <div className="form-group mb-5">
                    <label className="form-label">Doctor Feedback</label>
                    <textarea
                      className="textarea"
                      rows={3}
                      value={feedback}
                      onChange={e => setFeedback(e.target.value)}
                    />
                  </div>

                  <div className="row-end gap-2">
                    <button type="button" className="btn btn-secondary" onClick={() => setSelectedSub(null)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save &amp; Publish Mark
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 7: GRADEBOOK */}
      {activeTab === 'gradebook' && (
        <div className="card p-5">
          <div className="row-between mb-4">
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Course Gradebook</h3>
              <p className="sub text-xs">Full roster grade entry and CourseOffering package workflow</p>
            </div>
            <a href="#/doctor/gradebook" className="btn btn-primary">
              <Icon name="table" /> Open Dedicated Gradebook View
            </a>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Student Name</th>
                  <th>Midterm (20)</th>
                  <th>Practical (20)</th>
                  <th>Coursework (15)</th>
                  <th>Final (45)</th>
                  <th>Total (100)</th>
                  <th>Letter</th>
                </tr>
              </thead>
              <tbody>
                {gradebook?.students?.map((s: any) => (
                  <tr key={s.code}>
                    <td><code>{s.code}</code></td>
                    <td className="bold">{s.name}</td>
                    <td>{s.midterm}</td>
                    <td>{s.practical}</td>
                    <td>{s.coursework}</td>
                    <td>{s.final}</td>
                    <td className="bold" style={{ color: 'var(--color-primary)' }}>{s.total}</td>
                    <td><span className="badge badge-success">{s.letter}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 8: QUESTION BANKS */}
      {activeTab === 'questionBanks' && (
        <div className="card p-5">
          <div className="row-between mb-4">
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Question Banks</h3>
              <p className="sub text-xs">Repository of questions for midterm, quizzes, and final exams</p>
            </div>
            <a href="#/doctor/question-banks" className="btn btn-primary">
              <Icon name="database" /> Manage All Banks
            </a>
          </div>
          <div className="alert alert-warning mb-4">
            <Icon name="alertTriangle" />
            <div>
              <strong>Immutability Notice:</strong> Once a question from a question bank has been used in a published or administered exam, it becomes strictly immutable to preserve historical audit integrity.
            </div>
          </div>
          <div className="grid g-3">
            <div className="card p-4">
              <h4 className="bold mb-1">Algorithms Bank 2026</h4>
              <p className="sub text-xs mb-3">45 questions (MCQ, True/False, Short Answer)</p>
              <span className="badge badge-neutral">Status: Locked (Used in Midterm)</span>
            </div>
            <div className="card p-4">
              <h4 className="bold mb-1">Graph Theory &amp; Network Flows</h4>
              <p className="sub text-xs mb-3">25 questions (MCQ, Short Answer)</p>
              <span className="badge badge-success">Status: Editable</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: EXAMS */}
      {activeTab === 'exams' && (
        <div className="card p-5">
          <div className="row-between mb-4">
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Exams &amp; Short Answer Correction</h3>
              <p className="sub text-xs">Schedule and grade online assessments</p>
            </div>
            <a href="#/doctor/exam-builder" className="btn btn-primary">
              <Icon name="clock" /> Create New Assessment
            </a>
          </div>
          <div className="card p-4 mb-3">
            <div className="row-between">
              <div>
                <span className="badge badge-warning mb-2">Grading in Progress</span>
                <h4 className="bold">Midterm Assessment · CS301</h4>
                <p className="sub text-xs">64 Students · 37 Short-Answer questions awaiting doctor manual correction</p>
              </div>
              <a href="#/doctor/exam-builder" className="btn btn-secondary">
                <Icon name="edit" /> Correct Short Answers
              </a>
            </div>
          </div>
        </div>
      )}

      {/* TAB 10: REPORTS */}
      {activeTab === 'reports' && (
        <div className="card p-5">
          <div className="row-between mb-4">
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Course Analytics &amp; Reports</h3>
              <p className="sub text-xs">Grade distribution, pass/fail ratios, and attendance trends</p>
            </div>
            <a href="#/doctor/reports" className="btn btn-primary">
              <Icon name="chart" /> View Full Reports Dashboard
            </a>
          </div>
          <p className="sub">
            The course analytics module compiles real-time bell-curve distribution across Midterm, Lab, and Coursework, with automated alert flags for at-risk students.
          </p>
        </div>
      )}
    </div>
  );
};
