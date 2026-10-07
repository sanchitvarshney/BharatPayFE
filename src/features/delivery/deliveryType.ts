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

export interface DeliveryState {
  isSubmitting: boolean;
  submitError: string | null;
}
