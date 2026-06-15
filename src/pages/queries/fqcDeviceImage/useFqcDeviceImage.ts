import { useCallback, useMemo, useState } from "react";
import { showToast } from "@/utils/toasterContext";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getFqcDeviceImages } from "@/features/common/commonSlice";
import { createFqcColumnDefs } from "./fqcDeviceImageColumns";
import {
  flattenFqcTableRows,
  getAvailableViews,
  getImageUrl,
} from "./fqcDeviceImage.utils";
import { FqcTableRow, ImageViewKey } from "./fqcDeviceImage.types";

export const useFqcDeviceImage = () => {
  const [deviceType, setDeviceType] = useState("");
  const [modelNumber, setModelNumber] = useState("");
  const [serialNo, setSerialNo] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<FqcTableRow | null>(null);
  const [previewIdx, setPreviewIdx] = useState(0);

  const dispatch = useAppDispatch();
  const { fqcDeviceData, fqcDeviceImagesLoading, fqcDeviceImagesError } =
    useAppSelector((state) => state.common);

  const tableRows = useMemo(
    () => flattenFqcTableRows(fqcDeviceData),
    [fqcDeviceData]
  );

  const availableViews = useMemo(
    () => getAvailableViews(selectedRow),
    [selectedRow]
  );

  const currentPreviewView = availableViews[previewIdx];
  const currentPreviewUrl = currentPreviewView
    ? getImageUrl(selectedRow, currentPreviewView.key as ImageViewKey)
    : undefined;

  const resetModals = useCallback(() => {
    setViewModalOpen(false);
    setPreviewModalOpen(false);
    setSelectedRow(null);
    setPreviewIdx(0);
  }, []);

  const handleView = useCallback((row: FqcTableRow) => {
    setSelectedRow(row);
    setViewModalOpen(true);
  }, []);

  const handleImageClick = useCallback((idx: number) => {
    setPreviewIdx(idx);
    setPreviewModalOpen(true);
  }, []);

  const handlePrevPreview = useCallback(() => {
    if (!availableViews.length) return;
    setPreviewIdx((idx) =>
      idx === 0 ? availableViews.length - 1 : idx - 1
    );
  }, [availableViews.length]);

  const handleNextPreview = useCallback(() => {
    if (!availableViews.length) return;
    setPreviewIdx((idx) =>
      idx === availableViews.length - 1 ? 0 : idx + 1
    );
  }, [availableViews.length]);

  const columnDefs = useMemo(
    () => createFqcColumnDefs(handleView),
    [handleView]
  );

  const handleSearch = useCallback(() => {
    if (!deviceType || !serialNo) {
      showToast("Please enter Device Type and Serial Number", "error");
      return;
    }
    if (deviceType === "swipe" && !modelNumber) {
      showToast("Please enter Model for Swipe Machine", "error");
      return;
    }

    resetModals();
    dispatch(
      getFqcDeviceImages({
        module: deviceType === "swipe" ? "swipe" : "sound",
        dsn: serialNo,
        model: deviceType === "swipe" ? modelNumber : undefined,
      })
    );
  }, [deviceType, serialNo, modelNumber, dispatch, resetModals]);

  return {
    deviceType,
    setDeviceType,
    modelNumber,
    setModelNumber,
    serialNo,
    setSerialNo,
    viewModalOpen,
    setViewModalOpen,
    previewModalOpen,
    setPreviewModalOpen,
    selectedRow,
    previewIdx,
    tableRows,
    availableViews,
    currentPreviewView,
    currentPreviewUrl,
    fqcDeviceImagesLoading,
    fqcDeviceImagesError,
    columnDefs,
    handleSearch,
    handleImageClick,
    handlePrevPreview,
    handleNextPreview,
  };
};
