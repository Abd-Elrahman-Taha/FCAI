import React, { useState } from 'react';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';

export const AdminRegistrationPeriods: React.FC = () => {
  const { showToast } = useAuth();
  const [saving, setSaving] = useState(false);

  // Registration windows
  const [windows, setWindows] = useState([
    {
      id: 'reg_win_1',
      name: 'Honor Students Priority Registration (GPA >= 3.00)',
      target: 'Level 2, 3, 4 Honor Students',
      startDate: '2026-09-20 · 09:00 AM',
      endDate: '2026-09-23 · 11:59 PM',
      status: 'Closed (Completed)',
      enrolledCount: 312
    },
    {
      id: 'reg_win_2',
      name: 'General Faculty Course Registration',
      target: 'All Regular Undergraduate Students',
      startDate: '2026-09-24 · 09:00 AM',
      endDate: '2026-10-10 · 11:59 PM',
      status: 'Closed (Completed)',
      enrolledCount: 1140
    },
    {
      id: 'reg_win_3',
      name: 'Add / Drop & Schedule Adjustment Window',
      target: 'All Students (Subject to Course Capacity)',
      startDate: '2026-10-11 · 09:00 AM',
      endDate: '2026-10-18 · 11:59 PM',
      status: 'Open (Active Now)',
      enrolledCount: 88
    },
    {
      id: 'reg_win_4',
      name: 'Late Registration (Administrative Dean Exception)',
      target: 'Late Returning / Financial Exemption Students',
      startDate: '2026-10-19 · 09:00 AM',
      endDate: '2026-10-24 · 02:00 PM',
      status: 'Upcoming',
      enrolledCount: 0
    }
  ]);

  const handleToggleWindow = (id: string) => {
    setWindows(prev =>
      prev.map(w => {
        if (w.id === id) {
          const isOpen = w.status.includes('Open');
          return {
            ...w,
            status: isOpen ? 'Closed (Manually Paused)' : 'Open (Active Now)'
          };
        }
        return w;
      })
    );
    showToast('Registration window status modified.', 'info');
  };

  const handleSaveAll = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    setSaving(false);
    showToast('Registration periods schedule persisted to database.', 'success');
  };

  return (
    <div>
      <PageHead
        title="Screen 91: Course Registration Periods & Window Scheduling"
        subtitle="Manage phased enrollment windows, honor student early access, and statutory add/drop deadlines"
        breadcrumbs={[
          { label: 'College Admin', href: '#/admin/dashboard' },
          { label: 'Academic Structure', href: '#/admin/academic-structure' },
          { label: 'Screen 91: Registration Periods' }
        ]}
        actions={
          <div className="row gap-2">
            <button className="btn btn-secondary" onClick={() => showToast('Opening emergency Dean override enrollment tool.', 'info')}>
              <Icon name="key" /> Dean Override Enrollment
            </button>
            <button className="btn btn-primary" onClick={handleSaveAll} disabled={saving}>
              <Icon name="checkCircle" /> {saving ? 'Saving...' : 'Save Schedule'}
            </button>
          </div>
        }
      />

      {/* Active Phase Banner */}
      <div className="card p-4 mb-4" style={{ background: 'rgba(59, 130, 246, 0.08)', borderLeft: '4px solid var(--color-primary)' }}>
        <div className="row-between wrap gap-2">
          <div>
            <span className="badge badge-primary mb-1">Current Active Enrollment Phase</span>
            <h3 className="bold mt-1">Add / Drop &amp; Schedule Adjustment Window</h3>
            <p className="text-xs sub mt-1">
              Active until Sunday, October 18, 2026 at 11:59 PM. Students may drop courses without transcript record penalty.
            </p>
          </div>
          <div className="row gap-2 align-center">
            <span className="badge badge-success">8-Rule Registration Audit Active</span>
          </div>
        </div>
      </div>

      {/* Windows Table */}
      <div className="card overflow-hidden">
        <div className="card-head">
          <h3>Scheduled Enrollment Windows</h3>
          <span className="badge badge-neutral">Fall 2026 / 2027</span>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Registration Phase</th>
                <th>Target Student Cohort</th>
                <th>Window Start</th>
                <th>Window Cutoff</th>
                <th className="text-center">Enrolled</th>
                <th className="text-center">Current Status</th>
                <th style={{ width: '150px' }} className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {windows.map(w => {
                const isOpen = w.status.includes('Open');
                return (
                  <tr key={w.id}>
                    <td>
                      <div className="bold">{w.name}</div>
                      <code className="text-xs sub">{w.id}</code>
                    </td>
                    <td>
                      <span className="text-xs">{w.target}</span>
                    </td>
                    <td>
                      <span className="text-xs bold">{w.startDate}</span>
                    </td>
                    <td>
                      <span className="text-xs bold">{w.endDate}</span>
                    </td>
                    <td className="text-center bold text-primary">
                      {w.enrolledCount}
                    </td>
                    <td className="text-center">
                      <span className={`badge ${isOpen ? 'badge-success' : w.status.includes('Closed') ? 'badge-neutral' : 'badge-primary'}`}>
                        {w.status}
                      </span>
                    </td>
                    <td className="text-center">
                      <button
                        className={`btn btn-sm ${isOpen ? 'btn-secondary' : 'btn-primary'}`}
                        onClick={() => handleToggleWindow(w.id)}
                      >
                        {isOpen ? 'Pause Window' : 'Open Window'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
