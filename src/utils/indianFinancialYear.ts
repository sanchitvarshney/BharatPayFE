/** Indian financial year: 1 Apr → 31 Mar. Session key matches backend: "YY-(YY+1)" e.g. 2025-26 → "25-26". */

function sessionKeyFromStartYear(startYear: number): string {
  const endYear = startYear + 1;
  return `${String(startYear).slice(-2)}-${String(endYear).slice(-2)}`;
}

/** Calendar year in which the Indian FY *starts* (April–December belongs to FY starting that year). */
export function getIndianFYStartYearForDate(d: Date = new Date()): number {
  const y = d.getFullYear();
  const m = d.getMonth();
  return m >= 3 ? y : y - 1;
}

export function getIndianFYSessionKeyForDate(d: Date = new Date()): string {
  return sessionKeyFromStartYear(getIndianFYStartYearForDate(d));
}

/**
 * FY options from current down to (current − yearsBack), newest first.
 * Length = yearsBack + 1 (e.g. back=4 → 5 FYs).
 */
export function buildIndianFYSessionOptions(
  yearsBack: number,
  d: Date = new Date(),
): { value: string; label: string }[] {
  const currentStart = getIndianFYStartYearForDate(d);
  const out: { value: string; label: string }[] = [];
  for (let start = currentStart; start >= currentStart - yearsBack; start--) {
    const end = start + 1;
    out.push({
      value: sessionKeyFromStartYear(start),
      label: ` ${start}-${end}`,
    });
  }
  return out;
}

export function isPlausibleFYSessionKey(key: string): boolean {
  if (!/^\d{2}-\d{2}$/.test(key)) return false;
  const [a, b] = key.split("-").map((x) => parseInt(x, 10));
  return (a + 1) % 100 === b % 100;
}

/**
 * Prefer plausible session only if it is one of the FY keys in the dropdown window;
 * otherwise default to current FY (e.g. after rollover, old session drops out of the 5-year list).
 */
export function getInitialIndianFYSession(yearsBack: number): string {
  const allowed = new Set(
    buildIndianFYSessionOptions(yearsBack).map((o) => o.value),
  );
  const stored = typeof localStorage !== "undefined" ? localStorage.getItem("session") : null;
  if (stored && isPlausibleFYSessionKey(stored) && allowed.has(stored)) {
    return stored;
  }
  const resolved = getIndianFYSessionKeyForDate();
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("session", resolved);
  }
  return resolved;
}
