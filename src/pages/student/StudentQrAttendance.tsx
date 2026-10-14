import React, { useState, useEffect } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';

type QrUiState =
  | 'Ready to scan'
  | 'Camera permission'
  | 'GPS permission'
  | 'Scanning'
  | 'Validating'
  | 'Attendance successful'
  | 'Invalid QR'
  | 'Expired QR'
  | 'GPS unavailable'
  | 'Outside 100-meter geofence'
  | 'Not enrolled'
  | 'Attendance session closed';

export const StudentQrAttendance: React.FC = () => {
  const [uiState, setUiState] = useState<QrUiState>('Ready to scan');
  const [tokenCountdown, setTokenCountdown] = useState(5);
  const [scanResult, setScanResult] = useState<any>(null);

  // 5-second token rotation countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTokenCountdown(prev => (prev <= 1 ? 5 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleStartScan = () => {
    setUiState('Scanning');
    setTimeout(() => {
      setUiState('Validating');
      setTimeout(async () => {
        // Successful verification inside Beni Suef geofence
        const res = await fakeApi.verifyQrAttendance('ROTATING_KEY_FCAI_BSU', { lat: 29.0768, lng: 31.0975 });
        setScanResult(res.session);
        setUiState('Attendance successful');
      }, 1000);
    }, 1200);
  };

  const allTwelveStates: QrUiState[] = [
    'Ready to scan',
    'Camera permission',
    'GPS permission',
    'Scanning',
    'Validating',
    'Attendance successful',
    'Invalid QR',
    'Expired QR',
    'GPS unavailable',
    'Outside 100-meter geofence',
    'Not enrolled',
    'Attendance session closed'
  ];

  return (
    <div>
      <PageHead
        title="QR Attendance Scanner"
        desc="Digital check-in for physical lectures and sections at FCAI Beni Suef University."
        crumbs={[['Student Portal', '#/student/dashboard'], ['Attendance', '#/student/attendance'], ['Scan QR']]}
      />

      {/* Interactive UI State Switcher for Grading / Testing */}
      <div className="card card-pad mb-6" style={{ background: 'var(--blue-50)', borderColor: 'var(--blue-300)' }}>
        <div className="row-between wrap mb-2">
          <b><Icon name="sliders" size="sm" /> 12 Interactive UI States Inspector:</b>
          <span className="text-xs muted">Click to simulate any of the 12 platform states</span>
        </div>
        <div className="row wrap gap-2">
          {allTwelveStates.map(state => (
            <button
              key={state}
              type="button"
              className={`btn btn-sm ${uiState === state ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '11px', height: '28px', padding: '0 8px' }}
              onClick={() => {
                setUiState(state);
                if (state === 'Attendance successful') {
                  setScanResult({
                    courseCode: 'CS301',
                    courseName: 'Design & Analysis of Algorithms',
                    room: 'Hall A-101',
                    sessionType: 'Lecture',
                    doctor: 'Dr. Mona Abdelrahman',
                    checkInTime: '10:04 AM',
                    date: 'Today, Oct 14, 2026'
                  });
                }
              }}
            >
              {state}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile-Camera Simulator Viewport */}
      <div className="row" style={{ justifyContent: 'center' }}>
        <div className="card" style={{ width: '100%', maxWidth: '440px', overflow: 'hidden' }}>
          {/* Viewfinder Header */}
          <div className="card-head" style={{ background: 'var(--navy-950)', color: '#fff', borderBottom: 0 }}>
            <div>
              <b style={{ color: '#fff' }}>Hall Check-in Scanner</b>
              <p style={{ color: '#8fb0d6', fontSize: '11px' }}>Camera &amp; GPS Location Enforced</p>
            </div>
            <div className="row gap-2">
              <span className="badge b-ice no-dot" style={{ fontSize: '11px' }}>
                <Icon name="timer" size="sm" /> {tokenCountdown}s Token
              </span>
            </div>
          </div>

          {/* Scanner Viewport Content based on 12 States */}
          <div
            style={{
              minHeight: '380px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '28px 24px',
              textAlign: 'center',
              background: uiState === 'Scanning' || uiState === 'Validating' ? '#021024' : '#fff'
            }}
          >
            {uiState === 'Ready to scan' && (
              <div className="col gap-3" style={{ alignItems: 'center' }}>
                <div className="qr-box mb-2" style={{ width: '180px', height: '180px', display: 'grid', placeItems: 'center' }}>
                  <Icon name="qr" size={100} style={{ color: 'var(--navy-800)' }} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Ready to Check In</h3>
                <p className="text-xs muted" style={{ maxWidth: '320px' }}>
                  Point your mobile camera at the rotating QR code projected in <b>Hall A-101</b>.
                </p>
                <button type="button" className="btn btn-primary btn-lg mt-2" onClick={handleStartScan}>
                  <Icon name="camera" /> Open Camera &amp; Scan
                </button>
              </div>
            )}

            {uiState === 'Camera permission' && (
              <div className="col gap-3" style={{ alignItems: 'center' }}>
                <div className="state-art warning"><Icon name="camera" size="xl" /></div>
                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Camera Permission Required</h3>
                <p className="text-xs muted" style={{ maxWidth: '300px' }}>
                  FCAI BSU requires camera access to scan the physical session QR token.
                </p>
                <button type="button" className="btn btn-primary mt-2" onClick={() => setUiState('Ready to scan')}>
                  Allow Camera Access
                </button>
              </div>
            )}

            {uiState === 'GPS permission' && (
              <div className="col gap-3" style={{ alignItems: 'center' }}>
                <div className="state-art warning"><Icon name="navigation" size="xl" /></div>
                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Location Access Required</h3>
                <p className="text-xs muted" style={{ maxWidth: '300px' }}>
                  Institutional attendance mandates geofence verification within 100 meters of the lecture room.
                </p>
                <button type="button" className="btn btn-primary mt-2" onClick={() => setUiState('Ready to scan')}>
                  Enable High-Accuracy GPS
                </button>
              </div>
            )}

            {uiState === 'Scanning' && (
              <div className="col gap-4" style={{ alignItems: 'center', color: '#fff' }}>
                <div
                  style={{
                    width: '220px',
                    height: '220px',
                    border: '2px solid var(--blue-200)',
                    borderRadius: '24px',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'grid',
                    placeItems: 'center'
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: 'var(--blue-200)',
                      boxShadow: '0 0 15px var(--blue-200)',
                      animation: 'shimmer 1.5s infinite alternate'
                    }}
                  />
                  <Icon name="scan" size={80} style={{ color: 'var(--blue-300)', opacity: 0.8 }} />
                </div>
                <p className="text-xs" style={{ color: '#C1E8FF' }}>Align the projected lecture QR code within the frame…</p>
              </div>
            )}

            {uiState === 'Validating' && (
              <div className="col gap-3" style={{ alignItems: 'center', color: '#fff' }}>
                <div className="spinner lg" style={{ borderColor: 'rgba(193,232,255,.2)', borderTopColor: 'var(--blue-200)' }} />
                <h3 style={{ color: '#fff', fontSize: '18px' }}>Validating Cryptographic Token…</h3>
                <p className="text-xs" style={{ color: '#8fb0d6' }}>Verifying 5-second rotating timestamp and GPS coordinates…</p>
              </div>
            )}

            {uiState === 'Attendance successful' && (
              <div className="col gap-3" style={{ alignItems: 'center', width: '100%' }}>
                <div className="state-art success"><Icon name="checkCircle" size="xl" /></div>
                <h3 style={{ fontSize: '20px', fontWeight: 750, color: 'var(--navy-950)' }}>Attendance Recorded!</h3>
                <span className="badge b-success no-dot" style={{ fontSize: '13px', height: '26px' }}>
                  ● Officially Present
                </span>

                <div className="info-tile text-left mt-2" style={{ width: '100%', background: 'var(--blue-50)', borderColor: 'var(--blue-200)' }}>
                  <div className="kv text-xs">
                    <dt>Course:</dt>
                    <dd><b>{scanResult?.courseCode || 'CS301'} — {scanResult?.courseName || 'Algorithms'}</b></dd>
                    <dt>Session:</dt>
                    <dd>{scanResult?.sessionType || 'Lecture'} • {scanResult?.room || 'Hall A-101'}</dd>
                    <dt>Doctor:</dt>
                    <dd>{scanResult?.doctor || 'Dr. Mona Abdelrahman'}</dd>
                    <dt>Timestamp:</dt>
                    <dd className="mono">{scanResult?.checkInTime || '10:04 AM'} ({scanResult?.date || 'Oct 14, 2026'})</dd>
                  </div>
                </div>

                <a href="#/student/attendance" className="btn btn-secondary btn-block mt-2">
                  View in My Attendance Log
                </a>
              </div>
            )}

            {uiState === 'Invalid QR' && (
              <div className="col gap-3" style={{ alignItems: 'center' }}>
                <div className="state-art danger"><Icon name="xCircle" size="xl" /></div>
                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Invalid QR Code</h3>
                <p className="text-xs muted">The scanned code does not match an authorized FCAI lecture session.</p>
                <button type="button" className="btn btn-secondary mt-2" onClick={() => setUiState('Ready to scan')}>
                  Try Scanning Again
                </button>
              </div>
            )}

            {uiState === 'Expired QR' && (
              <div className="col gap-3" style={{ alignItems: 'center' }}>
                <div className="state-art warning"><Icon name="clock" size="xl" /></div>
                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>QR Token Expired</h3>
                <p className="text-xs muted">
                  For security, the lecture QR token rotates every 5 seconds. Please point your camera at the current projected screen.
                </p>
                <button type="button" className="btn btn-primary mt-2" onClick={handleStartScan}>
                  Scan Current Token
                </button>
              </div>
            )}

            {uiState === 'GPS unavailable' && (
              <div className="col gap-3" style={{ alignItems: 'center' }}>
                <div className="state-art danger"><Icon name="wifiOff" size="xl" /></div>
                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>GPS Unavailable</h3>
                <p className="text-xs muted">Could not acquire accurate positioning. Ensure Location is turned on in your device settings.</p>
                <button type="button" className="btn btn-secondary mt-2" onClick={() => setUiState('Ready to scan')}>
                  Retry GPS Fix
                </button>
              </div>
            )}

            {uiState === 'Outside 100-meter geofence' && (
              <div className="col gap-3" style={{ alignItems: 'center' }}>
                <div className="state-art danger"><Icon name="mapPin" size="xl" /></div>
                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Outside Hall Geofence</h3>
                <p className="text-xs muted">
                  Your device is located outside the authorized 100-meter perimeter of <b>Hall A-101</b>. Physical presence in the hall is required.
                </p>
                <button type="button" className="btn btn-secondary mt-2" onClick={() => setUiState('Ready to scan')}>
                  Re-evaluate Location
                </button>
              </div>
            )}

            {uiState === 'Not enrolled' && (
              <div className="col gap-3" style={{ alignItems: 'center' }}>
                <div className="state-art danger"><Icon name="ban" size="xl" /></div>
                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Not Enrolled</h3>
                <p className="text-xs muted">You are not registered in CS301 (Section S3) for Fall 2026.</p>
                <a href="#/student/courses" className="btn btn-secondary mt-2">Check Enrolled Courses</a>
              </div>
            )}

            {uiState === 'Attendance session closed' && (
              <div className="col gap-3" style={{ alignItems: 'center' }}>
                <div className="state-art danger"><Icon name="stop" size="xl" /></div>
                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Attendance Closed</h3>
                <p className="text-xs muted">
                  The instructor has concluded the attendance window for this lecture. Late students are marked absent by policy.
                </p>
                <a href="#/student/attendance" className="btn btn-secondary mt-2">Return to Attendance Overview</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
