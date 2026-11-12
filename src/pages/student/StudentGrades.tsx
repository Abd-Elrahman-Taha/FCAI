import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import type { CourseGrade } from '../../types';

export const StudentGrades: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [term, setTerm] = useState('Fall 2026');

  useEffect(() => {
    fakeApi.getGrades().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) return <div className="card card-pad"><div className="spinner lg mx-auto" /></div>;

  const { currentSemesterGpa, cumulativeGpa, courses } = data;

  return (
    <div>
      <PageHead
        title="Official Grades &amp; GPA"
        desc="Dean-approved semester performance, assessment breakdown, and cumulative GPA."
        crumbs={[['Student Portal', '#/student/dashboard'], ['Grades & GPA']]}
      />

      {/* GPA KPI Row - Balanced & Clean */}
      <div className="grid g-3 mb-6">
        <div className="card kpi">
          <div className="kpi-top">
            <span className="kpi-label">Cumulative GPA</span>
            <span className="kpi-ico violet"><Icon name="award" /></span>
          </div>
          <div className="kpi-value">{cumulativeGpa} <small>/ 4.00</small></div>
          <div className="kpi-meta"><span className="trend-up">Rating: Very Good with Honors</span></div>
        </div>

        <div className="card kpi">
          <div className="kpi-top">
            <span className="kpi-label">Semester GPA ({term})</span>
            <span className="kpi-ico info"><Icon name="trendingUp" /></span>
          </div>
          <div className="kpi-value">{currentSemesterGpa} <small>/ 4.00</small></div>
          <div className="kpi-meta"><span className="text-xs muted">Based on published courses</span></div>
        </div>

        <div className="card kpi">
          <div className="kpi-top">
            <span className="kpi-label">Active Term</span>
            <span className="kpi-ico info"><Icon name="calendarCheck" /></span>
          </div>
          <div className="kpi-value">Fall 2026</div>
          <div className="kpi-meta">Regular Academic Year · Level 3</div>
        </div>
      </div>

      {/* Controls & Filter */}
      <div className="toolbar row-between mb-4">
        <div className="row gap-2" style={{ alignItems: 'center' }}>
          <span className="text-xs muted">Semester:</span>
          <select
            className="select"
            style={{ width: '200px', height: '36px' }}
            value={term}
            onChange={e => setTerm(e.target.value)}
          >
            <option value="Fall 2026">Fall 2026 (Active)</option>
            <option value="Spring 2026">Spring 2025/2026</option>
            <option value="Fall 2025">Fall 2025/2026</option>
          </select>
        </div>
        <span className="text-xs muted">
          Dean-approved records
        </span>
      </div>

      {/* Simplified, Eye-Comfortable Grades Table */}
      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th style={{ minWidth: '220px' }}>Course</th>
                <th>Assessment Breakdown</th>
                <th style={{ width: '170px' }}>Total &amp; Grade</th>
                <th style={{ width: '110px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((cg: CourseGrade) => (
                <tr key={cg.courseCode}>
                  {/* Course Details - Unified */}
                  <td>
                    <div className="col gap-1">
                      <div className="row gap-2" style={{ alignItems: 'center' }}>
                        <span className="mono fw-7 text-xs text-primary">{cg.courseCode}</span>
                        <b style={{ fontSize: '14px' }}>{cg.courseName}</b>
                      </div>
                      <span className="text-xs muted">{cg.creditHours} Credit Hours</span>
                    </div>
                  </td>

                  {/* Assessment Breakdown - Concise & Eye-Comfortable */}
                  <td>
                    <div className="row gap-1 wrap">
                      {cg.components.map((comp, idx) => {
                        const label = comp.name
                          .replace('Coursework / Assignments', 'Coursework')
                          .replace('Final Examination', 'Final')
                          .replace('Final Exam', 'Final')
                          .replace('Practical Lab', 'Lab')
                          .replace('Practical', 'Lab');
                        return (
                          <span key={idx} className="tag">
                            {label}: <b>{comp.obtained}/{comp.max}</b>
                          </span>
                        );
                      })}
                    </div>
                  </td>

                  {/* Total Marks & Letter Grade - Integrated */}
                  <td>
                    <div className="row gap-2" style={{ alignItems: 'baseline' }}>
                      <b className="text-base">{cg.totalMarks}</b>
                      <small className="muted">/100</small>
                      <span className="badge b-primary no-dot" style={{ fontWeight: 700 }}>
                        {cg.letterGrade}
                      </span>
                      <span className="text-xs muted mono">({cg.gradePoints.toFixed(1)})</span>
                    </div>
                  </td>

                  {/* Subtle, Calm Status Indicator */}
                  <td>
                    <span
                      className="row gap-1 text-xs"
                      style={{ alignItems: 'center', color: 'var(--text-muted)' }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: '#38bdf8',
                          display: 'inline-block'
                        }}
                      />
                      Published
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
