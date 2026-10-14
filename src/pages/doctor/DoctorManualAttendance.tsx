import React, { useState } from 'react';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';

export const DoctorManualAttendance: React.FC = () => {
  const { showToast } = useAuth();
  const [students, setStudents] = useState([
    { code: '2021170045', name: 'Ahmed Mohamed Hassan', status: 'Present', note: '' },
    { code: '2021170112', name: 'Mariam Ahmed Saeed', status: 'Present', note: '' },
    { code: '2022170033', name: 'Omar Khaled Fathy', status: 'Late', note: 'Traffic hold' },
    { code: '2021170078', name: 'Hana Mostafa Kamal', status: 'Absent', note: 'No show' },
    { code: '2023170501', name: 'Youssef Ibrahim Nabil', status: 'Excused', note: 'Hospital medical certificate' }
  ]);

  const handleStatusChange = (code: string, newStatus: string) => {
    setStudents(prev => prev.map(s => s.code === code ? { ...s, status: newStatus } : s));
  };

  const handleNoteChange = (code: string, note: string) => {
    setStudents(prev => prev.map(s => s.code === code ? { ...s, note } : s));
  };

  const handleSave = () => {
    showToast('Manual attendance records successfully committed to session!', 'success');
    window.location.hash = '#/doctor/attendance-review';
  };

  return (
    <div>
      <PageHead
        title="Screen 59: Fallback Manual Attendance Entry"
        subtitle="Manual instructor override for students with phone camera failure or excused permits"
        breadcrumbs={[
          { label: 'Doctor Portal', href: '#/doctor/dashboard' },
          { label: 'Attendance', href: '#/doctor/attendance' },
          { label: 'Manual Entry' }
        ]}
        actions={
          <button className="btn btn-primary" onClick={handleSave}>
            <Icon name="checkCircle" /> Save Manual Attendance
          </button>
        }
      />

      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Student Code</th>
                <th>Full Name</th>
                <th>Attendance State</th>
                <th>Justification / Instructor Note</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.code}>
                  <td><code>{s.code}</code></td>
                  <td className="bold">{s.name}</td>
                  <td>
                    <select
                      className="select"
                      style={{ width: '130px', padding: '4px 8px', fontSize: '13px' }}
                      value={s.status}
                      onChange={e => handleStatusChange(s.code, e.target.value)}
                    >
                      <option value="Present">Present</option>
                      <option value="Late">Late</option>
                      <option value="Absent">Absent</option>
                      <option value="Excused">Excused</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      className="input"
                      placeholder="Add reason for Late/Excused..."
                      value={s.note}
                      onChange={e => handleNoteChange(s.code, e.target.value)}
                    />
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
