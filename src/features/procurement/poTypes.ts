export type PoStateType = {
  data: any[];
  loading: boolean;
  error: any | null;
  managePoData: any;
  dateRange:any
};

export type PoListResponse = {
  status: string;
  success: boolean;
  data: any[];
};
