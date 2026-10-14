import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

export const AdminAcademicStructure: React.FC = () => {
  const { showToast } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fakeApi.getAdminAcademicStructure().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) return <CardSkeleton count={4} />;

  const { currentYear, currentSemester, semesters, levels, creditRules } = data;

  return (
    <div>
      <PageHead
        title="Academic Structure &amp; Credit Hour Policies"
        subtitle="Manage academic years, semester terms, 4 fixed student levels, and credit hour caps"
        breadcrumbs={[
          { label: 'College Admin', href: '#/admin/dashboard' },
          { label: 'Academic Structure' }
        ]}
        actions={
          <button className="btn btn-primary" onClick={() => showToast('Saved academic configuration changes', 'success')}>
            <Icon name="checkCircle" /> Save Configuration
          </button>
        }
      />

      {/* Current Academic Session Status */}
      <div className="card p-5 mb-5" style={{ borderLeft: '4px solid var(--color-primary)' }}>
        <div className="row-between wrap gap-3">
          <div>
            <span className="badge badge-primary mb-2">Current Academic Term</span>
            <h2 style={{ fontSize: '20px', fontWeight: 750 }}>
              Academic Year {currentYear} · {currentSemester}
            </h2>
            <p className="sub text-xs mt-1">Official operational calendar for faculty courses and registration</p>
          </div>
          <div className="row gap-2">
            <button className="btn btn-secondary" onClick={() => showToast('Term transition wizard', 'info')}>
              <Icon name="clock" /> Advance Semester Term
            </button>
          </div>
        </div>
      </div>

      <div className="grid g-2 mb-6">
        {/* Semesters Card */}
        <div className="card p-5">
          <div className="card-head">
            <h3>Semester Terms</h3>
            <span className="badge badge-success">3 Terms Scheduled</span>
          </div>
          <div className="stack gap-3">
            {semesters.map((sem: any) => (
              <div key={sem.name} className="card p-4" style={{ background: 'var(--color-bg-page)' }}>
                <div className="row-between mb-2">
                  <h4 className="bold">{sem.name}</h4>
                  <span className={`badge ${sem.status.includes('Active') ? 'badge-success' : 'badge-neutral'}`}>
                    {sem.status}
                  </span>
                </div>
                <div className="row-between text-xs sub">
                  <span>Start Date: <strong>{sem.startDate}</strong></span>
                  <span>End Date: <strong>{sem.endDate}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Credit Rules Card */}
        <div className="card p-5">
          <div className="card-head">
            <h3>Credit Load Rules (Bylaws)</h3>
            <span className="badge badge-info">Faculty Standard</span>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Credit Range</th>
                  <th>Condition</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="bold">Standard Regular Load</td>
                  <td>12 – 18 Credits</td>
                  <td>Normal Standing (GPA &ge; 2.00)</td>
                </tr>
                <tr>
                  <td className="bold" style={{ color: 'var(--color-success)' }}>Honor Overload</td>
                  <td>Up to 21 Credits</td>
                  <td>High Honors (GPA &ge; {creditRules.minGpaHonor.toFixed(2)})</td>
                </tr>
                <tr>
                  <td className="bold" style={{ color: 'var(--color-danger)' }}>Academic Probation</td>
                  <td>Max 12 Credits</td>
                  <td>Probationary (GPA &lt; {creditRules.probationGpaThreshold.toFixed(2)})</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4 Fixed Levels Breakdown */}
      <div className="card p-5">
        <div className="card-head">
          <h3>The 4 Academic Progression Levels</h3>
          <span className="sub text-xs">Students transition between levels based strictly on completed credit ranges</span>
        </div>
        <div className="grid g-4">
          {levels.map((lvl: any) => (
            <div key={lvl.level} className="card p-4" style={{ background: 'var(--color-bg-page)' }}>
              <div className="badge badge-primary mb-2">{lvl.level.split(' ')[0]}</div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>{lvl.level}</h4>
              <p className="sub text-xs mb-3">
                Completed Credits: <strong>{lvl.minCredits} – {lvl.maxCredits} Cr.</strong>
              </p>
              <div className="p-2 border rounded text-xs row-between" style={{ background: '#fff' }}>
                <span className="sub">Enrolled Students:</span>
                <strong>{lvl.totalStudents}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
