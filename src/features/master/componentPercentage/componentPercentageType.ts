export type MasterComponentPercentageItem = {
  component_id: string;
  component: string;
  component_name: string;
  percentage?: number | string | null;
  rowId?: string;
};

export type ComponentPercentageDeviceType = "swipeMachine" | "soundbox";

export type FetchMasterComponentPercentagePayload = {
  deviceType: ComponentPercentageDeviceType;
};

export type FetchMasterComponentPercentageResponse = {
  success: boolean;
  message?: string;
  data: MasterComponentPercentageItem[];
};

export type InsertComponentPercentagePayload = {
  component: string[];
  percentage: number[];
};

export type InsertComponentPercentageResponse = {
  success: boolean;
  message: string;
};

export type ComponentPercentageReportPayload = {
  totalDevice: number;
};

export type ComponentPercentageReportHeaderType = "number" | "string" | "percent" | "badge" | "datetime";

export type ComponentPercentageReportHeader = {
  key: string;
  label: string;
  type: ComponentPercentageReportHeaderType;
};

export type ComponentPercentageReportItem = Record<string, string | number | null | undefined>;

export type ComponentPercentageReportResponse = {
  success: boolean;
  message?: string;
  headers: ComponentPercentageReportHeader[];
  data: ComponentPercentageReportItem[];
};

export type ComponentPercentageState = {
  components: MasterComponentPercentageItem[] | null;
  reportData: ComponentPercentageReportItem[] | null;
  reportHeaders: ComponentPercentageReportHeader[] | null;
  fetchLoading: boolean;
  insertLoading: boolean;
  reportLoading: boolean;
};
