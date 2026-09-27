import { apiFetch } from "./client";

/**
 * Confirmed against the real auth.controller.ts / auth.service.ts:
 *
 *   POST /auth/register  { email, password, displayName } -> { accessToken, user }
 *   POST /auth/login     { email, password }               -> { accessToken, user }
 *
 * There is no GET /auth/me route. login/register already return the full
 * user object, so the frontend persists that directly instead of
 * re-fetching it — see auth-context.tsx.
 */

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  // Extend once roles/permissions are wired in from identity-access.
  [key: string]: unknown;
}

interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export function login(email: string, password: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export function register(
  email: string,
  password: string,
  displayName: string,
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: { email, password, displayName },
  });
}