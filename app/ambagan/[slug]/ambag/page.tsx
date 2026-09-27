"use client";

// ambagan-web/app/ambagan/[slug]/ambag/page.tsx
//
// Kaambag contribution/checkout flow — spec §9, §9.2's 8 steps condensed
// into 3 screens: Amount & message → Review & pay → Done. Pure frontend —
// contributions-payments isn't live-HTTP-tested yet (no PayMongo
// credentials configured, per the project summary), so "Confirm and pay"
// simulates processing locally rather than calling a real endpoint.
//
// Fee % is looked up from the campaign's actual Katiwala level when detail
// data exists (§10.1's per-level fee reward), defaulting to the 1%
// ceiling otherwise — not a flat guess.
//
// Processor fee is left as "[varies by payment method]", same as the
// public /fees page — a real PayMongo rate, not invented here.

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { formatPeso } from "@/lib/money";
import { MOCK_CAMPAIGNS } from "@/lib/mock-data";
import { MOCK_CAMPAIGN_DETAILS } from "@/lib/campaign-detail-data";
import { KATIWALA_LEVEL_DETAILS } from "@/lib/katiwala-levels";

// LOCK-009 default. A real build reads this from campaign/risk-engine
// config — DON-001 is explicit that it's a product-risk control, not a
// legal threshold, so it shouldn't be hardcoded like this long-term.
const GUEST_CEILING_PESOS = 10000;

const SUGGESTED_AMOUNTS = [100, 500, 1000, 5000];
const PAYMENT_METHODS = ["gcash", "maya", "card", "bank"] as const;

type Step = "amount" | "review" | "done";

