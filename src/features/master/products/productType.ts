export type Products = {
  p_name: string;
  p_sku: string;
  units_name: string;
  product_key: string;
};

export type createProductdata = {
  p_name: string;
  p_sku: string;
  units_id: string;
};

export type ProductsApiResponse = {
  success: boolean;
  data: Products[];
};

export type ProductState = {
  products: Products[] | [];
  getProductsLoading: boolean;
  createProductLoading: boolean;
};
