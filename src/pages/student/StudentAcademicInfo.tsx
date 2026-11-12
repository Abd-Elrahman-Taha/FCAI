import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';

export const StudentAcademicInfo: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fakeApi.getAcademicInfo().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) return <CardSkeleton count={4} />;

  const { student, semesters } = data;
  const progressPercent = Math.round((student.completedCredits / student.totalCredits) * 100);

  return (
    <div>
      <PageHead
        title="Academic Information"
        desc="Official degree progress, cumulative GPA metrics, and semester transcript history."
        crumbs={[['Student Portal', '#/student/dashboard'], ['Academic Information']]}
      />

      {/* Top Academic Status Banner */}
      <div className="card card-pad mb-6" style={{ background: 'var(--blue-50)', borderColor: 'var(--blue-200)' }}>
        <div className="row-between wrap">
          <div className="row gap-4">
            <div className="avatar lg c1"><Icon name="graduation" size="lg" /></div>
            <div>
              <span className="badge b-info no-dot mb-1">{student.academicLevel}</span>
              <h2 style={{ fontSize: '20px', fontWeight: 750 }}>Department of {student.department}</h2>
              <p className="text-xs muted mt-1">
                Matriculation Code: <b className="mono">{student.studentCode}</b> &nbsp;•&nbsp; Academic Year: {student.academicYear}
              </p>
            </div>
          </div>
          <div className="col gap-1 text-right">
            <span className="text-xs muted">Official Status:</span>
            <span className="badge b-success no-dot" style={{ fontSize: '14px', height: '28px', padding: '0 14px' }}>
              ● {student.academicStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Visualizations: GPA & Degree Progress */}
      <div className="grid g-2 mb-6">
        {/* GPA Visualization */}
        <div className="card card-pad">
          <div className="row-between mb-4">
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}><Icon name="award" size="sm" /> Grade Point Average (GPA)</h3>
              <p className="text-xs muted">Calculated based on credit hours weighting out of 4.00.</p>
            </div>
            <span className="badge b-violet">Excellence</span>
          </div>

          <div className="row gap-6" style={{ alignItems: 'center' }}>
            <div className="ring" style={{ '--p': Math.round((student.gpa / 4.0) * 100) } as React.CSSProperties}>
              <div>
                <b>{student.gpa}</b>
                <span>/ 4.00</span>
              </div>
            </div>

            <div className="col gap-3 flex-1">
              <div className="info-tile">
                <small>Cumulative GPA (CGPA)</small>
                <div className="row-between">
                  <b>{student.gpa} / 4.00</b>
                  <span className="trend-up text-xs">↑ +0.08 term growth</span>
                </div>
              </div>
              <div className="info-tile">
                <small>Active Semester GPA (Fall 2026 Estimated)</small>
                <b>3.65 / 4.00</b>
              </div>
            </div>
          </div>
        </div>

        {/* Credit Hours Progress */}
        <div className="card card-pad">
          <div className="row-between mb-4">
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}><Icon name="layers" size="sm" /> Completed Credit Hours</h3>
              <p className="text-xs muted">Bachelor of Science in Computers &amp; AI graduation threshold.</p>
            </div>
            <span className="badge b-info">{progressPercent}% Completed</span>
          </div>

          <div className="col gap-3">
            <div className="row-between text-sm">
              <span><b>{student.completedCredits} CH</b> Completed</span>
              <span className="muted">{student.totalCredits - student.completedCredits} CH Remaining (Total: {student.totalCredits} CH)</span>
            </div>
            <div className="progress success thick">
              <span style={{ width: `${progressPercent}%` }} />
            </div>

            <div className="grid g-3 mt-3">
              <div className="info-tile text-center">
                <small>Completed</small>
                <b className="text-primary">{student.completedCredits} CH</b>
              </div>
              <div className="info-tile text-center">
                <small>In Progress</small>
                <b>17 CH</b>
              </div>
              <div className="info-tile text-center">
                <small>Remaining</small>
                <b className="muted">{student.totalCredits - student.completedCredits - 17} CH</b>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Semester Academic Summary Table */}
      <div className="card">
        <div className="card-head">
          <div>
            <h3><Icon name="calendar" size="sm" /> Semester Academic Summary</h3>
            <p>Chronological term breakdown of completed semesters and GPA progression.</p>
          </div>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Academic Semester</th>
                <th>Attempted Credits</th>
                <th>Semester GPA</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {semesters.map((s: any, idx: number) => (
                <tr key={idx}>
                  <td><b>{s.term}</b></td>
                  <td>{s.credits} Credit Hours</td>
                  <td><b>{s.gpa} / 4.00</b></td>
                  <td>
                    <span className={`badge ${s.status === 'Active' ? 'b-info' : 'b-success'}`}>
                      {s.status}
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
