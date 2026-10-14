import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

interface StudentGradeRow {
  code: string;
  name: string;
  attendancePercent?: number;
  midterm: number;
  practical: number;
  coursework: number;
  final: number;
  total: number;
  letter: string;
}

export const DoctorGradeEntry: React.FC = () => {
  const { showToast } = useAuth();
  const [courseCode, setCourseCode] = useState('CS301');
  const [gradebook, setGradebook] = useState<any>(null);
  const [students, setStudents] = useState<StudentGradeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    fakeApi.getDoctorGradebook(courseCode).then(res => {
      setGradebook(res);
      setStudents(res.students);
      setLoading(false);
    });
  }, [courseCode]);

  const calcLetter = (total: number) => {
    if (total >= 95) return 'A+';
    if (total >= 90) return 'A';
    if (total >= 85) return 'B+';
    if (total >= 80) return 'B';
    if (total >= 75) return 'C+';
    if (total >= 70) return 'C';
    if (total >= 65) return 'D+';
    if (total >= 60) return 'D';
    return 'F';
  };

  const handleCellChange = (code: string, field: 'midterm' | 'practical' | 'coursework' | 'final', valStr: string) => {
    const value = Math.max(0, parseFloat(valStr) || 0);
    const limits = { midterm: 20, practical: 20, coursework: 15, final: 45 };

    if (value > limits[field]) {
      showToast(`Warning: Max allowed for ${field} is ${limits[field]} marks!`, 'warning');
      return;
    }

    setStudents(prev =>
      prev.map(s => {
        if (s.code === code) {
          const updated = { ...s, [field]: value };
          const newTotal = (updated.midterm || 0) + (updated.practical || 0) + (updated.coursework || 0) + (updated.final || 0);
          return {
            ...updated,
            total: newTotal,
            letter: calcLetter(newTotal)
          };
        }
        return s;
      })
    );
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    setSaving(false);
    showToast('Course grade draft saved successfully to database.', 'success');
  };

  if (loading || !gradebook) return <CardSkeleton count={5} />;

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.code.includes(searchQuery)
  );

  const avgTotal = (students.reduce((acc, s) => acc + s.total, 0) / (students.length || 1)).toFixed(1);
  const passedCount = students.filter(s => s.total >= 60).length;

  return (
    <div>
      <PageHead
        title="Screen 62: Course Grade Entry & Component Breakdown"
        subtitle={`${gradebook.courseCode} · ${gradebook.courseName} · Fall 2026`}
        breadcrumbs={[
          { label: 'Doctor Portal', href: '#/doctor/dashboard' },
          { label: 'Offerings', href: '#/doctor/offerings' },
          { label: 'Screen 62: Grade Entry' }
        ]}
        actions={
          <div className="row gap-2">
            <button className="btn btn-secondary" onClick={handleSaveDraft} disabled={saving}>
              <Icon name="checkCircle" /> {saving ? 'Saving Draft...' : 'Save Draft'}
            </button>
            <a href="#/doctor/grade-submission" className="btn btn-primary">
              <Icon name="award" /> Final Package Submission (Screen 63)
            </a>
          </div>
        }
      />

      {/* Course & Filter Bar */}
      <div className="card p-4 mb-4">
        <div className="row-between wrap gap-3">
          <div className="row gap-3">
            <div>
              <label className="text-xs bold sub block mb-1">Select Course Offering</label>
              <select
                className="input"
                value={courseCode}
                onChange={e => setCourseCode(e.target.value)}
                style={{ minWidth: '220px' }}
              >
                <option value="CS301">CS301 · Algorithms</option>
                <option value="AI302">AI302 · Machine Learning</option>
                <option value="IS305">IS305 · Database Systems II</option>
              </select>
            </div>
            <div>
              <label className="text-xs bold sub block mb-1">Search Student Code / Name</label>
              <div className="input-search">
                <input
                  type="text"
                  placeholder="Filter student..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ minWidth: '260px' }}
                />
              </div>
            </div>
          </div>

          <div className="row gap-2">
            <button className="btn btn-neutral btn-sm" onClick={() => showToast('Exported CSV template with current grades.', 'info')}>
              <Icon name="download" /> Export Excel
            </button>
            <button className="btn btn-neutral btn-sm" onClick={() => showToast('Import feature ready: all 64 student records validated.', 'info')}>
              <Icon name="upload" /> Import CSV
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid g-4 mb-4">
        <div className="card p-3">
          <div className="text-xs sub bold">Enrolled Students</div>
          <div className="h3 bold text-primary mt-1">{students.length}</div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Class Average</div>
          <div className="h3 bold text-info mt-1">{avgTotal} <span className="text-xs sub">/ 100</span></div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Passing Students (&gt;=60)</div>
          <div className="h3 bold text-success mt-1">{passedCount} <span className="text-xs sub">({((passedCount / students.length) * 100).toFixed(0)}%)</span></div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Status &amp; Workflow</div>
          <div className="mt-1">
            <span className="badge badge-warning">Draft (Editable)</span>
          </div>
        </div>
      </div>

      {/* Grade Entry Table */}
      <div className="card overflow-hidden">
        <div className="card-head">
          <div className="row-between">
            <div>
              <h3>Student Gradebook Roster</h3>
              <p className="text-xs sub mt-1">Midterm (20) + Practical (20) + Coursework (15) + Final Exam (45) = 100 Total</p>
            </div>
            <span className="badge badge-neutral">{filtered.length} Students Listed</span>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '130px' }}>Student Code</th>
                <th>Full Name</th>
                <th style={{ width: '90px' }}>Attendance</th>
                <th style={{ width: '100px' }} className="text-center">Midterm (20)</th>
                <th style={{ width: '100px' }} className="text-center">Practical (20)</th>
                <th style={{ width: '110px' }} className="text-center">Coursework (15)</th>
                <th style={{ width: '100px' }} className="text-center">Final (45)</th>
                <th style={{ width: '90px' }} className="text-center">Total (100)</th>
                <th style={{ width: '80px' }} className="text-center">Letter</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const att = s.attendancePercent ?? 100;
                const isFw = att < 75;
                return (
                  <tr key={s.code}>
                    <td>
                      <code className="text-xs bold">{s.code}</code>
                    </td>
                    <td>
                      <div className="bold">{s.name}</div>
                      {isFw && (
                        <span className="badge badge-danger text-xs mt-1">
                          Deprived (&lt;75% Att)
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${att >= 85 ? 'badge-success' : att >= 75 ? 'badge-warning' : 'badge-danger'}`}>
                        {att}%
                      </span>
                    </td>
                    <td className="text-center">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        className="input text-center text-sm"
                        style={{ width: '70px', padding: '4px' }}
                        value={s.midterm}
                        disabled={isFw}
                        onChange={e => handleCellChange(s.code, 'midterm', e.target.value)}
                      />
                    </td>
                    <td className="text-center">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        className="input text-center text-sm"
                        style={{ width: '70px', padding: '4px' }}
                        value={s.practical}
                        disabled={isFw}
                        onChange={e => handleCellChange(s.code, 'practical', e.target.value)}
                      />
                    </td>
                    <td className="text-center">
                      <input
                        type="number"
                        min="0"
                        max="15"
                        className="input text-center text-sm"
                        style={{ width: '70px', padding: '4px' }}
                        value={s.coursework}
                        disabled={isFw}
                        onChange={e => handleCellChange(s.code, 'coursework', e.target.value)}
                      />
                    </td>
                    <td className="text-center">
                      <input
                        type="number"
                        min="0"
                        max="45"
                        className="input text-center text-sm"
                        style={{ width: '70px', padding: '4px' }}
                        value={s.final}
                        disabled={isFw}
                        onChange={e => handleCellChange(s.code, 'final', e.target.value)}
                      />
                    </td>
                    <td className="text-center bold" style={{ fontSize: '15px' }}>
                      {isFw ? '0 (Fw)' : s.total}
                    </td>
                    <td className="text-center">
                      <span className={`badge ${s.total >= 85 ? 'badge-success' : s.total >= 70 ? 'badge-info' : s.total >= 60 ? 'badge-warning' : 'badge-danger'}`}>
                        {isFw ? 'Fw' : s.letter}
                      </span>
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
