"use client";

// ambagan-web/app/signup/page.tsx
//
// Create account — spec §4.2 (canonical route is "/signup" there;
// mirrors the real, already-working /login page's exact pattern and
// styling). Calls the real useAuth().register(), confirmed 27 Sept to
// already persist the session via persistSession() exactly like login()
// does — no guessing needed here, unlike some earlier pages.

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth, ApiError } from "@/lib/auth/auth-context";

export default function SignupPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await register(email, password, displayName);
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Couldn't reach the server. Check that ambagan-api is running.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <div className="border-t-2 border-gold" />
      <div className="border border-t-0 border-line px-8 py-9">
        <h1 className="text-2xl text-ink">Create your account</h1>
        <p className="mt-1 text-sm text-muted">
          No ID needed yet — verification comes later, only when you need it.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="displayName" className="block text-sm text-ink/80">
              Name
            </label>
            <input
              id="displayName"
              type="text"
              required
              autoComplete="name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-1 w-full rounded border border-line bg-paper px-3 py-2 text-ink"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm text-ink/80">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded border border-line bg-paper px-3 py-2 text-ink"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-ink/80">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded border border-line bg-paper px-3 py-2 text-ink"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded bg-teal px-4 py-2 text-paper hover:bg-teal-dark disabled:opacity-60"
          >
            {isSubmitting ? "Creating account…" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}