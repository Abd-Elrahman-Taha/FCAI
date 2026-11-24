/**
 * Centralized In-Memory Authentication Session Store
 *
 * Stores active session state exclusively in JavaScript memory.
 * No localStorage, sessionStorage, IndexedDB, or cookie token storage is used.
 *
 * Reloading the browser tab intentionally clears the session and requires sign-in.
 */

import type { User, Role } from '../types';
import type {
  CurrentUserResponse,
  LoginResponse,
  UserRole,
} from '../types/api/auth.types';
import {
  getRoleDisplayLabel,
  mapBackendRoleToRouteRole,
} from '../types/api/auth.types';

export interface AuthSessionState {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: string | null;
  backendRole: UserRole | null;
  routeRole: Role;
  user: User | null;
  profile: CurrentUserResponse | null;
  requiresPasswordChange: boolean;
  isAuthenticated: boolean;
}

const INITIAL_STATE: AuthSessionState = {
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
  backendRole: null,
  routeRole: 'student',
  user: null,
  profile: null,
  requiresPasswordChange: false,
  isAuthenticated: false,
};

let state: AuthSessionState = { ...INITIAL_STATE };
let pendingRedirectHash: string | null = null;
const listeners = new Set<() => void>();

function notify(): void {
  listeners.forEach(listener => listener());
}

function buildInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function mapLoginToUser(loginData: LoginResponse): User {
  const routeRole = mapBackendRoleToRouteRole(loginData.role);
  const displayName = (loginData.fullName || loginData.email || 'Authenticated User').trim();
  const roleLabel = getRoleDisplayLabel(loginData.role);

  return {
    id: String(loginData.userId),
    name: displayName,
    short: buildInitials(displayName),
    role: routeRole,
    roleLabel,
    meta: loginData.email || roleLabel,
    email: loginData.email || '',
    isFirstLogin: loginData.requiresPasswordChange,
  };
}

function mergeProfileIntoUser(existing: User | null, profile: CurrentUserResponse): User {
  const routeRole = mapBackendRoleToRouteRole(profile.role);
  const displayName = (
    profile.fullNameEn ||
    profile.fullNameAr ||
    existing?.name ||
    profile.username ||
    profile.email ||
    'Authenticated User'
  ).trim();
  const roleLabel = getRoleDisplayLabel(profile.role);

  return {
    ...(existing ?? {
      id: String(profile.id),
      name: displayName,
      short: buildInitials(displayName),
      role: routeRole,
      roleLabel,
      meta: profile.email || roleLabel,
      email: profile.email || '',
    }),
    id: String(profile.id),
    name: displayName,
    short: buildInitials(displayName),
    role: routeRole,
    roleLabel,
    email: profile.email || existing?.email || '',
    phone: profile.phoneNumber || existing?.phone,
    meta: profile.username
      ? `${roleLabel} · ${profile.username}`
      : profile.email || roleLabel,
    academicStatus: profile.isActive ? 'Active' : 'Suspended',
  };
}

export const authSession = {
  getSnapshot(): AuthSessionState {
    return state;
  },

  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  getAccessToken(): string | null {
    return state.accessToken;
  },

  getRefreshToken(): string | null {
    return state.refreshToken;
  },

  setFromLogin(loginData: LoginResponse): AuthSessionState {
    const routeRole = mapBackendRoleToRouteRole(loginData.role);
    const user = mapLoginToUser(loginData);

    state = {
      accessToken: loginData.token,
      refreshToken: loginData.refreshToken,
      expiresAt: loginData.expiresAt,
      backendRole: loginData.role,
      routeRole,
      user,
      profile: null,
      requiresPasswordChange: Boolean(loginData.requiresPasswordChange),
      isAuthenticated: Boolean(loginData.token),
    };
    notify();
    return state;
  },

  /** Replace BOTH accessToken and refreshToken atomically after token rotation */
  updateTokens(tokens: { token: string; refreshToken: string; expiresAt: string }): void {
    state = {
      ...state,
      accessToken: tokens.token,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt,
      isAuthenticated: Boolean(tokens.token),
    };
    notify();
  },

  setProfile(profile: CurrentUserResponse): void {
    const routeRole = mapBackendRoleToRouteRole(profile.role);
    state = {
      ...state,
      backendRole: profile.role,
      routeRole,
      profile,
      user: mergeProfileIntoUser(state.user, profile),
    };
    notify();
  },

  clearPasswordChangeRequirement(): void {
    state = {
      ...state,
      requiresPasswordChange: false,
      user: state.user ? { ...state.user, isFirstLogin: false } : null,
    };
    notify();
  },

  clear(): void {
    state = { ...INITIAL_STATE };
    notify();
  },

  /** In-memory post-login redirect target (never stored in browser storage) */
  setPendingRedirect(hash: string | null): void {
    pendingRedirectHash = hash;
  },

  consumePendingRedirect(): string | null {
    const target = pendingRedirectHash;
    pendingRedirectHash = null;
    return target;
  },
};
