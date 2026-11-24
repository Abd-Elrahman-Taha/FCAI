/**
 * Screen 95: Grade Scale Versions Management (Admin)
 *
 * Connected strictly to all 5 confirmed Swagger GradeScaleVersions endpoints:
 * - GET  /api/admin/grade-scale-versions
 * - POST /api/admin/grade-scale-versions
 * - GET  /api/admin/grade-scale-versions/{id}
 * - PUT  /api/admin/grade-scale-versions/{id}/scales
 * - POST /api/admin/grade-scale-versions/{id}/activate
 */

import React, { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from '../../services/api';
import type {
  GradeScaleRowDto,
  GradeScaleVersionDto,
  GradeScaleVersionSummaryDto,
} from '../../types/api';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

const emptyRow = (sortOrder: number): GradeScaleRowDto => ({
  id: null,
  symbol: '',
  scaleType: 'Letter',
  minPercentage: 0,
  maxPercentage: 100,
  gradePoints: 0,
  includedInGpa: true,
  appliesTo: 'All',
  description: '',
  sortOrder,
});

export const AdminGradeScale: React.FC = () => {
  const { showToast } = useAuth();

  const [versions, setVersions] = useState<GradeScaleVersionSummaryDto[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<GradeScaleVersionDto | null>(null);
  const [rows, setRows] = useState<GradeScaleRowDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Create modal
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [effectiveFrom, setEffectiveFrom] = useState<string>('');
  const [baseVersionId, setBaseVersionId] = useState<string>('');
  const [useDefaultScale, setUseDefaultScale] = useState<boolean>(true);
  const [creating, setCreating] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Save & Activate states
  const [savingScales, setSavingScales] = useState<boolean>(false);
  const [activating, setActivating] = useState<boolean>(false);
  const [warnings, setWarnings] = useState<string[]>([]);

  const loadVersionDetail = useCallback(async (id: number) => {
    setLoadingDetail(true);
    setWarnings([]);
    try {
      const detail = await api.policies.getGradeScaleVersionById(id);
      setSelectedVersion(detail);
      setRows((detail.scales ?? []).map(r => ({ ...r })));
    } catch (err: unknown) {
      showToast('Load Failed', err instanceof Error ? err.message : 'Failed to load version details.', 'error');
    } finally {
      setLoadingDetail(false);
    }
  }, [showToast]);

  const loadVersions = useCallback(async (keepId?: number) => {
    setLoading(true);
    setLoadError(null);
    try {
      const list = await api.policies.listGradeScaleVersions();
      setVersions(list);
      const targetId = keepId ?? list.find(v => v.isActive)?.id ?? list[0]?.id;
      if (targetId !== undefined) {
        const detail = await api.policies.getGradeScaleVersionById(targetId);
        setSelectedVersion(detail);
        setRows((detail.scales ?? []).map(r => ({ ...r })));
      } else {
        setSelectedVersion(null);
        setRows([]);
      }
    } catch (err: unknown) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load grade scale versions.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    api.policies
      .listGradeScaleVersions()
      .then(async list => {
        if (cancelled) return;
        setVersions(list);
        const targetId = list.find(v => v.isActive)?.id ?? list[0]?.id;
        if (targetId !== undefined) {
          const detail = await api.policies.getGradeScaleVersionById(targetId);
          if (!cancelled) {
            setSelectedVersion(detail);
            setRows((detail.scales ?? []).map(r => ({ ...r })));
          }
        }
        setLoadError(null);
      })
      .catch((err: unknown) => {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : 'Failed to load grade scales.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    if (!newName.trim() || !effectiveFrom) {
      setCreateError('Name and effective-from date are required.');
      return;
    }
    setCreating(true);
    try {
      const res = await api.policies.createGradeScaleVersion({
        name: newName.trim(),
        effectiveFrom,
        baseVersionId: baseVersionId ? Number(baseVersionId) : null,
        useDefaultScale: !baseVersionId && useDefaultScale,
      });
      showToast('Version Created', res.message, 'success');
      setShowCreate(false);
      setNewName('');
      setEffectiveFrom('');
      setBaseVersionId('');
      await loadVersions(res.data.id);
    } catch (err: unknown) {
      setCreateError(err instanceof ApiError || err instanceof Error ? err.message : 'Failed to create version.');
    } finally {
      setCreating(false);
    }
  };

  const updateRow = <K extends keyof GradeScaleRowDto>(index: number, field: K, value: GradeScaleRowDto[K]) => {
    setRows(prev => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
  };

  const handleSaveScales = async () => {
    if (!selectedVersion) return;
    setSavingScales(true);
    try {
      const res = await api.policies.setGradeScales(selectedVersion.id, {
        scales: rows.map((r, i) => ({ ...r, sortOrder: r.sortOrder || i + 1 })),
      });
      setSelectedVersion(res.data);
      setRows((res.data.scales ?? []).map(r => ({ ...r })));
      showToast('Grade Scale Saved', res.message, 'success');
      await loadVersions(selectedVersion.id);
    } catch (err: unknown) {
      showToast('Save Failed', err instanceof Error ? err.message : 'Failed to save grade scale rows.', 'error');
    } finally {
      setSavingScales(false);
    }
  };

  const handleActivate = async () => {
    if (!selectedVersion) return;
    setActivating(true);
    setWarnings([]);
    try {
      const res = await api.policies.activateGradeScaleVersion(selectedVersion.id);
      if (res.data.warnings && res.data.warnings.length > 0) {
        setWarnings(res.data.warnings);
      }
      showToast('Grade Scale Activated', res.message, 'success');
      await loadVersions(selectedVersion.id);
    } catch (err: unknown) {
      showToast('Activation Failed', err instanceof Error ? err.message : 'Failed to activate version.', 'error');
    } finally {
      setActivating(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHead
        crumbs={[
          { label: 'Admin', href: '#/admin/dashboard' },
          { label: 'Operations' },
          { label: 'Grade Scale Versions' },
        ]}
        title="Grade Scale Versions"
        subtitle="Manage versioned grading scales, edit draft grade-point rows, and activate new grading bylaws."
        actions={
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setShowCreate(true)}>
            <Icon name="plus" size="sm" /> New Grade Scale Version
          </button>
        }
      />

      {loading ? (
        <CardSkeleton />
      ) : loadError ? (
        <div className="card card-pad state">
          <div className="state-art danger"><Icon name="alert" size="lg" /></div>
          <h3>Could not load grade scales</h3>
          <p className="text-sm muted">{loadError}</p>
          <button type="button" className="btn btn-primary btn-sm mt-3" onClick={() => void loadVersions()}>Retry</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Versions List */}
          <div className="lg:col-span-4 space-y-3">
            <div className="card card-pad space-y-2">
              <div className="font-bold text-sm mb-2">Versions ({versions.length})</div>
              {versions.length === 0 ? (
                <p className="text-xs muted">No grade scale versions created yet.</p>
              ) : (
                versions.map(v => {
                  const isSelected = selectedVersion?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => void loadVersionDetail(v.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-sky-400 bg-sky-500/10'
                          : 'border-slate-200 dark:border-slate-800 hover:border-sky-400/50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-sm">{v.name || `Version #${v.id}`}</span>
                        <span className={v.isActive ? 'chip chip-primary' : 'chip'}>
                          {v.status || (v.isActive ? 'Active' : 'Draft')}
                        </span>
                      </div>
                      <div className="text-xs muted mt-1">
                        Effective: {v.effectiveFrom} · {v.scaleRowsCount} rows
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Selected Version Editor */}
          <div className="lg:col-span-8">
            {loadingDetail ? (
              <CardSkeleton />
            ) : !selectedVersion ? (
              <div className="card card-pad state">
                <div className="state-art"><Icon name="scale" size="lg" /></div>
                <h3>Select a Grade Scale Version</h3>
                <p className="text-sm muted">Choose a version from the left or create a new draft version.</p>
              </div>
            ) : (
              <div className="card card-pad space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold">{selectedVersion.name}</h3>
                      <span className={selectedVersion.isActive ? 'chip chip-primary' : 'chip'}>
                        {selectedVersion.status}
                      </span>
                    </div>
                    <p className="text-xs muted">
                      Effective from {selectedVersion.effectiveFrom}
                      {selectedVersion.effectiveTo ? ` to ${selectedVersion.effectiveTo}` : ''} ·{' '}
                      {selectedVersion.isEditable ? 'Editable Draft' : 'Locked'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedVersion.isEditable && (
                      <>
                        <button
                          type="button"
                          className="btn btn-outline btn-xs"
                          onClick={() => setRows(prev => [...prev, emptyRow(prev.length + 1)])}
                        >
                          <Icon name="plus" size="sm" /> Add Row
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary btn-xs"
                          disabled={savingScales}
                          onClick={() => void handleSaveScales()}
                        >
                          {savingScales ? 'Saving...' : 'Save Scales'}
                        </button>
                      </>
                    )}
                    {!selectedVersion.isActive && (
                      <button
                        type="button"
                        className="btn btn-primary btn-xs"
                        disabled={activating}
                        onClick={() => void handleActivate()}
                      >
                        {activating ? 'Activating...' : 'Activate Version'}
                      </button>
                    )}
                  </div>
                </div>

                {warnings.length > 0 && (
                  <div className="alert alert-warning text-xs space-y-1">
                    <div className="font-bold">Activation Warnings:</div>
                    {warnings.map((w, i) => <div key={i}>• {w}</div>)}
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="table w-full text-xs">
                    <thead>
                      <tr>
                        <th>Symbol</th>
                        <th>Type</th>
                        <th>Min %</th>
                        <th>Max %</th>
                        <th>Points</th>
                        <th>In GPA</th>
                        <th>Applies To</th>
                        <th>Order</th>
                        {selectedVersion.isEditable && <th />}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r, idx) => (
                        <tr key={r.id ?? `new-${idx}`}>
                          <td>
                            <input
                              className="input"
                              style={{ minWidth: '64px' }}
                              disabled={!selectedVersion.isEditable}
                              value={r.symbol ?? ''}
                              onChange={e => updateRow(idx, 'symbol', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              className="input"
                              style={{ minWidth: '88px' }}
                              disabled={!selectedVersion.isEditable}
                              value={r.scaleType ?? ''}
                              onChange={e => updateRow(idx, 'scaleType', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              step="0.01"
                              className="input"
                              style={{ width: '74px' }}
                              disabled={!selectedVersion.isEditable}
                              value={r.minPercentage ?? ''}
                              onChange={e => updateRow(idx, 'minPercentage', e.target.value === '' ? null : Number(e.target.value))}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              step="0.01"
                              className="input"
                              style={{ width: '74px' }}
                              disabled={!selectedVersion.isEditable}
                              value={r.maxPercentage ?? ''}
                              onChange={e => updateRow(idx, 'maxPercentage', e.target.value === '' ? null : Number(e.target.value))}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              step="0.01"
                              className="input"
                              style={{ width: '72px' }}
                              disabled={!selectedVersion.isEditable}
                              value={r.gradePoints ?? ''}
                              onChange={e => updateRow(idx, 'gradePoints', e.target.value === '' ? null : Number(e.target.value))}
                            />
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              disabled={!selectedVersion.isEditable}
                              checked={r.includedInGpa}
                              onChange={e => updateRow(idx, 'includedInGpa', e.target.checked)}
                            />
                          </td>
                          <td>
                            <input
                              className="input"
                              style={{ minWidth: '88px' }}
                              disabled={!selectedVersion.isEditable}
                              value={r.appliesTo ?? ''}
                              onChange={e => updateRow(idx, 'appliesTo', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="input"
                              style={{ width: '64px' }}
                              disabled={!selectedVersion.isEditable}
                              value={r.sortOrder}
                              onChange={e => updateRow(idx, 'sortOrder', Number(e.target.value))}
                            />
                          </td>
                          {selectedVersion.isEditable && (
                            <td>
                              <button
                                type="button"
                                className="btn btn-danger btn-xs"
                                onClick={() => setRows(prev => prev.filter((_, i) => i !== idx))}
                              >
                                ×
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Version Modal */}
      {showCreate && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal card card-pad" style={{ maxWidth: '480px', width: '100%' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">New Grade Scale Version</h3>
              <button type="button" className="icon-btn" onClick={() => !creating && setShowCreate(false)}>
                <Icon name="x" size="sm" />
              </button>
            </div>
            {createError && (
              <div className="alert alert-danger mb-3 text-sm">
                <Icon name="alert" size="sm" />
                <span>{createError}</span>
              </div>
            )}
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="label">Version Name</label>
                <input
                  className="input"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Bylaw 2026 Grade Scale"
                  required
                />
              </div>
              <div>
                <label className="label">Effective From</label>
                <input
                  type="date"
                  className="input"
                  value={effectiveFrom}
                  onChange={e => setEffectiveFrom(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label">Clone From Base Version (Optional)</label>
                <select className="input" value={baseVersionId} onChange={e => setBaseVersionId(e.target.value)}>
                  <option value="">None</option>
                  {versions.map(v => (
                    <option key={v.id} value={String(v.id)}>
                      {v.name} (#{v.id})
                    </option>
                  ))}
                </select>
              </div>
              {!baseVersionId && (
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useDefaultScale}
                    onChange={e => setUseDefaultScale(e.target.checked)}
                  />
                  <span>Initialize with default FCAI grade scale rows</span>
                </label>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="btn btn-outline" onClick={() => setShowCreate(false)} disabled={creating}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={creating}>
                  {creating ? 'Creating...' : 'Create Draft'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
