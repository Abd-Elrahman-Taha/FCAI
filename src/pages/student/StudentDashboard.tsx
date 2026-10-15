import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { LiveCampusPulse } from '../../components/common/LiveCampusPulse';
import { ScrollReveal } from '../../components/common/ScrollReveal';
import { NeonRadialGauge } from '../../components/common/NeonRadialGauge';
import { AnimatedCounter } from '../../components/common/AnimatedCounter';

export const StudentDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'schedule' | 'assignments' | 'alerts'>('schedule');

  useEffect(() => {
    let mounted = true;
    fakeApi.getStudentDashboard().then(res => {
      if (mounted) {
        setData(res);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  if (loading || !data) {
    return (
      <div>
        <div className="skeleton mb-6" style={{ height: '140px', borderRadius: '20px' }} />
        <CardSkeleton count={4} />
      </div>
    );
  }

  const { student, kpis, todaySchedule, pendingAssignments, attendanceAlerts } = data;

  return (
    <div className="dashboard-container">
      {/* 1. Modern Welcome Hero Banner with ScrollReveal */}
      <ScrollReveal direction="up" delay={0.05}>
        <div className="hero mb-6">
          <div className="row-between wrap">
            <div>
              <div className="hero-chip mb-2">
                <span className="dot-live" />
                <Icon name="graduation" size="sm" /> Fall Semester 2026 · Week 4 Active
              </div>
              <h1 style={{ fontSize: '26px', fontWeight: 750, color: '#fff' }}>
                Welcome back, {student.name}
              </h1>
              <div className="sub mt-2 row gap-2 wrap align-center" style={{ fontSize: '13px', color: '#c4dbf3' }}>
                <span>Student ID: <b className="mono" style={{ color: '#fff' }}>{student.studentCode}</b></span>
                <span>•</span>
                <span>Department of {student.department}</span>
                <span>•</span>
                <span>{student.academicLevel}</span>
                <span className="badge b-success no-dot" style={{ fontSize: '11px', padding: '2px 8px' }}>
                  {student.academicStatus}
                </span>
              </div>
            </div>
            <div className="row gap-3 mt-3 wrap">
              <a href="#/student/qr-attendance" className="btn btn-ice" style={{ boxShadow: '0 4px 14px rgba(193,232,255,0.4)' }}>
                <Icon name="qr" /> Scan Attendance
              </a>
              <a href="#/student/registration" className="btn btn-hero-glass">
                <Icon name="plusSquare" /> Course Registration
              </a>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 2. Live Academic Stream & Interactive Frequency Visualizer */}
      <ScrollReveal direction="up" delay={0.1}>
        <LiveCampusPulse role="student" />
      </ScrollReveal>

      {/* 3. Summarized High-Impact 4 KPIs with Sci-Fi Telemetry Gauges */}
      <ScrollReveal direction="up" delay={0.15}>
        <div className="grid g-4 mb-6">
          {/* GPA Telemetry Gauge Card */}
          <a href="#/student/academic" className="card kpi hover group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:border-cyan-400/50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="kpi-top mb-1">
                  <span className="kpi-label">Cumulative GPA</span>
                  <span className="kpi-ico info group-hover:scale-110 transition-transform"><Icon name="award" /></span>
                </div>
                <div className="kpi-value text-2xl font-bold flex items-baseline gap-1">
                  <AnimatedCounter value={Number(student.gpa) || 3.42} decimals={2} />
                  <span className="text-xs font-normal opacity-70">/ 4.00</span>
                </div>
                <div className="kpi-meta mt-1">
                  <span className="text-cyan-600 dark:text-cyan-400 font-semibold">↑ +0.08</span> · <strong>Very Good</strong>
                </div>
              </div>
              <div className="flex-shrink-0">
                <NeonRadialGauge
                  value={Number(student.gpa) || 3.42}
                  max={4.0}
                  size={76}
                  strokeWidth={6}
                  decimals={2}
                  label="GPA"
                  glowColor="cyan"
                />
              </div>
            </div>
          </a>

          {/* Attendance Ring Card with 75% Threshold Alert */}
          <a href="#/student/attendance" className="card kpi hover group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:border-cyan-400/50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="kpi-top mb-1">
                  <span className="kpi-label">Overall Attendance</span>
                  <span className="kpi-ico info group-hover:scale-110 transition-transform"><Icon name="userCheck" /></span>
                </div>
                <div className="kpi-value text-2xl font-bold flex items-baseline">
                  <AnimatedCounter value={Number(kpis.attendance) || 92} suffix="%" />
                </div>
                <div className="kpi-meta mt-1 text-xs">
                  <span className={Number(kpis.attendance) >= 75 ? "text-cyan-600 dark:text-cyan-400 font-medium" : "text-amber-500 font-bold"}>
                    {Number(kpis.attendance) >= 75 ? 'Safe (>75% Policy)' : '⚠️ Warning (<75%)'}
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <NeonRadialGauge
                  value={Number(kpis.attendance) || 92}
                  max={100}
                  size={76}
                  strokeWidth={6}
                  warningThreshold={75}
                  decimals={0}
                  sublabel="%"
                  label="RATE"
                  glowColor="cyan"
                />
              </div>
            </div>
          </a>

          {/* Enrolled Load Card */}
          <a href="#/student/courses" className="card kpi hover group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:border-cyan-400/50 p-4">
            <div className="kpi-top">
              <span className="kpi-label">Enrolled Load</span>
              <span className="kpi-ico info group-hover:scale-110 transition-transform"><Icon name="book" /></span>
            </div>
            <div className="kpi-value text-2xl font-bold flex items-baseline gap-1">
              <AnimatedCounter value={Number(kpis.coursesCount) || 5} />
              <small className="text-xs font-normal opacity-70">Courses (17 CH)</small>
            </div>
            <div className="kpi-meta mt-1 text-xs text-slate-500 dark:text-slate-400">
              <span>Next exam in 4 days (Algorithms)</span>
            </div>
          </a>

          {/* Outstanding Tuition Card */}
          <a href="#/student/fees" className="card kpi hover group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:border-cyan-400/50 p-4" style={{ borderLeft: '3px solid #b45309' }}>
            <div className="kpi-top">
              <span className="kpi-label">Outstanding Tuition</span>
              <span className="kpi-ico warning group-hover:scale-110 transition-transform"><Icon name="wallet" /></span>
            </div>
            <div className="kpi-value text-2xl font-bold" style={{ color: '#b45309' }}>
              <AnimatedCounter value={7650} prefix="EGP " />
            </div>
            <div className="kpi-meta mt-1 text-xs" style={{ color: '#b45309' }}>
              <span>Fawry Code Available &rarr;</span>
            </div>
          </a>
        </div>
      </ScrollReveal>

      {/* 4. Streamlined Workspace with Clean Tabs */}
      <ScrollReveal direction="up" delay={0.2}>
        <div className="card mb-6">
          {/* Tab Switcher */}
          <div className="card-head" style={{ borderBottom: '1px solid var(--border)', padding: '12px 16px' }}>
            <div className="row gap-2 scroll-x" style={{ overflowX: 'auto', maxWidth: '100%', WebkitOverflowScrolling: 'touch', paddingBottom: '2px' }}>
              <button
                className={`btn btn-sm ${activeTab === 'schedule' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ flexShrink: 0, whiteSpace: 'nowrap' }}
                onClick={() => setActiveTab('schedule')}
              >
                <Icon name="calendar" size="sm" /> Today's Schedule ({todaySchedule.length})
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'assignments' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ flexShrink: 0, whiteSpace: 'nowrap' }}
                onClick={() => setActiveTab('assignments')}
              >
                <Icon name="clipboard" size="sm" /> Active Assignments ({pendingAssignments.length})
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'alerts' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ flexShrink: 0, whiteSpace: 'nowrap' }}
                onClick={() => setActiveTab('alerts')}
              >
                <Icon name="alertCircle" size="sm" /> Academic Alerts ({attendanceAlerts.length})
              </button>
            </div>
            <span className="sub text-xs hide-m">Sunday, October 14, 2026</span>
          </div>

          {/* Tab 1: Today's Schedule */}
          {activeTab === 'schedule' && (
            <div className="list">
              {todaySchedule.map((s: any) => (
                <div key={s.id} className="list-item" style={{ transition: 'background 0.2s ease' }}>
                  <div className="date-chip">
                    <small>{s.startTime}</small>
                    <b>{s.endTime.split(':')[0]}</b>
                  </div>
                  <div className="li-main">
                    <div className="row gap-2 wrap">
                      <b style={{ fontSize: '14.5px' }}>{s.courseCode} · {s.courseName}</b>
                      <span className="badge b-info">{s.sessionType}</span>
                    </div>
                    <span className="sub text-xs mt-1">Venue: {s.room} &nbsp;•&nbsp; Instructor: {s.instructor}</span>
                  </div>
                  <div className="row gap-2 wrap">
                    <a href="#/student/qr-attendance" className="btn btn-sm btn-primary">
                      <Icon name="qr" size="sm" /> Scan QR
                    </a>
                    <a href="#/student/timetable" className="btn btn-sm btn-secondary">
                      View Room
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Pending Assignments */}
          {activeTab === 'assignments' && (
            <div className="list">
              {pendingAssignments.map((a: any) => (
                <div key={a.id} className="list-item">
                  <div className="li-ico warning"><Icon name="clipboard" /></div>
                  <div className="li-main">
                    <b>{a.title}</b>
                    <span>Course: {a.courseCode} &nbsp;•&nbsp; Deadline: <strong>{a.dueDate}</strong> &nbsp;•&nbsp; Total: {a.totalMarks} marks</span>
                  </div>
                  <div className="row gap-2 wrap">
                    <span className="badge b-warning">Pending</span>
                    <a href="#/student/assignments" className="btn btn-sm btn-primary">
                      Submit File &rarr;
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Attendance & Academic Alerts */}
          {activeTab === 'alerts' && (
            <div className="card-body">
              {attendanceAlerts.length > 0 ? (
                <div className="col gap-3">
                  {attendanceAlerts.map((alt: any, i: number) => (
                    <div
                      key={i}
                      className="row-between p-3"
                      style={{
                        borderRadius: '12px',
                        background: 'var(--danger-50)',
                        border: '1px solid var(--danger-100)',
                        color: 'var(--danger-700)'
                      }}
                    >
                      <div className="row gap-3">
                        <Icon name="alert" size="lg" />
                        <div>
                          <strong style={{ fontSize: '14px', display: 'block' }}>{alt.courseCode} — {alt.courseName}</strong>
                          <span style={{ fontSize: '12.5px' }}>Attendance is currently at {alt.percent}%. Approaching statutory 75% deprivation threshold.</span>
                        </div>
                      </div>
                      <a href="#/student/attendance" className="btn btn-sm btn-danger-soft">
                        View Attendance Log
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="sub text-center py-4">No active academic alerts. All courses meet good standing criteria.</p>
              )}
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* 5. Quick Services Row (Summarized cleanly at the bottom) */}
      <ScrollReveal direction="up" delay={0.25}>
        <div className="grid g-3">
          <a href="#/student/study-assistant" className="card p-4 hover row gap-3">
            <div className="li-ico info"><Icon name="sparkles" /></div>
            <div>
              <strong style={{ fontSize: '14px', display: 'block' }}>AI Study Assistant</strong>
              <span className="sub text-xs">Curriculum question answering &amp; slides summaries</span>
            </div>
          </a>

          <a href="#/student/requests" className="card p-4 hover row gap-3">
            <div className="li-ico success"><Icon name="inbox" /></div>
            <div>
              <strong style={{ fontSize: '14px', display: 'block' }}>Official Service Petitions</strong>
              <span className="sub text-xs">Transcripts, enrollment proofs &amp; certificates</span>
            </div>
          </a>

          <a href="#/student/fees" className="card p-4 hover row gap-3">
            <div className="li-ico warning"><Icon name="receipt" /></div>
            <div>
              <strong style={{ fontSize: '14px', display: 'block' }}>Fawry Pay-Code &amp; Receipts</strong>
              <span className="sub text-xs">Tuition statements &amp; electronic payment validation</span>
            </div>
          </a>
        </div>
      </ScrollReveal>
    </div>
  );
};
