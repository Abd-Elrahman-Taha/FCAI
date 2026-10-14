import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

export const TaAttendance: React.FC = () => {
  const { showToast } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sessionActive, setSessionActive] = useState(true);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrToken, setQrToken] = useState('BSU-LAB-S3-9821');

  useEffect(() => {
    fakeApi.getTaSectionAttendance('sec1').then(res => {
      setData(res);
      setLoading(false);
    });

    // Simulate rotating token every 5s if modal open
    const interval = setInterval(() => {
      setQrToken(`BSU-LAB-S3-${Math.floor(1000 + Math.random() * 9000)}`);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleManualStatusChange = (code: string, newStatus: string) => {
    setData((prev: any) => ({
      ...prev,
      roster: prev.roster.map((r: any) =>
        r.code === code ? { ...r, status: newStatus, time: newStatus === 'Absent' ? '—' : 'Just now', method: 'Manual Entry' } : r
      )
    }));
    showToast(`Updated attendance status for ${code} to ${newStatus}.`, 'info');
  };

  const handleCloseSession = () => {
    if (window.confirm('Close lab attendance session? Any unchecked students will automatically be registered as Absent.')) {
      setSessionActive(false);
      setQrModalOpen(false);
      showToast('Lab attendance session closed. Data synchronized with Course Gradebook.', 'success');
    }
  };

  if (loading || !data) return <CardSkeleton count={4} />;

  const presentCount = data.roster.filter((r: any) => r.status === 'Present').length;
  const lateCount = data.roster.filter((r: any) => r.status === 'Late').length;
  const absentCount = data.roster.filter((r: any) => r.status === 'Absent').length;

  return (
    <div>
      <PageHead
        title="Screen 71: Lab Session Attendance & QR Code Display"
        subtitle={`${data.sectionName} · ${data.room} · ${data.schedule}`}
        breadcrumbs={[
          { label: 'TA Portal', href: '#/ta/dashboard' },
          { label: 'Sections', href: '#/ta/sections' },
          { label: 'Screen 71: Lab Attendance' }
        ]}
        actions={
          <div className="row gap-2">
            {sessionActive ? (
              <>
                <button className="btn btn-ice" onClick={() => setQrModalOpen(true)}>
                  <Icon name="qr" /> Display Section QR Code
                </button>
                <button className="btn btn-danger" onClick={handleCloseSession}>
                  <Icon name="xCircle" /> Close Session
                </button>
              </>
            ) : (
              <button className="btn btn-secondary" onClick={() => { setSessionActive(true); showToast('Lab attendance session reopened.', 'info'); }}>
                <Icon name="refresh" /> Reopen Session
              </button>
            )}
          </div>
        }
      />

      {/* KPI Stats */}
      <div className="grid g-4 mb-4">
        <div className="card p-3">
          <div className="text-xs sub bold">Session State</div>
          <div className="mt-1">
            <span className={`badge ${sessionActive ? 'badge-success' : 'badge-neutral'}`}>
              {sessionActive ? '🟢 Live Session Open' : '🔒 Session Finalized'}
            </span>
          </div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Present Count</div>
          <div className="h3 bold text-success mt-1">{presentCount} <span className="text-xs sub">Students</span></div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Late Check-ins</div>
          <div className="h3 bold text-warning mt-1">{lateCount} <span className="text-xs sub">Students</span></div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Absent / Unmarked</div>
          <div className="h3 bold text-danger mt-1">{absentCount} <span className="text-xs sub">Students</span></div>
        </div>
      </div>

      {/* Attendance Roster Table */}
      <div className="card overflow-hidden">
        <div className="card-head">
          <div className="row-between">
            <div>
              <h3>Lab Section Check-in Roster</h3>
              <p className="text-xs sub mt-1">Students can scan rotating QR or be manually verified by the lab teaching assistant.</p>
            </div>
            <button className="btn btn-neutral btn-sm" onClick={() => showToast('Attendance roster exported.', 'info')}>
              <Icon name="download" /> Export List
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '130px' }}>Student Code</th>
                <th>Full Name</th>
                <th style={{ width: '130px' }}>Status</th>
                <th style={{ width: '120px' }}>Check-in Time</th>
                <th style={{ width: '140px' }}>Method</th>
                <th style={{ width: '220px' }} className="text-center">Manual Override</th>
              </tr>
            </thead>
            <tbody>
              {data.roster.map((r: any) => (
                <tr key={r.code}>
                  <td><code>{r.code}</code></td>
                  <td>
                    <div className="bold">{r.name}</div>
                  </td>
                  <td>
                    <span className={`badge ${r.status === 'Present' ? 'badge-success' : r.status === 'Late' ? 'badge-warning' : 'badge-danger'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td><span className="text-xs sub">{r.time}</span></td>
                  <td><span className="text-xs">{r.method}</span></td>
                  <td className="text-center">
                    <div className="row gap-1 justify-center">
                      <button
                        className="btn btn-neutral btn-sm"
                        style={{ padding: '2px 8px', fontSize: '11px' }}
                        onClick={() => handleManualStatusChange(r.code, 'Present')}
                      >
                        Present
                      </button>
                      <button
                        className="btn btn-neutral btn-sm"
                        style={{ padding: '2px 8px', fontSize: '11px' }}
                        onClick={() => handleManualStatusChange(r.code, 'Late')}
                      >
                        Late
                      </button>
                      <button
                        className="btn btn-neutral btn-sm"
                        style={{ padding: '2px 8px', fontSize: '11px' }}
                        onClick={() => handleManualStatusChange(r.code, 'Absent')}
                      >
                        Absent
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Code Presentation Modal */}
      {qrModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '440px', textAlign: 'center' }}>
            <div className="modal-head">
              <h3>Lab QR Attendance Screen</h3>
              <button className="btn-close" onClick={() => setQrModalOpen(false)}>×</button>
            </div>
            <div className="modal-body p-6 stack gap-4 align-center">
              <span className="badge badge-primary">{data.sectionName}</span>

              {/* Dynamic QR Presentation Mock */}
              <div
                style={{
                  width: '220px',
                  height: '220px',
                  background: 'white',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  border: '2px solid var(--color-border)'
                }}
              >
                <Icon name="qr" size="xl" />
                <code className="text-xs bold text-dark mt-2">{qrToken}</code>
              </div>

              <div className="text-xs sub">
                Rotating dynamic QR token (refreshes every 5 seconds) to prevent photo forwarding.
              </div>

              <button className="btn btn-secondary w-full" onClick={() => setQrModalOpen(false)}>
                Minimize QR Display
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
