export type GetSkuDetail = {
  id: string;
  text: string;
};
export type GetSkudetailResponse = {
  data: GetSkuDetail[];
  success: boolean;
  status: string;
  message: string;
};
export type CreateBomPayload = {
  subject: string;
  type: string;
  sku: string;
  remark?: string;
  items:{
    component: string[];
    qty: string[];
  }
}
export type CreateBomResponse = {
  success: boolean;
  status: string;
  message: string;
}
export type BOMState = {
  skuData:GetSkuDetail[]|null;
  getSkudetailLoading: boolean;
  createBomLoading: boolean;
}