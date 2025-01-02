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
  items: {
    component: string[];
    qty: string[];
    remark: string[];
    reference: string[];
    category: string[];
    status: string[];
  };
};
export type CreateBomResponse = {
  success: boolean;
  status: string;
  message: string;
};

type ComponentData = {
  requiredQty: string; // Quantity required (as a string)
  bomstatus: string; // Bill of Materials status (as a string)
  category: string; // Category of the component
  compKey: string; // Unique key for the component
  componentName: string; // Name of the component
  partCode: string; // Part code identifier
  componentDesc: string; // Description of the component
  unit: string; // Unit of measurement
};
type HeaderData = {
  skuCode: string; // SKU code of the product
  skukey: string; // Unique identifier for the SKU
  productName: string; // Name of the product
  subjectName: string; // Subject name related to the product
  subjectKey: string; // Unique identifier for the subject
};

export type FGBomResponse = {
  success: boolean;
  status: string;
  message: string;
  data: ComponentData[];
  header: HeaderData;
};
export type FGBomDetailResponse = {
  success: boolean;
  status: string;
  message: string;
  data: {
    data: ComponentData[];
    header: HeaderData;
  };
};

export type BOMState = {
  skuData: GetSkuDetail[] | null;
  getSkudetailLoading: boolean;
  createBomLoading: boolean;
  fgBomList: any[] | null;
  fgBomListLoading: boolean;
  changeStatusLoading: boolean;
  bomItemList: any[] | null;
  bomDetail: FGBomDetailResponse | null;
  bomDetailLoading: boolean;
  updateBomLoading: boolean;
};
