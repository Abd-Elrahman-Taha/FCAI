import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';

export const StudentGpa: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fakeApi.getStudentGpaHistory().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) return <CardSkeleton count={4} />;

  return (
    <div>
      <PageHead
        title="Screen 26: Cumulative &amp; Semester GPA Analysis"
        subtitle="Grade Point Average trajectory, credit completion metrics, and semester standing"
        breadcrumbs={[
          { label: 'Student Portal', href: '#/student/dashboard' },
          { label: 'Grades', href: '#/student/grades' },
          { label: 'GPA History' }
        ]}
      />

      {/* Top Cumulative Metrics */}
      <div className="grid g-3 mb-6">
        <div className="card p-5 text-center">
          <div className="sub text-xs">Cumulative GPA (CGPA)</div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-primary)' }}>
            {data.cumulativeGpa.toFixed(2)}
          </div>
          <span className="badge badge-success mt-1">Good Academic Standing</span>
        </div>
        <div className="card p-5 text-center">
          <div className="sub text-xs">Completed Credit Hours</div>
          <div style={{ fontSize: '32px', fontWeight: 800 }}>
            {data.totalCredits} <small style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>/ 132 Cr.</small>
          </div>
          <span className="sub text-xs mt-1 block">56% Degree Completion</span>
        </div>
        <div className="card p-5 text-center">
          <div className="sub text-xs">Total Quality Points</div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-success)' }}>
            {data.totalPoints.toFixed(1)}
          </div>
          <span className="sub text-xs mt-1 block">Weighted Quality Points</span>
        </div>
      </div>

      {/* Semester by Semester History */}
      <div className="card mb-6">
        <div className="card-head">
          <h3>Semester Historical Transcript Breakdown</h3>
          <span className="badge badge-primary">Credit-Hour Scale (4.00 Max)</span>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Academic Semester</th>
                <th>Registered Credits</th>
                <th>Quality Points</th>
                <th>Semester GPA</th>
                <th>Retaken Courses</th>
                <th>Term Standing</th>
              </tr>
            </thead>
            <tbody>
              {data.semesters.map((s: any) => (
                <tr key={s.term}>
                  <td className="bold">{s.term}</td>
                  <td>{s.credits} Credits</td>
                  <td>{s.points} pts</td>
                  <td>
                    <strong style={{ fontSize: '15px', color: 'var(--color-primary)' }}>
                      {s.gpa.toFixed(2)}
                    </strong>
                  </td>
                  <td>
                    {s.retakenCourses > 0 ? (
                      <span className="badge badge-warning">{s.retakenCourses} Retaken</span>
                    ) : (
                      <span className="sub text-xs">None</span>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${s.status === 'In Progress' ? 'badge-warning' : 'badge-success'}`}>
                      {s.status || 'Completed'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
