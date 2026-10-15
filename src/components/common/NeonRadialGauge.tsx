import React, { useEffect, useState } from 'react';
import { AnimatedCounter } from './AnimatedCounter';

interface NeonRadialGaugeProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  decimals?: number;
  warningThreshold?: number; // e.g. 75 for attendance
  glowColor?: 'cyan' | 'amber' | 'blue';
  className?: string;
}

export const NeonRadialGauge: React.FC<NeonRadialGaugeProps> = ({
  value,
  max = 100,
  size = 110,
  strokeWidth = 7,
  label,
  sublabel,
  decimals = 0,
  warningThreshold,
  glowColor,
  className = '',
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Delay stroke offset slightly so the animation sweeps smoothly into view
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = mounted
    ? circumference - (percentage / 100) * circumference
    : circumference;

  // Determine color scheme: NO GREEN EVER
  // If warningThreshold is provided and value is below threshold, use amber alert
  const isWarning = warningThreshold !== undefined && value < warningThreshold;
  
  const primaryStroke = glowColor === 'amber' || isWarning
    ? '#f59e0b'
    : glowColor === 'blue'
    ? '#38bdf8'
    : '#00e5ff';

  const glowRgba = glowColor === 'amber' || isWarning
    ? 'rgba(245, 158, 11, 0.65)'
    : glowColor === 'blue'
    ? 'rgba(56, 189, 248, 0.65)'
    : 'rgba(0, 229, 255, 0.75)';

  const filterId = `neon-glow-${primaryStroke.replace('#', '')}-${size}`;

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible -rotate-90"
      >
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor={glowRgba} />
          </filter>
        </defs>

        {/* Outer Sci-Fi Tick Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius + 3}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2 6"
          className="text-slate-400/20 dark:text-cyan-400/20"
        />

        {/* Track Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-200 dark:text-slate-800/80"
        />

        {/* Animated Neon Value Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={primaryStroke}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          filter={`url(#${filterId})`}
          style={{
            transition: 'stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </svg>

      {/* Central Metric Telemetry Display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none select-none px-1">
        <div className="flex items-baseline justify-center">
          <AnimatedCounter
            value={value}
            decimals={decimals}
            className="text-base font-bold font-mono tracking-tight text-slate-900 dark:text-white"
          />
          {sublabel && (
            <span className="text-[10px] ml-0.5 font-medium opacity-70 text-slate-600 dark:text-slate-300">
              {sublabel}
            </span>
          )}
        </div>
        {label && (
          <span
            className="text-[9px] tracking-wider uppercase font-semibold font-mono mt-0.5"
            style={{ color: primaryStroke }}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
};
