"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";

/**
 * Client-side route guard. Because auth state lives in localStorage (not a
 * cookie), Next.js middleware can't see it — so this redirect happens after
 * mount, not before paint. That's an acceptable trade-off for the first
 * frontend pass; if a flash-of-protected-content becomes a real problem,
 * that's the point to move auth into an httpOnly cookie + middleware.
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted">
        Checking your session…
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
