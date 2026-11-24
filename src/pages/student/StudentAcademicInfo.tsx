/**
 * Screen 10: Student Academic Information, Level Progress & Credit Load
 *
 * Connected strictly to confirmed Swagger endpoints:
 * - GET /api/students/me
 * - GET /api/students/me/level
 * - GET /api/students/me/credit-load
 */

import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import type {
  ResolvedCreditLoadDto,
  StudentAcademicStandingDto,
  StudentProfileResponseDto,
} from '../../types/api';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { ActiveSemesterCard } from '../../components/common/ActiveSemesterCard';

export const StudentAcademicInfo: React.FC = () => {
  const [profile, setProfile] = useState<StudentProfileResponseDto | null>(null);
  const [standing, setStanding] = useState<StudentAcademicStandingDto | null>(null);
  const [creditLoad, setCreditLoad] = useState<ResolvedCreditLoadDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.profile.student.getMe().catch(() => null),
      api.profile.student.getLevel().catch(() => null),
      api.profile.student.getCreditLoad().catch(() => null),
    ])
      .then(([p, lvl, cl]) => {
        if (cancelled) return;
        if (!p && !lvl && !cl) {
          setError('Could not load your academic standing from the backend.');
        } else {
          setProfile(p);
          setStanding(lvl);
          setCreditLoad(cl);
          setError(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <PageHead
        crumbs={[
          { label: 'Student', href: '#/student/dashboard' },
          { label: 'Academic Information' },
        ]}
        title="Academic Standing & Credit Load"
        subtitle="Live academic level progress, curriculum requirement group completion, and allowed credit hours for the active semester."
      />

      <ActiveSemesterCard />

      {loading ? (
        <CardSkeleton />
      ) : error ? (
        <div className="card card-pad state">
          <div className="state-art danger"><Icon name="alert" size="lg" /></div>
          <h3>Academic information unavailable</h3>
          <p className="text-sm muted">{error}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary KPI Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card card-pad">
              <span className="text-xs muted">Academic Level</span>
              <div className="text-2xl font-extrabold mt-1">
                {standing ? `Level ${standing.level}` : '—'}
              </div>
              <div className="text-xs muted mt-1">
                {standing?.levelName} {standing?.levelNameAr ? `(${standing.levelNameAr})` : ''}
              </div>
            </div>
            <div className="card card-pad">
              <span className="text-xs muted">Cumulative GPA</span>
              <div className="text-2xl font-extrabold mt-1">
                {(standing?.cgpa ?? profile?.cgpa ?? 0).toFixed(2)}
              </div>
              <div className="text-xs muted mt-1">{profile?.academicStatus || 'Active'}</div>
            </div>
            <div className="card card-pad">
              <span className="text-xs muted">Degree Progress</span>
              <div className="text-2xl font-extrabold mt-1">
                {standing ? `${standing.earnedHours} / ${standing.totalRequiredCredits}` : `${profile?.passedCredits ?? 0} cr`}
              </div>
              <div className="text-xs muted mt-1">
                {standing ? `${standing.percentage.toFixed(1)}% completed · ${standing.remainingHours} cr left` : ''}
              </div>
            </div>
            <div className="card card-pad">
              <span className="text-xs muted">Allowed Credit Load</span>
              <div className="text-2xl font-extrabold mt-1">
                {creditLoad ? `${creditLoad.minCredits ?? 0}–${creditLoad.maxCredits} cr` : '—'}
              </div>
              <div className="text-xs muted mt-1">
                {creditLoad ? `${creditLoad.registeredCredits} registered · ${creditLoad.remainingCredits} remaining` : 'No active semester load'}
              </div>
            </div>
          </div>

          {/* Credit Load Details */}
          {creditLoad && (
            <div className="card card-pad space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-bold text-base">Semester Credit Load Resolution ({creditLoad.semesterName})</h3>
                <span className="chip chip-primary">Rule Source: {creditLoad.source}</span>
              </div>
              {creditLoad.explanation && <p className="text-sm muted">{creditLoad.explanation}</p>}
              <div className="flex flex-wrap gap-4 text-xs pt-1">
                <span>CGPA Used: <b>{creditLoad.cgpaUsed?.toFixed(2) ?? 'N/A'}</b></span>
                <span>Min Credits: <b>{creditLoad.minCredits ?? 'None'}</b></span>
                <span>Max Credits: <b>{creditLoad.maxCredits}</b></span>
                <span>Registered: <b>{creditLoad.registeredCredits}</b></span>
                <span>Remaining Capacity: <b>{creditLoad.remainingCredits}</b></span>
              </div>
            </div>
          )}

          {/* Requirement Groups Progress */}
          {standing && (standing.groups ?? []).length > 0 && (
            <div className="card card-pad space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base">Curriculum Progress ({standing.curriculumName || 'Assigned Curriculum'})</h3>
                  {standing.nextLevelNumber && (
                    <p className="text-xs muted">
                      {standing.creditsToNextLevel} more credits required to reach Level {standing.nextLevelNumber}.
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(standing.groups ?? []).map((g, idx) => {
                  const pct = g.requiredHours > 0 ? Math.min(100, (g.earnedHours / g.requiredHours) * 100) : 0;
                  return (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-bold">{g.groupCode} · {g.groupName}</span>
                        <span className="font-mono text-xs">{g.earnedHours} / {g.requiredHours} cr</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div className="h-full bg-[#38bdf8]" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="text-xs muted flex justify-between">
                        <span>{g.groupNameAr || ''}</span>
                        <span>{g.remainingHours} cr remaining</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Non-Credit Required Courses */}
          {standing && (standing.requiredNonCreditCourses ?? []).length > 0 && (
            <div className="card card-pad space-y-3">
              <h3 className="font-bold text-base">Required Non-Credit Courses</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(standing.requiredNonCreditCourses ?? []).map(nc => (
                  <div key={nc.courseId} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm">
                    <div>
                      <b className="font-mono">{nc.courseCode}</b> · {nc.courseName}
                    </div>
                    <span className="chip">{nc.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
