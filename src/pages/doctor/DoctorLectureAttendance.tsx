import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

export const DoctorLectureAttendance: React.FC = () => {
  const { showToast } = useAuth();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tokenCounter, setTokenCounter] = useState(5);
  const [tokenHash, setTokenHash] = useState('BSU-LEC-9938-TOKEN');
  const [sessionActive, setSessionActive] = useState(true);
  const [roster, setRoster] = useState<any[]>([]);

  useEffect(() => {
    fakeApi.getDoctorLectureSession('CS301').then(res => {
      setSession(res);
      setRoster(res.roster);
      setLoading(false);
    });
  }, []);

  // 5-second rotating QR token simulation
  useEffect(() => {
    if (!sessionActive) return;
    const interval = setInterval(() => {
      setTokenCounter(prev => {
        if (prev <= 1) {
          setTokenHash(`BSU-LEC-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`);
          return 5;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionActive]);

  if (loading || !session) return <CardSkeleton count={4} />;

  const handleStatusChange = async (studentCode: string, newStatus: 'Present' | 'Absent' | 'Late' | 'Excused') => {
    await fakeApi.updateRosterAttendance(studentCode, newStatus);
    setRoster(prev => prev.map(r => r.code === studentCode ? { ...r, status: newStatus } : r));
    showToast(`Updated attendance for ${studentCode} to ${newStatus}`, 'info');
  };

  const handleEndSession = () => {
    setSessionActive(false);
    showToast('Lecture attendance session concluded and saved to database.', 'success');
  };

  const presentCount = roster.filter(r => r.status === 'Present').length;
  const lateCount = roster.filter(r => r.status === 'Late').length;
  const absentCount = roster.filter(r => r.status === 'Absent').length;

  return (
    <div>
      <PageHead
        title="Live QR Lecture Attendance"
        subtitle={`${session.course.code} · ${session.course.name} · Room: ${session.room} · ${session.sessionDate}`}
        breadcrumbs={[
          { label: 'Doctor Portal', href: '#/doctor/dashboard' },
          { label: 'CourseOfferings', href: '#/doctor/offerings' },
          { label: 'Live QR Attendance' }
        ]}
        actions={
          <div className="row gap-2">
            {sessionActive ? (
              <button className="btn btn-danger" onClick={handleEndSession}>
                <Icon name="xCircle" /> End Attendance Session
              </button>
            ) : (
              <button className="btn btn-success" onClick={() => { setSessionActive(true); showToast('Session resumed', 'info'); }}>
                <Icon name="checkCircle" /> Resume Session
              </button>
            )}
          </div>
        }
      />

      {/* Top Session Stats Bar */}
      <div className="grid g-4 mb-5">
        <div className="card p-4 text-center">
          <div className="sub text-xs">Present / Check-ins</div>
          <div style={{ fontSize: '24px', fontWeight: 750, color: 'var(--color-success)' }}>
            {presentCount} <small style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>students</small>
          </div>
        </div>
        <div className="card p-4 text-center">
          <div className="sub text-xs">Late Arrivals</div>
          <div style={{ fontSize: '24px', fontWeight: 750, color: 'var(--color-warning)' }}>
            {lateCount} <small style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>students</small>
          </div>
        </div>
        <div className="card p-4 text-center">
          <div className="sub text-xs">Absent</div>
          <div style={{ fontSize: '24px', fontWeight: 750, color: 'var(--color-danger)' }}>
            {absentCount} <small style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>students</small>
          </div>
        </div>
        <div className="card p-4 text-center">
          <div className="sub text-xs">Attendance Rate</div>
          <div style={{ fontSize: '24px', fontWeight: 750, color: 'var(--color-primary)' }}>
            {Math.round(((presentCount + lateCount) / roster.length) * 100)}%
          </div>
        </div>
      </div>

      <div className="grid g-3">
        {/* Left Column: Rotating Dynamic QR Code Display */}
        <div className="col-span-1">
          <div className="card p-6 text-center" style={{ position: 'sticky', top: '90px' }}>
            <div className="row-between mb-3">
              <span className={`badge ${sessionActive ? 'badge-success' : 'badge-neutral'}`}>
                {sessionActive ? '● Live Active QR' : 'Session Ended'}
              </span>
              <span className="badge badge-primary">Room: {session.room}</span>
            </div>

            {/* Rotating QR Box */}
            <div
              className="p-5 my-4"
              style={{
                background: '#fff',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                display: 'inline-block',
                border: '4px solid var(--color-primary)'
              }}
            >
              {/* Dynamic SVG QR Matrix */}
              <svg width="220" height="220" viewBox="0 0 100 100" fill="none">
                <rect width="100" height="100" fill="#ffffff" />
                {/* Outer corners */}
                <rect x="5" y="5" width="26" height="26" fill="#052659" rx="3" />
                <rect x="9" y="9" width="18" height="18" fill="#ffffff" />
                <rect x="13" y="13" width="10" height="10" fill="#052659" />

                <rect x="69" y="5" width="26" height="26" fill="#052659" rx="3" />
                <rect x="73" y="9" width="18" height="18" fill="#ffffff" />
                <rect x="77" y="13" width="10" height="10" fill="#052659" />

                <rect x="5" y="69" width="26" height="26" fill="#052659" rx="3" />
                <rect x="9" y="73" width="18" height="18" fill="#ffffff" />
                <rect x="13" y="77" width="10" height="10" fill="#052659" />

                {/* Randomized data blocks keyed to hash */}
                <rect x="36" y="8" width="6" height="6" fill="#021024" />
                <rect x="46" y="8" width="6" height="6" fill="#5483B3" />
                <rect x="56" y="8" width="6" height="6" fill="#021024" />
                <rect x="36" y="18" width="6" height="6" fill="#5483B3" />
                <rect x="46" y="24" width="8" height="8" fill="#052659" />
                <rect x="56" y="18" width="6" height="6" fill="#021024" />

                <rect x="8" y="36" width="6" height="6" fill="#021024" />
                <rect x="18" y="44" width="6" height="6" fill="#5483B3" />
                <rect x="8" y="54" width="6" height="6" fill="#021024" />

                <rect x="36" y="36" width="28" height="28" fill="#C1E8FF" rx="4" />
                <text x="50" y="53" textAnchor="middle" fill="#052659" fontSize="10" fontWeight="bold">FCAI</text>

                <rect x="68" y="36" width="6" height="6" fill="#021024" />
                <rect x="78" y="44" width="8" height="8" fill="#5483B3" />
                <rect x="86" y="36" width="6" height="6" fill="#021024" />

                <rect x="36" y="68" width="6" height="6" fill="#052659" />
                <rect x="46" y="74" width="6" height="6" fill="#021024" />
                <rect x="56" y="68" width="6" height="6" fill="#5483B3" />
                <rect x="46" y="84" width="8" height="8" fill="#052659" />
                <rect x="68" y="68" width="6" height="6" fill="#021024" />
                <rect x="78" y="78" width="8" height="8" fill="#052659" />
                <rect x="88" y="68" width="6" height="6" fill="#5483B3" />
              </svg>
            </div>

            {/* Countdown timer pill */}
            <div className="row-center gap-2 mb-2">
              <span className="badge badge-warning" style={{ fontSize: '13px', padding: '6px 14px' }}>
                <Icon name="clock" size="sm" /> Rotating in {tokenCounter}s
              </span>
            </div>
            <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>
              Token: {tokenHash}
            </div>

            <p className="sub text-xs mt-4">
              Project this screen on the lecture hall projector. Students scan using their FCAI mobile web portal.
            </p>
          </div>
        </div>

        {/* Right Column: Live Feed & Attendance Roster */}
        <div className="col-span-2">
          {/* Live Check-ins Stream */}
          <div className="card p-4 mb-4">
            <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>
              <Icon name="activity" size="sm" /> Live Check-in Stream
            </h4>
            <div className="row gap-2 wrap">
              {session.liveCheckIns.map((ci: any, idx: number) => (
                <div key={idx} className="chip chip-success" style={{ fontSize: '12px' }}>
                  <Icon name="checkCircle" size="sm" /> {ci.name} ({ci.time})
                </div>
              ))}
            </div>
          </div>

          {/* Full Roster with Manual Override Dropdowns */}
          <div className="card">
            <div className="card-head">
              <h3>Session Attendance Roster</h3>
              <span className="sub text-xs">Instructor can manually override any student's record</span>
            </div>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Student Code</th>
                    <th>Student Name</th>
                    <th>Scan Time</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Manual Override</th>
                  </tr>
                </thead>
                <tbody>
                  {roster.map(r => (
                    <tr key={r.code}>
                      <td><code>{r.code}</code></td>
                      <td className="bold">{r.name}</td>
                      <td className="sub text-xs">{r.time}</td>
                      <td className="text-xs">{r.method}</td>
                      <td>
                        <span className={`badge ${
                          r.status === 'Present' ? 'badge-success' :
                          r.status === 'Late' ? 'badge-warning' :
                          r.status === 'Excused' ? 'badge-info' : 'badge-danger'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td>
                        <div className="row gap-1">
                          <button
                            className={`btn btn-sm ${r.status === 'Present' ? 'btn-success' : 'btn-ghost'}`}
                            onClick={() => handleStatusChange(r.code, 'Present')}
                            title="Mark Present"
                          >
                            P
                          </button>
                          <button
                            className={`btn btn-sm ${r.status === 'Late' ? 'btn-warning' : 'btn-ghost'}`}
                            onClick={() => handleStatusChange(r.code, 'Late')}
                            title="Mark Late"
                          >
                            L
                          </button>
                          <button
                            className={`btn btn-sm ${r.status === 'Excused' ? 'btn-info' : 'btn-ghost'}`}
                            onClick={() => handleStatusChange(r.code, 'Excused')}
                            title="Mark Excused"
                          >
                            E
                          </button>
                          <button
                            className={`btn btn-sm ${r.status === 'Absent' ? 'btn-danger' : 'btn-ghost'}`}
                            onClick={() => handleStatusChange(r.code, 'Absent')}
                            title="Mark Absent"
                          >
                            A
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
      </div>
    </div>
  );
};
