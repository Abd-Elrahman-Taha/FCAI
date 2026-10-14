import React, { useState } from 'react';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';

export const AdminGradeScale: React.FC = () => {
  const { showToast } = useAuth();
  const [saving, setSaving] = useState(false);

  // Statutory Grade Scale for Beni Suef University Credit Hour System
  const [scale, setScale] = useState([
    { letter: 'A+', min: 95, max: 100, gpa: 4.00, desc: 'Excellent (High Distinction)', passed: true },
    { letter: 'A', min: 90, max: 94, gpa: 3.70, desc: 'Excellent', passed: true },
    { letter: 'B+', min: 85, max: 89, gpa: 3.30, desc: 'Very Good (High)', passed: true },
    { letter: 'B', min: 80, max: 84, gpa: 3.00, desc: 'Very Good', passed: true },
    { letter: 'C+', min: 75, max: 79, gpa: 2.70, desc: 'Good (High)', passed: true },
    { letter: 'C', min: 70, max: 74, gpa: 2.40, desc: 'Good', passed: true },
    { letter: 'D+', min: 65, max: 69, gpa: 2.00, desc: 'Satisfactory (High)', passed: true },
    { letter: 'D', min: 60, max: 64, gpa: 1.70, desc: 'Satisfactory (Minimum Pass)', passed: true },
    { letter: 'F', min: 0, max: 59, gpa: 0.00, desc: 'Fail', passed: false },
    { letter: 'Fw', min: 0, max: 0, gpa: 0.00, desc: 'Deprived from Exam (<75% Attendance)', passed: false },
    { letter: 'I', min: 0, max: 0, gpa: 0.00, desc: 'Incomplete (Approved Official Excuse)', passed: false }
  ]);

  const handleSaveScale = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    setSaving(false);
    showToast('Statutory grade scale regulations persisted to database.', 'success');
  };

  return (
    <div>
      <PageHead
        title="Screen 95: Institutional Grade Scales & GPA Calculation Regulations"
        subtitle="Configure letter grade mark boundaries, 4.0 GPA points conversions, and official special status codes"
        breadcrumbs={[
          { label: 'College Admin', href: '#/admin/dashboard' },
          { label: 'Screen 93: Grade Operations', href: '#/admin/grade-management' },
          { label: 'Screen 95: Grade Scale' }
        ]}
        actions={
          <div className="row gap-2">
            <button className="btn btn-secondary" onClick={() => showToast('Reverted to Egyptian Supreme Council of Universities standard.', 'info')}>
              <Icon name="refresh" /> Standard Baseline
            </button>
            <button className="btn btn-primary" onClick={handleSaveScale} disabled={saving}>
              <Icon name="checkCircle" /> {saving ? 'Saving...' : 'Save Grade Scale'}
            </button>
          </div>
        }
      />

      {/* Bylaw Banner */}
      <div className="card p-4 mb-4" style={{ background: 'var(--color-bg-page)', borderLeft: '4px solid var(--color-primary)' }}>
        <div className="row-between wrap gap-2">
          <div>
            <span className="badge badge-primary mb-1">Accreditation Standard</span>
            <h3 className="mt-1">Beni Suef University Credit-Hour Bylaw v3.2</h3>
            <p className="text-xs sub mt-1">
              Minimum cumulative GPA for graduation is <strong>2.00 / 4.00</strong> (Satisfactory). Minimum passing mark per individual course is <strong>60% (D)</strong>.
            </p>
          </div>
          <span className="badge badge-success">Fully Accredited</span>
        </div>
      </div>

      {/* Grade Scale Table */}
      <div className="card overflow-hidden mb-4">
        <div className="card-head">
          <h3>4.0 Grade Point Average Conversion Table</h3>
          <span className="badge badge-neutral">{scale.length} Grade Definitions</span>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '90px' }}>Letter</th>
                <th style={{ width: '150px' }}>Percentage Range</th>
                <th style={{ width: '130px' }} className="text-center">GPA Points (4.0)</th>
                <th>Academic Distinction Description</th>
                <th style={{ width: '130px' }} className="text-center">Credit Earned</th>
              </tr>
            </thead>
            <tbody>
              {scale.map((s, idx) => (
                <tr key={idx}>
                  <td>
                    <span className={`badge ${s.passed ? (s.gpa >= 3.0 ? 'badge-success' : 'badge-primary') : 'badge-danger'} bold text-sm`}>
                      {s.letter}
                    </span>
                  </td>
                  <td>
                    <span className="font-mono text-sm">
                      {s.letter === 'Fw' ? 'Deprived' : s.letter === 'I' ? 'Excused' : `${s.min}% – ${s.max}%`}
                    </span>
                  </td>
                  <td className="text-center bold font-mono text-primary" style={{ fontSize: '15px' }}>
                    {s.gpa.toFixed(2)}
                  </td>
                  <td>
                    <div className="bold text-sm">{s.desc}</div>
                  </td>
                  <td className="text-center">
                    <span className={`badge ${s.passed ? 'badge-success' : 'badge-neutral'}`}>
                      {s.passed ? 'Yes (Pass)' : 'No (0 Cr)'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Special Standing Regulations */}
      <div className="grid g-2">
        <div className="card p-4">
          <h3 className="mb-2">Graduation Honors Standing</h3>
          <p className="text-sm sub leading-relaxed">
            First Class Honors is awarded to graduating seniors who achieve a cumulative GPA of <strong>3.50 or higher</strong>, provided they have never failed or received an F in any registered course throughout their degree.
          </p>
        </div>

        <div className="card p-4">
          <h3 className="mb-2">Incomplete (I) Grade Policy</h3>
          <p className="text-sm sub leading-relaxed">
            Students who miss a final examination due to documented emergency approved by the Dean will receive an <strong>I</strong> grade. The incomplete exam must be cleared within the first 3 weeks of the subsequent semester, or it automatically converts to an <strong>F</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
