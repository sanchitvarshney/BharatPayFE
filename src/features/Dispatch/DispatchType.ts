export type DispatchItemPayload = {
  docNo: string; // required
  sku: string[]; // required
  dispatchQty: number; // required
  remark?: string; // optional
  imeis: string[]; // required array of strings
  imei1?: any;
  imei2?: any;
  srlnos : string[];
  document: string; // required
  pickLocation: string;
  clientDetail: any;
  shipToDetails: any;
  dispatchDate: string;
  dispatchFromDetails: any;
  deviceType?: string;
};

export type DispatchWrongItemPayload = {
  docNo: string; // required
  dispatchQty: number; // required
  remark?: string; // optional
  awb: string[];
  document: string;
  clientDetail: any;
  shipToDetails: any;
  dispatchDate: string;
};

export type DispatchState = {
  dispatchCreateLoading: boolean;
  uploadFileLoading: boolean;
  file:string|null;
  clientList: any;
  clientLoading: boolean;
  clientBranchList: any;
  clientBranchLoading: boolean;
  wrongDispatchLoading: boolean;
  dispatchData: any;
  dispatchDataLoading: boolean;
  ewayBillDataLoading: boolean;
  stateCodeLoading: boolean;
  stateCode: any;
  branchLoading:boolean;
  branchList:any;
  rejectTransferLoading:boolean;
};
