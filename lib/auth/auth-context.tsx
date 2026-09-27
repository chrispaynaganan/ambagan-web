"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ApiError } from "../api/client";
import {
  login as loginRequest,
  register as registerRequest,
  type AuthUser,
} from "../api/auth";
import { isJwtExpired } from "./jwt";

const SESSION_STORAGE_KEY = "ambagan.session";

interface StoredSession {
  accessToken: string;
  user: AuthUser;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  /** True only while we're resolving the initial session on page load. */
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredSession(): StoredSession | null {
  const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as StoredSession;
    if (!parsed?.accessToken || !parsed?.user) return null;
    return parsed;
  } catch {
    return null;
  }
}

function persistSession(session: StoredSession) {
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

function clearStoredSession() {
  window.localStorage.removeItem(SESSION_STORAGE_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate from localStorage on load — no network call. There's no
  // GET /auth/me yet, so we trust the locally stored user object until the
  // token expires. A refreshed page won't re-verify server-side state (e.g.
  // a revoked role) until a real /auth/me exists — see README "Upgrade paths."
  useEffect(() => {
    const stored = readStoredSession();
    if (!stored || isJwtExpired(stored.accessToken)) {
      if (stored) clearStoredSession();
      setIsLoading(false);
      return;
    }
    setToken(stored.accessToken);
    setUser(stored.user);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { accessToken, user: loggedInUser } = await loginRequest(email, password);
    persistSession({ accessToken, user: loggedInUser });
    setToken(accessToken);
    setUser(loggedInUser);
  }, []);

  const register = useCallback(
    async (email: string, password: string, displayName: string) => {
      const { accessToken, user: registeredUser } = await registerRequest(email, password, displayName);
      persistSession({ accessToken, user: registeredUser });
      setToken(accessToken);
      setUser(registeredUser);
    },
    [],
  );

  const logout = useCallback(() => {
    clearStoredSession();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, token, isLoading, login, register, logout }),
    [user, token, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

export { ApiError };