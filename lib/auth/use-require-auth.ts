"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-context";

/**
 * Small stand-in for wrapping every new page in <ProtectedRoute> — not used
 * here since its exact props haven't been shared yet. Same intent: redirect
 * to /login once we're sure there's no session, and give the caller a single
 * `ready` flag so it doesn't render a form/fetch before a token exists.
 * Consolidate onto <ProtectedRoute> later if that's meant to be canonical.
 */
export function useRequireAuth() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  return { user, token, ready: !isLoading && !!user };
}