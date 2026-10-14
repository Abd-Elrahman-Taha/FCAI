import React, { useState } from 'react';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';

export const TaDiscussionsSchedule: React.FC = () => {
  const { showToast } = useAuth();
  const [activeTab, setActiveTab] = useState<'schedule' | 'discussions'>('schedule');

  // Weekly schedule
  const weeklySchedule = [
    { day: 'Sunday', time: '12:00 – 14:00', course: 'CS301 · Algorithms', section: 'Section S1', room: 'Lab 3-West', type: 'Practical Lab' },
    { day: 'Monday', time: '10:00 – 12:00', course: 'AI302 · Machine Learning', section: 'Section S2', room: 'Lab 2-East', type: 'Practical Lab' },
    { day: 'Monday', time: '13:00 – 14:30', course: 'General Helpdesk', section: 'All Sections', room: 'TA Office Room C-104', type: 'Student Support & Q&A' },
    { day: 'Tuesday', time: '12:00 – 14:00', course: 'CS301 · Algorithms', section: 'Section S3', room: 'Lab 3-West', type: 'Practical Lab' },
    { day: 'Wednesday', time: '11:00 – 12:30', course: 'CS301 Lab Advising', section: 'Section S1 & S3', room: 'Lab 3-West', type: 'Coding Office Hours' }
  ];

  // Student discussion / questions queue
  const [questions, setQuestions] = useState([
    { id: 'q1', student: 'Ahmed Mohamed Hassan', code: '2021170045', course: 'CS301 · S3', topic: 'Knapsack 0/1 space complexity optimization to 1D array', time: '2 hours ago', answered: true },
    { id: 'q2', student: 'Mariam Ahmed Saeed', code: '2021170112', course: 'AI302 · S2', topic: 'Gradient descent learning rate divergence on test set', time: '3 hours ago', answered: false },
    { id: 'q3', student: 'Omar Khaled Fathy', code: '2022170033', course: 'CS301 · S3', topic: 'Clarification on matrix dimensions for Strassen algorithm', time: 'Yesterday', answered: true }
  ]);

  const handleToggleAnswer = (id: string) => {
    setQuestions(prev =>
      prev.map(q => q.id === id ? { ...q, answered: !q.answered } : q)
    );
    showToast('Discussion question status updated.', 'info');
  };

  return (
    <div>
      <PageHead
        title="Screen 72: TA Lab Timetable & Student Support Hours"
        subtitle="Eng. Youssef Khaled · Weekly practical teaching schedule & lab discussion support"
        breadcrumbs={[
          { label: 'TA Portal', href: '#/ta/dashboard' },
          { label: 'Sections', href: '#/ta/sections' },
          { label: 'Screen 72: Schedule & Support' }
        ]}
        actions={
          <div className="row gap-2">
            <button className="btn btn-secondary" onClick={() => showToast('Exported TA schedule to iCal.', 'info')}>
              <Icon name="download" /> Export iCal
            </button>
            <a href="#/ta/attendance" className="btn btn-primary">
              <Icon name="qr" /> Launch Lab Session (Screen 71)
            </a>
          </div>
        }
      />

      {/* Tabs */}
      <div className="tabs mb-4">
        <button
          className={`tab ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          <Icon name="calendar" size="sm" /> Weekly Lab Timetable
        </button>
        <button
          className={`tab ${activeTab === 'discussions' ? 'active' : ''}`}
          onClick={() => setActiveTab('discussions')}
        >
          <Icon name="message" size="sm" /> Student Practical Q&amp;A ({questions.filter(q => !q.answered).length} Pending)
        </button>
      </div>

      {activeTab === 'schedule' ? (
        <div className="stack gap-3">
          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'].map(day => {
            const sessions = weeklySchedule.filter(w => w.day === day);
            return (
              <div key={day} className="card p-4">
                <div className="row-between mb-3 border-b pb-2">
                  <h3 className="bold text-primary">{day}</h3>
                  <span className="badge badge-neutral">{sessions.length} Scheduled Sessions</span>
                </div>

                {sessions.length === 0 ? (
                  <div className="text-sm sub py-2">No practical labs assigned on {day}. Preparation &amp; grading time.</div>
                ) : (
                  <div className="stack gap-2">
                    {sessions.map((s, idx) => (
                      <div key={idx} className="card p-3" style={{ background: 'var(--color-bg-page)', borderLeft: '4px solid var(--color-primary)' }}>
                        <div className="row-between wrap gap-2">
                          <div>
                            <div className="row gap-2 mb-1">
                              <span className="badge badge-primary">{s.course}</span>
                              <span className="badge badge-neutral">{s.section}</span>
                              <span className="badge badge-ice">{s.room}</span>
                            </div>
                            <div className="text-sm bold mt-1">{s.type} · {s.time}</div>
                          </div>

                          <div className="row gap-2">
                            <a href="#/ta/attendance" className="btn btn-ice btn-sm">
                              <Icon name="qr" /> QR Attendance
                            </a>
                            <a href="#/ta/section-enrolled" className="btn btn-secondary btn-sm">
                              <Icon name="users" /> Roster (Screen 68)
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card p-4">
          <div className="row-between mb-3 border-b pb-2">
            <h3>Student Practical Discussions &amp; Support Requests</h3>
            <span className="badge badge-neutral">{questions.length} Questions</span>
          </div>

          <div className="stack gap-3">
            {questions.map(q => (
              <div key={q.id} className="card p-3" style={{ background: 'var(--color-bg-page)' }}>
                <div className="row-between wrap gap-2 mb-2">
                  <div className="row gap-2">
                    <span className="bold text-sm">{q.student}</span>
                    <span className="badge badge-neutral"><code>{q.code}</code></span>
                    <span className="badge badge-primary">{q.course}</span>
                    <span className="text-xs sub">{q.time}</span>
                  </div>
                  <button
                    className={`btn btn-sm ${q.answered ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={() => handleToggleAnswer(q.id)}
                  >
                    {q.answered ? 'Mark as Pending' : 'Mark Resolved'}
                  </button>
                </div>

                <p className="text-sm sub mb-2">
                  <strong>Question:</strong> {q.topic}
                </p>

                <div className="row-between text-xs sub">
                  <span>Status: <strong>{q.answered ? '✅ Resolved in Lab Session' : '⏳ Awaiting TA Response'}</strong></span>
                  <button
                    className="btn btn-neutral btn-sm"
                    onClick={() => showToast(`Reply composer opened for ${q.student}`, 'info')}
                  >
                    <Icon name="send" size="sm" /> Reply via Chat
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
