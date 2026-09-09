import { PoHistoryRecord } from "@/features/master/componentPercentage/componentPercentageType";

const numberFormatter = new Intl.NumberFormat("en-IN");

export const toNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export const formatNumber = (value: unknown) => {
  if (value === null || value === undefined || value === "") return "-";
  const parsed = Number(value);
  return Number.isNaN(parsed) ? String(value) : numberFormatter.format(parsed);
};


export const rec = {
  po: (r: PoHistoryRecord) => r.po_transaction ?? "-",
  vendorId: (r: PoHistoryRecord) => r.vendor_id ?? r.po_vendor_reg_id ?? "-",
  vendorName: (r: PoHistoryRecord) => r.vendor_name ?? "-",
  partNo: (r: PoHistoryRecord) => r.part_no ?? r.po_part_no ?? "-",
  componentName: (r: PoHistoryRecord) => r.component_name ?? "-",
  poDate: (r: PoHistoryRecord) => r.po_date ?? r.po_insert_date ?? "-",
  dueDate: (r: PoHistoryRecord) => r.duedate ?? r.po_duedate ?? "-",
  qty: (r: PoHistoryRecord) => r.qty ?? r.po_order_qty ?? "",
  pendingQty: (r: PoHistoryRecord) => r.pending_qty ?? r.po_pending_qty ?? "",
  rate: (r: PoHistoryRecord) => r.rate ?? r.po_order_rate ?? "",
  gstRate: (r: PoHistoryRecord) => r.gstrate ?? r.po_gstrate ?? "",
  hsn: (r: PoHistoryRecord) => r.hsncode ?? r.po_hsncode ?? "-",
  status: (r: PoHistoryRecord) => r.po_status ?? "",
};

/** Amber emphasis for a non-zero "pending" quantity, muted otherwise. */
export const pendingCellStyle = (value: unknown) => ({
  color: toNumber(value) > 0 ? "#d97706" : "#94a3b8",
  fontWeight: toNumber(value) > 0 ? 600 : 400,
});
