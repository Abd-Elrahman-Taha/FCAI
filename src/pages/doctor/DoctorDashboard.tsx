import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { LiveCampusPulse } from '../../components/common/LiveCampusPulse';

export const DoctorDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fakeApi.getDoctorDashboard().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) return <CardSkeleton count={5} />;

  const { doctor, kpis, pendingGradingQueue, gradeWorkflowPackages } = data;

  return (
    <div>
      {/* Hero Welcome Banner */}
      <div className="hero mb-6">
        <div className="row-between wrap">
          <div>
            <div className="hero-chip mb-2">
              <Icon name="briefcase" size="sm" /> Faculty of Computers &amp; AI · Fall 2026
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 750 }}>Welcome, {doctor.name}</h1>
            <p className="sub mt-2" style={{ fontSize: '14px' }}>
              Associate Professor · {doctor.department} Department &nbsp;•&nbsp; Office: Room B-314 &nbsp;•&nbsp; 4 Assigned CourseOfferings
            </p>
          </div>
          <div className="row gap-2 mt-2">
            <a href="#/doctor/attendance" className="btn btn-ice">
              <Icon name="qr" /> Launch Live QR Lecture
            </a>
            <a href="#/doctor/gradebook" className="btn btn-hero-glass">
              <Icon name="table" /> Open Gradebook
            </a>
          </div>
        </div>
      </div>

      {/* Live Campus Activity Stream */}
      <LiveCampusPulse
        role="doctor"
        nextSessionTitle="Distributed Systems & Cloud (CS411) Lecture 04"
        nextSessionRoom="Main Auditorium A"
        instructor={doctor.name}
      />

      {/* KPI Cards Row (Clean 4-Card Grid with Tailwind Interactive Hover) */}
      <div className="grid g-4 mb-6">
        <a href="#/doctor/offerings" className="card kpi hover group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:border-blue-400/50">
          <div className="kpi-top">
            <span className="kpi-label">Active Offerings</span>
            <span className="kpi-ico info group-hover:scale-110 transition-transform"><Icon name="layers" /></span>
          </div>
          <div className="kpi-value">{kpis.offeringsCount} <small>Courses</small></div>
          <div className="kpi-meta">{kpis.studentsCount} Enrolled across 10 Sections</div>
        </a>


        <a href="#/doctor/submissions" className="card kpi hover group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:border-blue-400/50">
          <div className="kpi-top">
            <span className="kpi-label">Pending Reviews</span>
            <span className="kpi-ico warning group-hover:scale-110 transition-transform"><Icon name="inbox" /></span>
          </div>
          <div className="kpi-value">{kpis.pendingSubmissions} <small>Submissions</small></div>
          <div className="kpi-meta"><span className="trend-down">Needs evaluation</span></div>
        </a>

        <a href="#/doctor/reports" className="card kpi hover group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:border-blue-400/50">
          <div className="kpi-top">
            <span className="kpi-label">Average Attendance</span>
            <span className="kpi-ico success group-hover:scale-110 transition-transform"><Icon name="userCheck" /></span>
          </div>
          <div className="kpi-value">{kpis.averageAttendance}%</div>
          <div className="kpi-meta"><span className="trend-up">↑ Above 75% threshold</span></div>
        </a>

        <a href="#/doctor/exams" className="card kpi hover group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:border-blue-400/50">
          <div className="kpi-top">
            <span className="kpi-label">Upcoming Exams</span>
            <span className="kpi-ico violet group-hover:scale-110 transition-transform"><Icon name="fileText" /></span>
          </div>
          <div className="kpi-value">{kpis.upcomingExams} <small>Scheduled</small></div>
          <div className="kpi-meta">Next: Algorithms Midterm (Oct 18)</div>
        </a>
      </div>

      {/* Main Grid: Pending Grading Queue & Grade Package Status */}
      <div className="grid g-main">
        <div className="col gap-6">
          {/* Pending Short-Answer Grading Widget */}
          <div className="card" style={{ borderLeft: '4px solid var(--warning-600)' }}>
            <div className="card-head">
              <div>
                <h3><Icon name="clock" size="sm" /> Short-Answer Questions Waiting for Grading</h3>
                <p>Subjective responses requiring instructor evaluation before student results unlock.</p>
              </div>
              <span className="badge b-warning">37 Pending Responses</span>
            </div>
            <div className="card-body">
              {pendingGradingQueue.map((item: any, idx: number) => (
                <div key={idx}>
                  <div className="row-between mb-2 text-sm">
                    <b>{item.course} — {item.examTitle}</b>
                    <span className="muted">{item.pendingCount} of {item.totalCount} Students Need Manual Scoring</span>
                  </div>
                  <div className="progress warning mb-3">
                    <span style={{ width: `${item.progress}%` }} />
                  </div>
                  <div className="row-between text-xs muted">
                    <span>27 auto-scored MCQs / True-False completed</span>
                    <a href="#/doctor/exams" className="btn btn-sm btn-primary">
                      Open Correction Queue <Icon name="arrowRight" size="sm" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grade Approval Workflow Widget */}
          <div className="card">
            <div className="card-head">
              <div>
                <h3><Icon name="award" size="sm" /> CourseOffering Grade Packages</h3>
                <p>Status of semester final grade packages (Submitted as a single CourseOffering package).</p>
              </div>
              <a href="#/doctor/gradebook" className="card-link">
                Gradebook <Icon name="arrowRight" size="sm" />
              </a>
            </div>
            <div className="list">
              {gradeWorkflowPackages.map((pkg: any) => (
                <div key={pkg.id} className="list-item">
                  <div className="li-ico">
                    <Icon name={pkg.status === 'Published' ? 'checkCircle' : pkg.status === 'Doctor Submitted' ? 'inbox' : 'table'} />
                  </div>
                  <div className="li-main">
                    <b>{pkg.courseCode} · {pkg.courseName} ({pkg.enrolledStudents} Students)</b>
                    <span>Lead: {pkg.leadDoctor} • Average: {pkg.averageGrade}</span>
                    {pkg.auditNotes && (
                      <span className="text-xs trend-down block mt-1">{pkg.auditNotes}</span>
                    )}
                  </div>
                  <span
                    className={`badge ${
                      pkg.status === 'Published'
                        ? 'b-success'
                        : pkg.status === 'Doctor Submitted'
                        ? 'b-info'
                        : pkg.status === 'Draft'
                        ? 'b-warning'
                        : 'b-danger'
                    }`}
                  >
                    {pkg.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Today's Scheduled Sessions */}
        <div className="col gap-6">
          <div className="card">
            <div className="card-head">
              <h3><Icon name="calendar" size="sm" /> Today's Sessions</h3>
              <span className="badge b-info no-dot">Sunday</span>
            </div>
            <div className="list">
              <div className="list-item">
                <div className="date-chip">
                  <small>10:00</small>
                  <b>12</b>
                </div>
                <div className="li-main">
                  <b>CS301 · Algorithms Lecture</b>
                  <span>Hall A-101 • 64 Enrolled</span>
                </div>
                <a href="#/doctor/attendance" className="btn btn-primary btn-sm">
                  <Icon name="qr" size="sm" /> Launch QR
                </a>
              </div>
              <div className="list-item">
                <div className="date-chip">
                  <small>13:00</small>
                  <b>15</b>
                </div>
                <div className="li-main">
                  <b>CS204 · Data Structures</b>
                  <span>Hall B-204 • 52 Enrolled</span>
                </div>
                <span className="badge b-neutral">Upcoming</span>
              </div>
            </div>
          </div>

          <div className="card card-pad" style={{ background: 'var(--blue-50)', borderColor: 'var(--blue-200)' }}>
            <h4 className="fw-7 text-sm mb-1">Academic Regulation Reminder:</h4>
            <p className="text-xs muted">
              Under Beni Suef University rules, final course grades must be submitted as a complete <b>CourseOffering package</b> containing all coursework, midterms, practicals, and final scores for Dean approval.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
