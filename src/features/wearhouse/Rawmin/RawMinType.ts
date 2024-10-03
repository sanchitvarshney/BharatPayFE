
export type DocumentFileData = {
  originalFileName: string;
  fileID: string;
};
export type CreateRawMinPayloadType = {
  vendor: string;  // required
  vendorbranch: string;  // required
  address: string;  // required
  doc_id: string;  // required
  doc_date: string;  // required (assuming it's a string for date format)
  vendortype: string;  // 'V0' is probably a specific type, can be more specific if needed
  invoiceAttachment: DocumentFileData[];  // required (date type)
  component: string[];
  qty: number[];
  rate: number[];
  currency: string[];
  gsttype: string[];
  gstrate: number[];
  location: string[];
  hsnCode: string[];
  remarks: string[];
}
export type CreateRawMinResponse = {
  status: string;
  success: boolean;
  message: string;
}

export type RawminState = {
  documnetFileData:DocumentFileData[] | null
  createminLoading:boolean
}