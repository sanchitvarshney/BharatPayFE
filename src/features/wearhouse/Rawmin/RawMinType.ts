import { CostCenterType } from "@/components/reusable/SelectCostCenter";
import { VendorData } from "@/components/reusable/SelectVendor";
import { Dayjs } from "dayjs";

export type DocumentFileData = {
  originalFileName: string;
  fileID: string;
};
export type CreateRawMinPayloadType = {
  vendor: string; // required
  vendorbranch: string; // required
  address: string; // required
  doc_id: string; // required
  doc_date: string; // required (assuming it's a string for date format)
  vendortype: string; // 'V0' is probably a specific type, can be more specific if needed
  invoiceAttachment: DocumentFileData[]; // required (date type)
  component: string[];
  qty: number[];
  rate: number[];
  currency: string[];
  gsttype: string[];
  gstrate: number[];
  location: string[];
  hsnCode: string[];
  remarks: string[];
  cc: string; // required
};
export type CreateRawMinResponse = {
  status: string;
  success: boolean;
  message: string;
};
export type InvoiceFileType = {
  originalFileName: string;
  fileID: string;
};

export type RawMINFormData = {
  vendorType: string;
  vendor: VendorData | null;
  vendorBranch: string;
  vendorAddress: string;
  gstin: string;
  doucmentDate: Dayjs | null;
  documentId: string;
  cc: CostCenterType | null;
};

export type RawminState = {
  documnetFileData: DocumentFileData[] | null;
  createminLoading: boolean;
  formdata: RawMINFormData | null;
};
