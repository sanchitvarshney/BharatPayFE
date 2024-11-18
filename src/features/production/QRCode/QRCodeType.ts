export type CreateProductionPayload = {
  sku: string; // SKU, required
  slNo: string; // Serial Number, required
  imeiNo: string; // IMEI Number, required
  productionLocation: string; // Production Location, required
  dropLocation: string; // Drop Location, required
  itemKey: string[]; // Array of strings for item keys, required
  issueQty: string[]; // Array of strings for issue quantities, required
  remark: string[]; // Array of strings for remarks, required
}
export type CommonResponse ={
  status: string;
  success: boolean;
  message: string;
}
export type ManageProductionState = {
  createProductionLaoding: boolean;
}