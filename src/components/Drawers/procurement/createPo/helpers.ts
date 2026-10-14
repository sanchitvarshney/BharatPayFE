import dayjs, { Dayjs } from "dayjs";
import {
  ComponentPoItem,
  ComponentPoLatestDetails,
  ComponentPoVendor,
} from "@/features/procurement/poTypes";
import { ComponentRow } from "./types";

/** Candidate vendors for a component — `vendors` (new) or `vendor` (old: object or array). */
export const poVendors = (po?: ComponentPoLatestDetails | null): ComponentPoVendor[] => {
  if (!po) return [];
  if (Array.isArray(po.vendors)) return po.vendors;
  if (Array.isArray(po.vendor)) return po.vendor;
  return po.vendor ? [po.vendor] : [];
};

/** Union of every component's candidate vendors, de-duped by id (plus any `vendor_list`). */
export const collectVendors = (
  components: ComponentPoItem[],
  vendorList?: ComponentPoVendor[],
): ComponentPoVendor[] => {
  const byId = new Map<string, ComponentPoVendor>();
  (vendorList ?? []).forEach((v) => v?.vendor_id && byId.set(v.vendor_id, v));
  components.forEach((c) =>
    poVendors(c.latest_po_details).forEach((v) => {
      if (v?.vendor_id && !byId.has(v.vendor_id)) byId.set(v.vendor_id, v);
    }),
  );
  return [...byId.values()];
};

export const STEPS = [
  "Vendor Details",
  "Billing & Shipping",
  "Document Details",
  "Review & Submit",
];

const EMPTY_TOKENS = ["", "-", "--", "null", "undefined"];

export const clean = (value?: string | null): string => {
  const trimmed = String(value ?? "").trim();
  return EMPTY_TOKENS.includes(trimmed.toLowerCase()) ? "" : trimmed;
};

export const toNum = (value?: string | number | null) => {
  const n = Number(clean(value == null ? "" : String(value)));
  return Number.isFinite(n) ? n : 0;
};

export const money = (value: number) =>
  value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const parseDueDate = (value?: string): Dayjs | null => {
  if (!value) return null;
  const [day, month, year] = value.split("-");
  const parsed = day && month && year ? dayjs(`${year}-${month}-${day}`) : dayjs(value);
  return parsed.isValid() ? parsed : null;
};

export const toRow = (item: ComponentPoItem): ComponentRow => {
  const po = item.latest_po_details ?? {};
  const ref = (item.component ?? item) as Record<string, unknown>;
  const key = String(
    ref.comp_key ?? ref.component_key ?? item.comp_key ?? item.component_key ?? "",
  );
  const name = clean(
    String(ref.comp_name ?? ref.component_name ?? item.comp_name ?? item.component_name ?? ""),
  );

  // Back-calculate the last ordered quantity so Taxable / CGST / SGST / IGST
  // auto-fill from the previous PO and stay consistent when qty/rate are edited.
  const rate = toNum(po.rate);
  const gstRate = toNum(po.gstrate);
  const lastTax =
    gstRate > 0 ? (toNum(po.cgst) + toNum(po.sgst) + toNum(po.igst)) / (gstRate / 100) : 0;
  const lastQty = rate > 0 && lastTax > 0 ? Number((lastTax / rate).toFixed(3)) : 0;

  return {
    componentKey: key,
    partNo: clean(item.part_no),
    componentName: name,
    qty: lastQty > 0 ? String(lastQty) : "",
    rate: clean(po.rate),
    hsnCode: clean(po.hsncode),
    gstType: po.gsttype === "I" ? "I" : "L",
    gstRate: clean(po.gstrate),
    remark: clean(po.remark) || clean(po.full_remark),
    lastPo: clean(po.po_transaction),
    lastOrdered: clean(po.last_ordered_date).split(" ")[0],
    lastQty,
    vendors: poVendors(item.latest_po_details)
      .filter((v) => v?.vendor_id)
      .map((v) => ({ id: v.vendor_id, name: clean(v.vendor_name) || v.vendor_id })),
    enabled: clean(item.is_enabled).toUpperCase() !== "N",
  };
};

export const rowTaxable = (row: ComponentRow) => Number(row.qty || 0) * Number(row.rate || 0);

export const rowGst = (row: ComponentRow) => {
  const taxable = rowTaxable(row);
  const rate = Number(row.gstRate || 0);
  if (row.gstType === "L") {
    const half = (taxable * rate) / 200;
    return { cgst: half, sgst: half, igst: 0 };
  }
  return { cgst: 0, sgst: 0, igst: (taxable * rate) / 100 };
};

export const rowIncomplete = (row: ComponentRow) =>
  !Number(row.qty) ||
  Number(row.qty) <= 0 ||
  !Number(row.rate) ||
  Number(row.rate) <= 0 ||
  !row.hsnCode;
