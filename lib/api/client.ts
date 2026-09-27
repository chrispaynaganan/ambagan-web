/**
 * Thin fetch wrapper around ambagan-api.
 *
 * Assumptions baked in here (verify against your actual auth module and
 * adjust if they don't match — see README.md "Assumptions to verify"):
 *   - The API returns JSON error bodies shaped like { message: string | string[] }
 *     on non-2xx responses. A single string is NestJS's default HttpException
 *     shape; an array of strings is what class-validator's ValidationPipe
 *     sends when multiple DTO fields fail at once (main.ts's
 *     `new ValidationPipe({ whitelist: true, transform: true })`) — both are
 *     handled below so a multi-field form error doesn't render as
 *     "[object Object]".
 *   - Auth is bearer-token based: we attach `Authorization: Bearer <token>`
 *     when a token is present, rather than relying on cookies.
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, message: string, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

type ApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  token?: string | null;
};

function extractMessage(raw: unknown): string | null {
  if (typeof raw === "string") return raw;
  if (Array.isArray(raw) && raw.every((item) => typeof item === "string")) {
    return raw.join(" ");
  }
  return null;
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { body, token, headers, ...rest } = options;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const message =
      (payload && typeof payload === "object" && "message" in payload
        ? extractMessage((payload as { message: unknown }).message)
        : null) ?? `Request to ${path} failed with status ${res.status}`;
    throw new ApiError(res.status, message, payload);
  }

  return payload as T;
}