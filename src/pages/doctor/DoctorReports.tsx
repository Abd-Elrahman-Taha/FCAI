import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

export const DoctorReports: React.FC = () => {
  const { showToast } = useAuth();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState('CS301');

  useEffect(() => {
    fakeApi.getDoctorReports(selectedCourse).then(res => {
      setReport(res);
      setLoading(false);
    });
  }, [selectedCourse]);

  if (loading || !report) return <CardSkeleton count={4} />;

  return (
    <div>
      <PageHead
        title="Course Analytics &amp; Performance Reports"
        subtitle="Comprehensive distribution curves, pass/fail ratios, and attendance indicators"
        breadcrumbs={[
          { label: 'Doctor Portal', href: '#/doctor/dashboard' },
          { label: 'Reports' }
        ]}
        actions={
          <div className="row gap-2">
            <button className="btn btn-secondary" onClick={() => showToast('Exporting Excel report...', 'info')}>
              <Icon name="table" /> Export Excel
            </button>
            <button className="btn btn-primary" onClick={() => showToast('Generating official PDF report...', 'success')}>
              <Icon name="download" /> Download PDF Report
            </button>
          </div>
        }
      />

      {/* Course filter pill */}
      <div className="card p-4 mb-5">
        <div className="row-between wrap gap-2">
          <div className="row gap-2">
            <span className="sub">Select CourseOffering:</span>
            <select
              className="select"
              style={{ width: 'auto' }}
              value={selectedCourse}
              onChange={e => { setLoading(true); setSelectedCourse(e.target.value); }}
            >
              <option value="CS301">CS301 · Design &amp; Analysis of Algorithms</option>
              <option value="CS305">CS305 · Operating Systems Internals</option>
            </select>
          </div>
          <div className="chip chip-info">Fall 2026 Academic Term</div>
        </div>
      </div>

      {/* Summary KPI row */}
      <div className="grid g-4 mb-6">
        <div className="card p-4 text-center">
          <div className="sub text-xs">Total Enrolled</div>
          <div style={{ fontSize: '24px', fontWeight: 750 }}>{report.totalEnrolled} students</div>
        </div>
        <div className="card p-4 text-center">
          <div className="sub text-xs">Average Grade</div>
          <div style={{ fontSize: '24px', fontWeight: 750, color: 'var(--color-primary)' }}>{report.averageGrade}%</div>
        </div>
        <div className="card p-4 text-center">
          <div className="sub text-xs">Attendance Rate</div>
          <div style={{ fontSize: '24px', fontWeight: 750, color: 'var(--color-success)' }}>{report.attendanceRate}%</div>
        </div>
        <div className="card p-4 text-center">
          <div className="sub text-xs">Pass / Fail</div>
          <div style={{ fontSize: '24px', fontWeight: 750 }}>
            <span style={{ color: 'var(--color-success)' }}>{report.passedCount}</span> / <span style={{ color: 'var(--color-danger)' }}>{report.failedCount}</span>
          </div>
        </div>
      </div>

      <div className="grid g-2 mb-6">
        {/* Grade Distribution */}
        <div className="card p-5">
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px' }}>
            Letter Grade Distribution Curve
          </h3>
          <div className="stack gap-3">
            {report.gradeDistribution.map((item: any) => (
              <div key={item.letter}>
                <div className="row-between text-xs mb-1">
                  <strong>Grade {item.letter}</strong>
                  <span className="sub">{item.count} students ({item.pct}%)</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${item.pct * 2.5}%`,
                      background: item.letter === 'F' ? 'var(--color-danger)' : 'var(--color-primary)'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Progression */}
        <div className="card p-5">
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px' }}>
            Weekly Attendance Track (6 Weeks)
          </h3>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Session</th>
                  <th>Present</th>
                  <th>Absent</th>
                  <th>Weekly %</th>
                </tr>
              </thead>
              <tbody>
                {report.attendanceByWeek.map((w: any) => {
                  const rate = Math.round((w.present / (w.present + w.absent)) * 100);
                  return (
                    <tr key={w.week}>
                      <td className="bold">{w.week}</td>
                      <td style={{ color: 'var(--color-success)' }}>{w.present}</td>
                      <td style={{ color: 'var(--color-danger)' }}>{w.absent}</td>
                      <td>
                        <span className={`badge ${rate >= 85 ? 'badge-success' : 'badge-warning'}`}>
                          {rate}%
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
    </div>
  );
};
