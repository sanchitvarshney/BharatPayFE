export type PoStateType = {
  data: any[];
  loading: boolean;
  error: any | null;
  managePoData: any;
  dateRange:any,
  formData:any;
  printLoading:boolean;
  cancelLoading:boolean;
  fetchPODataLoading:boolean;
  fetchPOData:any;
  completedPoData:any;
};

export type PoListResponse = {
  status: string;
  success: boolean;
  data: any[];
};
