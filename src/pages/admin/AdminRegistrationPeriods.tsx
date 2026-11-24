/**
 * Screen 91 / Semesters & Operational Windows Management (Admin)
 *
 * Connected strictly to all 10 confirmed Swagger AdminSemesters endpoints:
 * - GET  /api/admin/semesters?yearId=
 * - POST /api/admin/semesters
 * - GET  /api/admin/semesters/{id}
 * - PUT  /api/admin/semesters/{id}
 * - POST /api/admin/semesters/{id}/activate
 * - PUT  /api/admin/semesters/{id}/windows/registration
 * - PUT  /api/admin/semesters/{id}/windows/drop
 * - PUT  /api/admin/semesters/{id}/windows/withdrawal
 * - PUT  /api/admin/semesters/{id}/windows/preference
 * - POST /api/admin/semesters/{id}/calculate-levels
 */

import React, { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from '../../services/api';
import type {
  AcademicYear,
  CalculateLevelsResultDto,
  SemesterDto,
  SemesterType,
  WindowDto,
} from '../../types/api';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { ActiveSemesterCard } from '../../components/common/ActiveSemesterCard';
import { useAuth } from '../../context/AuthContext';
import { useAcademic } from '../../context/AcademicContext';

type WindowKey = 'registration' | 'drop' | 'withdrawal' | 'preference';

const WINDOW_LABELS: Record<WindowKey, string> = {
  registration: 'Registration Window',
  drop: 'Drop Window',
  withdrawal: 'Withdrawal Window',
  preference: 'Preference Window',
};

const toDatetimeLocal = (iso: string | null | undefined): string => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const toIsoUtc = (localValue: string): string => {
  const d = new Date(localValue);
  return Number.isNaN(d.getTime()) ? localValue : d.toISOString();
};

const windowBadgeClass = (status: string | undefined): string => {
  if (status === 'Open') return 'chip chip-primary';
  if (status === 'Upcoming') return 'chip chip-info';
  if (status === 'Closed') return 'chip chip-danger';
  return 'chip';
};

export const AdminRegistrationPeriods: React.FC = () => {
  const { showToast } = useAuth();
  const { refreshActiveSemester } = useAcademic();

  const [years, setYears] = useState<AcademicYear[]>([]);
  const [selectedYearId, setSelectedYearId] = useState<string>('');
  const [semesters, setSemesters] = useState<SemesterDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Selected semester detail
  const [detailSemester, setDetailSemester] = useState<SemesterDto | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  // Create / Edit Semester modal
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [academicYearId, setAcademicYearId] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [semesterType, setSemesterType] = useState<SemesterType>('Fall');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formApiError, setFormApiError] = useState<ApiError | null>(null);

  // Window edit modal
  const [windowModal, setWindowModal] = useState<{
    semester: SemesterDto;
    key: WindowKey;
  } | null>(null);
  const [windowStart, setWindowStart] = useState<string>('');
  const [windowEnd, setWindowEnd] = useState<string>('');
  const [savingWindow, setSavingWindow] = useState<boolean>(false);
  const [windowError, setWindowError] = useState<string | null>(null);

  // Calculate levels modal
  const [calcModalSemester, setCalcModalSemester] = useState<SemesterDto | null>(null);
  const [calcForce, setCalcForce] = useState<boolean>(false);
  const [calcStudentIdsText, setCalcStudentIdsText] = useState<string>('');
  const [calculating, setCalculating] = useState<boolean>(false);
  const [calcResult, setCalcResult] = useState<CalculateLevelsResultDto | null>(null);

  const loadSemesters = useCallback(async (yearIdFilter?: string) => {
    setLoading(true);
    setLoadError(null);
    try {
      const yId = yearIdFilter ? Number(yearIdFilter) : undefined;
      const list = await api.semesters.getAll(Number.isFinite(yId) ? yId : undefined);
      setSemesters(list);
    } catch (err: unknown) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load semesters.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all([api.academicYears.getAll(), api.semesters.getAll()])
      .then(([yrList, semList]) => {
        if (cancelled) return;
        setYears(yrList);
        setSemesters(semList);
        setLoadError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setLoadError(err instanceof Error ? err.message : 'Failed to load semesters.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleYearFilterChange = (val: string) => {
    setSelectedYearId(val);
    void loadSemesters(val);
  };

  const openCreateModal = () => {
    setModalMode('create');
    setEditingId(null);
    const defaultYear = selectedYearId || (years[0]?.id ? String(years[0].id) : '');
    setAcademicYearId(defaultYear);
    setName('');
    setSemesterType('Fall');
    setStartDate('');
    setEndDate('');
    setFormError(null);
    setFormApiError(null);
  };

  const openEditModal = async (sem: SemesterDto) => {
    setBusyId(sem.id);
    setFormError(null);
    setFormApiError(null);
    try {
      const fresh = await api.semesters.getById(sem.id);
      setEditingId(fresh.id);
      setAcademicYearId(String(fresh.academicYearId));
      setName(fresh.name ?? '');
      setSemesterType(fresh.semesterType);
      setStartDate(fresh.startDate);
      setEndDate(fresh.endDate);
      setModalMode('edit');
    } catch (err: unknown) {
      showToast('Load Failed', err instanceof Error ? err.message : 'Failed to load semester.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const openDetails = async (id: number) => {
    setBusyId(id);
    try {
      const fresh = await api.semesters.getById(id);
      setDetailSemester(fresh);
    } catch (err: unknown) {
      showToast('Load Failed', err instanceof Error ? err.message : 'Failed to load semester details.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const handleSaveSemester = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormApiError(null);
    if (!name.trim() || !startDate || !endDate) {
      setFormError('Semester name, start date, and end date are required.');
      return;
    }
    if (startDate >= endDate) {
      setFormError('End date must be strictly after start date.');
      return;
    }
    if (modalMode === 'create' && !academicYearId) {
      setFormError('Please select an academic year.');
      return;
    }

    setSubmitting(true);
    try {
      if (modalMode === 'create') {
        const res = await api.semesters.create({
          academicYearId: Number(academicYearId),
          name: name.trim(),
          semesterType,
          startDate,
          endDate,
        });
        showToast('Semester Created', res.message, 'success');
      } else if (modalMode === 'edit' && editingId !== null) {
        const res = await api.semesters.update(editingId, {
          name: name.trim(),
          startDate,
          endDate,
        });
        showToast('Semester Updated', res.message, 'success');
      }
      setModalMode(null);
      await loadSemesters(selectedYearId);
      await refreshActiveSemester();
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setFormApiError(err);
        setFormError(err.message);
      } else {
        setFormError(err instanceof Error ? err.message : 'Failed to save semester.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleActivate = async (sem: SemesterDto) => {
    setBusyId(sem.id);
    try {
      const res = await api.semesters.activate(sem.id);
      showToast('Semester Activated', res.message, 'success');
      await loadSemesters(selectedYearId);
      await refreshActiveSemester();
    } catch (err: unknown) {
      showToast('Activation Failed', err instanceof Error ? err.message : 'Could not activate semester.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const openWindowModal = (semester: SemesterDto, key: WindowKey) => {
    const win: WindowDto | undefined = semester.windows?.[key];
    setWindowModal({ semester, key });
    setWindowStart(toDatetimeLocal(win?.start));
    setWindowEnd(toDatetimeLocal(win?.end));
    setWindowError(null);
  };

  const handleSaveWindow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!windowModal) return;
    setWindowError(null);
    const { semester, key } = windowModal;

    if (key === 'drop') {
      if (!windowEnd) {
        setWindowError('Drop period end date/time is required.');
        return;
      }
      setSavingWindow(true);
      try {
        const res = await api.semesters.setDropWindow(semester.id, { dropEnd: toIsoUtc(windowEnd) });
        showToast('Drop Window Updated', res.message, 'success');
        setWindowModal(null);
        await loadSemesters(selectedYearId);
        await refreshActiveSemester();
      } catch (err: unknown) {
        setWindowError(err instanceof Error ? err.message : 'Failed to update drop window.');
      } finally {
        setSavingWindow(false);
      }
      return;
    }

    if (!windowStart || !windowEnd) {
      setWindowError('Start and end date/time are both required.');
      return;
    }
    const startIso = toIsoUtc(windowStart);
    const endIso = toIsoUtc(windowEnd);
    if (new Date(startIso) >= new Date(endIso)) {
      setWindowError('Window end time must be after start time.');
      return;
    }

    setSavingWindow(true);
    try {
      const payload = { start: startIso, end: endIso };
      const res =
        key === 'registration'
          ? await api.semesters.setRegistrationWindow(semester.id, payload)
          : key === 'withdrawal'
          ? await api.semesters.setWithdrawalWindow(semester.id, payload)
          : await api.semesters.setPreferenceWindow(semester.id, payload);
      showToast('Window Updated', res.message, 'success');
      setWindowModal(null);
      await loadSemesters(selectedYearId);
      await refreshActiveSemester();
    } catch (err: unknown) {
      setWindowError(err instanceof Error ? err.message : 'Failed to update operational window.');
    } finally {
      setSavingWindow(false);
    }
  };

  const handleCalculateLevels = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!calcModalSemester) return;
    setCalculating(true);
    setCalcResult(null);
    try {
      const parsedIds = calcStudentIdsText
        .split(/[,\s]+/)
        .map(v => Number(v.trim()))
        .filter(n => Number.isInteger(n) && n > 0);
      const res = await api.semesters.calculateLevels(calcModalSemester.id, {
        force: calcForce,
        studentIds: parsedIds.length > 0 ? parsedIds : null,
      });
      setCalcResult(res.data);
      showToast('Levels Calculated', res.message, 'success');
    } catch (err: unknown) {
      showToast('Calculation Failed', err instanceof Error ? err.message : 'Failed to calculate levels.', 'error');
    } finally {
      setCalculating(false);
    }
  };

  const renderWindowCell = (sem: SemesterDto, key: WindowKey) => {
    const win = sem.windows?.[key];
    return (
      <div className="flex flex-col gap-1">
        <span className={windowBadgeClass(win?.status)} style={{ width: 'fit-content', fontSize: '11px' }}>
          {win?.status || 'NotConfigured'}
        </span>
        <span className="text-[11px] muted">
          {win?.start ? new Date(win.start).toLocaleDateString() : '—'} →{' '}
          {win?.end ? new Date(win.end).toLocaleDateString() : '—'}
        </span>
        <button
          type="button"
          className="btn btn-ghost btn-xs"
          style={{ width: 'fit-content', padding: '2px 6px' }}
          onClick={() => openWindowModal(sem, key)}
        >
          Configure
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHead
        crumbs={[
          { label: 'Admin', href: '#/admin/dashboard' },
          { label: 'Academic Structure', href: '#/admin/academic-years' },
          { label: 'Semesters & Operational Windows' },
        ]}
        title="Semesters & Operational Windows"
        subtitle="Create and activate semesters, configure registration/drop/withdrawal/preference windows, and calculate student academic levels."
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <select
              className="input"
              style={{ width: 'auto', minWidth: '190px' }}
              value={selectedYearId}
              onChange={e => handleYearFilterChange(e.target.value)}
              aria-label="Filter by academic year"
            >
              <option value="">All Academic Years</option>
              {years.map(y => (
                <option key={y.id} value={String(y.id)}>
                  {y.name} {y.isActive ? '(Active)' : ''}
                </option>
              ))}
            </select>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => void loadSemesters(selectedYearId)}>
              <Icon name="refresh" size="sm" /> Refresh
            </button>
            <button type="button" className="btn btn-primary btn-sm" onClick={openCreateModal}>
              <Icon name="plus" size="sm" /> Create Semester
            </button>
          </div>
        }
      />

      <ActiveSemesterCard />

      {loading ? (
        <CardSkeleton />
      ) : loadError ? (
        <div className="card card-pad state">
          <div className="state-art danger">
            <Icon name="alert" size="lg" />
          </div>
          <h3>Could not load semesters</h3>
          <p className="text-sm muted">{loadError}</p>
          <button type="button" className="btn btn-primary btn-sm mt-3" onClick={() => void loadSemesters(selectedYearId)}>
            Retry
          </button>
        </div>
      ) : semesters.length === 0 ? (
        <div className="card card-pad state">
          <div className="state-art">
            <Icon name="calendarCheck" size="lg" />
          </div>
          <h3>No Semesters Found</h3>
          <p className="text-sm muted">Create a semester under an academic year to manage registration and academic windows.</p>
          <button type="button" className="btn btn-primary btn-sm mt-3" onClick={openCreateModal}>
            <Icon name="plus" size="sm" /> Create Semester
          </button>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Semester</th>
                <th>Academic Year</th>
                <th>Dates</th>
                <th>Registration</th>
                <th>Drop</th>
                <th>Withdrawal</th>
                <th>Preference</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {semesters.map(sem => (
                <tr key={sem.id}>
                  <td>
                    <div className="font-semibold">{sem.name || `Semester #${sem.id}`}</div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="chip">{sem.semesterType}</span>
                      {sem.isActive && <span className="chip chip-primary">Active</span>}
                    </div>
                  </td>
                  <td className="text-sm">{sem.academicYearName || `Year #${sem.academicYearId}`}</td>
                  <td className="text-xs font-mono">
                    <div>{sem.startDate}</div>
                    <div className="muted">→ {sem.endDate}</div>
                  </td>
                  <td>{renderWindowCell(sem, 'registration')}</td>
                  <td>{renderWindowCell(sem, 'drop')}</td>
                  <td>{renderWindowCell(sem, 'withdrawal')}</td>
                  <td>{renderWindowCell(sem, 'preference')}</td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1.5 flex-wrap">
                      <button
                        type="button"
                        className="btn btn-outline btn-xs"
                        disabled={busyId === sem.id}
                        onClick={() => void openDetails(sem.id)}
                      >
                        Details
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline btn-xs"
                        disabled={busyId === sem.id}
                        onClick={() => void openEditModal(sem)}
                      >
                        Edit
                      </button>
                      {!sem.isActive && (
                        <button
                          type="button"
                          className="btn btn-primary btn-xs"
                          disabled={busyId === sem.id}
                          onClick={() => void handleActivate(sem)}
                        >
                          Activate
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn btn-outline btn-xs"
                        onClick={() => {
                          setCalcModalSemester(sem);
                          setCalcForce(false);
                          setCalcStudentIdsText('');
                          setCalcResult(null);
                        }}
                      >
                        Calc Levels
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Semester Modal */}
      {modalMode && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal card card-pad" style={{ maxWidth: '520px', width: '100%' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">
                {modalMode === 'create' ? 'Create Semester' : 'Edit Semester'}
              </h3>
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

            <form onSubmit={handleSaveSemester} className="space-y-4">
              {modalMode === 'create' && (
                <>
                  <div>
                    <label className="label">Academic Year</label>
                    <select
                      className="input"
                      value={academicYearId}
                      onChange={e => setAcademicYearId(e.target.value)}
                      required
                    >
                      <option value="">Select Academic Year...</option>
                      {years.map(y => (
                        <option key={y.id} value={String(y.id)}>
                          {y.name} ({y.startDate} → {y.endDate})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label">Semester Type</label>
                    <select
                      className="input"
                      value={semesterType}
                      onChange={e => setSemesterType(e.target.value as SemesterType)}
                    >
                      <option value="Fall">Fall</option>
                      <option value="Spring">Spring</option>
                      <option value="Summer">Summer</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="label">Semester Name</label>
                <input
                  className="input"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Fall 2026"
                  required
                />
                {formApiError?.getFieldErrors('name').map((msg, i) => (
                  <p key={i} className="text-xs text-red-500 mt-1">{msg}</p>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="label">Start Date</label>
                  <input
                    type="date"
                    className="input"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="label">End Date</label>
                  <input
                    type="date"
                    className="input"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="btn btn-outline" onClick={() => setModalMode(null)} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : modalMode === 'create' ? 'Create Semester' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Window Configuration Modal */}
      {windowModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal card card-pad" style={{ maxWidth: '480px', width: '100%' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">{WINDOW_LABELS[windowModal.key]}</h3>
                <p className="text-xs muted">{windowModal.semester.name}</p>
              </div>
              <button type="button" className="icon-btn" onClick={() => !savingWindow && setWindowModal(null)}>
                <Icon name="x" size="sm" />
              </button>
            </div>

            {windowError && (
              <div className="alert alert-danger mb-3 text-sm">
                <Icon name="alert" size="sm" />
                <span>{windowError}</span>
              </div>
            )}

            <form onSubmit={handleSaveWindow} className="space-y-4">
              {windowModal.key !== 'drop' && (
                <div>
                  <label className="label">Start Date &amp; Time</label>
                  <input
                    type="datetime-local"
                    className="input"
                    value={windowStart}
                    onChange={e => setWindowStart(e.target.value)}
                    required
                  />
                </div>
              )}
              <div>
                <label className="label">
                  {windowModal.key === 'drop' ? 'Drop Period End Date & Time' : 'End Date & Time'}
                </label>
                <input
                  type="datetime-local"
                  className="input"
                  value={windowEnd}
                  onChange={e => setWindowEnd(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="btn btn-outline" onClick={() => setWindowModal(null)} disabled={savingWindow}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={savingWindow}>
                  {savingWindow ? 'Saving...' : 'Save Window'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Calculate Levels Modal */}
      {calcModalSemester && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal card card-pad" style={{ maxWidth: '520px', width: '100%' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">Calculate Student Levels</h3>
                <p className="text-xs muted">{calcModalSemester.name}</p>
              </div>
              <button type="button" className="icon-btn" onClick={() => !calculating && setCalcModalSemester(null)}>
                <Icon name="x" size="sm" />
              </button>
            </div>

            <form onSubmit={handleCalculateLevels} className="space-y-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={calcForce}
                  onChange={e => setCalcForce(e.target.checked)}
                />
                <span>Force recalculation for students who already have a level snapshot</span>
              </label>

              <div>
                <label className="label">Specific Student IDs (optional, comma-separated)</label>
                <input
                  className="input"
                  value={calcStudentIdsText}
                  onChange={e => setCalcStudentIdsText(e.target.value)}
                  placeholder="Leave blank to calculate for all students"
                />
              </div>

              {calcResult && (
                <div className="card card-pad bg-slate-50 dark:bg-slate-900/50 space-y-2 text-sm">
                  <div className="font-bold">Calculation Summary</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>Total Processed: <b>{calcResult.totalStudentsProcessed}</b></div>
                    <div>Created: <b>{calcResult.createdCount}</b></div>
                    <div>Updated: <b>{calcResult.updatedCount}</b></div>
                    <div>Skipped: <b>{calcResult.skippedCount}</b></div>
                    <div>Failed: <b>{calcResult.failedCount}</b></div>
                  </div>
                  {calcResult.failures && calcResult.failures.length > 0 && (
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-xs space-y-1">
                      <div className="font-semibold text-red-500">Failures:</div>
                      {calcResult.failures.slice(0, 10).map((f, idx) => (
                        <div key={idx}>
                          Student #{f.studentId}: {f.error || 'Unknown error'}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="btn btn-outline" onClick={() => setCalcModalSemester(null)}>
                  Close
                </button>
                <button type="submit" className="btn btn-primary" disabled={calculating}>
                  {calculating ? 'Calculating...' : 'Run Calculation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Semester Details Modal */}
      {detailSemester && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal card card-pad" style={{ maxWidth: '560px', width: '100%' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">{detailSemester.name}</h3>
                <p className="text-xs muted">
                  ID #{detailSemester.id} · {detailSemester.academicYearName} · {detailSemester.semesterType}
                </p>
              </div>
              <button type="button" className="icon-btn" onClick={() => setDetailSemester(null)}>
                <Icon name="x" size="sm" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="muted">Duration</span>
                <span className="font-mono">{detailSemester.startDate} → {detailSemester.endDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="muted">Status</span>
                <span className={detailSemester.isActive ? 'chip chip-primary' : 'chip'}>
                  {detailSemester.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {(['registration', 'drop', 'withdrawal', 'preference'] as WindowKey[]).map(key => {
                  const win = detailSemester.windows?.[key];
                  return (
                    <div key={key} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs">{WINDOW_LABELS[key]}</span>
                        <span className={windowBadgeClass(win?.status)} style={{ fontSize: '11px' }}>
                          {win?.status || 'NotConfigured'}
                        </span>
                      </div>
                      <div className="text-xs muted">
                        Start: {win?.start ? new Date(win.start).toLocaleString() : '—'}
                      </div>
                      <div className="text-xs muted">
                        End: {win?.end ? new Date(win.end).toLocaleString() : '—'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button type="button" className="btn btn-primary btn-sm" onClick={() => setDetailSemester(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
