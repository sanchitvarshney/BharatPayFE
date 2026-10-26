import dayjs from "dayjs";
import { IMAGE_VIEWS } from "@/pages/queries/fqcDeviceImage/fqcDeviceImage.constants";
import { DeviceApprovalItem, DeviceNextAction } from "@/features/deviceDefect/deviceDefectSlice";

export type DevicePhotoView = {
  key: string;
  label: string;
  url: string;
};

const DEVICE_TYPE_LABEL: Record<string, string> = {
  swipe: "Swipe Machine",
  sound: "Sound Box",
};


export const formatServerDateTime = (value?: string | null) => {
  if (!value) return "--";
  const date = dayjs(value.replace(/(\.\d+)?Z$/i, ""));
  return date.isValid() ? date.format("DD MMM YYYY, hh:mm A") : value;
};

// "next" step chosen by approver (required on reject, optional on approve)
export const DEVICE_ACTIONS: { value: DeviceNextAction; label: string }[] = [
  { value: "scrap", label: "Scrap" },
  { value: "repair", label: "Repair" },
];


export const getDeviceTypeLabel = (value?: string | null) =>
  DEVICE_TYPE_LABEL[value?.toLowerCase() ?? ""] || value || "--";


const toLabel = (key: string) =>
  key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (c) => c.toUpperCase());


export const getDevicePhotos = (device?: DeviceApprovalItem | null): DevicePhotoView[] => {
  const photos = device?.photos ?? {};
  const knownKeys: string[] = IMAGE_VIEWS.map((view) => view.key);
  const orderedKeys = [...knownKeys, ...Object.keys(photos).filter((key) => !knownKeys.includes(key))];

  return orderedKeys
    .map((key) => ({
      key,
      label: IMAGE_VIEWS.find((view) => view.key === key)?.label ?? toLabel(key),
      url: photos[key]?.url || photos[key]?.presigned_url || "",
    }))
    .filter((photo) => photo.url);
};
