/**
 * Screen 87: Academic Levels Management (Admin)
 *
 * Connected strictly to confirmed Swagger endpoints:
 * - GET /api/admin/academic-levels (optional query parameter: policyVersionId)
 * - PUT /api/admin/academic-levels ({ policyVersionId, levels: [{ levelNumber, fromCredits, toCredits }] })
 *
 * Supports dynamic level counts (2–10 levels), Arabic & English level names,
 * `fromCredits` / `toCredits` (never minCredits/maxCredits), client pre-checks,
 * and backend validation error display as final authority.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { api, ApiError } from '../../services/api';
import type { AcademicLevel, AcademicLevelsResponse } from '../../types/api/academic.types';
import type { PolicyVersionListItemDto } from '../../types/api';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

interface EditableLevelRow {
  id: number | null;
  levelNumber: number;
  name: string;
  nameAr: string;
  fromCredits: string;
  toCredits: string;
  isLastLevel: boolean;
}

function toEditableRows(levels: AcademicLevel[]): EditableLevelRow[] {
  return [...levels]
    .sort((a, b) => a.levelNumber - b.levelNumber)
    .map(lvl => ({
      id: lvl.id,
      levelNumber: lvl.levelNumber,
      name: lvl.name,
      nameAr: lvl.nameAr,
      fromCredits: String(lvl.fromCredits),
      toCredits: String(lvl.toCredits),
      isLastLevel: lvl.isLastLevel,
    }));
}

export const AdminLevels: React.FC = () => {
  const { showToast } = useAuth();

  const [policies, setPolicies] = useState<PolicyVersionListItemDto[]>([]);
  const [policyInput, setPolicyInput] = useState<string>('');
  const [appliedPolicyId, setAppliedPolicyId] = useState<number | undefined>(undefined);

  const [responseMeta, setResponseMeta] = useState<AcademicLevelsResponse | null>(null);
  const [rows, setRows] = useState<EditableLevelRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [saving, setSaving] = useState<boolean>(false);
  const [saveApiError, setSaveApiError] = useState<ApiError | null>(null);
  const [clientWarnings, setClientWarnings] = useState<string[]>([]);

  const loadLevels = useCallback(async (policyVersionId?: number) => {
    setLoading(true);
    setLoadError(null);
    setSaveApiError(null);
    setClientWarnings([]);

    try {
      const res = await api.academicLevels.getAll(policyVersionId);
      setResponseMeta(res);
      setRows(toEditableRows(res.levels));
    } catch (err: unknown) {
      setResponseMeta(null);
      setRows([]);
      const msg =
        err instanceof ApiError || err instanceof Error
          ? err.message
          : 'Failed to load academic levels from backend.';
      setLoadError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    api.policies
      .listPolicies()
      .then(list => {
        if (!cancelled) setPolicies(list);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    api.academicLevels
      .getAll(appliedPolicyId)
      .then(res => {
        if (cancelled) return;
        setResponseMeta(res);
        setRows(toEditableRows(res.levels));
        setLoadError(null);
        setSaveApiError(null);
        setClientWarnings([]);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setResponseMeta(null);
        setRows([]);
        const msg =
          err instanceof ApiError || err instanceof Error
            ? err.message
            : 'Failed to load academic levels from backend.';
        setLoadError(msg);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [appliedPolicyId]);

  const handlePolicyFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = policyInput.trim();
    if (!trimmed) {
      setAppliedPolicyId(undefined);
      return;
    }
    const parsed = Number(trimmed);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      showToast('Invalid Policy Version ID', 'Please enter a positive whole number or leave empty for the active policy.', 'error');
      return;
    }
    setAppliedPolicyId(parsed);
  };

  const handleResetActivePolicy = () => {
    setPolicyInput('');
    setAppliedPolicyId(undefined);
  };

  const handleRowChange = (index: number, field: 'fromCredits' | 'toCredits', value: string) => {
    setRows(prev =>
      prev.map((row, idx) => (idx === index ? { ...row, [field]: value } : row))
    );
  };

  const handleAddLevel = () => {
    if (rows.length >= 10) return;
    const prevLast = rows[rows.length - 1];
    const nextNum = rows.length + 1;
    const startVal = prevLast ? prevLast.toCredits : '0';
    const endVal = responseMeta ? String(responseMeta.policyTotalCredits) : startVal;

    setRows(prev => [
      ...prev.map(r => ({ ...r, isLastLevel: false })),
      {
        id: null,
        levelNumber: nextNum,
        name: `Level ${nextNum}`,
        nameAr: `المستوى ${nextNum}`,
        fromCredits: startVal,
        toCredits: endVal,
        isLastLevel: true,
      },
    ]);
  };

  const handleRemoveLevel = (index: number) => {
    if (rows.length <= 2) return;
    setRows(prev => {
      const remaining = prev.filter((_, idx) => idx !== index);
      return remaining.map((row, idx) => ({
        ...row,
        levelNumber: idx + 1,
        isLastLevel: idx === remaining.length - 1,
      }));
    });
  };

  /**
   * Client-side range validation helper (backend remains final authority).
   */
  const validateRanges = (items: EditableLevelRow[], totalCredits: number): string[] => {
    const issues: string[] = [];
    if (items.length < 2 || items.length > 10) {
      issues.push('Academic levels must contain between 2 and 10 levels.');
    }

    const numericRows = items.map(r => ({
      levelNumber: r.levelNumber,
      fromCredits: Number(r.fromCredits),
      toCredits: Number(r.toCredits),
    }));

    numericRows.forEach((r, idx) => {
      if (Number.isNaN(r.fromCredits) || Number.isNaN(r.toCredits)) {
        issues.push(`Level ${r.levelNumber}: fromCredits and toCredits must be valid numbers.`);
        return;
      }
      if (r.fromCredits < 0 || r.toCredits <= r.fromCredits) {
        issues.push(`Level ${r.levelNumber}: toCredits (${r.toCredits}) must be greater than fromCredits (${r.fromCredits}).`);
      }
      if (idx === 0 && r.fromCredits !== 0) {
        issues.push('Level 1 must start at 0 credits.');
      }
      if (idx > 0 && r.fromCredits !== numericRows[idx - 1].toCredits) {
        issues.push(
          `Level ${r.levelNumber} fromCredits (${r.fromCredits}) must equal Level ${numericRows[idx - 1].levelNumber} toCredits (${numericRows[idx - 1].toCredits}) with no gaps or overlaps.`
        );
      }
      if (idx === numericRows.length - 1 && r.toCredits !== totalCredits) {
        issues.push(`Final level (Level ${r.levelNumber}) toCredits (${r.toCredits}) must end at policyTotalCredits (${totalCredits}).`);
      }
    });

    return issues;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseMeta) return;

    setSaveApiError(null);
    const issues = validateRanges(rows, responseMeta.policyTotalCredits);
    setClientWarnings(issues);
    if (issues.length > 0) {
      return;
    }

    setSaving(true);
    try {
      const payload = {
        policyVersionId: responseMeta.policyVersionId,
        levels: rows.map((row, idx) => ({
          levelNumber: idx + 1,
          fromCredits: Number(row.fromCredits),
          toCredits: Number(row.toCredits),
        })),
      };

      const res = await api.academicLevels.update(payload);
      setResponseMeta(res.data);
      setRows(toEditableRows(res.data.levels));
      showToast('Academic Levels Saved', res.message, 'success');
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setSaveApiError(err);
      } else {
        showToast(
          'Update Failed',
          err instanceof Error ? err.message : 'Failed to update academic levels.',
          'error'
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const getRowFieldErrors = (index: number, field: 'fromCredits' | 'toCredits' | 'levelNumber'): string[] => {
    if (!saveApiError) return [];
    return [
      ...saveApiError.getFieldErrors(`levels[${index}].${field}`),
      ...saveApiError.getFieldErrors(`levels.${index}.${field}`),
    ];
  };

  return (
    <div>
      <PageHead
        title="Academic Levels Governance"
        subtitle="Inspect and update policy credit bands (fromCredits → toCredits) directly against the backend."
        breadcrumbs={[
          { label: 'College Admin', href: '#/admin/dashboard' },
          { label: 'Academic Years', href: '#/admin/academic-years' },
          { label: 'Academic Levels' }
        ]}
        actions={
          <div className="row gap-2 wrap">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => loadLevels(appliedPolicyId)}
              disabled={loading}
            >
              <Icon name="refresh" size="sm" /> {loading ? 'Loading…' : 'Reload'}
            </button>
          </div>
        }
      />

      {/* Optional Policy Version Filter (GET /api/admin/academic-levels?policyVersionId=...) */}
      <div className="card p-4 mb-5">
        <form onSubmit={handlePolicyFilterSubmit} className="row-between wrap gap-3 align-center">
          <div className="row gap-2 wrap align-center">
            <label htmlFor="policy-version-input" className="text-xs fw-7 muted">
              Policy Version:
            </label>
            <select
              id="policy-version-input"
              className="input"
              style={{ width: 'auto', minWidth: '220px', height: '38px' }}
              value={policyInput}
              onChange={e => {
                const val = e.target.value;
                setPolicyInput(val);
                setAppliedPolicyId(val ? Number(val) : undefined);
              }}
            >
              <option value="">Active Policy (Default)</option>
              {policies.map(p => (
                <option key={p.id} value={String(p.id)}>
                  {p.name || `Policy v${p.versionNumber}`} (#{p.id}){p.isActive ? ' · Active' : ''}
                </option>
              ))}
            </select>
            <button type="submit" className="btn btn-secondary btn-sm" disabled={loading}>
              Load Policy
            </button>
            {appliedPolicyId !== undefined && (
              <button type="button" className="btn btn-ghost btn-sm" onClick={handleResetActivePolicy}>
                Use Active Policy
              </button>
            )}
          </div>

          {responseMeta && (
            <div className="row gap-2 wrap">
              <span className="badge badge-info no-dot">
                Policy Version #{responseMeta.policyVersionId}
              </span>
              <span className="badge badge-primary no-dot">
                Policy Total Credits: {responseMeta.policyTotalCredits}
              </span>
              <span className="badge badge-neutral no-dot">
                {rows.length} Levels (2–10 allowed)
              </span>
            </div>
          )}
        </form>
      </div>

      {/* Load Error */}
      {loadError && (
        <div className="alert alert-danger mb-5" role="alert">
          <Icon name="alertCircle" />
          <div className="flex-1">
            <b>Unable to Load Academic Levels</b>
            <p className="text-xs mt-1">{loadError}</p>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => loadLevels(appliedPolicyId)}>
            <Icon name="refresh" size="sm" /> Retry
          </button>
        </div>
      )}

      {loading && !responseMeta ? (
        <CardSkeleton count={3} />
      ) : responseMeta ? (
        <form onSubmit={handleSave} noValidate>
          {/* Client Pre-Validation Issues */}
          {clientWarnings.length > 0 && (
            <div className="alert alert-warning mb-4" role="alert">
              <Icon name="alertCircle" />
              <div>
                <b>Please Fix Credit Range Rules Before Saving</b>
                <ul className="text-xs mt-1" style={{ paddingLeft: '18px', margin: 0 }}>
                  {clientWarnings.map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Backend Validation / Business Rule Error */}
          {saveApiError && (
            <div className="alert alert-danger mb-4" role="alert">
              <Icon name="alertCircle" />
              <div>
                <b>Backend Rejected Update (HTTP {saveApiError.status})</b>
                <p className="text-xs mt-0.5">{saveApiError.message}</p>
                {saveApiError.getAllValidationMessages().length > 0 && (
                  <ul className="text-xs mt-1" style={{ paddingLeft: '18px', margin: 0 }}>
                    {saveApiError.getAllValidationMessages().map((msg, idx) => (
                      <li key={idx}>{msg}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          <div className="card overflow-hidden">
            <div className="card-head wrap gap-2">
              <div>
                <h3>Credit Ranges for Policy Version #{responseMeta.policyVersionId}</h3>
                <p className="text-xs muted">
                  Ranges must start at 0, be contiguous, and end at exactly <b>{responseMeta.policyTotalCredits}</b> credits.
                </p>
              </div>
              <div className="row gap-2">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleAddLevel}
                  disabled={rows.length >= 10 || saving}
                >
                  <Icon name="plus" size="sm" /> Add Level
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={saving}
                >
                  <Icon name="checkCircle" size="sm" />
                  {saving ? 'Saving…' : 'Save Academic Levels'}
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: '90px' }}>Level #</th>
                    <th>English Name</th>
                    <th>Arabic Name</th>
                    <th style={{ width: '170px' }}>From Credits</th>
                    <th style={{ width: '170px' }}>To Credits</th>
                    <th style={{ width: '120px' }} className="text-center">Flag</th>
                    <th style={{ width: '110px' }} className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => {
                    const fromErrors = getRowFieldErrors(index, 'fromCredits');
                    const toErrors = getRowFieldErrors(index, 'toCredits');

                    return (
                      <tr key={row.id ?? `new-${index}`}>
                        <td className="bold mono">Level {row.levelNumber}</td>
                        <td className="bold">{row.name || `Level ${row.levelNumber}`}</td>
                        <td dir="rtl" style={{ fontWeight: 600 }}>{row.nameAr || '—'}</td>
                        <td>
                          <input
                            type="number"
                            step="any"
                            min={0}
                            className="input"
                            style={{ height: '36px' }}
                            value={row.fromCredits}
                            onChange={e => handleRowChange(index, 'fromCredits', e.target.value)}
                            aria-label={`Level ${row.levelNumber} fromCredits`}
                            required
                          />
                          {fromErrors.map((msg, i) => (
                            <div key={i} className="text-xs text-red-600 dark:text-red-400 mt-1">{msg}</div>
                          ))}
                        </td>
                        <td>
                          <input
                            type="number"
                            step="any"
                            min={0}
                            className="input"
                            style={{ height: '36px' }}
                            value={row.toCredits}
                            onChange={e => handleRowChange(index, 'toCredits', e.target.value)}
                            aria-label={`Level ${row.levelNumber} toCredits`}
                            required
                          />
                          {toErrors.map((msg, i) => (
                            <div key={i} className="text-xs text-red-600 dark:text-red-400 mt-1">{msg}</div>
                          ))}
                        </td>
                        <td className="text-center">
                          {row.isLastLevel ? (
                            <span className="badge badge-primary no-dot">Final Level</span>
                          ) : (
                            <span className="badge badge-neutral no-dot">Standard</span>
                          )}
                        </td>
                        <td className="text-center">
                          <button
                            type="button"
                            className="btn btn-danger-soft btn-sm"
                            onClick={() => handleRemoveLevel(index)}
                            disabled={rows.length <= 2 || saving}
                            title={rows.length <= 2 ? 'Minimum 2 levels required' : `Remove Level ${row.levelNumber}`}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </form>
      ) : null}
    </div>
  );
};
