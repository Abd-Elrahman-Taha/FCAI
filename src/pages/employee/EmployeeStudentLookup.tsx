import React, { useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';

export const EmployeeStudentLookup: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    const res = await fakeApi.getAdminStudents(query);
    setResults(res);
    setLoading(false);
  };

  return (
    <div>
      <PageHead
        title="Student Directory Basic Lookup"
        subtitle="Search student enrollment credentials and official department registration"
        breadcrumbs={[
          { label: 'Employee Portal', href: '#/employee/dashboard' },
          { label: 'Student Lookup' }
        ]}
      />

      <div className="card p-5 mb-5" style={{ maxWidth: '680px' }}>
        <form onSubmit={handleSearch}>
          <div className="form-group mb-3">
            <label className="form-label">Search Query (Name, Student Code, or National ID)</label>
            <div className="row gap-2">
              <input
                type="text"
                className="input flex-1"
                placeholder="e.g. Ahmed Mohamed or 2021170045"
                value={query}
                onChange={e => setQuery(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary">
                <Icon name="search" /> Search
              </button>
            </div>
          </div>
          <span className="sub text-xs">
            Permission Notice: As an employee in Student Affairs, you are granted <code>Students.ViewBasic</code> access only.
          </span>
        </form>
      </div>

      {loading && <CardSkeleton count={2} />}

      {!loading && searched && (
        <div className="card">
          <div className="card-head">
            <h3>Search Results ({results.length} found)</h3>
          </div>
          {results.length === 0 ? (
            <div className="p-6 text-center sub">No matching student accounts found.</div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Student Code</th>
                    <th>Full Name</th>
                    <th>Department</th>
                    <th>Level</th>
                    <th>Enrollment Status</th>
                    <th>Account Status</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map(std => (
                    <tr key={std.code}>
                      <td><code>{std.code}</code></td>
                      <td className="bold">{std.name}</td>
                      <td>{std.department}</td>
                      <td><span className="badge badge-neutral">{std.level}</span></td>
                      <td>
                        <span className={`badge ${std.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                          {std.status}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${std.accountStatus === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                          {std.accountStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
