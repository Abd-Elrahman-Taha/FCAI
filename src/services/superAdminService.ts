/**
 * SuperAdmin & System Operations Service
 * 
 * Interacts with backend DevOps & System Governance endpoints:
 * Security policies, external gateway integrations (Fawry, BSU SIS, AI RAG),
 * audit logs, and global semester toggles.
 */

import { apiClient } from './apiClient';

export const superAdminService = {
  /** Fetch institutional user roles and permission sets */
  async getRoles() {
    return apiClient.get('/superadmin/roles');
  },

  /** Fetch global faculty system configuration */
  async getSystemConfig() {
    return apiClient.get('/superadmin/system-config');
  },

  /** Update system configuration */
  async saveSystemConfig(cfg: any) {
    return apiClient.put('/superadmin/system-config', cfg);
  },

  /** Fetch cybersecurity and password policies */
  async getSecurityConfig() {
    return apiClient.get('/superadmin/security-config');
  },

  /** Fetch external enterprise integrations status */
  async getIntegrations() {
    return apiClient.get('/superadmin/integrations');
  },

  /** Fetch comprehensive immutable audit log entries */
  async getAuditLogs(query?: string) {
    return apiClient.get('/superadmin/audit-logs', { query });
  }
};
