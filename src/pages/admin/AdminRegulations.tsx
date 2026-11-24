/**
 * Screen 85: College Regulations, Policy Versions, Credit Load Rules & Secondary Track Requirements (Admin)
 *
 * Connected strictly to all 12 confirmed Swagger endpoints across 3 tags:
 * - PolicyVersions (7):
 *   GET/POST /api/admin/policy-versions, GET/PUT /api/admin/policy-versions/{id},
 *   GET /api/admin/policy-versions/for-cohort/{cohortYear},
 *   POST /api/admin/policy-versions/{id}/activate,
 *   PATCH /api/admin/policy-versions/{id}/cohort-range
 * - CreditLoadRules (2):
 *   GET/PUT /api/admin/credit-load-rules
 * - SecondaryTrackRequirements (3):
 *   GET/PUT /api/admin/secondary-track-requirements,
 *   GET /api/admin/secondary-track-requirements/{track}
 */

import React, { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from '../../services/api';
import type {
  CourseListItemDto,
  CreditLoadRuleType,
  CreditLoadRulesDto,
  PolicyParametersDto,
  PolicyVersionDto,
  PolicyVersionListItemDto,
  SecondaryTrack,
  SecondaryTrackRequirementDto,
  SetCreditLoadRuleItemDto,
} from '../../types/api';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

export type RegulationsTab = 'policies' | 'credit-load' | 'tracks';

const DEFAULT_POLICY_PARAMS: PolicyParametersDto = {
  totalRequiredCredits: 144,
  minGraduationCGPA: 2.0,
  warningCGPAThreshold: 2.0,
  coursePassPercentage: 50,
  finalExamWeight: 60,
  finalExamPassPercentage: 30,
  finalExamDurationMinutes: 120,
  retakeCapPercentage: 64,
  improvementRetakeLimit: 2,
  projectEligibilityPercentage: 70,
  projectPassPercentage: 50,
  trainingEligibilityPercentage: 50,
  trainingWeeks: 4,
  trainingHoursPerWeek: 30,
  prerequisiteAttendancePercentage: 75,
  honorsMinCGPA: 3.4,
  honorsMaxRegularSemesters: 8,
  maxStudyDurationSemesters: 16,
};

const PARAM_FIELDS: { key: keyof PolicyParametersDto; label: string; step?: string; nullable?: boolean }[] = [
  { key: 'totalRequiredCredits', label: 'Total Required Credits' },
  { key: 'minGraduationCGPA', label: 'Min Graduation CGPA', step: '0.01' },
  { key: 'warningCGPAThreshold', label: 'Warning CGPA Threshold', step: '0.01' },
  { key: 'coursePassPercentage', label: 'Course Pass %', step: '0.5' },
  { key: 'finalExamWeight', label: 'Final Exam Weight %', step: '0.5' },
  { key: 'finalExamPassPercentage', label: 'Final Exam Pass %', step: '0.5' },
  { key: 'finalExamDurationMinutes', label: 'Final Exam Duration (min)' },
  { key: 'retakeCapPercentage', label: 'Retake Cap %', step: '0.5' },
  { key: 'improvementRetakeLimit', label: 'Improvement Retake Limit' },
  { key: 'projectEligibilityPercentage', label: 'Project Eligibility %', step: '0.5' },
  { key: 'projectPassPercentage', label: 'Project Pass %', step: '0.5' },
  { key: 'trainingEligibilityPercentage', label: 'Training Eligibility %', step: '0.5' },
  { key: 'trainingWeeks', label: 'Training Weeks' },
  { key: 'trainingHoursPerWeek', label: 'Training Hours / Week' },
  { key: 'prerequisiteAttendancePercentage', label: 'Min Attendance %', step: '0.5' },
  { key: 'honorsMinCGPA', label: 'Honors Min CGPA', step: '0.01' },
  { key: 'honorsMaxRegularSemesters', label: 'Honors Max Semesters' },
  { key: 'maxStudyDurationSemesters', label: 'Max Study Semesters', nullable: true },
];

export const AdminRegulations: React.FC<{ initialTab?: RegulationsTab }> = ({ initialTab = 'policies' }) => {
  const { showToast } = useAuth();
  const [tab, setTab] = useState<RegulationsTab>(initialTab);

  // ---- Tab 1: Policy Versions ----
  const [policies, setPolicies] = useState<PolicyVersionListItemDto[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyVersionDto | null>(null);
  const [loadingPolicies, setLoadingPolicies] = useState<boolean>(true);
  const [policyError, setPolicyError] = useState<string | null>(null);
  const [cohortLookupYear, setCohortLookupYear] = useState<string>(String(new Date().getFullYear()));
  const [cohortResult, setCohortResult] = useState<PolicyVersionDto | null>(null);
  const [cohortSearched, setCohortSearched] = useState<boolean>(false);

  // Policy Create / Edit Modal
  const [policyModal, setPolicyModal] = useState<'create' | 'edit' | null>(null);
  const [pName, setPName] = useState<string>('');
  const [pCohortFrom, setPCohortFrom] = useState<string>(String(new Date().getFullYear()));
  const [pCohortTo, setPCohortTo] = useState<string>('');
  const [pDecisionRef, setPDecisionRef] = useState<string>('');
  const [pParams, setPParams] = useState<PolicyParametersDto>({ ...DEFAULT_POLICY_PARAMS });
  const [savingPolicy, setSavingPolicy] = useState<boolean>(false);
  const [policyFormError, setPolicyFormError] = useState<string | null>(null);

  // Cohort range patch
  const [cohortToPatch, setCohortToPatch] = useState<string>('');
  const [patchingCohort, setPatchingCohort] = useState<boolean>(false);
  const [activatingPolicy, setActivatingPolicy] = useState<boolean>(false);

  // ---- Tab 2: Credit Load Rules ----
  const [rulesPolicyId, setRulesPolicyId] = useState<string>('');
  const [rulesOnDate, setRulesOnDate] = useState<string>('');
  const [creditLoadData, setCreditLoadData] = useState<CreditLoadRulesDto | null>(null);
  const [ruleItems, setRuleItems] = useState<SetCreditLoadRuleItemDto[]>([]);
  const [publishEffectiveFrom, setPublishEffectiveFrom] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [loadingRules, setLoadingRules] = useState<boolean>(false);
  const [rulesError, setRulesError] = useState<string | null>(null);
  const [publishingRules, setPublishingRules] = useState<boolean>(false);

  // ---- Tab 3: Secondary Track Requirements ----
  const [tracks, setTracks] = useState<SecondaryTrackRequirementDto[]>([]);
  const [trackCourses, setTrackCourses] = useState<Record<SecondaryTrack, number[]>>({ Science: [], Math: [] });
  const [allCourses, setAllCourses] = useState<CourseListItemDto[]>([]);
  const [loadingTracks, setLoadingTracks] = useState<boolean>(false);
  const [savingTracks, setSavingTracks] = useState<boolean>(false);
  const [inspectTrack, setInspectTrack] = useState<SecondaryTrackRequirementDto | null>(null);

  const loadPolicies = useCallback(async (keepId?: number) => {
    setLoadingPolicies(true);
    setPolicyError(null);
    try {
      const list = await api.policies.listPolicies();
      setPolicies(list);
      const targetId = keepId ?? list.find(p => p.isActive)?.id ?? list[0]?.id;
      if (targetId !== undefined) {
        const detail = await api.policies.getPolicyById(targetId);
        setSelectedPolicy(detail);
        setCohortToPatch(detail.effectiveCohortTo ? String(detail.effectiveCohortTo) : '');
      } else {
        setSelectedPolicy(null);
      }
    } catch (err: unknown) {
      setPolicyError(err instanceof Error ? err.message : 'Failed to load policy versions.');
    } finally {
      setLoadingPolicies(false);
    }
  }, []);

  const loadCreditLoadRules = useCallback(async (policyVersionIdStr?: string, onDateStr?: string) => {
    setLoadingRules(true);
    setRulesError(null);
    try {
      const data = await api.policies.getCreditLoadRules({
        policyVersionId: policyVersionIdStr ? Number(policyVersionIdStr) : undefined,
        onDate: onDateStr || undefined,
      });
      setCreditLoadData(data);
      setRuleItems(
        (data.rules ?? []).map(r => ({
          ruleType: r.ruleType,
          name: r.name ?? '',
          minCgpa: r.minCgpa,
          maxCgpaExclusive: r.maxCgpaExclusive,
          minCredits: r.minCredits,
          maxCredits: r.maxCredits,
        }))
      );
    } catch (err: unknown) {
      setRulesError(err instanceof Error ? err.message : 'Failed to load credit load rules.');
      setCreditLoadData(null);
    } finally {
      setLoadingRules(false);
    }
  }, []);

  const loadTracks = useCallback(async () => {
    setLoadingTracks(true);
    try {
      const [trackList, coursesRes] = await Promise.all([
        api.policies.listSecondaryTrackRequirements(),
        api.courses.adminSearch({ Page: 1, PageSize: 200 }).catch(() => ({ items: [] as CourseListItemDto[] })),
      ]);
      setTracks(trackList);
      setAllCourses(coursesRes.items ?? []);
      const mapped: Record<SecondaryTrack, number[]> = { Science: [], Math: [] };
      for (const t of trackList) {
        mapped[t.track] = (t.courses ?? []).map(c => c.courseId);
      }
      setTrackCourses(mapped);
    } catch (err: unknown) {
      showToast('Load Failed', err instanceof Error ? err.message : 'Failed to load secondary track requirements.', 'error');
    } finally {
      setLoadingTracks(false);
    }
  }, [showToast]);

  useEffect(() => {
    let cancelled = false;
    api.policies
      .listPolicies()
      .then(async list => {
        if (cancelled) return;
        setPolicies(list);
        const targetId = list.find(p => p.isActive)?.id ?? list[0]?.id;
        if (targetId !== undefined) {
          const detail = await api.policies.getPolicyById(targetId);
          if (!cancelled) {
            setSelectedPolicy(detail);
            setCohortToPatch(detail.effectiveCohortTo ? String(detail.effectiveCohortTo) : '');
          }
        }
        setPolicyError(null);
      })
      .catch((err: unknown) => {
        if (!cancelled) setPolicyError(err instanceof Error ? err.message : 'Failed to load policies.');
      })
      .finally(() => {
        if (!cancelled) setLoadingPolicies(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSelectTab = (next: RegulationsTab) => {
    setTab(next);
    if (next === 'credit-load' && !creditLoadData && !loadingRules) {
      void loadCreditLoadRules(rulesPolicyId, rulesOnDate);
    }
    if (next === 'tracks' && tracks.length === 0 && !loadingTracks) {
      void loadTracks();
    }
  };

  useEffect(() => {
    if (initialTab === 'credit-load') {
      api.policies
        .getCreditLoadRules()
        .then(data => {
          setCreditLoadData(data);
          setRuleItems(
            (data.rules ?? []).map(r => ({
              ruleType: r.ruleType,
              name: r.name ?? '',
              minCgpa: r.minCgpa,
              maxCgpaExclusive: r.maxCgpaExclusive,
              minCredits: r.minCredits,
              maxCredits: r.maxCredits,
            }))
          );
        })
        .catch(() => {});
    }
  }, [initialTab]);

  const handleSelectPolicy = async (id: number) => {
    try {
      const detail = await api.policies.getPolicyById(id);
      setSelectedPolicy(detail);
      setCohortToPatch(detail.effectiveCohortTo ? String(detail.effectiveCohortTo) : '');
    } catch (err: unknown) {
      showToast('Load Failed', err instanceof Error ? err.message : 'Failed to load policy detail.', 'error');
    }
  };

  const openPolicyCreate = () => {
    setPolicyModal('create');
    setPName('');
    setPCohortFrom(String(new Date().getFullYear()));
    setPCohortTo('');
    setPDecisionRef('');
    setPParams({ ...DEFAULT_POLICY_PARAMS });
    setPolicyFormError(null);
  };

  const openPolicyEdit = () => {
    if (!selectedPolicy) return;
    setPolicyModal('edit');
    setPName(selectedPolicy.name ?? '');
    setPCohortFrom(String(selectedPolicy.effectiveCohortFrom));
    setPCohortTo(selectedPolicy.effectiveCohortTo ? String(selectedPolicy.effectiveCohortTo) : '');
    setPDecisionRef(selectedPolicy.decisionReference ?? '');
    setPParams({ ...selectedPolicy.parameters });
    setPolicyFormError(null);
  };

  const handleSavePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    setPolicyFormError(null);
    if (!pName.trim() || !pCohortFrom) {
      setPolicyFormError('Policy name and effective cohort-from year are required.');
      return;
    }
    setSavingPolicy(true);
    try {
      const payload = {
        name: pName.trim(),
        effectiveCohortFrom: Number(pCohortFrom),
        effectiveCohortTo: pCohortTo ? Number(pCohortTo) : null,
        decisionReference: pDecisionRef.trim() || null,
        parameters: pParams,
      };
      if (policyModal === 'create') {
        const res = await api.policies.createPolicy(payload);
        showToast('Policy Created', res.message, 'success');
        setPolicyModal(null);
        await loadPolicies(res.data.id);
      } else if (policyModal === 'edit' && selectedPolicy) {
        const res = await api.policies.updatePolicy(selectedPolicy.id, payload);
        showToast('Policy Updated', res.message, 'success');
        setPolicyModal(null);
        await loadPolicies(res.data.id);
      }
    } catch (err: unknown) {
      setPolicyFormError(err instanceof ApiError || err instanceof Error ? err.message : 'Failed to save policy.');
    } finally {
      setSavingPolicy(false);
    }
  };

  const handleActivatePolicy = async () => {
    if (!selectedPolicy) return;
    setActivatingPolicy(true);
    try {
      const res = await api.policies.activatePolicy(selectedPolicy.id);
      showToast('Policy Activated', res.message, 'success');
      await loadPolicies(selectedPolicy.id);
    } catch (err: unknown) {
      showToast('Activation Failed', err instanceof Error ? err.message : 'Failed to activate policy.', 'error');
    } finally {
      setActivatingPolicy(false);
    }
  };

  const handlePatchCohortRange = async () => {
    if (!selectedPolicy) return;
    setPatchingCohort(true);
    try {
      const res = await api.policies.updatePolicyCohortRange(selectedPolicy.id, {
        effectiveCohortTo: cohortToPatch ? Number(cohortToPatch) : null,
      });
      setSelectedPolicy(res.data);
      showToast('Cohort Range Updated', res.message, 'success');
      await loadPolicies(selectedPolicy.id);
    } catch (err: unknown) {
      showToast('Update Failed', err instanceof Error ? err.message : 'Failed to update cohort range.', 'error');
    } finally {
      setPatchingCohort(false);
    }
  };

  const handleCohortLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const yr = Number(cohortLookupYear);
    if (!Number.isInteger(yr) || yr < 1990) return;
    setCohortSearched(true);
    try {
      const res = await api.policies.getPolicyForCohort(yr);
      setCohortResult(res);
    } catch (err: unknown) {
      setCohortResult(null);
      showToast('Lookup Result', err instanceof Error ? err.message : 'No policy found for cohort.', 'info');
    }
  };

  const handlePublishCreditRules = async () => {
    setPublishingRules(true);
    try {
      const res = await api.policies.updateCreditLoadRules({
        policyVersionId: rulesPolicyId ? Number(rulesPolicyId) : creditLoadData?.policyVersionId ?? null,
        effectiveFrom: publishEffectiveFrom,
        rules: ruleItems,
      });
      setCreditLoadData(res.data);
      showToast('Credit Load Rules Published', res.message, 'success');
    } catch (err: unknown) {
      showToast('Publish Failed', err instanceof Error ? err.message : 'Failed to publish credit load rules.', 'error');
    } finally {
      setPublishingRules(false);
    }
  };

  const toggleTrackCourse = (track: SecondaryTrack, courseId: number) => {
    setTrackCourses(prev => {
      const curr = prev[track] ?? [];
      const next = curr.includes(courseId) ? curr.filter(id => id !== courseId) : [...curr, courseId];
      return { ...prev, [track]: next };
    });
  };

  const handleInspectTrack = async (track: SecondaryTrack) => {
    try {
      const res = await api.policies.getSecondaryTrackRequirement(track);
      setInspectTrack(res);
    } catch (err: unknown) {
      showToast('Load Failed', err instanceof Error ? err.message : 'Could not fetch track requirements.', 'error');
    }
  };

  const handleSaveTracks = async () => {
    setSavingTracks(true);
    try {
      const res = await api.policies.setSecondaryTrackRequirements({
        requirements: [
          { secondaryTrack: 'Science', courseIds: trackCourses.Science },
          { secondaryTrack: 'Math', courseIds: trackCourses.Math },
        ],
      });
      setTracks(res.data);
      showToast('Secondary Track Requirements Saved', res.message, 'success');
    } catch (err: unknown) {
      showToast('Save Failed', err instanceof Error ? err.message : 'Failed to update secondary track requirements.', 'error');
    } finally {
      setSavingTracks(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHead
        crumbs={[
          { label: 'Admin', href: '#/admin/dashboard' },
          { label: 'Operations' },
          { label: 'College Regulations & Policies' },
        ]}
        title="College Regulations & Academic Policies"
        subtitle="Manage versioned academic policies, CGPA credit-load rules, and secondary-school track course requirements."
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              className={`btn btn-sm ${tab === 'policies' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => handleSelectTab('policies')}
            >
              Policy Versions
            </button>
            <button
              type="button"
              className={`btn btn-sm ${tab === 'credit-load' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => handleSelectTab('credit-load')}
            >
              Credit Load Rules
            </button>
            <button
              type="button"
              className={`btn btn-sm ${tab === 'tracks' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => handleSelectTab('tracks')}
            >
              Secondary Track Req.
            </button>
          </div>
        }
      />

      {/* ==================== TAB 1: POLICY VERSIONS ==================== */}
      {tab === 'policies' && (
        <div className="space-y-6">
          <div className="card card-pad flex flex-wrap items-center justify-between gap-3">
            <form onSubmit={handleCohortLookup} className="flex items-center gap-2 flex-wrap">
              <label className="text-xs font-semibold muted">Lookup Policy for Cohort Year:</label>
              <input
                type="number"
                className="input"
                style={{ width: '110px' }}
                value={cohortLookupYear}
                onChange={e => setCohortLookupYear(e.target.value)}
              />
              <button type="submit" className="btn btn-outline btn-xs">Lookup</button>
              {cohortSearched && (
                <span className="text-xs">
                  {cohortResult
                    ? `Matched: ${cohortResult.name} (v${cohortResult.versionNumber})`
                    : 'No active policy matched that cohort.'}
                </span>
              )}
            </form>
            <button type="button" className="btn btn-primary btn-sm" onClick={openPolicyCreate}>
              <Icon name="plus" size="sm" /> Create Policy Version
            </button>
          </div>

          {loadingPolicies ? (
            <CardSkeleton />
          ) : policyError ? (
            <div className="card card-pad state">
              <div className="state-art danger"><Icon name="alert" size="lg" /></div>
              <h3>Could not load policies</h3>
              <p className="text-sm muted">{policyError}</p>
              <button type="button" className="btn btn-primary btn-sm mt-3" onClick={() => void loadPolicies()}>Retry</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4 card card-pad space-y-2">
                <div className="font-bold text-sm mb-2">Policy Versions ({policies.length})</div>
                {policies.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => void handleSelectPolicy(p.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                      selectedPolicy?.id === p.id
                        ? 'border-sky-400 bg-sky-500/10'
                        : 'border-slate-200 dark:border-slate-800 hover:border-sky-400/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-sm">{p.name || `Policy v${p.versionNumber}`}</span>
                      <span className={p.isActive ? 'chip chip-primary' : 'chip'}>
                        {p.isActive ? 'Active' : 'Draft'}
                      </span>
                    </div>
                    <div className="text-xs muted mt-1">
                      v{p.versionNumber} · Cohorts {p.effectiveCohortFrom} → {p.effectiveCohortTo ?? 'Present'}
                    </div>
                  </button>
                ))}
              </div>

              <div className="lg:col-span-8">
                {!selectedPolicy ? (
                  <div className="card card-pad state">
                    <div className="state-art"><Icon name="gavel" size="lg" /></div>
                    <h3>Select a Policy Version</h3>
                  </div>
                ) : (
                  <div className="card card-pad space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold">{selectedPolicy.name}</h3>
                          <span className={selectedPolicy.isActive ? 'chip chip-primary' : 'chip'}>
                            {selectedPolicy.isActive ? 'Active' : 'Draft'}
                          </span>
                        </div>
                        <p className="text-xs muted">
                          Version #{selectedPolicy.versionNumber} · Cohorts {selectedPolicy.effectiveCohortFrom}–
                          {selectedPolicy.effectiveCohortTo ?? 'Open'}
                          {selectedPolicy.decisionReference ? ` · Ref: ${selectedPolicy.decisionReference}` : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedPolicy.isEditable && (
                          <button type="button" className="btn btn-outline btn-xs" onClick={openPolicyEdit}>
                            Edit Draft
                          </button>
                        )}
                        {!selectedPolicy.isActive && (
                          <button
                            type="button"
                            className="btn btn-primary btn-xs"
                            disabled={activatingPolicy}
                            onClick={() => void handleActivatePolicy()}
                          >
                            {activatingPolicy ? 'Activating...' : 'Activate Policy'}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Cohort Range Patch */}
                    <div className="flex flex-wrap items-end gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                      <div>
                        <label className="label text-xs">Update Effective Cohort To (blank = open)</label>
                        <input
                          type="number"
                          className="input"
                          style={{ width: '160px' }}
                          value={cohortToPatch}
                          onChange={e => setCohortToPatch(e.target.value)}
                          placeholder="e.g. 2028"
                        />
                      </div>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        disabled={patchingCohort}
                        onClick={() => void handlePatchCohortRange()}
                      >
                        {patchingCohort ? 'Updating...' : 'Update Cohort Range'}
                      </button>
                    </div>

                    {/* Policy Parameters Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {PARAM_FIELDS.map(f => (
                        <div key={f.key} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                          <div className="text-[11px] muted">{f.label}</div>
                          <div className="text-base font-bold mt-0.5">
                            {selectedPolicy.parameters?.[f.key] ?? '—'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 2: CREDIT LOAD RULES ==================== */}
      {tab === 'credit-load' && (
        <div className="space-y-4">
          <div className="card card-pad flex flex-wrap items-end justify-between gap-3">
            <div className="flex flex-wrap items-end gap-3">
              <div>
                <label className="label text-xs">Policy Version</label>
                <select
                  className="input"
                  value={rulesPolicyId}
                  onChange={e => setRulesPolicyId(e.target.value)}
                >
                  <option value="">Active Policy (Default)</option>
                  {policies.map(p => (
                    <option key={p.id} value={String(p.id)}>
                      {p.name} (v{p.versionNumber})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label text-xs">On Date (Optional)</label>
                <input
                  type="date"
                  className="input"
                  value={rulesOnDate}
                  onChange={e => setRulesOnDate(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => void loadCreditLoadRules(rulesPolicyId, rulesOnDate)}
              >
                Load Rules
              </button>
            </div>

            <div className="flex flex-wrap items-end gap-2">
              <div>
                <label className="label text-xs">Publish Effective From</label>
                <input
                  type="date"
                  className="input"
                  value={publishEffectiveFrom}
                  onChange={e => setPublishEffectiveFrom(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() =>
                  setRuleItems(prev => [
                    ...prev,
                    { ruleType: 'CgpaBand', name: '', minCgpa: 2.0, maxCgpaExclusive: 3.0, minCredits: 12, maxCredits: 18 },
                  ])
                }
              >
                <Icon name="plus" size="sm" /> Add Rule
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                disabled={publishingRules}
                onClick={() => void handlePublishCreditRules()}
              >
                {publishingRules ? 'Publishing...' : 'Publish New Rule Set'}
              </button>
            </div>
          </div>

          {loadingRules ? (
            <CardSkeleton />
          ) : rulesError ? (
            <div className="card card-pad state">
              <div className="state-art danger"><Icon name="alert" size="lg" /></div>
              <h3>Could not load credit load rules</h3>
              <p className="text-sm muted">{rulesError}</p>
            </div>
          ) : (
            <div className="card overflow-x-auto">
              {creditLoadData && (
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 text-xs muted">
                  Policy Version #{creditLoadData.policyVersionId} · Effective From: <b>{creditLoadData.effectiveFrom}</b>
                </div>
              )}
              <table className="table w-full text-xs">
                <thead>
                  <tr>
                    <th>Rule Type</th>
                    <th>Name</th>
                    <th>Min CGPA</th>
                    <th>Max CGPA (Excl.)</th>
                    <th>Min Credits</th>
                    <th>Max Credits</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {ruleItems.map((r, idx) => (
                    <tr key={idx}>
                      <td>
                        <select
                          className="input"
                          value={r.ruleType}
                          onChange={e =>
                            setRuleItems(prev =>
                              prev.map((item, i) => (i === idx ? { ...item, ruleType: e.target.value as CreditLoadRuleType } : item))
                            )
                          }
                        >
                          <option value="Summer">Summer</option>
                          <option value="FirstRegularSemester">FirstRegularSemester</option>
                          <option value="CgpaBand">CgpaBand</option>
                        </select>
                      </td>
                      <td>
                        <input
                          className="input"
                          value={r.name ?? ''}
                          onChange={e =>
                            setRuleItems(prev => prev.map((item, i) => (i === idx ? { ...item, name: e.target.value } : item)))
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          className="input"
                          style={{ width: '80px' }}
                          value={r.minCgpa ?? ''}
                          onChange={e =>
                            setRuleItems(prev =>
                              prev.map((item, i) => (i === idx ? { ...item, minCgpa: e.target.value === '' ? null : Number(e.target.value) } : item))
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          className="input"
                          style={{ width: '80px' }}
                          value={r.maxCgpaExclusive ?? ''}
                          onChange={e =>
                            setRuleItems(prev =>
                              prev.map((item, i) =>
                                i === idx ? { ...item, maxCgpaExclusive: e.target.value === '' ? null : Number(e.target.value) } : item
                              )
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="input"
                          style={{ width: '76px' }}
                          value={r.minCredits ?? ''}
                          onChange={e =>
                            setRuleItems(prev =>
                              prev.map((item, i) => (i === idx ? { ...item, minCredits: e.target.value === '' ? null : Number(e.target.value) } : item))
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="input"
                          style={{ width: '76px' }}
                          value={r.maxCredits}
                          onChange={e =>
                            setRuleItems(prev =>
                              prev.map((item, i) => (i === idx ? { ...item, maxCredits: Number(e.target.value) } : item))
                            )
                          }
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger btn-xs"
                          onClick={() => setRuleItems(prev => prev.filter((_, i) => i !== idx))}
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 3: SECONDARY TRACK REQUIREMENTS ==================== */}
      {tab === 'tracks' && (
        <div className="space-y-4">
          <div className="flex justify-end gap-2">
            <button type="button" className="btn btn-outline btn-sm" onClick={() => void loadTracks()}>
              Refresh
            </button>
            <button type="button" className="btn btn-primary btn-sm" disabled={savingTracks} onClick={() => void handleSaveTracks()}>
              {savingTracks ? 'Saving...' : 'Save Track Requirements'}
            </button>
          </div>

          {loadingTracks ? (
            <CardSkeleton />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {(['Science', 'Math'] as SecondaryTrack[]).map(trackKey => {
                const trackInfo = tracks.find(t => t.track === trackKey);
                const selectedIds = trackCourses[trackKey] ?? [];
                return (
                  <div key={trackKey} className="card card-pad space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold">
                          {trackInfo?.trackName || `${trackKey} Track`}{' '}
                          {trackInfo?.trackNameAr ? `(${trackInfo.trackNameAr})` : ''}
                        </h3>
                        <p className="text-xs muted">{selectedIds.length} required remedial/bridge courses selected</p>
                      </div>
                      <button
                        type="button"
                        className="btn btn-outline btn-xs"
                        onClick={() => void handleInspectTrack(trackKey)}
                      >
                        Inspect Live
                      </button>
                    </div>

                    <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
                      {allCourses.length === 0 ? (
                        <p className="text-xs muted">No courses found in catalog.</p>
                      ) : (
                        allCourses.map(c => (
                          <label
                            key={c.id}
                            className="flex items-center justify-between gap-2 p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-xs cursor-pointer hover:border-sky-400/50"
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={selectedIds.includes(c.id)}
                                onChange={() => toggleTrackCourse(trackKey, c.id)}
                              />
                              <span className="font-mono font-bold">{c.code}</span>
                              <span>{c.name}</span>
                            </div>
                            <span className="muted">{c.creditHours} cr</span>
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Policy Create / Edit Modal */}
      {policyModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal card card-pad" style={{ maxWidth: '720px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">
                {policyModal === 'create' ? 'Create Policy Version' : 'Edit Policy Version'}
              </h3>
              <button type="button" className="icon-btn" onClick={() => !savingPolicy && setPolicyModal(null)}>
                <Icon name="x" size="sm" />
              </button>
            </div>
            {policyFormError && (
              <div className="alert alert-danger mb-3 text-sm">
                <Icon name="alert" size="sm" />
                <span>{policyFormError}</span>
              </div>
            )}
            <form onSubmit={handleSavePolicy} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="label">Policy Name</label>
                  <input className="input" value={pName} onChange={e => setPName(e.target.value)} required />
                </div>
                <div>
                  <label className="label">Decision Reference</label>
                  <input className="input" value={pDecisionRef} onChange={e => setPDecisionRef(e.target.value)} placeholder="Ministerial Decree #..." />
                </div>
                <div>
                  <label className="label">Effective Cohort From</label>
                  <input type="number" className="input" value={pCohortFrom} onChange={e => setPCohortFrom(e.target.value)} required />
                </div>
                <div>
                  <label className="label">Effective Cohort To (optional)</label>
                  <input type="number" className="input" value={pCohortTo} onChange={e => setPCohortTo(e.target.value)} />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="font-semibold text-sm mb-3">Policy Parameters</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {PARAM_FIELDS.map(f => (
                    <div key={f.key}>
                      <label className="label text-xs">{f.label}</label>
                      <input
                        type="number"
                        step={f.step || '1'}
                        className="input"
                        value={pParams[f.key] ?? ''}
                        onChange={e => {
                          const raw = e.target.value;
                          setPParams(prev => ({
                            ...prev,
                            [f.key]: f.nullable && raw === '' ? null : Number(raw),
                          }));
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="btn btn-outline" onClick={() => setPolicyModal(null)} disabled={savingPolicy}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={savingPolicy}>
                  {savingPolicy ? 'Saving...' : 'Save Policy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Track Inspect Modal */}
      {inspectTrack && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal card card-pad" style={{ maxWidth: '480px', width: '100%' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">{inspectTrack.trackName || inspectTrack.track}</h3>
              <button type="button" className="icon-btn" onClick={() => setInspectTrack(null)}>
                <Icon name="x" size="sm" />
              </button>
            </div>
            <div className="space-y-2 text-sm">
              {(inspectTrack.courses ?? []).length === 0 ? (
                <p className="muted">No required courses configured for this track.</p>
              ) : (
                (inspectTrack.courses ?? []).map(c => (
                  <div key={c.courseId} className="flex justify-between p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span><b>{c.code}</b> · {c.name}</span>
                    <span className="muted">{c.creditHours} cr</span>
                  </div>
                ))
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button type="button" className="btn btn-primary btn-sm" onClick={() => setInspectTrack(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
