"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/lib/auth/use-require-auth";
import { ApiError } from "@/lib/api/client";
import { createCampaign } from "@/lib/api/campaigns";
import { pesosToMinorUnits } from "@/lib/money";

const PURPOSE_CATEGORIES = [
  { value: "medical", label: "Medical" },
  { value: "disaster_relief", label: "Disaster Relief" },
  { value: "education", label: "Education" },
  { value: "community", label: "Community" },
  { value: "livelihood", label: "Livelihood" },
  { value: "other", label: "Other" },
];

export default function NewCampaignPage() {
  const { token, ready } = useRequireAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [purposeCategory, setPurposeCategory] = useState("medical");
  const [customCategory, setCustomCategory] = useState("");
  const [goalPesos, setGoalPesos] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!ready || !token) {
    return <p className="p-8 text-stone-600">Loading…</p>;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    // Re-check here, not just at the top of the component: this function is
    // a separate closure, and TypeScript doesn't carry the render-level
    // `!token` narrowing across a function boundary — `token` is typed
    // `string | null` again inside handleSubmit without this guard. This
    // also protects against the (unlikely but real) case of the session
    // expiring in the moments between page load and form submit.
    if (!token) {
      setError("You're not signed in anymore. Refresh the page and try again.");
      return;
    }

    let goalAmountMinorUnits: string;
    try {
      goalAmountMinorUnits = pesosToMinorUnits(goalPesos);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enter a valid goal amount.");
      return;
    }

    const resolvedCategory =
      purposeCategory === "other" ? customCategory.trim() : purposeCategory;
    if (!resolvedCategory) {
      setError("Enter a category.");
      return;
    }

    const location: Record<string, unknown> = {};
    if (province.trim()) location.province = province.trim();
    if (city.trim()) location.city = city.trim();

    setSubmitting(true);
    try {
      const campaign = await createCampaign(token, {
        title,
        purposeCategory: resolvedCategory,
        goalAmountMinorUnits,
        location: Object.keys(location).length ? location : undefined,
      });
      router.push(`/campaigns/${campaign.id}/manage`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Try again.");
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-serif text-3xl text-stone-900">Start a campaign</h1>
      <p className="mt-2 text-stone-600">
        This creates a draft only you can see. Keep editing before submitting for review.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-stone-800">
            Title
          </label>
          <input
            id="title"
            type="text"
            required
            maxLength={200}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full border border-stone-300 bg-white px-3 py-2 text-stone-900 focus:border-teal-700 focus:outline-none"
            placeholder="Help rebuild our school"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-stone-800">
            Category
          </label>
          <select
            id="category"
            value={purposeCategory}
            onChange={(e) => setPurposeCategory(e.target.value)}
            className="mt-1 w-full border border-stone-300 bg-white px-3 py-2 text-stone-900 focus:border-teal-700 focus:outline-none"
          >
            {PURPOSE_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          {purposeCategory === "other" && (
            <input
              type="text"
              required
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="mt-2 w-full border border-stone-300 bg-white px-3 py-2 text-stone-900 focus:border-teal-700 focus:outline-none"
              placeholder="Describe the category"
            />
          )}
        </div>

        <div>
          <label htmlFor="goal" className="block text-sm font-medium text-stone-800">
            Goal amount (PHP)
          </label>
          <input
            id="goal"
            type="text"
            inputMode="decimal"
            required
            value={goalPesos}
            onChange={(e) => setGoalPesos(e.target.value)}
            className="mt-1 w-full border border-stone-300 bg-white px-3 py-2 font-mono text-stone-900 focus:border-teal-700 focus:outline-none"
            placeholder="50000"
          />
          <p className="mt-1 text-xs text-stone-500">
            Plain number, e.g. 50000 or 50000.50 — no ₱ sign or commas.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="province" className="block text-sm font-medium text-stone-800">
              Province <span className="text-stone-400">(optional)</span>
            </label>
            <input
              id="province"
              type="text"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="mt-1 w-full border border-stone-300 bg-white px-3 py-2 text-stone-900 focus:border-teal-700 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-stone-800">
              City <span className="text-stone-400">(optional)</span>
            </label>
            <input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-1 w-full border border-stone-300 bg-white px-3 py-2 text-stone-900 focus:border-teal-700 focus:outline-none"
            />
          </div>
        </div>

        {error && (
          <p className="border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-900">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="border border-teal-800 bg-teal-800 px-5 py-2 text-white hover:bg-teal-900 disabled:opacity-50"
        >
          {submitting ? "Creating…" : "Create draft"}
        </button>
      </form>
    </main>
  );
}