import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

export const DoctorGradeSubmission: React.FC = () => {
  const { showToast } = useAuth();
  const [courseCode] = useState('CS301');
  const [pkg, setPkg] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [certifyChecked, setCertifyChecked] = useState(false);

  useEffect(() => {
    fakeApi.getDoctorGradebook(courseCode).then(res => {
      setPkg(res);
      setLoading(false);
    });
  }, [courseCode]);

  const handleSubmitPackage = async () => {
    if (!certifyChecked) {
      showToast('Please check the certification declaration box.', 'warning');
      return;
    }
    setSubmitting(true);
    await fakeApi.submitCourseOfferingGrades(courseCode);
    setPkg((prev: any) => ({ ...prev, status: 'Doctor Submitted', submittedAt: new Date().toLocaleString() }));
    setSubmitting(false);
    setConfirmModalOpen(false);
    showToast('Course grade package submitted successfully to Dean Executive Office.', 'success');
  };

  if (loading || !pkg) return <CardSkeleton count={5} />;

  const isDraft = pkg.status === 'Draft';
  const isSubmitted = pkg.status === 'Doctor Submitted';
  const isApproved = pkg.status === 'Admin Approved' || pkg.status === 'Published';

  return (
    <div>
      <PageHead
        title="Screen 63: Grade Package Submission & Verification"
        subtitle={`${pkg.courseCode} · ${pkg.courseName} · Fall 2026 Academic Term`}
        breadcrumbs={[
          { label: 'Doctor Portal', href: '#/doctor/dashboard' },
          { label: 'Screen 62: Grade Entry', href: '#/doctor/grade-entry' },
          { label: 'Screen 63: Package Submission' }
        ]}
        actions={
          <div className="row gap-2">
            <a href="#/doctor/grade-entry" className="btn btn-secondary">
              <Icon name="arrowLeft" /> Back to Grade Entry (Screen 62)
            </a>
            {isDraft && (
              <button className="btn btn-primary" onClick={() => setConfirmModalOpen(true)}>
                <Icon name="checkCircle" /> Submit Package to Dean Office
              </button>
            )}
          </div>
        }
      />

      {/* Package Lifecycle Status Banner */}
      <div className="card p-4 mb-4" style={{
        background: isApproved ? 'rgba(16, 185, 129, 0.08)' : isSubmitted ? 'rgba(59, 130, 246, 0.08)' : 'rgba(245, 158, 11, 0.08)',
        borderLeft: `4px solid ${isApproved ? 'var(--color-success)' : isSubmitted ? 'var(--color-primary)' : 'var(--color-warning)'}`
      }}>
        <div className="row-between wrap gap-2">
          <div>
            <div className="row gap-2 mb-1">
              <span className={`badge ${isApproved ? 'badge-success' : isSubmitted ? 'badge-primary' : 'badge-warning'}`}>
                Current State: {pkg.status}
              </span>
              <span className="text-xs sub">Package ID: PKG-CS301-2026-F</span>
            </div>
            <p className="text-sm">
              {isDraft && 'This package is currently in Draft mode. Review all audit checklists below before final formal submission.'}
              {isSubmitted && 'This package has been submitted by Course Professor and is currently awaiting Dean / Exam Control Committee approval.'}
              {isApproved && 'This package has been officially approved and published to the Student Portal. Grades are locked.'}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs sub block">Lead Instructor:</span>
            <strong className="text-sm">{pkg.doctor || 'Dr. Mona Abdelrahman'}</strong>
          </div>
        </div>
      </div>

      {/* 4-Step Verification Checklist */}
      <div className="card p-4 mb-4">
        <h3 className="mb-3">Pre-Submission Quality &amp; Compliance Audit</h3>
        <div className="stack gap-3">
          <div className="row-between p-3 rounded border">
            <div className="row gap-3">
              <span className="text-success"><Icon name="checkCircle" size="md" /></span>
              <div>
                <div className="bold text-sm">All 64 Students Enrolled Have Component Scores Recorded</div>
                <div className="text-xs sub">No null or missing marks found in Midterm, Practical, or Final Exam columns.</div>
              </div>
            </div>
            <span className="badge badge-success">Passed</span>
          </div>

          <div className="row-between p-3 rounded border">
            <div className="row gap-3">
              <span className="text-success"><Icon name="checkCircle" size="md" /></span>
              <div>
                <div className="bold text-sm">Attendance Deprivation Audit (&lt;75% Attendance)</div>
                <div className="text-xs sub">1 student (Hana Mostafa Kamal - 68%) flagged and automatically designated Fw as per bylaws.</div>
              </div>
            </div>
            <span className="badge badge-success">Enforced</span>
          </div>

          <div className="row-between p-3 rounded border">
            <div className="row gap-3">
              <span className="text-success"><Icon name="checkCircle" size="md" /></span>
              <div>
                <div className="bold text-sm">Teaching Assistant Practical Labs Sign-off</div>
                <div className="text-xs sub">Eng. Youssef Khaled submitted and validated all practical exercises on Oct 13, 2026.</div>
              </div>
            </div>
            <span className="badge badge-success">Verified</span>
          </div>

          <div className="row-between p-3 rounded border">
            <div className="row gap-3">
              <span className="text-success"><Icon name="checkCircle" size="md" /></span>
              <div>
                <div className="bold text-sm">Normal Distribution &amp; Bell Curve Compliance</div>
                <div className="text-xs sub">Class mean: 83.2% · Standard deviation: 8.4 · Approved within faculty accreditation bounds.</div>
              </div>
            </div>
            <span className="badge badge-success">Accredited</span>
          </div>
        </div>
      </div>

      {/* Grade Distribution Overview */}
      <div className="grid g-2 mb-4">
        <div className="card p-4">
          <h3 className="mb-3">Cohort Grade Distribution</h3>
          <div className="stack gap-3">
            {[
              { letter: 'A+ & A (90-100%)', count: 22, pct: 34.4, color: 'var(--color-success)' },
              { letter: 'B+ & B (80-89%)', count: 30, pct: 46.9, color: 'var(--color-primary)' },
              { letter: 'C+ & C (70-79%)', count: 9, pct: 14.1, color: 'var(--color-info)' },
              { letter: 'D+ & D (60-69%)', count: 2, pct: 3.1, color: 'var(--color-warning)' },
              { letter: 'F / Fw (<60%)', count: 1, pct: 1.5, color: 'var(--color-danger)' },
            ].map((d, i) => (
              <div key={i}>
                <div className="row-between text-xs bold mb-1">
                  <span>{d.letter}</span>
                  <span>{d.count} Students ({d.pct}%)</span>
                </div>
                <div style={{ height: '8px', background: 'var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${d.pct}%`, height: '100%', background: d.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-4">
          <h3 className="mb-3">Formal Package Metadata</h3>
          <div className="stack gap-2 text-sm">
            <div className="row-between py-2 border-b">
              <span className="sub">Course Offering:</span>
              <strong className="text-primary">{pkg.courseCode} · {pkg.courseName}</strong>
            </div>
            <div className="row-between py-2 border-b">
              <span className="sub">Academic Term:</span>
              <strong>Fall 2026 / 2027</strong>
            </div>
            <div className="row-between py-2 border-b">
              <span className="sub">Credit Hours:</span>
              <strong>3.0 Hours</strong>
            </div>
            <div className="row-between py-2 border-b">
              <span className="sub">Exam Committee Chair:</span>
              <strong>Prof. Dr. Mohamed Al-Badry (Dean)</strong>
            </div>
            <div className="row-between py-2 border-b">
              <span className="sub">Next Workflow Step:</span>
              <span className="badge badge-primary">Admin Grade Approval (Screen 94)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '520px' }}>
            <div className="modal-head">
              <h3>Institutional Grade Package Sign-Off</h3>
              <button className="btn-close" onClick={() => setConfirmModalOpen(false)}>×</button>
            </div>
            <div className="modal-body p-4">
              <p className="text-sm mb-4">
                You are about to transmit the complete academic grade package for <strong>{pkg.courseCode}</strong> to the College Administration.
              </p>
              <div className="card p-3 mb-4" style={{ background: 'var(--color-bg-page)' }}>
                <label className="row gap-2 align-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={certifyChecked}
                    onChange={e => setCertifyChecked(e.target.checked)}
                    style={{ marginTop: '3px' }}
                  />
                  <span className="text-xs">
                    I, <strong>{pkg.doctor || 'Dr. Mona Abdelrahman'}</strong>, associate professor in charge of {pkg.courseCode}, officially certify that all scores, practical marks, and attendance records entered in this package adhere to the Beni Suef University bylaws.
                  </span>
                </label>
              </div>

              <div className="row-between gap-2">
                <button className="btn btn-secondary" onClick={() => setConfirmModalOpen(false)}>
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSubmitPackage}
                  disabled={submitting || !certifyChecked}
                >
                  <Icon name="checkCircle" /> {submitting ? 'Transmitting Package...' : 'Sign & Transmit to Dean'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
