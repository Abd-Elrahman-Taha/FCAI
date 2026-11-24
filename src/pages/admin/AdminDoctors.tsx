/**
 * Screen 75: Doctors Management (Admin)
 *
 * Connected strictly to all 8 confirmed Swagger AdminDoctors endpoints:
 * - GET  /api/admin/doctors
 * - POST /api/admin/doctors
 * - GET  /api/admin/doctors/{id}
 * - PUT  /api/admin/doctors/{id}
 * - POST /api/admin/doctors/{id}/activate
 * - POST /api/admin/doctors/{id}/deactivate
 * - POST /api/admin/doctors/{id}/transfer-department
 * - POST /api/admin/doctors/{id}/reset-password
 */

import React, { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from '../../services/api';
import type {
  CreateDoctorResponseDto,
  DepartmentLookupDto,
  DoctorListItemDto,
  DoctorProfileResponseDto,
  PaginationMetadata,
} from '../../types/api';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

export const AdminDoctors: React.FC = () => {
  const { showToast } = useAuth();

  const [items, setItems] = useState<DoctorListItemDto[]>([]);
  const [meta, setMeta] = useState<PaginationMetadata | null>(null);
  const [departments, setDepartments] = useState<DepartmentLookupDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [busyId, setBusyId] = useState<number | null>(null);

  const [detail, setDetail] = useState<DoctorProfileResponseDto | null>(null);
  const [createdBanner, setCreatedBanner] = useState<CreateDoctorResponseDto | null>(null);

  // Create / Edit modal
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [fullNameEn, setFullNameEn] = useState('');
  const [fullNameAr, setFullNameAr] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [title, setTitle] = useState('');
  const [hireDate, setHireDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [maxProjects, setMaxProjects] = useState(5);
  const [tempPassword, setTempPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Transfer Department modal
  const [transferTarget, setTransferTarget] = useState<DoctorListItemDto | null>(null);
  const [transferDeptId, setTransferDeptId] = useState('');

  // Reset Password modal
  const [resetTarget, setResetTarget] = useState<DoctorListItemDto | null>(null);
  const [resetTempPw, setResetTempPw] = useState('');

  const loadDoctors = useCallback(
    async (page = pageIndex, search = searchTerm, dept = deptFilter, active = activeFilter) => {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await api.people.doctors.list({
          PageIndex: page,
          PageSize: 15,
          SearchTerm: search.trim() || undefined,
          DepartmentId: dept ? Number(dept) : undefined,
          IsActive: active === '' ? undefined : active === 'true',
        });
        setItems(res.items ?? []);
        setMeta(res.meta ?? null);
      } catch (err: unknown) {
        setLoadError(err instanceof Error ? err.message : 'Failed to load doctors.');
      } finally {
        setLoading(false);
      }
    },
    [pageIndex, searchTerm, deptFilter, activeFilter]
  );

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.people.doctors.list({ PageIndex: 1, PageSize: 15 }),
      api.departments.getLookup().catch(() => [] as DepartmentLookupDto[]),
    ])
      .then(([docRes, deptList]) => {
        if (cancelled) return;
        setItems(docRes.items ?? []);
        setMeta(docRes.meta ?? null);
        setDepartments(deptList);
        setLoadError(null);
      })
      .catch((err: unknown) => {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : 'Failed to load doctors.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const openCreate = () => {
    setModalMode('create');
    setEditingId(null);
    setFullNameEn('');
    setFullNameAr('');
    setEmail('');
    setPhoneNumber('');
    setDepartmentId(departments[0] ? String(departments[0].id) : '');
    setTitle('Assistant Professor');
    setHireDate(new Date().toISOString().slice(0, 10));
    setMaxProjects(5);
    setTempPassword('');
    setFormError(null);
  };

  const openEdit = async (id: number) => {
    setBusyId(id);
    setFormError(null);
    try {
      const fresh = await api.people.doctors.getById(id);
      setEditingId(fresh.id);
      setFullNameEn(fresh.fullNameEn ?? '');
      setFullNameAr(fresh.fullNameAr ?? '');
      setEmail(fresh.email ?? '');
      setPhoneNumber(fresh.phoneNumber ?? '');
      setDepartmentId(String(fresh.departmentId));
      setTitle(fresh.title ?? '');
      setHireDate(fresh.hireDate);
      setMaxProjects(fresh.maxSupervisedProjects);
      setModalMode('edit');
    } catch (err: unknown) {
      showToast('Load Failed', err instanceof Error ? err.message : 'Could not load doctor.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!fullNameEn.trim() || !email.trim() || !departmentId) {
      setFormError('Full name, email, and department are required.');
      return;
    }
    setSubmitting(true);
    try {
      if (modalMode === 'create') {
        const res = await api.people.doctors.create({
          fullNameEn: fullNameEn.trim(),
          fullNameAr: fullNameAr.trim() || null,
          email: email.trim(),
          phoneNumber: phoneNumber.trim() || null,
          departmentId: Number(departmentId),
          title: title.trim() || null,
          hireDate,
          maxSupervisedProjects: Number(maxProjects),
          temporaryPassword: tempPassword || null,
        });
        setCreatedBanner(res.data);
        showToast('Doctor Created', res.message, 'success');
      } else if (modalMode === 'edit' && editingId !== null) {
        const res = await api.people.doctors.update(editingId, {
          fullNameEn: fullNameEn.trim(),
          fullNameAr: fullNameAr.trim() || null,
          email: email.trim(),
          phoneNumber: phoneNumber.trim() || null,
          departmentId: Number(departmentId),
          title: title.trim() || null,
          hireDate,
          maxSupervisedProjects: Number(maxProjects),
        });
        showToast('Doctor Updated', res.message, 'success');
      }
      setModalMode(null);
      await loadDoctors(pageIndex);
    } catch (err: unknown) {
      setFormError(err instanceof ApiError || err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (doc: DoctorListItemDto) => {
    setBusyId(doc.id);
    try {
      const msg = doc.isActive
        ? await api.people.doctors.deactivate(doc.id)
        : await api.people.doctors.activate(doc.id);
      showToast(doc.isActive ? 'Doctor Deactivated' : 'Doctor Activated', msg, 'success');
      await loadDoctors(pageIndex);
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
      const res = await api.people.doctors.transfer(transferTarget.id, { departmentId: Number(transferDeptId) });
      showToast('Department Transferred', res.message, 'success');
      setTransferTarget(null);
      await loadDoctors(pageIndex);
    } catch (err: unknown) {
      showToast('Transfer Failed', err instanceof Error ? err.message : 'Failed to transfer doctor.', 'error');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTarget) return;
    try {
      const msg = await api.people.doctors.resetPassword(resetTarget.id, {
        newTemporaryPassword: resetTempPw || null,
      });
      showToast('Password Reset', msg, 'success');
      setResetTarget(null);
      setResetTempPw('');
    } catch (err: unknown) {
      showToast('Reset Failed', err instanceof Error ? err.message : 'Password reset failed.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <PageHead
        crumbs={[
          { label: 'Admin', href: '#/admin/dashboard' },
          { label: 'People' },
          { label: 'Doctors / Faculty' },
        ]}
        title="Doctors & Faculty Management"
        subtitle="Create, edit, transfer departments, activate/deactivate, and reset passwords for faculty doctors."
        actions={
          <button type="button" className="btn btn-primary btn-sm" onClick={openCreate}>
            <Icon name="plus" size="sm" /> Add Doctor
          </button>
        }
      />

      {createdBanner && (
        <div className="alert alert-info flex items-center justify-between gap-3 text-sm">
          <div>
            <b>Doctor Account Created:</b> {createdBanner.fullNameEn} ({createdBanner.email})
            {createdBanner.temporaryPassword && (
              <span> · Temporary Password: <code className="font-mono font-bold">{createdBanner.temporaryPassword}</code></span>
            )}
          </div>
          <button type="button" className="btn btn-outline btn-xs" onClick={() => setCreatedBanner(null)}>Dismiss</button>
        </div>
      )}

      <div className="card card-pad">
        <form
          onSubmit={e => {
            e.preventDefault();
            setPageIndex(1);
            void loadDoctors(1, searchTerm, deptFilter, activeFilter);
          }}
          className="grid grid-cols-1 md:grid-cols-4 gap-3"
        >
          <input className="input" placeholder="Search doctors..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <select
            className="input"
            value={deptFilter}
            onChange={e => {
              setDeptFilter(e.target.value);
              setPageIndex(1);
              void loadDoctors(1, searchTerm, e.target.value, activeFilter);
            }}
          >
            <option value="">All Departments</option>
            {departments.map(d => <option key={d.id} value={String(d.id)}>{d.code} · {d.nameEn}</option>)}
          </select>
          <select
            className="input"
            value={activeFilter}
            onChange={e => {
              setActiveFilter(e.target.value);
              setPageIndex(1);
              void loadDoctors(1, searchTerm, deptFilter, e.target.value);
            }}
          >
            <option value="">All Statuses</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <button type="submit" className="btn btn-primary btn-sm">Filter</button>
        </form>
      </div>

      {loading ? (
        <CardSkeleton />
      ) : loadError ? (
        <div className="card card-pad state">
          <div className="state-art danger"><Icon name="alert" size="lg" /></div>
          <h3>Failed to load doctors</h3>
          <p className="text-sm muted">{loadError}</p>
        </div>
      ) : items.length === 0 ? (
        <div className="card card-pad state">
          <div className="state-art"><Icon name="briefcase" size="lg" /></div>
          <h3>No Doctors Found</h3>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Contact</th>
                <th>Department</th>
                <th>Title</th>
                <th>Max Projects</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(d => (
                <tr key={d.id}>
                  <td>
                    <div className="font-semibold">{d.fullNameEn}</div>
                    {d.fullNameAr && <div className="text-xs muted">{d.fullNameAr}</div>}
                  </td>
                  <td className="text-xs">
                    <div>{d.email}</div>
                    <div className="muted font-mono">{d.phoneNumber || '—'}</div>
                  </td>
                  <td className="text-sm">{d.departmentName || '—'}</td>
                  <td className="text-xs">{d.title || '—'}</td>
                  <td className="text-sm font-semibold">{d.maxSupervisedProjects}</td>
                  <td><span className={d.isActive ? 'chip chip-primary' : 'chip chip-danger'}>{d.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1.5 flex-wrap">
                      <button type="button" className="btn btn-outline btn-xs" onClick={() => void api.people.doctors.getById(d.id).then(setDetail)}>View</button>
                      <button type="button" className="btn btn-outline btn-xs" disabled={busyId === d.id} onClick={() => void openEdit(d.id)}>Edit</button>
                      <button type="button" className="btn btn-outline btn-xs" onClick={() => { setTransferTarget(d); setTransferDeptId(departments[0] ? String(departments[0].id) : ''); }}>Transfer</button>
                      <button type="button" className="btn btn-outline btn-xs" onClick={() => { setResetTarget(d); setResetTempPw(''); }}>Reset PW</button>
                      <button
                        type="button"
                        className={d.isActive ? 'btn btn-danger btn-xs' : 'btn btn-primary btn-xs'}
                        disabled={busyId === d.id}
                        onClick={() => void handleToggleActive(d)}
                      >
                        {d.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-800 text-sm">
              <span className="muted">Page {meta.pageIndex} / {meta.totalPages} ({meta.totalCount})</span>
              <div className="flex gap-2">
                <button type="button" className="btn btn-outline btn-xs" disabled={!meta.hasPreviousPage} onClick={() => { setPageIndex(pageIndex - 1); void loadDoctors(pageIndex - 1); }}>Previous</button>
                <button type="button" className="btn btn-outline btn-xs" disabled={!meta.hasNextPage} onClick={() => { setPageIndex(pageIndex + 1); void loadDoctors(pageIndex + 1); }}>Next</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalMode && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal card card-pad" style={{ maxWidth: '560px', width: '100%' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{modalMode === 'create' ? 'Create Doctor Account' : 'Edit Doctor'}</h3>
              <button type="button" className="icon-btn" onClick={() => !submitting && setModalMode(null)}><Icon name="x" size="sm" /></button>
            </div>
            {formError && <div className="alert alert-danger mb-3 text-sm">{formError}</div>}
            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><label className="label">Full Name (EN)</label><input className="input" value={fullNameEn} onChange={e => setFullNameEn(e.target.value)} required /></div>
                <div><label className="label">Full Name (AR)</label><input className="input" dir="rtl" value={fullNameAr} onChange={e => setFullNameAr(e.target.value)} /></div>
                <div><label className="label">Email</label><input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} required /></div>
                <div><label className="label">Phone</label><input className="input" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} /></div>
                <div>
                  <label className="label">Department</label>
                  <select className="input" value={departmentId} onChange={e => setDepartmentId(e.target.value)} required>
                    <option value="">Select department...</option>
                    {departments.map(d => <option key={d.id} value={String(d.id)}>{d.code} · {d.nameEn}</option>)}
                  </select>
                </div>
                <div><label className="label">Academic Title</label><input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Professor / Lecturer" /></div>
                <div><label className="label">Hire Date</label><input type="date" className="input" value={hireDate} onChange={e => setHireDate(e.target.value)} required /></div>
                <div><label className="label">Max Supervised Projects</label><input type="number" className="input" value={maxProjects} onChange={e => setMaxProjects(Number(e.target.value))} required /></div>
              </div>
              {modalMode === 'create' && (
                <div><label className="label">Temporary Password (Optional — auto-generated if blank)</label><input type="password" className="input" value={tempPassword} onChange={e => setTempPassword(e.target.value)} /></div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="btn btn-outline" onClick={() => setModalMode(null)} disabled={submitting}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {transferTarget && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal card card-pad" style={{ maxWidth: '420px', width: '100%' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">Transfer Department</h3>
              <button type="button" className="icon-btn" onClick={() => setTransferTarget(null)}><Icon name="x" size="sm" /></button>
            </div>
            <p className="text-xs muted mb-3">Doctor: <b>{transferTarget.fullNameEn}</b></p>
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

      {/* Reset Password Modal */}
      {resetTarget && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal card card-pad" style={{ maxWidth: '420px', width: '100%' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">Reset Doctor Password</h3>
              <button type="button" className="icon-btn" onClick={() => setResetTarget(null)}><Icon name="x" size="sm" /></button>
            </div>
            <p className="text-xs muted mb-3">{resetTarget.fullNameEn} ({resetTarget.email})</p>
            <form onSubmit={handleResetPassword} className="space-y-3">
              <div>
                <label className="label">New Temporary Password (blank = default)</label>
                <input type="password" className="input" value={resetTempPw} onChange={e => setResetTempPw(e.target.value)} />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" className="btn btn-outline" onClick={() => setResetTarget(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Reset Password</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detail && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal card card-pad" style={{ maxWidth: '460px', width: '100%' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">{detail.fullNameEn}</h3>
              <button type="button" className="icon-btn" onClick={() => setDetail(null)}><Icon name="x" size="sm" /></button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="muted">Arabic Name</span><b>{detail.fullNameAr || '—'}</b></div>
              <div className="flex justify-between"><span className="muted">Email</span><b>{detail.email}</b></div>
              <div className="flex justify-between"><span className="muted">Phone</span><b>{detail.phoneNumber || '—'}</b></div>
              <div className="flex justify-between"><span className="muted">Department</span><b>{detail.departmentName}</b></div>
              <div className="flex justify-between"><span className="muted">Title</span><b>{detail.title || '—'}</b></div>
              <div className="flex justify-between"><span className="muted">Hire Date</span><b>{detail.hireDate}</b></div>
              <div className="flex justify-between"><span className="muted">Max Projects</span><b>{detail.maxSupervisedProjects}</b></div>
            </div>
            <div className="flex justify-end mt-4">
              <button type="button" className="btn btn-primary btn-sm" onClick={() => setDetail(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
