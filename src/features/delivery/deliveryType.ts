import type { AxiosProgressEvent } from "axios";

export interface DeliverySubmitResponse {
  success?: boolean;
  message?: unknown;
  status?: string;
  data?: unknown;
}

export interface SubmitDeliveryPayload {
  awb: string;
  deliveryPartner: string;
  remark: string;
  video: File;
  onUploadProgress?: (event: AxiosProgressEvent) => void;
}

export interface CourierReturnRow {
  id: number;
  unique_key: string;
  awb: string;
  deliveryPartner: string;
  remark: string;
  videoKey: string;
  insertedBy: string;
  insertDate: string;
}

export interface CourierReturnReportPayload {
  from: string; // DD-MM-YYYY
  to: string; // DD-MM-YYYY
  deliveryPartner?: string;
}

export interface CourierReturnReportResponse {
  success?: boolean;
  message?: unknown;
  data?: CourierReturnRow[];
}

export interface DeliveryState {
  isSubmitting: boolean;
  submitError: string | null;
  courierReturnList: CourierReturnRow[] | null;
  courierReturnLoading: boolean;
}
