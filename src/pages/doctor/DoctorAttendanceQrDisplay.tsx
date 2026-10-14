import React, { useState, useEffect } from 'react';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';

export const DoctorAttendanceQrDisplay: React.FC = () => {
  const { showToast } = useAuth();
  const [tokenCountdown, setTokenCountdown] = useState(5);
  const [tokenHash, setTokenHash] = useState('BSU-LEC-9938');
  const [liveCheckins, setLiveCheckins] = useState(54);
  const totalEnrolled = 64;

  useEffect(() => {
    const timer = setInterval(() => {
      setTokenCountdown(prev => {
        if (prev <= 1) {
          setTokenHash(`BSU-LEC-${Math.floor(1000 + Math.random() * 9000)}`);
          return 5;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCloseSession = () => {
    showToast('Attendance session closed! Unchecked students set to Absent.', 'warning');
    window.location.hash = '#/doctor/attendance-review';
  };

  return (
    <div>
      <PageHead
        title="Screen 57: Dynamic Rotating QR Code Display"
        subtitle="Project on Hall A-101 Screen · Anti-Collusion 5-Second Token Rotation"
        breadcrumbs={[
          { label: 'Doctor Portal', href: '#/doctor/dashboard' },
          { label: 'Attendance', href: '#/doctor/attendance' },
          { label: 'Live QR Display' }
        ]}
        actions={
          <div className="row gap-2">
            <a href="#/doctor/attendance-monitor" className="btn btn-secondary">
              <Icon name="users" /> Live Roster Monitor
            </a>
            <a href="#/doctor/attendance-manual" className="btn btn-secondary">
              <Icon name="edit" /> Fallback Manual
            </a>
            <button className="btn btn-danger" onClick={handleCloseSession}>
              <Icon name="xCircle" /> Close Session &rarr;
            </button>
          </div>
        }
      />

      <div className="card p-8 text-center mb-6" style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div className="row-between mb-4">
          <span className="badge badge-success">● Session Live: CS301 Lecture</span>
          <span className="badge badge-primary">Hall A-101</span>
        </div>

        {/* Big Rotating QR Vector Box */}
        <div
          className="p-6 my-4 inline-block bg-white rounded-xl"
          style={{ border: '4px solid var(--color-primary)', boxShadow: '0 12px 36px rgba(0,0,0,0.12)' }}
        >
          <svg width="240" height="240" viewBox="0 0 100 100" fill="none">
            <rect width="100" height="100" fill="#ffffff" />
            <rect x="5" y="5" width="26" height="26" fill="#052659" rx="3" />
            <rect x="9" y="9" width="18" height="18" fill="#ffffff" />
            <rect x="13" y="13" width="10" height="10" fill="#052659" />

            <rect x="69" y="5" width="26" height="26" fill="#052659" rx="3" />
            <rect x="73" y="9" width="18" height="18" fill="#ffffff" />
            <rect x="77" y="13" width="10" height="10" fill="#052659" />

            <rect x="5" y="69" width="26" height="26" fill="#052659" rx="3" />
            <rect x="9" y="73" width="18" height="18" fill="#ffffff" />
            <rect x="13" y="77" width="10" height="10" fill="#052659" />

            <rect x="36" y="36" width="28" height="28" fill="#C1E8FF" rx="4" />
            <text x="50" y="53" textAnchor="middle" fill="#052659" fontSize="9" fontWeight="bold">BSU</text>

            <rect x="36" y="8" width="6" height="6" fill="#021024" />
            <rect x="46" y="18" width="8" height="8" fill="#5483B3" />
            <rect x="68" y="36" width="6" height="6" fill="#021024" />
            <rect x="36" y="68" width="8" height="8" fill="#052659" />
            <rect x="78" y="78" width="8" height="8" fill="#052659" />
          </svg>
        </div>

        {/* 5-second indicator */}
        <div className="row-center gap-2 mb-2">
          <span className="badge badge-warning" style={{ fontSize: '14px', padding: '6px 16px' }}>
            <Icon name="clock" size="sm" /> Token rotating in {tokenCountdown}s
          </span>
        </div>
        <div className="text-xs font-mono sub">Rotating Token Hash: {tokenHash}</div>

        {/* Real-time Counter */}
        <div className="card p-4 mt-5" style={{ background: 'var(--color-bg-page)' }}>
          <div className="sub text-xs">Live Checked-in Students</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-success)' }}>
            {liveCheckins} <small style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>/ {totalEnrolled} students</small>
          </div>
          <div className="progress-bar mt-2">
            <div className="progress-fill" style={{ width: `${(liveCheckins / totalEnrolled) * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};
