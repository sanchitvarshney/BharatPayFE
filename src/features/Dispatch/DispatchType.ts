export type DispatchItemPayload = {
  sku: string[]; // required
  dispatchQty?: number; // required
  remark?: string; // optional
  imeis: string[]; // required array of strings
  imei1?: any;
  imei2?: any;
  srlnos : string[];
  pickLocation: string;
  challanId: string;
  clientDetail: any;
  shipToDetails: any;
  dispatchDate: string;
  dispatchFromDetails: any;
  deviceType?: string;
};

export type DispatchWrongItemPayload = {
  awb: string[];
  challanId:string;
  uniqueIds: string[];
  serialNo: string[];
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
  printLoading:boolean;
  submitCustomFormLoading:boolean;
  checkBoxValidLoading: boolean;
  wrongDeviceLoading: boolean;
  wrongDeviceList: any | null;
  packagingFeedbackLoading: boolean;
  packagingFeedbackList: any[] | null;
};
