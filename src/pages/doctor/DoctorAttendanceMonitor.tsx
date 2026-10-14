import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';

export const DoctorAttendanceMonitor: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fakeApi.getDoctorLectureSession('CS301').then(res => {
      setSession(res);
      setLoading(false);
    });
  }, []);

  if (loading || !session) return <CardSkeleton count={4} />;

  const filtered = session.roster.filter((r: any) =>
    r.name.toLowerCase().includes(filter.toLowerCase()) || r.code.includes(filter)
  );

  return (
    <div>
      <PageHead
        title="Screen 58: Live Attendance Session Monitor"
        subtitle={`Real-Time Check-In Stream · ${session.course.code} · ${session.sessionDate}`}
        breadcrumbs={[
          { label: 'Doctor Portal', href: '#/doctor/dashboard' },
          { label: 'Attendance', href: '#/doctor/attendance' },
          { label: 'Live Monitor' }
        ]}
        actions={
          <div className="row gap-2">
            <a href="#/doctor/attendance-qr" className="btn btn-secondary">
              <Icon name="qr" /> View QR Screen
            </a>
            <a href="#/doctor/attendance-review" className="btn btn-primary">
              <Icon name="checkCircle" /> End Session &amp; Review &rarr;
            </a>
          </div>
        }
      />

      {/* KPI Ticker */}
      <div className="grid g-4 mb-5">
        <div className="card p-4 text-center">
          <div className="sub text-xs">Present (QR Verified)</div>
          <div style={{ fontSize: '24px', fontWeight: 750, color: 'var(--color-success)' }}>
            {session.roster.filter((r: any) => r.status === 'Present').length}
          </div>
        </div>
        <div className="card p-4 text-center">
          <div className="sub text-xs">Late Arrivals</div>
          <div style={{ fontSize: '24px', fontWeight: 750, color: 'var(--color-warning)' }}>
            {session.roster.filter((r: any) => r.status === 'Late').length}
          </div>
        </div>
        <div className="card p-4 text-center">
          <div className="sub text-xs">Unchecked / Absent</div>
          <div style={{ fontSize: '24px', fontWeight: 750, color: 'var(--color-danger)' }}>
            {session.roster.filter((r: any) => r.status === 'Absent').length}
          </div>
        </div>
        <div className="card p-4 text-center">
          <div className="sub text-xs">Total Class Size</div>
          <div style={{ fontSize: '24px', fontWeight: 750 }}>{session.roster.length}</div>
        </div>
      </div>

      <div className="card p-4 mb-4">
        <div className="input-with-icon" style={{ maxWidth: '320px' }}>
          <Icon name="search" />
          <input
            type="text"
            className="input"
            placeholder="Search student code or name..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Student Code</th>
                <th>Student Name</th>
                <th>Check-in Time</th>
                <th>Validation Method</th>
                <th>Live Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r: any) => (
                <tr key={r.code}>
                  <td><code>{r.code}</code></td>
                  <td className="bold">{r.name}</td>
                  <td className="sub text-xs">{r.time}</td>
                  <td>{r.method}</td>
                  <td>
                    <span className={`badge ${
                      r.status === 'Present' ? 'badge-success' :
                      r.status === 'Late' ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {r.status}
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
