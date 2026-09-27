"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams } from "next/navigation";
import { useRequireAuth } from "@/lib/auth/use-require-auth";
import { ApiError } from "@/lib/api/client";
import {
  getCampaign,
  updateCampaign,
  submitCampaignForReview,
  type Campaign,
} from "@/lib/api/campaigns";
import { formatPeso, minorUnitsToPesos, pesosToMinorUnits } from "@/lib/money";
import {
  CAMPAIGN_STATE_INFO,
  canAttemptSubmitForReview,
  isEditableState,
  toneClasses,
} from "@/lib/campaign-state";

export default function ManageCampaignPage() {
  const { user, token, ready } = useRequireAuth();
  const params = useParams();

  // params.id is `string | string[] | undefined` under Next's typing, and
  // with noUncheckedIndexedAccess on, `arr[0]` is `string | undefined` even
  // when arr is known to be a non-empty string[] — so `?? ""` here isn't
  // just style, it's what makes campaignId's type a plain `string` instead
  // of leaking `| undefined` into every function that takes it below.
  const rawId = params.id;
  const campaignId = (Array.isArray(rawId) ? rawId[0] : rawId) ?? "";

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [purposeCategory, setPurposeCategory] = useState("");
  const [goalPesos, setGoalPesos] = useState("");
  const [storyContent, setStoryContent] = useState("");

  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!ready || !campaignId) return;
    getCampaign(campaignId)
      .then((c) => {
        setCampaign(c);
        setTitle(c.title);
        setPurposeCategory(c.purposeCategory);
        setGoalPesos(minorUnitsToPesos(c.goalAmountMinorUnits));
      })
      .catch((err) =>
        setLoadError(err instanceof ApiError ? err.message : "Couldn't load this campaign."),
      );
  }, [ready, campaignId]);

  if (!ready) {
    return <p className="p-8 text-stone-600">Loading…</p>;
  }

  if (!campaignId) {
    return <p className="p-8 text-red-900">Invalid campaign link.</p>;
  }

  if (loadError) {
    return <p className="p-8 text-red-900">{loadError}</p>;
  }

  if (!campaign) {
    return <p className="p-8 text-stone-600">Loading campaign…</p>;
  }

  const isOwner = campaign.katiwalaUserId === user?.id;
  if (!isOwner) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-12">
        <p className="border border-stone-300 bg-stone-50 px-4 py-3 text-stone-700">
          You don&apos;t have access to manage this campaign.
        </p>
      </main>
    );
  }

  const info = CAMPAIGN_STATE_INFO[campaign.lifecycleState];
  const editable = isEditableState(campaign.lifecycleState);
  const canSubmit = canAttemptSubmitForReview(campaign.lifecycleState);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!token || !campaign) return;
    setSaveError(null);
    setSaveMessage(null);

    let goalAmountMinorUnits: string;
    try {
      goalAmountMinorUnits = pesosToMinorUnits(goalPesos);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Enter a valid goal amount.");
      return;
    }

    setSaving(true);
    try {
      const updated = await updateCampaign(token, campaign.id, {
        title,
        purposeCategory,
        goalAmountMinorUnits,
        ...(storyContent.trim() ? { storyContent: storyContent.trim() } : {}),
      });
      setCampaign(updated);
      setStoryContent("");
      setSaveMessage("Saved.");
    } catch (err) {
      setSaveError(err instanceof ApiError ? err.message : "Couldn't save changes.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmitForReview() {
    if (!token || !campaign) return;
    setSubmitError(null);
    setSubmitting(true);
    try {
      const updated = await submitCampaignForReview(token, campaign.id);
      setCampaign(updated);
    } catch (err) {
      if (
        err instanceof ApiError &&
        campaign.lifecycleState === "verification_required" &&
        err.message.includes("Illegal campaign lifecycle transition")
      ) {
        setSubmitError(
          "You're still not identity-verified yet. Once that's done, try Submit again.",
        );
      } else {
        setSubmitError(err instanceof ApiError ? err.message : "Couldn't submit for review.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-stone-900">{campaign.title}</h1>
          <p className="mt-1 font-mono text-sm text-stone-500">/{campaign.slug}</p>
        </div>
        <span className={`shrink-0 border px-2 py-1 text-xs font-medium ${toneClasses(info.tone)}`}>
          {info.label}
        </span>
      </div>
      <p className="mt-2 text-stone-600">{info.description}</p>

      <dl className="mt-6 grid grid-cols-2 gap-4 border border-stone-200 bg-stone-50 p-4 text-sm">
        <div>
          <dt className="text-stone-500">Goal</dt>
          <dd className="font-mono text-stone-900">
            {formatPeso(campaign.goalAmountMinorUnits, campaign.currency)}
          </dd>
        </div>
        <div>
          <dt className="text-stone-500">Category</dt>
          <dd className="text-stone-900">{campaign.purposeCategory}</dd>
        </div>
      </dl>

      {editable ? (
        <form onSubmit={handleSave} className="mt-8 space-y-6">
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
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-stone-800">
              Category
            </label>
            <input
              id="category"
              type="text"
              required
              value={purposeCategory}
              onChange={(e) => setPurposeCategory(e.target.value)}
              className="mt-1 w-full border border-stone-300 bg-white px-3 py-2 text-stone-900 focus:border-teal-700 focus:outline-none"
            />
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
            />
          </div>

          <div>
            <label htmlFor="story" className="block text-sm font-medium text-stone-800">
              Add a story update <span className="text-stone-400">(optional)</span>
            </label>
            <textarea
              id="story"
              rows={4}
              value={storyContent}
              onChange={(e) => setStoryContent(e.target.value)}
              className="mt-1 w-full border border-stone-300 bg-white px-3 py-2 text-stone-900 focus:border-teal-700 focus:outline-none"
              placeholder="This appends a new version — it doesn't overwrite the previous story."
            />
            {campaign.story.length > 0 && (
              <p className="mt-1 text-xs text-stone-500">
                Current story has {campaign.story.length} version
                {campaign.story.length === 1 ? "" : "s"}.
              </p>
            )}
          </div>

          {saveError && (
            <p className="border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-900">
              {saveError}
            </p>
          )}
          {saveMessage && (
            <p className="border border-teal-300 bg-teal-50 px-3 py-2 text-sm text-teal-900">
              {saveMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="border border-stone-800 bg-stone-800 px-5 py-2 text-white hover:bg-stone-900 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </form>
      ) : (
        <p className="mt-8 text-stone-600">
          This campaign isn&apos;t editable while it&apos;s in the &ldquo;{info.label}&rdquo; state.
        </p>
      )}

      {canSubmit && (
        <div className="mt-10 border-t border-stone-200 pt-6">
          {submitError && (
            <p className="mb-3 border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              {submitError}
            </p>
          )}
          <button
            onClick={handleSubmitForReview}
            disabled={submitting}
            className="border border-teal-800 bg-teal-800 px-5 py-2 text-white hover:bg-teal-900 disabled:opacity-50"
          >
            {submitting ? "Submitting…" : "Submit for review"}
          </button>
        </div>
      )}
    </main>
  );
}