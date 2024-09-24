export type Location = {
  id: string;
  text: string;
};
export type LocationApiresponse = {
  success: boolean;
  data: Location[];
  status: string;
};

type VendoAddressData = {
  address: string;
  gstid: string;
  state: string;
  country: string;
  einvoice_status: string;
};
export type VendorAddressApiResponse = {
  success: boolean;
  message: string;
  data: VendoAddressData;
};
export type UploadFileData = {
  fileName: string;
  fileReference: string;
};
export type UploadSerialFileResponse = {
  success: boolean;
  message: string;
  data: UploadFileData;
};

export type InvoiceFileData = {
  originalFileName: string;
  fileID: string;
};

export type UploadInvoiceFileApiResponse = {
  success: boolean;
  message: string;
  data: InvoiceFileData[];
};

type OptionType = {
  value: string;
  label: string;
};
export type Step1Form = {
  vendorType: OptionType | null;
  vendor: OptionType | null;
  vendorBranch: OptionType | null;
  vendorAddress: string;
  sku: OptionType | null;
  location: OptionType | null;
  qty: string;
  docDate: string;
  unit: string;
  docId: string;
  docType: OptionType | null;
};
interface UomDetail {
  product_name: string;
  product_sku: string;
  unit: string;
  hsn: string;
  gstrate: string;
  rate: string;
}

export interface UomApiResponse {
  success: boolean;
  code: number;
  status: string;
  data: UomDetail;
}

export type CheckSerialResponse = {
  success: boolean;
  status: string;
  message: string;
};
export type CheckSerialPayload = {
  fileref: string;
  serials: string;
};

export type CreateMinPayload = {
  vendorBranch: string;
  vendorCode: string;
  vendorType: string;
  invoiceAttachment: InvoiceFileData[];
  fileReference: string;
  vendorAddress: string;
  location: string;
  minQty: string;
  itemCode: string;
  unit: string;
  docId: string;
  docDate: string;
  docType: string;
};

export type CreateMinData = {
  min_no: string;
  fileReference: string;
};
export type CreateMinResponse = {
  success: boolean;
  status: string;
  message: string;
  data: CreateMinData;
};



export type UpateMINpayload = {
  simExist:string;
  serial:string;
  fileReference:string;
  min_no:string;
  remarks:string;
  IMEI:string;
  deviceModel:string;
}

export type UpdateMinData = {
  total_remaining:string;
  totalItems:string;
  totalScanned:string;
  total_additional:string;
}
export type UpdateMinResponse = {
  success: boolean;
  status: string;
  message: string;
  data:UpdateMinData
}

export type DeviceStatusResponse = {
  status: string;
  success: boolean;
  data: {
    headerData: {
      min_id: string;
      vendorCode: string;
      vendorName: string;
      vendorAddress: string;
      location: string;
      deviceName: string;
      sku: string;
      qty: number;
      unit: string;
      remark: string;
      totalScanned: number;
      totalItems: number;
      total_remaining: number;
      deviceModel: string;
      
    };
    serialData: {
      slNo: string;
      simExist: string;
      deviceStatus: string;
      remark: string;
      imei: string;
    }[];
  };
};

export type DeviceMinSate = {
  getLocationLoading: boolean;
  locationData: Location[] | null;
  getVendorLoading: boolean;
  VendorData: Location[] | null;
  getVendorBranchLoading: boolean;
  VendorBranchData: Location[] | null;
  venderaddressloading: boolean;
  venderaddressdata: VendoAddressData | null;
  uploadSerialFileLoading: boolean;
  serialFiledata: UploadFileData | null;
  uploadInvoiceFileLoading: boolean;
  invociceFiledata: InvoiceFileData[] | null;
  skuLoading: boolean;
  skuData: Location[] | null;
  getUomLoading: boolean;
  UomData: UomDetail | null;
  checkSerialLoading: boolean;
  checkserialData: CheckSerialResponse | null;
  createMinLoading: boolean;
  createMinData: CreateMinData | null;
  updateMinLoading:boolean;
  getAllsubmitinfoLoading:boolean;
  getAllSubminInfo:DeviceStatusResponse |  null
  finaSubmitLoading:boolean;
  updateMinData:UpdateMinData | null
  min_no:string | null
  //stores==========================
  storeStep1formData: Step1Form | null;
  storeInvoiceFiles: InvoiceFileData[] | null;
  storeSerialFiles: UploadFileData | null;
  storeDraftMinData:CreateMinData | null
};
