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

export type R1ApiResponse = {
  status: string;
  success: boolean;
  data: R1DataItem[];
};

export type ReportStateType ={
  r1Data:R1DataItem[]|null;
  getR1DataLoading:boolean;
}