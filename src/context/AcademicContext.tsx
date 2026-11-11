/**
 * Academic State Context
 * 
 * Manages active student academic context:
 * - Currently enrolled courses for the semester
 * - Active registration period status
 * - Quick course enrollment and dropping actions
 * 
 * HOW TO INTEGRATE WITH BACKEND:
 * In the action placeholders below, connect to `studentApi` from `src/api/student.api.ts`.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Course } from '../types';
import { api } from '../services/api';
// When ready to connect real API:
// import { studentApi } from '../api/student.api';

export interface AcademicContextType {
  enrolledCourses: Course[];
  currentSemester: string;
  isRegistrationWindowOpen: boolean;
  isLoadingAcademic: boolean;
  academicError: string | null;
  /** Refresh courses and academic standing from backend */
  refreshAcademicData: () => Promise<void>;
  /** Register student for a course offering */
  registerCourse: (offeringId: string) => Promise<{ success: boolean; message?: string }>;
  /** Drop a currently enrolled course */
  dropCourse: (courseId: string) => Promise<{ success: boolean; message?: string }>;
}

const AcademicContext = createContext<AcademicContextType | undefined>(undefined);

export const AcademicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [currentSemester] = useState<string>('Fall 2026/2027');
  const [isRegistrationWindowOpen] = useState<boolean>(true);
  const [isLoadingAcademic, setIsLoadingAcademic] = useState<boolean>(false);
  const [academicError, setAcademicError] = useState<string | null>(null);

  /**
   * Action: Refresh student courses from backend
   */
  const refreshAcademicData = useCallback(async (): Promise<void> => {
    setIsLoadingAcademic(true);
    setAcademicError(null);
    try {
      // TODO: [Backend Integration] Replace with `await studentApi.getMyCourses()`
      const courses = await api.getMyCourses();
      setEnrolledCourses(courses);
    } catch (err: any) {
      setAcademicError(err?.message || 'Failed to load enrolled courses.');
    } finally {
      setIsLoadingAcademic(false);
    }
  }, []);

  /**
   * Action: Register for a course
   */
  const registerCourse = async (offeringId: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoadingAcademic(true);
    try {
      // TODO: [Backend Integration] Replace with `await studentApi.registerCourse({ offeringId })`
      const res = await api.registerCourse(offeringId);
      if (res && (res as any).course) {
        setEnrolledCourses(prev => [...prev, (res as any).course]);
      }
      return { success: res.success, message: res.message || 'Course registration processed.' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Registration failed.' };
    } finally {
      setIsLoadingAcademic(false);
    }
  };

  /**
   * Action: Drop an enrolled course
   */
  const dropCourse = async (courseId: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoadingAcademic(true);
    try {
      // TODO: [Backend Integration] Replace with `await studentApi.dropCourse({ courseId })`
      const res = await api.dropCourse(courseId);
      if (res && res.success) {
        setEnrolledCourses(prev => prev.filter(c => c.id !== courseId && c.code !== courseId));
      }
      return { success: true, message: res?.message || 'Course dropped successfully.' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Failed to drop course.' };
    } finally {
      setIsLoadingAcademic(false);
    }
  };

  useEffect(() => {
    refreshAcademicData();
  }, [refreshAcademicData]);

  return (
    <AcademicContext.Provider
      value={{
        enrolledCourses,
        currentSemester,
        isRegistrationWindowOpen,
        isLoadingAcademic,
        academicError,
        refreshAcademicData,
        registerCourse,
        dropCourse,
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
