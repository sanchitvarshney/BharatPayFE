export type PoStateType = {
  data: any[];
  loading: boolean;
  error: any | null;
  managePoData: any;
  dateRange:any,
  formData:any;
  printLoading:boolean;
  cancelLoading:boolean;
  fetchPODataLoading:boolean;
  fetchPOData:any;
  completedPoData:any;
  submitPOMINLoading:boolean;
  uploadMinInvoiceLoading:boolean;
  componentPoDetailsLoading:boolean;
};

export type ComponentPoVendor = {
  vendor_id: string;
  vendor_name: string;
  vendor_branch: string;
  vendor_address: string;
  vendor_mobile: string;
  billing_address_id?: string;
  billing_address?: string;
  shipping_address_id?: string;
  shipping_address?: string;
};

export type ComponentPoLatestDetails = {
  po_transaction?: string;
  rate?: string;
  hsncode?: string;
  gsttype?: string;
  gstrate?: string;
  cgst?: string;
  sgst?: string;
  igst?: string;
  currency?: string;
  exchange?: string;
  duedate?: string;
  remark?: string;
  full_remark?: string;
  terms_condition?: string;
  quotation_detail?: string;
  payment_terms?: string;
  project_name?: string;
  /** newer responses send `vendors` (always an array); older ones `vendor` (object or array) */
  vendors?: ComponentPoVendor[];
  vendor?: ComponentPoVendor | ComponentPoVendor[];
  last_ordered_date?: string;
};

export type ComponentPoRef = {
  comp_key?: string;
  comp_name?: string;
  component_key?: string;
  component_name?: string;
};

export type ComponentPoItem = ComponentPoRef & {
  // the key/name pair may also be nested under `component`
  component?: ComponentPoRef;
  part_no?: string;
  is_enabled?: string;
  latest_po_details?: ComponentPoLatestDetails | null;
};

export type ComponentPoDetailsResponse = {
  success: boolean;
  message: string;
  data: {
    components: ComponentPoItem[];
    vendor_list?: ComponentPoVendor[];
  };
};

export type PoListResponse = {
  status: string;
  success: boolean;
  data: any[];
};
