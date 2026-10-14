import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboard: React.FC = () => {
  const { showToast } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fakeApi.getAdminDashboard().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) return <CardSkeleton count={5} />;

  const { kpis, enrollmentByLevel, attendanceTrend, pendingGradePackages } = data;

  const handleApprove = async (code: string) => {
    await fakeApi.approveGradePackage(code);
    setData((prev: any) => ({
      ...prev,
      pendingGradePackages: prev.pendingGradePackages.filter((p: any) => p.courseCode !== code)
    }));
    showToast(`Grade package for ${code} officially approved and published!`, 'success');
  };

  return (
    <div>
      {/* Admin Hero */}
      <div className="hero mb-6">
        <div className="row-between wrap">
          <div>
            <div className="hero-chip mb-2">
              <Icon name="shield" size="sm" /> Faculty Executive Administration · Beni Suef University
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 750 }}>College Administration Overview</h1>
            <p className="sub mt-2" style={{ fontSize: '14px' }}>
              Dean Office Portal &nbsp;•&nbsp; Academic Governance, Grade Approval, Fee Management &amp; Service Operations
            </p>
          </div>
          <div className="row gap-2 mt-2">
            <a href="#/admin/grade-approval" className="btn btn-ice">
              <Icon name="checkCircle" /> Grade Approval Queue ({pendingGradePackages.length})
            </a>
            <a href="#/admin/fees" className="btn btn-hero-glass">
              <Icon name="creditCard" /> Fee Operations
            </a>
          </div>
        </div>
      </div>

      {/* 6 Key Faculty KPIs */}
      <div className="grid g-6 mb-6">
        <a href="#/admin/students" className="card kpi hover">
          <div className="kpi-top">
            <span className="kpi-label">Total Students</span>
            <span className="kpi-ico info"><Icon name="users" /></span>
          </div>
          <div className="kpi-value">{kpis.studentsCount}</div>
          <div className="kpi-meta">Across 4 Academic Levels</div>
        </a>

        <a href="#/admin/faculty" className="card kpi hover">
          <div className="kpi-top">
            <span className="kpi-label">Faculty Staff</span>
            <span className="kpi-ico success"><Icon name="briefcase" /></span>
          </div>
          <div className="kpi-value">{kpis.facultyCount}</div>
          <div className="kpi-meta">48 Doctors · 72 TAs</div>
        </a>

        <a href="#/admin/offerings" className="card kpi hover">
          <div className="kpi-top">
            <span className="kpi-label">Active Offerings</span>
            <span className="kpi-ico primary"><Icon name="layers" /></span>
          </div>
          <div className="kpi-value">{kpis.offeringsCount}</div>
          <div className="kpi-meta">Fall 2026 Semester</div>
        </a>

        <div className="card kpi">
          <div className="kpi-top">
            <span className="kpi-label">Daily Attendance</span>
            <span className="kpi-ico success"><Icon name="qr" /></span>
          </div>
          <div className="kpi-value">{kpis.todayAttendance}%</div>
          <div className="kpi-meta">Faculty-wide QR Rate</div>
        </div>

        <a href="#/admin/service-requests" className="card kpi hover">
          <div className="kpi-top">
            <span className="kpi-label">Open Requests</span>
            <span className="kpi-ico warning"><Icon name="file" /></span>
          </div>
          <div className="kpi-value">{kpis.openServiceRequests}</div>
          <div className="kpi-meta">Student Affairs &amp; Dean</div>
        </a>

        <a href="#/admin/fees" className="card kpi hover">
          <div className="kpi-top">
            <span className="kpi-label">Unpaid Fees</span>
            <span className="kpi-ico danger"><Icon name="creditCard" /></span>
          </div>
          <div className="kpi-value">{kpis.unpaidFeesCount}</div>
          <div className="kpi-meta">Pending Fawry settlement</div>
        </a>
      </div>

      {/* Charts & Graphs Row */}
      <div className="grid g-2 mb-6">
        {/* Enrollment by Level */}
        <div className="card p-5">
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px' }}>
            Student Enrollment by Academic Level
          </h3>
          <div className="stack gap-3">
            {enrollmentByLevel.map((lvl: any) => {
              const pct = Math.round((lvl.count / kpis.studentsCount) * 100);
              return (
                <div key={lvl.label}>
                  <div className="row-between text-xs mb-1">
                    <strong>{lvl.label}</strong>
                    <span className="sub">{lvl.count} Students ({pct}%)</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct * 2}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Attendance Trend */}
        <div className="card p-5">
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px' }}>
            Faculty Attendance Trend (Lectures vs Labs)
          </h3>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Academic Week</th>
                  <th>Lecture QR Average</th>
                  <th>Practical Lab Average</th>
                  <th>Composite Health</th>
                </tr>
              </thead>
              <tbody>
                {attendanceTrend.map((row: any) => (
                  <tr key={row.week}>
                    <td className="bold">{row.week}</td>
                    <td><span className="badge badge-success">{row.lectures}%</span></td>
                    <td><span className="badge badge-info">{row.labs}%</span></td>
                    <td className="bold" style={{ color: 'var(--color-primary)' }}>
                      {Math.round((row.lectures + row.labs) / 2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pending Grade Packages Queue Section */}
      <div className="card mb-6">
        <div className="card-head">
          <h3>Grade Packages Awaiting Dean Approval</h3>
          <a href="#/admin/grade-approval" className="btn btn-secondary btn-sm">
            View All in Approval Center
          </a>
        </div>
        {pendingGradePackages.length === 0 ? (
          <div className="p-6 text-center sub">
            <Icon name="checkCircle" size="lg" style={{ color: 'var(--color-success)', marginBottom: '8px' }} />
            <div>All submitted course grade packages have been reviewed and published.</div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Name</th>
                  <th>Lead Doctor</th>
                  <th>Enrolled</th>
                  <th>Average Grade</th>
                  <th>Failures</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingGradePackages.map((pkg: any) => (
                  <tr key={pkg.id}>
                    <td><span className="badge badge-primary">{pkg.courseCode}</span></td>
                    <td className="bold">{pkg.courseName}</td>
                    <td>{pkg.leadDoctor}</td>
                    <td>{pkg.enrolledStudents} students</td>
                    <td className="bold">{pkg.averageGrade}</td>
                    <td>
                      <span className={`badge ${pkg.failuresCount > 0 ? 'badge-danger' : 'badge-success'}`}>
                        {pkg.failuresCount} Students
                      </span>
                    </td>
                    <td>
                      <div className="row gap-2">
                        <button className="btn btn-success btn-sm" onClick={() => handleApprove(pkg.courseCode)}>
                          <Icon name="checkCircle" /> Approve &amp; Publish
                        </button>
                        <a href="#/admin/grade-approval" className="btn btn-secondary btn-sm">
                          Audit
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
