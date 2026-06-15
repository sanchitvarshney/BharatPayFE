import { FqcImageSet } from "@/features/common/commonSlice";
import { IMAGE_VIEWS } from "./fqcDeviceImage.constants";

export type ImageViewKey = (typeof IMAGE_VIEWS)[number]["key"];

export type FqcTableRow = FqcImageSet & { dsn: string; type: string };

export type FqcSearchForm = {
  deviceType: string;
  modelNumber: string;
  serialNo: string;
};
