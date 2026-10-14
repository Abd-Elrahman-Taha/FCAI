import React, { useState } from 'react';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';

export const AdminPermissions: React.FC = () => {
  const { showToast } = useAuth();
  const [selectedRole, setSelectedRole] = useState('employee');
  const [saving, setSaving] = useState(false);

  // Permission modules matrix
  const [matrix, setMatrix] = useState<Record<string, Record<string, boolean>>>({
    student: {
      'courses.viewCatalog': true,
      'courses.register': true,
      'courses.drop': true,
      'attendance.qrCheckin': true,
      'attendance.viewRecords': true,
      'grades.viewPublished': true,
      'grades.enterDraft': false,
      'grades.approve': false,
      'fees.viewBalances': true,
      'fees.payOnline': true,
      'fees.generateInvoices': false,
      'exams.takeOnline': true,
      'exams.createBanks': false,
      'admin.manageUsers': false
    },
    doctor: {
      'courses.viewCatalog': true,
      'courses.register': false,
      'courses.drop': false,
      'attendance.qrCheckin': false,
      'attendance.viewRecords': true,
      'attendance.startSession': true,
      'attendance.manualOverride': true,
      'grades.viewPublished': true,
      'grades.enterDraft': true,
      'grades.submitPackage': true,
      'grades.approve': false,
      'fees.viewBalances': false,
      'fees.payOnline': false,
      'fees.generateInvoices': false,
      'exams.takeOnline': false,
      'exams.createBanks': true,
      'exams.buildExams': true,
      'admin.manageUsers': false
    },
    ta: {
      'courses.viewCatalog': true,
      'courses.register': false,
      'courses.drop': false,
      'attendance.qrCheckin': false,
      'attendance.viewRecords': true,
      'attendance.startSession': true,
      'attendance.manualOverride': true,
      'grades.viewPublished': false,
      'grades.enterDraft': true,
      'grades.submitPackage': false,
      'grades.approve': false,
      'fees.viewBalances': false,
      'fees.payOnline': false,
      'fees.generateInvoices': false,
      'exams.takeOnline': false,
      'exams.createBanks': false,
      'exams.gradePractical': true,
      'admin.manageUsers': false
    },
    employee: {
      'courses.viewCatalog': true,
      'courses.register': false,
      'courses.drop': false,
      'attendance.qrCheckin': false,
      'attendance.viewRecords': true,
      'attendance.startSession': false,
      'attendance.manualOverride': false,
      'grades.viewPublished': true,
      'grades.enterDraft': false,
      'grades.submitPackage': false,
      'grades.approve': false,
      'fees.viewBalances': true,
      'fees.payOnline': false,
      'fees.generateInvoices': true,
      'serviceRequests.process': true,
      'exams.takeOnline': false,
      'exams.createBanks': false,
      'admin.manageUsers': false
    },
    admin: {
      'courses.viewCatalog': true,
      'courses.register': true,
      'courses.drop': true,
      'attendance.qrCheckin': true,
      'attendance.viewRecords': true,
      'attendance.startSession': true,
      'attendance.manualOverride': true,
      'grades.viewPublished': true,
      'grades.enterDraft': true,
      'grades.submitPackage': true,
      'grades.approve': true,
      'fees.viewBalances': true,
      'fees.payOnline': true,
      'fees.generateInvoices': true,
      'exams.takeOnline': true,
      'exams.createBanks': true,
      'exams.buildExams': true,
      'admin.manageUsers': true
    }
  });

  const handleToggle = (role: string, permKey: string) => {
    setMatrix(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permKey]: !prev[role]?.[permKey]
      }
    }));
  };

  const handleSavePolicy = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    setSaving(false);
    showToast(`Role access control policies for ${selectedRole.toUpperCase()} saved.`, 'success');
  };

  const permissionsList = [
    { key: 'courses.viewCatalog', name: 'Course Catalog Browsing', category: 'Academic & Courses', desc: 'Allow browsing courses, syllabi, and prerequisites' },
    { key: 'courses.register', name: 'Course Enrollment & Registration', category: 'Academic & Courses', desc: 'Allow adding course offerings during open registration period' },
    { key: 'courses.drop', name: 'Course Drop Operations', category: 'Academic & Courses', desc: 'Allow withdrawing from enrolled course offering' },
    { key: 'attendance.qrCheckin', name: 'Student QR Check-in', category: 'Attendance Operations', desc: 'Scan live session QR codes using mobile camera or web' },
    { key: 'attendance.startSession', name: 'Launch Attendance Session', category: 'Attendance Operations', desc: 'Generate rotating dynamic QR code and geofence beacon' },
    { key: 'attendance.manualOverride', name: 'Manual Attendance Override', category: 'Attendance Operations', desc: 'Manually mark students as Present, Late, or Absent' },
    { key: 'grades.enterDraft', name: 'Gradebook Marks Entry', category: 'Grading & Examination', desc: 'Input midterm, coursework, practical, and final exam marks' },
    { key: 'grades.submitPackage', name: 'Submit Grade Package', category: 'Grading & Examination', desc: 'Formally transmit course offering grade package to Dean office' },
    { key: 'grades.approve', name: 'Final Grade Approval & Publishing', category: 'Grading & Examination', desc: 'Dean Executive approval authority to lock and publish grades' },
    { key: 'fees.generateInvoices', name: 'Batch Student Fee Assessment', category: 'Financial & Billing', desc: 'Execute idempotent tuition and lab fee generation engine' },
    { key: 'admin.manageUsers', name: 'User Account Provisioning', category: 'Administrative Governance', desc: 'Create, suspend, and reset student and staff credentials' }
  ];

  return (
    <div>
      <PageHead
        title="Screen 80: Role-Based Access Control (RBAC) & Permissions Matrix"
        subtitle="Manage granular authorization policies, functional privileges, and faculty security bounds"
        breadcrumbs={[
          { label: 'College Admin', href: '#/admin/dashboard' },
          { label: 'Screen 80: RBAC Matrix' }
        ]}
        actions={
          <div className="row gap-2">
            <button className="btn btn-secondary" onClick={() => showToast('Reset permissions to faculty baseline standards.', 'info')}>
              <Icon name="refresh" /> Reset Baseline
            </button>
            <button className="btn btn-primary" onClick={handleSavePolicy} disabled={saving}>
              <Icon name="checkCircle" /> {saving ? 'Saving Policy...' : 'Save Role Permissions'}
            </button>
          </div>
        }
      />

      {/* Role Picker Bar */}
      <div className="card p-3 mb-4">
        <div className="row-between wrap gap-2">
          <div className="row gap-2 wrap">
            {[
              { id: 'student', label: 'Student' },
              { id: 'doctor', label: 'Doctor / Instructor' },
              { id: 'ta', label: 'Teaching Assistant' },
              { id: 'employee', label: 'Employee (Student Affairs)' },
              { id: 'admin', label: 'College Admin' }
            ].map(r => (
              <button
                key={r.id}
                className={`btn btn-sm ${selectedRole === r.id ? 'btn-primary' : 'btn-neutral'}`}
                onClick={() => setSelectedRole(r.id)}
              >
                {r.label}
              </button>
            ))}
          </div>
          <span className="badge badge-ice self-center">
            Configuring: <strong>{selectedRole.toUpperCase()}</strong>
          </span>
        </div>
      </div>

      {/* Permissions Matrix Table */}
      <div className="card overflow-hidden">
        <div className="card-head">
          <div>
            <h3>Authorization Rules for {selectedRole.toUpperCase()}</h3>
            <p className="text-xs sub mt-1">Changes take effect immediately across all active user sessions.</p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Permission Name</th>
                <th>Description</th>
                <th style={{ width: '120px' }} className="text-center">Authorized</th>
              </tr>
            </thead>
            <tbody>
              {permissionsList.map(p => {
                const isEnabled = !!matrix[selectedRole]?.[p.key];
                return (
                  <tr key={p.key}>
                    <td>
                      <span className="badge badge-neutral">{p.category}</span>
                    </td>
                    <td>
                      <div className="bold">{p.name}</div>
                      <code className="text-xs sub">{p.key}</code>
                    </td>
                    <td>
                      <span className="text-xs sub">{p.desc}</span>
                    </td>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={() => handleToggle(selectedRole, p.key)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
