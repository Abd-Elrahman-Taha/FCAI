import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

export const AdminCourseOfferings: React.FC = () => {
  const { showToast } = useAuth();
  const [offerings, setOfferings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGenModal, setShowGenModal] = useState(false);

  useEffect(() => {
    fakeApi.getAdminCourseOfferings().then(res => {
      setOfferings(res);
      setLoading(false);
    });
  }, []);

  if (loading) return <CardSkeleton count={4} />;

  return (
    <div>
      <PageHead
        title="Semester CourseOfferings Management"
        subtitle="Schedule semester course offerings, assign lead doctors, and allocate lab practical sections"
        breadcrumbs={[
          { label: 'College Admin', href: '#/admin/dashboard' },
          { label: 'CourseOfferings' }
        ]}
        actions={
          <div className="row gap-2">
            <button className="btn btn-secondary" onClick={() => setShowGenModal(true)}>
              <Icon name="layers" /> Section Generator
            </button>
            <button className="btn btn-primary" onClick={() => showToast('New CourseOffering created', 'success')}>
              <Icon name="plus" /> New CourseOffering
            </button>
          </div>
        }
      />

      {/* Offerings Table */}
      <div className="card">
        <div className="card-head">
          <h3>Fall 2026 CourseOfferings</h3>
          <span className="badge badge-success">Term: Active Registration</span>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Term</th>
                <th>Lead Doctor</th>
                <th>Lecture Schedule</th>
                <th>Enrolled / Cap</th>
                <th>Sections</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {offerings.map(o => (
                <tr key={o.code}>
                  <td>
                    <div className="bold">{o.code}</div>
                    <div className="sub text-xs">{o.name}</div>
                  </td>
                  <td>{o.term}</td>
                  <td className="bold">{o.doctor}</td>
                  <td className="text-xs">{o.schedule}</td>
                  <td>
                    <span className="bold">{o.enrolled}</span> / {o.capacity}
                    <div className="progress-bar mt-1" style={{ width: '80px', height: '4px' }}>
                      <div className="progress-fill" style={{ width: `${(o.enrolled / o.capacity) * 100}%` }} />
                    </div>
                  </td>
                  <td><span className="badge badge-neutral">{o.sectionsCount} Labs</span></td>
                  <td><span className="badge badge-success">{o.status}</span></td>
                  <td>
                    <div className="row gap-1">
                      <button className="btn btn-secondary btn-sm" onClick={() => showToast(`Sections for ${o.code}`, 'info')}>
                        <Icon name="users" /> Sections
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section Generator Modal */}
      {showGenModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-head">
              <h3>Automated Section Generator</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowGenModal(false)}>
                <Icon name="x" />
              </button>
            </div>
            <div className="p-5">
              <p className="sub text-xs mb-4">
                Calculate section count automatically based on student enrollment cap and lab room capacities (e.g. 20-25 students per lab).
              </p>
              <div className="form-group mb-3">
                <label className="form-label">CourseOffering</label>
                <select className="select">
                  <option>CS301 · Design &amp; Analysis of Algorithms (64 enrolled)</option>
                  <option>IS305 · Database Systems II (58 enrolled)</option>
                </select>
              </div>
              <div className="form-group mb-3">
                <label className="form-label">Max Students Per Section</label>
                <input type="number" className="input" defaultValue={22} />
              </div>
              <div className="form-group mb-4">
                <label className="form-label">Auto-allocate Teaching Assistants</label>
                <select className="select">
                  <option>Even distribution among department TAs</option>
                  <option>Specific TA only</option>
                </select>
              </div>
              <div className="row-end gap-2">
                <button className="btn btn-secondary" onClick={() => setShowGenModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={() => { showToast('Generated 3 lab sections with TA assignments', 'success'); setShowGenModal(false); }}>
                  Generate &amp; Assign Sections
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
