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
  const [tokenCountdown, setTokenCountdown] = useState(10);

  useEffect(() => {
    fakeApi.getTaSectionAttendance('sec1').then(res => {
      setData(res);
      setLoading(false);
    });

    // 10-Second Anti-Fraud Rotating QR Token
    const interval = setInterval(() => {
      setTokenCountdown(prev => {
        if (prev <= 1) {
          setQrToken(`BSU-LAB-S3-${Math.floor(1000 + Math.random() * 9000)}`);
          return 10;
        }
        return prev - 1;
      });
    }, 1000);
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
          <div className="modal-card border border-cyan-500/30 bg-[#020b17] text-white" style={{ maxWidth: '480px', textAlign: 'center' }}>
            <div className="modal-head border-b border-cyan-500/20 bg-[#052659] p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00e5ff] animate-ping" />
                <h3 className="text-white text-base font-bold font-mono">Dynamic Lab QR Attendance</h3>
              </div>
              <button className="btn-close text-white hover:text-cyan-300" onClick={() => setQrModalOpen(false)}>×</button>
            </div>
            <div className="modal-body p-6 stack gap-4 align-center">
              <div className="flex items-center justify-between w-full">
                <span className="badge badge-primary">{data.sectionName}</span>
                <span className="text-xs font-mono text-cyan-300 bg-[#071d3d] px-2.5 py-1 rounded border border-cyan-500/30">
                  {data.room}
                </span>
              </div>

              {/* Dynamic QR Presentation with Neon Border */}
              <div
                style={{
                  width: '210px',
                  height: '210px',
                  background: 'white',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 30px rgba(0, 229, 255, 0.35)',
                  border: '3px solid #00e5ff'
                }}
              >
                <Icon name="qr" size="xl" className="text-[#052659]" />
                <code className="text-xs bold text-[#052659] mt-3 font-mono tracking-wider">{qrToken}</code>
              </div>

              {/* 10-Second Countdown Circular Ring */}
              <div className="flex items-center justify-center gap-3">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <svg width="48" height="48" viewBox="0 0 50 50" className="-rotate-90">
                    <circle
                      cx="25"
                      cy="25"
                      r="20"
                      fill="none"
                      stroke="rgba(56, 189, 248, 0.15)"
                      strokeWidth="3.5"
                    />
                    <circle
                      cx="25"
                      cy="25"
                      r="20"
                      fill="none"
                      stroke={tokenCountdown <= 3 ? '#f59e0b' : '#00e5ff'}
                      strokeWidth="3.5"
                      strokeDasharray={2 * Math.PI * 20}
                      strokeDashoffset={((10 - tokenCountdown) / 10) * (2 * Math.PI * 20)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[11px] font-mono font-bold text-white">
                    {tokenCountdown}s
                  </div>
                </div>
                <div className="text-left text-xs">
                  <div className="font-bold text-cyan-300 font-mono">10s Anti-Proxy Rotation</div>
                  <div className="text-[11px] text-slate-400">Cryptographic time-lock active</div>
                </div>
              </div>

              {/* Live Ticker Feed */}
              <div className="w-full bg-[#071d3d] border border-cyan-500/20 rounded-xl p-3 text-left">
                <div className="text-[10px] font-mono text-cyan-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff]" />
                  <span>Recent Lab Check-ins:</span>
                </div>
                <div className="text-xs text-slate-200 font-mono space-y-1">
                  <div>• Ahmed Hassan (20230142) checked in (4s ago)</div>
                  <div>• Mariam Saeed (20230089) checked in (9s ago)</div>
                </div>
              </div>

              <button
                className="btn w-full bg-[#052659] hover:bg-[#07367e] text-white border border-cyan-500/40"
                onClick={() => setQrModalOpen(false)}
              >
                Minimize QR Display
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
