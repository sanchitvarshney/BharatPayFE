export type CreateProductionPayload = {
  sku: string; // SKU, required
  slNo: string; // Serial Number, required
  imeiNo: string; // IMEI Number, required
  productionLocation: string; // Production Location, required
  dropLocation: string; // Drop Location, required
  itemKey: string[]; // Array of strings for item keys, required
  issueQty: string[]; // Array of strings for issue quantities, required
  remark: string[]; // Array of strings for remarks, required
};
export type CommonResponse = {
  status: string;
  success: boolean;
  message: string;
};
export type GenerateMasterWrPayload = {
  skuId: string;
  lotSize: number;
  deviceModel: string;
  srlno: string[];
};

type LotList = {
  refId: string;
  lotId: string;
  deviceModel: string;
  skuId: string;
  lotSize: string;
  srlno: string;
  boxNo: string;
  insertDate: string;
  insertBy: string;
};
export type LotListResponse = {
  data: LotList[];
  status: string;
};

export type ManageProductionState = {
  getlotListLoading: boolean;
  lotListData: LotList[] | null;
};
