import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

export const AdminLevels: React.FC = () => {
  const { showToast } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Editable rules state
  const [rules, setRules] = useState({
    normalMinCredits: 12,
    normalMaxCredits: 18,
    honorMaxCredits: 21,
    probationMaxCredits: 12,
    minGpaHonor: 3.0,
    probationGpaThreshold: 2.0
  });

  useEffect(() => {
    fakeApi.getAdminAcademicStructure().then(res => {
      setData(res);
      setRules(res.creditRules);
      setLoading(false);
    });
  }, []);

  const handleSaveRules = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 350));
    setSaving(false);
    showToast('Credit load policies and standing thresholds updated.', 'success');
  };

  if (loading || !data) return <CardSkeleton count={4} />;

  return (
    <div>
      <PageHead
        title="Screen 87: Academic Levels, Standing & Credit Load Governance"
        subtitle="Configure student level credit bands, academic standing thresholds, and statutory load limits"
        breadcrumbs={[
          { label: 'College Admin', href: '#/admin/dashboard' },
          { label: 'Screen 86: Academic Years', href: '#/admin/academic-years' },
          { label: 'Screen 87: Levels & Standing' }
        ]}
        actions={
          <button className="btn btn-primary" onClick={handleSaveRules} disabled={saving}>
            <Icon name="checkCircle" /> {saving ? 'Saving...' : 'Save Credit Load Rules'}
          </button>
        }
      />

      {/* Levels Table */}
      <div className="card overflow-hidden mb-4">
        <div className="card-head">
          <h3>Undergraduate Academic Levels &amp; Credit Bands</h3>
          <span className="badge badge-primary">Total 1,540 Students</span>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Academic Level</th>
                <th>Cumulative Credit Range</th>
                <th>Enrolled Student Body</th>
                <th>Graduation Requirement</th>
                <th className="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.levels.map((lvl: any, idx: number) => (
                <tr key={idx}>
                  <td>
                    <div className="bold">{lvl.level}</div>
                    <span className="text-xs sub">Credit Hour Program</span>
                  </td>
                  <td>
                    <span className="badge badge-ice font-mono">{lvl.minCredits} – {lvl.maxCredits} Completed Credits</span>
                  </td>
                  <td>
                    <div className="bold">{lvl.totalStudents} Students</div>
                    <div className="text-xs sub">{((lvl.totalStudents / 1540) * 100).toFixed(1)}% of Faculty</div>
                  </td>
                  <td>
                    <span className="text-xs">{lvl.maxCredits >= 132 ? 'Final Project & Capstone' : 'Core & Faculty Electives'}</span>
                  </td>
                  <td className="text-center">
                    <span className="badge badge-success">Active Cohort</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Credit Load Thresholds Form */}
      <div className="card p-4">
        <h3 className="mb-3">Statutory Credit Load Limits (Beni Suef University Bylaws)</h3>
        <p className="text-xs sub mb-4">
          These boundaries are automatically validated during student course registration (Screens 12 &amp; 13) preventing registration overload.
        </p>

        <div className="grid g-3">
          <div className="card p-3" style={{ background: 'var(--color-bg-page)' }}>
            <div className="text-xs bold sub mb-2">Standard Good Standing (GPA &gt;= 2.00)</div>
            <div className="grid g-2">
              <div>
                <label className="text-xs sub block mb-1">Minimum Load (Credits)</label>
                <input
                  type="number"
                  className="input"
                  value={rules.normalMinCredits}
                  onChange={e => setRules({ ...rules, normalMinCredits: parseInt(e.target.value) || 12 })}
                />
              </div>
              <div>
                <label className="text-xs sub block mb-1">Maximum Load (Credits)</label>
                <input
                  type="number"
                  className="input"
                  value={rules.normalMaxCredits}
                  onChange={e => setRules({ ...rules, normalMaxCredits: parseInt(e.target.value) || 18 })}
                />
              </div>
            </div>
          </div>

          <div className="card p-3" style={{ background: 'var(--color-bg-page)' }}>
            <div className="text-xs bold sub mb-2">Honor Roll Students (GPA &gt;= 3.00)</div>
            <div className="grid g-2">
              <div>
                <label className="text-xs sub block mb-1">Honor GPA Threshold</label>
                <input
                  type="number"
                  step="0.1"
                  className="input"
                  value={rules.minGpaHonor}
                  onChange={e => setRules({ ...rules, minGpaHonor: parseFloat(e.target.value) || 3.0 })}
                />
              </div>
              <div>
                <label className="text-xs sub block mb-1">Overload Max Credits</label>
                <input
                  type="number"
                  className="input"
                  value={rules.honorMaxCredits}
                  onChange={e => setRules({ ...rules, honorMaxCredits: parseInt(e.target.value) || 21 })}
                />
              </div>
            </div>
          </div>

          <div className="card p-3" style={{ background: 'var(--color-bg-page)' }}>
            <div className="text-xs bold sub mb-2">Academic Probation (GPA &lt; 2.00)</div>
            <div className="grid g-2">
              <div>
                <label className="text-xs sub block mb-1">Probation GPA Cutoff</label>
                <input
                  type="number"
                  step="0.1"
                  className="input"
                  value={rules.probationGpaThreshold}
                  onChange={e => setRules({ ...rules, probationGpaThreshold: parseFloat(e.target.value) || 2.0 })}
                />
              </div>
              <div>
                <label className="text-xs sub block mb-1">Restricted Max Credits</label>
                <input
                  type="number"
                  className="input"
                  value={rules.probationMaxCredits}
                  onChange={e => setRules({ ...rules, probationMaxCredits: parseInt(e.target.value) || 12 })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
