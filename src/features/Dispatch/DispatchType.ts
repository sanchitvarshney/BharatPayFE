export type DispatchItemPayload = {
  docNo: string; // required
  sku: string[]; // required
  dispatchQty: number; // required
  remark?: string; // optional
  imeis: string[]; // required array of strings
  srlnos : string[];
  document: string; // required
  pickLocation: string;
  clientDetail: any;
  shipToDetails: any
};

export type DispatchState = {
  dispatchCreateLoading: boolean;
  uploadFileLoading: boolean;
  file:string|null;
  clientList: any;
  clientLoading: boolean;
  clientBranchList: any;
  clientBranchLoading: boolean;
};
