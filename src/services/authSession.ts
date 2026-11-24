/**
 * Centralized Authentication Session Store
 *
 * Maintains active session state and persists it across page reloads via
 * `localStorage` (`fcai_auth_session`) so refreshing the browser keeps the
 * user signed in until they explicitly sign out or their refresh token expires.
 */

import type { User, Role } from '../types';
import type {
  CurrentUserResponse,
  LoginResponse,
  UserRole,
} from '../types/api/auth.types';
import {
  getRoleDisplayLabel,
  isValidUserRole,
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

const SESSION_STORAGE_KEY = 'fcai_auth_session';

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

function getStorage(): Storage | null {
  try {
    return typeof window !== 'undefined' && window.localStorage ? window.localStorage : null;
  } catch {
    return null;
  }
}

function hydrateSession(): AuthSessionState {
  const storage = getStorage();
  if (!storage) return { ...INITIAL_STATE };

  try {
    const raw = storage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return { ...INITIAL_STATE };

    const parsed = JSON.parse(raw) as Partial<AuthSessionState>;
    if (
      typeof parsed.accessToken !== 'string' ||
      !parsed.accessToken ||
      typeof parsed.refreshToken !== 'string' ||
      !parsed.refreshToken ||
      !isValidUserRole(parsed.backendRole)
    ) {
      storage.removeItem(SESSION_STORAGE_KEY);
      return { ...INITIAL_STATE };
    }

    const routeRole = mapBackendRoleToRouteRole(parsed.backendRole);
    return {
      accessToken: parsed.accessToken,
      refreshToken: parsed.refreshToken,
      expiresAt: typeof parsed.expiresAt === 'string' ? parsed.expiresAt : null,
      backendRole: parsed.backendRole,
      routeRole,
      user: parsed.user ?? null,
      profile: parsed.profile ?? null,
      requiresPasswordChange: Boolean(parsed.requiresPasswordChange),
      isAuthenticated: true,
    };
  } catch {
    try {
      storage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // Ignore storage cleanup errors
    }
    return { ...INITIAL_STATE };
  }
}

function persistSession(next: AuthSessionState): void {
  const storage = getStorage();
  if (!storage) return;

  try {
    if (!next.isAuthenticated || !next.accessToken) {
      storage.removeItem(SESSION_STORAGE_KEY);
    } else {
      storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(next));
    }
  } catch {
    // Ignore quota or privacy-mode storage errors
  }
}

let state: AuthSessionState = hydrateSession();
let pendingRedirectHash: string | null = null;
const listeners = new Set<() => void>();

function commit(next: AuthSessionState): void {
  state = next;
  persistSession(state);
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

    const next: AuthSessionState = {
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
    commit(next);
    return next;
  },

  /** Replace BOTH accessToken and refreshToken atomically after token rotation */
  updateTokens(tokens: { token: string; refreshToken: string; expiresAt: string }): void {
    commit({
      ...state,
      accessToken: tokens.token,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt,
      isAuthenticated: Boolean(tokens.token),
    });
  },

  setProfile(profile: CurrentUserResponse): void {
    const routeRole = mapBackendRoleToRouteRole(profile.role);
    commit({
      ...state,
      backendRole: profile.role,
      routeRole,
      profile,
      user: mergeProfileIntoUser(state.user, profile),
    });
  },

  clearPasswordChangeRequirement(): void {
    commit({
      ...state,
      requiresPasswordChange: false,
      user: state.user ? { ...state.user, isFirstLogin: false } : null,
    });
  },

  clear(): void {
    commit({ ...INITIAL_STATE });
  },

  /** In-memory post-login redirect target */
  setPendingRedirect(hash: string | null): void {
    pendingRedirectHash = hash;
  },

  consumePendingRedirect(): string | null {
    const target = pendingRedirectHash;
    pendingRedirectHash = null;
    return target;
  },
};
