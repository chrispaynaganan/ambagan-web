/**
 * Minimal JWT payload decoder — no signature verification. The backend
 * already verified the signature; the frontend only needs `exp` to decide
 * whether a stored token is still worth sending. Never use this for an
 * authorization decision that matters — only for "should I bother."
 */
export function decodeJwtPayload(token: string): { exp?: number; [key: string]: unknown } | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

export function isJwtExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return false; // no exp claim — can't tell, assume valid
  return Date.now() >= payload.exp * 1000;
}