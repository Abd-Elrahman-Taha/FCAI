import React from 'react';

/**
 * AmbientMotionAura
 * Renders smooth floating ambient light orbs in the background
 * providing a living, breathing modern cyber UI feel matching the Home Page.
 */
export const AmbientMotionAura: React.FC = () => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden z-0" 
      aria-hidden="true"
    >
      {/* 1. Subtle Slow-Drifting Cyber-Grid Backdrop Mesh (MIT/NASA Tech Aesthetic) */}
      <div className="cyber-grid-overlay" />

      {/* 2. Constellation Connection Dots & Crosshairs */}
      <div className="cyber-nodes-mesh">
        <span className="cyber-dot" style={{ top: '15%', left: '12%', animationDelay: '0s' }} />
        <span className="cyber-dot" style={{ top: '28%', left: '84%', animationDelay: '2s' }} />
        <span className="cyber-dot" style={{ top: '65%', left: '18%', animationDelay: '1.2s' }} />
        <span className="cyber-dot" style={{ top: '78%', left: '76%', animationDelay: '3.1s' }} />
        <span className="cyber-dot" style={{ top: '42%', left: '52%', animationDelay: '0.8s' }} />
        <span className="cyber-dot" style={{ top: '88%', left: '35%', animationDelay: '2.5s' }} />
        <span className="cyber-crosshair" style={{ top: '20%', left: '70%', animationDelay: '1.5s' }} />
        <span className="cyber-crosshair" style={{ top: '55%', left: '10%', animationDelay: '3.5s' }} />
        <span className="cyber-crosshair" style={{ top: '80%', left: '85%', animationDelay: '0.5s' }} />
      </div>

      {/* Orb 1: Electric Blue Orb - Top Left */}
      <div 
        className="absolute w-[580px] h-[580px] rounded-full blur-[130px] -top-32 -left-24 animate-orb-float opacity-30 dark:opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.4) 0%, rgba(2, 11, 23, 0) 70%)',
        }}
      />

      {/* Orb 2: Neon Cyan Orb - Center Right */}
      <div 
        className="absolute w-[520px] h-[520px] rounded-full blur-[120px] top-1/4 -right-20 animate-float-slow opacity-35 dark:opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(34, 211, 238, 0.45) 0%, rgba(56, 189, 248, 0.1) 70%, transparent 100%)',
        }}
      />

      {/* Orb 3: Steel Blue Orb - Bottom Left */}
      <div 
        className="absolute w-[460px] h-[460px] rounded-full blur-[125px] -bottom-24 left-1/4 animate-float-delayed opacity-25 dark:opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(84, 131, 179, 0.4) 0%, rgba(5, 38, 89, 0.15) 70%, transparent 100%)',
        }}
      />

      {/* Orb 4: Ice Blue Glow - Center */}
      <div 
        className="absolute w-[400px] h-[400px] rounded-full blur-[140px] top-2/3 right-1/3 animate-float opacity-20 dark:opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(193, 232, 255, 0.3) 0%, transparent 70%)',
        }}
      />
    </div>
  );
};
