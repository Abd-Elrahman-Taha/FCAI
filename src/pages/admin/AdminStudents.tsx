import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

export const AdminStudents: React.FC = () => {
  const { showToast } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState('All');

  // Selected student for 8-tab details view modal
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [detailTab, setDetailTab] = useState<'personal' | 'academic' | 'courses' | 'timetable' | 'attendance' | 'fees' | 'requests' | 'transcript'>('personal');

  useEffect(() => {
    fakeApi.getAdminStudents(search).then(res => {
      setStudents(res);
      setLoading(false);
    });
  }, [search]);

  if (loading) return <CardSkeleton count={5} />;

  const handleToggleStatus = async (code: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Deactivated' : 'Active';
    await fakeApi.updateStudentAccountStatus(code, newStatus);
    setStudents(prev =>
      prev.map(s => s.code === code ? { ...s, accountStatus: newStatus } : s)
    );
    showToast(`Student ${code} status changed to ${newStatus}.`, 'info');
  };

  const filtered = students.filter(s => {
    if (deptFilter !== 'All' && s.department !== deptFilter) return false;
    if (levelFilter !== 'All' && s.level !== levelFilter) return false;
    return true;
  });

  return (
    <div>
      <PageHead
        title="Student Directory &amp; Academic Files"
        subtitle="Manage enrolled students across all 4 levels, credentials status, and academic dossiers"
        breadcrumbs={[
          { label: 'College Admin', href: '#/admin/dashboard' },
          { label: 'Students' }
        ]}
        actions={
          <button className="btn btn-primary" onClick={() => showToast('Student batch import wizard', 'info')}>
            <Icon name="upload" /> Import Student Batch
          </button>
        }
      />

      {/* Filters and search card */}
      <div className="card p-4 mb-5">
        <div className="grid g-3">
          <div className="input-with-icon">
            <Icon name="search" />
            <input
              type="text"
              className="input"
              placeholder="Search by student name, code, or national ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="row gap-2">
            <select className="select" value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
              <option value="All">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
              <option value="Information Systems">Information Systems</option>
              <option value="Information Technology">Information Technology</option>
            </select>
            <select className="select" value={levelFilter} onChange={e => setLevelFilter(e.target.value)}>
              <option value="All">All Levels</option>
              <option value="Level 1">Level 1 (Freshman)</option>
              <option value="Level 2">Level 2 (Sophomore)</option>
              <option value="Level 3">Level 3 (Junior)</option>
              <option value="Level 4">Level 4 (Senior)</option>
            </select>
          </div>
          <div className="row-end">
            <span className="sub text-xs">Showing <strong>{filtered.length}</strong> students</span>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Student Code</th>
                <th>National ID</th>
                <th>Student Full Name</th>
                <th>Department</th>
                <th>Level</th>
                <th>CGPA</th>
                <th>Enrollment</th>
                <th>Account Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(std => (
                <tr key={std.code}>
                  <td><code>{std.code}</code></td>
                  <td className="text-xs">{std.nationalId}</td>
                  <td className="bold">{std.name}</td>
                  <td>{std.department}</td>
                  <td><span className="badge badge-neutral">{std.level}</span></td>
                  <td className="bold">{std.gpa.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${std.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                      {std.status}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${std.accountStatus === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                      {std.accountStatus}
                    </span>
                  </td>
                  <td>
                    <div className="row gap-1">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => { setSelectedStudent(std); setDetailTab('personal'); }}
                      >
                        <Icon name="eye" /> Details
                      </button>
                      <button
                        className={`btn btn-sm ${std.accountStatus === 'Active' ? 'btn-ghost' : 'btn-success'}`}
                        onClick={() => handleToggleStatus(std.code, std.accountStatus)}
                        title={std.accountStatus === 'Active' ? 'Deactivate student login' : 'Activate login'}
                      >
                        {std.accountStatus === 'Active' ? 'Suspend' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 8-Tab Details Modal */}
      {selectedStudent && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '820px' }}>
            <div className="modal-head">
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>
                  {selectedStudent.name} ({selectedStudent.code})
                </h3>
                <span className="sub text-xs">{selectedStudent.department} · {selectedStudent.level}</span>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedStudent(null)}>
                <Icon name="x" />
              </button>
            </div>

            {/* 8 Navigation Tabs */}
            <div className="tab-bar p-2" style={{ overflowX: 'auto', borderBottom: '1px solid var(--color-border)' }}>
              {[
                { id: 'personal', label: '1. Personal' },
                { id: 'academic', label: '2. Academic' },
                { id: 'courses', label: '3. Courses' },
                { id: 'timetable', label: '4. Timetable' },
                { id: 'attendance', label: '5. Attendance' },
                { id: 'fees', label: '6. Fees' },
                { id: 'requests', label: '7. Requests' },
                { id: 'transcript', label: '8. Transcript' }
              ].map(t => (
                <button
                  key={t.id}
                  className={`tab-btn btn-sm ${detailTab === t.id ? 'active' : ''}`}
                  onClick={() => setDetailTab(t.id as any)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="p-5" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              {detailTab === 'personal' && (
                <div className="grid g-2">
                  <div><span className="sub block text-xs">National ID</span><strong>{selectedStudent.nationalId}</strong></div>
                  <div><span className="sub block text-xs">Birth Date</span><strong>2003-02-15</strong></div>
                  <div><span className="sub block text-xs">Gender</span><strong>Male</strong></div>
                  <div><span className="sub block text-xs">Nationality</span><strong>Egyptian</strong></div>
                  <div><span className="sub block text-xs">Official Email</span><strong>{selectedStudent.code}@fcai.bsu.edu.eg</strong></div>
                  <div><span className="sub block text-xs">Phone</span><strong>+20 102 345 6789</strong></div>
                </div>
              )}

              {detailTab === 'academic' && (
                <div className="grid g-3">
                  <div className="card p-3">
                    <span className="sub text-xs">Cumulative GPA</span>
                    <div style={{ fontSize: '20px', fontWeight: 750 }}>{selectedStudent.gpa}</div>
                  </div>
                  <div className="card p-3">
                    <span className="sub text-xs">Credits Completed</span>
                    <div style={{ fontSize: '20px', fontWeight: 750 }}>74 / 132 Hrs</div>
                  </div>
                  <div className="card p-3">
                    <span className="sub text-xs">Academic Standing</span>
                    <div style={{ fontSize: '20px', fontWeight: 750, color: 'var(--color-success)' }}>Good Standing</div>
                  </div>
                </div>
              )}

              {detailTab === 'courses' && (
                <div className="table-responsive">
                  <table className="table">
                    <thead><tr><th>Code</th><th>Course</th><th>Credits</th><th>Doctor</th></tr></thead>
                    <tbody>
                      <tr><td>CS301</td><td>Design &amp; Analysis of Algorithms</td><td>3</td><td>Dr. Mona Abdelrahman</td></tr>
                      <tr><td>IS305</td><td>Database Systems II</td><td>3</td><td>Dr. Samy Mahmoud</td></tr>
                      <tr><td>AI302</td><td>Machine Learning Fundamentals</td><td>3</td><td>Dr. Rania Ezzat</td></tr>
                    </tbody>
                  </table>
                </div>
              )}

              {detailTab === 'timetable' && (
                <div className="p-3 sub text-center">
                  Weekly Schedule: Sunday through Thursday (18 credit hours enrolled).
                </div>
              )}

              {detailTab === 'attendance' && (
                <div>
                  <div className="row-between mb-2">
                    <span>Overall Attendance:</span>
                    <span className="badge badge-success">89%</span>
                  </div>
                  <div className="sub text-xs">All registered courses comply with the 75% attendance threshold.</div>
                </div>
              )}

              {detailTab === 'fees' && (
                <div>
                  <div className="row-between mb-2">
                    <span>Fall 2026 Tuition:</span>
                    <span className="bold">7,650 EGP</span>
                  </div>
                  <div className="row-between">
                    <span>Payment Status:</span>
                    <span className="badge badge-success">Paid (Fawry Ref: FWY-98214412)</span>
                  </div>
                </div>
              )}

              {detailTab === 'requests' && (
                <div className="table-responsive">
                  <table className="table">
                    <thead><tr><th>Request ID</th><th>Type</th><th>Status</th><th>Submitted</th></tr></thead>
                    <tbody>
                      <tr><td>REQ-24101</td><td>Official Academic Transcript</td><td><span className="badge badge-success">Resolved</span></td><td>Oct 08, 2026</td></tr>
                    </tbody>
                  </table>
                </div>
              )}

              {detailTab === 'transcript' && (
                <div className="card p-4">
                  <h4 className="bold mb-2">Unofficial Transcript Extract</h4>
                  <p className="sub text-xs mb-3">Degree: Bachelor of Computer Science · Major: Computer Science</p>
                  <div className="row-between border-t pt-2">
                    <span>Cumulative GPA: <strong>{selectedStudent.gpa}</strong></span>
                    <span>Completed Credits: <strong>74 Cr.</strong></span>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-foot">
              <button className="btn btn-secondary" onClick={() => setSelectedStudent(null)}>
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
