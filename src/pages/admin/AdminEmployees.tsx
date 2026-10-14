import React, { useState } from 'react';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';

export const AdminEmployees: React.FC = () => {
  const { showToast } = useAuth();
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Initial staff data
  const [employees, setEmployees] = useState([
    { id: 'EMP-301', name: 'Salma Ibrahim', dept: 'Student Affairs', role: 'Senior Affairs Officer', email: 'salma.ibrahim@fcai.bsu.edu.eg', phone: '+20 106 333 7744', status: 'Active', permissions: 'ServiceRequests, Transcripts, StudentLookup' },
    { id: 'EMP-302', name: 'Amr Mamdouh', dept: 'Student Affairs', role: 'Affairs Specialist', email: 'amr.mamdouh@fcai.bsu.edu.eg', phone: '+20 101 222 9988', status: 'Active', permissions: 'EnrollmentCerts, MilitaryLetters' },
    { id: 'EMP-303', name: 'Nadia Soliman', dept: 'Youth Care & Activities', role: 'Activities Director', email: 'nadia.soliman@fcai.bsu.edu.eg', phone: '+20 122 444 8811', status: 'Active', permissions: 'UnionClubs, Competitions, Trips' },
    { id: 'EMP-304', name: 'Mahmoud Saeed', dept: 'IT Systems & Infrastructure', role: 'Network Administrator', email: 'mahmoud.saeed@fcai.bsu.edu.eg', phone: '+20 114 888 2233', status: 'Active', permissions: 'NetworkAccess, ServerLogs, SmartCards' },
    { id: 'EMP-305', name: 'Fatma Gamal', dept: 'Library & Learning Resources', role: 'Chief Librarian', email: 'fatma.gamal@fcai.bsu.edu.eg', phone: '+20 100 666 4411', status: 'Active', permissions: 'LibraryLoans, DigitalRepository' }
  ]);

  // Form state
  const [name, setName] = useState('');
  const [dept, setDept] = useState('Student Affairs');
  const [roleTitle, setRoleTitle] = useState('Affairs Specialist');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      showToast('Please provide name and institutional email.', 'warning');
      return;
    }
    const newEmp = {
      id: `EMP-${Math.floor(300 + Math.random() * 600)}`,
      name,
      dept,
      role: roleTitle,
      email,
      phone: phone || '+20 100 000 0000',
      status: 'Active',
      permissions: 'Basic Employee Access'
    };
    setEmployees(prev => [newEmp, ...prev]);
    setAddModalOpen(false);
    setName('');
    setEmail('');
    setPhone('');
    showToast('New staff member account created.', 'success');
  };

  const filtered = employees.filter(e => {
    const matchesDept = deptFilter === 'ALL' || e.dept === deptFilter;
    const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.email.toLowerCase().includes(searchQuery.toLowerCase()) || e.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div>
      <PageHead
        title="Screen 77: Administrative Staff & Employees Management"
        subtitle="Manage administrative departments, officer credentials, functional desks, and operational scopes"
        breadcrumbs={[
          { label: 'College Admin', href: '#/admin/dashboard' },
          { label: 'Staff Directory', href: '#/admin/employees' },
          { label: 'Screen 77: Employees' }
        ]}
        actions={
          <div className="row gap-2">
            <a href="#/admin/employee-lifecycle" className="btn btn-secondary">
              <Icon name="users" /> Staff Lifecycle (Screen 78)
            </a>
            <button className="btn btn-primary" onClick={() => setAddModalOpen(true)}>
              <Icon name="plus" /> Add Employee Account
            </button>
          </div>
        }
      />

      {/* KPI Stats */}
      <div className="grid g-4 mb-4">
        <div className="card p-3">
          <div className="text-xs sub bold">Total Administrative Staff</div>
          <div className="h3 bold text-primary mt-1">{employees.length} <span className="text-xs sub">Officers</span></div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Student Affairs Officers</div>
          <div className="h3 bold text-success mt-1">2 <span className="text-xs sub">Active Desks</span></div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">IT &amp; Infrastructure</div>
          <div className="h3 bold text-info mt-1">1 <span className="text-xs sub">SysAdmin</span></div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Service Requests Desk</div>
          <div className="h3 bold text-neutral mt-1">100% Operational</div>
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
                <option value="Student Affairs">Student Affairs</option>
                <option value="Youth Care & Activities">Youth Care &amp; Activities</option>
                <option value="IT Systems & Infrastructure">IT Systems &amp; Infrastructure</option>
                <option value="Library & Learning Resources">Library &amp; Learning Resources</option>
              </select>
            </div>
            <div>
              <label className="text-xs bold sub block mb-1">Search Employee</label>
              <div className="input-search">
                <input
                  type="text"
                  placeholder="Filter by name, ID, or email..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="text-sm sub self-center">
            Showing <strong>{filtered.length}</strong> Administrative Officers
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="card overflow-hidden">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Employee / Staff</th>
                <th>Department</th>
                <th>Job Title / Desk</th>
                <th>Institutional Contact</th>
                <th>Permitted Scopes</th>
                <th className="text-center">Status</th>
                <th style={{ width: '140px' }} className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(emp => (
                <tr key={emp.id}>
                  <td>
                    <div className="bold">{emp.name}</div>
                    <code className="text-xs bold">{emp.id}</code>
                  </td>
                  <td>
                    <span className="text-sm">{emp.dept}</span>
                  </td>
                  <td>
                    <span className="badge badge-ice">{emp.role}</span>
                  </td>
                  <td>
                    <div className="text-xs">{emp.email}</div>
                    <div className="text-xs sub">{emp.phone}</div>
                  </td>
                  <td>
                    <span className="text-xs sub">{emp.permissions}</span>
                  </td>
                  <td className="text-center">
                    <span className="badge badge-success">{emp.status}</span>
                  </td>
                  <td className="text-center">
                    <div className="row gap-1 justify-center">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => showToast(`Edit permissions for ${emp.name}`, 'info')}
                      >
                        <Icon name="lock" size="sm" />
                      </button>
                      <button
                        className="btn btn-neutral btn-sm"
                        onClick={() => showToast(`Edit modal opened for ${emp.name}`, 'info')}
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

      {/* Add Employee Modal */}
      {addModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '520px' }}>
            <div className="modal-head">
              <h3>Add Administrative Staff Member</h3>
              <button className="btn-close" onClick={() => setAddModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleAddEmployee} className="modal-body p-4 stack gap-3">
              <div>
                <label className="text-xs bold sub block mb-1">Full Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Salma Ibrahim"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>

              <div className="grid g-2">
                <div>
                  <label className="text-xs bold sub block mb-1">Department</label>
                  <select
                    className="input"
                    value={dept}
                    onChange={e => setDept(e.target.value)}
                  >
                    <option value="Student Affairs">Student Affairs</option>
                    <option value="Youth Care & Activities">Youth Care &amp; Activities</option>
                    <option value="IT Systems & Infrastructure">IT Systems &amp; Infrastructure</option>
                    <option value="Library & Learning Resources">Library &amp; Learning Resources</option>
                    <option value="Dean Executive Office">Dean Executive Office</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs bold sub block mb-1">Functional Desk Role</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. Senior Affairs Officer"
                    value={roleTitle}
                    onChange={e => setRoleTitle(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs bold sub block mb-1">Institutional Email</label>
                <input
                  type="email"
                  className="input"
                  placeholder="salma.ibrahim@fcai.bsu.edu.eg"
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
                  placeholder="+20 106 333 7744"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>

              <div className="row-between gap-2 mt-2">
                <button type="button" className="btn btn-secondary" onClick={() => setAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Icon name="checkCircle" /> Provision Staff Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
