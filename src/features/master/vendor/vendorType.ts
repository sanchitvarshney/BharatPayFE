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
  documentName: string[];
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

export type VendorBarnchResponse = {
  success: boolean;
  data: VendorBarnch;
};

type VendorBarnch = {
  vendor: {
    name: string;
    code: string;
    cinNo: string;
    gstin: string;
    panNo: string;
    email: string;
    mobile: string;
    paymentinDays: string;
    invoiceStatus: string;
    docName: string[]; // Array of strings
    file: string[]; // Array of strings
  };
  branch: Array<{
    code: string;
    branch: string;
    state: {
      state: string;
      name: string;
    };
    city: string;
    address: string;
    pincode: string;
    mobile: string;
    email: string;
    fax: string;
    gstin: string;
  }>;
};
export type UpadteVendorBranchPayload = {
  code: string;
  vendor_code: string;
  label: string;
  state: string;
  city: string;
  address: string;
  pincode: string;
  mobile: string;
  gstid: string;
  email: string;
};
export type VendorState = {
  getvendorLoading: boolean;
  vendor: Vendor[] | null;
  createVendorLoading: boolean;
  files: string[] | null;
  uploadfileloading: boolean;
  vendorDetail: VendorBarnch | null;
  getVendorDetailLoading: boolean;
  updateVendorBranchLoading: boolean;
};
