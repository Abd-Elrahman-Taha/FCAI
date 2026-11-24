/**
 * Screen 79: Departments Management (Admin)
 *
 * Connected strictly to all 7 confirmed Swagger AdminDepartments endpoints:
 * - GET  /api/admin/departments
 * - POST /api/admin/departments
 * - GET  /api/admin/departments/{id}
 * - PUT  /api/admin/departments/{id}
 * - POST /api/admin/departments/{id}/activate
 * - POST /api/admin/departments/{id}/deactivate
 * - PUT  /api/admin/departments/{id}/head-doctor
 */

import React, { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from '../../services/api';
import type {
  DepartmentDetailDto,
  DepartmentListItemDto,
  DepartmentType,
  DoctorListItemDto,
  PaginationMetadata,
} from '../../types/api';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

export const AdminDepartments: React.FC = () => {
  const { showToast } = useAuth();

  const [items, setItems] = useState<DepartmentListItemDto[]>([]);
  const [meta, setMeta] = useState<PaginationMetadata | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Filters & pagination
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('');
  const [pageIndex, setPageIndex] = useState<number>(1);

  // Doctors dropdown for Head Doctor assignment
  const [doctors, setDoctors] = useState<DoctorListItemDto[]>([]);

  // Detail & Busy state
  const [detail, setDetail] = useState<DepartmentDetailDto | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  // Create / Edit modal
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [nameEn, setNameEn] = useState<string>('');
  const [nameAr, setNameAr] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [deptType, setDeptType] = useState<DepartmentType>('Academic');
  const [headDoctorId, setHeadDoctorId] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Assign Head Doctor modal
  const [headModalDept, setHeadModalDept] = useState<DepartmentDetailDto | null>(null);
  const [selectedHeadId, setSelectedHeadId] = useState<string>('');
  const [savingHead, setSavingHead] = useState<boolean>(false);

  const loadDepartments = useCallback(
    async (page = pageIndex, search = searchTerm, typeVal = typeFilter, activeVal = activeFilter) => {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await api.departments.adminList({
          PageIndex: page,
          PageSize: 15,
          SearchTerm: search.trim() || undefined,
          Type: (typeVal as DepartmentType) || undefined,
          IsActive: activeVal === '' ? undefined : activeVal === 'true',
        });
        setItems(res.items ?? []);
        setMeta(res.meta ?? null);
      } catch (err: unknown) {
        setLoadError(err instanceof Error ? err.message : 'Failed to load departments.');
      } finally {
        setLoading(false);
      }
    },
    [pageIndex, searchTerm, typeFilter, activeFilter]
  );

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.departments.adminList({ PageIndex: 1, PageSize: 15 }),
      api.people.doctors.list({ PageIndex: 1, PageSize: 100 }).catch(() => null),
    ])
      .then(([deptRes, docRes]) => {
        if (cancelled) return;
        setItems(deptRes.items ?? []);
        setMeta(deptRes.meta ?? null);
        if (docRes?.items) setDoctors(docRes.items);
        setLoadError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setLoadError(err instanceof Error ? err.message : 'Failed to load departments.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const applyFilters = (nextPage = 1, nextSearch = searchTerm, nextType = typeFilter, nextActive = activeFilter) => {
    setPageIndex(nextPage);
    void loadDepartments(nextPage, nextSearch, nextType, nextActive);
  };

  const openCreateModal = () => {
    setModalMode('create');
    setEditingId(null);
    setNameEn('');
    setNameAr('');
    setCode('');
    setDeptType('Academic');
    setHeadDoctorId('');
    setFormError(null);
  };

  const openEditModal = async (id: number) => {
    setBusyId(id);
    setFormError(null);
    try {
      const fresh = await api.departments.adminGetById(id);
      setEditingId(fresh.id);
      setNameEn(fresh.nameEn ?? '');
      setNameAr(fresh.nameAr ?? '');
      setCode(fresh.code ?? '');
      setDeptType(fresh.type);
      setHeadDoctorId(fresh.headDoctorId ? String(fresh.headDoctorId) : '');
      setModalMode('edit');
    } catch (err: unknown) {
      showToast('Load Failed', err instanceof Error ? err.message : 'Failed to load department.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const openDetails = async (id: number) => {
    setBusyId(id);
    try {
      const fresh = await api.departments.adminGetById(id);
      setDetail(fresh);
    } catch (err: unknown) {
      showToast('Load Failed', err instanceof Error ? err.message : 'Failed to load department.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const openHeadModal = async (id: number) => {
    setBusyId(id);
    try {
      const fresh = await api.departments.adminGetById(id);
      setHeadModalDept(fresh);
      setSelectedHeadId(fresh.headDoctorId ? String(fresh.headDoctorId) : '');
    } catch (err: unknown) {
      showToast('Load Failed', err instanceof Error ? err.message : 'Failed to load department.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!nameEn.trim() || !nameAr.trim() || !code.trim()) {
      setFormError('English name, Arabic name, and department code are required.');
      return;
    }
    setSubmitting(true);
    try {
      if (modalMode === 'create') {
        const res = await api.departments.adminCreate({
          nameEn: nameEn.trim(),
          nameAr: nameAr.trim(),
          code: code.trim().toUpperCase(),
          type: deptType,
          headDoctorId: headDoctorId ? Number(headDoctorId) : null,
        });
        showToast('Department Created', res.message, 'success');
      } else if (modalMode === 'edit' && editingId !== null) {
        const res = await api.departments.adminUpdate(editingId, {
          nameEn: nameEn.trim(),
          nameAr: nameAr.trim(),
          code: code.trim().toUpperCase(),
          type: deptType,
        });
        showToast('Department Updated', res.message, 'success');
      }
      setModalMode(null);
      await loadDepartments(pageIndex);
    } catch (err: unknown) {
      setFormError(err instanceof ApiError || err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (dept: DepartmentListItemDto) => {
    setBusyId(dept.id);
    try {
      const msg = dept.isActive
        ? await api.departments.deactivate(dept.id)
        : await api.departments.activate(dept.id);
      showToast(dept.isActive ? 'Department Deactivated' : 'Department Activated', msg, 'success');
      await loadDepartments(pageIndex);
    } catch (err: unknown) {
      showToast('Action Failed', err instanceof Error ? err.message : 'Could not update status.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const handleSaveHead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!headModalDept) return;
    setSavingHead(true);
    try {
      const res = await api.departments.setHeadDoctor(headModalDept.id, {
        headDoctorId: selectedHeadId ? Number(selectedHeadId) : null,
      });
      showToast('Head Doctor Updated', res.message, 'success');
      setHeadModalDept(null);
      await loadDepartments(pageIndex);
    } catch (err: unknown) {
      showToast('Update Failed', err instanceof Error ? err.message : 'Failed to assign head doctor.', 'error');
    } finally {
      setSavingHead(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHead
        crumbs={[
          { label: 'Admin', href: '#/admin/dashboard' },
          { label: 'People & Organization' },
          { label: 'Departments' },
        ]}
        title="Departments Management"
        subtitle="Manage academic and administrative departments, activation status, and department head assignments."
        actions={
          <button type="button" className="btn btn-primary btn-sm" onClick={openCreateModal}>
            <Icon name="plus" size="sm" /> Create Department
          </button>
        }
      />

      {/* Filters */}
      <div className="card card-pad">
        <form
          onSubmit={e => {
            e.preventDefault();
            applyFilters(1);
          }}
          className="grid grid-cols-1 md:grid-cols-4 gap-3"
        >
          <input
            className="input"
            placeholder="Search by code, English or Arabic name..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <select
            className="input"
            value={typeFilter}
            onChange={e => {
              setTypeFilter(e.target.value);
              applyFilters(1, searchTerm, e.target.value, activeFilter);
            }}
          >
            <option value="">All Types</option>
            <option value="Academic">Academic</option>
            <option value="Administrative">Administrative</option>
          </select>
          <select
            className="input"
            value={activeFilter}
            onChange={e => {
              setActiveFilter(e.target.value);
              applyFilters(1, searchTerm, typeFilter, e.target.value);
            }}
          >
            <option value="">All Statuses</option>
            <option value="true">Active Only</option>
            <option value="false">Inactive Only</option>
          </select>
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary btn-sm flex-1">
              <Icon name="search" size="sm" /> Filter
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => {
                setSearchTerm('');
                setTypeFilter('');
                setActiveFilter('');
                applyFilters(1, '', '', '');
              }}
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <CardSkeleton />
      ) : loadError ? (
        <div className="card card-pad state">
          <div className="state-art danger"><Icon name="alert" size="lg" /></div>
          <h3>Failed to load departments</h3>
          <p className="text-sm muted">{loadError}</p>
          <button type="button" className="btn btn-primary btn-sm mt-3" onClick={() => void loadDepartments(pageIndex)}>
            Retry
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="card card-pad state">
          <div className="state-art"><Icon name="building" size="lg" /></div>
          <h3>No Departments Found</h3>
          <p className="text-sm muted">No departments match your current filters.</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name (EN / AR)</th>
                <th>Type</th>
                <th>Head Doctor</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(dept => (
                <tr key={dept.id}>
                  <td className="font-mono font-bold">{dept.code || '—'}</td>
                  <td>
                    <div className="font-semibold">{dept.nameEn || '—'}</div>
                    <div className="text-xs muted">{dept.nameAr || '—'}</div>
                  </td>
                  <td><span className="chip">{dept.type || '—'}</span></td>
                  <td className="text-sm">{dept.headDoctorName || <span className="muted">Unassigned</span>}</td>
                  <td>
                    <span className={dept.isActive ? 'chip chip-primary' : 'chip chip-danger'}>
                      {dept.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1.5 flex-wrap">
                      <button type="button" className="btn btn-outline btn-xs" disabled={busyId === dept.id} onClick={() => void openDetails(dept.id)}>
                        View
                      </button>
                      <button type="button" className="btn btn-outline btn-xs" disabled={busyId === dept.id} onClick={() => void openEditModal(dept.id)}>
                        Edit
                      </button>
                      <button type="button" className="btn btn-outline btn-xs" disabled={busyId === dept.id} onClick={() => void openHeadModal(dept.id)}>
                        Head
                      </button>
                      <button
                        type="button"
                        className={dept.isActive ? 'btn btn-danger btn-xs' : 'btn btn-primary btn-xs'}
                        disabled={busyId === dept.id}
                        onClick={() => void handleToggleActive(dept)}
                      >
                        {dept.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-800 text-sm">
              <span className="muted">
                Page {meta.pageIndex} of {meta.totalPages} ({meta.totalCount} total)
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline btn-xs"
                  disabled={!meta.hasPreviousPage}
                  onClick={() => applyFilters(pageIndex - 1)}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-xs"
                  disabled={!meta.hasNextPage}
                  onClick={() => applyFilters(pageIndex + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalMode && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal card card-pad" style={{ maxWidth: '520px', width: '100%' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{modalMode === 'create' ? 'Create Department' : 'Edit Department'}</h3>
              <button type="button" className="icon-btn" onClick={() => !submitting && setModalMode(null)}>
                <Icon name="x" size="sm" />
              </button>
            </div>
            {formError && (
              <div className="alert alert-danger mb-3 text-sm">
                <Icon name="alert" size="sm" />
                <span>{formError}</span>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="label">Code</label>
                  <input className="input" value={code} onChange={e => setCode(e.target.value)} placeholder="CS" required />
                </div>
                <div>
                  <label className="label">Type</label>
                  <select className="input" value={deptType} onChange={e => setDeptType(e.target.value as DepartmentType)}>
                    <option value="Academic">Academic</option>
                    <option value="Administrative">Administrative</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">English Name</label>
                <input className="input" value={nameEn} onChange={e => setNameEn(e.target.value)} placeholder="Computer Science" required />
              </div>
              <div>
                <label className="label">Arabic Name</label>
                <input className="input" dir="rtl" value={nameAr} onChange={e => setNameAr(e.target.value)} placeholder="علوم الحاسب" required />
              </div>
              {modalMode === 'create' && (
                <div>
                  <label className="label">Head Doctor (Optional)</label>
                  <select className="input" value={headDoctorId} onChange={e => setHeadDoctorId(e.target.value)}>
                    <option value="">None</option>
                    {doctors.map(d => (
                      <option key={d.id} value={String(d.id)}>
                        {d.fullNameEn || d.fullNameAr || d.email} (#{d.id})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="btn btn-outline" onClick={() => setModalMode(null)} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : modalMode === 'create' ? 'Create' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Head Doctor Modal */}
      {headModalDept && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal card card-pad" style={{ maxWidth: '460px', width: '100%' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">Assign Head Doctor</h3>
                <p className="text-xs muted">{headModalDept.nameEn} ({headModalDept.code})</p>
              </div>
              <button type="button" className="icon-btn" onClick={() => !savingHead && setHeadModalDept(null)}>
                <Icon name="x" size="sm" />
              </button>
            </div>
            <form onSubmit={handleSaveHead} className="space-y-4">
              <div>
                <label className="label">Head Doctor</label>
                <select className="input" value={selectedHeadId} onChange={e => setSelectedHeadId(e.target.value)}>
                  <option value="">Unassign Head Doctor</option>
                  {doctors.map(d => (
                    <option key={d.id} value={String(d.id)}>
                      {d.fullNameEn || d.fullNameAr || d.email} ({d.title || 'Doctor'})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" className="btn btn-outline" onClick={() => setHeadModalDept(null)} disabled={savingHead}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={savingHead}>
                  {savingHead ? 'Updating...' : 'Save Head Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Department Details Modal */}
      {detail && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal card card-pad" style={{ maxWidth: '480px', width: '100%' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{detail.nameEn}</h3>
              <button type="button" className="icon-btn" onClick={() => setDetail(null)}>
                <Icon name="x" size="sm" />
              </button>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between"><span className="muted">Code</span><b className="font-mono">{detail.code}</b></div>
              <div className="flex justify-between"><span className="muted">Arabic Name</span><b>{detail.nameAr}</b></div>
              <div className="flex justify-between"><span className="muted">Type</span><span className="chip">{detail.type}</span></div>
              <div className="flex justify-between">
                <span className="muted">Status</span>
                <span className={detail.isActive ? 'chip chip-primary' : 'chip chip-danger'}>
                  {detail.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="muted">Head Doctor (EN)</span>
                <b>{detail.headDoctorNameEn || 'Unassigned'}</b>
              </div>
              <div className="flex justify-between">
                <span className="muted">Head Doctor (AR)</span>
                <b>{detail.headDoctorNameAr || '—'}</b>
              </div>
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
