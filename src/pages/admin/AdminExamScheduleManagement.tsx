import React, { useState } from 'react';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';

export const AdminExamScheduleManagement: React.FC = () => {
  const { showToast } = useAuth();
  const [examTypeFilter, setExamTypeFilter] = useState('Midterm');
  const [generatingSeating, setGeneratingSeating] = useState(false);

  const [schedule, setSchedule] = useState([
    {
      id: 'ex_slot_1',
      date: 'Sun, Oct 25, 2026',
      time: '10:00 – 11:30 AM',
      course: 'CS301 · Design & Analysis of Algorithms',
      venues: 'Hall A-101 & Hall B-202',
      enrolled: 64,
      seatsAllocated: 'A1-01 to A1-32, B2-01 to B2-32',
      chiefProctor: 'Dr. Mona Abdelrahman',
      taProctors: 'Eng. Youssef Khaled, Eng. Nour Hesham',
      type: 'Midterm',
      status: 'Finalized'
    },
    {
      id: 'ex_slot_2',
      date: 'Tue, Oct 27, 2026',
      time: '10:00 – 11:30 AM',
      course: 'AI302 · Machine Learning Fundamentals',
      venues: 'Hall A-101',
      enrolled: 62,
      seatsAllocated: 'A1-01 to A1-62',
      chiefProctor: 'Dr. Khaled Elsayed',
      taProctors: 'Eng. Nour Hesham',
      type: 'Midterm',
      status: 'Finalized'
    },
    {
      id: 'ex_slot_3',
      date: 'Thu, Oct 29, 2026',
      time: '12:00 – 01:30 PM',
      course: 'IS305 · Database Systems II',
      venues: 'Hall B-204',
      enrolled: 58,
      seatsAllocated: 'B4-01 to B4-58',
      chiefProctor: 'Dr. Hanan Fouad',
      taProctors: 'Eng. Omar Tamer',
      type: 'Midterm',
      status: 'Finalized'
    },
    {
      id: 'ex_slot_4',
      date: 'Sun, Nov 01, 2026',
      time: '10:00 – 11:30 AM',
      course: 'CS305 · Operating Systems Internals',
      venues: 'Hall C-303',
      enrolled: 60,
      seatsAllocated: 'C3-01 to C3-60',
      chiefProctor: 'Dr. Mona Abdelrahman',
      taProctors: 'Eng. Youssef Khaled',
      type: 'Midterm',
      status: 'Finalized'
    }
  ]);

  const handleGenerateSeating = async () => {
    setGeneratingSeating(true);
    await new Promise(r => setTimeout(r, 600));
    setGeneratingSeating(false);
    showToast('Seating allocation matrix generated and barcoded cards dispatched to student portals.', 'success');
  };

  const filtered = schedule.filter(s => s.type === examTypeFilter);

  return (
    <div>
      <PageHead
        title="Screen 98: Master Examination Timetable & Seating Coordination"
        subtitle="Manage faculty examination hall distribution, assign proctoring committees, and generate barcoded seating numbers"
        breadcrumbs={[
          { label: 'College Admin', href: '#/admin/dashboard' },
          { label: 'Screen 92: Exam Operations', href: '#/admin/exam-management' },
          { label: 'Screen 98: Master Exam Timetable' }
        ]}
        actions={
          <div className="row gap-2">
            <button className="btn btn-secondary" onClick={() => showToast('Exporting master hall exam timetable to PDF.', 'info')}>
              <Icon name="download" /> Export PDF Schedule
            </button>
            <button className="btn btn-primary" onClick={handleGenerateSeating} disabled={generatingSeating}>
              <Icon name="users" /> {generatingSeating ? 'Generating Seating...' : 'Auto-Allocate Seating Numbers'}
            </button>
          </div>
        }
      />

      {/* Filter Tabs */}
      <div className="tabs mb-4">
        {['Midterm', 'Practical', 'Final'].map(t => (
          <button
            key={t}
            className={`tab ${examTypeFilter === t ? 'active' : ''}`}
            onClick={() => setExamTypeFilter(t)}
          >
            {t} Examination Timetable
          </button>
        ))}
      </div>

      {/* Schedule Table */}
      <div className="card overflow-hidden">
        <div className="card-head">
          <div className="row-between">
            <h3>{examTypeFilter} Hall Examination Timetable</h3>
            <span className="badge badge-primary">{filtered.length} Scheduled Sessions</span>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Date &amp; Time Slot</th>
                <th>Course Offering</th>
                <th>Assigned Hall(s)</th>
                <th className="text-center">Enrolled</th>
                <th>Allocated Seating Numbers</th>
                <th>Proctoring Committee</th>
                <th className="text-center">Status</th>
                <th style={{ width: '120px' }} className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td>
                    <div className="bold">{s.date}</div>
                    <span className="text-xs sub font-mono"><Icon name="clock" size="sm" /> {s.time}</span>
                  </td>
                  <td>
                    <div className="bold text-sm">{s.course}</div>
                    <code className="text-xs sub">{s.id}</code>
                  </td>
                  <td>
                    <span className="badge badge-ice">{s.venues}</span>
                  </td>
                  <td className="text-center bold text-primary">
                    {s.enrolled} Students
                  </td>
                  <td>
                    <code className="text-xs">{s.seatsAllocated}</code>
                  </td>
                  <td>
                    <div className="bold text-xs">{s.chiefProctor}</div>
                    <div className="text-xs sub">{s.taProctors}</div>
                  </td>
                  <td className="text-center">
                    <span className="badge badge-success">{s.status}</span>
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => showToast(`Printing door sign notice for ${s.venues}`, 'info')}
                    >
                      <Icon name="file" size="sm" /> Door Notice
                    </button>
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
