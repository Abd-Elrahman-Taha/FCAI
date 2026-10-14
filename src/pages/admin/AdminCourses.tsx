import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

export const AdminCourses: React.FC = () => {
  const { showToast } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deptFilter, setDeptFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fakeApi.getAdminCourses().then(res => {
      setCourses(res);
      setLoading(false);
    });
  }, []);

  if (loading) return <CardSkeleton count={4} />;

  const filtered = courses.filter(c => {
    if (deptFilter !== 'All' && c.department !== deptFilter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.code.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <PageHead
        title="Master Course Catalog"
        subtitle="Maintain faculty courses, department mappings, credit weights, and prerequisite dependencies"
        breadcrumbs={[
          { label: 'College Admin', href: '#/admin/dashboard' },
          { label: 'Course Catalog' }
        ]}
        actions={
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Icon name="plus" /> Add New Course
          </button>
        }
      />

      {/* Filters */}
      <div className="card p-4 mb-5">
        <div className="row-between wrap gap-2">
          <div className="row gap-2">
            <div className="input-with-icon" style={{ minWidth: '240px' }}>
              <Icon name="search" />
              <input
                type="text"
                className="input"
                placeholder="Search courses..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select className="select" value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
              <option value="All">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
              <option value="Information Systems">Information Systems</option>
              <option value="Information Technology">Information Technology</option>
            </select>
          </div>
          <div className="chip chip-info">{filtered.length} Courses Cataloged</div>
        </div>
      </div>

      {/* Courses Catalog Table */}
      <div className="card mb-6">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Title</th>
                <th>Department</th>
                <th>Level</th>
                <th>Credits</th>
                <th>Prerequisites</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.code}>
                  <td><span className="badge badge-primary">{c.code}</span></td>
                  <td className="bold">{c.name}</td>
                  <td>{c.department}</td>
                  <td><span className="badge badge-neutral">{c.level}</span></td>
                  <td>{c.creditHours} Cr.</td>
                  <td>
                    {c.prerequisites.length > 0 ? (
                      <div className="row gap-1">
                        {c.prerequisites.map((p: string) => (
                          <span key={p} className="badge badge-warning">{p}</span>
                        ))}
                      </div>
                    ) : (
                      <span className="sub text-xs">None (Open)</span>
                    )}
                  </td>
                  <td>
                    <div className="row gap-1">
                      <button className="btn btn-secondary btn-sm" onClick={() => showToast(`Editing ${c.code}`, 'info')}>
                        <Icon name="edit" /> Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Prerequisite Flow Banner */}
      <div className="card p-5">
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>
          Key Prerequisite Chains
        </h3>
        <p className="sub text-xs mb-4">Core prerequisite sequences enforced by the 8-rule registration engine:</p>
        <div className="grid g-3">
          <div className="card p-4" style={{ background: 'var(--color-bg-page)' }}>
            <span className="sub text-xs block mb-1">Algorithms Sequence</span>
            <div className="row gap-2 mt-2">
              <span className="badge badge-neutral">CS101 Intro</span>
              <Icon name="arrowRight" size="sm" />
              <span className="badge badge-neutral">CS102 Structured</span>
              <Icon name="arrowRight" size="sm" />
              <span className="badge badge-neutral">CS204 Data Structures</span>
              <Icon name="arrowRight" size="sm" />
              <span className="badge badge-primary">CS301 Algorithms</span>
            </div>
          </div>
          <div className="card p-4" style={{ background: 'var(--color-bg-page)' }}>
            <span className="sub text-xs block mb-1">Artificial Intelligence Sequence</span>
            <div className="row gap-2 mt-2">
              <span className="badge badge-neutral">CS102 Structured</span>
              <Icon name="arrowRight" size="sm" />
              <span className="badge badge-neutral">CS204 Data Structures</span>
              <Icon name="arrowRight" size="sm" />
              <span className="badge badge-primary">AI302 Machine Learning</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-head">
              <h3>Add Course to Catalog</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowAddModal(false)}>
                <Icon name="x" />
              </button>
            </div>
            <form onSubmit={e => { e.preventDefault(); showToast('Course added to catalog', 'success'); setShowAddModal(false); }} className="p-4">
              <div className="form-group mb-3">
                <label className="form-label">Course Code</label>
                <input type="text" className="input" placeholder="e.g. AI401" required />
              </div>
              <div className="form-group mb-3">
                <label className="form-label">Course Name</label>
                <input type="text" className="input" placeholder="e.g. Deep Learning & Neural Networks" required />
              </div>
              <div className="grid g-2 mb-3">
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select className="select">
                    <option>Artificial Intelligence</option>
                    <option>Computer Science</option>
                    <option>Information Systems</option>
                    <option>Information Technology</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Credit Hours</label>
                  <input type="number" className="input" defaultValue={3} />
                </div>
              </div>
              <div className="row-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Course</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
