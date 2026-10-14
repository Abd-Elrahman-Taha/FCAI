import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

export const DoctorSchedule: React.FC = () => {
  const { showToast } = useAuth();
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fakeApi.getInstructorSchedule().then(res => {
      setSchedule(res);
      setLoading(false);
    });
  }, []);

  if (loading) return <CardSkeleton count={4} />;

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

  // Office hours static/mock blocks
  const officeHours = [
    { day: 'Sunday', time: '12:30 – 14:00', room: 'Faculty Office B-314', note: 'Drop-in Student Academic Advising' },
    { day: 'Tuesday', time: '12:30 – 14:00', room: 'Faculty Office B-314', note: 'Senior Project Supervision' }
  ];

  return (
    <div>
      <PageHead
        title="Screen 66: Instructor Academic Timetable & Office Hours"
        subtitle="Dr. Mona Abdelrahman · Fall 2026/2027 Academic Schedule"
        breadcrumbs={[
          { label: 'Doctor Portal', href: '#/doctor/dashboard' },
          { label: 'Screen 66: Doctor Schedule' }
        ]}
        actions={
          <div className="row gap-2">
            <button className="btn btn-secondary" onClick={() => showToast('Exported timetable to Apple/Google iCal (.ics) format.', 'info')}>
              <Icon name="download" /> Export to iCal
            </button>
            <a href="#/doctor/attendance-session" className="btn btn-primary">
              <Icon name="qr" /> Start Today's QR Attendance
            </a>
          </div>
        }
      />

      {/* Overview Cards */}
      <div className="grid g-3 mb-4">
        <div className="card p-3">
          <div className="text-xs sub bold">Weekly Teaching Hours</div>
          <div className="h3 bold text-primary mt-1">6 <span className="text-xs sub">Credit Lecture Hours</span></div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Weekly Office Hours</div>
          <div className="h3 bold text-info mt-1">3 <span className="text-xs sub">Office Hours (B-314)</span></div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Assigned Lecture Halls</div>
          <div className="h3 bold text-success mt-1">Hall A-101, Hall C-303</div>
        </div>
      </div>

      {/* Day by Day Cards */}
      <div className="stack gap-4">
        {days.map(day => {
          const dayLectures = schedule.filter(s => s.day === day);
          const dayOffice = officeHours.filter(o => o.day === day);
          const hasEvents = dayLectures.length > 0 || dayOffice.length > 0;

          return (
            <div key={day} className="card p-4">
              <div className="row-between mb-3 border-b pb-2">
                <h3 className="bold text-primary">{day}</h3>
                <span className="badge badge-neutral">
                  {hasEvents ? `${dayLectures.length} Lectures · ${dayOffice.length} Office Hours` : 'No Scheduled Classes'}
                </span>
              </div>

              {!hasEvents ? (
                <div className="text-sm sub py-2">No lecture or lab commitments scheduled on {day}. Dedicated research &amp; grading day.</div>
              ) : (
                <div className="stack gap-3">
                  {dayLectures.map((lec, idx) => (
                    <div key={idx} className="card p-3" style={{ background: 'var(--color-bg-page)', borderLeft: '4px solid var(--color-primary)' }}>
                      <div className="row-between wrap gap-2">
                        <div>
                          <div className="row gap-2 mb-1">
                            <span className="badge badge-primary">{lec.course}</span>
                            <span className="badge badge-neutral"><Icon name="clock" size="sm" /> {lec.time}</span>
                            <span className="badge badge-ice"><Icon name="mapPin" size="sm" /> {lec.room}</span>
                          </div>
                          <div className="text-sm bold mt-1">Undergraduate Lecture Session · 64 Enrolled</div>
                        </div>

                        <div className="row gap-2">
                          <a href="#/doctor/attendance-session" className="btn btn-ice btn-sm">
                            <Icon name="qr" /> Launch QR (Screen 56)
                          </a>
                          <a href="#/doctor/course-content" className="btn btn-secondary btn-sm">
                            <Icon name="book" /> Materials
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}

                  {dayOffice.map((off, idx) => (
                    <div key={`off_${idx}`} className="card p-3" style={{ background: 'var(--color-bg-page)', borderLeft: '4px solid var(--color-info)' }}>
                      <div className="row-between wrap gap-2">
                        <div>
                          <div className="row gap-2 mb-1">
                            <span className="badge badge-info">Office Hours</span>
                            <span className="badge badge-neutral"><Icon name="clock" size="sm" /> {off.time}</span>
                            <span className="badge badge-neutral"><Icon name="mapPin" size="sm" /> {off.room}</span>
                          </div>
                          <div className="text-sm mt-1">{off.note}</div>
                        </div>
                        <span className="text-xs sub">Open to all students</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
