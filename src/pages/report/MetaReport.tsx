import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef, ValueFormatterParams } from "@ag-grid-community/core";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import LoadingButton from "@mui/lab/LoadingButton";
import { Autocomplete, Button, CircularProgress, MenuItem, TextField, createFilterOptions } from "@mui/material";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Factory,
  FileBarChart2,
  FileDown,
  MapPin,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  Play,
  RotateCw,
  SlidersHorizontal,
  Truck,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { socketService } from "@/services/socket/SocketService";
import { rangePresets } from "@/utils/rangePresets";
import { showToast } from "@/utils/toasterContext";
import { Skeleton } from "@/components/ui/skeleton";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { ReportErrorState, TableSearch } from "@/components/report/r26/ReportBlocks";
import { R26_GRID_CLASS, r26DefaultColDef, r26ExcelStyles } from "@/table/report/r26tabls/r26GridShared";
import {
  findSourceField,
  getMetaLocations,
  isFromKey,
  isToKey,
  getMetaReports,
  isRequestCancelled,
  MetaFilterDef,
  MetaLocation,
  MetaPagination,
  MetaReportDef,
  MetaReportResult,
  runMetaReport,
} from "@/services/metaReportService";

const { RangePicker } = DatePicker;

/* ================= constants & pure helpers (module level = allocated once) ================= */

const PAGE_SIZES = [10, 25, 50, 100];
const NUMERIC_SAMPLE = 100; // rows inspected to decide whether a column is numeric
const SEARCH_DEBOUNCE_MS = 250;
const COLLAPSE_KEY = "metaReport.panelCollapsed";
const NEWLINES = /\\n|\n/g;
const EMPTY_SET: ReadonlySet<string> = new Set();

const LOCATION_ICONS: Record<string, React.ElementType> = {
  STORE: Package,
  TRC: Wrench,
  MFG: Factory,
  DISPATCH: Truck,
};

const locationFilter = createFilterOptions<MetaLocation>({ stringify: (o) => `${o.name} ${o.id}` });
const reportFilter = createFilterOptions<MetaReportDef>({ stringify: (o) => `${o.name} ${o.code}` });
const getLocationLabel = (o: MetaLocation) => o.name;
const getReportLabel = (o: MetaReportDef) => o.name;
const sameLocation = (a: MetaLocation, b: MetaLocation) => a.id === b.id;
const sameReport = (a: MetaReportDef, b: MetaReportDef) => a.code === b.code;
const disableFuture = (d: Dayjs) => !!d && d > dayjs().endOf("day");
const BUTTON_SX = { textTransform: "none", fontWeight: 600, height: 40, mt: 2 } as const;
const DOWNLOAD_SX = { textTransform: "none", fontWeight: 600, height: 40, mt: 1 } as const;
const DOWNLOAD_COOLDOWN_MS = 4000; // blocks accidental double requests

const errorMessage = (e: any, fallback: string) =>
  e?.response?.data?.message || e?.message || fallback;

const formatCell = (p: ValueFormatterParams) =>
  p.value === null || p.value === undefined || p.value === ""
    ? "—"
    : String(p.value).replace(NEWLINES, ", ");

const gridDefaultColDef: ColDef = { ...r26DefaultColDef, valueFormatter: formatCell };

const readCollapsed = () => {
  try {
    return localStorage.getItem(COLLAPSE_KEY) === "1";
  } catch {
    return false;
  }
};

type FilterValues = Record<string, any>;
type RunRequest = { locationId: string; reportCode: string; filters: Record<string, any> };

/** Keys sent as YYYY-MM-DD; every other date key is sent as DD-MM-YYYY (as the backend expects). */
const YMD_DATE_KEYS = new Set(["fromDate", "toDate"]);
const dateFormatFor = (f: MetaFilterDef) => f.format || (YMD_DATE_KEYS.has(f.key) ? "YYYY-MM-DD" : "DD-MM-YYYY");

const isEmpty = (v: any) => v === null || v === undefined || (typeof v === "string" && v.trim() === "");

const matchesShowWhen = (f: MetaFilterDef, values: FilterValues) =>
  !f.showWhen ||
  Object.entries(f.showWhen).every(([k, want]) =>
    Array.isArray(want) ? want.includes(values[k]) : values[k] === want,
  );

/** Rendered in the form. */
const isVisible = (f: MetaFilterDef, values: FilterValues) =>
  f.inputType !== "hidden" && matchesShowWhen(f, values);

/** Sent to the API (hidden fields are sent, but still honour showWhen). */
const isActive = (f: MetaFilterDef, values: FilterValues) => matchesShowWhen(f, values);

const defaultFor = (f: MetaFilterDef, prev: FilterValues) => {
  const old = prev[f.key];
  switch (f.inputType) {
    case "date":
      if (dayjs.isDayjs(old)) return old; // keep dates when switching between reports
      if (f.defaultValue) return dayjs(f.defaultValue);
      if (isToKey(f.key)) return dayjs();
      if (isFromKey(f.key)) return dayjs().startOf("month");
      return null;
    case "select":
      return f.defaultValue ?? (f.required ? f.options?.[0]?.value ?? "" : "");
    case "hidden":
      return f.defaultValue;
    default:
      return f.defaultValue ?? "";
  }
};

