import { CostCenterType } from "@/components/reusable/SelectCostCenter";
import { LocationType } from "@/components/reusable/SelectLocationAcordingModule";
import { DeviceType } from "@/components/reusable/SelectSku";
import { VendorData } from "@/components/reusable/SelectVendor";
import { Dayjs } from "dayjs";

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

export type Step1Form = {
  vendorType: string;
  vendor: VendorData | null;
  vendorBranch: string;
  vendorAddress: string;
  sku: DeviceType | null;
  location: LocationType | null;
  qty: string;
  docDate: Dayjs | null;
  unit: string;
  docId: string;
  docType: string;
  cc: CostCenterType | null;
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
  fileReference?: string;
  vendorAddress: string;
  location: string;
  minQty: string;
  itemCode: string;
  unit: string;
  docId: string;
  docDate: string;
  docType: string;
  cc: string;
  srlNo?: string[];
  sim_exist?:string[];
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
  simExist: string;
  serial: string;
  fileReference: string;
  min_no: string;
  remark: string;
  IMEI: string;
  deviceModel: string;
};

export type UpdateMinData = {
  total_remaining: string;
  totalItems: string;
  totalScanned: string;
  total_additional: string;
};
export type UpdateMinResponse = {
  success: boolean;
  status: string;
  message: string;
  data: UpdateMinData;
};

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
export type NotExistSerialNo = {
  remarks: string;
  isNew?: boolean;
  id: number;
  simAvailability: string;
  serialno: string;
  IMEI: string;
  model: string;
  isAvailble: boolean;
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
  updateMinLoading: boolean;
  getAllsubmitinfoLoading: boolean;
  getAllSubminInfo: DeviceStatusResponse | null;
  finaSubmitLoading: boolean;
  updateMinData: UpdateMinData | null;
  min_no: string | null;
  //stores==========================
  storeStep1formData: Step1Form | null;
  storeInvoiceFiles: InvoiceFileData[] | null;
  storeSerialFiles: UploadFileData | null;
  storeDraftMinData: CreateMinData | null;
  notExistsr: NotExistSerialNo[] | null;
};
