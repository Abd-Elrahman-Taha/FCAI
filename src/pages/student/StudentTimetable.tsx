import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import type { TimetableSession } from '../../types';

export const StudentTimetable: React.FC = () => {
  const [sessions, setSessions] = useState<TimetableSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [courseFilter, setCourseFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'Lecture' | 'Section'>('ALL');
  const [viewMode, setViewMode] = useState<'matrix' | 'agenda'>('matrix');
  const [activeWeekOffset, setActiveWeekOffset] = useState(0);
  const [selectedDayTab, setSelectedDayTab] = useState<'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday'>('Sunday');
  const [selectedSession, setSelectedSession] = useState<TimetableSession | null>(null);

  useEffect(() => {
    fakeApi.getTimetable().then(res => {
      setSessions(res);
      setLoading(false);
    });
  }, []);

  const days: ('Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday')[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday'
  ];

  const timeHours = [
    { label: '09:00 AM', hour: 9 },
    { label: '10:00 AM', hour: 10 },
    { label: '11:00 AM', hour: 11 },
    { label: '12:00 PM', hour: 12 },
    { label: '01:00 PM', hour: 13 },
    { label: '02:00 PM', hour: 14 },
    { label: '03:00 PM', hour: 15 },
    { label: '04:00 PM', hour: 16 }
  ];

  const uniqueCourses = Array.from(new Set(sessions.map(s => s.courseCode)));

  const filteredSessions = sessions.filter(s => {
    const matchCourse = courseFilter === 'ALL' ? true : s.courseCode === courseFilter;
    const matchType = typeFilter === 'ALL' ? true : s.sessionType === typeFilter;
    return matchCourse && matchType;
  });

  const parseTime = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return { hour: h, min: m || 0 };
  };

  const getSessionPosition = (session: TimetableSession) => {
    const start = parseTime(session.startTime);
    const end = parseTime(session.endTime);
    const hourHeight = 72; // px per hour

    const top = (start.hour - 9 + start.min / 60) * hourHeight;
    const durationHours = (end.hour - start.hour) + (end.min - start.min) / 60;
    const height = Math.max(durationHours * hourHeight - 6, 44);

    return { top: `${top}px`, height: `${height}px` };
  };

  const totalLectures = sessions.filter(s => s.sessionType === 'Lecture').length;
  const totalSections = sessions.filter(s => s.sessionType === 'Section').length;
  const totalHours = sessions.length * 2; // Each session is 2 hours

  const todayName: ('Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday') = 'Sunday'; // Fixed demo today
  const todaySessions = sessions.filter(s => s.day === todayName);

  return (
    <div>
      <PageHead
        title="Weekly Academic Timetable"
        desc="Interactive lecture and lab section schedule with synchronized time alignment for Fall Semester 2026."
        crumbs={[['Student Portal', '#/student/dashboard'], ['Timetable']]}
        actions={
          <div className="row gap-2">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setActiveWeekOffset(0);
                setSelectedDayTab('Sunday');
              }}
            >
              Today
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setActiveWeekOffset(prev => prev - 1)}
              title="Previous Week"
            >
              <Icon name="chevronLeft" size="sm" />
            </button>
            <span className="text-xs fw-6 px-2 align-self-center">
              Week {4 + activeWeekOffset} (Fall 2026)
            </span>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setActiveWeekOffset(prev => prev + 1)}
              title="Next Week"
            >
              <Icon name="chevronRight" size="sm" />
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => window.print()}
              title="Print Timetable"
            >
              <Icon name="printer" size="sm" />
            </button>
          </div>
        }
      />

      {/* KPI Overview Summary Bar */}
      <div className="grid g-4 mb-4">
        <div className="card card-pad p-3.5">
          <div className="row gap-3 align-center">
            <div className="state-art info m-0" style={{ width: '42px', height: '42px', borderRadius: '12px' }}>
              <Icon name="calendar" size="md" />
            </div>
            <div>
              <span className="text-xs muted block">Total Weekly Load</span>
              <b style={{ fontSize: '16px' }}>{totalHours} Class Hours / Week</b>
            </div>
          </div>
        </div>

        <div className="card card-pad p-3.5">
          <div className="row gap-3 align-center">
            <div className="state-art success m-0" style={{ width: '42px', height: '42px', borderRadius: '12px' }}>
              <Icon name="bookOpen" size="md" />
            </div>
            <div>
              <span className="text-xs muted block">Lectures</span>
              <b style={{ fontSize: '16px' }}>{totalLectures} Theoretical Lectures</b>
            </div>
          </div>
        </div>

        <div className="card card-pad p-3.5">
          <div className="row gap-3 align-center">
            <div className="state-art warning m-0" style={{ width: '42px', height: '42px', borderRadius: '12px' }}>
              <Icon name="layers" size="md" />
            </div>
            <div>
              <span className="text-xs muted block">Practical Sections</span>
              <b style={{ fontSize: '16px' }}>{totalSections} Lab Sessions</b>
            </div>
          </div>
        </div>

        <div className="card card-pad p-3.5">
          <div className="row gap-3 align-center">
            <div className="state-art primary m-0" style={{ width: '42px', height: '42px', borderRadius: '12px' }}>
              <Icon name="clock" size="md" />
            </div>
            <div>
              <span className="text-xs muted block">Today's Schedule</span>
              <b style={{ fontSize: '16px' }}>{todaySessions.length} Classes (Sunday)</b>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and View Switcher Toolbar */}
      <div className="card p-3 mb-4">
        <div className="row-between wrap gap-3 align-center">
          {/* Filters */}
          <div className="row gap-3 wrap align-center">
            <div className="row gap-1.5 align-center">
              <Icon name="filter" size="sm" className="text-muted" />
              <span className="text-xs muted fw-6">Course:</span>
              <select
                className="select"
                style={{ width: '200px', height: '34px', fontSize: '12.5px' }}
                value={courseFilter}
                onChange={e => setCourseFilter(e.target.value)}
              >
                <option value="ALL">All Registered Courses ({sessions.length})</option>
                {uniqueCourses.map(code => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
            </div>

            <div className="row gap-1 align-center">
              <span className="text-xs muted fw-6 mr-1">Type:</span>
              <button
                type="button"
                className={`btn btn-sm ${typeFilter === 'ALL' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ height: '32px', fontSize: '12px', padding: '0 10px' }}
                onClick={() => setTypeFilter('ALL')}
              >
                All
              </button>
              <button
                type="button"
                className={`btn btn-sm ${typeFilter === 'Lecture' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ height: '32px', fontSize: '12px', padding: '0 10px' }}
                onClick={() => setTypeFilter('Lecture')}
              >
                Lectures
              </button>
              <button
                type="button"
                className={`btn btn-sm ${typeFilter === 'Section' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ height: '32px', fontSize: '12px', padding: '0 10px' }}
                onClick={() => setTypeFilter('Section')}
              >
                Labs / Sections
              </button>
            </div>
          </div>

          {/* View Switcher & Legends */}
          <div className="row gap-3 align-center">
            <div className="row gap-3 text-xs muted hide-m">
              <span className="legend">
                <i style={{ background: '#38bdf8', width: '10px', height: '10px', borderRadius: '3px' }}></i> Lecture
              </span>
              <span className="legend">
                <i style={{ background: '#5483B3', width: '10px', height: '10px', borderRadius: '3px' }}></i> Lab / Section
              </span>
            </div>

            <div className="row gap-1" style={{ background: 'var(--surface-2)', padding: '3px', borderRadius: '8px' }}>
              <button
                type="button"
                className={`btn btn-sm ${viewMode === 'matrix' ? 'btn-secondary' : 'btn-ghost'}`}
                style={{ height: '30px', fontSize: '12px', padding: '0 10px' }}
                onClick={() => setViewMode('matrix')}
                title="Weekly Time Matrix View"
              >
                <Icon name="grid" size="sm" /> Weekly Grid
              </button>
              <button
                type="button"
                className={`btn btn-sm ${viewMode === 'agenda' ? 'btn-secondary' : 'btn-ghost'}`}
                style={{ height: '30px', fontSize: '12px', padding: '0 10px' }}
                onClick={() => setViewMode('agenda')}
                title="Day Agenda View"
              >
                <Icon name="list" size="sm" /> Agenda View
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW 1: Synchronized Weekly Time Matrix Grid */}
      {viewMode === 'matrix' && (
        <div className="card" style={{ overflowX: 'auto', padding: '16px' }}>
          <div style={{ minWidth: '920px' }}>
            {/* Header: Time Column Header + 5 Day Headers */}
            <div style={{ display: 'grid', gridTemplateColumns: '84px repeat(5, 1fr)', gap: '10px', marginBottom: '8px' }}>
              <div className="text-center py-2" style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                Time Slot
              </div>
              {days.map(day => {
                const isToday = day === todayName;
                const dayCount = filteredSessions.filter(s => s.day === day).length;
                return (
                  <div
                    key={day}
                    className={`tt-head ${isToday ? 'today' : ''}`}
                    style={{
                      borderRadius: '12px',
                      padding: '10px 8px',
                      background: isToday ? 'linear-gradient(135deg, rgba(84, 131, 179, 0.25), rgba(193, 232, 255, 0.15))' : 'var(--surface-2)',
                      border: isToday ? '1px solid var(--blue-400)' : '1px solid var(--border)',
                      textAlign: 'center'
                    }}
                  >
                    <div className="row-between align-center mb-1">
                      <span style={{ fontSize: '12px', fontWeight: 750, color: isToday ? 'var(--blue-400)' : 'var(--text)' }}>
                        {day}
                      </span>
                      {isToday && (
                        <span className="badge b-info no-dot" style={{ fontSize: '9px', height: '16px', padding: '0 5px' }}>
                          Today
                        </span>
                      )}
                    </div>
                    <div className="text-xs muted" style={{ fontSize: '11px' }}>
                      {dayCount} {dayCount === 1 ? 'class' : 'classes'}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Matrix Body: Synchronized Hour Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '84px repeat(5, 1fr)', gap: '10px', position: 'relative' }}>
              {/* Left Column: Time Axis Labels */}
              <div style={{ height: '504px', position: 'relative' }}>
                {timeHours.map((t, idx) => (
                  <div
                    key={t.hour}
                    style={{
                      position: 'absolute',
                      top: `${idx * 72}px`,
                      left: 0,
                      right: '8px',
                      textAlign: 'right',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--text-faint)',
                      transform: 'translateY(-8px)'
                    }}
                  >
                    {t.label}
                  </div>
                ))}
              </div>

              {/* 5 Day Columns with horizontal hour guide lines */}
              {days.map(day => {
                const daySessions = filteredSessions.filter(s => s.day === day);
                const isToday = day === todayName;

                return (
                  <div
                    key={day}
                    style={{
                      height: '504px',
                      position: 'relative',
                      borderRadius: '12px',
                      background: isToday ? 'rgba(84, 131, 179, 0.04)' : 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0, transparent 71px, var(--border) 71px, var(--border) 72px)'
                    }}
                  >
                    {daySessions.length === 0 ? (
                      <div
                        style={{
                          position: 'absolute',
                          top: '180px',
                          left: '12px',
                          right: '12px',
                          textAlign: 'center',
                          padding: '16px 8px',
                          border: '1px dashed var(--border)',
                          borderRadius: '10px',
                          background: 'rgba(0,0,0,0.02)'
                        }}
                      >
                        <span className="text-xs faint">No classes scheduled</span>
                      </div>
                    ) : (
                      daySessions.map(session => {
                        const pos = getSessionPosition(session);
                        const isLecture = session.sessionType === 'Lecture';

                        return (
                          <div
                            key={session.id}
                            className="tt-card"
                            onClick={() => setSelectedSession(session)}
                            style={{
                              position: 'absolute',
                              top: pos.top,
                              left: '4px',
                              right: '4px',
                              height: pos.height,
                              borderRadius: '10px',
                              padding: '8px 10px',
                              cursor: 'pointer',
                              borderLeft: isLecture ? '4px solid #0284c7' : '4px solid #5483B3',
                              borderTop: '1px solid var(--border)',
                              borderRight: '1px solid var(--border)',
                              borderBottom: '1px solid var(--border)',
                              background: 'var(--surface)',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                              overflow: 'hidden',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.zIndex = '5';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.transform = 'none';
                              e.currentTarget.style.zIndex = '1';
                            }}
                          >
                            <div>
                              <div className="row-between align-center mb-1">
                                <span
                                  className="badge no-dot"
                                  style={{
                                    fontSize: '9.5px',
                                    height: '18px',
                                    padding: '0 6px',
                                    background: isLecture ? 'rgba(2, 132, 199, 0.15)' : 'rgba(84, 131, 179, 0.15)',
                                    color: isLecture ? '#0284c7' : '#5483B3',
                                    fontWeight: 700
                                  }}
                                >
                                  {session.courseCode}
                                </span>
                                <span
                                  style={{
                                    fontSize: '9.5px',
                                    fontWeight: 650,
                                    color: isLecture ? 'var(--blue-400)' : 'var(--success-600)'
                                  }}
                                >
                                  {session.sessionType}
                                </span>
                              </div>

                              <b
                                style={{
                                  fontSize: '11.5px',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  lineHeight: 1.3,
                                  color: 'var(--text)'
                                }}
                              >
                                {session.courseName}
                              </b>
                            </div>

                            <div className="text-xs" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                              <div className="row gap-1 align-center">
                                <Icon name="clock" size="sm" />
                                <span>{session.startTime} – {session.endTime}</span>
                              </div>
                              <div className="row gap-1 align-center mt-0.5">
                                <Icon name="door" size="sm" />
                                <b>{session.room}</b>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Daily Agenda List View */}
      {viewMode === 'agenda' && (
        <div className="col gap-4">
          {/* Day Navigation Tabs */}
          <div className="row gap-2 wrap">
            {days.map(day => {
              const isSelected = selectedDayTab === day;
              const isToday = day === todayName;
              const count = filteredSessions.filter(s => s.day === day).length;

              return (
                <button
                  key={day}
                  type="button"
                  className={`btn ${isSelected ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ borderRadius: '12px', padding: '8px 16px', position: 'relative' }}
                  onClick={() => setSelectedDayTab(day)}
                >
                  <span className="fw-7">{day}</span>
                  {isToday && (
                    <span className="badge b-info no-dot ml-2" style={{ fontSize: '9px', height: '16px', padding: '0 5px' }}>
                      Today
                    </span>
                  )}
                  <span
                    className="ml-2"
                    style={{
                      background: isSelected ? 'rgba(255,255,255,0.2)' : 'var(--surface-2)',
                      padding: '2px 6px',
                      borderRadius: '10px',
                      fontSize: '11px'
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Agenda Sessions Stream for Selected Day */}
          <div className="card card-pad">
            <div className="row-between mb-4 pb-2 border-b">
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 750 }}>
                  {selectedDayTab}'s Academic Schedule
                </h3>
                <span className="text-xs muted">
                  {filteredSessions.filter(s => s.day === selectedDayTab).length} classes scheduled
                </span>
              </div>
              <span className="badge b-navy no-dot">Fall 2026 Semester</span>
            </div>

            <div className="col gap-3">
              {filteredSessions.filter(s => s.day === selectedDayTab).length === 0 ? (
                <div className="state py-8">
                  <div className="state-art info"><Icon name="calendar" size="lg" /></div>
                  <h3>No Classes on {selectedDayTab}</h3>
                  <p className="text-xs muted">You have no scheduled lectures or lab sections on this day.</p>
                </div>
              ) : (
                filteredSessions
                  .filter(s => s.day === selectedDayTab)
                  .map(session => {
                    const isLecture = session.sessionType === 'Lecture';
                    return (
                      <div
                        key={session.id}
                        className="card p-4 hover cursor-pointer"
                        style={{
                          borderLeft: isLecture ? '4px solid #0284c7' : '4px solid #5483B3',
                          background: 'var(--surface)',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => setSelectedSession(session)}
                      >
                        <div className="row-between wrap gap-2 mb-2">
                          <div className="row gap-2 align-center">
                            <span
                              className="badge no-dot"
                              style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                background: isLecture ? 'rgba(2, 132, 199, 0.15)' : 'rgba(84, 131, 179, 0.15)',
                                color: isLecture ? '#0284c7' : '#5483B3'
                              }}
                            >
                              {session.courseCode}
                            </span>
                            <b style={{ fontSize: '15px' }}>{session.courseName}</b>
                            <span className={`badge ${isLecture ? 'b-info' : 'b-navy'} no-dot`}>
                              {session.sessionType}
                            </span>
                          </div>

                          <div className="row gap-2 align-center">
                            <span className="badge b-navy no-dot row gap-1 align-center">
                              <Icon name="clock" size="sm" />
                              {session.startTime} – {session.endTime} (2 Hours)
                            </span>
                          </div>
                        </div>

                        <div className="row-between wrap gap-3 pt-2 border-t text-xs">
                          <div className="row gap-4 align-center">
                            <span className="row gap-1 align-center muted">
                              <Icon name="door" size="sm" /> Room: <b className="text-default">{session.room}</b>
                            </span>
                            <span className="row gap-1 align-center muted">
                              <Icon name="user" size="sm" /> Instructor: <b className="text-default">{session.instructor}</b>
                            </span>
                          </div>

                          <span className="row gap-1 align-center text-blue fw-6">
                            View Lecture Details <Icon name="arrowRight" size="sm" />
                          </span>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Interactive Session Details Modal */}
      {selectedSession && (
        <div className="overlay" onClick={() => setSelectedSession(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <div
                className="modal-ico"
                style={{
                  background: selectedSession.sessionType === 'Lecture' ? 'rgba(2, 132, 199, 0.18)' : 'rgba(84, 131, 179, 0.18)',
                  color: selectedSession.sessionType === 'Lecture' ? '#0284c7' : '#5483B3'
                }}
              >
                <Icon name={selectedSession.sessionType === 'Lecture' ? 'book' : 'layers'} size="lg" />
              </div>
              <div>
                <span className="badge b-navy no-dot mb-1" style={{ fontSize: '10px' }}>
                  {selectedSession.courseCode} • {selectedSession.sessionType}
                </span>
                <h3 style={{ fontSize: '17px' }}>{selectedSession.courseName}</h3>
                <p className="text-xs muted">Faculty of Computers and Artificial Intelligence, Beni Suef University</p>
              </div>
            </div>

            <div className="modal-body col gap-3">
              <div className="info-tile">
                <small>Class Schedule</small>
                <b>Every {selectedSession.day} • {selectedSession.startTime} to {selectedSession.endTime}</b>
              </div>

              <div className="grid g-2">
                <div className="info-tile">
                  <small>Campus Location</small>
                  <b className="row gap-1 align-center">
                    <Icon name="door" size="sm" /> {selectedSession.room}
                  </b>
                </div>

                <div className="info-tile">
                  <small>Academic Faculty / TA</small>
                  <b className="row gap-1 align-center">
                    <Icon name="user" size="sm" /> {selectedSession.instructor}
                  </b>
                </div>
              </div>

              <div className="card p-3" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                <b style={{ fontSize: '12.5px', display: 'block', marginBottom: '4px' }}>
                  Course AI Assistant Context:
                </b>
                <p className="text-xs muted mb-2">
                  Have questions about this course? You can chat with the PDF Study Assistant for verified lecture slide citations.
                </p>
                <a
                  href="#/student/study-assistant"
                  className="btn btn-secondary btn-sm"
                  style={{ width: 'fit-content', fontSize: '11px' }}
                >
                  <Icon name="sparkles" size="sm" /> Open Study Assistant
                </a>
              </div>
            </div>

            <div className="modal-foot">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedSession(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
