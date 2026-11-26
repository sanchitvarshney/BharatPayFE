import { useCallback, useState } from "react";
import { DatePicker } from "antd";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Chip,
  IconButton,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import { FileRejection, useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { rangePresets } from "@/utils/rangePresets";
import { useAppDispatch } from "@/hooks/useReduxHook";
import { showToast } from "@/utils/toasterContext";
import { setSwipeDateRange } from "@/features/swipeBilling/swipeBillingSlice";
import { useSocketContext } from "@/components/context/SocketContext";
import useSwipeDateRange from "./useSwipeDateRange";

const { RangePicker } = DatePicker;

export const SWIPE_SUMMARY_LIMIT = 500;

const ACCENT = "#0891b2"; // Tailwind cyan-600
const ACCENT_HOVER = "#0e7490"; // Tailwind cyan-700

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

const formatFileSize = (bytes: number): string =>
  bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

const StepTitle = ({
  step,
  title,
  optional,
}: {
  step: number;
  title: string;
  optional?: boolean;
}) => (
  <div className="flex items-center gap-2">
    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-600 text-white text-[12px] font-[600]">
      {step}
    </span>
    <span className="text-[14px] font-[600] text-slate-700">{title}</span>
    {optional && (
      <span className="text-[11px] font-[500] text-slate-500 bg-neutral-100 rounded px-1.5 py-0.5">
        Optional
      </span>
    )}
  </div>
);

const SwipeBillingSummary = () => {
  const dispatch = useAppDispatch();
  const { dateRange, range } = useSwipeDateRange();
  const [dateError, setDateError] = useState("");
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

  return (
    <div className="w-full h-full overflow-y-auto bg-neutral-50 flex justify-center items-start sm:items-center p-4 sm:p-6">
      <div className="w-full max-w-[560px] bg-white mt-20 border border-neutral-200 rounded-xl shadow-sm">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-6 py-5 border-b border-neutral-200">
          <div className="flex items-start gap-3">
          
            <div>
              <h2 className="text-[17px] font-[600] text-slate-800 leading-tight">
                Swipe Billing Report
              </h2>
              <p className="text-[13px] text-slate-500 mt-1">
                Choose a date range and download the full billing report.
              </p>
            </div>
          </div>
          <Chip
            size="small"
            variant="outlined"
            color={isConnected ? "success" : "error"}
            icon={<FiberManualRecordIcon sx={{ fontSize: 10 }} />}
            label={isConnected ? "Connected" : "Offline"}
            sx={{ fontWeight: 500, flexShrink: 0 }}
          />
        </div>

        <div className="px-6 py-5 flex flex-col gap-6">
          {/* Step 1 */}
          <section className="flex flex-col gap-3">
            <StepTitle step={1} title="Report details" />

            <div className="flex flex-col gap-1">
              <label className="text-[13px] font-[500] text-slate-600">
                Device Type
              </label>
              <Select fullWidth size="small" value="swipemachine" disabled>
                <MenuItem value="swipemachine">Swipe Machine</MenuItem>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[13px] font-[500] text-slate-600">
                Date Range <span className="text-red-500">*</span>
              </label>
              <RangePicker
                placement="bottomLeft"
                className="w-full h-[42px]"
                format="DD-MM-YYYY"
                placeholder={["Start date", "End date"]}
                value={dateRange}
                status={dateError ? "error" : undefined}
                onChange={(dates) => {
                  dispatch(setSwipeDateRange(dates));
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
          </section>

          {/* Step 2 */}
          <section className="flex flex-col gap-3">
            <StepTitle step={2} title="Upload Excel" optional />

            <Alert
              severity="warning"
              sx={{ fontSize: "12px", py: 0.25, fontWeight: 500 }}
            >
              To include the hold device bill, upload the Excel file before
              downloading the report.
            </Alert>

            {uploadFile ? (
              <div className="flex items-center justify-between gap-2 border border-green-200 rounded-lg px-3 py-3 bg-green-50">
                <div className="flex items-center gap-3 min-w-0">
                  <InsertDriveFileIcon color="success" />
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-[500] text-slate-700">
                      {uploadFile.name}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {formatFileSize(uploadFile.size)}
                    </p>
                  </div>
                </div>
                <Tooltip title="Remove file">
                  <span>
                    <IconButton
                      size="small"
                      disabled={downloading}
                      onClick={handleRemoveUploadFile}
                    >
                      <DeleteIcon fontSize="small" color="error" />
                    </IconButton>
                  </span>
                </Tooltip>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={`flex flex-col items-center justify-center gap-1 border-2 border-dashed rounded-lg px-3 py-7 text-center transition-colors ${
                  downloading
                    ? "opacity-60 cursor-not-allowed"
                    : "cursor-pointer"
                } ${
                  isDragActive
                    ? "bg-cyan-50 border-cyan-400"
                    : fileError
                      ? "border-red-400 bg-red-50/40"
                      : "border-gray-300 hover:border-cyan-300 hover:bg-cyan-50/40"
                }`}
              >
                <input {...getInputProps()} />
                <CloudUploadIcon fontSize="large" sx={{ color: ACCENT }} />
                <span className="text-[13px] text-slate-700 font-[500]">
                  {isDragActive ? (
                    "Drop the Excel file here"
                  ) : (
                    <>
                      Drag & drop or{" "}
                      <span className="text-cyan-600 underline">browse</span>
                    </>
                  )}
                </span>
                <span className="text-[11px] text-slate-400">
                  .xls, .xlsx or .csv · max {MAX_EXCEL_SIZE_MB} MB
                </span>
              </div>
            )}
            {fileError && (
              <span className="text-[12px] text-red-500">{fileError}</span>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50 rounded-b-xl flex flex-col gap-2">
          <LoadingButton
            type="button"
            variant="contained"
            size="large"
            fullWidth
            loading={downloading}
            loadingPosition="start"
            startIcon={<DownloadIcon />}
            disabled={!range || !isConnected}
            sx={{
              bgcolor: ACCENT,
              "&:hover": { bgcolor: ACCENT_HOVER },
            }}
            onClick={handleDownload}
          >
            Download Full Report
          </LoadingButton>
          {(!range || !isConnected) && (
            <span className="text-[12px] text-slate-500 text-center">
              {!isConnected
                ? "Waiting for the server connection…"
                : "Select a date range to enable the download."}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SwipeBillingSummary;
