export type DispatchItemPayload = {
  customer: string; // required
  docNo: string; // required
  sku: string; // required
  dispatchQty: number; // required
  remark?: string; // optional
  deviceId: string[]; // required array of strings
  document: string; // required
  pickLocation: string;
};

export type DispatchState = {
  dispatchCreateLoading: boolean;
  uploadFileLoading: boolean;
  file:string|null
};
