import React from 'react';
import { FCAILogo } from '../icons/Icon';

export const EducationHeroIllustration: React.FC = () => {
  return (
    <div className="edu-art-container" aria-label="FCAI Beni Suef University Educational Graphic">
      {/* Background Ambient Glows */}
      <div className="edu-art-glow edu-art-glow-1" />
      <div className="edu-art-glow edu-art-glow-2" />

      {/* Floating Holographic Badge 1 */}
      <div className="edu-floating-card edu-card-top-right">
        <div className="edu-card-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div>
          <span className="edu-card-label">Beni Suef University</span>
          <strong className="edu-card-title">Faculty of Computers &amp; AI</strong>
        </div>
      </div>

      {/* Main Educational Graphic SVG */}
      <div className="edu-art-svg-wrapper">
        <svg
          viewBox="0 0 540 460"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="edu-hero-svg"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="capGrad" x1="50" y1="50" x2="450" y2="250" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0a326c" />
              <stop offset="50%" stopColor="#052659" />
              <stop offset="100%" stopColor="#021024" />
            </linearGradient>

            <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            <linearGradient id="bookGrad" x1="120" y1="200" x2="420" y2="380" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#C1E8FF" />
              <stop offset="35%" stopColor="#7DA0CA" />
              <stop offset="70%" stopColor="#5483B3" />
              <stop offset="100%" stopColor="#052659" />
            </linearGradient>

            <linearGradient id="screenGrad" x1="160" y1="220" x2="380" y2="360" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#031a3a" />
              <stop offset="100%" stopColor="#021024" />
            </linearGradient>

            <linearGradient id="glowLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#5483B3" stopOpacity="0" />
              <stop offset="50%" stopColor="#C1E8FF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#5483B3" stopOpacity="0" />
            </linearGradient>

            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Academic Knowledge Grid / Neural Network Constellation */}
          <g opacity="0.3" stroke="#7DA0CA" strokeWidth="1" strokeDasharray="3 3">
            <line x1="80" y1="120" x2="270" y2="70" />
            <line x1="270" y1="70" x2="460" y2="130" />
            <line x1="140" y1="230" x2="270" y2="70" />
            <line x1="400" y1="230" x2="270" y2="70" />
            <line x1="70" y1="320" x2="270" y2="380" />
            <line x1="470" y1="320" x2="270" y2="380" />
          </g>

          {/* Constellation Nodes */}
          <g>
            <circle cx="80" cy="120" r="4" fill="#C1E8FF" />
            <circle cx="460" cy="130" r="4" fill="#C1E8FF" />
            <circle cx="140" cy="230" r="3" fill="#7DA0CA" />
            <circle cx="400" cy="230" r="3" fill="#7DA0CA" />
            <circle cx="70" cy="320" r="4" fill="#C1E8FF" />
            <circle cx="470" cy="320" r="4" fill="#C1E8FF" />
          </g>

          {/* Concentric Halo around center */}
          <circle cx="270" cy="220" r="160" stroke="#5483B3" strokeWidth="1" opacity="0.25" strokeDasharray="4 6" />
          <circle cx="270" cy="220" r="195" stroke="#7DA0CA" strokeWidth="1" opacity="0.15" />

          {/* Base Digital Stand / Campus Platform */}
          <ellipse cx="270" cy="390" rx="190" ry="32" fill="#021024" opacity="0.7" filter="url(#neonGlow)" />
          <ellipse cx="270" cy="385" rx="160" ry="24" fill="#052659" opacity="0.8" stroke="#5483B3" strokeWidth="2" />
          <ellipse cx="270" cy="380" rx="130" ry="16" fill="#0b3a7a" opacity="0.9" />

          {/* Open Digital Academic Book / Laptop Base */}
          <path
            d="M130 310 C190 290, 240 300, 270 315 C300 300, 350 290, 410 310 L415 325 C355 305, 305 315, 270 330 C235 315, 185 305, 125 325 Z"
            fill="url(#bookGrad)"
            stroke="#C1E8FF"
            strokeWidth="1.5"
          />

          {/* Glowing Center Hologram Screen (Education Portal) */}
          <g className="edu-pulse-screen">
            <rect
              x="165"
              y="170"
              width="210"
              height="130"
              rx="12"
              fill="url(#screenGrad)"
              stroke="#5483B3"
              strokeWidth="2"
              filter="url(#neonGlow)"
            />
            {/* Screen Header Bar */}
            <rect x="165" y="170" width="210" height="24" rx="12" fill="#052659" />
            <circle cx="180" cy="182" r="3.5" fill="#EF4444" />
            <circle cx="192" cy="182" r="3.5" fill="#F59E0B" />
            <circle cx="204" cy="182" r="3.5" fill="#38bdf8" />
            <rect x="225" y="178" width="90" height="8" rx="4" fill="#5483B3" opacity="0.5" />

            {/* Code & Learning lines on screen */}
            <line x1="185" y1="210" x2="310" y2="210" stroke="#C1E8FF" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="185" y1="225" x2="260" y2="225" stroke="#7DA0CA" strokeWidth="2" strokeLinecap="round" />
            <line x1="185" y1="240" x2="335" y2="240" stroke="#5483B3" strokeWidth="2" strokeLinecap="round" />
            <line x1="185" y1="255" x2="280" y2="255" stroke="#C1E8FF" strokeWidth="2" strokeLinecap="round" />
            <line x1="185" y1="270" x2="240" y2="270" stroke="#7DA0CA" strokeWidth="2" strokeLinecap="round" />

            {/* Mini AI Neural Icon on screen */}
            <circle cx="340" cy="220" r="16" fill="#052659" stroke="#C1E8FF" strokeWidth="1.5" />
            <path d="M335 220 L345 220 M340 215 L340 225" stroke="#C1E8FF" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* Floating 3D Graduation Cap (Centerpiece) */}
          <g className="edu-floating-cap">
            {/* Cap Shadow */}
            <ellipse cx="270" cy="155" rx="85" ry="18" fill="#021024" opacity="0.4" filter="url(#neonGlow)" />

            {/* Cap Skull Under-cap */}
            <path
              d="M210 115 C210 145, 330 145, 330 115 C330 95, 210 95, 210 115 Z"
              fill="#031a3a"
              stroke="#5483B3"
              strokeWidth="2"
            />

            {/* Diamond Rhombus Board */}
            <polygon
              points="270,55 390,95 270,135 150,95"
              fill="url(#capGrad)"
              stroke="#7DA0CA"
              strokeWidth="2.5"
            />
            {/* Top highlight line */}
            <polygon
              points="270,62 380,95 270,128 160,95"
              fill="none"
              stroke="#C1E8FF"
              strokeWidth="1"
              opacity="0.6"
            />

            {/* Button on top */}
            <ellipse cx="270" cy="95" rx="7" ry="4" fill="url(#goldGrad)" />

            {/* Golden Tassel hanging gracefully */}
            <path
              d="M270 95 C310 100, 345 110, 360 135"
              fill="none"
              stroke="url(#goldGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <circle cx="360" cy="138" r="4.5" fill="url(#goldGrad)" />
            <path
              d="M357 142 L354 168 L366 168 L363 142 Z"
              fill="url(#goldGrad)"
            />
          </g>

          {/* Glowing Knowledge Ring */}
          <ellipse
            cx="270"
            cy="185"
            rx="140"
            ry="40"
            fill="none"
            stroke="url(#glowLine)"
            strokeWidth="2"
            opacity="0.8"
            transform="rotate(-5 270 185)"
          />
        </svg>
      </div>

      {/* Floating Holographic Badge 2 */}
      <div className="edu-floating-card edu-card-bottom-left">
        <div className="edu-card-icon edu-icon-pulse">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </div>
        <div>
          <span className="edu-card-label">Official Portal</span>
          <strong className="edu-card-title">Verified Institutional SSO</strong>
        </div>
      </div>

      {/* Floating Holographic Badge 3 */}
      <div className="edu-floating-card edu-card-bottom-right">
        <div className="edu-card-icon edu-icon-code">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </div>
        <div>
          <span className="edu-card-label">Curriculum Standard</span>
          <strong className="edu-card-title">Credit-Hour Bylaw 2026</strong>
        </div>
      </div>
    </div>
  );
};
