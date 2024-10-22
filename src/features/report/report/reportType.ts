export type R1DataItem = {
  insertDt: string;
  skuCode: string;
  skuName: string;
  serialNo: string;
  imei: string;
  simAvailiblity: string;
  uom: string;
  inQty: number;
  inLoc: string;
  vendorName: string;
  vendorCode: string;
  docType: string;
  docId: string;
  minNo: string;
  insertBy: string;
};

type DocumentHead = {
  insertDt: string;
  skuCode: string;
  skuName: string;
  uom: string;
  inLoc: string;
  vendorName: string;
  vendorCode: string;
  vendorAddress: string;
  docType: string;
  docNo: string;
  docDate: string;
};

type DocumentBody = {
  serialNo: string;
  imei: string;
  simAvailability: string;
  model: string;
};

type DocumentData = {
  head: DocumentHead;
  body: DocumentBody[];
};

export type R1ApiResponse = {
  status: string;
  success: boolean;
  data: DocumentData;
};

export type R2ReportData = {
  requestBy: string;
  refId: string;
  device: string;
  status: string;
  insertDate: string;
  totalDevice: number | string;
  putLocation: string;
  pickLocation: string;
};

export type R2Response = {
  status: string;
  success: boolean;
  data: R2ReportData[];
};

// Type for Device Issue
export type DeviceIssue = {
  issueCode: string;
  issueLabel: string;
  partNo: string | null; // partNo can be null
  name: string | null; // name can be null
  qty: number | null; // qty can be null
  remark: string | null; // remark can be null
};

// Type for Device
export type Devices = {
  refId: string;
  device: string;
  pickLocation: string;
  putLocation: string;
  insertDate: string; // Format: "DD-MM-YYYY HH:mm:ss AM/PM"
  status: string;
  deviceModel: string;
  deviceIssues: DeviceIssue[];
};

// Type for API Response
export type  DeviceRequestApiResponse =  {
  data: Devices[];
  status: string; // "success"
}

export type ReportStateType = {
  r1Data: DocumentData | null;
  getR1DataLoading: boolean;
  getR2DataLoading: boolean;
  r2Data: R2ReportData[] | null;
  r2ReportDetail:DeviceRequestApiResponse|null
  r2ReportDetailLoading:boolean
  refId:string|null

};
