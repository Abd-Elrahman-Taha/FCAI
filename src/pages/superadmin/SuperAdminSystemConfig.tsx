import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

export const SuperAdminSystemConfig: React.FC = () => {
  const { showToast } = useAuth();
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fakeApi.getSuperAdminSystemConfig().then(res => {
      setConfig(res);
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fakeApi.saveSuperAdminSystemConfig(config);
    setSaving(false);
    showToast('Platform operational parameters saved and applied cluster-wide.', 'success');
  };

  if (loading || !config) return <CardSkeleton count={5} />;

  return (
    <div>
      <PageHead
        title="Screen 103: System Parameters & Engine Configuration"
        subtitle="Control core institutional constants, geofencing radii, QR refresh timers, and maintenance flags"
        breadcrumbs={[
          { label: 'System Admin', href: '#/superadmin/system-config' },
          { label: 'Screen 103: System Parameters' }
        ]}
        actions={
          <div className="row gap-2">
            <a href="#/superadmin/security-config" className="btn btn-secondary">
              <Icon name="lock" /> Security Controls (Screen 104)
            </a>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              <Icon name="checkCircle" /> {saving ? 'Saving...' : 'Persist System Parameters'}
            </button>
          </div>
        }
      />

      <form onSubmit={handleSave} className="stack gap-4">
        {/* Core Institutional Constants */}
        <div className="card p-4">
          <h3 className="mb-3">Institutional Metadata &amp; University Identity</h3>
          <div className="grid g-2">
            <div>
              <label className="text-xs bold sub block mb-1">Faculty Entity Name</label>
              <input
                type="text"
                className="input"
                value={config.facultyName}
                onChange={e => setConfig({ ...config, facultyName: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-xs bold sub block mb-1">Parent University</label>
              <input
                type="text"
                className="input"
                value={config.university}
                onChange={e => setConfig({ ...config, university: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-xs bold sub block mb-1">Default Academic Year</label>
              <input
                type="text"
                className="input"
                value={config.currentYear}
                onChange={e => setConfig({ ...config, currentYear: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-xs bold sub block mb-1">Current Active Semester</label>
              <input
                type="text"
                className="input"
                value={config.currentSemester}
                onChange={e => setConfig({ ...config, currentSemester: e.target.value })}
                required
              />
            </div>
          </div>
        </div>

        {/* Attendance & Geofencing Parameters */}
        <div className="card p-4">
          <h3 className="mb-3">Attendance Engine &amp; QR Cryptographic Security</h3>
          <div className="grid g-3">
            <div>
              <label className="text-xs bold sub block mb-1">
                Dynamic QR Token Rotation Interval (Seconds)
              </label>
              <input
                type="number"
                min="3"
                max="30"
                className="input"
                value={config.attendanceQrRefreshIntervalSeconds}
                onChange={e => setConfig({ ...config, attendanceQrRefreshIntervalSeconds: parseInt(e.target.value) || 5 })}
                required
              />
              <span className="text-xs sub mt-1 block">Recommended: 5 seconds to prevent screenshot forwarding.</span>
            </div>

            <div>
              <label className="text-xs bold sub block mb-1">
                Lecture Hall Geofencing Radius (Meters)
              </label>
              <input
                type="number"
                min="10"
                max="200"
                className="input"
                value={config.geofenceThresholdMeters}
                onChange={e => setConfig({ ...config, geofenceThresholdMeters: parseInt(e.target.value) || 50 })}
                required
              />
              <span className="text-xs sub mt-1 block">Maximum GPS distance from Beni Suef University campus halls.</span>
            </div>

            <div>
              <label className="text-xs bold sub block mb-1">
                AI Study Assistant File Upload Limit (MB)
              </label>
              <input
                type="number"
                min="1"
                max="50"
                className="input"
                value={config.aiTutorPdfSizeLimitMb}
                onChange={e => setConfig({ ...config, aiTutorPdfSizeLimitMb: parseInt(e.target.value) || 10 })}
                required
              />
              <span className="text-xs sub mt-1 block">Max PDF textbook / slide size for Gemini RAG embedding.</span>
            </div>
          </div>
        </div>

        {/* Platform Operational State Flags */}
        <div className="card p-4">
          <h3 className="mb-3">Global Operational Toggles</h3>
          <div className="stack gap-3">
            <div className="row-between p-3 rounded border">
              <div>
                <div className="bold text-sm">Course Registration Portal Engine</div>
                <div className="text-xs sub">When enabled, students can submit course offerings matching their 8-rule prerequisites.</div>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={config.allowRegistration}
                  onChange={e => setConfig({ ...config, allowRegistration: e.target.checked })}
                />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="row-between p-3 rounded border" style={{ background: config.maintenanceMode ? 'rgba(239, 68, 68, 0.08)' : 'transparent' }}>
              <div>
                <div className="bold text-sm text-danger">Emergency Maintenance Mode</div>
                <div className="text-xs sub">When active, only SuperAdmin can log in. All student and doctor traffic displays institutional maintenance banner.</div>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={config.maintenanceMode}
                  onChange={e => setConfig({ ...config, maintenanceMode: e.target.checked })}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
