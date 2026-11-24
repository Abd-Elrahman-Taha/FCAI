/**
 * Screen 11: Student Course Catalog Explorer
 *
 * Connected strictly to all 3 confirmed public Swagger Courses endpoints:
 * - GET /api/courses (paged search & filters)
 * - GET /api/courses/catalog (full public academic catalog)
 * - GET /api/courses/{id} (single course detail with placements & prerequisites)
 */

import React, { useCallback, useEffect, useState } from 'react';
import { api } from '../../services/api';
import type {
  CourseCatalogItemDto,
  CourseDto,
  CourseListItemDto,
  DepartmentLookupDto,
  PaginationMetadata,
} from '../../types/api';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';

export const StudentCourses: React.FC = () => {
  const [viewMode, setViewMode] = useState<'search' | 'catalog'>('search');

  const [departments, setDepartments] = useState<DepartmentLookupDto[]>([]);
  const [courses, setCourses] = useState<CourseListItemDto[]>([]);
  const [meta, setMeta] = useState<PaginationMetadata | null>(null);
  const [catalog, setCatalog] = useState<CourseCatalogItemDto[]>([]);

  const [search, setSearch] = useState('');
  const [deptId, setDeptId] = useState('');
  const [level, setLevel] = useState('');
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<CourseDto | null>(null);

  const loadSearch = useCallback(async (p = page, q = search, d = deptId, lvl = level) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.courses.searchPublic({
        Page: p,
        PageSize: 18,
        Search: q.trim() || undefined,
        DepartmentId: d ? Number(d) : undefined,
        Level: lvl ? Number(lvl) : undefined,
      });
      setCourses(res.items ?? []);
      setMeta(res.meta ?? null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to search courses.');
    } finally {
      setLoading(false);
    }
  }, [page, search, deptId, level]);

  const loadCatalog = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await api.courses.getPublicCatalog();
      setCatalog(list);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load full course catalog.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.courses.searchPublic({ Page: 1, PageSize: 18 }),
      api.departments.getLookup().catch(() => [] as DepartmentLookupDto[]),
    ])
      .then(([res, depts]) => {
        if (cancelled) return;
        setCourses(res.items ?? []);
        setMeta(res.meta ?? null);
        setDepartments(depts);
        setError(null);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load courses.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSwitchMode = (next: 'search' | 'catalog') => {
    setViewMode(next);
    if (next === 'catalog' && catalog.length === 0) {
      void loadCatalog();
    } else if (next === 'search' && courses.length === 0) {
      void loadSearch(1);
    }
  };

  const openCourseQuickView = async (id: number) => {
    try {
      const data = await api.courses.getPublicById(id);
      setSelectedCourse(data);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6">
      <PageHead
        crumbs={[
          { label: 'Student', href: '#/student/dashboard' },
          { label: 'Course Catalog' },
        ]}
        title="University Course Catalog"
        subtitle="Explore live courses, credit hours, level placements, and prerequisite chains directly from the FCAI BSU academic catalog."
        actions={
          <div className="flex gap-2">
            <button
              type="button"
              className={`btn btn-sm ${viewMode === 'search' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => handleSwitchMode('search')}
            >
              Paged Search
            </button>
            <button
              type="button"
              className={`btn btn-sm ${viewMode === 'catalog' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => handleSwitchMode('catalog')}
            >
              Full Academic Catalog
            </button>
          </div>
        }
      />

      {viewMode === 'search' && (
        <div className="card card-pad">
          <form
            onSubmit={e => {
              e.preventDefault();
              setPage(1);
              void loadSearch(1, search, deptId, level);
            }}
            className="grid grid-cols-1 md:grid-cols-4 gap-3"
          >
            <input className="input" placeholder="Search code or course name..." value={search} onChange={e => setSearch(e.target.value)} />
            <select
              className="input"
              value={deptId}
              onChange={e => {
                setDeptId(e.target.value);
                setPage(1);
                void loadSearch(1, search, e.target.value, level);
              }}
            >
              <option value="">All Departments</option>
              {departments.map(d => <option key={d.id} value={String(d.id)}>{d.code} · {d.nameEn}</option>)}
            </select>
            <select
              className="input"
              value={level}
              onChange={e => {
                setLevel(e.target.value);
                setPage(1);
                void loadSearch(1, search, deptId, e.target.value);
              }}
            >
              <option value="">All Levels</option>
              <option value="1">Level 1</option>
              <option value="2">Level 2</option>
              <option value="3">Level 3</option>
              <option value="4">Level 4</option>
            </select>
            <button type="submit" className="btn btn-primary btn-sm">Search</button>
          </form>
        </div>
      )}

      {loading ? (
        <CardSkeleton />
      ) : error ? (
        <div className="card card-pad state">
          <div className="state-art danger"><Icon name="alert" size="lg" /></div>
          <h3>Could not load courses</h3>
          <p className="text-sm muted">{error}</p>
        </div>
      ) : viewMode === 'search' ? (
        <>
          {courses.length === 0 ? (
            <div className="card card-pad state">
              <div className="state-art"><Icon name="book" size="lg" /></div>
              <h3>No Courses Found</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map(c => (
                <div key={c.id} className="card card-pad flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono font-bold text-sm text-sky-600 dark:text-sky-400">{c.code}</span>
                      <span className="chip">{c.creditHours} cr</span>
                    </div>
                    <h4 className="font-bold text-base">{c.name}</h4>
                    {c.nameAr && <p className="text-xs muted" dir="rtl">{c.nameAr}</p>}
                    <div className="flex flex-wrap gap-1.5 mt-2 text-xs">
                      {c.departmentName && <span className="chip">{c.departmentName}</span>}
                      {c.groupCode && <span className="chip">{c.groupCode}</span>}
                      {c.level && <span className="chip">Level {c.level}</span>}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                    <button type="button" className="btn btn-outline btn-xs" onClick={() => void openCourseQuickView(c.id)}>
                      Quick View
                    </button>
                    <a href={`#/student/course-details?id=${c.id}`} className="btn btn-primary btn-xs">
                      Full Details
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {meta && meta.totalPages > 1 && (
            <div className="card card-pad flex items-center justify-between text-sm">
              <span className="muted">Page {meta.pageIndex} / {meta.totalPages} ({meta.totalCount} courses)</span>
              <div className="flex gap-2">
                <button type="button" className="btn btn-outline btn-xs" disabled={!meta.hasPreviousPage} onClick={() => { setPage(page - 1); void loadSearch(page - 1); }}>Previous</button>
                <button type="button" className="btn btn-outline btn-xs" disabled={!meta.hasNextPage} onClick={() => { setPage(page + 1); void loadSearch(page + 1); }}>Next</button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="card overflow-x-auto">
          <table className="table w-full text-sm">
            <thead>
              <tr>
                <th>Code</th>
                <th>Course</th>
                <th>Credits</th>
                <th>Department / Group</th>
                <th>Level / Sem</th>
                <th>Prerequisites</th>
                <th className="text-right">Details</th>
              </tr>
            </thead>
            <tbody>
              {catalog.map(c => (
                <tr key={c.id}>
                  <td className="font-mono font-bold">{c.code}</td>
                  <td>
                    <div className="font-semibold">{c.name}</div>
                    {c.nameAr && <div className="text-xs muted">{c.nameAr}</div>}
                  </td>
                  <td>{c.creditHours} cr</td>
                  <td className="text-xs">
                    <div>{c.departmentName}</div>
                    {c.groupCode && <span className="chip mt-0.5">{c.groupCode}</span>}
                  </td>
                  <td className="text-xs">
                    {c.level ? `L${c.level}` : '—'} {c.suggestedSemester ? `/ S${c.suggestedSemester}` : ''}
                  </td>
                  <td className="text-xs">
                    {(c.prerequisites ?? []).length === 0 ? (
                      <span className="muted">None</span>
                    ) : (
                      (c.prerequisites ?? []).map(p => p.courseCode).join(', ')
                    )}
                  </td>
                  <td className="text-right">
                    <a href={`#/student/course-details?id=${c.id}`} className="btn btn-outline btn-xs">Open</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedCourse && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal card card-pad" style={{ maxWidth: '520px', width: '100%' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">{selectedCourse.code} · {selectedCourse.name}</h3>
              <button type="button" className="icon-btn" onClick={() => setSelectedCourse(null)}><Icon name="x" size="sm" /></button>
            </div>
            <div className="space-y-3 text-sm">
              {selectedCourse.nameAr && <div className="muted" dir="rtl">{selectedCourse.nameAr}</div>}
              {selectedCourse.description && <p>{selectedCourse.description}</p>}
              <div className="flex flex-wrap gap-2">
                <span className="chip">{selectedCourse.creditHours} Credits</span>
                <span className="chip">{selectedCourse.departmentName}</span>
                <span className="chip">{selectedCourse.isCreditBearing ? 'Credit-Bearing' : 'Non-Credit'}</span>
              </div>
              <div>
                <div className="font-semibold text-xs mb-1">Prerequisites</div>
                {(selectedCourse.prerequisites ?? []).length === 0 ? (
                  <p className="text-xs muted">No prerequisites.</p>
                ) : (
                  (selectedCourse.prerequisites ?? []).map(p => (
                    <div key={p.prerequisiteCourseId} className="text-xs">• <b>{p.courseCode}</b> ({p.courseName}) — {p.mode}</div>
                  ))
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <a href={`#/student/course-details?id=${selectedCourse.id}`} className="btn btn-outline btn-sm">Open Full Page</a>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => setSelectedCourse(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
