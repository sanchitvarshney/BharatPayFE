import { useCallback, useState } from "react";
import { DatePicker } from "antd";
import { LoadingButton } from "@mui/lab";
import { Alert, IconButton, MenuItem, Select } from "@mui/material";
import { FileRejection, useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { rangePresets } from "@/utils/rangePresets";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { showToast } from "@/utils/toasterContext";
import ConfirmationModel from "@/components/reusable/ConfirmationModel";
import DateRangeBadge from "@/components/reusable/DateRangeBadge";
import {
  getSwipeSummaryReport,
  resetSwipeBilling,
  setSwipeDateRange,
  setSwipeIsData,
} from "@/features/swipeBilling/swipeBillingSlice";
import { useSocketContext } from "@/components/context/SocketContext";
import useSwipeDateRange from "./useSwipeDateRange";

const { RangePicker } = DatePicker;

export const SWIPE_SUMMARY_LIMIT = 500;

const MAX_EXCEL_SIZE_MB = 10;
const ALLOWED_EXCEL_EXTENSIONS = [".xlsx", ".xls", ".csv"];

/** Returns an error message, or "" if the file is a valid Excel file. */
const validateExcelFile = (file: File): string => {
  const name = file.name.toLowerCase();
  if (!ALLOWED_EXCEL_EXTENSIONS.some((ext) => name.endsWith(ext))) {
    return "Only .xls, .xlsx or .csv files are allowed";
  }
  if (file.size === 0) {
    return "The selected file is empty";
  }
  if (file.size > MAX_EXCEL_SIZE_MB * 1024 * 1024) {
    return `File size must be less than ${MAX_EXCEL_SIZE_MB} MB`;
  }
  return "";
};

const readFileAsBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve((reader.result as string)?.split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const SwipeBillingSummary = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { dateRange, range } = useSwipeDateRange();
  const isData = useAppSelector((state) => state.swipeBilling.isData);
  const summaryReportLoading = useAppSelector(
    (state) => state.swipeBilling.summaryReportLoading,
  );
  const [dateError, setDateError] = useState("");
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const { isConnected, emitDownloadSwipeBillingReport } = useSocketContext();
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [downloading, setDownloading] = useState(false);

  const onExcelDrop = useCallback(
    (acceptedFiles: File[], rejections: FileRejection[]) => {
      if (rejections.length > 0) {
        setUploadFile(null);
        setFileError("Only a single .xls, .xlsx or .csv file is allowed");
        return;
      }
      const file = acceptedFiles[0];
      if (!file) return;
      const error = validateExcelFile(file);
      if (error) {
        setUploadFile(null);
        setFileError(error);
        showToast(error, "error");
        return;
      }
      setFileError("");
      setUploadFile(file);
    },
    [],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onExcelDrop,
    multiple: false,
    disabled: downloading,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls", ".csv"],
      "text/csv": [".csv"],
    },
  });

  const handleRemoveUploadFile = () => {
    setUploadFile(null);
    setFileError("");
  };

  const handleDownload = async () => {
    if (!range) {
      setDateError("Date range is required");
      return;
    }
    if (!isConnected) {
      showToast("Socket not connected. Please try again.", "error");
      return;
    }
    if (uploadFile) {
      const error = validateExcelFile(uploadFile);
      if (error) {
        setFileError(error);
        showToast(error, "error");
        return;
      }
    }
    setDateError("");

    setDownloading(true);
    try {
      const fileBase64 = uploadFile ? await readFileAsBase64(uploadFile) : "";
      emitDownloadSwipeBillingReport({
        fromDate: range.from,
        toDate: range.to,
        fileBase64,
      });
      showToast("Download started", "success");
    } catch {
      showToast("Failed to read the uploaded file", "error");
    } finally {
      setDownloading(false);
    }
  };

  const handleSearch = async () => {
    if (!range) {
      setDateError("Date range is required");
      return;
    }
    setDateError("");

    try {
      const response = await dispatch(
        getSwipeSummaryReport({
          from: range.from,
          to: range.to,
          page: 1,
          limit: SWIPE_SUMMARY_LIMIT,
        }),
      ).unwrap();

      if (response?.data?.success) {
        showToast(
          response?.data?.message || "Data fetched successfully",
          "success",
        );
        dispatch(setSwipeIsData(true));
      } else {
        showToast(response?.data?.message || "Failed to fetch data", "error");
        dispatch(setSwipeIsData(false));
      }
    } catch (error: any) {
      showToast(error?.message || "Failed to fetch data", "error");
      dispatch(setSwipeIsData(false));
    }
  };

  const handleConfirmReset = () => {
    setDateError("");
    setUploadFile(null);
    setFileError("");
    dispatch(resetSwipeBilling());
    setResetConfirmOpen(false);
  };

  return (
    <div className="grid w-full h-full grid-cols-[320px_3fr] bg-white">
      <div className="w-full border-r border-neutral-300 overflow-y-auto">
        <div className="p-[10px] flex flex-col gap-[10px]">
          <div>
            <label className="text-[14px] font-[500] text-slate-600">
              Device Type
            </label>
            <Select fullWidth value="swipemachine" disabled>
              <MenuItem value="swipemachine">Swipe Machine</MenuItem>
            </Select>
          </div>
          <div>
            <label className="text-[14px] font-[500] text-slate-600">
              Date Range
            </label>
            <RangePicker
              placement="bottomRight"
              className="w-full h-[50px]"
              format="DD-MM-YYYY"
              placeholder={["Start date", "End date"]}
              value={dateRange}
              disabled={isData}
              onChange={(dates) => {
                dispatch(setSwipeDateRange(dates));
                dispatch(setSwipeIsData(false));
                if (dates && dates[0] && dates[1]) {
                  setDateError("");
                }
              }}
              presets={rangePresets}
            />
            {dateError && (
              <span className="text-[12px] text-red-500">{dateError}</span>
            )}
          </div>
          <div className="h-[50px] flex items-center gap-[10px] justify-end">
            <LoadingButton
              type="button"
              variant="outlined"
              color="error"
              onClick={() => setResetConfirmOpen(true)}
              sx={{ minWidth: "100px" }}
            >
              Reset
            </LoadingButton>
            <LoadingButton
              type="button"
              variant="contained"
              loading={summaryReportLoading}
              loadingPosition="center"
              disabled={isData}
              onClick={handleSearch}
              sx={{ minWidth: "100px" }}
            >
              Search
            </LoadingButton>
          </div>
        </div>

        {/* Upload excel */}
        <div className="border-t border-neutral-200 p-[10px] flex flex-col gap-[10px]">
          <label className="text-[14px] font-[500] text-slate-600">
            Upload Excel
          </label>

          <Alert
            severity="warning"
            sx={{ fontSize: "12px", py: 0.5, fontWeight: 600 }}
          >
            If you want to get hold device bill you have to upload excel file
            before downloading the report.
          </Alert>

          <div
            {...getRootProps()}
            className={`flex flex-col items-center justify-center gap-1 border-2 border-dashed rounded-md px-3 py-6 text-center transition-colors ${
              downloading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
            } ${
              isDragActive
                ? "bg-blue-50 border-blue-400"
                : fileError
                  ? "border-red-400"
                  : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            <input {...getInputProps()} />
            <CloudUploadIcon fontSize="medium" color="primary" />
            <span className="text-[13px] text-gray-600">
              {isDragActive
                ? "Drop Excel file here"
                : "Drag & drop or click to upload Excel"}
            </span>
            <span className="text-[11px] text-gray-400">
              Supports .xls, .xlsx, .csv (max {MAX_EXCEL_SIZE_MB} MB)
            </span>
          </div>
          {fileError && (
            <span className="text-[12px] text-red-500">{fileError}</span>
          )}

          {uploadFile && (
            <div className="flex items-center justify-between gap-2 border border-gray-200 rounded-md px-3 py-2 bg-gray-50">
              <div className="flex items-center gap-2 min-w-0">
                <InsertDriveFileIcon fontSize="small" color="action" />
                <span className="truncate text-[13px] text-gray-700">
                  {uploadFile.name}
                </span>
              </div>
              <IconButton
                size="small"
                disabled={downloading}
                onClick={handleRemoveUploadFile}
              >
                <DeleteIcon fontSize="small" color="error" />
              </IconButton>
            </div>
          )}

          <LoadingButton
            type="button"
            variant="contained"
            fullWidth
            loading={downloading}
            loadingPosition="center"
            disabled={!range || !isConnected}
            onClick={handleDownload}
          >
            Download Full Report
          </LoadingButton>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-3 p-6">
        {isData ? (
          <>
            <DateRangeBadge dateRange={dateRange} />
            <Alert severity="success" sx={{ fontWeight: 500 }}>
              Swipe billing data is ready. Open the tabs above to review the
              summary, SKU consumption, dispatch and purchase.
            </Alert>
            <LoadingButton
              variant="outlined"
              onClick={() => navigate("/swipe-billing/summary")}
            >
              Go to Summary
            </LoadingButton>
          </>
        ) : (
          <Alert severity="info" sx={{ fontWeight: 500 }}>
            Select a date range and click Search to load swipe billing data.
          </Alert>
        )}
      </div>

      <ConfirmationModel
        open={resetConfirmOpen}
        onClose={() => setResetConfirmOpen(false)}
        onConfirm={handleConfirmReset}
        title="Reset all data?"
        content="This will clear the date range and all swipe billing results. Do you want to continue?"
        cancelText="No"
        confirmText="Yes"
      />
    </div>
  );
};

export default SwipeBillingSummary;
