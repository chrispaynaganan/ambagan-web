"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";

export function Header() {
  const { user, logout, isLoading } = useAuth();

  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-serif text-xl tracking-tight text-ink">
          Ambagan
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          {!isLoading && user && (
            <>
              <Link href="/dashboard" className="text-ink/80 hover:text-ink">
                Dashboard
              </Link>
              <span className="text-muted">{user.email}</span>
              <button
                onClick={logout}
                className="rounded border border-line px-3 py-1.5 text-ink/80 hover:border-teal hover:text-teal"
              >
                Log out
              </button>
            </>
          )}

          {!isLoading && !user && (
            <Link
              href="/login"
              className="rounded bg-teal px-4 py-1.5 text-paper hover:bg-teal-dark"
            >
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
