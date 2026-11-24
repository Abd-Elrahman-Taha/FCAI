/**
 * Screen 8: Student Dashboard Overview
 *
 * 100% Live Backend Integration (Zero static/mock data):
 * - GET /api/semesters/active (via ActiveSemesterCard)
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
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { ActiveSemesterCard } from '../../components/common/ActiveSemesterCard';
import { useAuth } from '../../context/AuthContext';

export const StudentDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<StudentProfileResponseDto | null>(null);
  const [standing, setStanding] = useState<StudentAcademicStandingDto | null>(null);
  const [creditLoad, setCreditLoad] = useState<ResolvedCreditLoadDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([
      api.profile.student.getMe(),
      api.profile.student.getLevel(),
      api.profile.student.getCreditLoad(),
    ])
      .then(([p, lvl, cl]) => {
        if (cancelled) return;
        if (p.status === 'fulfilled') setProfile(p.value);
        if (lvl.status === 'fulfilled') setStanding(lvl.value);
        if (cl.status === 'fulfilled') setCreditLoad(cl.value);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton" style={{ height: '140px', borderRadius: '20px' }} />
        <CardSkeleton count={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="hero">
        <div className="row-between wrap">
          <div>
            <div className="hero-chip mb-2">
              <Icon name="graduation" size="sm" /> FCAI BSU Student Portal
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 750, color: '#fff' }}>
              Welcome back, {profile?.fullNameEn || currentUser?.name || 'Student'}
            </h1>
            <div className="sub mt-2 row gap-2 wrap align-center" style={{ fontSize: '13px', color: '#c4dbf3' }}>
              {profile?.studentCode && (
                <span>Student Code: <b className="mono" style={{ color: '#fff' }}>{profile.studentCode}</b></span>
              )}
              {profile?.departmentName && (
                <>
                  <span>•</span>
                  <span>{profile.departmentName}</span>
                </>
              )}
              {standing && (
                <>
                  <span>•</span>
                  <span>Level {standing.level} ({standing.levelName})</span>
                </>
              )}
              {profile?.academicStatus && (
                <span className="chip chip-primary" style={{ fontSize: '11px' }}>
                  {profile.academicStatus}
                </span>
              )}
            </div>
          </div>
          <div className="row gap-2 mt-3 wrap">
            <a href="#/student/courses" className="btn btn-ice">
              <Icon name="book" /> Course Catalog
            </a>
            <a href="#/student/academic" className="btn btn-hero-glass">
              <Icon name="graduation" /> Academic Standing
            </a>
            <a href="#/student/profile" className="btn btn-hero-glass">
              <Icon name="user" /> My Profile
            </a>
          </div>
        </div>
      </div>

      <ActiveSemesterCard />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <a href="#/student/academic" className="card kpi hover">
          <div className="kpi-top">
            <span className="kpi-label">Cumulative GPA</span>
            <span className="kpi-ico info"><Icon name="award" /></span>
          </div>
          <div className="kpi-value">
            {standing ? standing.cgpa.toFixed(2) : profile ? profile.cgpa.toFixed(2) : '—'}
          </div>
          <div className="kpi-meta">{profile?.academicStatus || 'Live Standing'}</div>
        </a>

        <a href="#/student/academic" className="card kpi hover">
          <div className="kpi-top">
            <span className="kpi-label">Academic Level</span>
            <span className="kpi-ico primary"><Icon name="layers" /></span>
          </div>
          <div className="kpi-value">{standing ? `Level ${standing.level}` : '—'}</div>
          <div className="kpi-meta">
            {standing ? `${standing.earnedHours} / ${standing.totalRequiredCredits} cr (${standing.percentage.toFixed(1)}%)` : `${profile?.passedCredits ?? 0} passed cr`}
          </div>
        </a>

        <a href="#/student/academic" className="card kpi hover">
          <div className="kpi-top">
            <span className="kpi-label">Allowed Credit Load</span>
            <span className="kpi-ico info"><Icon name="sliders" /></span>
          </div>
          <div className="kpi-value">
            {creditLoad ? `${creditLoad.minCredits ?? 0}–${creditLoad.maxCredits} cr` : '—'}
          </div>
          <div className="kpi-meta">
            {creditLoad ? `${creditLoad.registeredCredits} registered · ${creditLoad.remainingCredits} remaining` : 'No active semester load'}
          </div>
        </a>

        <a href="#/student/profile" className="card kpi hover">
          <div className="kpi-top">
            <span className="kpi-label">Academic Advisor</span>
            <span className="kpi-ico primary"><Icon name="user" /></span>
          </div>
          <div className="kpi-value" style={{ fontSize: '18px' }}>
            {profile?.academicAdvisorName || 'Unassigned'}
          </div>
          <div className="kpi-meta">
            Warnings: {profile ? `${profile.totalWarningsCount} total` : '—'}
          </div>
        </a>
      </div>

      {standing && (standing.groups ?? []).length > 0 && (
        <div className="card card-pad space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base">Degree Requirement Progress</h3>
            <a href="#/student/academic" className="btn btn-outline btn-xs">View Full Breakdown</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(standing.groups ?? []).map((g, idx) => {
              const pct = g.requiredHours > 0 ? Math.min(100, (g.earnedHours / g.requiredHours) * 100) : 0;
              return (
                <div key={idx} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <b>{g.groupCode} · {g.groupName}</b>
                    <span className="font-mono">{g.earnedHours} / {g.requiredHours} cr</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-[#38bdf8]" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
