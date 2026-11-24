import React from 'react';
import { AdminAcademicYears } from './AdminAcademicYears';

/**
 * Legacy route alias (`#/admin/academic-structure`) delegated to the live
 * backend-connected AdminAcademicYears management screen.
 */
export const AdminAcademicStructure: React.FC = () => {
  return <AdminAcademicYears />;
};
