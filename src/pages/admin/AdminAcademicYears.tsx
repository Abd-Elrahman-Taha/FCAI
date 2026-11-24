/**
 * Screen 86: Academic Years Management (Admin)
 *
 * Connected strictly to confirmed Swagger endpoints:
 * - GET  /api/admin/academic-years
 * - POST /api/admin/academic-years
 * - GET  /api/admin/academic-years/{id}
 * - PUT  /api/admin/academic-years/{id}
 *
 * Also renders the live Active Semester card (GET /api/semesters/active).
 * Zero hardcoded academic years. Zero mock fallbacks.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { api, ApiError } from '../../services/api';
import type { AcademicYear } from '../../types/api/academic.types';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { ActiveSemesterCard } from '../../components/common/ActiveSemesterCard';
import { useAuth } from '../../context/AuthContext';

export const AdminAcademicYears: React.FC = () => {
  const { showToast } = useAuth();

  const [years, setYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Selected year detail preview (fetched via GET /api/admin/academic-years/{id})
  const [detailYear, setDetailYear] = useState<AcademicYear | null>(null);
  const [loadingDetailId, setLoadingDetailId] = useState<number | null>(null);

  // Create / Edit Modal state
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formApiError, setFormApiError] = useState<ApiError | null>(null);
  const [formClientError, setFormClientError] = useState<string | null>(null);

  const loadYears = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const list = await api.academicYears.getAll();
      setYears(list);
    } catch (err: unknown) {
      const msg =
        err instanceof ApiError || err instanceof Error
          ? err.message
          : 'Failed to load academic years from backend.';
      setLoadError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    api.academicYears
      .getAll()
      .then(list => {
        if (cancelled) return;
        setYears(list);
        setLoadError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const msg =
          err instanceof ApiError || err instanceof Error
            ? err.message
            : 'Failed to load academic years from backend.';
        setLoadError(msg);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const openCreateModal = () => {
    setModalMode('create');
    setEditingId(null);
    setName('');
    setStartDate('');
    setEndDate('');
    setFormApiError(null);
    setFormClientError(null);
  };

  const openEditModal = async (year: AcademicYear) => {
    setLoadingDetailId(year.id);
    setFormApiError(null);
    setFormClientError(null);
    try {
      // Fetch fresh single academic year details from GET /api/admin/academic-years/{id}
      const fresh = await api.academicYears.getById(year.id);
      setEditingId(fresh.id);
      setName(fresh.name);
      setStartDate(fresh.startDate);
      setEndDate(fresh.endDate);
      setModalMode('edit');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load academic year details.';
      showToast('Load Failed', msg, 'error');
    } finally {
      setLoadingDetailId(null);
    }
  };

  const openDetailsModal = async (id: number) => {
    setLoadingDetailId(id);
    try {
      const fresh = await api.academicYears.getById(id);
      setDetailYear(fresh);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load academic year details.';
      showToast('Load Failed', msg, 'error');
    } finally {
      setLoadingDetailId(null);
    }
  };

  const closeFormModal = () => {
    if (submitting) return;
    setModalMode(null);
    setEditingId(null);
    setFormApiError(null);
    setFormClientError(null);
  };

  const fieldErrors = (field: string): string[] => formApiError?.getFieldErrors(field) ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormApiError(null);
    setFormClientError(null);

    if (!name.trim() || !startDate || !endDate) {
      setFormClientError('Name, start date, and end date are all required.');
      return;
    }
    if (startDate >= endDate) {
      setFormClientError('End date must be strictly after start date.');
      return;
    }

    setSubmitting(true);
    try {
      if (modalMode === 'create') {
        const res = await api.academicYears.create({
          name: name.trim(),
          startDate,
          endDate,
        });
        // Update immediately with actual returned backend entity, then sync ordering from server
        setYears(prev => [res.data, ...prev]);
        showToast('Academic Year Created', res.message, 'success');
        setModalMode(null);
        await loadYears();
      } else if (modalMode === 'edit' && editingId !== null) {
        const res = await api.academicYears.update(editingId, {
          name: name.trim(),
          startDate,
          endDate,
        });
        setYears(prev => prev.map(item => (item.id === editingId ? res.data : item)));
        if (detailYear && detailYear.id === editingId) {
          setDetailYear(res.data);
        }
        showToast('Academic Year Updated', res.message, 'success');
        setModalMode(null);
        await loadYears();
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setFormApiError(err);
      } else {
        setFormClientError(err instanceof Error ? err.message : 'Failed to save academic year.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const formBannerError = formClientError || formApiError?.message || null;

  return (
    <div>
      <PageHead
        title="Academic Years Management"
        subtitle="Manage university academic years, date ranges, and inspect nested semesters directly from the backend."
        breadcrumbs={[
          { label: 'College Admin', href: '#/admin/dashboard' },
          { label: 'Academic Years' }
        ]}
        actions={
          <div className="row gap-2 wrap">
            <a href="#/admin/levels" className="btn btn-secondary">
              <Icon name="layers" size="sm" /> Academic Levels
            </a>
            <button type="button" className="btn btn-secondary" onClick={loadYears} disabled={loading}>
              <Icon name="refresh" size="sm" /> {loading ? 'Loading…' : 'Refresh'}
            </button>
            <button type="button" className="btn btn-primary" onClick={openCreateModal}>
              <Icon name="plus" size="sm" /> Create Academic Year
            </button>
          </div>
        }
      />

      {/* Live Active Semester (GET /api/semesters/active) */}
      <ActiveSemesterCard />

      {/* Error State */}
      {loadError && (
        <div className="alert alert-danger mb-5" role="alert">
          <Icon name="alertCircle" />
          <div className="flex-1">
            <b>Failed to Load Academic Years</b>
            <p className="text-xs mt-1">{loadError}</p>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={loadYears}>
            <Icon name="refresh" size="sm" /> Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && years.length === 0 ? (
        <CardSkeleton count={3} />
      ) : !loadError && years.length === 0 ? (
        <div className="card state">
          <div className="state-art info">
            <Icon name="calendar" size="xl" />
          </div>
          <h3>No Academic Years Found</h3>
          <p className="text-sm muted">
            No academic years have been configured in the backend yet. Create your first academic year to get started.
          </p>
          <button type="button" className="btn btn-primary mt-2" onClick={openCreateModal}>
            <Icon name="plus" size="sm" /> Create Academic Year
          </button>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="card-head">
            <div>
              <h3>Academic Years Directory</h3>
              <p className="text-xs muted">Ordered by start date descending as returned by the backend.</p>
            </div>
            <span className="badge badge-neutral no-dot">{years.length} Academic Years</span>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Academic Year</th>
                  <th>Date Range</th>
                  <th>Status</th>
                  <th>Semesters</th>
                  <th style={{ width: '190px' }} className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {years.map(year => (
                  <tr key={year.id}>
                    <td>
                      <div className="bold">{year.name}</div>
                      <span className="text-xs muted mono">ID #{year.id}</span>
                    </td>
                    <td>
                      <div className="mono text-xs bold">
                        {year.startDate} → {year.endDate}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${year.isActive ? 'badge-success' : 'badge-neutral'}`}>
                        {year.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      {year.semesters.length === 0 ? (
                        <span className="text-xs muted">No semesters</span>
                      ) : (
                        <div className="col gap-1.5">
                          {year.semesters.map(sem => (
                            <div key={sem.id} className="row gap-2 wrap align-center text-xs">
                              <span className={`badge ${sem.isActive ? 'badge-success' : 'badge-info'} no-dot`} style={{ height: '20px', fontSize: '10.5px' }}>
                                {sem.semesterType}
                              </span>
                              <b>{sem.name}</b>
                              <span className="mono muted">
                                ({sem.startDate} – {sem.endDate})
                              </span>
                              {sem.isActive && (
                                <span className="badge badge-primary no-dot" style={{ height: '18px', fontSize: '10px' }}>
                                  Active
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="text-center">
                      <div className="row gap-1.5 justify-center">
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => openDetailsModal(year.id)}
                          disabled={loadingDetailId === year.id}
                        >
                          <Icon name="eye" size="sm" /> Details
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => openEditModal(year)}
                          disabled={loadingDetailId === year.id}
                        >
                          <Icon name="edit" size="sm" /> Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Academic Year Modal */}
      {modalMode && (
        <div className="overlay" onClick={closeFormModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <div className="modal-ico">
                <Icon name="calendar" size="lg" />
              </div>
              <div className="flex-1">
                <h3>{modalMode === 'create' ? 'Create Academic Year' : 'Edit Academic Year'}</h3>
                <p>
                  {modalMode === 'create'
                    ? 'POST /api/admin/academic-years — Dates use yyyy-MM-dd format.'
                    : `PUT /api/admin/academic-years/${editingId} — Must keep all existing semesters within range.`}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="modal-body col gap-4">
                {formBannerError && (
                  <div className="alert alert-danger" role="alert">
                    <Icon name="alertCircle" size="sm" />
                    <div>
                      <b>
                        {formApiError?.status === 409
                          ? 'Conflict (HTTP 409)'
                          : formApiError?.status === 422
                          ? 'Date Range Conflict (HTTP 422)'
                          : formApiError?.status
                          ? `Validation / Server Error (HTTP ${formApiError.status})`
                          : 'Form Error'}
                      </b>
                      <p className="text-xs mt-0.5">{formBannerError}</p>
                    </div>
                  </div>
                )}

                <div className="field">
                  <label className="label" htmlFor="ay-name">Academic Year Name</label>
                  <input
                    id="ay-name"
                    type="text"
                    className="input"
                    placeholder="e.g. 2027/2028"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                  {fieldErrors('name').map((msg, i) => (
                    <span key={i} className="text-xs text-red-600 dark:text-red-400">{msg}</span>
                  ))}
                </div>

                <div className="grid g-2">
                  <div className="field">
                    <label className="label" htmlFor="ay-start">Start Date</label>
                    <input
                      id="ay-start"
                      type="date"
                      className="input"
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                      required
                    />
                    {fieldErrors('startDate').map((msg, i) => (
                      <span key={i} className="text-xs text-red-600 dark:text-red-400">{msg}</span>
                    ))}
                  </div>

                  <div className="field">
                    <label className="label" htmlFor="ay-end">End Date</label>
                    <input
                      id="ay-end"
                      type="date"
                      className="input"
                      value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                      required
                    />
                    {fieldErrors('endDate').map((msg, i) => (
                      <span key={i} className="text-xs text-red-600 dark:text-red-400">{msg}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-foot">
                <button type="button" className="btn btn-secondary" onClick={closeFormModal} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  <Icon name="checkCircle" size="sm" />
                  {submitting
                    ? modalMode === 'create'
                      ? 'Creating…'
                      : 'Saving…'
                    : modalMode === 'create'
                    ? 'Create Academic Year'
                    : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Single Academic Year Details Modal (GET /api/admin/academic-years/{id}) */}
      {detailYear && (
        <div className="overlay" onClick={() => setDetailYear(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <div className="modal-ico">
                <Icon name="calendar" size="lg" />
              </div>
              <div className="flex-1">
                <div className="row gap-2 align-center mb-1">
                  <h3>Academic Year {detailYear.name}</h3>
                  <span className={`badge ${detailYear.isActive ? 'badge-success' : 'badge-neutral'}`}>
                    {detailYear.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="mono text-xs">
                  ID #{detailYear.id} · {detailYear.startDate} to {detailYear.endDate}
                </p>
              </div>
            </div>

            <div className="modal-body col gap-3">
              <h4 className="text-sm fw-7">Associated Semesters ({detailYear.semesters.length})</h4>
              {detailYear.semesters.length === 0 ? (
                <p className="text-xs muted">No semesters are associated with this academic year yet.</p>
              ) : (
                <div className="col gap-2">
                  {detailYear.semesters.map(sem => (
                    <div key={sem.id} className="info-tile">
                      <div className="row-between">
                        <b>{sem.name}</b>
                        <div className="row gap-1.5">
                          <span className="badge badge-info no-dot">{sem.semesterType}</span>
                          <span className={`badge ${sem.isActive ? 'badge-success' : 'badge-neutral'}`}>
                            {sem.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      <span className="mono text-xs muted block mt-1">
                        {sem.startDate} → {sem.endDate}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-foot">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  const target = detailYear;
                  setDetailYear(null);
                  openEditModal(target);
                }}
              >
                <Icon name="edit" size="sm" /> Edit Year
              </button>
              <button type="button" className="btn btn-primary" onClick={() => setDetailYear(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
