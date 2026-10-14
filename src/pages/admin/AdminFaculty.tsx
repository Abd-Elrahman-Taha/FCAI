import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

export const AdminFaculty: React.FC = () => {
  const { showToast } = useAuth();
  const [faculty, setFaculty] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [dept, setDept] = useState('Computer Science');
  const [role, setRole] = useState('Doctor / Instructor');

  useEffect(() => {
    fakeApi.getAdminFaculty().then(res => {
      setFaculty(res);
      setLoading(false);
    });
  }, []);

  if (loading) return <CardSkeleton count={4} />;

  const filtered = faculty.filter(f => roleFilter === 'All' || f.role.includes(roleFilter));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newMember = {
      id: `fac_${Date.now()}`,
      name,
      role,
      title: role.includes('Doctor') ? 'Assistant Professor' : role.includes('Teaching') ? 'Teaching Assistant' : 'Officer',
      department: dept,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@fcai.bsu.edu.eg`,
      phone: '+20 100 000 0000',
      status: 'Active',
      offeringsCount: role.includes('Employee') ? 0 : 2
    };
    setFaculty(prev => [newMember, ...prev]);
    showToast(`Added ${name} to faculty database.`, 'success');
    setShowAddModal(false);
    setName('');
  };

  return (
    <div>
      <PageHead
        title="Faculty &amp; Staff Directory"
        subtitle="Manage academic doctors, teaching assistants, and administrative staff members"
        breadcrumbs={[
          { label: 'College Admin', href: '#/admin/dashboard' },
          { label: 'Faculty & Staff' }
        ]}
        actions={
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Icon name="plus" /> Add Faculty Member
          </button>
        }
      />

      {/* Filter Row */}
      <div className="card p-4 mb-5">
        <div className="row-between wrap gap-2">
          <div className="row gap-2">
            <button
              className={`btn btn-sm ${roleFilter === 'All' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setRoleFilter('All')}
            >
              All Staff ({faculty.length})
            </button>
            <button
              className={`btn btn-sm ${roleFilter === 'Doctor' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setRoleFilter('Doctor')}
            >
              Doctors / Instructors
            </button>
            <button
              className={`btn btn-sm ${roleFilter === 'Teaching' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setRoleFilter('Teaching')}
            >
              Teaching Assistants
            </button>
            <button
              className={`btn btn-sm ${roleFilter === 'Employee' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setRoleFilter('Employee')}
            >
              Employees
            </button>
          </div>
          <div className="chip chip-info">Fall 2026 Active Registry</div>
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid g-3">
        {filtered.map(fac => (
          <div key={fac.id} className="card p-5" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div className="row-between mb-3">
                <span className={`badge ${
                  fac.role.includes('Doctor') ? 'badge-primary' :
                  fac.role.includes('Teaching') ? 'badge-info' : 'badge-neutral'
                }`}>
                  {fac.role}
                </span>
                <span className="badge badge-success">{fac.status}</span>
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '4px' }}>{fac.name}</h3>
              <p className="sub text-xs mb-3">{fac.title} · {fac.department}</p>

              <div className="p-3 mb-4" style={{ background: 'var(--color-bg-page)', borderRadius: 'var(--radius-md)', fontSize: '12px' }}>
                <div className="mb-1"><span className="sub">Email: </span><strong>{fac.email}</strong></div>
                <div className="mb-1"><span className="sub">Phone: </span><strong>{fac.phone}</strong></div>
                <div><span className="sub">Active Offerings: </span><strong>{fac.offeringsCount}</strong></div>
              </div>
            </div>

            <div className="row gap-2">
              <button className="btn btn-secondary btn-sm flex-1" onClick={() => showToast(`Permissions dossier for ${fac.name}`, 'info')}>
                <Icon name="shield" /> Permissions
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => showToast(`Schedule for ${fac.name}`, 'info')}>
                <Icon name="clock" /> Schedule
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-head">
              <h3>Add Faculty or Staff Member</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowAddModal(false)}>
                <Icon name="x" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-4">
              <div className="form-group mb-3">
                <label className="form-label">Full Name with Title</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Dr. Ahmed Taha"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label className="form-label">Institutional Role</label>
                <select className="select" value={role} onChange={e => setRole(e.target.value)}>
                  <option value="Doctor / Instructor">Doctor / Instructor</option>
                  <option value="Teaching Assistant">Teaching Assistant (TA)</option>
                  <option value="Employee">Employee (Administrative)</option>
                </select>
              </div>

              <div className="form-group mb-4">
                <label className="form-label">Department</label>
                <select className="select" value={dept} onChange={e => setDept(e.target.value)}>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Information Systems">Information Systems</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Student Affairs">Student Affairs</option>
                  <option value="Youth Care & Activities">Youth Care &amp; Activities</option>
                </select>
              </div>

              <div className="row-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
