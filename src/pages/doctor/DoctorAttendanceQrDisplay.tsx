import React, { useState, useEffect } from 'react';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';
import { NeonRadialGauge } from '../../components/common/NeonRadialGauge';
import { AnimatedCounter } from '../../components/common/AnimatedCounter';

interface CheckinStudent {
  id: string;
  name: string;
  code: string;
  secondsAgo: number;
}

export const DoctorAttendanceQrDisplay: React.FC = () => {
  const { showToast } = useAuth();
  const [tokenCountdown, setTokenCountdown] = useState(10);
  const [tokenHash, setTokenHash] = useState('BSU-CS301-A101-9938');
  const [liveCheckins, setLiveCheckins] = useState(54);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const totalEnrolled = 64;

  const [recentCheckins, setRecentCheckins] = useState<CheckinStudent[]>([
    { id: '1', name: 'Ahmed Hassan', code: '20230142', secondsAgo: 3 },
    { id: '2', name: 'Mariam Saeed', code: '20230089', secondsAgo: 7 },
    { id: '3', name: 'Omar Farouk', code: '20230198', secondsAgo: 11 },
    { id: '4', name: 'Nour El-Din', code: '20230231', secondsAgo: 15 },
    { id: '5', name: 'Salma Khaled', code: '20230054', secondsAgo: 20 },
    { id: '6', name: 'Youssef Adel', code: '20230310', secondsAgo: 26 },
  ]);

  // 10-Second Anti-Fraud Dynamic Token Rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setTokenCountdown(prev => {
        if (prev <= 1) {
          setIsRotating(true);
          const newHex = Math.floor(1000 + Math.random() * 9000);
          setTokenHash(`BSU-CS301-A101-${newHex}`);
          setTimeout(() => setIsRotating(false), 500);
          return 10;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update seconds ago and simulate incoming live students
  useEffect(() => {
    const checkinTickerTimer = setInterval(() => {
      setRecentCheckins(prev => {
        const updated = prev.map(c => ({ ...c, secondsAgo: c.secondsAgo + 2 }));

        // Periodically inject a new student check-in
        const poolNames = ['Ziad Mostafa', 'Hoda Tarek', 'Amr Sherif', 'Menna Essam', 'Kareem Nabil'];
        const randomName = poolNames[Math.floor(Math.random() * poolNames.length)];
        const randomCode = `20230${Math.floor(100 + Math.random() * 899)}`;

        if (Math.random() > 0.45 && updated.length < 15) {
          setLiveCheckins(count => Math.min(count + 1, totalEnrolled));
          return [
            { id: String(Date.now()), name: randomName, code: randomCode, secondsAgo: 1 },
            ...updated.slice(0, 7),
          ];
        }
        return updated.slice(0, 8);
      });
    }, 2000);

    return () => clearInterval(checkinTickerTimer);
  }, [totalEnrolled]);

  const handleCloseSession = () => {
    showToast('Attendance session closed! Unchecked students recorded as Absent.', 'info');
    window.location.hash = '#/doctor/attendance-review';
  };

  // 10-second circular countdown ring calculation
  const ringRadius = 26;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ((10 - tokenCountdown) / 10) * ringCircumference;

  return (
    <div className={isFullscreen ? 'fixed inset-0 z-50 bg-[#020b17] overflow-y-auto p-6 md:p-10 flex flex-col justify-between text-white' : ''}>
      <PageHead
        title="Dynamic Cryptographic QR Attendance Session"
        subtitle="Hall A-101 Smart Screen · 10-Second Anti-Proxy Token Rotation · Geo-Fencing Locked"
        breadcrumbs={[
          { label: 'Doctor Portal', href: '#/doctor/dashboard' },
          { label: 'Attendance', href: '#/doctor/attendance' },
          { label: 'Live QR Display' }
        ]}
        actions={
          <div className="row gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="btn btn-secondary text-white bg-[#0f172a] hover:bg-[#1e293b] border border-cyan-500/30"
            >
              <Icon name="monitor" /> {isFullscreen ? 'Exit Full Screen' : 'Projector Mode'}
            </button>
            <a href="#/doctor/attendance-monitor" className="btn btn-secondary text-white bg-[#0f172a] hover:bg-[#1e293b] border border-cyan-500/30">
              <Icon name="users" /> Live Roster
            </a>
            <button className="btn text-white bg-[#dc2626] hover:bg-[#b91c1c]" onClick={handleCloseSession}>
              <Icon name="xCircle" /> Finalize Session &rarr;
            </button>
          </div>
        }
      />

      <div className="card p-6 md:p-8 text-center mb-6 max-w-2xl mx-auto border border-cyan-500/30 bg-[#020b17]/90 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        {/* Hall & Course Telemetry Header */}
        <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-cyan-500/20">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e5ff] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00e5ff]" />
            </span>
            <span className="text-xs font-bold font-mono tracking-wider text-cyan-400 uppercase">
              CS301 Algorithm Analysis · Lecture 08
            </span>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#071d3d] text-cyan-300 border border-cyan-500/30">
            Hall A-101 (Floor 1)
          </span>
        </div>

        {/* Central QR Code Generator with 10-Second Countdown Dial */}
        <div className="relative inline-block my-2">
          {/* Outer glowing halo ring */}
          <div className={`p-6 bg-white rounded-2xl border-4 border-[#00e5ff] shadow-[0_0_40px_rgba(0,229,255,0.35)] transition-all duration-300 ${isRotating ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}>
            <svg width="220" height="220" viewBox="0 0 100 100" fill="none" className="select-none">
              <rect width="100" height="100" fill="#ffffff" />
              
              {/* Corner Position Targets */}
              <rect x="5" y="5" width="26" height="26" fill="#052659" rx="3" />
              <rect x="9" y="9" width="18" height="18" fill="#ffffff" />
              <rect x="13" y="13" width="10" height="10" fill="#052659" />

              <rect x="69" y="5" width="26" height="26" fill="#052659" rx="3" />
              <rect x="73" y="9" width="18" height="18" fill="#ffffff" />
              <rect x="77" y="13" width="10" height="10" fill="#052659" />

              <rect x="5" y="69" width="26" height="26" fill="#052659" rx="3" />
              <rect x="9" y="73" width="18" height="18" fill="#ffffff" />
              <rect x="13" y="77" width="10" height="10" fill="#052659" />

              {/* Center University Insignia */}
              <rect x="36" y="36" width="28" height="28" fill="#052659" rx="4" />
              <text x="50" y="53" textAnchor="middle" fill="#00e5ff" fontSize="9" fontWeight="900" fontFamily="sans-serif">
                BSU
              </text>

              {/* Dynamic QR Bit Clusters that visually shift with token rotation */}
              <rect x="36" y={isRotating ? '10' : '8'} width="6" height="6" fill="#021024" />
              <rect x="46" y={isRotating ? '16' : '18'} width="8" height="8" fill="#00e5ff" />
              <rect x="68" y="36" width="6" height="6" fill="#021024" />
              <rect x={isRotating ? '34' : '36'} y="68" width="8" height="8" fill="#052659" />
              <rect x="78" y={isRotating ? '76' : '78'} width="8" height="8" fill="#00e5ff" />
              <rect x="52" y="76" width="6" height="6" fill="#052659" />
              <rect x="18" y="46" width="8" height="8" fill="#021024" />
              <rect x="76" y="52" width="6" height="6" fill="#052659" />
            </svg>
          </div>
        </div>

        {/* 10-Second Circular Countdown Ring */}
        <div className="flex items-center justify-center gap-3 my-3">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg width="56" height="56" viewBox="0 0 60 60" className="-rotate-90">
              <circle
                cx="30"
                cy="30"
                r={ringRadius}
                fill="none"
                stroke="rgba(56, 189, 248, 0.15)"
                strokeWidth="4"
              />
              <circle
                cx="30"
                cy="30"
                r={ringRadius}
                fill="none"
                stroke={tokenCountdown <= 3 ? '#f59e0b' : '#00e5ff'}
                strokeWidth="4"
                strokeDasharray={ringCircumference}
                strokeDashoffset={ringOffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.8s linear' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-mono font-bold text-white">
              {tokenCountdown}s
            </div>
          </div>

          <div className="text-left">
            <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <Icon name="shieldCheck" size="sm" className="text-[#00e5ff]" />
              <span>Anti-Fraud Crypto Token Active</span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-0.5">
              Hash: <span className="text-[#00e5ff] font-semibold">{tokenHash}</span>
            </div>
          </div>
        </div>

        {/* Real-time KPI Card with Neon Radial Gauge */}
        <div className="card p-4 mt-4 bg-[#051833] border border-cyan-500/20 text-left">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Live Checked-in Verified Students
              </span>
              <div className="text-3xl font-extrabold text-white mt-1 flex items-baseline gap-2">
                <AnimatedCounter value={liveCheckins} />
                <span className="text-sm font-normal text-slate-400">/ {totalEnrolled} Cohort</span>
              </div>
              <div className="text-xs text-cyan-300 mt-1">
                {totalEnrolled - liveCheckins} students remaining in lecture hall
              </div>
            </div>

            <NeonRadialGauge
              value={Math.round((liveCheckins / totalEnrolled) * 100)}
              max={100}
              size={72}
              strokeWidth={6}
              sublabel="%"
              label="SYNC"
              glowColor="cyan"
            />
          </div>
        </div>
      </div>

      {/* Live Horizontal Check-in Stream & Real-Time Ticker */}
      <div className="max-w-4xl mx-auto w-full mt-2">
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00e5ff] animate-ping" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 font-mono">
              Live Check-in Ticker Feed
            </h4>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Real-time attendance stream</span>
        </div>

        {/* Horizontal Scrolling Ticker Container */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {recentCheckins.map(item => (
            <div
              key={item.id}
              className="flex-shrink-0 flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#051b3b] border border-cyan-500/30 text-white shadow-md transition-all duration-300 hover:border-[#00e5ff]"
            >
              <div className="w-6 h-6 rounded-full bg-[#00e5ff]/20 text-[#00e5ff] flex items-center justify-center font-bold text-[10px] font-mono">
                ✓
              </div>
              <div>
                <div className="text-xs font-bold text-white truncate max-w-[130px]">{item.name}</div>
                <div className="text-[10px] text-cyan-300/80 font-mono">
                  {item.code} · <span className="text-[#00e5ff] font-semibold">{item.secondsAgo}s ago</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
