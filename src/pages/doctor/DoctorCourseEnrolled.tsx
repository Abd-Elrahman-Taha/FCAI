import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';

export const DoctorCourseEnrolled: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('All');

  useEffect(() => {
    fakeApi.getDoctorCourseDetail('CS301').then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) return <CardSkeleton count={4} />;

  const { course, students, sections } = data;

  const filtered = students.filter((s: any) => {
    if (sectionFilter !== 'All' && s.section !== sectionFilter) return false;
    if (filter && !s.name.toLowerCase().includes(filter.toLowerCase()) && !s.code.includes(filter)) return false;
    return true;
  });

  return (
    <div>
      <PageHead
        title={`Screen 44: Enrolled Students Roster · ${course.code}`}
        subtitle={`${course.name} · Fall 2026 · Total Enrolled: 64 Students across 3 Lab Sections`}
        breadcrumbs={[
          { label: 'Doctor Portal', href: '#/doctor/dashboard' },
          { label: 'CourseOfferings', href: '#/doctor/offerings' },
          { label: 'Enrolled Students' }
        ]}
      />

      <div className="card p-4 mb-5">
        <div className="row-between wrap gap-2">
          <div className="row gap-2">
            <div className="input-with-icon" style={{ minWidth: '240px' }}>
              <Icon name="search" />
              <input
                type="text"
                className="input"
                placeholder="Search student code or name..."
                value={filter}
                onChange={e => setFilter(e.target.value)}
              />
            </div>
            <select className="select" value={sectionFilter} onChange={e => setSectionFilter(e.target.value)}>
              <option value="All">All Sections (S1, S2, S3)</option>
              <option value="S1">Section S1 (Eng. Youssef)</option>
              <option value="S2">Section S2 (Eng. Nour)</option>
              <option value="S3">Section S3 (Eng. Youssef)</option>
            </select>
          </div>
          <div className="chip chip-info">{filtered.length} Students Listed</div>
        </div>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Student Code</th>
                <th>Student Name</th>
                <th>Section</th>
                <th>Attendance %</th>
                <th>Academic Status</th>
                <th>Current Mark</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((std: any) => (
                <tr key={std.code}>
                  <td><code>{std.code}</code></td>
                  <td className="bold">{std.name}</td>
                  <td><span className="badge badge-neutral">{std.section}</span></td>
                  <td>
                    <span className={`badge ${std.att >= 75 ? 'badge-success' : 'badge-danger'}`}>
                      {std.att}%
                    </span>
                  </td>
                  <td><span className="badge badge-success">{std.status}</span></td>
                  <td className="bold">{std.grade}</td>
                  <td>
                    <a href={`#/doctor/gradebook`} className="btn btn-secondary btn-sm">
                      <Icon name="table" /> Gradebook
                    </a>
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
