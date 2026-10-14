import React, { useState } from 'react';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';

export const FigmaExportHub: React.FC = () => {
  const { showToast } = useAuth();
  const [copied, setCopied] = useState(false);

  // Design Tokens in W3C / Figma Tokens Studio JSON format
  const figmaTokens = {
    color: {
      brand: {
        midnight: { value: '#021024', type: 'color', description: 'Deep Academic Midnight' },
        royal: { value: '#052659', type: 'color', description: 'BSU Royal University Navy' },
        steel: { value: '#5483B3', type: 'color', description: 'Academic Steel Blue' },
        mist: { value: '#7DA0CA', type: 'color', description: 'Atmospheric Mist Blue' },
        ice: { value: '#C1E8FF', type: 'color', description: 'Signature Highlight Ice Blue' }
      },
      semantic: {
        success: { value: '#10b981', type: 'color' },
        warning: { value: '#f59e0b', type: 'color' },
        danger: { value: '#ef4444', type: 'color' },
        info: { value: '#3b82f6', type: 'color' }
      },
      neutral: {
        bgPage: { value: '#f8fafc', type: 'color' },
        bgCard: { value: '#ffffff', type: 'color' },
        border: { value: '#e2e8f0', type: 'color' },
        textMain: { value: '#0f172a', type: 'color' },
        textMuted: { value: '#64748b', type: 'color' }
      }
    },
    fontFamilies: {
      sans: { value: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', type: 'fontFamilies' },
      mono: { value: '"JetBrains Mono", Menlo, Monaco, Consolas, monospace', type: 'fontFamilies' }
    },
    borderRadius: {
      sm: { value: '6px', type: 'borderRadius' },
      md: { value: '10px', type: 'borderRadius' },
      lg: { value: '16px', type: 'borderRadius' },
      full: { value: '9999px', type: 'borderRadius' }
    },
    boxShadow: {
      card: { value: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.04)', type: 'boxShadow' },
      hover: { value: '0 8px 24px rgba(5, 38, 89, 0.09)', type: 'boxShadow' },
      modal: { value: '0 20px 48px rgba(2, 16, 36, 0.22)', type: 'boxShadow' }
    }
  };

  const handleCopyTokens = () => {
    navigator.clipboard.writeText(JSON.stringify(figmaTokens, null, 2));
    setCopied(true);
    showToast('Figma Design Tokens JSON copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div>
      <PageHead
        title="Figma Design System Hub &amp; Export Center"
        subtitle="Tokens Studio compatible JSON, vector primitives, and html.to.design import pipelines"
        breadcrumbs={[
          { label: 'Figma Hub' }
        ]}
        actions={
          <div className="row gap-2">
            <button className="btn btn-primary" onClick={handleCopyTokens}>
              <Icon name="copy" /> {copied ? 'Tokens Copied!' : 'Copy Tokens JSON for Figma'}
            </button>
          </div>
        }
      />

      {/* Guide Banner */}
      <div className="hero mb-6">
        <h2 style={{ fontSize: '20px', fontWeight: 750, color: '#fff', marginBottom: '8px' }}>
          Importing this Web Application into Figma (Two Instant Methods)
        </h2>
        <div className="grid g-2 text-xs" style={{ color: 'var(--color-brand-ice)' }}>
          <div className="card p-3" style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' }}>
            <strong className="block mb-1" style={{ color: '#fff', fontSize: '13px' }}>Method 1: html.to.design (Direct Vector Import)</strong>
            1. Install the <strong>html.to.design</strong> plugin in Figma.<br />
            2. Run this project on <code>http://localhost:5173</code>.<br />
            3. Paste the URL <code>http://localhost:5173/#/figma-export</code> (or any screen route) into the plugin.<br />
            4. Click "Import" to generate pixel-perfect, fully editable Figma vector frames and autolayouts.
          </div>
          <div className="card p-3" style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' }}>
            <strong className="block mb-1" style={{ color: '#fff', fontSize: '13px' }}>Method 2: Tokens Studio / Variables Plugin</strong>
            1. Install <strong>Tokens Studio for Figma</strong> or open Figma Variables.<br />
            2. Click "Copy Tokens JSON for Figma" button at top right.<br />
            3. In Tokens Studio, click "Load JSON" and paste.<br />
            4. All color ramps, typography, radii, and elevation styles will populate instantly as native Figma variables.
          </div>
        </div>
      </div>

      {/* COLOR PALETTE SHOWCASE */}
      <div className="card p-5 mb-6" data-figma-frame="Color Palette">
        <div className="card-head">
          <h3>FCAI BSU Official Color Palette</h3>
          <span className="badge badge-primary">Brand &amp; Identity</span>
        </div>
        <div className="grid g-5 mb-4">
          <div className="card p-4 text-center" style={{ background: '#021024', color: '#fff' }}>
            <div className="bold mb-1">Midnight Navy</div>
            <code style={{ color: '#C1E8FF' }}>#021024</code>
            <div className="text-xs sub mt-2" style={{ color: '#7DA0CA' }}>Surface / Headers</div>
          </div>
          <div className="card p-4 text-center" style={{ background: '#052659', color: '#fff' }}>
            <div className="bold mb-1">Royal Navy</div>
            <code style={{ color: '#C1E8FF' }}>#052659</code>
            <div className="text-xs sub mt-2" style={{ color: '#C1E8FF' }}>Primary Brand / Crest</div>
          </div>
          <div className="card p-4 text-center" style={{ background: '#5483B3', color: '#fff' }}>
            <div className="bold mb-1">Steel Blue</div>
            <code>#5483B3</code>
            <div className="text-xs sub mt-2" style={{ color: '#fff' }}>Interactive / Accents</div>
          </div>
          <div className="card p-4 text-center" style={{ background: '#7DA0CA', color: '#021024' }}>
            <div className="bold mb-1">Mist Blue</div>
            <code>#7DA0CA</code>
            <div className="text-xs sub mt-2">Borders / Sub-elements</div>
          </div>
          <div className="card p-4 text-center" style={{ background: '#C1E8FF', color: '#052659' }}>
            <div className="bold mb-1">Ice Blue</div>
            <code>#C1E8FF</code>
            <div className="text-xs sub mt-2">Highlights / Shines</div>
          </div>
        </div>

        <h4 className="bold mb-3" style={{ fontSize: '15px' }}>Semantic System Tokens</h4>
        <div className="grid g-4">
          <div className="card p-3 text-center" style={{ background: '#ecfdf5', border: '1px solid #10b981', color: '#065f46' }}>
            <strong className="block">Success</strong>
            <code>#10b981</code>
          </div>
          <div className="card p-3 text-center" style={{ background: '#fffbeb', border: '1px solid #f59e0b', color: '#92400e' }}>
            <strong className="block">Warning</strong>
            <code>#f59e0b</code>
          </div>
          <div className="card p-3 text-center" style={{ background: '#fef2f2', border: '1px solid #ef4444', color: '#991b1b' }}>
            <strong className="block">Danger</strong>
            <code>#ef4444</code>
          </div>
          <div className="card p-3 text-center" style={{ background: '#eff6ff', border: '1px solid #3b82f6', color: '#1e40af' }}>
            <strong className="block">Information</strong>
            <code>#3b82f6</code>
          </div>
        </div>
      </div>

      {/* TYPOGRAPHY & SPACING */}
      <div className="grid g-2 mb-6" data-figma-frame="Typography & Metrics">
        <div className="card p-5">
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px' }}>Typography System (Inter)</h3>
          <div className="stack gap-3">
            <div>
              <span className="sub text-xs">Display 1 (28px Bold)</span>
              <div style={{ fontSize: '28px', fontWeight: 800 }}>Faculty of Computers &amp; AI</div>
            </div>
            <div>
              <span className="sub text-xs">Heading 2 (22px SemiBold)</span>
              <div style={{ fontSize: '22px', fontWeight: 700 }}>CourseRegistration &amp; Gradebook</div>
            </div>
            <div>
              <span className="sub text-xs">Heading 3 (18px Medium)</span>
              <div style={{ fontSize: '18px', fontWeight: 600 }}>Design &amp; Analysis of Algorithms</div>
            </div>
            <div>
              <span className="sub text-xs">Body Regular (14px)</span>
              <p className="sub leading-relaxed" style={{ fontSize: '14px' }}>
                All semester courses follow the European Credit Transfer and Accumulation System (ECTS) credit hours.
              </p>
            </div>
            <div>
              <span className="sub text-xs">Code / Monospace (JetBrains Mono)</span>
              <div style={{ fontFamily: 'monospace', fontSize: '13px', color: 'var(--color-primary)' }}>
                CS301 · 2021170045 · FWY-98214412 · BSU-LEC-TOKEN
              </div>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px' }}>Interactive Component Primitives</h3>
          <div className="stack gap-4">
            <div>
              <span className="sub text-xs block mb-2">Buttons Matrix</span>
              <div className="row gap-2 wrap">
                <button className="btn btn-primary">Primary Button</button>
                <button className="btn btn-secondary">Secondary</button>
                <button className="btn btn-ice">Ice Highlight</button>
                <button className="btn btn-danger">Destructive</button>
                <button className="btn btn-ghost">Ghost</button>
              </div>
            </div>

            <div>
              <span className="sub text-xs block mb-2">Badges Matrix</span>
              <div className="row gap-2 wrap">
                <span className="badge badge-primary">Primary</span>
                <span className="badge badge-success">Success</span>
                <span className="badge badge-warning">Warning</span>
                <span className="badge badge-danger">Danger</span>
                <span className="badge badge-info">Information</span>
                <span className="badge badge-neutral">Neutral</span>
              </div>
            </div>

            <div>
              <span className="sub text-xs block mb-2">Form Controls</span>
              <div className="grid g-2">
                <input type="text" className="input" defaultValue="Student Input Field" />
                <select className="select">
                  <option>Select Option Dropdown</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* JSON CODE BLOCK */}
      <div className="card p-5">
        <div className="row-between mb-3">
          <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Raw Figma Tokens JSON</h3>
          <button className="btn btn-secondary btn-sm" onClick={handleCopyTokens}>
            <Icon name="copy" /> Copy Raw JSON
          </button>
        </div>
        <pre
          className="p-4 rounded text-xs"
          style={{
            background: 'var(--color-bg-page)',
            border: '1px solid var(--color-border)',
            overflowX: 'auto',
            maxHeight: '320px',
            fontFamily: 'monospace'
          }}
        >
          {JSON.stringify(figmaTokens, null, 2)}
        </pre>
      </div>
    </div>
  );
};
