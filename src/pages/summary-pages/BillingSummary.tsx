import { rangePresets } from "@/utils/rangePresets";
import { LoadingButton } from "@mui/lab";
import { ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { DatePicker } from "antd";

import { useCallback, useMemo, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Alert, IconButton, MenuItem, Select } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getBillingSummary,
  setDateRange,
  setIsData,
  setTrcMode,
  resetBillingSummary,
  uploadHoldPartConsumptionTRC,
  uploadHoldPartConsumptionAssembly,
} from "@/features/summarySlice/billingSlices";
import { useAppSelector } from "@/hooks/useReduxHook";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { showToast } from "@/utils/toasterContext";
import ConfirmationModel from "@/components/reusable/ConfirmationModel";
import { useSocketContext } from "@/components/context/SocketContext";
import { Icons } from "@/components/icons";
import MuiTooltip from "@/components/reusable/MuiTooltip";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const BlankHeader = () => null;

type BillingSummaryRowType = "header" | "data" | "total" | "grandTotal";

interface BillingSummaryRow {
  category: string;
  categoryIndex: number;
  isGroupMiddle: boolean;
  rowType: BillingSummaryRowType;
  particulars: string;
  qty?: number | string;
  rate?: number | string;
  taxable?: number | string;
  gst?: number | string;
  total?: number | string;
}

interface BillingSummaryApiItem {
  particulars: string;
  department?: string;
  qty: number;
  rate: number;
  taxable: number;
  gst_amount: number;
  total_invoice: number;
}

interface BillingSummaryApiSection {
  items: BillingSummaryApiItem[];
  total: {
    qty?: number;
    taxable: number;
    gst_amount: number;
    total_invoice: number;
  };
}

interface BillingSummaryApiResponse {
  success: boolean;
  sales_summary: BillingSummaryApiSection;
  categories: (BillingSummaryApiSection & { category_name: string })[];
  grand_total: {
    taxable: number;
    gst_amount: number;
    total_invoice: number;
  };
}

const CATEGORY_BG = "#F2F4F7";
const HEADER_ROW_COLORS = ["#E2E8F0", "#E5E7EB", "#E5E7EB", "#F3F4F6"];

const buildBillingSummaryRows = (
  apiResponse: BillingSummaryApiResponse | null,
): BillingSummaryRow[] => {
  if (!apiResponse) return [];

  const sections: { name: string; section: BillingSummaryApiSection }[] = [
    { name: "Sales Summary", section: apiResponse.sales_summary },
    ...apiResponse.categories.map((category) => ({
      name: category.category_name,
      section: category,
    })),
  ];

  const rows: BillingSummaryRow[] = [];

  sections.forEach(({ name, section }, categoryIndex) => {
    const groupSize = section.items.length + 2; // sub-header row + line items + total row
    const middleIndex = Math.floor((groupSize - 1) / 2);
    let rowIndex = 0;

    rows.push({
      category: name,
      categoryIndex,
      isGroupMiddle: rowIndex++ === middleIndex,
      rowType: "header",
      particulars: "Particulars",
      qty: "QTY",
      rate: "RATE",
      taxable: "Taxable",
      gst: "GST AMOUNT",
      total: "TOTAL INVOICE",
    });

    section.items.forEach((item) => {
      rows.push({
        category: name,
        categoryIndex,
        isGroupMiddle: rowIndex++ === middleIndex,
        rowType: "data",
        particulars: item.particulars,
        qty: item.qty,
        rate: item.rate,
        taxable: item.taxable,
        gst: item.gst_amount,
        total: item.total_invoice,
      });
    });

    rows.push({
      category: name,
      categoryIndex,
      isGroupMiddle: rowIndex++ === middleIndex,
      rowType: "total",
      particulars: "TOTAL",
      qty: section.total.qty,
      taxable: section.total.taxable,
      gst: section.total.gst_amount,
      total: section.total.total_invoice,
    });
  });

  return rows;
};

const buildGrandTotalRow = (
  apiResponse: BillingSummaryApiResponse | null,
): BillingSummaryRow => ({
  category: "",
  categoryIndex: -1,
  isGroupMiddle: false,
  rowType: "grandTotal",
  particulars: "Grand Total",
  taxable: apiResponse?.grand_total?.taxable ?? 0,
  gst: apiResponse?.grand_total?.gst_amount ?? 0,
  total: apiResponse?.grand_total?.total_invoice ?? 0,
});

