/**
 * Academic State Context — Connected to GET /api/semesters/active
 *
 * Fetches the active semester from the backend ONLY after authentication
 * (and once any mandatory password change is complete).
 *
 * Rules enforced:
 * - Never calls /api/semesters/active before authentication.
 * - Treats HTTP 404 as "no active semester" (noActiveSemester = true, activeSemester = null).
 * - Never fabricates fake semester names or window statuses.
 * - Computes registration/drop/withdrawal/preference availability strictly from
 *   the backend-returned window `status`, never the browser's local clock.
 * - Tracks `serverClockOffsetMs` from `serverTimeUtc` for accurate countdowns.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Course } from '../types';
import type { ActiveSemester } from '../types/api/academic.types';
import { api, ApiError } from '../services/api';
import { useAuth } from './AuthContext';

export interface AcademicContextType {
  /** Real active semester from GET /api/semesters/active (null when 404 or unauthenticated) */
  activeSemester: ActiveSemester | null;
  /** True when backend explicitly returned 404 (no semester currently active) */
  noActiveSemester: boolean;
  /** Offset (serverTimeUtcMs - clientNowMs) captured on fetch for server-synced countdowns */
  serverClockOffsetMs: number;
  isLoadingSemester: boolean;
  semesterError: string | null;
  refreshActiveSemester: () => Promise<void>;

  // Derived convenience properties
  currentSemester: string;
  isRegistrationWindowOpen: boolean;

  // Legacy student course fields (future backend phase — kept empty without fake API calls)
  enrolledCourses: Course[];
  isLoadingAcademic: boolean;
  academicError: string | null;
  refreshAcademicData: () => Promise<void>;
}

const AcademicContext = createContext<AcademicContextType | undefined>(undefined);

export const AcademicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, requiresPasswordChange } = useAuth();

  const [activeSemester, setActiveSemester] = useState<ActiveSemester | null>(null);
  const [noActiveSemester, setNoActiveSemester] = useState<boolean>(false);
  const [serverClockOffsetMs, setServerClockOffsetMs] = useState<number>(0);
  const [isLoadingSemester, setIsLoadingSemester] = useState<boolean>(false);
  const [semesterError, setSemesterError] = useState<string | null>(null);

  const [enrolledCourses] = useState<Course[]>([]);

  const refreshActiveSemester = useCallback(async (): Promise<void> => {
    if (!isAuthenticated || requiresPasswordChange) {
      return;
    }

    setIsLoadingSemester(true);
    setSemesterError(null);
    setNoActiveSemester(false);

    try {
      const data = await api.semesters.getActive();
      if (data === null) {
        setActiveSemester(null);
        setNoActiveSemester(true);
        setServerClockOffsetMs(0);
      } else {
        setActiveSemester(data);
        setNoActiveSemester(false);
        const serverMs = Date.parse(data.serverTimeUtc);
        if (!Number.isNaN(serverMs)) {
          setServerClockOffsetMs(serverMs - Date.now());
        }
      }
    } catch (err: unknown) {
      setActiveSemester(null);
      setNoActiveSemester(false);
      const message =
        err instanceof ApiError || err instanceof Error
          ? err.message
          : 'Failed to load active semester from backend.';
      setSemesterError(message);
    } finally {
      setIsLoadingSemester(false);
    }
  }, [isAuthenticated, requiresPasswordChange]);

  useEffect(() => {
    if (!isAuthenticated || requiresPasswordChange) {
      return;
    }

    let cancelled = false;
    api.semesters
      .getActive()
      .then(data => {
        if (cancelled) return;
        if (data === null) {
          setActiveSemester(null);
          setNoActiveSemester(true);
          setServerClockOffsetMs(0);
          setSemesterError(null);
        } else {
          setActiveSemester(data);
          setNoActiveSemester(false);
          setSemesterError(null);
          const serverMs = Date.parse(data.serverTimeUtc);
          if (!Number.isNaN(serverMs)) {
            setServerClockOffsetMs(serverMs - Date.now());
          }
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setActiveSemester(null);
        setNoActiveSemester(false);
        const message =
          err instanceof ApiError || err instanceof Error
            ? err.message
            : 'Failed to load active semester from backend.';
        setSemesterError(message);
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, requiresPasswordChange]);

  const effectiveActiveSemester = isAuthenticated && !requiresPasswordChange ? activeSemester : null;
  const effectiveNoActiveSemester = isAuthenticated && !requiresPasswordChange ? noActiveSemester : false;
  const effectiveSemesterError = isAuthenticated && !requiresPasswordChange ? semesterError : null;
  const effectiveOffsetMs = isAuthenticated && !requiresPasswordChange ? serverClockOffsetMs : 0;

  const currentSemester = effectiveActiveSemester
    ? `${effectiveActiveSemester.name} · ${effectiveActiveSemester.academicYearName}`
    : effectiveNoActiveSemester
    ? 'No Active Semester'
    : '—';

  const isRegistrationWindowOpen = effectiveActiveSemester?.windows.registration.status === 'Open';

  return (
    <AcademicContext.Provider
      value={{
        activeSemester: effectiveActiveSemester,
        noActiveSemester: effectiveNoActiveSemester,
        serverClockOffsetMs: effectiveOffsetMs,
        isLoadingSemester,
        semesterError: effectiveSemesterError,
        refreshActiveSemester,
        currentSemester,
        isRegistrationWindowOpen,
        enrolledCourses,
        isLoadingAcademic: isLoadingSemester,
        academicError: effectiveSemesterError,
        refreshAcademicData: refreshActiveSemester,
      }}
    >
      {children}
    </AcademicContext.Provider>
  );
};

export const useAcademic = (): AcademicContextType => {
  const context = useContext(AcademicContext);
  if (!context) {
    throw new Error('useAcademic must be used within an AcademicProvider');
  }
  return context;
};
