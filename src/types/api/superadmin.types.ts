/**
 * SuperAdmin & System Operations API Types
 */

export interface SystemConfigResponse {
  academicYear: string;
  activeSemester: string;
  isRegistrationWindowOpen: boolean;
  isGradingWindowOpen: boolean;
  maintenanceMode: boolean;
  allowedIpRanges?: string[];
}

export interface SecurityConfigResponse {
  passwordMinLength: number;
  requireTwoFactor: boolean;
  sessionTimeoutMinutes: number;
  maxFailedLoginsBeforeLock: number;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  actorEmail: string;
  actorRole: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  details?: Record<string, any>;
}