const initialValues = (report: MetaReportDef | null, prev: FilterValues = {}): FilterValues => {
  const values: FilterValues = {};
  report?.fields.forEach((f) => {
    values[f.key] = defaultFor(f, prev);
  });
  return values;
};

const toPayloadValue = (f: MetaFilterDef, v: any) => {
  if (isEmpty(v)) return undefined;
  if (f.inputType === "date") return dayjs.isDayjs(v) ? v.format(dateFormatFor(f)) : v;
  if (f.inputType === "number") return Number(v);
  return typeof v === "string" ? v.trim() : v;
};

/** Builds the request filters from the active fields; also returns required fields that are still empty. */
const buildFilters = (report: MetaReportDef, values: FilterValues, page: number, limit: number) => {
  const filters: Record<string, any> = {};
  const missing: MetaFilterDef[] = [];
  for (const f of report.filters) {
    if (!isActive(f, values)) continue;
    const out = toPayloadValue(f, values[f.key]);
    if (out === undefined) {
      if (f.required && f.inputType !== "hidden") missing.push(f);
      continue;
    }
    filters[f.key] = out;
  }
  filters.page = page;
  filters.limit = limit;
  return { filters, missing };
};

type FieldGroup =
  | { kind: "range"; from: MetaFilterDef; to: MetaFilterDef }
  | { kind: "field"; def: MetaFilterDef };

/** Visible fields in order; an adjacent from/to date pair is merged into one range picker. */
const groupFields = (report: MetaReportDef, values: FilterValues): FieldGroup[] => {
  const visible = report.fields.filter((f) => isVisible(f, values));
  const groups: FieldGroup[] = [];
  for (let i = 0; i < visible.length; i++) {
    const f = visible[i];
    const next = visible[i + 1];
    if (f.inputType === "date" && isFromKey(f.key) && next?.inputType === "date" && isToKey(next.key)) {
      groups.push({ kind: "range", from: f, to: next });
      i++;
    } else {
      groups.push({ kind: "field", def: f });
    }
  }
  return groups;
};

/**
 * Builds the flat socket payload from the report's `socket` field list. Socket keys/formats may differ
 * from the form (e.g. fromDt/YYYY-MM-DD vs from/DD-MM-YYYY), so each socket field takes its value from
 * the form field with the same key, else the same label, else the matching from/to date.
 * Returns the API fields to flag when a required socket field has no value.
 */
const buildSocketPayload = (report: MetaReportDef, values: FilterValues) => {
  // `socket: null` -> the download takes exactly the api keys (no paging for a full export).
  if (!report.socketFilters) {
    const { filters, missing } = buildFilters(report, values, 1, 0);
    delete filters.page;
    delete filters.limit;
    return { payload: filters, missing };
  }

  // Otherwise only the socket keys are sent, each valued from its matching form field.
  const active = report.fields.filter((f) => isActive(f, values));
  const payload: Record<string, any> = {};
  const missing: MetaFilterDef[] = [];
  for (const sf of report.socketFilters) {
    const source = findSourceField(sf, active);
    // A socket field whose form field is hidden by showWhen is not sent.
    if (!source && report.fields.some((f) => findSourceField(sf, [f]))) continue;
    const out = toPayloadValue(sf, source ? values[source.key] : sf.defaultValue);
    if (out === undefined) {
      if (sf.required) missing.push(source ?? sf);
      continue;
    }
    payload[sf.key] = out;
  }
  return { payload, missing };
};

const sameFilters = (a: Record<string, any>, b: Record<string, any>) => {
  const ak = Object.keys(a);
  return ak.length === Object.keys(b).length && ak.every((k) => a[k] === b[k]);
};

/** Stable function identity that always calls the latest closure. */
function useStableCallback<A extends any[], R>(fn: (...args: A) => R) {
  const ref = useRef(fn);
  ref.current = fn;
  return useCallback((...args: A) => ref.current(...args), []);
}

function useDebounced<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/* ================= small presentational pieces ================= */

const StepHeading = memo<{ step: number; title: string; done?: boolean; hint?: string }>(
  ({ step, title, done, hint }) => (
    <div className="mb-2.5 flex items-center gap-2">
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
          done ? "bg-cyan-600 text-white" : "bg-slate-200 text-slate-600",
        )}
      >
        {done ? <CheckCircle2 aria-hidden className="h-3.5 w-3.5" /> : step}
      </span>
      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{title}</h3>
      {hint && <span className="ml-auto text-[11px] text-slate-400">{hint}</span>}
    </div>
  ),
);

