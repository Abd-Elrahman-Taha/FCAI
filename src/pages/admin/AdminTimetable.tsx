import React, { useState } from 'react';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';

export const AdminTimetable: React.FC = () => {
  const { showToast } = useAuth();
  const [dayFilter, setDayFilter] = useState('All');
  const [hallFilter, setHallFilter] = useState('All');

  const sessions = [
    { id: 't1', day: 'Sunday', time: '10:00 – 12:00', course: 'CS301 · Algorithms', type: 'Lecture', doctor: 'Dr. Mona Abdelrahman', room: 'Hall A-101', level: 'Level 3', conflict: false },
    { id: 't2', day: 'Sunday', time: '12:00 – 14:00', course: 'CS301 · Section S1', type: 'Lab', doctor: 'Eng. Youssef Khaled', room: 'Lab 3-West', level: 'Level 3', conflict: false },
    { id: 't3', day: 'Monday', time: '08:00 – 10:00', course: 'IS305 · Databases II', type: 'Lecture', doctor: 'Dr. Samy Mahmoud', room: 'Hall B-202', level: 'Level 3', conflict: false },
    { id: 't4', day: 'Tuesday', time: '10:00 – 12:00', course: 'AI302 · Machine Learning', type: 'Lecture', doctor: 'Dr. Rania Ezzat', room: 'Hall A-101', level: 'Level 3', conflict: false },
    { id: 't5', day: 'Wednesday', time: '12:00 – 14:00', course: 'CS305 · Operating Systems', type: 'Lecture', doctor: 'Dr. Mona Abdelrahman', room: 'Hall C-303', level: 'Level 3', conflict: false },
    { id: 't6', day: 'Thursday', time: '10:00 – 12:00', course: 'IT303 · Computer Networks', type: 'Lecture', doctor: 'Dr. Tarek Fathy', room: 'Hall B-202', level: 'Level 3', conflict: false }
  ];

  const filtered = sessions.filter(s => {
    if (dayFilter !== 'All' && s.day !== dayFilter) return false;
    if (hallFilter !== 'All' && s.room !== hallFilter) return false;
    return true;
  });

  return (
    <div>
      <PageHead
        title="Faculty Master Timetable &amp; Schedule Conflict Matrix"
        subtitle="Manage lecture hall bookings, section lab slots, and automated conflict detection"
        breadcrumbs={[
          { label: 'College Admin', href: '#/admin/dashboard' },
          { label: 'Timetable' }
        ]}
        actions={
          <div className="row gap-2">
            <button className="btn btn-secondary" onClick={() => showToast('No scheduling conflicts detected across faculty rooms', 'success')}>
              <Icon name="checkCircle" /> Run Conflict Check
            </button>
            <button className="btn btn-primary" onClick={() => showToast('Timetable PDF generated', 'info')}>
              <Icon name="download" /> Export Master PDF
            </button>
          </div>
        }
      />

      {/* Conflict Status Banner */}
      <div className="alert alert-success mb-5">
        <Icon name="checkCircle" />
        <div>
          <strong>Conflict Detection Engine:</strong> Zero overlapping bookings detected across 4 Lecture Halls and 6 Computer Labs for Fall 2026.
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card p-4 mb-5">
        <div className="row-between wrap gap-2">
          <div className="row gap-2">
            <select className="select" value={dayFilter} onChange={e => setDayFilter(e.target.value)}>
              <option value="All">All Weekdays (Sun–Thu)</option>
              <option value="Sunday">Sunday</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
            </select>
            <select className="select" value={hallFilter} onChange={e => setHallFilter(e.target.value)}>
              <option value="All">All Halls &amp; Labs</option>
              <option value="Hall A-101">Hall A-101</option>
              <option value="Hall B-202">Hall B-202</option>
              <option value="Hall C-303">Hall C-303</option>
              <option value="Lab 3-West">Lab 3-West</option>
            </select>
          </div>
          <div className="chip chip-info">{filtered.length} Scheduled Sessions</div>
        </div>
      </div>

      {/* Timetable Calendar Grid */}
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Time Slot</th>
                <th>CourseOffering</th>
                <th>Session Type</th>
                <th>Instructor / TA</th>
                <th>Assigned Space</th>
                <th>Target Level</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td className="bold">{s.day}</td>
                  <td><code>{s.time}</code></td>
                  <td className="bold">{s.course}</td>
                  <td>
                    <span className={`badge ${s.type === 'Lecture' ? 'badge-primary' : 'badge-info'}`}>
                      {s.type}
                    </span>
                  </td>
                  <td>{s.doctor}</td>
                  <td><span className="badge badge-neutral">{s.room}</span></td>
                  <td>{s.level}</td>
                  <td>
                    <span className="badge badge-success">
                      <Icon name="checkCircle" size="sm" /> Valid
                    </span>
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
