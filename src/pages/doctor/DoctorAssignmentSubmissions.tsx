import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';

export const DoctorAssignmentSubmissions: React.FC = () => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fakeApi.getDoctorSubmissions().then(res => {
      setSubmissions(res);
      setLoading(false);
    });
  }, []);

  if (loading) return <CardSkeleton count={4} />;

  const filtered = submissions.filter(s => statusFilter === 'All' || s.status === statusFilter);

  return (
    <div>
      <PageHead
        title="Screen 48: Student Assignment Submissions Review"
        subtitle="Assignment 3: Dynamic Programming Implementations · 58 / 64 Submitted"
        breadcrumbs={[
          { label: 'Doctor Portal', href: '#/doctor/dashboard' },
          { label: 'Assignments', href: '#/doctor/assignments' },
          { label: 'Submissions' }
        ]}
      />

      <div className="card p-4 mb-5">
        <div className="row-between wrap gap-2">
          <div className="row gap-2">
            <button
              className={`btn btn-sm ${statusFilter === 'All' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setStatusFilter('All')}
            >
              All Submissions ({submissions.length})
            </button>
            <button
              className={`btn btn-sm ${statusFilter === 'Pending Review' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setStatusFilter('Pending Review')}
            >
              Pending Review ({submissions.filter(s => s.status === 'Pending Review').length})
            </button>
            <button
              className={`btn btn-sm ${statusFilter === 'Graded' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setStatusFilter('Graded')}
            >
              Graded ({submissions.filter(s => s.status === 'Graded').length})
            </button>
          </div>
          <div className="chip chip-info">CS301 · Fall 2026</div>
        </div>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Student Code</th>
                <th>Student Name</th>
                <th>Submission Time</th>
                <th>Late State</th>
                <th>File Artifact</th>
                <th>Current Mark</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(sub => (
                <tr key={sub.id}>
                  <td><code>{sub.studentCode}</code></td>
                  <td className="bold">{sub.studentName}</td>
                  <td className="sub text-xs">{sub.date}</td>
                  <td><span className="badge badge-success">On Time</span></td>
                  <td>
                    <span className="chip chip-neutral" style={{ fontSize: '11px' }}>
                      <Icon name="file" size="sm" /> {sub.file}
                    </span>
                  </td>
                  <td>
                    <strong style={{ fontSize: '14px', color: 'var(--color-primary)' }}>
                      {sub.grade !== null ? `${sub.grade} / ${sub.maxGrade}` : '—'}
                    </strong>
                  </td>
                  <td>
                    <span className={`badge ${sub.status === 'Graded' ? 'badge-success' : 'badge-warning'}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td>
                    <a href={`#/doctor/grading/${sub.id}`} className="btn btn-secondary btn-sm">
                      <Icon name="edit" /> Evaluate
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
