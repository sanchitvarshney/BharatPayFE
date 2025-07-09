export type DispatchItemPayload = {
  sku: string[]; // required
  dispatchQty?: number; // required
  remark?: string; // optional
  imeis: string[]; // required array of strings
  imei1?: any;
  imei2?: any;
  srlnos : string[];
  pickLocation: string;
  clientDetail?: any;
  shipToDetails?: any;
  dispatchDate?: string;
  dispatchFromDetails?: any;
  challanId: string;
  deviceType?: string;
};

export type DispatchWrongItemPayload = {
  awb: string[];
  challanId:string;
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
  challanList: any;
  getChallanLoading: boolean;
  createChallanLoading: boolean;
  updateChallanLoading:boolean;
  branchLoading:boolean;
  branchList:any;
  rejectTransferLoading:boolean;
};
