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
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
  };
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
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
  };
};

export type R4ReportResponse = {
  success: boolean;
  status: string;
  data: R4Report[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
  };
};

type R4Report = {
  productionLocation: string;
  dropLocation: string;
  insertBy: string | null;
  productImei: string;
  productSrlNo: string;
  prodductionId: string;
};

export type R4ReportQueryParams = {
  from?: string;
  to?: string;
  type: string;
  device?: string;
  deviceType?: string;
  page?: number;
  limit?: number;
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
  data: R5report[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
  };
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
  data: {
    data: {
      records: r6report[];
      pagination: {
        currentPage: number;
        totalPages: number;
        totalRecords: number;
      };
    }
  };
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

type R11ReportData = {
  imei: string;
  issue: string;
  resDt: string;
  resRemark: string;
  resolveStatus: string;
  serial: string;
  submitDt: string;
  submitRemark: string;
  txnID: string;
};

export type R8ReportDataApiResponse = {
  status: string;
  success: boolean;
  data: R8ReportData[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
  };
};

export type R12ReportDataApiResponse = {
  status: string;
  success: boolean;
  data: string;
  message: string;
};

export type R11ReportDataApiResponse = {
  status: string;
  success: boolean;
  data: R11ReportData[];
  totalApprove: number;
  totalPending: number;
  totalReject: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
  }
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
  inDate: string;
  issues: Issue;
}
export type R9reportResponse = {
  status: string;
  success: boolean;
  data: ProductDetails[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    recordsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: number | null;
    previousPage: number | null;
  };
};
export type ReportStateType = {
  r1Data: DocumentData | null;
  getR1DataLoading: boolean;
  getR2DataLoading: boolean;
  r2Data: R2Response | null;
  r2ReportDetail: DeviceRequestApiResponse | null;
  r2ReportDetailLoading: boolean;
  refId: string | null;
  r3report: r3reportResponse | null;
  r3reportLoading: boolean;
  r4report: R4ReportResponse | null;
  r4reportLoading: boolean;
  r4ReportDetail: r4reportDetailData | null;
  r4ReportDetailLoading: boolean;
  r5report: R5reportResponse | null;
  r5reportLoading: boolean;
  r5reportDetailLoading: boolean;
  r5reportDetail:
    | {
        slNo: string;
        insert_dt: string;
        shipLabel: string;
        shipToCity: string;
        p_name: string;
        imei: string;
        nfc_enable: string | null;
        iccid: string | null;
        qr_url: string | null;
      }[]
    | null;
  mainR1Report: any;
  mainR1ReportLoading: boolean;
  r6Report: any;
  wrongDeviceReport: any;
  r6ReportLoading: boolean;
  r8ReportLoading: boolean;
  r8Report: R8ReportDataApiResponse | null;
  r9report: R9reportResponse | null;
  r9ReportLoading: boolean;
  wrongDeviceReportLoading: boolean;
  r11ReportLoading: boolean;
  r11Report: R11ReportDataApiResponse | null;
  r12ReportLoading: boolean;
  r12Report: R12ReportDataApiResponse | null;
  r13ReportLoading: boolean;
  r13Report: R11ReportDataApiResponse | null;
  r15ReportLoading: boolean;
  r15Report: any | null;
  updatePhysicalQuantityLoading: boolean;
  r16Report: R16ReportResponse | null;
  r16ReportLoading: boolean;
  r16ReportDateRange: {
    from: string | null;
    to: string | null;
  };
  r16ReportPartner: string | null;
  r17Report: {
    data: any[];
    page: number;
    status: string;
    success: boolean;
    totalPages: number;
    totalRecords: number;
  } | null;
  getR17DataLoading: boolean;
  r17ReportDateRange: {
    from: string | null;
    to: string | null;
  };
  r17ReportPartner: string | null;
  swipeItemDetails: any | null;
  swipeItemDetailsLoading: boolean;
  transferReportLoading: boolean;
  transferReport: any | null;
  getR18DataLoading: boolean;
  r18Report: any;
  paginationDateRange: {
    from: string | null;
    to: string | null;
  };
  getR19DataLoading: boolean,
  r19Report: any,
};

export interface R16ReportResponse {
  status: string;
  success: boolean;
  page: number;
  totalPages: number;
  totalRecords: number;
  data: Array<{
    inwardLoc: string;
    partnerName: string;
    method: string;
    skuName: string;
    deviceSKU: string;
    model: string;
    serialNo: string;
    imeiNo1: string;
    imeiNo2: string;
    txnID: string;
    remark: string;
    insertDt: string;
  }>;
}
