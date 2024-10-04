export type TrcList = {
  requestBy: string;
  txnId: string;
  txnStatus: string;
  totalDeviceL: number | string;
  insertDate: string;
  putLocation: string;
};
export type TcDetail = {
  requestedBy: string;
  txnId: string;
  location: string;
  insertDate: string;
  totalDevice: number | string;
};

type Issue = {
  text: string;
  code: string;
};

type BodyItem = {
  issue: Issue[];
  remark: string;
  device: string;
  deviceDetail: {
    imei: string;
    model: string;
  };
};

type Header = {
  txnId: string;
  comment: string;
  insertDt: string;
  requestBy: string | null;
};

type Data = {
  header: Header;
  body: BodyItem[];
};

export type TRCRequestApiResponse = {
  success: boolean;
  data: Data;
};

export type TrcListResponse = {
  data: TrcList[];
  success: boolean;
  message: string;
};
export type TrcFinalSubmitPayload = {
  txnId: string;
  putLocation: string;
  consumpItem: string[];
  consumpQty:   (string | number)[];
  remark: string[];
  itemCode: string;
};
export type TrcfinalSubmitResponse = {
  success: boolean;
  message: string;
}
export type ViewTrcState = {
  trcList: TrcList[] | null;
  getTrcListLoading: boolean;
  TRCDetail: TcDetail | null;
  trcRequestDetail: Data | null;
  getTrcRequestDetailLoading: boolean;
  TrcFinalSubmitLoading: boolean;
};
