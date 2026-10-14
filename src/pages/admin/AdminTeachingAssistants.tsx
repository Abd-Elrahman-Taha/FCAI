import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

export const AdminTeachingAssistants: React.FC = () => {
  const { showToast } = useAuth();
  const [tas, setTas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [title, setTitle] = useState('Teaching Assistant');
  const [department, setDepartment] = useState('Computer Science');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    fakeApi.getAdminFaculty().then(res => {
      const tasOnly = res.filter((f: any) => f.role.includes('Teaching Assistant') || f.role.includes('TA'));
      setTas(tasOnly);
      setLoading(false);
    });
  }, []);

  const handleAddTa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      showToast('Please provide full name and institutional email.', 'warning');
      return;
    }
    const newTa = {
      id: `ta_${Date.now()}`,
      name,
      role: 'Teaching Assistant',
      title,
      department,
      email,
      phone: phone || '+20 110 000 0000',
      status: 'Active',
      offeringsCount: 0
    };
    setTas(prev => [newTa, ...prev]);
    setAddModalOpen(false);
    setName('');
    setEmail('');
    setPhone('');
    showToast('New Teaching Assistant account registered.', 'success');
  };

  if (loading) return <CardSkeleton count={4} />;

  const filtered = tas.filter(t => {
    const matchesDept = deptFilter === 'ALL' || t.department === deptFilter;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div>
      <PageHead
        title="Screen 76: Teaching Assistants (TAs) Management"
        subtitle="Manage practical lab demonstrators, assistant lecturers, lab section workloads, and supervisory links"
        breadcrumbs={[
          { label: 'College Admin', href: '#/admin/dashboard' },
          { label: 'Faculty & Staff', href: '#/admin/faculty' },
          { label: 'Screen 76: Teaching Assistants' }
        ]}
        actions={
          <div className="row gap-2">
            <button className="btn btn-secondary" onClick={() => showToast('Exported TA roster to CSV.', 'info')}>
              <Icon name="download" /> Export List
            </button>
            <button className="btn btn-primary" onClick={() => setAddModalOpen(true)}>
              <Icon name="plus" /> Add Teaching Assistant
            </button>
          </div>
        }
      />

      {/* KPI Stats */}
      <div className="grid g-4 mb-4">
        <div className="card p-3">
          <div className="text-xs sub bold">Total Teaching Assistants</div>
          <div className="h3 bold text-primary mt-1">{tas.length} <span className="text-xs sub">Engineers</span></div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Assigned Lab Sections</div>
          <div className="h3 bold text-success mt-1">14 <span className="text-xs sub">Sections</span></div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Weekly Lab Hours</div>
          <div className="h3 bold text-info mt-1">28 <span className="text-xs sub">Practical Hours</span></div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Lead Demonstrators</div>
          <div className="h3 bold text-neutral mt-1">4 <span className="text-xs sub">Lead TAs</span></div>
        </div>
      </div>

      {/* Filter Bar */}
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
              <label className="text-xs bold sub block mb-1">Search TA</label>
              <div className="input-search">
                <input
                  type="text"
                  placeholder="Filter by name or email..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="text-sm sub self-center">
            Showing <strong>{filtered.length}</strong> Teaching Assistants
          </div>
        </div>
      </div>

      {/* TA Table */}
      <div className="card overflow-hidden">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Teaching Assistant</th>
                <th>Academic Role</th>
                <th>Department</th>
                <th>Institutional Contact</th>
                <th className="text-center">Assigned Sections</th>
                <th className="text-center">Status</th>
                <th style={{ width: '160px' }} className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id}>
                  <td>
                    <div className="bold">{t.name}</div>
                    <code className="text-xs sub">{t.id}</code>
                  </td>
                  <td>
                    <span className="badge badge-ice">{t.title}</span>
                  </td>
                  <td>
                    <span className="text-sm">{t.department}</span>
                  </td>
                  <td>
                    <div className="text-xs">{t.email}</div>
                    <div className="text-xs sub">{t.phone}</div>
                  </td>
                  <td className="text-center">
                    <span className="badge badge-primary">{t.offeringsCount || 3} Lab Sections</span>
                  </td>
                  <td className="text-center">
                    <span className="badge badge-success">{t.status}</span>
                  </td>
                  <td className="text-center">
                    <div className="row gap-1 justify-center">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => showToast(`Assigning lab section to ${t.name}`, 'info')}
                      >
                        <Icon name="plus" size="sm" /> Assign
                      </button>
                      <button
                        className="btn btn-neutral btn-sm"
                        onClick={() => showToast(`Editing TA profile ${t.name}`, 'info')}
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

      {/* Add TA Modal */}
      {addModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '520px' }}>
            <div className="modal-head">
              <h3>Register Teaching Assistant</h3>
              <button className="btn-close" onClick={() => setAddModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleAddTa} className="modal-body p-4 stack gap-3">
              <div>
                <label className="text-xs bold sub block mb-1">Full Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Eng. Karim Tarek"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>

              <div className="grid g-2">
                <div>
                  <label className="text-xs bold sub block mb-1">Title / Rank</label>
                  <select
                    className="input"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                  >
                    <option value="Teaching Assistant">Teaching Assistant</option>
                    <option value="Lead TA">Lead TA</option>
                    <option value="Assistant Lecturer">Assistant Lecturer (MSc)</option>
                    <option value="Demonstrator">Demonstrator</option>
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
                <label className="text-xs bold sub block mb-1">Institutional Email</label>
                <input
                  type="email"
                  className="input"
                  placeholder="karim.tarek@fcai.bsu.edu.eg"
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
                  placeholder="+20 110 555 4321"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>

              <div className="row-between gap-2 mt-2">
                <button type="button" className="btn btn-secondary" onClick={() => setAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Icon name="checkCircle" /> Register Teaching Assistant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
