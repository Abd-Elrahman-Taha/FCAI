import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import type { AttendanceSession } from '../../types';

export const StudentAttendance: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('ALL');

  useEffect(() => {
    fakeApi.getAttendanceOverview().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) return <div className="card card-pad"><div className="spinner lg mx-auto" /></div>;

  const { overallPercentage, attendedSessions, absentSessions, lateSessions, excusedSessions, courses, history } = data;

  const filteredHistory = history.filter((s: AttendanceSession) =>
    selectedCourseFilter === 'ALL' ? true : s.courseCode === selectedCourseFilter
  );

  return (
    <div>
      <PageHead
        title="Attendance Overview"
        desc="Official attendance records, absence quotas, and session history across all enrolled courses."
        crumbs={[['Student Portal', '#/student/dashboard'], ['Attendance']]}
        actions={
          <a href="#/student/qr-attendance" className="btn btn-ice">
            <Icon name="qr" /> Launch QR Scanner
          </a>
        }
      />

      {/* Faculty 75% Regulation Notice */}
      <div className="alert alert-info mb-6">
        <Icon name="info" />
        <div>
          <b>FCAI BSU Academic Attendance By-Law:</b>
          <p>
            Students must achieve a minimum of <b>75% physical attendance</b> in both lectures and practical lab sections. Failing to meet this threshold leads to deprivation from sitting the final course examination.
          </p>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid g-5 mb-6">
        <div className="card kpi">
          <div className="kpi-top">
            <span className="kpi-label">Overall Attendance</span>
            <span className="kpi-ico success"><Icon name="userCheck" /></span>
          </div>
          <div className="kpi-value">{overallPercentage}%</div>
          <div className="kpi-meta"><span className="trend-up">Above 75% minimum</span></div>
        </div>

        <div className="card kpi">
          <div className="kpi-top">
            <span className="kpi-label">Sessions Attended</span>
            <span className="kpi-ico info"><Icon name="checkCircle" /></span>
          </div>
          <div className="kpi-value">{attendedSessions}</div>
          <div className="kpi-meta">Lectures &amp; Lab Sections</div>
        </div>

        <div className="card kpi">
          <div className="kpi-top">
            <span className="kpi-label">Unexcused Absences</span>
            <span className="kpi-ico danger"><Icon name="xCircle" /></span>
          </div>
          <div className="kpi-value">{absentSessions}</div>
          <div className="kpi-meta"><span className="trend-down">Quota limit: 5</span></div>
        </div>

        <div className="card kpi">
          <div className="kpi-top">
            <span className="kpi-label">Late Check-ins</span>
            <span className="kpi-ico warning"><Icon name="clock" /></span>
          </div>
          <div className="kpi-value">{lateSessions}</div>
          <div className="kpi-meta">&gt;15 min after session start</div>
        </div>

        <div className="card kpi">
          <div className="kpi-top">
            <span className="kpi-label">Officially Excused</span>
            <span className="kpi-ico teal"><Icon name="shieldCheck" /></span>
          </div>
          <div className="kpi-value">{excusedSessions}</div>
          <div className="kpi-meta">Medical / Dean approved</div>
        </div>
      </div>

      {/* Course Attendance Cards */}
      <h3 className="section-title">Course Attendance Breakdown</h3>
      <div className="grid g-3 mb-6">
        {courses.map((c: any) => {
          const isWarning = c.percent < 75;
          return (
            <div
              key={c.code}
              className="card card-pad hover cursor-pointer"
              onClick={() => setSelectedCourseFilter(c.code)}
              style={{
                borderColor: selectedCourseFilter === c.code ? 'var(--navy-800)' : undefined,
                background: isWarning ? 'var(--warning-50)' : undefined
              }}
            >
              <div className="row-between mb-2">
                <span className="badge b-navy no-dot">{c.code}</span>
                <span className={isWarning ? 'badge b-danger' : 'badge b-success no-dot'}>
                  {c.percent}%
                </span>
              </div>
              <h4 style={{ fontSize: '15px', fontWeight: 700 }}>{c.name}</h4>
              <p className="text-xs muted mt-1">{c.doctor}</p>

              <div className="divider" style={{ margin: '12px 0 10px' }} />

              <div className="row-between text-xs mb-1">
                <span className="muted">Rate:</span>
                <span className={isWarning ? 'trend-down fw-6' : 'trend-up fw-6'}>
                  {isWarning ? '⚠️ Below 75% Threshold' : '✓ Good Standing'}
                </span>
              </div>
              <div className={`progress ${isWarning ? 'danger' : 'success'} thin`}>
                <span style={{ width: `${c.percent}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Session History Table */}
      <div className="card">
        <div className="card-head">
          <div>
            <h3><Icon name="history" size="sm" /> Session Check-in Log</h3>
            <p>Chronological check-in logs recorded via live QR code or authorized instructor roster.</p>
          </div>
          <div className="row gap-2">
            <button
              type="button"
              className={`btn btn-sm ${selectedCourseFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedCourseFilter('ALL')}
            >
              Show All
            </button>
          </div>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Course</th>
                <th>Session Type</th>
                <th>Time Window</th>
                <th>Hall / Room</th>
                <th>Check-in Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((s: AttendanceSession) => (
                <tr key={s.id}>
                  <td><b>{s.date}</b></td>
                  <td>
                    <span className="badge b-navy no-dot mr-2">{s.courseCode}</span>
                    {s.courseName}
                  </td>
                  <td><span className="badge b-info no-dot">{s.sessionType}</span></td>
                  <td>{s.time}</td>
                  <td><span className="mono">{s.room}</span></td>
                  <td>{s.checkInTime || '—'}</td>
                  <td>
                    <span
                      className={`badge ${
                        s.status === 'Present'
                          ? 'b-success'
                          : s.status === 'Absent'
                          ? 'b-danger'
                          : s.status === 'Late'
                          ? 'b-warning'
                          : 'b-teal'
                      }`}
                    >
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
