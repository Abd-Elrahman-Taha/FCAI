import React, { useState, useEffect } from 'react';
import { Icon } from '../icons/Icon';

interface LiveCampusPulseProps {
  role?: string;
  nextSessionTitle?: string;
  nextSessionRoom?: string;
  nextSessionTime?: string;
  instructor?: string;
}

export const LiveCampusPulse: React.FC<LiveCampusPulseProps> = ({
  role = 'student',
  nextSessionTitle = 'Distributed Systems & Cloud Computing (CS411)',
  nextSessionRoom = 'Lecture Hall 302 (Building B)',
  instructor = 'Dr. Tariq El-Sayed'
}) => {
  // Countdown to next session
  const [secondsLeft, setSecondsLeft] = useState(5742); // 1h 35m 42s

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(prev => (prev > 0 ? prev - 1 : 7200));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="relative overflow-hidden rounded-2xl p-5 mb-6 border border-blue-200/70 dark:border-blue-900/40 bg-gradient-to-r from-blue-900/10 via-slate-50 to-blue-50/50 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-900 backdrop-blur-md shadow-sm transition-all duration-300 hover:shadow-md">
      {/* Moving Ambient Glow behind card */}
      <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-blue-400/15 dark:bg-blue-500/10 blur-3xl pointer-events-none animate-pulse"></div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Side: Live Activity & Frequency Visualizer */}
        <div className="flex items-start gap-3.5 min-w-0 flex-1">
          {/* Animated Frequency Bars Box */}
          <div className="relative flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-900 flex items-center justify-center shadow-md shadow-blue-500/20">
            {/* Animated dancing sound/signal frequency bars */}
            <div className="flex items-end gap-1 h-6">
              <span className="w-1 bg-white rounded-full animate-bar-1" style={{ height: '40%' }}></span>
              <span className="w-1 bg-white rounded-full animate-bar-2" style={{ height: '80%' }}></span>
              <span className="w-1 bg-white rounded-full animate-bar-3" style={{ height: '60%' }}></span>
              <span className="w-1 bg-white rounded-full animate-bar-4" style={{ height: '95%' }}></span>
              <span className="w-1 bg-white rounded-full animate-bar-5" style={{ height: '50%' }}></span>
            </div>
            {/* Ping dot */}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500 border-2 border-white dark:border-slate-900"></span>
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                Live Academic Stream
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Next Scheduled Session
              </span>
            </div>
            <h4 className="text-sm md:text-base font-bold text-slate-900 dark:text-white leading-tight">
              {nextSessionTitle}
            </h4>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-300 mt-1.5 font-medium">
              <span className="inline-flex items-center gap-1.5">
                <Icon name="mapPin" size="sm" className="text-blue-500 dark:text-blue-400" />
                {nextSessionRoom}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="briefcase" size="sm" className="text-blue-500 dark:text-blue-400" />
                {instructor}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Live Countdown & Quick Action (Solid Color Button) */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200/60 dark:border-slate-800/60">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 block">
              Starts In
            </span>
            <div className="font-mono text-lg md:text-xl font-extrabold text-blue-700 dark:text-blue-300 tracking-tight flex items-center gap-1">
              <Icon name="timer" size="sm" className="text-blue-500 animate-spin" style={{ animationDuration: '6s' }} />
              {formatCountdown(secondsLeft)}
            </div>
          </div>

          <a
            href={role === 'doctor' ? '#/doctor/attendance-session' : '#/student/qr-attendance'}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-[#052659] hover:bg-[#0b3a7a] active:scale-95 transition-all shadow-md shadow-blue-900/30 cursor-pointer whitespace-nowrap"
          >
            <Icon name={role === 'doctor' ? 'play' : 'qr'} size="sm" />
            <span>{role === 'doctor' ? 'Launch QR' : 'Scan Check-In'}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
