import React, { useState } from 'react';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';

export const DoctorAttendanceSession: React.FC = () => {
  const { showToast } = useAuth();
  const [course, setCourse] = useState('CS301');
  const [section, setSection] = useState('Lecture (All Sections)');
  const [durationMins, setDurationMins] = useState(15);
  const [mode, setMode] = useState<'qr' | 'manual'>('qr');

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Attendance session launched for ${course}!`, 'success');
    if (mode === 'qr') {
      window.location.hash = '#/doctor/attendance-qr';
    } else {
      window.location.hash = '#/doctor/attendance-manual';
    }
  };

  return (
    <div>
      <PageHead
        title="Screen 56: Initialize Attendance Session"
        subtitle="Configure attendance parameters, select course session, duration, and verification mode"
        breadcrumbs={[
          { label: 'Doctor Portal', href: '#/doctor/dashboard' },
          { label: 'Attendance', href: '#/doctor/attendance' },
          { label: 'Start Session' }
        ]}
      />

      <div className="card p-6 mb-6" style={{ maxWidth: '720px' }}>
        <form onSubmit={handleStart}>
          <div className="grid g-2 mb-3">
            <div className="form-group">
              <label className="form-label">CourseOffering</label>
              <select className="select" value={course} onChange={e => setCourse(e.target.value)}>
                <option value="CS301">CS301 · Design &amp; Analysis of Algorithms</option>
                <option value="CS305">CS305 · Operating Systems Internals</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Target Audience / Cohort</label>
              <select className="select" value={section} onChange={e => setSection(e.target.value)}>
                <option value="Lecture (All Sections)">Main Lecture (All 64 Enrolled)</option>
                <option value="Section S1">Section S1 Only</option>
                <option value="Section S2">Section S2 Only</option>
                <option value="Section S3">Section S3 Only</option>
              </select>
            </div>
          </div>

          <div className="grid g-2 mb-4">
            <div className="form-group">
              <label className="form-label">Session Duration (Minutes)</label>
              <input
                type="number"
                className="input"
                value={durationMins}
                onChange={e => setDurationMins(parseInt(e.target.value) || 10)}
                min={5}
                max={120}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Verification Mode</label>
              <select className="select" value={mode} onChange={e => setMode(e.target.value as any)}>
                <option value="qr">Dynamic Rotating QR (5-second Token Refresh)</option>
                <option value="manual">Manual Instructor Attendance Call</option>
              </select>
            </div>
          </div>

          <div className="alert alert-info mb-5">
            <Icon name="info" />
            <div>
              <strong>75% Deprivation Policy:</strong> Attendance recorded in this session directly affects students' examination eligibility. Students who miss &ge; 25% of lectures will be flagged for deprivation.
            </div>
          </div>

          <div className="row-end gap-2">
            <a href="#/doctor/dashboard" className="btn btn-secondary">Cancel</a>
            <button type="submit" className="btn btn-primary">
              <Icon name="qr" /> Launch Attendance Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
