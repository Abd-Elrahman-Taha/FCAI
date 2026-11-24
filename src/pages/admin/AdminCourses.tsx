/**
 * Screen 88: Courses, Prerequisites, Curriculum Versions & Requirement Groups (Admin)
 *
 * Connected strictly to all 23 confirmed Swagger endpoints across 4 tags:
 * - AdminCourses (7): GET/POST /api/admin/courses, GET/PUT/DELETE /api/admin/courses/{id},
 *   GET/PUT /api/admin/courses/{id}/prerequisites
 * - CurriculumVersions (9): GET/POST /api/admin/curriculum-versions, GET/PUT /{id},
 *   GET /for-cohort/{cohortYear}, PUT /{id}/groups, POST /{id}/activate,
 *   GET /{id}/validate, PATCH /{id}/cohort-range
 * - CurriculumCourses (3): GET/PUT /api/admin/curriculum-versions/{versionId}/courses,
 *   PUT /api/admin/curriculum-versions/{versionId}/courses/{courseId}
 * - RequirementGroups (4): GET/POST /api/admin/requirement-groups, GET/PUT /{id}
 */

import React, { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from '../../services/api';
import type {
  CourseDto,
  CourseListItemDto,
  CoursePlacementDto,
  CurriculumCourseItemRequest,
  CurriculumValidationDto,
  CurriculumVersionDto,
  CurriculumVersionListItemDto,
  DepartmentLookupDto,
  PaginationMetadata,
  PolicyVersionListItemDto,
  PrerequisiteItemRequest,
  PrerequisiteMode,
  RequirementGroupDto,
  RequirementGroupType,
  SetCurriculumGroupItemRequest,
} from '../../types/api';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

type CoursesTab = 'courses' | 'curricula' | 'groups';

export const AdminCourses: React.FC = () => {
  const { showToast } = useAuth();
  const [tab, setTab] = useState<CoursesTab>('courses');

  // Shared lookup references
  const [departments, setDepartments] = useState<DepartmentLookupDto[]>([]);
  const [groups, setGroups] = useState<RequirementGroupDto[]>([]);
  const [curricula, setCurricula] = useState<CurriculumVersionListItemDto[]>([]);
  const [policies, setPolicies] = useState<PolicyVersionListItemDto[]>([]);

  // ---- TAB 1: COURSES ----
  const [courses, setCourses] = useState<CourseListItemDto[]>([]);
  const [meta, setMeta] = useState<PaginationMetadata | null>(null);
  const [loadingCourses, setLoadingCourses] = useState<boolean>(true);
  const [coursesError, setCoursesError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [deptFilter, setDeptFilter] = useState<string>('');
  const [groupFilter, setGroupFilter] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  const [courseDetail, setCourseDetail] = useState<CourseDto | null>(null);
  const [courseModal, setCourseModal] = useState<'create' | 'edit' | null>(null);
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
  const [cCode, setCCode] = useState<string>('');
  const [cName, setCName] = useState<string>('');
  const [cNameAr, setCNameAr] = useState<string>('');
  const [cDesc, setCDesc] = useState<string>('');
  const [cCredits, setCCredits] = useState<number>(3);
  const [cCreditBearing, setCCreditBearing] = useState<boolean>(true);
  const [cDeptId, setCDeptId] = useState<string>('');
  const [cCurrId, setCCurrId] = useState<string>('');
  const [cGroupId, setCGroupId] = useState<string>('');
  const [cCompulsory, setCCompulsory] = useState<boolean>(true);
  const [cLevel, setCLevel] = useState<string>('1');
  const [cSem, setCSem] = useState<string>('1');
  const [savingCourse, setSavingCourse] = useState<boolean>(false);
  const [courseFormError, setCourseFormError] = useState<string | null>(null);

  // Prerequisites modal
  const [prereqCourse, setPrereqCourse] = useState<CourseListItemDto | null>(null);
  const [prereqRows, setPrereqRows] = useState<PrerequisiteItemRequest[]>([]);
  const [savingPrereqs, setSavingPrereqs] = useState<boolean>(false);

  // ---- TAB 2: CURRICULUM VERSIONS & PLACEMENTS ----
  const [selectedCurr, setSelectedCurr] = useState<CurriculumVersionDto | null>(null);
  const [currPlacements, setCurrPlacements] = useState<CoursePlacementDto[]>([]);
  const [currGroupRows, setCurrGroupRows] = useState<SetCurriculumGroupItemRequest[]>([]);
  const [currValidation, setCurrValidation] = useState<CurriculumValidationDto | null>(null);
  const [currCohortYear, setCurrCohortYear] = useState<string>(String(new Date().getFullYear()));
  const [currCohortResult, setCurrCohortResult] = useState<string | null>(null);
  const [currCohortToPatch, setCurrCohortToPatch] = useState<string>('');
  const [currModal, setCurrModal] = useState<'create' | 'edit' | null>(null);
  const [cvName, setCvName] = useState<string>('');
  const [cvPolicyId, setCvPolicyId] = useState<string>('');
  const [cvFrom, setCvFrom] = useState<string>(String(new Date().getFullYear()));
  const [cvTo, setCvTo] = useState<string>('');
  const [cvRef, setCvRef] = useState<string>('');
  const [savingCurr, setSavingCurr] = useState<boolean>(false);

  // Single-course placement & atomic bulk replace
  const [singleCourseId, setSingleCourseId] = useState<string>('');
  const [singleGroupId, setSingleGroupId] = useState<string>('');
  const [singleCompulsory, setSingleCompulsory] = useState<boolean>(true);
  const [singleLevel, setSingleLevel] = useState<string>('1');
  const [singleSem, setSingleSem] = useState<string>('1');
  const [bulkItems, setBulkItems] = useState<CurriculumCourseItemRequest[]>([]);
  const [showBulkModal, setShowBulkModal] = useState<boolean>(false);

  // ---- TAB 3: REQUIREMENT GROUPS ----
  const [groupModal, setGroupModal] = useState<'create' | 'edit' | null>(null);
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
  const [gCode, setGCode] = useState<string>('');
  const [gName, setGName] = useState<string>('');
  const [gNameAr, setGNameAr] = useState<string>('');
  const [gType, setGType] = useState<RequirementGroupType>('Credit');
  const [gActive, setGActive] = useState<boolean>(true);
  const [savingGroup, setSavingGroup] = useState<boolean>(false);

  const loadCourses = useCallback(
    async (p = page, q = search, d = deptFilter, g = groupFilter) => {
      setLoadingCourses(true);
      setCoursesError(null);
      try {
        const res = await api.courses.adminSearch({
          Page: p,
          PageSize: 15,
          Search: q.trim() || undefined,
          DepartmentId: d ? Number(d) : undefined,
          RequirementGroupId: g ? Number(g) : undefined,
        });
        setCourses(res.items ?? []);
        setMeta(res.meta ?? null);
      } catch (err: unknown) {
        setCoursesError(err instanceof Error ? err.message : 'Failed to load courses.');
      } finally {
        setLoadingCourses(false);
      }
    },
    [page, search, deptFilter, groupFilter]
  );

  const loadCurriculumDetail = useCallback(async (id: number) => {
    try {
      const [detail, placements] = await Promise.all([
        api.curriculum.getVersionById(id),
        api.curriculum.listVersionCourses(id),
      ]);
      setSelectedCurr(detail);
      setCurrPlacements(placements);
      setCurrValidation(detail.validation ?? null);
      setCurrCohortToPatch(detail.effectiveCohortTo ? String(detail.effectiveCohortTo) : '');
      setCurrGroupRows(
        (detail.groups ?? []).map(g => ({
          requirementGroupId: g.requirementGroupId,
          compulsoryCredits: g.compulsoryCredits,
          electiveCredits: g.electiveCredits,
        }))
      );
    } catch (err: unknown) {
      showToast('Load Failed', err instanceof Error ? err.message : 'Failed to load curriculum version.', 'error');
    }
  }, [showToast]);

  const refreshReferences = useCallback(async () => {
    const [deptList, groupList, currList, polList] = await Promise.all([
      api.departments.getLookup().catch(() => [] as DepartmentLookupDto[]),
      api.curriculum.listRequirementGroups(true).catch(() => [] as RequirementGroupDto[]),
      api.curriculum.listVersions().catch(() => [] as CurriculumVersionListItemDto[]),
      api.policies.listPolicies().catch(() => [] as PolicyVersionListItemDto[]),
    ]);
    setDepartments(deptList);
    setGroups(groupList);
    setCurricula(currList);
    setPolicies(polList);
    return { currList };
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.courses.adminSearch({ Page: 1, PageSize: 15 }),
      api.departments.getLookup().catch(() => [] as DepartmentLookupDto[]),
      api.curriculum.listRequirementGroups(true).catch(() => [] as RequirementGroupDto[]),
      api.curriculum.listVersions().catch(() => [] as CurriculumVersionListItemDto[]),
      api.policies.listPolicies().catch(() => [] as PolicyVersionListItemDto[]),
    ])
      .then(([courseRes, deptList, groupList, currList, polList]) => {
        if (cancelled) return;
        setCourses(courseRes.items ?? []);
        setMeta(courseRes.meta ?? null);
        setDepartments(deptList);
        setGroups(groupList);
        setCurricula(currList);
        setPolicies(polList);
        setCoursesError(null);
      })
      .catch((err: unknown) => {
        if (!cancelled) setCoursesError(err instanceof Error ? err.message : 'Failed to load courses.');
      })
      .finally(() => {
        if (!cancelled) setLoadingCourses(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // ---- Course CRUD & Prerequisites ----
  const openCreateCourse = () => {
    setCourseModal('create');
    setEditingCourseId(null);
    setCCode('');
    setCName('');
    setCNameAr('');
    setCDesc('');
    setCCredits(3);
    setCCreditBearing(true);
    setCDeptId(departments[0] ? String(departments[0].id) : '');
    setCCurrId(curricula[0] ? String(curricula[0].id) : '');
    setCGroupId(groups[0] ? String(groups[0].id) : '');
    setCCompulsory(true);
    setCLevel('1');
    setCSem('1');
    setCourseFormError(null);
  };

  const openEditCourse = async (id: number) => {
    setCourseFormError(null);
    try {
      const fresh = await api.courses.adminGetById(id);
      setEditingCourseId(fresh.id);
      setCCode(fresh.code ?? '');
      setCName(fresh.name ?? '');
      setCNameAr(fresh.nameAr ?? '');
      setCDesc(fresh.description ?? '');
      setCCredits(fresh.creditHours);
      setCCreditBearing(fresh.isCreditBearing);
      setCDeptId(String(fresh.departmentId));
      const firstPl = fresh.placements?.[0];
      setCCurrId(firstPl ? String(firstPl.curriculumVersionId) : curricula[0] ? String(curricula[0].id) : '');
      setCGroupId(firstPl ? String(firstPl.requirementGroupId) : groups[0] ? String(groups[0].id) : '');
      setCCompulsory(firstPl?.isCompulsory ?? true);
      setCLevel(String(firstPl?.level ?? 1));
      setCSem(String(firstPl?.suggestedSemester ?? 1));
      setCourseModal('edit');
    } catch (err: unknown) {
      showToast('Load Failed', err instanceof Error ? err.message : 'Failed to load course.', 'error');
    }
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setCourseFormError(null);
    if (!cName.trim() || !cDeptId || !cGroupId) {
      setCourseFormError('Name, department, and requirement group are required.');
      return;
    }
    setSavingCourse(true);
    try {
      const placement = {
        curriculumVersionId: cCurrId ? Number(cCurrId) : null,
        requirementGroupId: Number(cGroupId),
        isCompulsory: cCompulsory,
        level: cLevel ? Number(cLevel) : null,
        suggestedSemester: cSem ? Number(cSem) : null,
      };
      if (courseModal === 'create') {
        const res = await api.courses.adminCreate({
          code: cCode.trim().toUpperCase(),
          name: cName.trim(),
          nameAr: cNameAr.trim() || null,
          description: cDesc.trim() || null,
          creditHours: Number(cCredits),
          isCreditBearing: cCreditBearing,
          departmentId: Number(cDeptId),
          placement,
        });
        showToast('Course Created', res.message, 'success');
      } else if (courseModal === 'edit' && editingCourseId !== null) {
        const res = await api.courses.adminUpdate(editingCourseId, {
          name: cName.trim(),
          nameAr: cNameAr.trim() || null,
          description: cDesc.trim() || null,
          creditHours: Number(cCredits),
          isCreditBearing: cCreditBearing,
          departmentId: Number(cDeptId),
          placement,
        });
        showToast('Course Updated', res.message, 'success');
      }
      setCourseModal(null);
      await loadCourses(page);
    } catch (err: unknown) {
      setCourseFormError(err instanceof ApiError || err instanceof Error ? err.message : 'Failed to save course.');
    } finally {
      setSavingCourse(false);
    }
  };

  const handleDeleteCourse = async (c: CourseListItemDto) => {
    if (!window.confirm(`Delete course ${c.code} (${c.name})?`)) return;
    try {
      const msg = await api.courses.adminDelete(c.id);
      showToast('Course Deleted', msg, 'success');
      await loadCourses(page);
    } catch (err: unknown) {
      showToast('Delete Failed', err instanceof Error ? err.message : 'Failed to delete course.', 'error');
    }
  };

  const openPrereqsModal = async (c: CourseListItemDto) => {
    try {
      const list = await api.courses.getPrerequisites(c.id);
      setPrereqCourse(c);
      setPrereqRows(list.map(p => ({ prerequisiteCourseId: p.prerequisiteCourseId, mode: p.mode })));
    } catch (err: unknown) {
      showToast('Load Failed', err instanceof Error ? err.message : 'Failed to load prerequisites.', 'error');
    }
  };

  const handleSavePrereqs = async () => {
    if (!prereqCourse) return;
    setSavingPrereqs(true);
    try {
      const res = await api.courses.setPrerequisites(prereqCourse.id, {
        prerequisites: prereqRows.filter(r => r.prerequisiteCourseId > 0),
      });
      showToast('Prerequisites Saved', res.message, 'success');
      setPrereqCourse(null);
    } catch (err: unknown) {
      showToast('Save Failed', err instanceof Error ? err.message : 'Failed to save prerequisites.', 'error');
    } finally {
      setSavingPrereqs(false);
    }
  };

  // ---- Curriculum Version Actions ----
  const handleSaveCurriculum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvName.trim() || !cvPolicyId || !cvFrom) return;
    setSavingCurr(true);
    try {
      const payload = {
        name: cvName.trim(),
        academicPolicyVersionId: Number(cvPolicyId),
        effectiveCohortFrom: Number(cvFrom),
        effectiveCohortTo: cvTo ? Number(cvTo) : null,
        decisionReference: cvRef.trim() || null,
      };
      if (currModal === 'create') {
        const res = await api.curriculum.createVersion(payload);
        showToast('Curriculum Created', res.message, 'success');
        setCurrModal(null);
        await refreshReferences();
        await loadCurriculumDetail(res.data.id);
      } else if (currModal === 'edit' && selectedCurr) {
        const res = await api.curriculum.updateVersion(selectedCurr.id, payload);
        showToast('Curriculum Updated', res.message, 'success');
        setCurrModal(null);
        await refreshReferences();
        await loadCurriculumDetail(res.data.id);
      }
    } catch (err: unknown) {
      showToast('Save Failed', err instanceof Error ? err.message : 'Failed to save curriculum version.', 'error');
    } finally {
      setSavingCurr(false);
    }
  };

  const handleSaveCurrGroups = async () => {
    if (!selectedCurr) return;
    try {
      const res = await api.curriculum.setVersionGroups(selectedCurr.id, { groups: currGroupRows });
      setSelectedCurr(res.data);
      setCurrValidation(res.data.validation ?? null);
      showToast('Curriculum Groups Updated', res.message, 'success');
    } catch (err: unknown) {
      showToast('Update Failed', err instanceof Error ? err.message : 'Failed to save groups.', 'error');
    }
  };

  const handleValidateCurr = async () => {
    if (!selectedCurr) return;
    try {
      const v = await api.curriculum.validateVersion(selectedCurr.id);
      setCurrValidation(v);
      showToast('Validation Completed', v.canActivate ? 'Ready to activate.' : 'Check validation issues.', v.canActivate ? 'success' : 'info');
    } catch (err: unknown) {
      showToast('Validation Failed', err instanceof Error ? err.message : 'Failed to validate.', 'error');
    }
  };

  const handleActivateCurr = async () => {
    if (!selectedCurr) return;
    try {
      const res = await api.curriculum.activateVersion(selectedCurr.id);
      setSelectedCurr(res.data);
      showToast('Curriculum Activated', res.message, 'success');
      await refreshReferences();
    } catch (err: unknown) {
      showToast('Activation Failed', err instanceof Error ? err.message : 'Failed to activate curriculum.', 'error');
    }
  };

  const handlePatchCurrCohort = async () => {
    if (!selectedCurr) return;
    try {
      const res = await api.curriculum.updateVersionCohortRange(selectedCurr.id, {
        effectiveCohortTo: currCohortToPatch ? Number(currCohortToPatch) : null,
      });
      setSelectedCurr(res.data);
      showToast('Cohort Range Updated', res.message, 'success');
      await refreshReferences();
    } catch (err: unknown) {
      showToast('Update Failed', err instanceof Error ? err.message : 'Failed to update cohort range.', 'error');
    }
  };

  const handleUpsertSinglePlacement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCurr || !singleCourseId || !singleGroupId) return;
    try {
      const cid = Number(singleCourseId);
      const res = await api.curriculum.upsertVersionCourse(selectedCurr.id, cid, {
        curriculumVersionId: cid, // Swagger note: CoursePlacementRequest.CurriculumVersionId carries courseId for single upsert
        requirementGroupId: Number(singleGroupId),
        isCompulsory: singleCompulsory,
        level: singleLevel ? Number(singleLevel) : null,
        suggestedSemester: singleSem ? Number(singleSem) : null,
      });
      showToast('Course Placement Saved', res.message, 'success');
      await loadCurriculumDetail(selectedCurr.id);
    } catch (err: unknown) {
      showToast('Placement Failed', err instanceof Error ? err.message : 'Failed to upsert placement.', 'error');
    }
  };

  const handleReplaceBulkPlacements = async () => {
    if (!selectedCurr) return;
    try {
      const res = await api.curriculum.replaceVersionCourses(selectedCurr.id, { courses: bulkItems });
      setCurrPlacements(res.data);
      setShowBulkModal(false);
      showToast('Placements Replaced', res.message, 'success');
    } catch (err: unknown) {
      showToast('Replace Failed', err instanceof Error ? err.message : 'Failed to replace placements.', 'error');
    }
  };

  // ---- Requirement Groups CRUD ----
  const handleSaveGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gCode.trim() || !gName.trim()) return;
    setSavingGroup(true);
    try {
      if (groupModal === 'create') {
        const res = await api.curriculum.createRequirementGroup({
          code: gCode.trim().toUpperCase(),
          name: gName.trim(),
          nameAr: gNameAr.trim() || null,
          groupType: gType,
        });
        showToast('Group Created', res.message, 'success');
      } else if (groupModal === 'edit' && editingGroupId !== null) {
        const res = await api.curriculum.updateRequirementGroup(editingGroupId, {
          code: gCode.trim().toUpperCase(),
          name: gName.trim(),
          nameAr: gNameAr.trim() || null,
          groupType: gType,
          isActive: gActive,
        });
        showToast('Group Updated', res.message, 'success');
      }
      setGroupModal(null);
      await refreshReferences();
    } catch (err: unknown) {
      showToast('Save Failed', err instanceof Error ? err.message : 'Failed to save group.', 'error');
    } finally {
      setSavingGroup(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHead
        crumbs={[
          { label: 'Admin', href: '#/admin/dashboard' },
          { label: 'Academic Structure' },
          { label: 'Courses & Curriculum' },
        ]}
        title="Courses, Curriculum Versions & Requirement Groups"
        subtitle="Manage the course catalog, prerequisite graphs, draft/active curriculum versions, course placements, and requirement groups."
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <button type="button" className={`btn btn-sm ${tab === 'courses' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('courses')}>
              Courses ({meta?.totalCount ?? courses.length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${tab === 'curricula' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => {
                setTab('curricula');
                if (!selectedCurr && curricula[0]) void loadCurriculumDetail(curricula[0].id);
              }}
            >
              Curriculum Versions ({curricula.length})
            </button>
            <button type="button" className={`btn btn-sm ${tab === 'groups' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('groups')}>
              Requirement Groups ({groups.length})
            </button>
          </div>
        }
      />

      {/* ==================== TAB 1: COURSES ==================== */}
      {tab === 'courses' && (
        <div className="space-y-4">
          <div className="card card-pad flex flex-wrap items-center justify-between gap-3">
            <form
              onSubmit={e => {
                e.preventDefault();
                setPage(1);
                void loadCourses(1, search, deptFilter, groupFilter);
              }}
              className="flex flex-wrap items-center gap-2 flex-1"
            >
              <input
                className="input"
                style={{ maxWidth: '240px' }}
                placeholder="Search code or course name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <select
                className="input"
                style={{ width: 'auto' }}
                value={deptFilter}
                onChange={e => {
                  setDeptFilter(e.target.value);
                  setPage(1);
                  void loadCourses(1, search, e.target.value, groupFilter);
                }}
              >
                <option value="">All Departments</option>
                {departments.map(d => (
                  <option key={d.id} value={String(d.id)}>{d.code} · {d.nameEn}</option>
                ))}
              </select>
              <select
                className="input"
                style={{ width: 'auto' }}
                value={groupFilter}
                onChange={e => {
                  setGroupFilter(e.target.value);
                  setPage(1);
                  void loadCourses(1, search, deptFilter, e.target.value);
                }}
              >
                <option value="">All Requirement Groups</option>
                {groups.map(g => (
                  <option key={g.id} value={String(g.id)}>{g.code} · {g.name}</option>
                ))}
              </select>
              <button type="submit" className="btn btn-outline btn-sm">Search</button>
            </form>
            <button type="button" className="btn btn-primary btn-sm" onClick={openCreateCourse}>
              <Icon name="plus" size="sm" /> Create Course
            </button>
          </div>

          {loadingCourses ? (
            <CardSkeleton />
          ) : coursesError ? (
            <div className="card card-pad state">
              <div className="state-art danger"><Icon name="alert" size="lg" /></div>
              <h3>Failed to load courses</h3>
              <p className="text-sm muted">{coursesError}</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="card card-pad state">
              <div className="state-art"><Icon name="book" size="lg" /></div>
              <h3>No Courses Found</h3>
            </div>
          ) : (
            <div className="card overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Course Name</th>
                    <th>Credits</th>
                    <th>Department</th>
                    <th>Placement</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map(c => (
                    <tr key={c.id}>
                      <td className="font-mono font-bold">{c.code}</td>
                      <td>
                        <div className="font-semibold">{c.name}</div>
                        {c.nameAr && <div className="text-xs muted">{c.nameAr}</div>}
                      </td>
                      <td>
                        <span className="font-semibold">{c.creditHours} cr</span>
                        {!c.isCreditBearing && <span className="chip ml-1 text-[10px]">Non-Credit</span>}
                      </td>
                      <td className="text-sm">{c.departmentName || `#${c.departmentId}`}</td>
                      <td className="text-xs">
                        {c.groupCode ? (
                          <div>
                            <span className="chip">{c.groupCode}</span>{' '}
                            {c.level ? `L${c.level}` : ''} {c.suggestedSemester ? `S${c.suggestedSemester}` : ''}
                          </div>
                        ) : (
                          <span className="muted">—</span>
                        )}
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          <button
                            type="button"
                            className="btn btn-outline btn-xs"
                            onClick={() => void api.courses.adminGetById(c.id).then(setCourseDetail)}
                          >
                            View
                          </button>
                          <button type="button" className="btn btn-outline btn-xs" onClick={() => void openEditCourse(c.id)}>
                            Edit
                          </button>
                          <button type="button" className="btn btn-outline btn-xs" onClick={() => void openPrereqsModal(c)}>
                            Prereqs
                          </button>
                          <button type="button" className="btn btn-danger btn-xs" onClick={() => void handleDeleteCourse(c)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-800 text-sm">
                  <span className="muted">Page {meta.pageIndex} / {meta.totalPages} ({meta.totalCount} courses)</span>
                  <div className="flex gap-2">
                    <button type="button" className="btn btn-outline btn-xs" disabled={!meta.hasPreviousPage} onClick={() => { setPage(page - 1); void loadCourses(page - 1); }}>
                      Previous
                    </button>
                    <button type="button" className="btn btn-outline btn-xs" disabled={!meta.hasNextPage} onClick={() => { setPage(page + 1); void loadCourses(page + 1); }}>
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 2: CURRICULUM VERSIONS & PLACEMENTS ==================== */}
      {tab === 'curricula' && (
        <div className="space-y-4">
          <div className="card card-pad flex flex-wrap items-center justify-between gap-3">
            <form
              onSubmit={async e => {
                e.preventDefault();
                try {
                  const found = await api.curriculum.getVersionForCohort(Number(currCohortYear));
                  setCurrCohortResult(found ? `${found.name} (v${found.versionNumber})` : 'No curriculum matched');
                } catch {
                  setCurrCohortResult('No curriculum matched');
                }
              }}
              className="flex items-center gap-2 flex-wrap"
            >
              <label className="text-xs muted font-semibold">Lookup by Cohort Year:</label>
              <input type="number" className="input" style={{ width: '110px' }} value={currCohortYear} onChange={e => setCurrCohortYear(e.target.value)} />
              <button type="submit" className="btn btn-outline btn-xs">Lookup</button>
              {currCohortResult && <span className="text-xs font-semibold">{currCohortResult}</span>}
            </form>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                setCurrModal('create');
                setCvName('');
                setCvPolicyId(policies[0] ? String(policies[0].id) : '');
                setCvFrom(String(new Date().getFullYear()));
                setCvTo('');
                setCvRef('');
              }}
            >
              <Icon name="plus" size="sm" /> Create Curriculum Draft
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 card card-pad space-y-2">
              <div className="font-bold text-sm mb-2">Versions ({curricula.length})</div>
              {curricula.map(cv => (
                <button
                  key={cv.id}
                  type="button"
                  onClick={() => void loadCurriculumDetail(cv.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedCurr?.id === cv.id
                      ? 'border-sky-400 bg-sky-500/10'
                      : 'border-slate-200 dark:border-slate-800 hover:border-sky-400/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm">{cv.name || `Curriculum v${cv.versionNumber}`}</span>
                    <span className={cv.isActive ? 'chip chip-primary' : 'chip'}>{cv.isActive ? 'Active' : 'Draft'}</span>
                  </div>
                  <div className="text-xs muted mt-1">
                    Policy: {cv.academicPolicyVersionName || `#${cv.academicPolicyVersionId}`} · Cohorts {cv.effectiveCohortFrom}–{cv.effectiveCohortTo ?? '∞'}
                  </div>
                </button>
              ))}
            </div>

            <div className="lg:col-span-8 space-y-4">
              {!selectedCurr ? (
                <div className="card card-pad state">
                  <div className="state-art"><Icon name="layers" size="lg" /></div>
                  <h3>Select a Curriculum Version</h3>
                </div>
              ) : (
                <>
                  <div className="card card-pad space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold">{selectedCurr.name}</h3>
                          <span className={selectedCurr.isActive ? 'chip chip-primary' : 'chip'}>
                            {selectedCurr.isActive ? 'Active' : 'Draft'}
                          </span>
                        </div>
                        <p className="text-xs muted">
                          v{selectedCurr.versionNumber} · Group Credits: {selectedCurr.totalGroupCredits} / Policy Total: {selectedCurr.policyTotalCredits}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button type="button" className="btn btn-outline btn-xs" onClick={() => void handleValidateCurr()}>
                          Validate
                        </button>
                        {selectedCurr.isEditable && (
                          <button
                            type="button"
                            className="btn btn-outline btn-xs"
                            onClick={() => {
                              setCurrModal('edit');
                              setCvName(selectedCurr.name ?? '');
                              setCvPolicyId(String(selectedCurr.academicPolicyVersionId));
                              setCvFrom(String(selectedCurr.effectiveCohortFrom));
                              setCvTo(selectedCurr.effectiveCohortTo ? String(selectedCurr.effectiveCohortTo) : '');
                              setCvRef(selectedCurr.decisionReference ?? '');
                            }}
                          >
                            Edit Info
                          </button>
                        )}
                        {!selectedCurr.isActive && (
                          <button type="button" className="btn btn-primary btn-xs" onClick={() => void handleActivateCurr()}>
                            Activate
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Cohort Range Patch */}
                    <div className="flex flex-wrap items-end gap-2">
                      <div>
                        <label className="label text-xs">Cohort To (blank = open)</label>
                        <input
                          type="number"
                          className="input"
                          style={{ width: '140px' }}
                          value={currCohortToPatch}
                          onChange={e => setCurrCohortToPatch(e.target.value)}
                        />
                      </div>
                      <button type="button" className="btn btn-outline btn-xs" onClick={() => void handlePatchCurrCohort()}>
                        Patch Cohort Range
                      </button>
                    </div>

                    {currValidation && (
                      <div className={`alert ${currValidation.canActivate ? 'alert-info' : 'alert-warning'} text-xs space-y-1`}>
                        <div className="font-bold">
                          Validation: {currValidation.canActivate ? 'Passed (Can Activate)' : 'Not Ready'} ({currValidation.totalGroupCredits}/{currValidation.policyTotalCredits} credits)
                        </div>
                        {(currValidation.checks ?? []).map((chk, idx) => (
                          <div key={idx}>• [{chk.severity}] {chk.message}</div>
                        ))}
                      </div>
                    )}

                    {/* Group Credit Allocations */}
                    <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm">Requirement Group Credit Allocations</span>
                        {selectedCurr.isEditable && (
                          <div className="flex gap-2">
                            <button
                              type="button"
                              className="btn btn-outline btn-xs"
                              onClick={() =>
                                setCurrGroupRows(prev => [
                                  ...prev,
                                  { requirementGroupId: groups[0]?.id ?? 0, compulsoryCredits: 0, electiveCredits: 0 },
                                ])
                              }
                            >
                              + Group
                            </button>
                            <button type="button" className="btn btn-primary btn-xs" onClick={() => void handleSaveCurrGroups()}>
                              Save Allocations
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        {currGroupRows.map((row, idx) => (
                          <div key={idx} className="grid grid-cols-12 gap-2 items-center text-xs">
                            <select
                              className="input col-span-5"
                              disabled={!selectedCurr.isEditable}
                              value={row.requirementGroupId}
                              onChange={e =>
                                setCurrGroupRows(prev => prev.map((r, i) => (i === idx ? { ...r, requirementGroupId: Number(e.target.value) } : r)))
                              }
                            >
                              {groups.map(g => (
                                <option key={g.id} value={g.id}>{g.code} · {g.name}</option>
                              ))}
                            </select>
                            <input
                              type="number"
                              className="input col-span-3"
                              placeholder="Compulsory"
                              disabled={!selectedCurr.isEditable}
                              value={row.compulsoryCredits}
                              onChange={e =>
                                setCurrGroupRows(prev => prev.map((r, i) => (i === idx ? { ...r, compulsoryCredits: Number(e.target.value) } : r)))
                              }
                            />
                            <input
                              type="number"
                              className="input col-span-3"
                              placeholder="Elective"
                              disabled={!selectedCurr.isEditable}
                              value={row.electiveCredits ?? ''}
                              onChange={e =>
                                setCurrGroupRows(prev =>
                                  prev.map((r, i) => (i === idx ? { ...r, electiveCredits: e.target.value === '' ? null : Number(e.target.value) } : r))
                                )
                              }
                            />
                            {selectedCurr.isEditable && (
                              <button type="button" className="btn btn-danger btn-xs col-span-1" onClick={() => setCurrGroupRows(prev => prev.filter((_, i) => i !== idx))}>
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Curriculum Course Placements */}
                  <div className="card card-pad space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-bold text-sm">Course Placements ({currPlacements.length})</h4>
                      {selectedCurr.isEditable && (
                        <button
                          type="button"
                          className="btn btn-outline btn-xs"
                          onClick={() => {
                            setBulkItems([]);
                            setShowBulkModal(true);
                          }}
                        >
                          Atomic Replace All Placements
                        </button>
                      )}
                    </div>

                    {selectedCurr.isEditable && (
                      <form onSubmit={handleUpsertSinglePlacement} className="grid grid-cols-2 sm:grid-cols-6 gap-2 items-end p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                        <div className="col-span-2">
                          <label className="label text-xs">Course</label>
                          <select className="input" value={singleCourseId} onChange={e => setSingleCourseId(e.target.value)} required>
                            <option value="">Select course...</option>
                            {courses.map(c => (
                              <option key={c.id} value={String(c.id)}>{c.code} · {c.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-2">
                          <label className="label text-xs">Group</label>
                          <select className="input" value={singleGroupId} onChange={e => setSingleGroupId(e.target.value)} required>
                            <option value="">Select group...</option>
                            {groups.map(g => (
                              <option key={g.id} value={String(g.id)}>{g.code}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="label text-xs">L / S</label>
                          <div className="flex gap-1">
                            <input type="number" className="input" value={singleLevel} onChange={e => setSingleLevel(e.target.value)} title="Level" />
                            <input type="number" className="input" value={singleSem} onChange={e => setSingleSem(e.target.value)} title="Semester" />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] flex items-center gap-1">
                            <input type="checkbox" checked={singleCompulsory} onChange={e => setSingleCompulsory(e.target.checked)} /> Compulsory
                          </label>
                          <button type="submit" className="btn btn-primary btn-xs">Upsert</button>
                        </div>
                      </form>
                    )}

                    <div className="overflow-x-auto">
                      <table className="table w-full text-xs">
                        <thead>
                          <tr>
                            <th>Group</th>
                            <th>Type</th>
                            <th>Level</th>
                            <th>Suggested Semester</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currPlacements.map((pl, idx) => (
                            <tr key={idx}>
                              <td><b>{pl.groupCode}</b> · {pl.groupName}</td>
                              <td><span className="chip">{pl.isCompulsory ? 'Compulsory' : 'Elective'}</span></td>
                              <td>Level {pl.level}</td>
                              <td>Semester {pl.suggestedSemester}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: REQUIREMENT GROUPS ==================== */}
      {tab === 'groups' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                setGroupModal('create');
                setEditingGroupId(null);
                setGCode('');
                setGName('');
                setGNameAr('');
                setGType('Credit');
                setGActive(true);
              }}
            >
              <Icon name="plus" size="sm" /> Create Requirement Group
            </button>
          </div>
          <div className="card overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name (EN / AR)</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {groups.map(g => (
                  <tr key={g.id}>
                    <td className="font-mono font-bold">{g.code}</td>
                    <td>
                      <div className="font-semibold">{g.name}</div>
                      {g.nameAr && <div className="text-xs muted">{g.nameAr}</div>}
                    </td>
                    <td><span className="chip">{g.groupType}</span></td>
                    <td><span className={g.isActive ? 'chip chip-primary' : 'chip chip-danger'}>{g.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td className="text-right">
                      <button
                        type="button"
                        className="btn btn-outline btn-xs"
                        onClick={async () => {
                          const fresh = await api.curriculum.getRequirementGroupById(g.id);
                          setEditingGroupId(fresh.id);
                          setGCode(fresh.code ?? '');
                          setGName(fresh.name ?? '');
                          setGNameAr(fresh.nameAr ?? '');
                          setGType(fresh.groupType);
                          setGActive(fresh.isActive);
                          setGroupModal('edit');
                        }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Course Create / Edit Modal */}
      {courseModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal card card-pad" style={{ maxWidth: '580px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{courseModal === 'create' ? 'Create Course' : 'Edit Course'}</h3>
              <button type="button" className="icon-btn" onClick={() => !savingCourse && setCourseModal(null)}>
                <Icon name="x" size="sm" />
              </button>
            </div>
            {courseFormError && <div className="alert alert-danger mb-3 text-sm">{courseFormError}</div>}
            <form onSubmit={handleSaveCourse} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {courseModal === 'create' && (
                  <div>
                    <label className="label">Course Code</label>
                    <input className="input" value={cCode} onChange={e => setCCode(e.target.value)} placeholder="CS101" required />
                  </div>
                )}
                <div>
                  <label className="label">Department</label>
                  <select className="input" value={cDeptId} onChange={e => setCDeptId(e.target.value)} required>
                    <option value="">Select department...</option>
                    {departments.map(d => (
                      <option key={d.id} value={String(d.id)}>{d.code} · {d.nameEn}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">English Name</label>
                  <input className="input" value={cName} onChange={e => setCName(e.target.value)} required />
                </div>
                <div>
                  <label className="label">Arabic Name</label>
                  <input className="input" dir="rtl" value={cNameAr} onChange={e => setCNameAr(e.target.value)} />
                </div>
                <div>
                  <label className="label">Credit Hours</label>
                  <input type="number" className="input" value={cCredits} onChange={e => setCCredits(Number(e.target.value))} required />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={cCreditBearing} onChange={e => setCCreditBearing(e.target.checked)} />
                    <span>Credit Bearing</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="label">Description</label>
                <textarea className="input" rows={2} value={cDesc} onChange={e => setCDesc(e.target.value)} />
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-semibold text-xs">Curriculum Placement</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="label text-xs">Curriculum Version</label>
                    <select className="input" value={cCurrId} onChange={e => setCCurrId(e.target.value)}>
                      <option value="">Default Active</option>
                      {curricula.map(cv => (
                        <option key={cv.id} value={String(cv.id)}>{cv.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label text-xs">Requirement Group</label>
                    <select className="input" value={cGroupId} onChange={e => setCGroupId(e.target.value)} required>
                      <option value="">Select group...</option>
                      {groups.map(g => (
                        <option key={g.id} value={String(g.id)}>{g.code} · {g.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label text-xs">Level</label>
                    <input type="number" className="input" value={cLevel} onChange={e => setCLevel(e.target.value)} />
                  </div>
                  <div>
                    <label className="label text-xs">Suggested Semester</label>
                    <input type="number" className="input" value={cSem} onChange={e => setCSem(e.target.value)} />
                  </div>
                </div>
                <label className="flex items-center gap-2 text-xs">
                  <input type="checkbox" checked={cCompulsory} onChange={e => setCCompulsory(e.target.checked)} />
                  <span>Compulsory Course</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="btn btn-outline" onClick={() => setCourseModal(null)} disabled={savingCourse}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={savingCourse}>{savingCourse ? 'Saving...' : 'Save Course'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Prerequisites Modal */}
      {prereqCourse && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal card card-pad" style={{ maxWidth: '520px', width: '100%' }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold">Prerequisites · {prereqCourse.code}</h3>
                <p className="text-xs muted">{prereqCourse.name}</p>
              </div>
              <button type="button" className="icon-btn" onClick={() => setPrereqCourse(null)}>
                <Icon name="x" size="sm" />
              </button>
            </div>
            <div className="space-y-2 mb-4">
              {prereqRows.map((row, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <select
                    className="input flex-1"
                    value={row.prerequisiteCourseId}
                    onChange={e => setPrereqRows(prev => prev.map((r, i) => (i === idx ? { ...r, prerequisiteCourseId: Number(e.target.value) } : r)))}
                  >
                    <option value={0}>Select prerequisite course...</option>
                    {courses.filter(c => c.id !== prereqCourse.id).map(c => (
                      <option key={c.id} value={c.id}>{c.code} · {c.name}</option>
                    ))}
                  </select>
                  <select
                    className="input"
                    style={{ width: '130px' }}
                    value={row.mode}
                    onChange={e => setPrereqRows(prev => prev.map((r, i) => (i === idx ? { ...r, mode: e.target.value as PrerequisiteMode } : r)))}
                  >
                    <option value="Passed">Passed</option>
                    <option value="Registered">Registered</option>
                  </select>
                  <button type="button" className="btn btn-danger btn-xs" onClick={() => setPrereqRows(prev => prev.filter((_, i) => i !== idx))}>
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-outline btn-xs"
                onClick={() => setPrereqRows(prev => [...prev, { prerequisiteCourseId: 0, mode: 'Passed' }])}
              >
                + Add Prerequisite
              </button>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" className="btn btn-outline" onClick={() => setPrereqCourse(null)}>Cancel</button>
              <button type="button" className="btn btn-primary" disabled={savingPrereqs} onClick={() => void handleSavePrereqs()}>
                {savingPrereqs ? 'Saving...' : 'Save Prerequisites'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Course Details Modal */}
      {courseDetail && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal card card-pad" style={{ maxWidth: '520px', width: '100%' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">{courseDetail.code} · {courseDetail.name}</h3>
              <button type="button" className="icon-btn" onClick={() => setCourseDetail(null)}><Icon name="x" size="sm" /></button>
            </div>
            <div className="space-y-2 text-sm">
              {courseDetail.nameAr && <div className="muted" dir="rtl">{courseDetail.nameAr}</div>}
              {courseDetail.description && <p>{courseDetail.description}</p>}
              <div className="flex gap-2 flex-wrap pt-1">
                <span className="chip">{courseDetail.creditHours} Credits</span>
                <span className="chip">{courseDetail.departmentName}</span>
                <span className="chip">{courseDetail.isCreditBearing ? 'Credit-Bearing' : 'Non-Credit'}</span>
              </div>
              <div className="pt-2">
                <div className="font-semibold text-xs mb-1">Prerequisites</div>
                {(courseDetail.prerequisites ?? []).length === 0 ? (
                  <p className="text-xs muted">None</p>
                ) : (
                  (courseDetail.prerequisites ?? []).map(p => (
                    <div key={p.prerequisiteCourseId} className="text-xs">• {p.courseCode} ({p.courseName}) — {p.mode}</div>
                  ))
                )}
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button type="button" className="btn btn-primary btn-sm" onClick={() => setCourseDetail(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Curriculum Create / Edit Modal */}
      {currModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal card card-pad" style={{ maxWidth: '480px', width: '100%' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{currModal === 'create' ? 'Create Curriculum Version' : 'Edit Curriculum Version'}</h3>
              <button type="button" className="icon-btn" onClick={() => setCurrModal(null)}><Icon name="x" size="sm" /></button>
            </div>
            <form onSubmit={handleSaveCurriculum} className="space-y-3">
              <div>
                <label className="label">Name</label>
                <input className="input" value={cvName} onChange={e => setCvName(e.target.value)} required />
              </div>
              <div>
                <label className="label">Academic Policy Version</label>
                <select className="input" value={cvPolicyId} onChange={e => setCvPolicyId(e.target.value)} required>
                  <option value="">Select policy...</option>
                  {policies.map(p => (
                    <option key={p.id} value={String(p.id)}>{p.name} (v{p.versionNumber})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Cohort From</label>
                  <input type="number" className="input" value={cvFrom} onChange={e => setCvFrom(e.target.value)} required />
                </div>
                <div>
                  <label className="label">Cohort To (Optional)</label>
                  <input type="number" className="input" value={cvTo} onChange={e => setCvTo(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="label">Decision Reference</label>
                <input className="input" value={cvRef} onChange={e => setCvRef(e.target.value)} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="btn btn-outline" onClick={() => setCurrModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={savingCurr}>{savingCurr ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Atomic Replace Curriculum Placements Modal */}
      {showBulkModal && selectedCurr && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal card card-pad" style={{ maxWidth: '640px', width: '100%' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">Replace All Placements · {selectedCurr.name}</h3>
              <button type="button" className="icon-btn" onClick={() => setShowBulkModal(false)}><Icon name="x" size="sm" /></button>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto mb-3">
              {bulkItems.map((it, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center text-xs">
                  <select
                    className="input col-span-4"
                    value={it.courseId}
                    onChange={e => setBulkItems(prev => prev.map((x, i) => (i === idx ? { ...x, courseId: Number(e.target.value) } : x)))}
                  >
                    <option value={0}>Course...</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.code}</option>)}
                  </select>
                  <select
                    className="input col-span-3"
                    value={it.requirementGroupId}
                    onChange={e => setBulkItems(prev => prev.map((x, i) => (i === idx ? { ...x, requirementGroupId: Number(e.target.value) } : x)))}
                  >
                    {groups.map(g => <option key={g.id} value={g.id}>{g.code}</option>)}
                  </select>
                  <input type="number" className="input col-span-2" value={it.level ?? 1} onChange={e => setBulkItems(prev => prev.map((x, i) => (i === idx ? { ...x, level: Number(e.target.value) } : x)))} />
                  <input type="number" className="input col-span-2" value={it.suggestedSemester ?? 1} onChange={e => setBulkItems(prev => prev.map((x, i) => (i === idx ? { ...x, suggestedSemester: Number(e.target.value) } : x)))} />
                  <button type="button" className="btn btn-danger btn-xs col-span-1" onClick={() => setBulkItems(prev => prev.filter((_, i) => i !== idx))}>×</button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-outline btn-xs"
                onClick={() =>
                  setBulkItems(prev => [
                    ...prev,
                    { courseId: courses[0]?.id ?? 0, requirementGroupId: groups[0]?.id ?? 0, isCompulsory: true, level: 1, suggestedSemester: 1 },
                  ])
                }
              >
                + Add Placement Row
              </button>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" className="btn btn-outline" onClick={() => setShowBulkModal(false)}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={() => void handleReplaceBulkPlacements()}>Replace All</button>
            </div>
          </div>
        </div>
      )}

      {/* Requirement Group Create / Edit Modal */}
      {groupModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal card card-pad" style={{ maxWidth: '460px', width: '100%' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{groupModal === 'create' ? 'Create Requirement Group' : 'Edit Requirement Group'}</h3>
              <button type="button" className="icon-btn" onClick={() => setGroupModal(null)}><Icon name="x" size="sm" /></button>
            </div>
            <form onSubmit={handleSaveGroup} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Code</label>
                  <input className="input" value={gCode} onChange={e => setGCode(e.target.value)} placeholder="UNI_REQ" required />
                </div>
                <div>
                  <label className="label">Group Type</label>
                  <select className="input" value={gType} onChange={e => setGType(e.target.value as RequirementGroupType)}>
                    <option value="Credit">Credit</option>
                    <option value="NonCredit">NonCredit</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">English Name</label>
                <input className="input" value={gName} onChange={e => setGName(e.target.value)} required />
              </div>
              <div>
                <label className="label">Arabic Name</label>
                <input className="input" dir="rtl" value={gNameAr} onChange={e => setGNameAr(e.target.value)} />
              </div>
              {groupModal === 'edit' && (
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={gActive} onChange={e => setGActive(e.target.checked)} />
                  <span>Active</span>
                </label>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="btn btn-outline" onClick={() => setGroupModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={savingGroup}>{savingGroup ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
