import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';

export const EmployeeDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fakeApi.getEmployeeDashboard().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) return <CardSkeleton count={4} />;

  const { employee, department, permissions, kpis, queue } = data;

  return (
    <div>
      {/* Hero Welcome Banner */}
      <div className="hero mb-6">
        <div className="row-between wrap">
          <div>
            <div className="hero-chip mb-2">
              <Icon name="briefcase" size="sm" /> Faculty Administrative Staff · {department}
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 750 }}>Welcome, {employee.name}</h1>
            <p className="sub mt-2" style={{ fontSize: '14px' }}>
              Senior Affairs Officer &nbsp;•&nbsp; Department: {department} &nbsp;•&nbsp; Office: Room G-104
            </p>
          </div>
          <div className="row gap-2 mt-2">
            <a href="#/employee/requests" className="btn btn-ice">
              <Icon name="file" /> Open Department Queue ({kpis.pendingInQueue})
            </a>
            <a href="#/employee/lookup" className="btn btn-hero-glass">
              <Icon name="search" /> Student Lookup
            </a>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid g-4 mb-6">
        <a href="#/employee/requests" className="card kpi hover">
          <div className="kpi-top">
            <span className="kpi-label">Pending in Queue</span>
            <span className="kpi-ico warning"><Icon name="clock" /></span>
          </div>
          <div className="kpi-value">{kpis.pendingInQueue} <small>requests</small></div>
          <div className="kpi-meta">Awaiting officer action</div>
        </a>

        <div className="card kpi">
          <div className="kpi-top">
            <span className="kpi-label">In Progress</span>
            <span className="kpi-ico info"><Icon name="activity" /></span>
          </div>
          <div className="kpi-value">{kpis.inProgress} <small>cases</small></div>
          <div className="kpi-meta">Under verification</div>
        </div>

        <div className="card kpi">
          <div className="kpi-top">
            <span className="kpi-label">Resolved This Week</span>
            <span className="kpi-ico success"><Icon name="checkCircle" /></span>
          </div>
          <div className="kpi-value">{kpis.resolvedThisWeek} <small>certificates</small></div>
          <div className="kpi-meta">Signed and delivered</div>
        </div>

        <div className="card kpi">
          <div className="kpi-top">
            <span className="kpi-label">Department Staff</span>
            <span className="kpi-ico primary"><Icon name="users" /></span>
          </div>
          <div className="kpi-value">{kpis.deptStaffCount} <small>officers</small></div>
          <div className="kpi-meta">Student Affairs Unit</div>
        </div>
      </div>

      {/* Granted Permission Scope & Operational Queue */}
      <div className="grid g-3">
        <div className="col-span-2">
          <div className="card">
            <div className="card-head">
              <h3>Urgent Student Requests</h3>
              <a href="#/employee/requests" className="btn btn-secondary btn-sm">
                View Full Queue
              </a>
            </div>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Student Name</th>
                    <th>Type</th>
                    <th>Submitted</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {queue.slice(0, 4).map((r: any) => (
                    <tr key={r.id}>
                      <td><code>{r.id}</code></td>
                      <td className="bold">{r.studentName}</td>
                      <td><span className="badge badge-primary">{r.type}</span></td>
                      <td className="text-xs sub">{r.submittedDate}</td>
                      <td>
                        <span className={`badge ${r.status === 'Resolved' ? 'badge-success' : 'badge-warning'}`}>
                          {r.status}
                        </span>
                      </td>
                      <td>
                        <a href="#/employee/requests" className="btn btn-secondary btn-sm">
                          Process
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div className="card p-5">
            <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>
              <Icon name="shield" size="sm" /> Department Permissions Scope
            </h4>
            <p className="sub text-xs mb-3">
              Your actions are dynamically constrained by the permissions inherited from <strong>{department}</strong>:
            </p>
            <div className="stack gap-2">
              {permissions.map((p: string) => (
                <div key={p} className="chip chip-primary" style={{ fontSize: '12px' }}>
                  <Icon name="checkCircle" size="sm" /> {p}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
