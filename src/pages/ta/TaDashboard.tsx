import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';

export const TaDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fakeApi.getTaDashboard().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) return <CardSkeleton count={4} />;

  const { ta, kpis, todaySessions } = data;

  return (
    <div>
      {/* Hero Welcome Banner */}
      <div className="hero mb-6">
        <div className="row-between wrap">
          <div>
            <div className="hero-chip mb-2">
              <Icon name="briefcase" size="sm" /> Faculty of Computers &amp; AI · Practical Labs
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 750 }}>Welcome, {ta.name}</h1>
            <p className="sub mt-2" style={{ fontSize: '14px' }}>
              Teaching Assistant · {ta.department} Department &nbsp;•&nbsp; 3 Assigned Lab Sections
            </p>
          </div>
          <div className="row gap-2 mt-2">
            <a href="#/ta/sections" className="btn btn-ice">
              <Icon name="qr" /> Open Lab QR Attendance
            </a>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid g-4 mb-6">
        <a href="#/ta/sections" className="card kpi hover">
          <div className="kpi-top">
            <span className="kpi-label">Assigned Sections</span>
            <span className="kpi-ico info"><Icon name="users" /></span>
          </div>
          <div className="kpi-value">{kpis.assignedSections} <small>groups</small></div>
          <div className="kpi-meta">64 Enrolled Lab Students</div>
        </a>

        <div className="card kpi">
          <div className="kpi-top">
            <span className="kpi-label">Today's Lab Sessions</span>
            <span className="kpi-ico success"><Icon name="clock" /></span>
          </div>
          <div className="kpi-value">{kpis.todaySessions} <small>sessions</small></div>
          <div className="kpi-meta">Lab 3-West &amp; Lab 2-East</div>
        </div>

        <a href="#/ta/sections" className="card kpi hover">
          <div className="kpi-top">
            <span className="kpi-label">Pending Lab Submissions</span>
            <span className="kpi-ico warning"><Icon name="file" /></span>
          </div>
          <div className="kpi-value">{kpis.pendingSubmissions} <small>awaiting review</small></div>
          <div className="kpi-meta">Lab Exercise 4: Graphs</div>
        </a>

        <div className="card kpi">
          <div className="kpi-top">
            <span className="kpi-label">Grades to Enter</span>
            <span className="kpi-ico danger"><Icon name="table" /></span>
          </div>
          <div className="kpi-value">{kpis.gradesToEnter} <small>grades</small></div>
          <div className="kpi-meta">Practical Lab Components</div>
        </div>
      </div>

      <div className="grid g-2">
        {/* Today's Lab Sessions */}
        <div className="card">
          <div className="card-head">
            <h3>Today's Practical Sessions</h3>
            <span className="badge badge-primary">Fall 2026</span>
          </div>
          <div className="stack gap-3 p-4">
            {todaySessions.map((s: any, idx: number) => (
              <div key={idx} className="card p-4" style={{ background: 'var(--color-bg-page)' }}>
                <div className="row-between mb-2">
                  <span className="badge badge-primary">{s.courseCode}</span>
                  <span className="badge badge-neutral">{s.room}</span>
                </div>
                <h4 className="bold mb-1">{s.section}</h4>
                <div className="row-between text-xs sub">
                  <span>Schedule: <strong>{s.time}</strong></span>
                  <a href="#/ta/sections" className="btn btn-secondary btn-sm">
                    <Icon name="qr" /> Launch Lab QR
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick TA Guidance & Scope Boundary */}
        <div className="card p-5">
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px' }}>
            TA Practical Responsibilities &amp; Boundaries
          </h3>
          <div className="stack gap-3">
            <div className="card p-3" style={{ borderLeft: '4px solid var(--color-success)' }}>
              <strong>Lab Attendance:</strong> Generate dynamic rotating QR codes for your practical section and manually record excuses.
            </div>
            <div className="card p-3" style={{ borderLeft: '4px solid var(--color-primary)' }}>
              <strong>Practical Assessment:</strong> Grade student lab assignments and enter practical component marks (max 20 marks).
            </div>
            <div className="card p-3" style={{ borderLeft: '4px solid var(--color-warning)' }}>
              <strong>Scope Constraint:</strong> Only the Lead Doctor (Dr. Mona Abdelrahman) can formally submit the whole CourseOffering grade package to the Dean Executive Office.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
