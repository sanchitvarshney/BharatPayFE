import { useCallback, useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { showToast } from "@/utils/toasterContext";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getFqcDeviceImages } from "@/features/common/commonSlice";
import { useSocketContext } from "@/components/context/SocketContext";
import { createFqcColumnDefs } from "./fqcDeviceImageColumns";
import {
  flattenFqcTableRows,
  getAvailableViews,
  getImageUrl,
} from "./fqcDeviceImage.utils";
import { FqcTableRow, ImageViewKey } from "./fqcDeviceImage.types";

export const useFqcDeviceImage = () => {
  const [deviceType, setDeviceType] = useState("sound");
  const [serialNo, setSerialNo] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<FqcTableRow | null>(null);
  const [previewIdx, setPreviewIdx] = useState(0);
  const [dateRange, setDateRange] = useState<{
    from: Dayjs | null;
    to: Dayjs | null;
  }>({ from: null, to: null });

  const dispatch = useAppDispatch();
  const { emitFqcDeviceImageDownload, isConnected } = useSocketContext();
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
    resetModals();
    dispatch(
      getFqcDeviceImages({
        module: deviceType === "swipe" ? "swipe" : "sound",
        dsn: serialNo,
      })
    );
  }, [deviceType, serialNo, dispatch, resetModals]);

  const handleBulkDownload = useCallback(() => {
    if (!dateRange.from || !dateRange.to) {
      showToast("Please select date range", "error");
      return;
    }
    emitFqcDeviceImageDownload({
      type: "DATE",
      fromDate: dayjs(dateRange.from).format("DD-MM-YYYY"),
      toDate: dayjs(dateRange.to).format("DD-MM-YYYY"),
      module: deviceType === "swipe" ? "swipe" : "sound",
    });
  }, [dateRange, deviceType, emitFqcDeviceImageDownload]);

  return {
    deviceType,
    setDeviceType,
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
    dateRange,
    setDateRange,
    isConnected,
    handleBulkDownload,
  };
};
