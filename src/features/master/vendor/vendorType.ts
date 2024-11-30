type Vendor = {
  vendor_code: string;
  vendor_name: string;
  vendor_pan: string;
  vendor_gst: string;
  vendor_status: string;
};

export type VendorResponse = {
  success: boolean;
  data: Vendor[];
  message: string | null;
};
export type VendorData = {
  vendorname: string;
  panno: string;
  eInvoice: "Y" | "N";
  msme_status: "Y" | "N";
  msme_year: string;
  msme_id: string;
  msme_type: string;
  msme_activity: string;
  dateOfApplicability: string;
  term_days: string;
  cinno: string;
  gstin: string;
  state: string;
  city: string;
  address: string;
  pincode: string;
  mobile: string;
  email: string;
  files: string[];
  documentName:string[]
};

export type Branch = {
  branch: string;
  state: string;
  city: string;
  address: string;
  pincode: string;
  mobile: string;
  gstin: string;
};

export type VendorCreatePayload = {
  vendor: VendorData;
  branch: Branch;
};

export type VendorState = {
  getvendorLoading: boolean;
  vendor: Vendor[] | null;
  createVendorLoading: boolean;
  files: string[] | null;
  uploadfileloading: boolean;
};
