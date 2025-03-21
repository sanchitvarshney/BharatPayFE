type DeviceData = {
  sl_no: string;
  device_imei: string;
  device_model: string;
};

export type DeviceApiResponse = {
  success: boolean;
  data: DeviceData[];
};
export type bateryqcSavePayload = {
  slNo: string[];
  imeiNo: string[];
  ir: string[];
  volt: string[];
  remark: string[];
  batteryID: string[];
  status: string;
  newVolt?: string[];
  newIR?: string[];
};


export type BatteryQcState = {
  deviceDetailLoading: boolean;
  deviceDetailData: DeviceData | null;
  batteryQcSaveLoading: boolean;
  venStoneDeviceDetailLoading: boolean;
  venStoneDeviceDetail: DeviceData | null;
};
