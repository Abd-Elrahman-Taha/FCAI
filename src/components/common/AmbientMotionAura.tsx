import React from 'react';

/**
 * AmbientMotionAura
 * Renders smooth floating ambient light orbs in the background
 * providing a living, breathing modern UI feel after logging in.
 */
export const AmbientMotionAura: React.FC = () => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden z-0" 
      aria-hidden="true"
      style={{ opacity: 'var(--aura-opacity, 0.45)' }}
    >
      {/* Orb 1: Floating Royal Blue Orb */}
      <div 
        className="absolute w-[520px] h-[520px] rounded-full blur-[110px] -top-24 -left-20 animate-aura-slow"
        style={{
          background: 'radial-gradient(circle, rgba(84, 131, 179, 0.35) 0%, rgba(5, 38, 89, 0.15) 70%, transparent 100%)',
        }}
      />

      {/* Orb 2: Floating Ice Accent Orb */}
      <div 
        className="absolute w-[440px] h-[440px] rounded-full blur-[95px] top-1/3 -right-24 animate-aura-reverse"
        style={{
          background: 'radial-gradient(circle, rgba(193, 232, 255, 0.32) 0%, rgba(84, 131, 179, 0.12) 70%, transparent 100%)',
        }}
      />

      {/* Orb 3: Floating Deep Teal Orb */}
      <div 
        className="absolute w-[480px] h-[480px] rounded-full blur-[120px] -bottom-28 left-1/3 animate-aura-drift"
        style={{
          background: 'radial-gradient(circle, rgba(47, 99, 160, 0.28) 0%, rgba(2, 16, 36, 0.2) 70%, transparent 100%)',
        }}
      />
    </div>
  );
};
