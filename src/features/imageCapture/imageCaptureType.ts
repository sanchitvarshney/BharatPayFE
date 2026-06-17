export interface CapturePhotoResponse {
  success: boolean;
  message?: string;
  status?: string;
  data?: unknown;
}

export interface CapturePhotoCheckResponse {
  success: boolean;
  message?: string;
  status?: string;
  data?: {
    type?: string;
  };
}

export interface SaveCapturePhotosPayload {
  type: string;
  serialNo: string;
  images: Record<string, string>;
}

export interface EditCapturePhotosPayload {
  module: string;
  dsn: string;
  images: Record<string, string>;
}

export interface ImageCaptureState {
  isSaving: boolean;
  isEditing: boolean;
  isChecking: boolean;
  saveError: string | null;
  editError: string | null;
  checkError: string | null;
}
