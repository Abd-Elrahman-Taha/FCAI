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
        desc="Dean-approved course grades, component marks breakdown, and cumulative Grade Point Average."
        crumbs={[['Student Portal', '#/student/dashboard'], ['Grades & GPA']]}
      />

      {/* GPA KPI Row */}
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
            <span className="kpi-ico success"><Icon name="trendingUp" /></span>
          </div>
          <div className="kpi-value">{currentSemesterGpa} <small>/ 4.00</small></div>
          <div className="kpi-meta"><span className="trend-up">Calculated on published courses</span></div>
        </div>

        <div className="card kpi">
          <div className="kpi-top">
            <span className="kpi-label">Active Semester</span>
            <span className="kpi-ico info"><Icon name="calendarCheck" /></span>
          </div>
          <div className="kpi-value">Fall 2026</div>
          <div className="kpi-meta">Term Week 4 · Regular Academic Year</div>
        </div>
      </div>

      {/* Semester Filter */}
      <div className="toolbar row-between mb-4">
        <div className="row gap-2">
          <span className="text-xs muted">Select Semester:</span>
          <select
            className="select"
            style={{ width: '220px', height: '36px' }}
            value={term}
            onChange={e => setTerm(e.target.value)}
          >
            <option value="Fall 2026">Fall 2026 (Active)</option>
            <option value="Spring 2026">Spring 2025/2026</option>
            <option value="Fall 2025">Fall 2025/2026</option>
          </select>
        </div>
        <span className="text-xs muted">
          Only Dean-approved and published grade packages are visible to students.
        </span>
      </div>

      {/* Grades Table with Component Marks */}
      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Title</th>
                <th>CH</th>
                <th>Grade Component Breakdown</th>
                <th>Total Marks</th>
                <th>Letter</th>
                <th>Grade Point</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((cg: CourseGrade) => (
                <tr key={cg.courseCode}>
                  <td><span className="badge b-navy no-dot">{cg.courseCode}</span></td>
                  <td><b>{cg.courseName}</b></td>
                  <td>{cg.creditHours} CH</td>
                  <td>
                    <div className="row gap-2 wrap text-xs">
                      {cg.components.map((comp, idx) => (
                        <span key={idx} className="tag">
                          {comp.name}: <b>{comp.obtained}/{comp.max}</b>
                        </span>
                      ))}
                    </div>
                  </td>
                  <td><b className="text-lg">{cg.totalMarks}</b> <small className="muted">/ 100</small></td>
                  <td><span className="badge b-success no-dot">{cg.letterGrade}</span></td>
                  <td><b>{cg.gradePoints.toFixed(1)}</b></td>
                  <td><span className="badge b-success no-dot">Published</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
