import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import type { TimetableSession } from '../../types';

export const StudentTimetable: React.FC = () => {
  const [sessions, setSessions] = useState<TimetableSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [courseFilter, setCourseFilter] = useState('ALL');
  const [activeWeekOffset, setActiveWeekOffset] = useState(0);

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

  const uniqueCourses = Array.from(new Set(sessions.map(s => s.courseCode)));

  const filteredSessions = sessions.filter(s =>
    courseFilter === 'ALL' ? true : s.courseCode === courseFilter
  );

  return (
    <div>
      <PageHead
        title="Weekly Academic Timetable"
        desc="Interactive lecture and lab section schedule for Fall Semester 2026."
        crumbs={[['Student Portal', '#/student/dashboard'], ['Timetable']]}
        actions={
          <div className="row gap-2">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setActiveWeekOffset(0)}
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
            <span className="text-xs fw-6 px-2">
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
          </div>
        }
      />

      {/* Filter Row */}
      <div className="toolbar row-between mb-4">
        <div className="row gap-2">
          <span className="text-xs muted">Filter Course:</span>
          <select
            className="select"
            style={{ width: '220px', height: '36px', fontSize: '13px' }}
            value={courseFilter}
            onChange={e => setCourseFilter(e.target.value)}
          >
            <option value="ALL">All Registered Courses ({sessions.length})</option>
            {uniqueCourses.map(code => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
        </div>

        <div className="row gap-3 text-xs muted hide-m">
          <span className="legend"><i style={{ background: '#e3f3ff', border: '1px solid #052659' }}></i> Lecture</span>
          <span className="legend"><i style={{ background: '#e9e6fb', border: '1px solid #5b4bc4' }}></i> Section / Lab</span>
        </div>
      </div>

      {/* Timetable Grid View */}
      <div className="card" style={{ overflowX: 'auto' }}>
        <div className="grid g-5" style={{ minWidth: '880px', padding: '16px' }}>
          {days.map(day => {
            const daySessions = filteredSessions.filter(s => s.day === day);
            const isToday = day === 'Sunday'; // Demo is Sunday

            return (
              <div key={day} className="col gap-3">
                <div
                  className={`tt-head ${isToday ? 'today' : ''}`}
                  style={{ borderRadius: '10px', background: isToday ? 'var(--blue-100)' : 'var(--surface-2)' }}
                >
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.05em' }}>{day}</span>
                  <b>{isToday ? 'Today' : ''}</b>
                </div>

                <div className="col gap-3">
                  {daySessions.length === 0 ? (
                    <div className="card text-center py-6" style={{ background: 'var(--surface-2)', borderStyle: 'dashed' }}>
                      <span className="text-xs faint">No classes</span>
                    </div>
                  ) : (
                    daySessions.map(session => (
                      <div
                        key={session.id}
                        className={`tt-ev ${session.colorClass}`}
                        style={{ position: 'relative', left: 0, right: 0 }}
                      >
                        <div className="row-between mb-1">
                          <span className="badge b-navy no-dot" style={{ fontSize: '10px', height: '18px', padding: '0 6px' }}>
                            {session.courseCode}
                          </span>
                          <span className="badge b-info no-dot" style={{ fontSize: '10px', height: '18px', padding: '0 6px' }}>
                            {session.sessionType}
                          </span>
                        </div>
                        <b>{session.courseName}</b>
                        <span><Icon name="clock" size="sm" className="inline-block" /> {session.startTime} – {session.endTime}</span>
                        <span><Icon name="door" size="sm" className="inline-block" /> {session.room}</span>
                        <span className="muted"><Icon name="user" size="sm" className="inline-block" /> {session.instructor}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
