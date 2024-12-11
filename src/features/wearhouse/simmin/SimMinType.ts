export type MINInformationResponse = {
  success: boolean;
  status: string;
  message: string;
  data: MinInfo;
};

type MinInfo = {
  headerInfo: {
    vendorName: string;
    vendorCode: string;
    vendorBranch: string;
    txnId: string;
    txnDt: string;
    timeAgo: string;
    docId: string;
    docDate: string;
  };
  partList: {
    componentName: string;
    componentkey: string;
    partNo: string;
    quantity: number;
    unit: string;
    hsn: string;
  }[];
};
export type CreateSimMINPayload = {
  txnID: string;
  component: string;
  sr_no: string[];
  remarks: string[];
};

export type SimMinStateType = {
  minInfo: MinInfo | null;
  getMinInfoLoading: boolean;
  createSimMinLoading: boolean;
};