export default function ContributePage() {
  const params = useParams();
  const rawSlug = params.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
  const { user } = useAuth();

  const summary =
    typeof slug === "string" ? MOCK_CAMPAIGNS.find((c) => c.slug === slug) : undefined;
  const detail = typeof slug === "string" ? MOCK_CAMPAIGN_DETAILS[slug] : undefined;

  const [step, setStep] = useState<Step>("amount");
  const [amountPesos, setAmountPesos] = useState<number>(500);
  const [displayName, setDisplayName] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [message, setMessage] = useState("");
  const [coverCosts, setCoverCosts] = useState(false);
  const [supportTipPesos, setSupportTipPesos] = useState(0);
  const [paymentMethod, setPaymentMethod] =
    useState<(typeof PAYMENT_METHODS)[number]>("gcash");
  const [limitError, setLimitError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [reference] = useState(() => `MOCK-${Date.now().toString().slice(-8)}`);

  if (!summary) {
    return (
      <div className="space-y-4">
        <h1 className="font-serif text-3xl text-ink">Ambagan not found</h1>
        <Link href="/discover" className="text-teal hover:text-teal-dark">
          Browse all Ambagans →
        </Link>
      </div>
    );
  }

  const feePct = detail
    ? KATIWALA_LEVEL_DETAILS[detail.katiwalaProfile.level].suggestedMaxFeePct
    : 1.0;
  const feeMinorUnits = Math.round(amountPesos * 100 * (feePct / 100));
  const netToCampaignMinorUnits = amountPesos * 100 - feeMinorUnits;

  function handleContinueFromAmount() {
    setLimitError(null);
    // DON-002: never frame exceeding the guest ceiling as rejection —
    // invite account creation/verification instead.
    if (!user && amountPesos > GUEST_CEILING_PESOS) {
      setLimitError(
        `Contributions over ${formatPeso(
          String(GUEST_CEILING_PESOS * 100)
        )} need a verified account. Create one to continue with this amount, or lower it to give as a guest.`
      );
      return;
    }
    setStep("review");
  }

  function handleConfirmPayment() {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setStep("done");
    }, 900);
  }

  if (step === "done") {
    return (
      <div className="max-w-xl space-y-6">
        <h1 className="font-serif text-3xl text-ink">
          Salamat, {anonymous ? "Kaambag" : displayName || "Kaambag"}!
        </h1>
        <p className="text-muted">
          Your {formatPeso(String(amountPesos * 100))} contribution to{" "}
          {summary.title} is confirmed. Reference:{" "}
          <span className="font-mono">{reference}</span>
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/ambagan/${summary.slug}`}
            className="rounded border border-teal px-5 py-2.5 text-teal hover:bg-teal hover:text-paper"
          >
            Back to campaign
          </Link>
          <button className="rounded border border-line px-5 py-2.5 text-ink/80 hover:border-teal hover:text-teal">
            Share
          </button>
        </div>

        {!user && (
          <div className="border border-gold px-5 py-4 text-sm text-ink">
            <p className="font-medium">Keep track of this and future contributions.</p>
            <p className="mt-1 text-muted">
              Create an account to see your receipts, follow this Ambagan&apos;s
              progress, and give Tiwala once you&apos;re verified.
            </p>
            <Link href="/signup" className="mt-2 inline-block text-teal hover:text-teal-dark">
              Create an account →
            </Link>
          </div>
        )}

        {user && (
          <p className="text-xs text-muted">
            You&apos;ll be notified once this Ambagan has an accepted Patunay
            and you&apos;re eligible to give Tiwala.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-wide text-muted">
          {summary.category}
        </p>
        <h1 className="mt-1 font-serif text-2xl text-ink">
          Ambag ka? — {summary.title}
        </h1>
        <p className="mt-1 text-sm text-muted">{summary.recipientLine}</p>
      </div>

      {step === "amount" && (
        <div className="space-y-5 border border-line px-6 py-6">
          <div>
            <label className="block text-sm text-ink">Amount</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {SUGGESTED_AMOUNTS.map((a) => (
                <button
                  key={a}
                  onClick={() => setAmountPesos(a)}
                  className={`border px-4 py-2 text-sm ${
                    amountPesos === a
                      ? "border-teal bg-teal text-paper"
                      : "border-line text-ink/80 hover:border-teal hover:text-teal"
                  }`}
                >
                  {formatPeso(String(a * 100))}
                </button>
              ))}
            </div>
            <input
              type="number"
              min={1}
              value={amountPesos}
              onChange={(e) => setAmountPesos(Number(e.target.value) || 0)}
              className="mt-3 block w-full border border-line px-3 py-2 text-sm text-ink"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
            />
            Give anonymously
          </label>

          {!anonymous && (
            <label className="block text-sm text-ink">
              Display name
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={user?.displayName ?? "Your name"}
                className="mt-1 block w-full border border-line px-3 py-2 text-sm text-ink"
              />
            </label>
          )}

          <label className="block text-sm text-ink">
            Message (optional)
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              className="mt-1 block w-full border border-line px-3 py-2 text-sm text-ink"
            />
          </label>

          {!user && (
            <p className="text-xs text-muted">
              Giving as a guest — contributions are capped at{" "}
              {formatPeso(String(GUEST_CEILING_PESOS * 100))} per transaction.
            </p>
          )}

          {limitError && (
            <div className="border border-gold px-4 py-3 text-sm text-ink">
              <p>{limitError}</p>
              <Link href="/signup" className="mt-1 inline-block text-teal hover:text-teal-dark">
                Create an account →
              </Link>
            </div>
          )}

          <button
            onClick={handleContinueFromAmount}
            className="rounded bg-teal px-5 py-2.5 text-paper hover:bg-teal-dark"
          >
            Continue
          </button>
        </div>
      )}

      {step === "review" && (
        <div className="space-y-5 border border-line px-6 py-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-b border-line py-2">
              <span className="text-ink">Your contribution</span>
              <span className="font-mono text-ink">
                {formatPeso(String(amountPesos * 100))}
              </span>
            </div>
            <div className="flex justify-between border-b border-line py-2">
              <span className="text-muted">Sustainability fee ({feePct.toFixed(2)}%)</span>
              <span className="font-mono text-muted">{formatPeso(String(feeMinorUnits))}</span>
            </div>
            <div className="flex justify-between border-b border-line py-2">
              <span className="text-muted">Processor fee</span>
              <span className="font-mono text-muted">[varies by payment method]</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-ink">Net to campaign</span>
              <span className="font-mono text-ink">
                {formatPeso(String(netToCampaignMinorUnits))}
              </span>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={coverCosts}
              onChange={(e) => setCoverCosts(e.target.checked)}
            />
            Cover transaction costs so the full amount reaches the campaign
          </label>

          <label className="block text-sm text-ink">
            Optional support for Ambagan (separate from the sustainability fee)
            <input
              type="number"
              min={0}
              value={supportTipPesos}
              onChange={(e) => setSupportTipPesos(Number(e.target.value) || 0)}
              className="mt-1 block w-full border border-line px-3 py-2 text-sm text-ink"
            />
          </label>

          <div>
            <p className="text-sm text-ink">Payment method</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m}
                  onClick={() => setPaymentMethod(m)}
                  className={`border px-4 py-2 text-sm uppercase ${
                    paymentMethod === m
                      ? "border-teal bg-teal text-paper"
                      : "border-line text-ink/80 hover:border-teal hover:text-teal"
                  }`}
                >
                  {m === "gcash" ? "GCash" : m === "maya" ? "Maya" : m === "card" ? "Card" : "Bank"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep("amount")}
              className="border border-line px-5 py-2.5 text-sm text-ink/80 hover:border-teal hover:text-teal"
            >
              Back
            </button>
            <button
              onClick={handleConfirmPayment}
              disabled={processing}
              className="rounded bg-teal px-5 py-2.5 text-paper hover:bg-teal-dark disabled:opacity-50"
            >
              {processing ? "Processing…" : "Confirm and pay"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}