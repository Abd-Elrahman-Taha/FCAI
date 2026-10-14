import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

export const AdminReports: React.FC = () => {
  const { showToast } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fakeApi.getAdminReportsData().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) return <CardSkeleton count={4} />;

  const { facultySummary, departmentComparison, honorRollCount, academicProbationCount } = data;

  return (
    <div>
      <PageHead
        title="Faculty Analytics &amp; Executive Reporting"
        subtitle="Comprehensive faculty metrics across academic departments, cohorts, and performance benchmarks"
        breadcrumbs={[
          { label: 'College Admin', href: '#/admin/dashboard' },
          { label: 'Analytics & Reports' }
        ]}
        actions={
          <div className="row gap-2">
            <button className="btn btn-secondary" onClick={() => showToast('Exporting Excel report...', 'info')}>
              <Icon name="table" /> Export Excel
            </button>
            <button className="btn btn-secondary" onClick={() => showToast('Exporting CSV data...', 'info')}>
              <Icon name="file" /> Export CSV
            </button>
            <button className="btn btn-primary" onClick={() => showToast('Generating Executive Dean PDF report...', 'success')}>
              <Icon name="download" /> Download Official PDF
            </button>
          </div>
        }
      />

      {/* Top Faculty Summary KPIs */}
      <div className="grid g-5 mb-6">
        <div className="card p-4 text-center">
          <div className="sub text-xs">Total Active Students</div>
          <div style={{ fontSize: '24px', fontWeight: 750 }}>{facultySummary.totalStudents}</div>
          <div className="sub text-xs mt-1">{facultySummary.activeRate}% Retention</div>
        </div>
        <div className="card p-4 text-center">
          <div className="sub text-xs">Faculty Average GPA</div>
          <div style={{ fontSize: '24px', fontWeight: 750, color: 'var(--color-primary)' }}>{facultySummary.averageFacultyGpa}</div>
          <div className="sub text-xs mt-1">Out of 4.00 Max</div>
        </div>
        <div className="card p-4 text-center">
          <div className="sub text-xs">Overall Attendance</div>
          <div style={{ fontSize: '24px', fontWeight: 750, color: 'var(--color-success)' }}>{facultySummary.averageAttendanceFacultyWide}%</div>
          <div className="sub text-xs mt-1">QR Validated</div>
        </div>
        <div className="card p-4 text-center">
          <div className="sub text-xs">Dean's Honor Roll</div>
          <div style={{ fontSize: '24px', fontWeight: 750, color: 'var(--color-success)' }}>{honorRollCount}</div>
          <div className="sub text-xs mt-1">GPA &ge; 3.40</div>
        </div>
        <div className="card p-4 text-center">
          <div className="sub text-xs">Academic Probation</div>
          <div style={{ fontSize: '24px', fontWeight: 750, color: 'var(--color-danger)' }}>{academicProbationCount}</div>
          <div className="sub text-xs mt-1">GPA &lt; 2.00 (Risk)</div>
        </div>
      </div>

      {/* Department Comparison Table */}
      <div className="card mb-6">
        <div className="card-head">
          <h3>Department Comparative Performance (Fall 2026)</h3>
          <span className="badge badge-primary">4 Academic Departments</span>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Academic Department</th>
                <th>Enrolled Students</th>
                <th>Average CGPA</th>
                <th>Attendance Rate</th>
                <th>Relative Share</th>
              </tr>
            </thead>
            <tbody>
              {departmentComparison.map((d: any) => {
                const share = Math.round((d.students / facultySummary.totalStudents) * 100);
                return (
                  <tr key={d.dept}>
                    <td className="bold">{d.dept}</td>
                    <td>{d.students} students</td>
                    <td className="bold" style={{ color: 'var(--color-primary)' }}>{d.avgGpa.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${d.attRate >= 90 ? 'badge-success' : 'badge-info'}`}>
                        {d.attRate}%
                      </span>
                    </td>
                    <td>
                      <div className="row gap-2">
                        <div className="progress-bar flex-1" style={{ height: '6px' }}>
                          <div className="progress-fill" style={{ width: `${share * 2}%` }} />
                        </div>
                        <span className="text-xs sub">{share}%</span>
                      </div>
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
