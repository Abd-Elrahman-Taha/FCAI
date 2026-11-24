/**
 * Screen 14: Student Course Details Page
 *
 * Connected strictly to confirmed public Swagger endpoint:
 * - GET /api/courses/{id}
 */

import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import type { CourseDto } from '../../types/api';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';

const parseCourseIdFromHash = (): number | null => {
  const hash = window.location.hash || '';
  const queryIdx = hash.indexOf('?');
  if (queryIdx === -1) return null;
  const params = new URLSearchParams(hash.slice(queryIdx + 1));
  const raw = params.get('id');
  if (!raw) return null;
  const num = Number(raw);
  return Number.isInteger(num) && num > 0 ? num : null;
};

export const StudentCourseDetails: React.FC = () => {
  const [courseId] = useState<number | null>(() => parseCourseIdFromHash());
  const [course, setCourse] = useState<CourseDto | null>(null);
  const [loading, setLoading] = useState<boolean>(courseId !== null);
  const [error, setError] = useState<string | null>(
    courseId === null ? 'Select a course from the Course Catalog to view its details.' : null
  );

  useEffect(() => {
    if (courseId === null) return;
    let cancelled = false;
    api.courses
      .getPublicById(courseId)
      .then(data => {
        if (!cancelled) {
          setCourse(data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Course not found.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  return (
    <div className="space-y-6">
      <PageHead
        crumbs={[
          { label: 'Student', href: '#/student/dashboard' },
          { label: 'Course Catalog', href: '#/student/courses' },
          { label: course?.code || 'Course Details' },
        ]}
        title={course ? `${course.code} — ${course.name}` : 'Course Details'}
        subtitle={course?.nameAr || 'Full syllabus metadata, curriculum placements, and prerequisite rules.'}
        actions={
          <a href="#/student/courses" className="btn btn-outline btn-sm">
            Back to Catalog
          </a>
        }
      />

      {loading ? (
        <CardSkeleton />
      ) : error || !course ? (
        <div className="card card-pad state">
          <div className="state-art"><Icon name="book" size="lg" /></div>
          <h3>Course Details Unavailable</h3>
          <p className="text-sm muted">{error}</p>
          <a href="#/student/courses" className="btn btn-primary btn-sm mt-3">Browse Course Catalog</a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 card card-pad space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="chip chip-primary">{course.creditHours} Credit Hours</span>
              <span className="chip">{course.departmentName}</span>
              <span className="chip">{course.isCreditBearing ? 'Credit-Bearing' : 'Non-Credit'}</span>
            </div>
            <div>
              <h3 className="font-bold text-base mb-1">Course Description</h3>
              <p className="text-sm muted leading-relaxed">
                {course.description || 'No description provided for this course.'}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base mb-2">Curriculum Placements</h3>
              {(course.placements ?? []).length === 0 ? (
                <p className="text-sm muted">Not yet mapped into any curriculum version.</p>
              ) : (
                <div className="space-y-2">
                  {(course.placements ?? []).map((pl, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap justify-between gap-2 text-xs">
                      <div>
                        <b>{pl.curriculumName}</b> · {pl.groupCode} ({pl.groupName})
                      </div>
                      <div className="flex gap-1.5">
                        <span className="chip">{pl.isCompulsory ? 'Compulsory' : 'Elective'}</span>
                        <span className="chip">Level {pl.level}</span>
                        <span className="chip">Sem {pl.suggestedSemester}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 card card-pad space-y-3">
            <h3 className="font-bold text-base">Prerequisites</h3>
            {(course.prerequisites ?? []).length === 0 ? (
              <p className="text-sm muted">No prerequisites required.</p>
            ) : (
              <div className="space-y-2">
                {(course.prerequisites ?? []).map(p => (
                  <div key={p.prerequisiteCourseId} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm">
                    <div className="flex items-center justify-between">
                      <b className="font-mono">{p.courseCode}</b>
                      <span className="chip">{p.mode}</span>
                    </div>
                    <div className="text-xs muted mt-1">{p.courseName}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
