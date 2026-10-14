import React, { useState } from 'react';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';

export const AdminGradeManagement: React.FC = () => {
  const { showToast } = useAuth();
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [packages, setPackages] = useState([
    {
      id: 'PKG-CS301',
      code: 'CS301',
      name: 'Design & Analysis of Algorithms',
      dept: 'Computer Science',
      doctor: 'Dr. Mona Abdelrahman',
      enrolled: 64,
      avg: 83.2,
      status: 'Doctor Submitted',
      submittedDate: 'Oct 14, 2026 · 11:20 AM'
    },
    {
      id: 'PKG-AI302',
      code: 'AI302',
      name: 'Machine Learning Fundamentals',
      dept: 'Artificial Intelligence',
      doctor: 'Dr. Khaled Elsayed',
      enrolled: 62,
      avg: 85.4,
      status: 'Admin Approved',
      submittedDate: 'Oct 12, 2026 · 04:15 PM'
    },
    {
      id: 'PKG-IS305',
      code: 'IS305',
      name: 'Database Systems II',
      dept: 'Information Systems',
      doctor: 'Dr. Hanan Fouad',
      enrolled: 58,
      avg: 81.0,
      status: 'Published',
      submittedDate: 'Oct 10, 2026 · 02:00 PM'
    },
    {
      id: 'PKG-CS305',
      code: 'CS305',
      name: 'Operating Systems Internals',
      dept: 'Computer Science',
      doctor: 'Dr. Mona Abdelrahman',
      enrolled: 60,
      avg: 79.5,
      status: 'Draft (Incomplete)',
      submittedDate: '—'
    }
  ]);

  const filtered = packages.filter(p => {
    const matchesDept = deptFilter === 'ALL' || p.dept === deptFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.code.toLowerCase().includes(searchQuery.toLowerCase()) || p.doctor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div>
      <PageHead
        title="Screen 93: Faculty-Wide Grade Operations & Package Tracking"
        subtitle="Monitor semester grade submission compliance, track verification workflows, and manage grade publishing"
        breadcrumbs={[
          { label: 'College Admin', href: '#/admin/dashboard' },
          { label: 'Screen 94: Grade Approval', href: '#/admin/grade-approval' },
          { label: 'Screen 93: Grade Operations' }
        ]}
        actions={
          <div className="row gap-2">
            <a href="#/admin/grade-scale" className="btn btn-secondary">
              <Icon name="award" /> GPA Scale Rules (Screen 95)
            </a>
            <a href="#/admin/grade-approval" className="btn btn-primary">
              <Icon name="checkCircle" /> Dean Grade Approval Queue (Screen 94)
            </a>
          </div>
        }
      />

      {/* KPI Stats */}
      <div className="grid g-4 mb-4">
        <div className="card p-3">
          <div className="text-xs sub bold">Total Course Offerings</div>
          <div className="h3 bold text-primary mt-1">{packages.length} <span className="text-xs sub">Courses</span></div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Awaiting Dean Approval</div>
          <div className="h3 bold text-warning mt-1">{packages.filter(p => p.status === 'Doctor Submitted').length} <span className="text-xs sub">Packages</span></div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Approved &amp; Published</div>
          <div className="h3 bold text-success mt-1">{packages.filter(p => p.status === 'Admin Approved' || p.status === 'Published').length}</div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Unsubmitted Drafts</div>
          <div className="h3 bold text-danger mt-1">{packages.filter(p => p.status.includes('Draft')).length} <span className="text-xs sub">Delayed</span></div>
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
              </select>
            </div>
            <div>
              <label className="text-xs bold sub block mb-1">Search Course / Professor</label>
              <div className="input-search">
                <input
                  type="text"
                  placeholder="Filter by title, code, or doctor..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="text-sm sub self-center">
            Showing <strong>{filtered.length}</strong> Course Packages
          </div>
        </div>
      </div>

      {/* Packages Table */}
      <div className="card overflow-hidden">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Course Offering</th>
                <th>Department</th>
                <th>Lead Professor</th>
                <th className="text-center">Enrolled</th>
                <th className="text-center">Class Mean</th>
                <th>Submission Time</th>
                <th className="text-center">Status</th>
                <th style={{ width: '160px' }} className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(pkg => (
                <tr key={pkg.id}>
                  <td>
                    <div className="bold">{pkg.name}</div>
                    <code className="text-xs bold">{pkg.code}</code>
                  </td>
                  <td>
                    <span className="text-xs">{pkg.dept}</span>
                  </td>
                  <td>
                    <div className="bold text-sm">{pkg.doctor}</div>
                  </td>
                  <td className="text-center bold">
                    {pkg.enrolled}
                  </td>
                  <td className="text-center bold text-primary">
                    {pkg.avg}%
                  </td>
                  <td>
                    <span className="text-xs sub">{pkg.submittedDate}</span>
                  </td>
                  <td className="text-center">
                    <span className={`badge ${pkg.status === 'Published' || pkg.status === 'Admin Approved' ? 'badge-success' : pkg.status === 'Doctor Submitted' ? 'badge-warning' : 'badge-danger'}`}>
                      {pkg.status}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="row gap-1 justify-center">
                      <a
                        href="#/admin/grade-approval"
                        className="btn btn-primary btn-sm"
                        title="Open Review & Approval (Screen 94)"
                      >
                        <Icon name="checkCircle" size="sm" /> Review
                      </a>
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
