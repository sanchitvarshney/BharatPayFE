export type CreateGPDCPayload = {
  type: string;
  name: string;
  mobile: string;
  email: string;
  address: string;
  narration: string;
fromLocation: string;
  components: string[];
  qty: number[];
  remark: string[];
};

export type GPDCChallanState = {
  createGPDCLoading: boolean;
  gpdcList: any;
  getGPDCLoading: boolean;
  gpdcDetail: any;
  getGPDCDetailLoading: boolean;
  manageGPDCData: any;
  dateRange: string | null;
  printLoading: boolean;
};
