import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

export const TaSectionEnrolled: React.FC = () => {
  const { showToast } = useAuth();
  const [selectedSection, setSelectedSection] = useState('S3');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample student roster for TA sections
  const [students, setStudents] = useState<any[]>([
    { code: '2021170045', name: 'Ahmed Mohamed Hassan', dept: 'Computer Science', level: 'Level 3', attendance: 92, labSubmissions: 4, labScore: 19, status: 'Active' },
    { code: '2021170112', name: 'Mariam Ahmed Saeed', dept: 'Artificial Intelligence', level: 'Level 3', attendance: 88, labSubmissions: 4, labScore: 18, status: 'Active' },
    { code: '2022170033', name: 'Omar Khaled Fathy', dept: 'Computer Science', level: 'Level 3', attendance: 81, labSubmissions: 3, labScore: 15, status: 'Active' },
    { code: '2021170078', name: 'Hana Mostafa Kamal', dept: 'Computer Science', level: 'Level 3', attendance: 68, labSubmissions: 2, labScore: 11, status: 'Deprivation Risk' },
    { code: '2023170501', name: 'Youssef Ibrahim Nabil', dept: 'Information Systems', level: 'Level 3', attendance: 95, labSubmissions: 4, labScore: 20, status: 'Active' },
    { code: '2021170204', name: 'Nour El-Din Mostafa', dept: 'Computer Science', level: 'Level 3', attendance: 86, labSubmissions: 4, labScore: 17, status: 'Active' },
    { code: '2021170318', name: 'Salma Mahmoud Taha', dept: 'Computer Science', level: 'Level 3', attendance: 90, labSubmissions: 4, labScore: 19, status: 'Active' }
  ]);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setLoading(false);
    }, 200);
    return () => clearTimeout(t);
  }, [selectedSection]);

  if (loading) return <CardSkeleton count={4} />;

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.code.includes(searchQuery)
  );

  const atRiskCount = students.filter(s => s.attendance < 75).length;
  const avgAtt = (students.reduce((acc, s) => acc + s.attendance, 0) / students.length).toFixed(1);

  return (
    <div>
      <PageHead
        title="Screen 68: Lab Section Enrolled Students"
        subtitle="Practical section roster, student performance metrics, and lab engagement tracking"
        breadcrumbs={[
          { label: 'TA Portal', href: '#/ta/dashboard' },
          { label: 'Sections', href: '#/ta/sections' },
          { label: 'Screen 68: Section Enrolled' }
        ]}
        actions={
          <div className="row gap-2">
            <button className="btn btn-secondary" onClick={() => showToast('Exported lab section roster to Excel.', 'info')}>
              <Icon name="download" /> Export Roster
            </button>
            <a href="#/ta/attendance" className="btn btn-primary">
              <Icon name="qr" /> Lab QR Attendance (Screen 71)
            </a>
          </div>
        }
      />

      {/* Filter & Section Controls */}
      <div className="card p-4 mb-4">
        <div className="row-between wrap gap-3">
          <div className="row gap-3">
            <div>
              <label className="text-xs bold sub block mb-1">Assigned Section</label>
              <select
                className="input"
                value={selectedSection}
                onChange={e => setSelectedSection(e.target.value)}
                style={{ minWidth: '240px' }}
              >
                <option value="S3">Section S3 · Algorithms (Lab 3-West · Tue 12:00)</option>
                <option value="S1">Section S1 · Algorithms (Lab 3-West · Sun 12:00)</option>
                <option value="S2">Section S2 · Machine Learning (Lab 2-East · Mon 10:00)</option>
              </select>
            </div>
            <div>
              <label className="text-xs bold sub block mb-1">Search Student</label>
              <div className="input-search">
                <input
                  type="text"
                  placeholder="Filter student code or name..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ minWidth: '240px' }}
                />
              </div>
            </div>
          </div>

          <div className="row gap-2 align-end">
            <a href="#/ta/section-grading" className="btn btn-neutral btn-sm">
              <Icon name="checkCircle" /> Grade Lab Submissions (Screen 70)
            </a>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid g-3 mb-4">
        <div className="card p-3">
          <div className="text-xs sub bold">Enrolled in Section {selectedSection}</div>
          <div className="h3 bold text-primary mt-1">{students.length} <span className="text-xs sub">Students</span></div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Average Lab Attendance</div>
          <div className="h3 bold text-success mt-1">{avgAtt}%</div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Deprivation Risk (&lt;75% Attendance)</div>
          <div className="h3 bold text-danger mt-1">{atRiskCount} <span className="text-xs sub">Student</span></div>
        </div>
      </div>

      {/* Roster Table */}
      <div className="card overflow-hidden">
        <div className="card-head">
          <h3>Enrolled Students Roster · Section {selectedSection}</h3>
          <span className="badge badge-neutral">{filtered.length} Students</span>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '130px' }}>Student Code</th>
                <th>Full Name</th>
                <th>Department</th>
                <th className="text-center" style={{ width: '130px' }}>Lab Attendance</th>
                <th className="text-center" style={{ width: '120px' }}>Submissions</th>
                <th className="text-center" style={{ width: '120px' }}>Practical Score</th>
                <th style={{ width: '120px' }} className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const isRisk = s.attendance < 75;
                return (
                  <tr key={s.code}>
                    <td>
                      <code className="text-xs bold">{s.code}</code>
                    </td>
                    <td>
                      <div className="bold">{s.name}</div>
                      <div className="text-xs sub">{s.level}</div>
                    </td>
                    <td>
                      <span className="text-xs">{s.dept}</span>
                    </td>
                    <td className="text-center">
                      <span className={`badge ${s.attendance >= 85 ? 'badge-success' : s.attendance >= 75 ? 'badge-warning' : 'badge-danger'}`}>
                        {s.attendance}% {isRisk && '⚠️'}
                      </span>
                    </td>
                    <td className="text-center">
                      <span className="badge badge-neutral">{s.labSubmissions} / 4 Labs</span>
                    </td>
                    <td className="text-center bold text-primary">
                      {s.labScore} / 20
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => showToast(`Opening message dialog for ${s.name}`, 'info')}
                      >
                        <Icon name="mail" size="sm" /> Contact
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
