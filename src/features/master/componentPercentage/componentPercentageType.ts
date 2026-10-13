export type MasterComponentPercentageItem = {
  component_id: string;
  component: string;
  component_name: string;
  percentage?: number | string | null;
  rowId?: string;
};

export type ComponentPercentageDeviceType = "swipeMachine" | "soundbox";

export type FetchMasterComponentPercentagePayload = {
  deviceType: ComponentPercentageDeviceType;
};

export type FetchMasterComponentPercentageResponse = {
  success: boolean;
  message?: string;
  data: MasterComponentPercentageItem[];
};

export type InsertComponentPercentagePayload = {
  component: string[];
  percentage: number[];
  deviceType: string;
};

export type InsertComponentPercentageResponse = {
  success: boolean;
  message: string;
};

export type ComponentPercentageReportPayload = {
  totalDevice: number;
  deviceType: ComponentPercentageDeviceType;
  sku: string;
};

export type ComponentPercentageReportHeaderType = "number" | "string" | "percent" | "badge" | "datetime";

export type ComponentPercentageReportHeader = {
  key: string;
  label: string;
  type: ComponentPercentageReportHeaderType;
};

export type ComponentPercentageReportRefCell = {
  comp_key?: string;
  comp_name?: string;
  [key: string]: unknown;
};

export type ComponentPercentageReportCell =
  | string
  | number
  | null
  | undefined
  | ComponentPercentageReportRefCell;

export type ComponentPercentageReportItem = Record<string, ComponentPercentageReportCell>;

export type ComponentPercentageReportResponse = {
  success: boolean;
  message?: string;
  headers: ComponentPercentageReportHeader[];
  data: ComponentPercentageReportItem[];
};

export type PoHistoryFilterType = "component" | "vendor" | "both";

export type PoHistoryPayload = {
  component: string[];
  vendor: string[];
};

export type PoHistoryComponentRef = {
  component_key: string;
  part_no: string;
  component_name: string;
  is_enabled: string;
};

export type PoHistoryVendorRef = {
  vendor_id: string;
  vendor_name: string;
  vendor_mobile?: string;
  vendor_address?: string;
  email?: string;
};

/**
 * The `purchase_history` rows differ between the two responses:
 *  - component-wise uses  qty / pending_qty / rate / duedate / po_date / hsncode / gstrate / vendor_id
 *  - vendor-wise uses     po_order_qty / po_pending_qty / po_order_rate / po_duedate /
 *                         po_insert_date / po_hsncode / po_gstrate / po_vendor_reg_id
 * Every variant field is optional here; read them through the accessors in the page.
 */
export type PoHistoryRecord = {
  po_transaction: string;
  po_status: string;
  part_status?: string;
  po_part_status?: string;

  // identifiers
  po_part_no?: string;
  part_no?: string;
  component_key?: string;
  component_name?: string;
  vendor_id?: string;
  po_vendor_reg_id?: string;
  vendor_name?: string;
  vendor_branch?: string;
  po_vendor_address?: string;
  vendor_mobile?: string;

  // quantities / money
  qty?: string;
  po_order_qty?: string;
  pending_qty?: string;
  po_pending_qty?: string;
  rate?: string;
  po_order_rate?: string;
  currency?: string;
  po_currency?: string;
  exchange?: string;
  po_exchange?: string;

  // tax
  hsncode?: string;
  po_hsncode?: string;
  gsttype?: string;
  po_gsttype?: string;
  gstrate?: string;
  po_gstrate?: string;
  po_cgst?: string;
  po_sgst?: string;
  po_igst?: string;

  // dates
  duedate?: string;
  po_duedate?: string;
  po_date?: string;
  po_insert_date?: string;
  order_date?: string;
  po_full_date?: string;

  po_remark?: string;
};

export type PoHistoryGroup = {
  component?: PoHistoryComponentRef;
  vendor?: PoHistoryVendorRef;
  purchase_history: PoHistoryRecord[];
};

export type PoHistoryResponse = {
  success: boolean;
  type?: PoHistoryFilterType;
  message?: string;
  data: PoHistoryGroup[];
};

export type ComponentPercentageState = {
  components: MasterComponentPercentageItem[] | null;
  reportData: ComponentPercentageReportItem[] | null;
  reportHeaders: ComponentPercentageReportHeader[] | null;
  poHistoryData: PoHistoryGroup[] | null;
  poHistoryType: PoHistoryFilterType | null;
  poHistoryLoading: boolean;
  fetchLoading: boolean;
  insertLoading: boolean;
  reportLoading: boolean;
};
