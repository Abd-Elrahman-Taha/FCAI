import React from 'react';

export const LoadingSkeleton: React.FC<{ rows?: number; height?: number; className?: string }> = ({
  rows = 3,
  height = 48,
  className = ''
}) => {
  return (
    <div className={`col gap-3 ${className}`} style={{ width: '100%' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{ width: '100%', height: `${height}px`, borderRadius: '10px' }}
        />
      ))}
    </div>
  );
};

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid g-4 mb-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card card-pad">
          <div className="skeleton mb-3" style={{ width: '50%', height: '16px' }} />
          <div className="skeleton mb-2" style={{ width: '80%', height: '32px' }} />
          <div className="skeleton" style={{ width: '40%', height: '14px' }} />
        </div>
      ))}
    </div>
  );
};
