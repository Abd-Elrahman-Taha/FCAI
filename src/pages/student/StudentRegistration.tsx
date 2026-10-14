import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { useAuth } from '../../context/AuthContext';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { Modal } from '../../components/common/Modal';
import type { Course } from '../../types';

export const StudentRegistration: React.FC = () => {
  const { showToast } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOffering, setSelectedOffering] = useState<Course | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [regResult, setRegResult] = useState<any>(null);

  const loadOfferings = () => {
    setLoading(true);
    fakeApi.getCourseRegistrationOfferings().then(res => {
      setData(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadOfferings();
  }, []);

  const handleRegisterConfirm = async () => {
    if (!selectedOffering) return;
    setIsRegistering(true);
    try {
      const res = await fakeApi.registerCourse(selectedOffering.id);
      setRegResult(res);
      if (res.success) {
        showToast('Registered', res.message, 'success');
        loadOfferings();
      }
    } catch (err: any) {
      showToast('Error', 'Registration request failed.', 'error');
    } finally {
      setIsRegistering(false);
    }
  };

  if (loading || !data) {
    return <div className="card card-pad"><div className="spinner lg mx-auto" /></div>;
  }

  const { activeSemester, isPeriodOpen, currentCredits, maxCredits, offerings } = data;

  return (
    <div>
      <PageHead
        title="Course Registration"
        desc="Enroll in academic CourseOfferings for the active semester with real-time institutional rule verification."
        crumbs={[['Student Portal', '#/student/dashboard'], ['Course Registration']]}
      />

      {/* Registration Status Banner */}
      <div className="card card-pad mb-6" style={{ background: 'var(--blue-50)', borderColor: 'var(--blue-300)' }}>
        <div className="row-between wrap">
          <div className="row gap-3">
            <div className="avatar lg c1"><Icon name="plusSquare" size="lg" /></div>
            <div>
              <div className="row gap-2 mb-1">
                <span className="badge b-success no-dot">● Registration Period Open</span>
                <span className="badge b-info">{activeSemester}</span>
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Semester Credit Load: {currentCredits} / {maxCredits} Credit Hours</h2>
              <p className="text-xs muted mt-1">Direct enrollment with immediate verification. College Admin approval is NOT required.</p>
            </div>
          </div>
          <div className="col gap-1 text-right">
            <span className="text-xs muted">Allowed Credit Limit:</span>
            <b className="text-lg text-primary">{maxCredits} CH Maximum</b>
          </div>
        </div>
      </div>

      {/* Available Offerings Table */}
      <div className="card">
        <div className="card-head">
          <div>
            <h3><Icon name="layers" size="sm" /> Available CourseOfferings ({offerings.length})</h3>
            <p>Select a course to inspect prerequisites and schedule validation.</p>
          </div>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Course Offering Title</th>
                <th>CH</th>
                <th>Assigned Doctor</th>
                <th>Capacity / Remaining</th>
                <th>Weekly Schedule</th>
                <th>Prerequisites</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {offerings.map((c: Course) => {
                const hasSeats = (c.availableSeats ?? 0) > 0;
                return (
                  <tr key={c.id}>
                    <td><span className="badge b-navy no-dot">{c.code}</span></td>
                    <td><b>{c.name}</b></td>
                    <td><b>{c.creditHours}</b></td>
                    <td>{c.doctor}</td>
                    <td>
                      <span className={hasSeats ? 'trend-up fw-6' : 'trend-down fw-6'}>
                        {c.availableSeats} seats left
                      </span>{' '}
                      <small className="muted">/ {c.capacity}</small>
                    </td>
                    <td><span className="text-xs">{c.schedule}</span></td>
                    <td><span className="text-xs muted">{c.prerequisites?.join(', ') || 'None'}</span></td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          setSelectedOffering(c);
                          setRegResult(null);
                        }}
                      >
                        Register
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 8-Rule Validation Modal */}
      {selectedOffering && (
        <Modal
          isOpen={!!selectedOffering}
          onClose={() => setSelectedOffering(null)}
          title={`Register: ${selectedOffering.code} · ${selectedOffering.name}`}
          subtitle="Real-time 8-rule academic validation engine"
          iconName="shieldCheck"
          tone="info"
          size="lg"
          footer={
            <div className="row gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedOffering(null)}
              >
                Close
              </button>
              {!regResult?.success && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleRegisterConfirm}
                  disabled={isRegistering}
                >
                  {isRegistering ? 'Validating & Enrolling…' : 'Confirm Registration'}
                </button>
              )}
            </div>
          }
        >
          <div className="col gap-4">
            <div className="info-tile">
              <small>Course Summary</small>
              <b>{selectedOffering.code} — {selectedOffering.name} ({selectedOffering.creditHours} CH)</b>
              <div className="text-xs muted mt-1">Instructor: {selectedOffering.doctor} • Room: {selectedOffering.room}</div>
            </div>

            {/* If result is ready, show rule checks breakdown */}
            {regResult ? (
              <div>
                <div className={`alert ${regResult.success ? 'alert-success' : 'alert-danger'} mb-4`}>
                  <Icon name={regResult.success ? 'checkCircle' : 'alertCircle'} />
                  <div>
                    <b>{regResult.success ? 'Registration Confirmed!' : 'Registration Failed'}</b>
                    <p>{regResult.message}</p>
                  </div>
                </div>

                <h4 className="text-sm fw-7 mb-2">Automated 8-Rule Validation Results:</h4>
                <div className="checklist">
                  {regResult.ruleChecks.map((rc: any, idx: number) => (
                    <div key={idx} className={`check-row ${rc.passed ? 'ok' : 'fail'}`}>
                      <div className="ci">
                        <Icon name={rc.passed ? 'check' : 'x'} size="sm" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <b>{rc.rule}</b>
                        <span className="block text-xs muted">{rc.message}</span>
                      </div>
                      <span className={`badge ${rc.passed ? 'b-success' : 'b-danger'} no-dot`}>
                        {rc.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm muted mb-3">
                  Clicking <b>Confirm Registration</b> will evaluate all institutional constraints simultaneously:
                </p>
                <div className="checklist">
                  <div className="check-row pend"><div className="ci"><Icon name="check" size="sm" /></div> 1. Active Registration Period Verification</div>
                  <div className="check-row pend"><div className="ci"><Icon name="check" size="sm" /></div> 2. CourseOffering Availability for Active Semester</div>
                  <div className="check-row pend"><div className="ci"><Icon name="check" size="sm" /></div> 3. Academic Prerequisite Requirements</div>
                  <div className="check-row pend"><div className="ci"><Icon name="check" size="sm" /></div> 4. Semester Credit Load Limit (Max 18 CH)</div>
                  <div className="check-row pend"><div className="ci"><Icon name="check" size="sm" /></div> 5. Schedule / Lecture / Lab Section Clashes</div>
                  <div className="check-row pend"><div className="ci"><Icon name="check" size="sm" /></div> 6. Seat Capacity Thresholds</div>
                  <div className="check-row pend"><div className="ci"><Icon name="check" size="sm" /></div> 7. Student Academic Standing (Good Standing / Active)</div>
                  <div className="check-row pend"><div className="ci"><Icon name="check" size="sm" /></div> 8. Existing Enrollment Duplication Check</div>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
