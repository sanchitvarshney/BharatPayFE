export type AddtrcPayloadType = {
  // sku: string;
  pickLocation: string;
  putLocation: string;
  comment: string;
  srlNo: string[];
  imeiNo: string[];
  issue: string[][];
  remark?: string[];
  cc: string;
};

export type AddtrcToStorePayloadType = {
  sku: string;
  pickLocation: string;
  putLocation: string;
  comment: string;
  srlNo: string[];
  imeiNo: string[];
  remark: string[];
  cc: string;
};
export type AddtrcResponse = {
  success: boolean;
  message: string;
};

export type AddTrcState = {
  addTrcLoading: boolean;
};