const formatNumber = (value: unknown): string => {
  const n = Number(value);
  if (!Number.isFinite(n)) return typeof value === "string" ? value : "";
  return n.toLocaleString("en-IN");
};

const formatCurrency = (value: unknown): string => {
  if (value === undefined || value === null || value === "") return "";
  const n = Number(value);
  if (!Number.isFinite(n)) return typeof value === "string" ? value : "";
  const sign = n < 0 ? "-" : "";
  return `${sign}₹ ${Math.abs(n).toLocaleString("en-IN")}`;
};

const billingSummaryCellStyle = (
  data: BillingSummaryRow | undefined,
  align: "left" | "right",
): Record<string, string | number> => {
  const base: Record<string, string | number> = {
    display: "flex",
    alignItems: "center",
    justifyContent: align === "right" ? "flex-end" : "flex-start",
  };
  if (!data) return base;
  if (data.rowType === "header") {
    return {
      ...base,
      backgroundColor:
        HEADER_ROW_COLORS[data.categoryIndex % HEADER_ROW_COLORS.length],
      fontWeight: 600,
    };
  }
  if (data.rowType === "total") {
    return { ...base, fontWeight: 700 };
  }
  if (data.rowType === "grandTotal") {
    return { ...base, fontWeight: 700, backgroundColor: "#ffff00" };
  }
  return base;
};

