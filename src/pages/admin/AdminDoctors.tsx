import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

export const AdminDoctors: React.FC = () => {
  const { showToast } = useAuth();
  const [faculty, setFaculty] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);

  // New Doctor form
  const [name, setName] = useState('');
  const [title, setTitle] = useState('Assistant Professor');
  const [department, setDepartment] = useState('Computer Science');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    fakeApi.getAdminFaculty().then(res => {
      // Filter for Doctors/Instructors
      const doctorsOnly = res.filter((f: any) => f.role.includes('Doctor') || f.role.includes('Instructor'));
      setFaculty(doctorsOnly);
      setLoading(false);
    });
  }, []);

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      showToast('Please provide Doctor full name and institutional email.', 'warning');
      return;
    }
    const newDoc = {
      id: `fac_${Date.now()}`,
      name,
      role: 'Doctor / Instructor',
      title,
      department,
      email,
      phone: phone || '+20 100 000 0000',
      status: 'Active',
      offeringsCount: 0
    };
    setFaculty(prev => [newDoc, ...prev]);
    setAddModalOpen(false);
    setName('');
    setEmail('');
    setPhone('');
    showToast('New faculty instructor account provisioned successfully.', 'success');
  };

  if (loading) return <CardSkeleton count={4} />;

  const filtered = faculty.filter(d => {
    const matchesDept = deptFilter === 'ALL' || d.department === deptFilter;
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div>
      <PageHead
        title="Screen 75: Faculty Doctors & Instructors Management"
        subtitle="Manage tenured faculty, academic ranks, teaching allocations, and official contact directory"
        breadcrumbs={[
          { label: 'College Admin', href: '#/admin/dashboard' },
          { label: 'Faculty & Staff', href: '#/admin/faculty' },
          { label: 'Screen 75: Doctors & Instructors' }
        ]}
        actions={
          <div className="row gap-2">
            <button className="btn btn-secondary" onClick={() => showToast('Exported faculty list to Excel.', 'info')}>
              <Icon name="download" /> Export Directory
            </button>
            <button className="btn btn-primary" onClick={() => setAddModalOpen(true)}>
              <Icon name="plus" /> Add New Doctor
            </button>
          </div>
        }
      />

      {/* KPI Stats */}
      <div className="grid g-4 mb-4">
        <div className="card p-3">
          <div className="text-xs sub bold">Total Instructors</div>
          <div className="h3 bold text-primary mt-1">{faculty.length} <span className="text-xs sub">Professors</span></div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Active Teaching Status</div>
          <div className="h3 bold text-success mt-1">{faculty.filter(f => f.status === 'Active').length}</div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Assigned Course Offerings</div>
          <div className="h3 bold text-info mt-1">10 <span className="text-xs sub">Courses</span></div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Departments Represented</div>
          <div className="h3 bold text-neutral mt-1">4 <span className="text-xs sub">CS, AI, IS, IT</span></div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="card p-3 mb-4">
        <div className="row-between wrap gap-3">
          <div className="row gap-3">
            <div>
              <label className="text-xs bold sub block mb-1">Filter Department</label>
              <select
                className="input"
                value={deptFilter}
                onChange={e => setDeptFilter(e.target.value)}
              >
                <option value="ALL">All Departments</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Information Systems">Information Systems</option>
                <option value="Information Technology">Information Technology</option>
              </select>
            </div>
            <div>
              <label className="text-xs bold sub block mb-1">Search Doctor</label>
              <div className="input-search">
                <input
                  type="text"
                  placeholder="Filter name or email..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="text-sm sub self-center">
            Showing <strong>{filtered.length}</strong> Faculty Members
          </div>
        </div>
      </div>

      {/* Faculty Table */}
      <div className="card overflow-hidden">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Faculty Doctor</th>
                <th>Academic Title</th>
                <th>Department</th>
                <th>Institutional Contact</th>
                <th className="text-center">Assigned Courses</th>
                <th className="text-center">Status</th>
                <th style={{ width: '160px' }} className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id}>
                  <td>
                    <div className="bold">{d.name}</div>
                    <code className="text-xs sub">{d.id}</code>
                  </td>
                  <td>
                    <span className="badge badge-ice">{d.title}</span>
                  </td>
                  <td>
                    <span className="text-sm">{d.department}</span>
                  </td>
                  <td>
                    <div className="text-xs">{d.email}</div>
                    <div className="text-xs sub">{d.phone}</div>
                  </td>
                  <td className="text-center">
                    <span className="badge badge-primary">{d.offeringsCount} Course Offerings</span>
                  </td>
                  <td className="text-center">
                    <span className="badge badge-success">{d.status}</span>
                  </td>
                  <td className="text-center">
                    <div className="row gap-1 justify-center">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => showToast(`Opening teaching schedule for ${d.name}`, 'info')}
                      >
                        <Icon name="calendar" size="sm" />
                      </button>
                      <button
                        className="btn btn-neutral btn-sm"
                        onClick={() => showToast(`Edit modal opened for ${d.name}`, 'info')}
                      >
                        <Icon name="edit" size="sm" /> Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Doctor Modal */}
      {addModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '540px' }}>
            <div className="modal-head">
              <h3>Provision Faculty Doctor Account</h3>
              <button className="btn-close" onClick={() => setAddModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleAddDoctor} className="modal-body p-4 stack gap-3">
              <div>
                <label className="text-xs bold sub block mb-1">Full Academic Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Dr. Hisham Abdelkader"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>

              <div className="grid g-2">
                <div>
                  <label className="text-xs bold sub block mb-1">Academic Rank / Title</label>
                  <select
                    className="input"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                  >
                    <option value="Full Professor">Full Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Visiting Lecturer">Visiting Lecturer</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs bold sub block mb-1">Department</label>
                  <select
                    className="input"
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Information Systems">Information Systems</option>
                    <option value="Information Technology">Information Technology</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs bold sub block mb-1">Institutional Email (@fcai.bsu.edu.eg)</label>
                <input
                  type="email"
                  className="input"
                  placeholder="hisham.abdelkader@fcai.bsu.edu.eg"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-xs bold sub block mb-1">Phone Number</label>
                <input
                  type="text"
                  className="input"
                  placeholder="+20 100 123 4567"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>

              <div className="row-between gap-2 mt-2">
                <button type="button" className="btn btn-secondary" onClick={() => setAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Icon name="checkCircle" /> Create Instructor Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