const RailButton: React.FC<{
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}> = ({ label, onClick, disabled, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={label}
    aria-label={label}
    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 disabled:pointer-events-none disabled:opacity-40"
  >
    {children}
  </button>
);

const PagerButton: React.FC<{
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}> = ({ label, onClick, disabled, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={label}
    aria-label={label}
    className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 disabled:pointer-events-none disabled:opacity-40"
  >
    {children}
  </button>
);

const DashedNote: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="rounded-lg border border-dashed border-slate-200 px-3 py-4 text-center text-xs text-slate-500">
    {children}
  </p>
);

/* ================= Step 1: location ================= */

const LocationPicker = memo<{
  locations: MetaLocation[];
  loading: boolean;
  error: string | null;
  value: MetaLocation | null;
  onChange: (id: string | null) => void;
  onRetry: () => void;
}>(({ locations, loading, error, value, onChange, onRetry }) => {
  const Icon = (value && LOCATION_ICONS[value.id]) || MapPin;
  return (
    <section className="px-4 py-4">
      <StepHeading step={1} title="Location" done={!!value} />
      {error ? (
        <ReportErrorState message={error} onRetry={onRetry} />
      ) : (
        <Autocomplete<MetaLocation>
          size="small"
          fullWidth
          autoHighlight
          openOnFocus
          options={locations}
          loading={loading}
          value={value}
          onChange={(_, v) => onChange(v?.id ?? null)}
          getOptionLabel={getLocationLabel}
          isOptionEqualToValue={sameLocation}
          filterOptions={locationFilter}
          noOptionsText="No matching location"
          renderOption={({ key, ...props }, o, { selected }) => {
            const OptIcon = LOCATION_ICONS[o.id] ?? Building2;
            return (
              <li key={key} {...props}>
                <span className="flex w-full items-center gap-2.5">
                  <OptIcon
                    aria-hidden
                    className={cn("h-4 w-4 shrink-0", selected ? "text-cyan-700" : "text-slate-400")}
                  />
                  <span className="min-w-0 flex-1 truncate text-sm text-slate-800">{o.name}</span>
               
                </span>
              </li>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search location…"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    <Icon aria-hidden className="ml-1 h-4 w-4 shrink-0 text-slate-400" />
                    {params.InputProps.startAdornment}
                  </>
                ),
                endAdornment: (
                  <>
                    {loading && <CircularProgress size={16} />}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      )}
    </section>
  );
});



const ReportPicker = memo<{
  location: MetaLocation | null;
  reports: MetaReportDef[];
  loading: boolean;
  error: string | null;
  value: MetaReportDef | null;
  onChange: (code: string | null) => void;
  onRetry: () => void;
}>(({ location, reports, loading, error, value, onChange, onRetry }) => (
  <section className="px-4 py-4">
    <StepHeading
      step={2}
      title="Report"
      done={!!value}
      hint={location && !loading && !error ? `${reports.length} available` : undefined}
    />
    {error && location ? (
      <ReportErrorState message={error} onRetry={onRetry} />
    ) : (
      <Autocomplete<MetaReportDef>
        size="small"
        fullWidth
        autoHighlight
        openOnFocus
        disabled={!location}
        options={reports}
        loading={loading}
        value={value}
        onChange={(_, v) => onChange(v?.code ?? null)}
        getOptionLabel={getReportLabel}
        isOptionEqualToValue={sameReport}
        filterOptions={reportFilter}
        loadingText="Loading reports…"
        noOptionsText={
          reports.length === 0 && location
            ? `No reports configured for ${location.name}`
            : "No matching report"
        }
        renderOption={({ key, ...props }, o) => (
          <li key={key} {...props}>
            <span className="flex min-w-0 flex-col py-0.5">
              <span className="truncate text-sm text-slate-800">{o.name}</span>
            </span>
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={location ? "Search report by name or code…" : "Select a location first"}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  <FileBarChart2 aria-hidden className="ml-1 h-4 w-4 shrink-0 text-slate-400" />
                  {params.InputProps.startAdornment}
                </>
              ),
              endAdornment: (
                <>
                  {loading && <CircularProgress size={16} />}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    )}
  </section>
));

/* ================= Step 3: filters ================= */

const SELECT_MENU_PROPS = { PaperProps: { sx: { maxHeight: 320 } } } as const;

const FieldShell: React.FC<{
  id: string;
  label: string;
  required?: boolean;
  error?: boolean;
  downloadOnly?: boolean;
  children: React.ReactNode;
}> = ({ id, label, required, error, downloadOnly, children }) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="text-xs font-medium text-slate-600">
      {label}
      {required ? (
        <span aria-hidden className="ml-0.5 text-red-500">
          *
        </span>
      ) : (
        <span className="ml-1 font-normal text-slate-400">(optional)</span>
      )}
      {downloadOnly && (
        <span className="ml-1.5 rounded bg-slate-100 px-1 py-px text-[10px] font-medium text-slate-500">
          Download only
        </span>
      )}
    </label>
    {children}
    {error && (
      <p id={`${id}-error`} className="text-[11px] text-red-600">
        {label} is required.
      </p>
    )}
  </div>
);

const RangeField = memo<{
  from: MetaFilterDef;
  to: MetaFilterDef;
  fromValue: Dayjs | null;
  toValue: Dayjs | null;
  error: boolean;
  onChange: (patch: FilterValues) => void;
}>(({ from, to, fromValue, toValue, error, onChange }) => {
  const id = `mf-${from.key}`;
  const value = useMemo<[Dayjs, Dayjs] | null>(
    () => (fromValue && toValue ? [fromValue, toValue] : null),
    [fromValue, toValue],
  );
  const placeholder = useMemo<[string, string]>(() => [from.label, to.label], [from.label, to.label]);
  return (
    <FieldShell
      id={id}
      label={`${from.label} – ${to.label}`}
      required={from.required || to.required}
      error={error}
    >
      <RangePicker
        id={id}
        className="h-10 w-full"
        status={error ? "error" : undefined}
        presets={rangePresets}
        value={value}
        onChange={(v) => onChange({ [from.key]: v?.[0] ?? null, [to.key]: v?.[1] ?? null })}
        disabledDate={disableFuture}
        format="DD/MM/YYYY"
        placeholder={placeholder}
      />
    </FieldShell>
  );
});

const FilterField = memo<{
  def: MetaFilterDef;
  value: any;
  error: boolean;
  onChange: (patch: FilterValues) => void;
  onEnter: () => void;
}>(({ def, value, error, onChange, onEnter }) => {
  const id = `mf-${def.key}`;
  const set = (v: any) => onChange({ [def.key]: v });
  let control: React.ReactNode;

  if (def.inputType === "select") {
    const options = def.options ?? [];
    control = (
      <TextField
        id={id}
        select
        size="small"
        fullWidth
        value={value ?? ""}
        onChange={(e) => set(e.target.value)}
        error={error}
        SelectProps={{
          displayEmpty: true,
          MenuProps: SELECT_MENU_PROPS,
          renderValue: (v) =>
            isEmpty(v) ? (
              <span className="text-slate-400">
                {def.required ? `Select ${def.label.toLowerCase()}` : "All"}
              </span>
            ) : (
              options.find((o) => o.value === v)?.label ?? String(v)
            ),
        }}
        inputProps={{ "aria-describedby": error ? `${id}-error` : undefined }}
      >
        {!def.required && (
          <MenuItem value="">
            <em>All</em>
          </MenuItem>
        )}
        {options.map((o) => (
          <MenuItem key={o.value} value={o.value}>
            {o.label}
          </MenuItem>
        ))}
      </TextField>
    );
  } else if (def.inputType === "date") {
    control = (
      <DatePicker
        id={id}
        className="h-10 w-full"
        status={error ? "error" : undefined}
        value={dayjs.isDayjs(value) ? value : null}
        onChange={(d) => set(d ?? null)}
        disabledDate={disableFuture}
        format="DD/MM/YYYY"
        placeholder={def.placeholder || def.label}
      />
    );
  } else {
    control = (
      <TextField
        id={id}
        size="small"
        fullWidth
        type={def.inputType === "number" ? "number" : "text"}
        value={value ?? ""}
        onChange={(e) => set(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onEnter()}
        placeholder={def.placeholder || `Enter ${def.label.toLowerCase()}`}
        error={error}
        inputProps={{
          inputMode: def.inputType === "number" ? "decimal" : undefined,
          "aria-describedby": error ? `${id}-error` : undefined,
        }}
      />
    );
  }

  return (
    <FieldShell id={id} label={def.label} required={def.required} error={error} downloadOnly={def.downloadOnly}>
      {control}
    </FieldShell>
  );
});

const FiltersSection = memo<{
  report: MetaReportDef | null;
  values: FilterValues;
  errorKeys: ReadonlySet<string>;
  onChange: (patch: FilterValues) => void;
  running: boolean;
  canGenerate: boolean;
  filtersChanged: boolean;
  onGenerate: () => void;
  downloading: boolean;
  onDownload: () => void;
}>(
  ({
    report,
    values,
    errorKeys,
    onChange,
    running,
    canGenerate,
    filtersChanged,
    onGenerate,
    downloading,
    onDownload,
  }) => {
  const groups = useMemo(() => (report ? groupFields(report, values) : []), [report, values]);

  return (
    <section className="px-4 py-4">
      <StepHeading step={3} title="Filters" />
      {!report ? (
        <DashedNote>Select a report to set its filters.</DashedNote>
      ) : groups.length === 0 ? (
        <p className="text-xs text-slate-500">This report has no filters.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {groups.map((g) =>
            g.kind === "range" ? (
              <RangeField
                key={`${g.from.key}-${g.to.key}`}
                from={g.from}
                to={g.to}
                fromValue={values[g.from.key] ?? null}
                toValue={values[g.to.key] ?? null}
                error={errorKeys.has(g.from.key) || errorKeys.has(g.to.key)}
                onChange={onChange}
              />
            ) : (
              <FilterField
                key={g.def.key}
                def={g.def}
                value={values[g.def.key]}
                error={errorKeys.has(g.def.key)}
                onChange={onChange}
                onEnter={onGenerate}
              />
            ),
          )}
        </div>
      )}

      {report?.executionType !== "SOCKET" && (
        <LoadingButton
          fullWidth
          variant="contained"
          disableElevation
          startIcon={<Play className="h-4 w-4" />}
          loadingPosition="start"
          loading={running}
          disabled={!canGenerate}
          onClick={onGenerate}
          sx={BUTTON_SX}
        >
          Generate report
        </LoadingButton>
      )}

      {report?.socketEvent && (
        <Button
          fullWidth
          variant={report.executionType === "SOCKET" ? "contained" : "outlined"}
          disableElevation
          startIcon={<FileDown className="h-4 w-4" />}
          disabled={!canGenerate || downloading}
          onClick={onDownload}
          sx={report.executionType === "SOCKET" ? BUTTON_SX : DOWNLOAD_SX}
        >
          {downloading ? "Download requested…" : "Download report"}
        </Button>
      )}

      {filtersChanged && (
        <p
          role="status"
          className="mt-3 flex items-start gap-1.5 rounded-lg bg-amber-50 px-2.5 py-2 text-xs text-amber-800"
        >
          <AlertTriangle aria-hidden className="mt-px h-3.5 w-3.5 shrink-0" />
          Filters changed. Click Generate report to refresh the data.
        </p>
      )}
    </section>
  );
  },
);

/* ================= collapsed rail ================= */

const CollapsedRail = memo<{
  location: MetaLocation | null;
  report: MetaReportDef | null;
  running: boolean;
  canGenerate: boolean;
  canExport: boolean;
  downloading: boolean;
  onExpand: () => void;
  onGenerate: () => void;
  onExport: () => void;
  onDownload: () => void;
}>(({ location, report, running, canGenerate, canExport, downloading, onExpand, onGenerate, onExport, onDownload }) => {
  const LocationIcon = (location && LOCATION_ICONS[location.id]) || MapPin;
  return (
    <div className="flex items-center gap-1 p-2 lg:h-full lg:flex-col lg:py-3">
      <RailButton label="Expand panel" onClick={onExpand}>
        <PanelLeftOpen className="h-[18px] w-[18px]" />
      </RailButton>
      <span className="mx-1 h-5 w-px bg-slate-200 lg:mx-0 lg:my-1 lg:h-px lg:w-6" />
      <RailButton label={location ? `Location: ${location.name}` : "Choose location"} onClick={onExpand}>
        <LocationIcon className="h-[18px] w-[18px]" />
      </RailButton>
      <RailButton label={report ? `Report: ${report.name}` : "Choose report"} onClick={onExpand}>
        <FileBarChart2 className="h-[18px] w-[18px]" />
      </RailButton>
      <RailButton label="Change filters" onClick={onExpand}>
        <SlidersHorizontal className="h-[18px] w-[18px]" />
      </RailButton>
      {report?.executionType !== "SOCKET" && (
        <RailButton label="Generate report" onClick={onGenerate} disabled={!canGenerate || running}>
          <RotateCw className={cn("h-[18px] w-[18px]", running && "animate-spin")} />
        </RailButton>
      )}
      <RailButton label="Export to Excel" onClick={onExport} disabled={!canExport}>
        <Download className="h-[18px] w-[18px]" />
      </RailButton>
      {report?.socketEvent && (
        <RailButton label="Download report" onClick={onDownload} disabled={!canGenerate || downloading}>
          <FileDown className="h-[18px] w-[18px]" />
        </RailButton>
      )}
      <span className="ml-2 text-xs font-medium text-slate-500 lg:ml-0 lg:mt-4 lg:rotate-180 lg:[writing-mode:vertical-rl]">
        Report &amp; filters
      </span>
    </div>
  );
});

/* ================= result grid ================= */

const ResultGrid = memo<{
  gridRef: React.RefObject<AgGridReact<any>>;
  result: MetaReportResult;
  loading: boolean;
  quickFilter: string;
}>(({ gridRef, result, loading, quickFilter }) => {
  // Column defs only change when a new result arrives; numeric detection samples a bounded number of rows.
  const columnDefs = useMemo<ColDef[]>(() => {
    const sample = result.rows.slice(0, NUMERIC_SAMPLE);
    return result.headers.map(({ key, label }) => {
      let seen = false;
      const numeric =
        sample.length > 0 &&
        sample.every((r) => {
          const v = r[key];
          if (v === null || v === undefined || v === "") return true;
          seen = true;
          return !isNaN(Number(v));
        }) &&
        seen;
      return numeric
        ? { headerName: label, field: key, minWidth: 110, flex: 1, type: "rightAligned" }
        : { headerName: label, field: key, minWidth: 150, flex: 1, tooltipField: key };
    });
  }, [result.headers, result.rows]);

  return (
    <div className={R26_GRID_CLASS}>
      <AgGridReact
        ref={gridRef}
        rowData={result.rows}
        columnDefs={columnDefs}
        defaultColDef={gridDefaultColDef}
        excelStyles={r26ExcelStyles}
        quickFilterText={quickFilter}
        loading={loading}
        loadingOverlayComponent={CustomLoadingOverlay}
        overlayNoRowsTemplate={OverlayNoRowsTemplate}
        enableBrowserTooltips
        suppressCellFocus
        enableCellTextSelection
        animateRows={false}
      />
    </div>
  );
});

/* ================= pagination ================= */

const PaginationBar = memo<{
  pagination: MetaPagination | null;
  rowCount: number;
  running: boolean;
  onPage: (page: number) => void;
  onPageSize: (size: number) => void;
}>(({ pagination, rowCount, running, onPage, onPageSize }) => {
  const total = pagination?.totalRecords ?? rowCount;
  const first = pagination ? (pagination.currentPage - 1) * pagination.limit + 1 : 1;
  const last = pagination ? Math.min(first + rowCount - 1, pagination.totalRecords) : rowCount;
  const sizes = useMemo(
    () => (pagination ? Array.from(new Set([...PAGE_SIZES, pagination.limit])).sort((a, b) => a - b) : []),
    [pagination],
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-2.5 text-xs text-slate-600">
      <span className="tabular-nums">
        {rowCount === 0
          ? "No records"
          : `Showing ${first.toLocaleString("en-IN")}–${last.toLocaleString("en-IN")} of ${total.toLocaleString("en-IN")}`}
      </span>
      {pagination && (
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-1.5">
            Rows per page
            <select
              value={pagination.limit}
              onChange={(e) => onPageSize(Number(e.target.value))}
              disabled={running}
              className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-600/30"
            >
              {sizes.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-center gap-1">
            <PagerButton label="First page" onClick={() => onPage(1)} disabled={running || !pagination.hasPrevPage}>
              <ChevronsLeft className="h-4 w-4" />
            </PagerButton>
            <PagerButton
              label="Previous page"
              onClick={() => onPage(pagination.currentPage - 1)}
              disabled={running || !pagination.hasPrevPage}
            >
              <ChevronLeft className="h-4 w-4" />
            </PagerButton>
            <span className="px-2 tabular-nums">
              Page {pagination.currentPage} of {Math.max(pagination.totalPages, 1)}
            </span>
            <PagerButton
              label="Next page"
              onClick={() => onPage(pagination.currentPage + 1)}
              disabled={running || !pagination.hasNextPage}
            >
              <ChevronRight className="h-4 w-4" />
            </PagerButton>
            <PagerButton
              label="Last page"
              onClick={() => onPage(pagination.totalPages)}
              disabled={running || !pagination.hasNextPage}
            >
              <ChevronsRight className="h-4 w-4" />
            </PagerButton>
          </div>
        </div>
      )}
    </div>
  );
});

/* ================= result panel (owns search state so typing never re-renders the page) ================= */

const ResultPanel = memo<{
  gridRef: React.RefObject<AgGridReact<any>>;
  location: MetaLocation | null;
  report: MetaReportDef | null;
  result: MetaReportResult | null;
  running: boolean;
  error: string | null;
  searchResetKey: number;
  onRetry: () => void;
  onExport: () => void;
  onPage: (page: number) => void;
  onPageSize: (size: number) => void;
}>(
  ({
    gridRef,
    location,
    report,
    result,
    running,
    error,
    searchResetKey,
    onRetry,
    onExport,
    onPage,
    onPageSize,
  }) => {
    const [search, setSearch] = useState("");
    const quickFilter = useDebounced(search, SEARCH_DEBOUNCE_MS);
    useEffect(() => setSearch(""), [searchResetKey]);

    const pagination = result?.pagination ?? null;
    const totalRecords = pagination?.totalRecords ?? result?.rows.length ?? 0;

    return (
      <main className="flex min-h-[480px] min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:min-h-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-slate-900">
              {report?.name ?? "No report selected"}
            </h2>
            <p className="flex flex-wrap items-center gap-x-2 text-xs text-slate-500">
              {location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin aria-hidden className="h-3 w-3" />
                  {location.name}
                </span>
              )}
              {result && (
                <span>
                  · {totalRecords.toLocaleString("en-IN")} record{totalRecords === 1 ? "" : "s"}
                </span>
              )}
            </p>
          </div>
          {result && (
            <div className="flex flex-wrap items-center gap-2">
              <TableSearch
                value={search}
                onChange={setSearch}
                placeholder={pagination ? "Search this page…" : "Search rows…"}
              />
              <button
                type="button"
                onClick={onExport}
                disabled={!result.rows.length}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 disabled:pointer-events-none disabled:opacity-40"
              >
                <Download aria-hidden className="h-4 w-4" />
                Export
              </button>
            </div>
          )}
        </div>

        {error && !running && (
          <div className="border-b border-slate-200 p-3">
            <ReportErrorState message={error} onRetry={onRetry} />
          </div>
        )}

        <div className="relative min-h-[360px] flex-1 lg:min-h-0">
          {result ? (
            <div className="lg:absolute lg:inset-0">
              <ResultGrid gridRef={gridRef} result={result} loading={running} quickFilter={quickFilter} />
            </div>
          ) : running ? (
            <div className="flex flex-col gap-2 p-4">
              {Array.from({ length: 8 }, (_, i) => (
                <Skeleton key={i} className="h-9 w-full" />
              ))}
            </div>
          ) : (
            !error && (
              <div className="flex h-full items-center justify-center p-6">
                <div className="flex max-w-sm flex-col items-center text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-50 text-cyan-700">
                    <FileBarChart2 aria-hidden className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-slate-900">
                    {!location ? "Start by choosing a location" : !report ? "Now pick a report" : "Ready to generate"}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {!location
                      ? "Reports are grouped by location. Pick one in the left panel."
                      : !report
                        ? `Choose one of the reports available for ${location.name}.`
                        : "Adjust the filters if needed, then click Generate report."}
                  </p>
                </div>
              </div>
            )
          )}
        </div>

        {result && (
          <PaginationBar
            pagination={pagination}
            rowCount={result.rows.length}
            running={running}
            onPage={onPage}
            onPageSize={onPageSize}
          />
        )}
      </main>
    );
  },
);

/* ================= page ================= */

const MetaReport: React.FC = () => {
  const gridRef = useRef<AgGridReact<any>>(null);
  const runAbort = useRef<AbortController | null>(null);
  const reportsSeq = useRef(0);

  // Step 1 – locations
  const [locations, setLocations] = useState<MetaLocation[]>([]);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [locationsError, setLocationsError] = useState<string | null>(null);
  const [locationId, setLocationId] = useState<string | null>(null);

  // Step 2 – reports
  const [reports, setReports] = useState<MetaReportDef[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsError, setReportsError] = useState<string | null>(null);
  const [reportCode, setReportCode] = useState<string | null>(null);

  // Step 3 – filters
  const [values, setValues] = useState<FilterValues>({});
  // Which action's required fields to flag (Generate checks api keys, Download checks socket keys).
  const [errorMode, setErrorMode] = useState<"api" | "socket" | null>(null);
  const patchValues = useCallback((patch: FilterValues) => setValues((v) => ({ ...v, ...patch })), []);
  const [pageSize, setPageSize] = useState(25);

  // Result
  const [result, setResult] = useState<MetaReportResult | null>(null);
  const [lastRun, setLastRun] = useState<RunRequest | null>(null);
  const [running, setRunning] = useState(false);
  const [runError, setRunError] = useState<string | null>(null);
  const [searchResetKey, setSearchResetKey] = useState(0);

  // Collapsible left panel (remembered per browser)
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const toggleCollapsed = useCallback(() => setCollapsed((c) => !c), []);
  useEffect(() => {
    try {
      localStorage.setItem(COLLAPSE_KEY, collapsed ? "1" : "0");
    } catch {
      /* storage unavailable */
    }
  }, [collapsed]);

  const location = useMemo(() => locations.find((l) => l.id === locationId) ?? null, [locations, locationId]);
  const report = useMemo(() => reports.find((r) => r.code === reportCode) ?? null, [reports, reportCode]);

  // Fresh defaults whenever the selected report changes (date values carry over between reports).
  useEffect(() => {
    setValues((prev) => initialValues(report, prev));
    setErrorMode(null);
  }, [report]);

  /* ---- data loading ---- */

  const loadLocations = useCallback(async () => {
    setLocationsLoading(true);
    setLocationsError(null);
    try {
      setLocations(await getMetaLocations());
    } catch (e) {
      setLocationsError(errorMessage(e, "Could not load locations"));
    } finally {
      setLocationsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  const loadReports = useCallback(async (locId: string) => {
    const seq = ++reportsSeq.current;
    setReportsLoading(true);
    setReportsError(null);
    setReports([]);
    try {
      const list = await getMetaReports(locId);
      if (seq !== reportsSeq.current) return;
      setReports(list);
      if (list.length === 1) setReportCode(list[0].code);
    } catch (e) {
      if (seq !== reportsSeq.current) return;
      setReportsError(errorMessage(e, "Could not load reports"));
    } finally {
      if (seq === reportsSeq.current) setReportsLoading(false);
    }
  }, []);

  // Cancel any in-flight run on unmount.
  useEffect(() => () => runAbort.current?.abort(), []);

  const resetResult = () => {
    runAbort.current?.abort();
    setRunning(false);
    setResult(null);
    setLastRun(null);
    setRunError(null);
    setSearchResetKey((k) => k + 1);
  };

  /* ---- actions (stable identities so memoised children don't re-render) ---- */

  const selectLocation = useStableCallback((id: string | null) => {
    if (id === locationId) return;
    reportsSeq.current++;
    setLocationId(id);
    setReportCode(null);
    setReports([]);
    setReportsError(null);
    setReportsLoading(false);
    resetResult();
    if (id) loadReports(id);
  });

  const selectReport = useStableCallback((code: string | null) => {
    if (code === reportCode) return;
    setReportCode(code);
    resetResult();
  });

  const retryReports = useStableCallback(() => {
    if (locationId) loadReports(locationId);
  });

  const execute = useCallback(async (req: RunRequest) => {
    runAbort.current?.abort();
    const controller = new AbortController();
    runAbort.current = controller;
    setRunning(true);
    setRunError(null);
    try {
      const res = await runMetaReport(req, { signal: controller.signal });
      setResult(res);
      setLastRun(req);
    } catch (e) {
      if (isRequestCancelled(e) || controller.signal.aborted) return;
      setRunError(errorMessage(e, "Something went wrong"));
    } finally {
      if (runAbort.current === controller) {
        runAbort.current = null;
        setRunning(false);
      }
    }
  }, []);

  /** Validated filters for the current form, or null (with the missing fields flagged). */
  const collectFilters = (page: number, limit: number) => {
    if (!report) return null;
    const { filters, missing } = buildFilters(report, values, page, limit);
    if (missing.length) {
      setErrorMode("api");
      setCollapsed(false);
      showToast(`Please fill ${missing.map((f) => f.label).join(", ")}`, "error");
      return null;
    }
    setErrorMode(null);
    return filters;
  };

  const handleGenerate = useStableCallback(() => {
    if (!location || !report) return;
    if (report.executionType === "SOCKET") {
      handleDownload();
      return;
    }
    const filters = collectFilters(1, pageSize);
    if (!filters) return;
    setSearchResetKey((k) => k + 1);
    execute({ locationId: location.id, reportCode: report.code, filters });
  });

  const goToPage = useStableCallback((page: number, limit?: number) => {
    if (!lastRun) return;
    execute({
      ...lastRun,
      filters: { ...lastRun.filters, page, limit: limit ?? lastRun.filters.limit ?? pageSize },
    });
  });

  const changePageSize = useStableCallback((size: number) => {
    setPageSize(size);
    if (lastRun) goToPage(1, size);
  });

  // Reports with a socketEvent can be exported in full on the server; the file arrives via notifications.
  const [downloading, setDownloading] = useState(false);
  const downloadTimer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(downloadTimer.current), []);

  const handleDownload = useStableCallback(() => {
    if (!location || !report?.socketEvent || downloading) return;
    const { payload, missing } = buildSocketPayload(report, values);
    if (missing.length) {
      setErrorMode("socket");
      setCollapsed(false);
      showToast(`Please fill ${missing.map((f) => f.label).join(", ")}`, "error");
      return;
    }
    if (!socketService.isConnected()) {
      showToast("Not connected to the server. Please try again in a moment.", "error");
      return;
    }
    setErrorMode(null);
    socketService.emit(report.socketEvent, payload);
    showToast("Download requested. You'll get a notification when the file is ready.", "success");
    setDownloading(true);
    clearTimeout(downloadTimer.current);
    downloadTimer.current = setTimeout(() => setDownloading(false), DOWNLOAD_COOLDOWN_MS);
  });

  const retryRun = useStableCallback(() => (lastRun ? execute(lastRun) : handleGenerate()));

  const handleExport = useStableCallback(() => {
    if (!result?.rows.length) {
      showToast("No data to export", "error");
      return;
    }
    const dateKeys = report?.filters.filter((f) => f.inputType === "date").map((f) => f.key) ?? [];
    const suffix =
      (lastRun &&
        dateKeys
          .map((k) => lastRun.filters[k])
          .filter(Boolean)
          .join("_to_")) ||
      dayjs().format("DD-MM-YYYY");
    const name = report?.name || "Report";
    gridRef.current?.api.exportDataAsExcel({
      sheetName: name.slice(0, 31),
      fileName: `${name.replace(/\s+/g, "_")}${suffix ? `_${suffix}` : ""}.xlsx`,
    });
  });

  /* ---- derived ---- */

  const filtersChanged = useMemo(() => {
    if (!lastRun || !report || lastRun.reportCode !== report.code) return false;
    const { filters, missing } = buildFilters(
      report,
      values,
      lastRun.filters.page ?? 1,
      lastRun.filters.limit ?? pageSize,
    );
    return missing.length > 0 || !sameFilters(filters, lastRun.filters);
  }, [lastRun, report, values, pageSize]);

  // Fields to flag; recomputed live so an error clears as soon as the field is filled.
  const errorKeys = useMemo<ReadonlySet<string>>(() => {
    if (!errorMode || !report) return EMPTY_SET;
    const { missing } =
      errorMode === "socket" ? buildSocketPayload(report, values) : buildFilters(report, values, 1, pageSize);
    return new Set(missing.map((f) => f.key));
  }, [errorMode, report, values, pageSize]);

  const canGenerate = !!location && !!report;
  const canExport = !!result?.rows.length;

  /* ---------------- render ---------------- */

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3 lg:flex-row lg:overflow-hidden">
      <aside
        aria-label="Report selection"
        className={cn(
          "shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-[width] duration-200 ease-out lg:flex lg:flex-col",
          collapsed ? "lg:w-14" : "lg:w-[340px]",
        )}
      >
        {collapsed ? (
          <CollapsedRail
            location={location}
            report={report}
            running={running}
            canGenerate={canGenerate}
            canExport={canExport}
            downloading={downloading}
            onExpand={toggleCollapsed}
            onGenerate={handleGenerate}
            onExport={handleExport}
            onDownload={handleDownload}
          />
        ) : (
          <div className="flex flex-col lg:h-full lg:min-h-0">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <span className="text-sm font-semibold text-slate-900">Report &amp; filters</span>
              <RailButton label="Collapse panel" onClick={toggleCollapsed}>
                <PanelLeftClose className="h-[18px] w-[18px]" />
              </RailButton>
            </div>
            <div className="flex flex-col divide-y divide-slate-100 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
              <LocationPicker
                locations={locations}
                loading={locationsLoading}
                error={locationsError}
                value={location}
                onChange={selectLocation}
                onRetry={loadLocations}
              />
              <ReportPicker
                location={location}
                reports={reports}
                loading={reportsLoading}
                error={reportsError}
                value={report}
                onChange={selectReport}
                onRetry={retryReports}
              />
              <FiltersSection
                report={report}
                values={values}
                errorKeys={errorKeys}
                onChange={patchValues}
                running={running}
                canGenerate={canGenerate}
                filtersChanged={filtersChanged}
                onGenerate={handleGenerate}
                downloading={downloading}
                onDownload={handleDownload}
              />
            </div>
          </div>
        )}
      </aside>

      <ResultPanel
        gridRef={gridRef}
        location={location}
        report={report}
        result={result}
        running={running}
        error={runError}
        searchResetKey={searchResetKey}
        onRetry={retryRun}
        onExport={handleExport}
        onPage={goToPage}
        onPageSize={changePageSize}
      />
    </div>
  );
};

export default MetaReport;
