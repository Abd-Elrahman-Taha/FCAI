/**
 * Active Semester Card — Connected to GET /api/semesters/active
 *
 * Reusable live widget for all 5 authenticated roles (Admin, Student, Doctor,
 * TeachingAssistant, Employee).
 *
 * Rules enforced:
 * - Uses backend-computed `window.status` strictly (never browser local clock).
 * - Uses `serverTimeUtc` (+ captured clock offset) for live countdowns and UTC display.
 * - Renders an explicit empty state when backend returns 404 (no active semester).
 * - Renders an explicit error state with Retry on backend/network errors.
 */

import React, { useEffect, useState } from 'react';
import { useAcademic } from '../../context/AcademicContext';
import { Icon } from '../icons/Icon';
import type { SemesterWindow, WindowStatus } from '../../types/api/academic.types';

function getWindowBadgeClass(status: WindowStatus): string {
  switch (status) {
    case 'Open':
      return 'badge-success';
    case 'Upcoming':
      return 'badge-info';
    case 'Closed':
      return 'badge-danger';
    case 'NotConfigured':
    default:
      return 'badge-neutral';
  }
}

function formatUtcDateTime(iso: string | null): string {
  if (!iso) return 'Not scheduled';
  const parsed = Date.parse(iso);
  if (Number.isNaN(parsed)) return iso;
  return new Date(parsed).toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
}

function formatCountdown(targetIso: string | null, serverNowMs: number): string | null {
  if (!targetIso) return null;
  const targetMs = Date.parse(targetIso);
  if (Number.isNaN(targetMs)) return null;
  const diffMs = targetMs - serverNowMs;
  if (diffMs <= 0) return '0m';

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

export const ActiveSemesterCard: React.FC = () => {
  const {
    activeSemester,
    noActiveSemester,
    serverClockOffsetMs,
    isLoadingSemester,
    semesterError,
    refreshActiveSemester,
  } = useAcademic();

  const [clientNowMs, setClientNowMs] = useState<number>(() => Date.now());

  useEffect(() => {
    if (!activeSemester) return;
    const timer = window.setInterval(() => {
      setClientNowMs(Date.now());
    }, 1000);
    return () => window.clearInterval(timer);
  }, [activeSemester]);

  const serverNowMs = clientNowMs + serverClockOffsetMs;

  if (isLoadingSemester && !activeSemester) {
    return (
      <div className="card card-pad mb-6">
        <div className="row-between">
          <div className="row gap-2">
            <span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
            <span className="text-sm muted">Loading active semester from backend…</span>
          </div>
        </div>
      </div>
    );
  }

  if (semesterError) {
    return (
      <div className="alert alert-danger mb-6" role="alert">
        <Icon name="alertCircle" />
        <div className="flex-1">
          <b>Unable to Load Active Semester</b>
          <p className="text-xs mt-1">{semesterError}</p>
        </div>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => refreshActiveSemester()}
        >
          <Icon name="refresh" size="sm" /> Retry
        </button>
      </div>
    );
  }

  if (noActiveSemester || !activeSemester) {
    return (
      <div className="card card-pad mb-6">
        <div className="row-between wrap gap-3">
          <div className="row gap-3">
            <div className="state-art info m-0" style={{ width: '44px', height: '44px', borderRadius: '12px' }}>
              <Icon name="calendar" size="md" />
            </div>
            <div>
              <span className="badge badge-neutral no-dot mb-1">No Active Semester</span>
              <h3 style={{ fontSize: '15px', fontWeight: 700 }}>No semester is currently set as active</h3>
              <p className="text-xs muted mt-0.5">
                The backend returned no active semester (HTTP 404). Registration, drop, withdrawal, and preference windows are unavailable until an administrator activates a semester.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => refreshActiveSemester()}
          >
            <Icon name="refresh" size="sm" /> Refresh
          </button>
        </div>
      </div>
    );
  }

  const windowItems: { key: string; label: string; icon: string; window: SemesterWindow }[] = [
    { key: 'registration', label: 'Course Registration', icon: 'plusSquare', window: activeSemester.windows.registration },
    { key: 'drop', label: 'Course Drop', icon: 'calendar', window: activeSemester.windows.drop },
    { key: 'withdrawal', label: 'Course Withdrawal', icon: 'fileText', window: activeSemester.windows.withdrawal },
    { key: 'preference', label: 'Track / Preference', icon: 'sliders', window: activeSemester.windows.preference },
  ];

  const serverClockIso = new Date(serverNowMs).toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

  return (
    <div className="card mb-6 overflow-hidden">
      <div className="card-head wrap gap-3">
        <div>
          <div className="row gap-2 wrap mb-1">
            <span className="badge badge-primary no-dot">{activeSemester.academicYearName}</span>
            <span className="badge badge-info no-dot">{activeSemester.semesterType} Semester</span>
            <span className="badge badge-success">Active Term</span>
          </div>
          <h3 style={{ fontSize: '17px', fontWeight: 750 }}>
            <Icon name="calendar" size="sm" /> {activeSemester.name}
          </h3>
          <p className="text-xs muted mt-0.5">
            Term Dates: <b className="mono">{activeSemester.startDate}</b> to <b className="mono">{activeSemester.endDate}</b>
          </p>
        </div>

        <div className="row gap-2 wrap align-center">
          <div className="text-right">
            <span className="text-xs muted block">Backend Server Time (UTC)</span>
            <code className="text-xs">{serverClockIso}</code>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => refreshActiveSemester()}
            disabled={isLoadingSemester}
            title="Refresh active semester & window statuses"
          >
            <Icon name="refresh" size="sm" /> {isLoadingSemester ? 'Syncing…' : 'Sync'}
          </button>
        </div>
      </div>

      <div className="card-body">
        <div className="grid g-4">
          {windowItems.map(item => {
            const w = item.window;
            const countdown =
              w.status === 'Open' && w.end
                ? `Closes in ${formatCountdown(w.end, serverNowMs)}`
                : w.status === 'Upcoming' && w.start
                ? `Opens in ${formatCountdown(w.start, serverNowMs)}`
                : null;

            return (
              <div
                key={item.key}
                className="info-tile"
                style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
              >
                <div className="row-between gap-2">
                  <span className="text-xs fw-7 row gap-1.5">
                    <Icon name={item.icon} size="sm" />
                    {item.label}
                  </span>
                  <span className={`badge ${getWindowBadgeClass(w.status)} no-dot`} style={{ fontSize: '10.5px', height: '20px', padding: '0 8px' }}>
                    {w.status}
                  </span>
                </div>

                {countdown && (
                  <div className="text-xs fw-6 mono" style={{ color: 'var(--primary)' }}>
                    {countdown}
                  </div>
                )}

                <div className="text-xs muted" style={{ lineHeight: 1.45 }}>
                  <div>Start: <span className="mono">{formatUtcDateTime(w.start)}</span></div>
                  <div>End: <span className="mono">{formatUtcDateTime(w.end)}</span></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
