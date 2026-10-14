import React, { useState } from 'react';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';

export const DoctorEditAttendance: React.FC = () => {
  const { showToast } = useAuth();
  const [currentStatus] = useState('Absent');
  const [newStatus, setNewStatus] = useState('Excused');
  const [reason, setReason] = useState('Official hospital excuse letter approved by Student Affairs Dean Office.');
  const [auditLog, setAuditLog] = useState<any[]>([
    { timestamp: 'Oct 14, 10:15 AM', actor: 'Automated QR Engine', change: 'Marked Absent upon Session Close' }
  ]);

  const handleSaveAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      showToast('A formal regulatory reason is required for attendance modification.', 'error');
      return;
    }
    const newEntry = {
      timestamp: 'Just now',
      actor: 'Dr. Mona Abdelrahman (Doctor)',
      change: `Changed status from ${currentStatus} to ${newStatus}. Reason: ${reason}`
    };
    setAuditLog(prev => [newEntry, ...prev]);
    showToast('Attendance record corrected and signed into immutable audit trail.', 'success');
  };

  return (
    <div>
      <PageHead
        title="Screen 60: Auditable Attendance Record Correction"
        subtitle="Amend session attendance with regulatory audit trail logging"
        breadcrumbs={[
          { label: 'Doctor Portal', href: '#/doctor/dashboard' },
          { label: 'Attendance Review', href: '#/doctor/attendance-review' },
          { label: 'Edit Record' }
        ]}
      />

      <div className="grid g-3 mb-6" style={{ maxWidth: '880px' }}>
        <div className="col-span-2">
          <div className="card p-5 mb-5">
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px' }}>
              Student Session Record
            </h3>
            <div className="stack gap-3 text-sm mb-4">
              <div className="row-between pb-2 border-b">
                <span className="sub">Student:</span>
                <strong>Hana Mostafa Kamal (2021170078)</strong>
              </div>
              <div className="row-between pb-2 border-b">
                <span className="sub">Course Session:</span>
                <strong>CS301 · Lecture 6 (Today, Hall A-101)</strong>
              </div>
              <div className="row-between">
                <span className="sub">Recorded Status:</span>
                <span className="badge badge-danger">{currentStatus}</span>
              </div>
            </div>

            <form onSubmit={handleSaveAudit}>
              <div className="form-group mb-3">
                <label className="form-label">New Corrected Status</label>
                <select
                  className="select"
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value)}
                >
                  <option value="Present">Present</option>
                  <option value="Late">Late</option>
                  <option value="Excused">Excused (Dean Approved)</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>

              <div className="form-group mb-4">
                <label className="form-label">Mandatory Audit Justification Reason</label>
                <textarea
                  className="textarea"
                  rows={3}
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  required
                />
              </div>

              <div className="row-between pt-3 border-t">
                <a href="#/doctor/attendance-review" className="btn btn-secondary">Cancel</a>
                <button type="submit" className="btn btn-primary">
                  <Icon name="checkCircle" /> Commit Auditable Correction
                </button>
              </div>
            </form>
          </div>
        </div>

        <div>
          {/* Audit Trail */}
          <div className="card p-5">
            <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Immutable Audit Log</h4>
            <div className="stack gap-3">
              {auditLog.map((log, idx) => (
                <div key={idx} className="card p-3 border" style={{ background: 'var(--color-bg-page)' }}>
                  <div className="sub text-xs mb-1">{log.timestamp} · <strong>{log.actor}</strong></div>
                  <div className="text-xs">{log.change}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
