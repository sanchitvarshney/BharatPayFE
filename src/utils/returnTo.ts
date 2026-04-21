/** Path + query only (no origin). Survives full reload when stored in sessionStorage. */
export const RETURN_TO_STORAGE_KEY = "authReturnTo";

/**
 * Reject open redirects: external URLs, protocol-relative URLs, and auth pages.
 * Same-origin is implied by leading single slash (browser resolves to current origin).
 */
export function validateSameOriginReturnTo(candidate: string | null): string | null {
  if (!candidate || typeof candidate !== "string") return null;
  const t = candidate.trim();
  if (!t.startsWith("/")) return null;
  if (t.startsWith("//") || t.includes("://")) return null;
  if (t.includes("\0") || t.includes("\\")) return null;
  const lower = t.toLowerCase();
  if (
    lower.startsWith("/login") ||
    lower.startsWith("/forgot-password") ||
    lower.startsWith("/password-recovery")
  ) {
    return null;
  }
  return t;
}

export function setReturnTo(pathWithQuery: string): void {
  try {
    const normalized = pathWithQuery.startsWith("/") ? pathWithQuery : `/${pathWithQuery}`;
    const valid = validateSameOriginReturnTo(normalized);
    if (!valid) return;
    sessionStorage.setItem(RETURN_TO_STORAGE_KEY, valid);
  } catch {
    // quota / private mode
  }
}

/** Read, validate, remove, and return safe path or null. */
export function consumeReturnTo(): string | null {
  try {
    const raw = sessionStorage.getItem(RETURN_TO_STORAGE_KEY);
    sessionStorage.removeItem(RETURN_TO_STORAGE_KEY);
    return validateSameOriginReturnTo(raw);
  } catch {
    return null;
  }
}
