"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/lib/auth/auth-context";

function DashboardContent() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl text-ink">Welcome back</h1>
      <p className="mt-2 text-muted">
        Signed in as <span className="font-mono text-sm text-ink">{user?.email}</span>
      </p>
      <p className="mt-6 text-sm text-muted">
        This page exists to prove the auth loop works end to end. Campaign lists, contribution
        flows, and Katiwala tools replace this next.
      </p>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