const BillingSummary = () => {
  const gridRef = useRef(null);
  const dispatch: any = useDispatch();
  const { isConnected, emitDownloadBillingSummaryReport } = useSocketContext();
  const [dateError, setDateError] = useState<string>("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [downloading, setDownloading] = useState(false);
  const dateRange = useAppSelector((state) => state.summary?.dateRange);
  const billingSummaryData = useAppSelector(
    (state) => state.summary?.billingSummaryData,
  );
  const billingSummaryLoading = useAppSelector(
    (state) => state.summary?.billingSummaryLoading,
  );
  const isData = useAppSelector((state) => state.summary?.isData);
  const holdLoading = useAppSelector((state) => state.summary?.holdLoading);
  const holdAssemblyLoading = useAppSelector(
    (state) => state.summary?.holdAssemblyLoading,
  );
  const uploadLoading = holdLoading || holdAssemblyLoading;

  const billingSummaryRows = useMemo(
    () => buildBillingSummaryRows(billingSummaryData),
    [billingSummaryData],
  );

  const grandTotalRow = useMemo<BillingSummaryRow>(
    () => buildGrandTotalRow(billingSummaryData),
    [billingSummaryData],
  );

  const billingSummaryColumnDefs = useMemo<ColDef<BillingSummaryRow>[]>(
    () => [
      {
        field: "category",
        headerName: "Category",
        width: 180,
        pinned: "left",
        suppressMovable: true,
        sortable: false,
        filter: false,
        colSpan: (params) => (params.data?.rowType === "grandTotal" ? 4 : 1),
        valueGetter: (params) =>
          params.data?.rowType === "grandTotal"
            ? params.data.category
            : params.data?.isGroupMiddle
              ? params.data.category
              : "",
        cellStyle: {
          backgroundColor: CATEGORY_BG,
          fontWeight: 700,
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          whiteSpace: "normal",
          lineHeight: 1.3,
        },
      },
      {
        field: "particulars",
        headerName: "Particulars",
        flex: 1,
        sortable: false,
        filter: false,
        cellStyle: (params) => billingSummaryCellStyle(params.data, "left"),
      },
      {
        field: "qty",
        headerName: "QTY",
        width: 120,
        sortable: false,
        filter: false,
        valueFormatter: (params) =>
          typeof params.value === "string"
            ? params.value
            : formatNumber(params.value),
        cellStyle: (params) => ({
          ...billingSummaryCellStyle(params.data, "right"),
          ...(params.data?.rowType === "total"
            ? { color: "#1155cc", textDecoration: "underline" }
            : {}),
        }),
      },
      {
        field: "rate",
        headerName: "RATE",
        width: 110,
        sortable: false,
        filter: false,
        valueFormatter: (params) =>
          typeof params.value === "string"
            ? params.value
            : formatCurrency(params.value),
        cellStyle: (params) => billingSummaryCellStyle(params.data, "right"),
      },
      {
        field: "taxable",
        headerName: "Taxable",
        width: 150,
        sortable: false,
        filter: false,
        valueFormatter: (params) =>
          typeof params.value === "string"
            ? params.value
            : formatCurrency(params.value),
        cellStyle: (params) => billingSummaryCellStyle(params.data, "right"),
      },
      {
        field: "gst",
        headerName: "GST Amount",
        width: 150,
        sortable: false,
        filter: false,
        valueFormatter: (params) =>
          typeof params.value === "string"
            ? params.value
            : formatCurrency(params.value),
        cellStyle: (params) => billingSummaryCellStyle(params.data, "right"),
      },
      {
        field: "total",
        headerName: "Total Invoice",
        width: 160,
        sortable: false,
        pinned: "right",
        filter: false,
        valueFormatter: (params) =>
          typeof params.value === "string"
            ? params.value
            : formatCurrency(params.value),
        cellStyle: (params) => billingSummaryCellStyle(params.data, "right"),
      },
    ],
    [],
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      type: "soundbox",
    },
  });

  const onSubmit = async () => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) {
      setDateError("Date range is required");
      return;
    }
    setDateError("");

    const billSearch = new FormData();

    billSearch.append("file", uploadFile ?? "");
    billSearch.append("fromDate", dayjs(dateRange[0]).format("DD-MM-YYYY"));
    billSearch.append("toDate", dayjs(dateRange[1]).format("DD-MM-YYYY"));
    await dispatch(getBillingSummary(billSearch)).unwrap();

    dispatch(setIsData(true));
  };

  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const handleReset = () => {
    setResetConfirmOpen(true);
  };

  const handleConfirmReset = () => {
    reset({ type: "soundbox" });
    setUploadFile(null);
    setDateError("");
    dispatch(resetBillingSummary());
    setResetConfirmOpen(false);
  };

  const onExcelDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onExcelDrop,
    multiple: false,
    disabled: uploadLoading || isData,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
  });

  const handleRemoveUploadFile = () => {
    setUploadFile(null);
  };

  const handleUpload = async () => {
    if (!uploadFile) return;
    if (dateRange?.length !== 2) {
      showToast("Please select date range", "error");
      return;
    }

    const trcFormData = new FormData();
    trcFormData.append("file", uploadFile);
    const assemblyFormData = new FormData();
    assemblyFormData.append("file", uploadFile);

    const [trcRes, assemblyRes] = await Promise.all([
      dispatch(uploadHoldPartConsumptionTRC(trcFormData)),
      dispatch(uploadHoldPartConsumptionAssembly(assemblyFormData)),
    ]);

    const trcSuccess = trcRes?.payload?.data?.success;
    const assemblySuccess = assemblyRes?.payload?.data?.success;

    if (trcSuccess && assemblySuccess) {
      showToast("Data generated successfully", "success");
    } else if (trcSuccess || assemblySuccess) {
      showToast(
        "Some data could not be generated. Please check and try again.",
        "warning",
      );
    } else {
      showToast(
        trcRes?.payload || assemblyRes?.payload || "Upload failed",
        "error",
      );
    }
  };

  const handleDownloadReport = () => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) {
      showToast("Please select date range", "error");
      return;
    }

    setDownloading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const fileBase64 = (reader.result as string)?.split(",")[1] ?? "";
      emitDownloadBillingSummaryReport({
        fromDate: dayjs(dateRange[0]).format("DD-MM-YYYY"),
        toDate: dayjs(dateRange[1]).format("DD-MM-YYYY"),
        fileBase64,
      });
      showToast("Download started", "success");
      setDownloading(false);
    };
    reader.onerror = () => {
      showToast("Failed to read the uploaded file", "error");
      setDownloading(false);
    };
    reader.readAsDataURL(uploadFile ?? new Blob());
  };

  return (
    <div className="grid  w-full grid-cols-[320px_3fr]  bg-white">
      <div className="w-full border-r border-neutral-300">
        <form onSubmit={handleSubmit(onSubmit)} className="p-[10px]">
          <div className="py-[0px] flex flex-col gap-[10px]">
            <div>
              <label className="text-[14px] font-[500] text-slate-600 ">
                Device Type
              </label>
              <Controller
                name="type"
                control={control}
                rules={{
                  required: "Device type is required",
                }}
                render={({ field }) => (
                  <Select
                    fullWidth
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isData}
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgb(203 213 225)",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgb(148 163 184)",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgb(14 116 144)",
                      },
                    }}
                  >
                    <MenuItem value="soundbox">Sound Box</MenuItem>
                    {/* <MenuItem value="swipemachine">Swipe Machine</MenuItem> */}
                  </Select>
                )}
              />
              {errors.type && (
                <span className=" text-[12px] text-red-500">
                  {/* @ts-ignore */}
                  {errors.type.message}
                </span>
              )}
            </div>
            <div>
              <label className="text-[14px] font-[500] text-slate-600 ">
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
                  dispatch(setDateRange(dates));
                  dispatch(setTrcMode("trc"));
                  dispatch(setIsData(false));
                  if (dates && dates[0] && dates[1]) {
                    setDateError("");
                  }
                }}
                presets={rangePresets}
              />
              {dateError && (
                <span className=" text-[12px] text-red-500">{dateError}</span>
              )}
            </div>
          </div>
          <div className="h-[50px] p-0 flex items-center px-[0px] gap-[10px] justify-end">
            <MuiTooltip title="Download Report" placement="top">
              <span className="mr-auto">
                <IconButton
                  onClick={handleDownloadReport}
                  disabled={!isConnected || downloading}
                  sx={{
                    border: "1px solid rgb(203 213 225)",
                    borderRadius: "4px",
                  }}
                >
                  <Icons.download fontSize="small" />
                </IconButton>
              </span>
            </MuiTooltip>
            <LoadingButton
              loadingPosition="start"
              type="button"
              variant="outlined"
              color="error"
              onClick={handleReset}
              sx={{
                minWidth: "100px",
              }}
            >
              Reset
            </LoadingButton>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={billingSummaryLoading}
              loadingPosition="center"
              disabled={isData}
              sx={{
                minWidth: "100px",
              }}
            >
              Search
            </LoadingButton>
          </div>
        </form>

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
            before billing.
          </Alert>

          <div
            {...getRootProps()}
            className={`flex flex-col items-center justify-center gap-1 border-2 border-dashed rounded-md px-3 py-6 text-center transition-colors ${
              uploadLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
            } ${
              isDragActive
                ? "bg-blue-50 border-blue-400"
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
              Supports .xls, .xlsx
            </span>
          </div>

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
                disabled={uploadLoading || isData}
                onClick={handleRemoveUploadFile}
              >
                <DeleteIcon fontSize="small" color="error" />
              </IconButton>
            </div>
          )}

          <LoadingButton
            type="button"
            fullWidth
            variant="contained"
            disabled={!uploadFile || isData}
            loading={uploadLoading}
            loadingPosition="center"
            onClick={handleUpload}
          >
            Upload
          </LoadingButton>
        </div>
      </div>
      <div className="flex flex-col w-full min-h-0 h-[calc(100vh-100px)]">
        <div className="ag-theme-quartz billing-summary-grid flex-1 min-h-0">
          <AgGridReact
            ref={gridRef}
            suppressCellFocus={true}
            suppressMenuHide={true}
            headerHeight={12}
            className="header-bg"
            rowHeight={34}
            loading={billingSummaryLoading}
            loadingOverlayComponent={CustomLoadingOverlay}
            overlayNoRowsTemplate={OverlayNoRowsTemplate}
            rowData={billingSummaryRows}
            pinnedBottomRowData={billingSummaryData ? [grandTotalRow] : []}
            columnDefs={billingSummaryColumnDefs}
            defaultColDef={{ resizable: true, headerComponent: BlankHeader }}
          />
        </div>
      </div>
      <ConfirmationModel
        open={resetConfirmOpen}
        onClose={() => setResetConfirmOpen(false)}
        onConfirm={handleConfirmReset}
        title="Reset all data?"
        content="This will clear the device type, date range and search results. Do you want to continue?"
        cancelText="No"
        confirmText="Yes"
      />
    </div>
  );
};

export default BillingSummary;
