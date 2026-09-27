/**
 * Peso <-> minor-units (centavos) conversion.
 *
 * ambagan-api's CreateCampaignDto/UpdateCampaignDto require
 * goalAmountMinorUnits as a numeric STRING (@IsNumberString()), in centavos —
 * e.g. PHP 50,000.00 is sent as "5000000". This exists specifically to avoid
 * JS float-precision bugs at the API boundary (see campaign.entity.ts's
 * comment on goalAmountMinorUnits). Every conversion here works on strings
 * and integers only — never on a floating-point multiply/divide.
 */

const PESO_INPUT_PATTERN = /^\d+(\.\d{1,2})?$/;

/** Converts a user-typed peso string ("50000" or "50000.50") to a minor-units string ("5000000" / "5000050"). Throws on invalid input — call inside a try/catch in your form's submit handler. */
export function pesosToMinorUnits(pesosInput: string): string {
  const trimmed = pesosInput.trim();
  if (!trimmed) {
    throw new Error("Enter an amount.");
  }
  if (!PESO_INPUT_PATTERN.test(trimmed)) {
    throw new Error("Enter a valid amount, e.g. 5000 or 5000.50 — no currency symbols or commas.");
  }

  const [wholePart, fractionPart = ""] = trimmed.split(".");
  const paddedFraction = (fractionPart + "00").slice(0, 2);
  const combined = `${wholePart}${paddedFraction}`;
  const normalized = combined.replace(/^0+(?=\d)/, "");

  if (Number(normalized) <= 0) {
    throw new Error("Enter an amount greater than zero.");
  }

  return normalized;
}

/** Converts a minor-units string ("5000000") back to a plain peso string ("50000.00") for prefilling an edit form. */
export function minorUnitsToPesos(minorUnits: string): string {
  const digits = minorUnits.replace(/\D/g, "");
  const padded = digits.padStart(3, "0");
  const wholePart = padded.slice(0, -2).replace(/^0+(?=\d)/, "") || "0";
  const fractionPart = padded.slice(-2);
  return `${wholePart}.${fractionPart}`;
}

/** Formats a minor-units string for display, e.g. "5000000" -> "₱50,000.00". Display-only — never feed this back into a submitted form value. */
export function formatPeso(minorUnits: string, currency = "PHP"): string {
  const pesos = Number(minorUnitsToPesos(minorUnits));
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(pesos);
}