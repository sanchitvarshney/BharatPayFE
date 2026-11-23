import axiosInstance from "@/api/axiosInstance";

export type MetaLocation = { id: string; name: string };

export type MetaFilterOption = { label: string; value: string };

export type MetaFilterInputType = "date" | "text" | "number" | "select" | "hidden";

export type MetaFilterDef = {
  key: string;
  label: string;
  inputType: MetaFilterInputType;
  required?: boolean;
  defaultValue?: any;
  options?: MetaFilterOption[];
  /** Field is shown (and sent) only when every listed filter currently has the given value(s). */
  showWhen?: Record<string, string | string[]>;
  placeholder?: string;
  /** Optional dayjs format for date values; defaults are chosen in the page. */
  format?: string;
  /** Set on fields that exist only in the socket list (shown in the form, sent only with the download). */
  downloadOnly?: boolean;
};

export type MetaExecutionType = "API" | "SOCKET" | "BOTH";

export type MetaReportDef = {
  code: string;
  name: string;
  /** API = on-screen grid only, SOCKET = server download only, BOTH = grid + download. */
  executionType: MetaExecutionType;
  /** Socket event to emit for the download; null when the report has no download. */
  socketEvent: string | null;
  /** `filters.api`: the keys sent to /metaReport/run. */
  filters: MetaFilterDef[];
  /** `filters.socket`: the keys sent with the socket event; null = send the api keys. */
  socketFilters: MetaFilterDef[] | null;
  /** What the form renders: api fields + socket fields that have no api counterpart. */
  fields: MetaFilterDef[];
};

export type MetaHeader = { key: string; label: string };

export type MetaPagination = {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage?: number | null;
};

export type MetaReportResult = {
  headers: MetaHeader[];
  rows: Record<string, any>[];
  pagination: MetaPagination | null;
};

type ApiEnvelope<T> = { code: number; status: string; data: T; message?: string };
type ReqOpts = { signal?: AbortSignal };

const unwrap = <T,>(res: { data: ApiEnvelope<T> }): T => {
  const body = res.data;
  if (body?.status !== "success") {
    throw new Error(body?.message || "Request failed");
  }
  return body.data;
};

const humanize = (key: string) =>
  key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());

/** Accepts both the new object filters and the legacy string list (e.g. ["fromDate", "toDate", "sku"]). */
const LEGACY_DATE_KEYS = ["fromDate", "toDate", "from", "to"];
const normalizeFilter = (f: any): MetaFilterDef | null => {
  if (f && typeof f === "object" && f.key) {
    return { ...f, label: f.label || humanize(f.key), inputType: f.inputType || "text" };
  }
  if (typeof f !== "string" || f === "page" || f === "limit") return null;
  if (LEGACY_DATE_KEYS.includes(f)) return { key: f, label: humanize(f), inputType: "date", required: true };
  if (f === "type") return { key: f, label: "Type", inputType: "hidden", defaultValue: "date" };
  return { key: f, label: humanize(f), inputType: "text" };
};

export const isFromKey = (k: string) => /^(from|start)/i.test(k);
export const isToKey = (k: string) => /^(to|end)([A-Z_]|$)/i.test(k) && !/^(total|today)/i.test(k);

const sameLabel = (a: MetaFilterDef, b: MetaFilterDef) =>
  a.label.trim().toLowerCase() === b.label.trim().toLowerCase();

/**
 * The form field that supplies a value for `target` (socket keys may differ from api keys,
 * e.g. fromDt vs from): same key, else same label, else the matching from/to date.
 */
export const findSourceField = (target: MetaFilterDef, candidates: MetaFilterDef[]) =>
  candidates.find((f) => f.key === target.key) ??
  candidates.find((f) => sameLabel(f, target)) ??
  (target.inputType === "date"
    ? candidates.find(
        (f) =>
          f.inputType === "date" &&
          ((isFromKey(target.key) && isFromKey(f.key)) || (isToKey(target.key) && isToKey(f.key))),
      )
    : undefined);

