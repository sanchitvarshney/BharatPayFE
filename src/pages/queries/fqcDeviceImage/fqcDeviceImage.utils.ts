import { FqcDeviceRecord, FqcImageSet } from "@/features/common/commonSlice";
import { IMAGE_VIEWS } from "./fqcDeviceImage.constants";
import { FqcTableRow, ImageViewKey } from "./fqcDeviceImage.types";

export const flattenFqcTableRows = (
  records: FqcDeviceRecord[] | null
): FqcTableRow[] =>
  records?.flatMap((record) =>
    (record.images ?? []).map((image) => ({
      ...image,
      dsn: record.dsn,
      type: record.type,
    }))
  ) ?? [];

export const getAvailableViews = (imageSet?: FqcImageSet | null) =>
  IMAGE_VIEWS.filter((view) => imageSet?.[view.key as ImageViewKey]?.location);

export const getImageUrl = (
  imageSet: FqcImageSet | null | undefined,
  key: ImageViewKey
) => imageSet?.[key]?.location;
