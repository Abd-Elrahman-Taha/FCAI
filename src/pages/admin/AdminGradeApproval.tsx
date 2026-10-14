import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';
import type { GradePackage, GradeScaleRow } from '../../types';

export const AdminGradeApproval: React.FC = () => {
  const { showToast } = useAuth();
  const [packages, setPackages] = useState<GradePackage[]>([]);
  const [gradeScale, setGradeScale] = useState<GradeScaleRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected audit package
  const [auditPkg, setAuditPkg] = useState<GradePackage | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  useEffect(() => {
    Promise.all([
      fakeApi.getAdminGradePackages(),
      fakeApi.getAdminGradeScale()
    ]).then(([pkgRes, scaleRes]) => {
      setPackages(pkgRes);
      setGradeScale(scaleRes);
      setLoading(false);
    });
  }, []);

  if (loading) return <CardSkeleton count={4} />;

  const handleApprove = async (courseCode: string) => {
    const updated = await fakeApi.approveGradePackage(courseCode);
    setPackages(prev => prev.map(p => p.courseCode === courseCode ? updated : p));
    showToast(`Approved and published official grades for ${courseCode}!`, 'success');
    setAuditPkg(null);
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditPkg) return;
    if (!rejectReason.trim()) {
      showToast('A formal audit rejection reason is required.', 'error');
      return;
    }
    const updated = await fakeApi.rejectGradePackage(auditPkg.courseCode, rejectReason);
    setPackages(prev => prev.map(p => p.courseCode === auditPkg.courseCode ? updated : p));
    showToast(`Rejected package for ${auditPkg.courseCode}. Returned to Doctor as Draft.`, 'warning');
    setAuditPkg(null);
    setIsRejecting(false);
    setRejectReason('');
  };

  return (
    <div>
      <PageHead
        title="Official Grade Approval &amp; Publishing Center"
        subtitle="Review, audit, approve and publish semester course grades with full lifecycle governance"
        breadcrumbs={[
          { label: 'College Admin', href: '#/admin/dashboard' },
          { label: 'Grade Approval' }
        ]}
      />

      {/* 5-Step Lifecycle Visual Pipeline */}
      <div className="card p-5 mb-5">
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px' }}>
          Standard 5-Step Grade Governance Lifecycle
        </h3>
        <div className="grid g-5 text-center">
          <div className="card p-3" style={{ background: 'var(--color-bg-page)' }}>
            <div className="badge badge-neutral mb-1">Step 1</div>
            <strong className="block text-xs">Draft</strong>
            <span className="sub text-xs">Doctor &amp; TA input</span>
          </div>
          <div className="card p-3" style={{ background: '#fef3c7', border: '1px solid #f59e0b' }}>
            <div className="badge badge-warning mb-1">Step 2</div>
            <strong className="block text-xs">Doctor Submitted</strong>
            <span className="sub text-xs">Awaiting Dean Office</span>
          </div>
          <div className="card p-3" style={{ background: 'var(--color-bg-page)' }}>
            <div className="badge badge-info mb-1">Step 3</div>
            <strong className="block text-xs">Admin Audit</strong>
            <span className="sub text-xs">Bell-curve inspection</span>
          </div>
          <div className="card p-3" style={{ background: '#f0f7ff', border: '1px solid #5483B3' }}>
            <div className="badge badge-success mb-1">Step 4</div>
            <strong className="block text-xs">Dean Approved</strong>
            <span className="sub text-xs">Published to Students</span>
          </div>
          <div className="card p-3" style={{ background: 'var(--color-bg-page)' }}>
            <div className="badge badge-neutral mb-1">Step 5</div>
            <strong className="block text-xs">Locked / Archive</strong>
            <span className="sub text-xs">Permanent Transcript</span>
          </div>
        </div>
      </div>

      {/* Grade Packages Table */}
      <div className="card mb-6">
        <div className="card-head">
          <h3>Submitted Grade Packages</h3>
          <span className="sub text-xs">Course packages awaiting dean signoff</span>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Lead Doctor</th>
                <th>Enrolled</th>
                <th>Submitted On</th>
                <th>Average / Status</th>
                <th>Failures</th>
                <th>Audit Action</th>
              </tr>
            </thead>
            <tbody>
              {packages.map(pkg => (
                <tr key={pkg.id}>
                  <td>
                    <div className="bold">{pkg.courseCode}</div>
                    <div className="sub text-xs">{pkg.courseName}</div>
                  </td>
                  <td>{pkg.leadDoctor}</td>
                  <td>{pkg.enrolledStudents} students</td>
                  <td className="text-xs sub">{pkg.submissionTime}</td>
                  <td>
                    <span className={`badge ${
                      pkg.status === 'Published' ? 'badge-success' :
                      pkg.status === 'Doctor Submitted' ? 'badge-warning' : 'badge-neutral'
                    }`}>
                      {pkg.status}
                    </span>
                    <div className="text-xs bold mt-1">{pkg.averageGrade}</div>
                  </td>
                  <td>
                    <span className={`badge ${pkg.failuresCount > 0 ? 'badge-danger' : 'badge-success'}`}>
                      {pkg.failuresCount} Students
                    </span>
                  </td>
                  <td>
                    <div className="row gap-1">
                      {pkg.status === 'Doctor Submitted' ? (
                        <>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleApprove(pkg.courseCode)}
                          >
                            <Icon name="checkCircle" /> Approve
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => { setAuditPkg(pkg); setIsRejecting(false); }}
                          >
                            <Icon name="eye" /> Audit
                          </button>
                        </>
                      ) : (
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => { setAuditPkg(pkg); setIsRejecting(false); }}
                        >
                          View Audit Record
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Institutional Grade Scale Reference */}
      <div className="card p-5">
        <div className="card-head">
          <h3>BSU Faculty Credit Hour Grading Scale</h3>
          <span className="badge badge-primary">Standard 4.0 Scale</span>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Letter</th>
                <th>Percentage Range</th>
                <th>Grade Points</th>
                <th>Descriptor</th>
              </tr>
            </thead>
            <tbody>
              {gradeScale.map(row => (
                <tr key={row.letter}>
                  <td><span className="badge badge-primary">{row.letter}</span></td>
                  <td>{row.minMarks}% – {row.maxMarks}%</td>
                  <td className="bold">{row.points.toFixed(2)}</td>
                  <td className="sub">{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit & Decision Modal */}
      {auditPkg && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '620px' }}>
            <div className="modal-head">
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>
                  Audit Grade Package · {auditPkg.courseCode}
                </h3>
                <span className="sub text-xs">{auditPkg.courseName} · Lead: {auditPkg.leadDoctor}</span>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setAuditPkg(null)}>
                <Icon name="x" />
              </button>
            </div>

            <div className="p-5">
              <div className="grid g-3 mb-4">
                <div className="card p-3 text-center">
                  <div className="sub text-xs">Enrolled</div>
                  <div style={{ fontSize: '18px', fontWeight: 700 }}>{auditPkg.enrolledStudents}</div>
                </div>
                <div className="card p-3 text-center">
                  <div className="sub text-xs">Class Average</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-primary)' }}>{auditPkg.averageGrade}</div>
                </div>
                <div className="card p-3 text-center">
                  <div className="sub text-xs">Failure Count</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: auditPkg.failuresCount > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}>
                    {auditPkg.failuresCount}
                  </div>
                </div>
              </div>

              {auditPkg.auditNotes && (
                <div className="card p-3 mb-4" style={{ background: '#fef2f2', border: '1px solid #f87171' }}>
                  <span className="sub text-xs block text-danger bold">Audit Notes / History:</span>
                  <div className="text-xs">{auditPkg.auditNotes}</div>
                </div>
              )}

              {!isRejecting ? (
                <div>
                  <p className="sub leading-relaxed mb-5" style={{ fontSize: '13px' }}>
                    As Dean Executive Administrator, you have full authority to certify that this grade package conforms to university bell-curve standards and approve its instantaneous publishing to the student portal.
                  </p>
                  <div className="row-between">
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => setIsRejecting(true)}
                    >
                      <Icon name="xCircle" /> Reject &amp; Reopen to Draft
                    </button>
                    <div className="row gap-2">
                      <button type="button" className="btn btn-secondary" onClick={() => setAuditPkg(null)}>
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => handleApprove(auditPkg.courseCode)}
                      >
                        <Icon name="checkCircle" /> Approve &amp; Publish
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleReject}>
                  <div className="alert alert-danger mb-4">
                    <Icon name="alertTriangle" />
                    <div>
                      <strong>Rejection Warning:</strong> Rejecting this grade package will revert the whole CourseOffering back to <strong>Draft</strong> status, unlocking student mark inputs for Dr. Mona Abdelrahman.
                    </div>
                  </div>
                  <div className="form-group mb-4">
                    <label className="form-label">Mandatory Audit Rejection Reason</label>
                    <textarea
                      className="textarea"
                      rows={3}
                      placeholder="e.g. Failure rate in practical component exceeds faculty quota, please re-evaluate..."
                      value={rejectReason}
                      onChange={e => setRejectReason(e.target.value)}
                      required
                    />
                  </div>
                  <div className="row-end gap-2">
                    <button type="button" className="btn btn-secondary" onClick={() => setIsRejecting(false)}>
                      Back to Audit
                    </button>
                    <button type="submit" className="btn btn-danger">
                      Confirm Rejection
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
