import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

export const UserAccountManagement: React.FC = () => {
  const { showToast } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  useEffect(() => {
    fakeApi.getUserAccounts().then(res => {
      setUsers(res);
      setLoading(false);
    });
  }, []);

  if (loading) return <CardSkeleton count={5} />;

  const handleToggle = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Active' ? 'Deactivated' : 'Active';
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: nextStatus } : u));
    showToast(`Account status updated to ${nextStatus}`, 'info');
  };

  const filtered = users.filter(u => {
    if (roleFilter !== 'All' && !u.role.includes(roleFilter)) return false;
    if (filter && !u.name.toLowerCase().includes(filter.toLowerCase()) && !u.code.toLowerCase().includes(filter.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <PageHead
        title="Screen 7: User Account Management"
        subtitle="Administrative governance across student, instructor, assistant, employee, and administrator accounts"
        breadcrumbs={[
          { label: 'College Admin', href: '#/admin/dashboard' },
          { label: 'User Accounts' }
        ]}
        actions={
          <div className="row gap-2">
            <a href="#/admin/create-student" className="btn btn-primary">
              <Icon name="plus" /> Create Student Account
            </a>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="card p-4 mb-5">
        <div className="row-between wrap gap-2">
          <div className="row gap-2">
            <div className="input-with-icon" style={{ minWidth: '260px' }}>
              <Icon name="search" />
              <input
                type="text"
                className="input"
                placeholder="Search by name, code, or email..."
                value={filter}
                onChange={e => setFilter(e.target.value)}
              />
            </div>
            <select className="select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
              <option value="All">All Roles</option>
              <option value="Student">Students</option>
              <option value="Doctor">Doctors / Instructors</option>
              <option value="Teaching Assistant">Teaching Assistants</option>
              <option value="Employee">Employees</option>
              <option value="College Admin">College Admins</option>
            </select>
          </div>
          <div className="chip chip-info">{filtered.length} Users Listed</div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Account Code</th>
                <th>Full Name</th>
                <th>Role / Type</th>
                <th>Department</th>
                <th>Institutional Email</th>
                <th>Last Login</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td><code>{u.code}</code></td>
                  <td className="bold">{u.name}</td>
                  <td>
                    <span className={`badge ${
                      u.role.includes('Student') ? 'badge-primary' :
                      u.role.includes('Doctor') ? 'badge-info' :
                      u.role.includes('Admin') ? 'badge-warning' : 'badge-neutral'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td>{u.department}</td>
                  <td className="text-xs">{u.email}</td>
                  <td className="sub text-xs">{u.lastLogin}</td>
                  <td>
                    <span className={`badge ${u.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td>
                    <div className="row gap-1">
                      <button
                        className={`btn btn-sm ${u.status === 'Active' ? 'btn-ghost' : 'btn-success'}`}
                        onClick={() => handleToggle(u.id, u.status)}
                      >
                        {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
