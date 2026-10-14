import React, { useState } from 'react';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';

export const AdminExamManagement: React.FC = () => {
  const { showToast } = useAuth();
  const [checkingConflicts, setCheckingConflicts] = useState(false);

  const [examPeriods, setExamPeriods] = useState([
    {
      id: 'ep_midterm',
      name: 'Fall 2026 Midterm Assessments',
      dateRange: 'Oct 25, 2026 – Nov 05, 2026',
      duration: '1.5 Hours / Exam',
      weight: '20% of Course Mark',
      coursesCount: 28,
      status: 'Active (Scheduled)',
      proctorsAllocated: 44
    },
    {
      id: 'ep_practical',
      name: 'Practical Laboratory Assessments',
      dateRange: 'Dec 15, 2026 – Dec 24, 2026',
      duration: '2.0 Hours / Lab',
      weight: '20% of Course Mark',
      coursesCount: 16,
      status: 'Planned',
      proctorsAllocated: 24
    },
    {
      id: 'ep_final',
      name: 'Final Written Semester Examinations',
      dateRange: 'Jan 05, 2027 – Jan 20, 2027',
      duration: '2.0 to 3.0 Hours / Exam',
      weight: '45% to 60% of Course Mark',
      coursesCount: 32,
      status: 'Drafting Timetable',
      proctorsAllocated: 0
    }
  ]);

  const handleRunConflictCheck = async () => {
    setCheckingConflicts(true);
    await new Promise(r => setTimeout(r, 600));
    setCheckingConflicts(false);
    showToast('Conflict check passed: 0 room overlaps, 0 student multi-exam collisions.', 'success');
  };

  return (
    <div>
      <PageHead
        title="Screen 92: Faculty Examination Periods & Operations Management"
        subtitle="Manage faculty examination seasons, proctoring assignments, seating schedules, and exam room allocations"
        breadcrumbs={[
          { label: 'College Admin', href: '#/admin/dashboard' },
          { label: 'Exams', href: '#/admin/exam-schedule' },
          { label: 'Screen 92: Exam Operations' }
        ]}
        actions={
          <div className="row gap-2">
            <a href="#/admin/exam-schedule-management" className="btn btn-secondary">
              <Icon name="calendar" /> Master Exam Schedule (Screen 98)
            </a>
            <button className="btn btn-primary" onClick={handleRunConflictCheck} disabled={checkingConflicts}>
              <Icon name="checkCircle" /> {checkingConflicts ? 'Scanning Collisions...' : 'Run Conflict Check'}
            </button>
          </div>
        }
      />

      {/* KPI Stats */}
      <div className="grid g-4 mb-4">
        <div className="card p-3">
          <div className="text-xs sub bold">Scheduled Exam Seasons</div>
          <div className="h3 bold text-primary mt-1">3 <span className="text-xs sub">Seasons</span></div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Course Assessments Covered</div>
          <div className="h3 bold text-success mt-1">76 <span className="text-xs sub">Papers</span></div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Assigned Exam Halls &amp; Labs</div>
          <div className="h3 bold text-info mt-1">12 <span className="text-xs sub">Venues</span></div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Proctoring Roster Readiness</div>
          <div className="h3 bold text-neutral mt-1">68 Proctors Registered</div>
        </div>
      </div>

      {/* Exam Periods Table */}
      <div className="card overflow-hidden">
        <div className="card-head">
          <h3>Faculty Examination Periods Registry</h3>
          <span className="badge badge-neutral">Fall 2026 Term</span>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Examination Season</th>
                <th>Scheduled Date Range</th>
                <th>Standard Duration</th>
                <th>Assessment Weight</th>
                <th className="text-center">Courses</th>
                <th className="text-center">Proctors</th>
                <th className="text-center">Status</th>
                <th style={{ width: '150px' }} className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {examPeriods.map(ep => (
                <tr key={ep.id}>
                  <td>
                    <div className="bold">{ep.name}</div>
                    <code className="text-xs sub">{ep.id}</code>
                  </td>
                  <td>
                    <span className="text-sm bold">{ep.dateRange}</span>
                  </td>
                  <td>
                    <span className="text-xs">{ep.duration}</span>
                  </td>
                  <td>
                    <span className="badge badge-ice">{ep.weight}</span>
                  </td>
                  <td className="text-center bold text-primary">
                    {ep.coursesCount}
                  </td>
                  <td className="text-center">
                    <span className="badge badge-neutral">{ep.proctorsAllocated} Assigned</span>
                  </td>
                  <td className="text-center">
                    <span className={`badge ${ep.status.includes('Active') ? 'badge-success' : 'badge-primary'}`}>
                      {ep.status}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="row gap-1 justify-center">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => showToast(`Opening proctoring roster for ${ep.name}`, 'info')}
                      >
                        <Icon name="users" size="sm" />
                      </button>
                      <button
                        className="btn btn-neutral btn-sm"
                        onClick={() => showToast(`Edit exam period ${ep.name}`, 'info')}
                      >
                        <Icon name="edit" size="sm" /> Edit
                      </button>
                    </div>
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
