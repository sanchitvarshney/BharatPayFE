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
    const [filterBy, setFilterBy] = useState("DATE");
   const [deviceTypeReport, setDeviceTypeReport] = useState("sound");
  const [serialNo, setSerialNo] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<FqcTableRow | null>(null);
  const [previewIdx, setPreviewIdx] = useState(0);
  const [dateRange, setDateRange] = useState<{
    from: Dayjs | null;
    to: Dayjs | null;
  }>({ from: null, to: null });
   const [dateRangeFilter, setDateRangeFilter] = useState<{
    from: Dayjs | null;
    to: Dayjs | null;
  }>({ from: null, to: null });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const dispatch = useAppDispatch();
  const { emitFqcDeviceImageDownload, isConnected } = useSocketContext();
  const {
    fqcDeviceData,
    fqcDeviceImagesLoading,
    fqcDeviceImagesError,
    fqcPagination,
  } = useAppSelector((state) => state.common);

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

  const fetchImages = useCallback(
    (pageToFetch: number, limitToFetch: number) => {
      dispatch(
        getFqcDeviceImages({
          module: deviceType === "swipe" ? "swipe" : "sound",
          dsn: serialNo,
          dateRange: dateRangeFilter,
          type: filterBy,
          page: pageToFetch,
          limit: limitToFetch,
        })
      );
    },
    [deviceType, serialNo, dateRangeFilter, filterBy, dispatch]
  );

  const handleSearch = useCallback(() => {
    if(filterBy !== "DATE" && !serialNo){
      showToast("Please enter Serial Number", "error");
      return
    } if((!dateRangeFilter.from || !dateRangeFilter.to ) && filterBy === "DATE"){
      showToast("Please select date range", "error");
      return
    }
    resetModals();
    setPage(1);
    fetchImages(1, limit);
  }, [filterBy, serialNo, dateRangeFilter, limit, resetModals, fetchImages]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      fetchImages(newPage, limit);
    },
    [limit, fetchImages]
  );

  const handleLimitChange = useCallback(
    (newLimit: number) => {
      setLimit(newLimit);
      setPage(1);
      fetchImages(1, newLimit);
    },
    [fetchImages]
  );

  const handleBulkDownload = useCallback(() => {
    if (!dateRange.from || !dateRange.to) {
      showToast("Please select date range", "error");
      return;
    }
    emitFqcDeviceImageDownload({
      type: "DATE",
      fromDate: dayjs(dateRange.from).format("DD-MM-YYYY"),
      toDate: dayjs(dateRange.to).format("DD-MM-YYYY"),
      module: deviceTypeReport === "swipe" ? "swipe" : "sound",
    });
  }, [dateRange, deviceType, emitFqcDeviceImageDownload]);

  return {
    deviceType,
    setDeviceType,
    filterBy,
    setFilterBy,
    deviceTypeReport,
    setDeviceTypeReport,
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
    dateRangeFilter,
    setDateRangeFilter,
    isConnected,
    handleBulkDownload,
    page,
    limit,
    fqcPagination,
    handlePageChange,
    handleLimitChange,
  };
};