const normalizeFilterList = (list: any): MetaFilterDef[] =>
  (Array.isArray(list) ? list : []).map(normalizeFilter).filter(Boolean) as MetaFilterDef[];

// The backend uses "-" / "" as a placeholder for "no event yet".
const normalizeEvent = (e: any): string | null =>
  typeof e === "string" && e.trim() && e.trim() !== "-" ? e.trim() : null;

const normalizeExecution = (t: any): MetaExecutionType => {
  const v = String(t ?? "API").toUpperCase();
  return v === "SOCKET" || v === "BOTH" ? v : "API";
};

/**
 * Accepts every filters shape the backend has sent:
 *  - { api: [...], socket: [...] | null }   (current)
 *  - [ {key, label, inputType, ...}, ... ]  (object list)
 *  - [ "fromDate", "toDate", "sku" ]        (legacy string list)
 */
const normalizeReport = (r: any): MetaReportDef => {
  const raw = r?.filters;
  const grouped = raw && !Array.isArray(raw) && typeof raw === "object";
  const api = normalizeFilterList(grouped ? raw.api : raw);
  const socket = grouped && Array.isArray(raw.socket) ? normalizeFilterList(raw.socket) : null;
  const executionType = normalizeExecution(r?.executionType);
  const socketOnly = (socket ?? [])
    .filter((sf) => !findSourceField(sf, api))
    .map((sf) => (api.length ? { ...sf, downloadOnly: true } : sf));
  return {
    ...r,
    executionType,
    socketEvent: normalizeEvent(r?.socketEvent),
    filters: api,
    socketFilters: socket,
    fields: [...api, ...socketOnly],
  };
};

/* Locations and report definitions are static metadata: cache them for the session. */
let locationsCache: Promise<MetaLocation[]> | null = null;
const reportsCache = new Map<string, Promise<MetaReportDef[]>>();

export const getMetaLocations = (): Promise<MetaLocation[]> => {
  if (!locationsCache) {
    locationsCache = axiosInstance
      .get("/metaReport/locations")
      .then((res) => unwrap<MetaLocation[]>(res) ?? [])
      .catch((e) => {
        locationsCache = null; // allow retry after a failure
        throw e;
      });
  }
  return locationsCache;
};

export const getMetaReports = (locationId: string): Promise<MetaReportDef[]> => {
  let cached = reportsCache.get(locationId);
  if (!cached) {
    cached = axiosInstance
      .get("/metaReport/list", { params: { locationId } })
      .then((res) => (unwrap<any[]>(res) ?? []).map(normalizeReport))
      .catch((e) => {
        reportsCache.delete(locationId);
        throw e;
      });
    reportsCache.set(locationId, cached);
  }
  return cached;
};

export const isRequestCancelled = (e: any) =>
  e?.name === "CanceledError" || e?.code === "ERR_CANCELED" || e?.name === "AbortError";


export const runMetaReport = async (
  payload: { locationId: string; reportCode: string; filters: Record<string, any> },
  { signal }: ReqOpts = {},
): Promise<MetaReportResult> => {
  const res = await axiosInstance.post("/metaReport/run", payload, { signal });
  const body = res.data ?? {};
  if (body.status !== "success") throw new Error(body.message || "Request failed");

  // Supported shapes:
  //  { status, headers, data: [...rows], pagination }            (result at top level)
  //  { status, data: { headers, data: [...rows], pagination } }  (result nested in data)
  //  { status, data: { rows: [...] } }                           (legacy)
  const nested = body.data && !Array.isArray(body.data) && typeof body.data === "object";
  const src = nested ? body.data : body;
  const rows: Record<string, any>[] = Array.isArray(src.data)
    ? src.data
    : Array.isArray(src.rows)
      ? src.rows
      : [];
  const headers: MetaHeader[] =
    Array.isArray(src.headers) && src.headers.length
      ? src.headers
      : Object.keys(rows[0] ?? {}).map((key) => ({ key, label: humanize(key) }));
  return { headers, rows, pagination: src.pagination ?? null };
};
