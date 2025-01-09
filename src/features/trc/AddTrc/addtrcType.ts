export type AddtrcPayloadType = {
  sku: string;
  pickLocation: string;
  putLocation: string;
  comment: string;
  remark: string[];
  issue: string[][];
  device: string[];
  cc: string;
};

export type AddtrcResponse = {
  success: boolean;
  message: string;
};

export type AddTrcState = {
  addTrcLoading: boolean;
};
