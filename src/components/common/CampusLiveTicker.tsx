import React, { useState, useEffect } from 'react';
import { Icon } from '../icons/Icon';

interface TickerItem {
  id: string;
  badge: string;
  badgeType: 'info' | 'success' | 'warning' | 'violet';
  text: string;
  link?: string;
}

const TICKER_ITEMS: TickerItem[] = [
  {
    id: '1',
    badge: 'LIVE ALERT',
    badgeType: 'warning',
    text: 'Spring 2026 Course Add/Drop Period closes Thursday 11:59 PM. Review registered credits.',
    link: '#/student/registration'
  },
  {
    id: '2',
    badge: 'LAB ACTIVE',
    badgeType: 'info',
    text: 'AI & Robotics Lab Session #04 in progress at Computer Lab 3 with Eng. Omar Farouk.',
    link: '#/student/timetable'
  },
  {
    id: '3',
    badge: 'EXAM COMMITTEE',
    badgeType: 'violet',
    text: 'Midterm Examination Schedule for Spring 2026 is published for all CS, IS, AI departments.',
    link: '#/student/exam-schedule'
  },
  {
    id: '4',
    badge: 'SMART ATTENDANCE',
    badgeType: 'success',
    text: 'Hall 302 Geo-Fencing is ACTIVE for Distributed Systems lecture. QR ready on student app.',
    link: '#/student/qr-attendance'
  },
  {
    id: '5',
    badge: 'RESEARCH GRANT',
    badgeType: 'info',
    text: 'Beni Suef University signs joint AI in Healthcare research collaboration grant with ASRT.',
  }
];

export const CampusLiveTicker: React.FC = () => {
  const [time, setTime] = useState<string>('');
  const [isPaused, setIsPaused] = useState(false);

  // Live ticking clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      className="relative z-10 w-full mb-4 px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-xs overflow-hidden flex items-center justify-between gap-3 text-xs"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Left indicator: live pulse & label */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span className="font-bold tracking-wider uppercase text-[11px] text-slate-700 dark:text-slate-300">
          Campus Radar
        </span>
        <span className="hidden sm:inline-block w-px h-3.5 bg-slate-300 dark:bg-slate-700 mx-1"></span>
      </div>

      {/* Center: moving marquee items */}
      <div className="flex-1 overflow-hidden relative">
        <div 
          className={`flex items-center gap-8 whitespace-nowrap animate-marquee ${isPaused ? 'paused' : ''}`}
        >
          {TICKER_ITEMS.concat(TICKER_ITEMS).map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                item.badgeType === 'warning' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/40' :
                item.badgeType === 'success' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/40' :
                item.badgeType === 'violet' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-300/40' :
                'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300/40'
              }`}>
                {item.badge}
              </span>
              {item.link ? (
                <a 
                  href={item.link} 
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium cursor-pointer"
                >
                  {item.text}
                </a>
              ) : (
                <span className="font-medium">{item.text}</span>
              )}
              <span className="text-slate-400 dark:text-slate-600 select-none">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right side: Live digital clock with blinking separator */}
      <div className="flex items-center gap-2 flex-shrink-0 text-slate-500 dark:text-slate-400 font-mono text-[11px] font-semibold bg-slate-100/80 dark:bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700/60">
        <Icon name="clock" size="sm" className="text-blue-500 dark:text-blue-400 animate-pulse" />
        <span>{time || '00:00:00'}</span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 hidden md:inline">BSU-EGY</span>
      </div>
    </div>
  );
};
