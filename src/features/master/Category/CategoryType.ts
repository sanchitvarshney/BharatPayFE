export type CategoryListApiResponse = {
  success: boolean;
  data: CategoryList[];
};

type CategoryList = {
  name: string;
  catId: string;
};

export type CategoryState = {
  categoryList: CategoryList[];
  subCategoryList: CategoryList[];
  getCategoryLoading: boolean;
  createCategoryLoading: boolean;
  createSubCategoryLoading: boolean;
  getSubCategoryLoading: boolean;
}