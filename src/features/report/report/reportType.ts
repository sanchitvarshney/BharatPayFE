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
  partNo: string | null;
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
export type DeviceRequestApiResponse = {
  data: Devices[];
  status: string; // "success"
};

type r3report = {
  imeiNo: string;
  ir: string;
  volt: string;
  remark: string;
  insertDate: string;
};

export type r3reportResponse = {
  success: boolean;
  code: number;
  status: string;
  data: r3report[];
};

export type R4ReportResponse = {
  success: boolean;
  status: string;
  data: R4Report[];
};

type R4Report = {
  productionLocation: string;
  dropLocation: string;
  insertBy: string | null;
  productImei: string;
  productSrlNo: string;
  prodductionId: string;
};

export type r4reportDetailDataResponse = {
  success: boolean;
  status: string;
  data: r4reportDetailData;
};
export type r4reportDetailData = {
  productionData: {
    productionLocation: string;
    dropLocation: string;
    insertDate: string;
    insertBy: string | null;
    productImei: string;
    productSrlNo: string;
    prodductionId: string;
  };
  itemDetail: Array<{
    partNo: string;
    name: string;
    qty: number;
    location: string;
  }>;
};

type R5report = {
  txnId: string;
  sku: string;
  skuName: string;
  dispatchId: string;
  dispatchDate: string; // If needed, this can be converted to `Date` when processing.
  dispatchQty: string; // You can convert to `number` if required.
  docNo: string;
  inserby: string | null; // Nullable field
};

export type R5reportResponse = {
  status: string;
  success: boolean;
  data: R5report[]; // Array of dispatch records
};

type MainR1Report = {
  minNo: string;
  insertDt: string;
  skuCode: string;
  skuName: string;
  uom: string;
  inLoc: string;
  vendorName: string | null;
  vendorCode: string | null;
  vendorAddress: string | null;
  docType: string;
  docNo: string;
  docDate: string;
};
export type MainR1ReportResponse = {
  status: string;
  success: boolean;
  data: MainR1Report[];
};

export type r6report = {
  txnId: string;
  partCode: string;
  componentName: string;
  uom: string;
  qty: number;
  location: string;
  rate: string;
  hsn: string;
  vendorCode: string;
  vendorName: string;
  vendorAddress: string;
  insertDt: string; // Consider converting this to `Date` if you're handling it as a date object.
  insertby: string;
  subCategory: string;
  category: string;
};

export type r6reportApiResponse = {
  success: boolean;
  data: r6report[];
};

type R8ReportData = {
  txnId: string;
  partCode: string;
  componentName: string;
  category: string | null;
  subCategory: string | null;
  uom: string;
  outQty: number;
  locFrom: string;
  locIn: string;
  reqBy: string;
  insertDt: string;
  approvedBy: string;
};

export type R8ReportDataApiResponse = {
  status: string;
  success: boolean;
  data: R8ReportData[];
};

interface Issue {
  "Device ID": string;
  Charger: string;
  SIM: string;
  "Sound Check - OK": string;
  Bracket: string;
  "No Physical Damage": string;
  "No Internal Damage": string;
  Box: string;
  Standee: string;
  Adaptor: string;
  Cable: string;
}

interface ProductDetails {
  vendorCode: string;
  vendorName: string;
  vendorAddress: string;
  awbNo: string;
  serial: string;
  imei: string;
  quantity: string;
  product: string;
  totalDebit: string;
  issues: Issue;
}
export type R9reportResponse = {
  status: string;
  success: boolean;
  data: ProductDetails[];
};
export type ReportStateType = {
  r1Data: DocumentData | null;
  getR1DataLoading: boolean;
  getR2DataLoading: boolean;
  r2Data: R2ReportData[] | null;
  r2ReportDetail: DeviceRequestApiResponse | null;
  r2ReportDetailLoading: boolean;
  refId: string | null;
  r3report: r3report[] | null;
  r3reportLoading: boolean;
  r4report: R4Report[] | null;
  r4reportLoading: boolean;
  r4ReportDetail: r4reportDetailData | null;
  r4ReportDetailLoading: boolean;
  r5report: R5report[] | null;
  r5reportLoading: boolean;
  r5reportDetailLoading: boolean;
  r5reportDetail: { slNo: string }[] | null;
  mainR1Report: MainR1Report[] | null;
  mainR1ReportLoading: boolean;
  r6Report: r6report[] | null;
  wrongDeviceReport:any|null;
  r6ReportLoading: boolean;
  r8ReportLoading: boolean;
  r8Report: R8ReportData[] | null;
  r9report: ProductDetails[] | null;
  r9ReportLoading: boolean;
  wrongDeviceReportLoading: boolean;
};
