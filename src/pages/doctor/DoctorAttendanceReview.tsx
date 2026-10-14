import React from 'react';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';

export const DoctorAttendanceReview: React.FC = () => {
  const { showToast } = useAuth();

  const sessionSummary = {
    course: 'CS301 · Design & Analysis of Algorithms',
    session: 'Lecture 6 (Algorithms Recurrences & DP)',
    date: 'Today, Oct 14, 2026',
    hall: 'Hall A-101',
    enrolledTotal: 64,
    presentCount: 54,
    lateCount: 2,
    excusedCount: 1,
    absentCount: 7,
    roster: [
      { code: '2021170045', name: 'Ahmed Mohamed Hassan', status: 'Present', method: 'QR Mobile (10:04 AM)' },
      { code: '2021170112', name: 'Mariam Ahmed Saeed', status: 'Present', method: 'QR Mobile (10:05 AM)' },
      { code: '2022170033', name: 'Omar Khaled Fathy', status: 'Late', method: 'Manual Entry (10:22 AM)' },
      { code: '2023170501', name: 'Youssef Ibrahim Nabil', status: 'Excused', method: 'Medical Excuse Approved' },
      { code: '2021170078', name: 'Hana Mostafa Kamal', status: 'Absent', method: 'Auto Marked Absent' }
    ]
  };

  const handleFinalize = () => {
    showToast('Attendance session finalized and synced with academic affairs registrar.', 'success');
    window.location.hash = '#/doctor/dashboard';
  };

  return (
    <div>
      <PageHead
        title="Screen 61: Post-Session Attendance Review &amp; Close"
        subtitle={`${sessionSummary.course} · ${sessionSummary.session} · Room: ${sessionSummary.hall}`}
        breadcrumbs={[
          { label: 'Doctor Portal', href: '#/doctor/dashboard' },
          { label: 'Attendance', href: '#/doctor/attendance' },
          { label: 'Session Review' }
        ]}
        actions={
          <div className="row gap-2">
            <button className="btn btn-primary" onClick={handleFinalize}>
              <Icon name="checkCircle" /> Finalize &amp; Lock Session Roster
            </button>
          </div>
        }
      />

      {/* Summary KPI Bar */}
      <div className="grid g-4 mb-5">
        <div className="card p-4 text-center">
          <div className="sub text-xs">Present Checked-in</div>
          <div style={{ fontSize: '24px', fontWeight: 750, color: 'var(--color-success)' }}>
            {sessionSummary.presentCount}
          </div>
        </div>
        <div className="card p-4 text-center">
          <div className="sub text-xs">Late Attendees</div>
          <div style={{ fontSize: '24px', fontWeight: 750, color: 'var(--color-warning)' }}>
            {sessionSummary.lateCount}
          </div>
        </div>
        <div className="card p-4 text-center">
          <div className="sub text-xs">Excused (Permits)</div>
          <div style={{ fontSize: '24px', fontWeight: 750, color: 'var(--color-primary)' }}>
            {sessionSummary.excusedCount}
          </div>
        </div>
        <div className="card p-4 text-center">
          <div className="sub text-xs">Missing Students (Marked Absent)</div>
          <div style={{ fontSize: '24px', fontWeight: 750, color: 'var(--color-danger)' }}>
            {sessionSummary.absentCount}
          </div>
        </div>
      </div>

      {/* Roster & Final Corrections */}
      <div className="card">
        <div className="card-head">
          <h3>Session Final Roster Review</h3>
          <span className="sub text-xs">You may make auditable adjustments before locking</span>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Student Code</th>
                <th>Student Name</th>
                <th>Final Session Status</th>
                <th>Validation Record</th>
                <th>Audit Correction</th>
              </tr>
            </thead>
            <tbody>
              {sessionSummary.roster.map(r => (
                <tr key={r.code}>
                  <td><code>{r.code}</code></td>
                  <td className="bold">{r.name}</td>
                  <td>
                    <span className={`badge ${
                      r.status === 'Present' ? 'badge-success' :
                      r.status === 'Late' ? 'badge-warning' :
                      r.status === 'Excused' ? 'badge-info' : 'badge-danger'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="sub text-xs">{r.method}</td>
                  <td>
                    <a href="#/doctor/attendance-edit" className="btn btn-secondary btn-sm">
                      <Icon name="edit" /> Correct Record
                    </a>
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
