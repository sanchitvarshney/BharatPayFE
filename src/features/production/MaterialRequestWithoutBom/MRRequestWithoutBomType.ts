export type PartCodeData = {
  id: string;
  text: string;
  part_code: string;
  material_code: string;
  specification: string;
  unit: string;
};

export type PartCodeDataresponse = {
  data: PartCodeData[];
  status: string;
  message: string;
  success: boolean;
};
export type SkuCodeData = {
  id: string;
  text: string;
  skuCode: string;
  unit: string;
};

export type SkuCodeDataresponse = {
  data: SkuCodeData[];
  status: string;
  success: boolean;
};

export type CreateProductRequestType = {
  reqType: string;
  putLocation: string;
  itemKey: string[];
  picLocation: string[];
  qty: string[];
  remark: string[];
  comment: string;
};
export type CreateProductRequestResponse = {
  status: string;
  message: string;
  success: boolean;
};
export type LocationData = {
  text: string;
  id: string;
  specification: string;
};
export type LocationApiresponse = {
  data: LocationData[];
  status: string;
  success: boolean;
};

export type MrRequestWithoutBom = {
  getPartCodeLoading: boolean;
  partCodeData: PartCodeData[] | null;
  getSkuLoading: boolean;
  skuCodeData: SkuCodeData[] | null;
  type: string;
  createProductRequestLoading: boolean;
  locationData: LocationData[] | null;
  getLocationDataLoading: boolean;
  craeteRequestData:CreateProductRequestResponse|null
  
};
