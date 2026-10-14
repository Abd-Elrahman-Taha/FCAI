import React, { useState } from 'react';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';

export const StudentRegistrationConfirmation: React.FC = () => {
  const { showToast } = useAuth();
  const [confirmed, setConfirmed] = useState(false);

  const registrationData = {
    course: 'CS301 · Design & Analysis of Algorithms',
    creditHours: 3,
    currentLoad: 15,
    projectedLoad: 18,
    maxAllowedLoad: 18,
    doctor: 'Dr. Mona Abdelrahman',
    section: 'Section S3 (Eng. Youssef Khaled - Tue 12:00–14:00)',
    lectureSlot: 'Sun 10:00–12:00 (Hall A-101)',
    prerequisiteCheck: { passed: true, detail: 'CS204 (Data Structures) completed with grade B+' },
    capacityCheck: { passed: true, detail: 'Available seats: 16 / 80' },
    academicStatusCheck: { passed: true, detail: 'Good Standing (CGPA: 3.42)' },
    financialCheck: { passed: true, detail: 'No outstanding prior semester holds' },
    timeConflictCheck: { passed: true, detail: 'No collision with enrolled courses' }
  };

  const handleConfirm = () => {
    setConfirmed(true);
    showToast('Enrollment finalized and officially recorded in faculty SIS!', 'success');
  };

  return (
    <div>
      <PageHead
        title="Screen 13: Course Registration Confirmation"
        subtitle="Final verification and academic compliance checks before semester enrollment commitment"
        breadcrumbs={[
          { label: 'Student Portal', href: '#/student/dashboard' },
          { label: 'Registration', href: '#/student/registration' },
          { label: 'Confirmation' }
        ]}
      />

      <div className="card p-6 mb-6" style={{ maxWidth: '820px' }}>
        <div className="row-between pb-4 border-b mb-4">
          <div>
            <span className="badge badge-primary mb-1">Target CourseOffering</span>
            <h2 style={{ fontSize: '20px', fontWeight: 750 }}>{registrationData.course}</h2>
            <div className="sub text-xs mt-1">Instructor: {registrationData.doctor} · {registrationData.creditHours} Credit Hours</div>
          </div>
          <div className="text-right">
            <span className="sub text-xs block">Projected Semester Load</span>
            <strong style={{ fontSize: '18px', color: 'var(--color-primary)' }}>
              {registrationData.projectedLoad} / {registrationData.maxAllowedLoad} Cr.
            </strong>
          </div>
        </div>

        {/* 5 Real-Time Validation Badges */}
        <h4 className="bold mb-3" style={{ fontSize: '15px' }}>Institutional 8-Rule Pre-Enrollment Audit</h4>
        <div className="stack gap-2 mb-5">
          <div className="card p-3 row-between" style={{ background: '#f0fdf4', border: '1px solid #86efac' }}>
            <div className="row gap-2">
              <Icon name="checkCircle" size="sm" style={{ color: 'var(--color-success)' }} />
              <span className="text-sm"><strong>Prerequisite Check:</strong> {registrationData.prerequisiteCheck.detail}</span>
            </div>
            <span className="badge badge-success">Passed</span>
          </div>

          <div className="card p-3 row-between" style={{ background: '#f0fdf4', border: '1px solid #86efac' }}>
            <div className="row gap-2">
              <Icon name="checkCircle" size="sm" style={{ color: 'var(--color-success)' }} />
              <span className="text-sm"><strong>Seat Capacity:</strong> {registrationData.capacityCheck.detail}</span>
            </div>
            <span className="badge badge-success">Available</span>
          </div>

          <div className="card p-3 row-between" style={{ background: '#f0fdf4', border: '1px solid #86efac' }}>
            <div className="row gap-2">
              <Icon name="checkCircle" size="sm" style={{ color: 'var(--color-success)' }} />
              <span className="text-sm"><strong>Academic Standing &amp; Credit Cap:</strong> {registrationData.academicStatusCheck.detail}</span>
            </div>
            <span className="badge badge-success">Eligible</span>
          </div>

          <div className="card p-3 row-between" style={{ background: '#f0fdf4', border: '1px solid #86efac' }}>
            <div className="row gap-2">
              <Icon name="checkCircle" size="sm" style={{ color: 'var(--color-success)' }} />
              <span className="text-sm"><strong>Financial Clearance:</strong> {registrationData.financialCheck.detail}</span>
            </div>
            <span className="badge badge-success">Cleared</span>
          </div>

          <div className="card p-3 row-between" style={{ background: '#f0fdf4', border: '1px solid #86efac' }}>
            <div className="row gap-2">
              <Icon name="checkCircle" size="sm" style={{ color: 'var(--color-success)' }} />
              <span className="text-sm"><strong>Schedule Conflicts:</strong> {registrationData.timeConflictCheck.detail}</span>
            </div>
            <span className="badge badge-success">No Conflict</span>
          </div>
        </div>

        {confirmed ? (
          <div className="card p-5 text-center" style={{ background: '#f0f7ff', border: '1px solid #5483B3' }}>
            <Icon name="checkCircle" size="lg" style={{ color: '#5483B3', marginBottom: '8px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#052659' }}>Official Enrollment Confirmed!</h3>
            <p className="sub text-xs mt-1 mb-4">You are now officially registered in CS301 for Fall 2026. Your timetable has been updated.</p>
            <div className="row-center gap-2">
              <a href="#/student/courses" className="btn btn-primary">Go to My Courses</a>
              <a href="#/student/timetable" className="btn btn-secondary">View Updated Timetable</a>
            </div>
          </div>
        ) : (
          <div className="row-between pt-3 border-t">
            <a href="#/student/registration" className="btn btn-secondary">
              &larr; Back to Catalog
            </a>
            <button className="btn btn-primary" onClick={handleConfirm}>
              <Icon name="checkCircle" /> Confirm Enrollment ({registrationData.creditHours} Credits)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
