/**
 * Teaching Assistant (TA) Service
 * 
 * Interacts with backend TA endpoints:
 * Practical Lab Sections, Lab Attendance, Assignment Submissions,
 * Lab Grading & Feedback, and Office Hours / Discussion Schedules.
 */

import { apiClient } from './apiClient';

export const taService = {
  /** Fetch TA dashboard metrics */
  async getDashboard() {
    return apiClient.get('/ta/dashboard');
  },

  /** Fetch sections assigned to the teaching assistant */
  async getAssignedSections() {
    return apiClient.get('/ta/sections');
  },

  /** Fetch attendance for specific lab section */
  async getSectionAttendance(sectionId: string) {
    return apiClient.get(`/ta/sections/${sectionId}/attendance`);
  },

  /** Fetch student practical submissions for a section */
  async getSectionSubmissions(sectionId: string) {
    return apiClient.get(`/ta/sections/${sectionId}/submissions`);
  },

  /** Save grade and instructor feedback on lab submission */
  async saveSectionGrade(submissionId: string, score: number | string, feedback?: string) {
    return apiClient.post(`/ta/submissions/${submissionId}/grade`, { score, feedback });
  },

  /** Fetch TA discussion and lab sessions schedule */
  async getDiscussionsSchedule() {
    return apiClient.get('/ta/discussions/schedule');
  }
};
