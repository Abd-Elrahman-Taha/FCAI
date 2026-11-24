/**
 * Screen 74: Students Management (Admin)
 *
 * Connected strictly to all confirmed Swagger student administration endpoints:
 * - AdminStudents (11): GET/POST /api/admin/students, GET/PUT/DELETE /{id},
 *   GET /{id}/level, POST /{id}/activate, POST /{id}/deactivate,
 *   POST /{id}/transfer-department, POST /{id}/reset-password,
 *   POST /api/admin/students/bulk-reset-passwords
 * - StudentCreditLoadOverride (2): PUT/DELETE /api/admin/students/{id}/credit-load-override
 * - TransferredStudents (4): POST /api/admin/students/transferred (via CreateStudentAccount),
 *   GET/PUT /api/admin/students/{id}/transfer-credits,
 *   DELETE /api/admin/students/{id}/transfer-credits/{creditId}
 */

import React, { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from '../../services/api';
import type {
  AcademicStatus,
  CourseListItemDto,
  CurriculumVersionListItemDto,
  DepartmentLookupDto,
  PaginationMetadata,
  SecondaryTrack,
  SemesterDto,
  StudentAcademicStandingDto,
  StudentListItemDto,
  StudentProfileResponseDto,
  StudentTransferCreditsResponseDto,
} from '../../types/api';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

export const AdminStudents: React.FC = () => {
  const { showToast } = useAuth();

  const [items, setItems] = useState<StudentListItemDto[]>([]);
  const [meta, setMeta] = useState<PaginationMetadata | null>(null);
  const [departments, setDepartments] = useState<DepartmentLookupDto[]>([]);
  const [curricula, setCurricula] = useState<CurriculumVersionListItemDto[]>([]);
  const [semesters, setSemesters] = useState<SemesterDto[]>([]);
  const [allCourses, setAllCourses] = useState<CourseListItemDto[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [busyId, setBusyId] = useState<number | null>(null);

  // Detail + Academic Standing Modal
  const [detail, setDetail] = useState<StudentProfileResponseDto | null>(null);
  const [standing, setStanding] = useState<StudentAcademicStandingDto | null>(null);

  // Edit Modal
  const [editStudent, setEditStudent] = useState<StudentProfileResponseDto | null>(null);
  const [eNameEn, setENameEn] = useState('');
  const [eNameAr, setENameAr] = useState('');
  const [eEmail, setEEmail] = useState('');
  const [ePhone, setEPhone] = useState('');
  const [eTrack, setETrack] = useState<SecondaryTrack>('Math');
  const [eStatus, setEStatus] = useState<AcademicStatus>('Active');
  const [eCurrId, setECurrId] = useState('');
  const [eScore, setEScore] = useState(0);
  const [eAdmissionYear, setEAdmissionYear] = useState(0);
  const [eCertYear, setECertYear] = useState(0);
  const [savingEdit, setSavingEdit] = useState(false);

  // Transfer Department Modal
  const [transferTarget, setTransferTarget] = useState<StudentListItemDto | null>(null);
  const [transferDeptId, setTransferDeptId] = useState('');

  // Reset Password & Bulk Reset Modals
  const [resetTarget, setResetTarget] = useState<StudentListItemDto | null>(null);
  const [resetTempPw, setResetTempPw] = useState('');
  const [showBulkReset, setShowBulkReset] = useState(false);
  const [bulkTempPw, setBulkTempPw] = useState('');
  const [bulkDeptId, setBulkDeptId] = useState('');
  const [bulkAdmYear, setBulkAdmYear] = useState('');

  // Credit Load Override Modal
  const [overrideTarget, setOverrideTarget] = useState<StudentListItemDto | null>(null);
  const [ovSemesterId, setOvSemesterId] = useState('');
  const [ovMinCredits, setOvMinCredits] = useState('');
  const [ovMaxCredits, setOvMaxCredits] = useState('');
  const [ovReason, setOvReason] = useState('');

  // Transfer Credits Modal
  const [transferCreditsTarget, setTransferCreditsTarget] = useState<StudentListItemDto | null>(null);
  const [transferCreditsData, setTransferCreditsData] = useState<StudentTransferCreditsResponseDto | null>(null);
  const [selectedTransferCourseIds, setSelectedTransferCourseIds] = useState<number[]>([]);

  const loadStudents = useCallback(
    async (page = pageIndex, search = searchTerm, dept = deptFilter, status = statusFilter) => {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await api.people.students.list({
          PageIndex: page,
          PageSize: 15,
          SearchTerm: search.trim() || undefined,
          DepartmentId: dept ? Number(dept) : undefined,
          AcademicStatus: (status as AcademicStatus) || undefined,
        });
        setItems(res.items ?? []);
        setMeta(res.meta ?? null);
      } catch (err: unknown) {
        setLoadError(err instanceof Error ? err.message : 'Failed to load students.');
      } finally {
        setLoading(false);
      }
    },
    [pageIndex, searchTerm, deptFilter, statusFilter]
  );

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.people.students.list({ PageIndex: 1, PageSize: 15 }),
      api.departments.getLookup().catch(() => [] as DepartmentLookupDto[]),
      api.curriculum.listVersions().catch(() => [] as CurriculumVersionListItemDto[]),
      api.academicYears
        .getAll()
        .then(async yrs => {
          const allSems = await Promise.allSettled(yrs.map(y => api.semesters.getAll(y.id)));
          const merged: SemesterDto[] = [];
          for (const r of allSems) {
            if (r.status === 'fulfilled') merged.push(...r.value);
          }
          return merged;
        })
        .catch(() => [] as SemesterDto[]),
      api.courses.adminSearch({ Page: 1, PageSize: 200 }).catch(() => ({ items: [] as CourseListItemDto[] })),
    ])
      .then(([stuRes, deptList, currList, semList, crsRes]) => {
        if (cancelled) return;
        setItems(stuRes.items ?? []);
        setMeta(stuRes.meta ?? null);
        setDepartments(deptList);
        setCurricula(currList);
        setSemesters(semList);
        setAllCourses(crsRes.items ?? []);
        setLoadError(null);
      })
      .catch((err: unknown) => {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : 'Failed to load students.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const openDetail = async (id: number) => {
    setBusyId(id);
    try {
      const [profile, lvl] = await Promise.all([
        api.people.students.getById(id),
        api.people.students.getLevel(id).catch(() => null),
      ]);
      setDetail(profile);
      setStanding(lvl);
    } catch (err: unknown) {
      showToast('Load Failed', err instanceof Error ? err.message : 'Failed to load student.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const openEdit = async (id: number) => {
    setBusyId(id);
    try {
      const fresh = await api.people.students.getById(id);
      setEditStudent(fresh);
      setENameEn(fresh.fullNameEn ?? '');
      setENameAr(fresh.fullNameAr ?? '');
      setEEmail(fresh.email ?? '');
      setEPhone(fresh.phone ?? '');
      setETrack((fresh.secondaryTrack as SecondaryTrack) || 'Math');
      setEStatus((fresh.academicStatus as AcademicStatus) || 'Active');
      setECurrId(String(fresh.curriculumVersionId));
      setEScore(fresh.secondaryScore);
      setEAdmissionYear(fresh.admissionYear);
      setECertYear(fresh.secondaryCertificateYear);
    } catch (err: unknown) {
      showToast('Load Failed', err instanceof Error ? err.message : 'Failed to load student.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStudent) return;
    setSavingEdit(true);
    try {
      const res = await api.people.students.update(editStudent.id, {
        fullNameEn: eNameEn.trim(),
        fullNameAr: eNameAr.trim() || null,
        dateOfBirth: editStudent.dateOfBirth,
        gender: editStudent.gender,
        nationality: editStudent.nationality,
        phone: ePhone.trim() || null,
        email: eEmail.trim() || null,
        address: editStudent.address,
        governorate: editStudent.governorate,
        secondaryTrack: eTrack,
        secondaryCertificateYear: Number(eCertYear),
        seatNumber: editStudent.seatNumber,
        secondaryScore: Number(eScore),
        admissionYear: Number(eAdmissionYear),
        curriculumVersionId: Number(eCurrId),
        academicAdvisorDoctorId: editStudent.academicAdvisorDoctorId,
        academicStatus: eStatus,
        cgpa: editStudent.cgpa,
      });
      showToast('Student Updated', res.message, 'success');
      setEditStudent(null);
      await loadStudents(pageIndex);
    } catch (err: unknown) {
      showToast('Update Failed', err instanceof ApiError || err instanceof Error ? err.message : 'Update failed.', 'error');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (s: StudentListItemDto) => {
    if (!window.confirm(`Delete student ${s.studentCode} (${s.fullNameEn})?`)) return;
    setBusyId(s.id);
    try {
      const msg = await api.people.students.remove(s.id);
      showToast('Student Deleted', msg, 'success');
      await loadStudents(pageIndex);
    } catch (err: unknown) {
      showToast('Delete Failed', err instanceof Error ? err.message : 'Delete failed.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const handleActivateDeactivate = async (id: number, active: boolean) => {
    setBusyId(id);
    try {
      const msg = active
        ? await api.people.students.activate(id)
        : await api.people.students.deactivate(id);
      showToast(active ? 'Student Activated' : 'Student Deactivated', msg, 'success');
      if (detail && detail.id === id) {
        const refreshed = await api.people.students.getById(id);
        setDetail(refreshed);
      }
      await loadStudents(pageIndex);
    } catch (err: unknown) {
      showToast('Action Failed', err instanceof Error ? err.message : 'Status update failed.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferTarget || !transferDeptId) return;
    try {
      const res = await api.people.students.transfer(transferTarget.id, { departmentId: Number(transferDeptId) });
      showToast('Student Transferred', res.message, 'success');
      setTransferTarget(null);
      await loadStudents(pageIndex);
    } catch (err: unknown) {
      showToast('Transfer Failed', err instanceof Error ? err.message : 'Transfer failed.', 'error');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTarget) return;
    try {
      const msg = await api.people.students.resetPassword(resetTarget.id, {
        newTemporaryPassword: resetTempPw || null,
      });
      showToast('Password Reset', msg, 'success');
      setResetTarget(null);
      setResetTempPw('');
    } catch (err: unknown) {
      showToast('Reset Failed', err instanceof Error ? err.message : 'Password reset failed.', 'error');
    }
  };

  const handleBulkReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.people.students.bulkResetPasswords({
        newTemporaryPassword: bulkTempPw || null,
        departmentId: bulkDeptId ? Number(bulkDeptId) : null,
        admissionYear: bulkAdmYear ? Number(bulkAdmYear) : null,
      });
      showToast('Bulk Password Reset', `${res.data.affectedStudentsCount} student(s) updated. ${res.message}`, 'success');
      setShowBulkReset(false);
    } catch (err: unknown) {
      showToast('Bulk Reset Failed', err instanceof Error ? err.message : 'Bulk reset failed.', 'error');
    }
  };

  const handleSetOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideTarget || !ovSemesterId || !ovMaxCredits) return;
    try {
      const res = await api.people.students.setCreditLoadOverride(overrideTarget.id, {
        semesterId: Number(ovSemesterId),
        minCreditHours: ovMinCredits ? Number(ovMinCredits) : null,
        maxCreditHours: Number(ovMaxCredits),
        reason: ovReason.trim() || null,
      });
      showToast('Override Saved', res.message, 'success');
      setOverrideTarget(null);
    } catch (err: unknown) {
      showToast('Override Failed', err instanceof Error ? err.message : 'Could not save override.', 'error');
    }
  };

  const handleRemoveOverride = async () => {
    if (!overrideTarget) return;
    try {
      const msg = await api.people.students.removeCreditLoadOverride(
        overrideTarget.id,
        ovSemesterId ? Number(ovSemesterId) : undefined
      );
      showToast('Override Removed', msg, 'success');
      setOverrideTarget(null);
    } catch (err: unknown) {
      showToast('Remove Failed', err instanceof Error ? err.message : 'Could not remove override.', 'error');
    }
  };

  const openTransferCredits = async (s: StudentListItemDto) => {
    setBusyId(s.id);
    try {
      const data = await api.people.students.getTransferCredits(s.id);
      setTransferCreditsTarget(s);
      setTransferCreditsData(data);
      setSelectedTransferCourseIds((data.courses ?? []).map(c => c.courseId));
    } catch (err: unknown) {
      showToast('Transfer Credits', err instanceof Error ? err.message : 'No transfer credits record found for this student.', 'info');
    } finally {
      setBusyId(null);
    }
  };

  const handleSaveTransferCredits = async () => {
    if (!transferCreditsTarget) return;
    try {
      const res = await api.people.students.updateTransferCredits(transferCreditsTarget.id, {
        completedCourseIds: selectedTransferCourseIds,
      });
      setTransferCreditsData(res.data);
      showToast('Transfer Credits Updated', res.message, 'success');
    } catch (err: unknown) {
      showToast('Update Failed', err instanceof Error ? err.message : 'Failed to update transfer credits.', 'error');
    }
  };

  const handleDeleteTransferCredit = async (courseId: number) => {
    if (!transferCreditsTarget) return;
    try {
      const msg = await api.people.students.deleteTransferCredit(transferCreditsTarget.id, courseId);
      showToast('Transfer Credit Deleted', msg, 'success');
      const fresh = await api.people.students.getTransferCredits(transferCreditsTarget.id);
      setTransferCreditsData(fresh);
      setSelectedTransferCourseIds((fresh.courses ?? []).map(c => c.courseId));
    } catch (err: unknown) {
      showToast('Delete Failed', err instanceof Error ? err.message : 'Failed to delete transfer credit.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <PageHead
        crumbs={[
          { label: 'Admin', href: '#/admin/dashboard' },
          { label: 'People' },
          { label: 'Students Directory' },
        ]}
        title="Students Administration"
        subtitle="Search students, inspect academic standing, manage credit-load overrides, transfer credits, and bulk password resets."
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowBulkReset(true)}>
              Bulk Reset Passwords
            </button>
            <a href="#/admin/create-student" className="btn btn-primary btn-sm">
              <Icon name="plus" size="sm" /> Enroll Student
            </a>
          </div>
        }
      />

      <div className="card card-pad">
        <form
          onSubmit={e => {
            e.preventDefault();
            setPageIndex(1);
            void loadStudents(1, searchTerm, deptFilter, statusFilter);
          }}
          className="grid grid-cols-1 md:grid-cols-4 gap-3"
        >
          <input className="input" placeholder="Search code, national ID, name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <select
            className="input"
            value={deptFilter}
            onChange={e => {
              setDeptFilter(e.target.value);
              setPageIndex(1);
              void loadStudents(1, searchTerm, e.target.value, statusFilter);
            }}
          >
            <option value="">All Departments</option>
            {departments.map(d => <option key={d.id} value={String(d.id)}>{d.code} · {d.nameEn}</option>)}
          </select>
          <select
            className="input"
            value={statusFilter}
            onChange={e => {
              setStatusFilter(e.target.value);
              setPageIndex(1);
              void loadStudents(1, searchTerm, deptFilter, e.target.value);
            }}
          >
            <option value="">All Academic Statuses</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Graduated">Graduated</option>
            <option value="Withdrawn">Withdrawn</option>
            <option value="Dismissed">Dismissed</option>
          </select>
          <button type="submit" className="btn btn-primary btn-sm">Filter</button>
        </form>
      </div>

      {loading ? (
        <CardSkeleton />
      ) : loadError ? (
        <div className="card card-pad state">
          <div className="state-art danger"><Icon name="alert" size="lg" /></div>
          <h3>Failed to load students</h3>
          <p className="text-sm muted">{loadError}</p>
        </div>
      ) : items.length === 0 ? (
        <div className="card card-pad state">
          <div className="state-art"><Icon name="graduation" size="lg" /></div>
          <h3>No Students Found</h3>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Code</th>
                <th>Student</th>
                <th>Department</th>
                <th>CGPA / Credits</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(s => (
                <tr key={s.id}>
                  <td className="font-mono font-bold text-xs">
                    <div>{s.studentCode}</div>
                    <div className="muted font-normal">{s.nationalId}</div>
                  </td>
                  <td>
                    <div className="font-semibold">{s.fullNameEn}</div>
                    <div className="text-xs muted">{s.fullNameAr} · {s.email}</div>
                  </td>
                  <td className="text-sm">{s.departmentName || '—'}</td>
                  <td className="text-xs">
                    <div><b>{s.cgpa.toFixed(2)}</b> CGPA</div>
                    <div className="muted">{s.passedCredits} passed cr</div>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1 flex-wrap">
                      <button type="button" className="btn btn-outline btn-xs" disabled={busyId === s.id} onClick={() => void openDetail(s.id)}>Profile/Level</button>
                      <button type="button" className="btn btn-outline btn-xs" disabled={busyId === s.id} onClick={() => void openEdit(s.id)}>Edit</button>
                      <button
                        type="button"
                        className="btn btn-outline btn-xs"
                        onClick={() => {
                          setOverrideTarget(s);
                          setOvSemesterId(semesters.find(x => x.isActive)?.id ? String(semesters.find(x => x.isActive)?.id) : semesters[0] ? String(semesters[0].id) : '');
                          setOvMinCredits('');
                          setOvMaxCredits('');
                          setOvReason('');
                        }}
                      >
                        Credit Override
                      </button>
                      <button type="button" className="btn btn-outline btn-xs" disabled={busyId === s.id} onClick={() => void openTransferCredits(s)}>Transfer Cr.</button>
                      <button type="button" className="btn btn-outline btn-xs" onClick={() => { setTransferTarget(s); setTransferDeptId(departments[0] ? String(departments[0].id) : ''); }}>Dept</button>
                      <button type="button" className="btn btn-outline btn-xs" onClick={() => { setResetTarget(s); setResetTempPw(''); }}>Reset PW</button>
                      <button type="button" className="btn btn-danger btn-xs" disabled={busyId === s.id} onClick={() => void handleDelete(s)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-800 text-sm">
              <span className="muted">Page {meta.pageIndex} / {meta.totalPages} ({meta.totalCount} students)</span>
              <div className="flex gap-2">
                <button type="button" className="btn btn-outline btn-xs" disabled={!meta.hasPreviousPage} onClick={() => { setPageIndex(pageIndex - 1); void loadStudents(pageIndex - 1); }}>Previous</button>
                <button type="button" className="btn btn-outline btn-xs" disabled={!meta.hasNextPage} onClick={() => { setPageIndex(pageIndex + 1); void loadStudents(pageIndex + 1); }}>Next</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Detail & Academic Standing Modal */}
      {detail && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal card card-pad" style={{ maxWidth: '620px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold">{detail.fullNameEn} ({detail.studentCode})</h3>
                <p className="text-xs muted">{detail.departmentName} · {detail.academicStatus}</p>
              </div>
              <button type="button" className="icon-btn" onClick={() => { setDetail(null); setStanding(null); }}><Icon name="x" size="sm" /></button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs mb-4">
              <div>Email: <b>{detail.email}</b></div>
              <div>Phone: <b>{detail.phone || '—'}</b></div>
              <div>National ID: <b className="font-mono">{detail.nationalId}</b></div>
              <div>Admission Year: <b>{detail.admissionYear}</b></div>
              <div>CGPA: <b>{detail.cgpa.toFixed(2)}</b></div>
              <div>Passed Credits: <b>{detail.passedCredits}</b></div>
              <div>Account Status: <span className={detail.isActive ? 'chip chip-primary' : 'chip chip-danger'}>{detail.isActive ? 'Active' : 'Inactive'}</span></div>
              <div>Track: <b>{detail.secondaryTrack}</b></div>
            </div>

            {standing && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-2 text-xs mb-4">
                <div className="font-bold">Academic Level &amp; Standing</div>
                <div>
                  Level <b>{standing.level}</b> ({standing.levelName}) · Progress: <b>{standing.earnedHours}/{standing.totalRequiredCredits} cr ({standing.percentage.toFixed(1)}%)</b>
                </div>
                {standing.curriculumName && <div>Curriculum: <b>{standing.curriculumName}</b></div>}
                {(standing.groups ?? []).length > 0 && (
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    {(standing.groups ?? []).map((g, idx) => (
                      <div key={idx} className="p-2 rounded border border-slate-200 dark:border-slate-700">
                        <b>{g.groupCode}</b>: {g.earnedHours}/{g.requiredHours} cr
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                className={detail.isActive ? 'btn btn-danger btn-xs' : 'btn btn-primary btn-xs'}
                onClick={() => void handleActivateDeactivate(detail.id, !detail.isActive)}
              >
                {detail.isActive ? 'Deactivate Account' : 'Activate Account'}
              </button>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => { setDetail(null); setStanding(null); }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {editStudent && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal card card-pad" style={{ maxWidth: '580px', width: '100%' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">Edit Student · {editStudent.studentCode}</h3>
              <button type="button" className="icon-btn" onClick={() => setEditStudent(null)}><Icon name="x" size="sm" /></button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><label className="label">Full Name (EN)</label><input className="input" value={eNameEn} onChange={e => setENameEn(e.target.value)} required /></div>
                <div><label className="label">Full Name (AR)</label><input className="input" dir="rtl" value={eNameAr} onChange={e => setENameAr(e.target.value)} /></div>
                <div><label className="label">Email</label><input type="email" className="input" value={eEmail} onChange={e => setEEmail(e.target.value)} /></div>
                <div><label className="label">Phone</label><input className="input" value={ePhone} onChange={e => setEPhone(e.target.value)} /></div>
                <div>
                  <label className="label">Academic Status</label>
                  <select className="input" value={eStatus} onChange={e => setEStatus(e.target.value as AcademicStatus)}>
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Graduated">Graduated</option>
                    <option value="Withdrawn">Withdrawn</option>
                    <option value="Dismissed">Dismissed</option>
                  </select>
                </div>
                <div>
                  <label className="label">Secondary Track</label>
                  <select className="input" value={eTrack} onChange={e => setETrack(e.target.value as SecondaryTrack)}>
                    <option value="Math">Math</option>
                    <option value="Science">Science</option>
                  </select>
                </div>
                <div>
                  <label className="label">Curriculum Version</label>
                  <select className="input" value={eCurrId} onChange={e => setECurrId(e.target.value)}>
                    {curricula.map(cv => <option key={cv.id} value={String(cv.id)}>{cv.name}</option>)}
                  </select>
                </div>
                <div><label className="label">Secondary Score</label><input type="number" step="0.5" className="input" value={eScore} onChange={e => setEScore(Number(e.target.value))} /></div>
                <div><label className="label">Admission Year</label><input type="number" className="input" value={eAdmissionYear} onChange={e => setEAdmissionYear(Number(e.target.value))} /></div>
                <div><label className="label">Certificate Year</label><input type="number" className="input" value={eCertYear} onChange={e => setECertYear(Number(e.target.value))} /></div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="btn btn-outline" onClick={() => setEditStudent(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={savingEdit}>{savingEdit ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Credit Load Override Modal */}
      {overrideTarget && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal card card-pad" style={{ maxWidth: '460px', width: '100%' }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold">Credit Load Override</h3>
                <p className="text-xs muted">{overrideTarget.fullNameEn} ({overrideTarget.studentCode})</p>
              </div>
              <button type="button" className="icon-btn" onClick={() => setOverrideTarget(null)}><Icon name="x" size="sm" /></button>
            </div>
            <form onSubmit={handleSetOverride} className="space-y-3">
              <div>
                <label className="label">Semester</label>
                <select className="input" value={ovSemesterId} onChange={e => setOvSemesterId(e.target.value)} required>
                  {semesters.map(sem => <option key={sem.id} value={String(sem.id)}>{sem.name} {sem.isActive ? '(Active)' : ''}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Min Credits (Optional)</label><input type="number" className="input" value={ovMinCredits} onChange={e => setOvMinCredits(e.target.value)} /></div>
                <div><label className="label">Max Credits</label><input type="number" className="input" value={ovMaxCredits} onChange={e => setOvMaxCredits(e.target.value)} required /></div>
              </div>
              <div><label className="label">Reason</label><input className="input" value={ovReason} onChange={e => setOvReason(e.target.value)} placeholder="Graduating senior approval..." /></div>
              <div className="flex items-center justify-between pt-2">
                <button type="button" className="btn btn-danger btn-xs" onClick={() => void handleRemoveOverride()}>Remove Override</button>
                <div className="flex gap-2">
                  <button type="button" className="btn btn-outline" onClick={() => setOverrideTarget(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Override</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Credits Modal */}
      {transferCreditsTarget && transferCreditsData && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal card card-pad" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold">Transfer Credits · {transferCreditsData.studentCode}</h3>
                <p className="text-xs muted">
                  {transferCreditsData.previousInstitution} — {transferCreditsData.previousFacultyName} · Total: {transferCreditsData.totalPassedCredits} cr
                </p>
              </div>
              <button type="button" className="icon-btn" onClick={() => { setTransferCreditsTarget(null); setTransferCreditsData(null); }}><Icon name="x" size="sm" /></button>
            </div>

            <div className="space-y-2 mb-4">
              <div className="font-semibold text-xs">Current Transferred Courses</div>
              {(transferCreditsData.courses ?? []).length === 0 ? (
                <p className="text-xs muted">None</p>
              ) : (
                (transferCreditsData.courses ?? []).map(c => (
                  <div key={c.courseId} className="flex items-center justify-between p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
                    <span><b>{c.courseCode}</b> · {c.courseName} ({c.creditHours} cr)</span>
                    <button type="button" className="btn btn-danger btn-xs" onClick={() => void handleDeleteTransferCredit(c.courseId)}>Remove</button>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-2 mb-4">
              <div className="font-semibold text-xs">Update Full Completed Equivalent Course Set</div>
              <div className="max-h-48 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-1.5 p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                {allCourses.map(c => (
                  <label key={c.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTransferCourseIds.includes(c.id)}
                      onChange={() =>
                        setSelectedTransferCourseIds(prev => (prev.includes(c.id) ? prev.filter(x => x !== c.id) : [...prev, c.id]))
                      }
                    />
                    <span className="font-mono font-bold">{c.code}</span>
                    <span className="truncate">{c.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button type="button" className="btn btn-outline" onClick={() => { setTransferCreditsTarget(null); setTransferCreditsData(null); }}>Close</button>
              <button type="button" className="btn btn-primary" onClick={() => void handleSaveTransferCredits()}>Save Transfer Credits</button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Department Modal */}
      {transferTarget && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal card card-pad" style={{ maxWidth: '420px', width: '100%' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">Transfer Department</h3>
              <button type="button" className="icon-btn" onClick={() => setTransferTarget(null)}><Icon name="x" size="sm" /></button>
            </div>
            <form onSubmit={handleTransfer} className="space-y-3">
              <select className="input" value={transferDeptId} onChange={e => setTransferDeptId(e.target.value)} required>
                {departments.map(d => <option key={d.id} value={String(d.id)}>{d.code} · {d.nameEn}</option>)}
              </select>
              <div className="flex justify-end gap-2">
                <button type="button" className="btn btn-outline" onClick={() => setTransferTarget(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Transfer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Single Reset Password Modal */}
      {resetTarget && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal card card-pad" style={{ maxWidth: '420px', width: '100%' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">Reset Student Password</h3>
              <button type="button" className="icon-btn" onClick={() => setResetTarget(null)}><Icon name="x" size="sm" /></button>
            </div>
            <form onSubmit={handleResetPassword} className="space-y-3">
              <div><label className="label">New Temporary Password (Optional)</label><input type="password" className="input" value={resetTempPw} onChange={e => setResetTempPw(e.target.value)} /></div>
              <div className="flex justify-end gap-2">
                <button type="button" className="btn btn-outline" onClick={() => setResetTarget(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Reset</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Reset Passwords Modal */}
      {showBulkReset && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal card card-pad" style={{ maxWidth: '460px', width: '100%' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">Bulk Reset Student Passwords</h3>
              <button type="button" className="icon-btn" onClick={() => setShowBulkReset(false)}><Icon name="x" size="sm" /></button>
            </div>
            <form onSubmit={handleBulkReset} className="space-y-3">
              <div>
                <label className="label">Department (Optional)</label>
                <select className="input" value={bulkDeptId} onChange={e => setBulkDeptId(e.target.value)}>
                  <option value="">All Departments</option>
                  {departments.map(d => <option key={d.id} value={String(d.id)}>{d.code} · {d.nameEn}</option>)}
                </select>
              </div>
              <div><label className="label">Admission Year (Optional)</label><input type="number" className="input" value={bulkAdmYear} onChange={e => setBulkAdmYear(e.target.value)} placeholder="e.g. 2025" /></div>
              <div><label className="label">New Temporary Password (Optional)</label><input type="password" className="input" value={bulkTempPw} onChange={e => setBulkTempPw(e.target.value)} /></div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="btn btn-outline" onClick={() => setShowBulkReset(false)}>Cancel</button>
                <button type="submit" className="btn btn-danger">Execute Bulk Reset</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
