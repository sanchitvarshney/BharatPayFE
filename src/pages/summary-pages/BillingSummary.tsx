
import { rangePresets } from "@/utils/rangePresets";
import { LoadingButton } from "@mui/lab";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { DatePicker } from "antd";
import { useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import ConfirmationModel from "@/components/reusable/ConfirmationModel";
import { showToast } from "@/utils/toasterContext";
import { MenuItem, Select } from "@mui/material";

const EXCEL_FILE_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
];

const { RangePicker } = DatePicker;

type BillingSummaryRowType = "header" | "data" | "total" | "grandTotal";

interface BillingSummaryRow {
  category: string;
  isGroupMiddle: boolean;
  rowType: BillingSummaryRowType;
  particulars: string;
  qty?: number | string;
  rate?: number | string;
  taxable?: number | string;
  gst?: number | string;
  total?: number | string;
}

interface BillingSummaryLineItem {
  particulars: string;
  qty?: number;
  rate?: number;
  taxable: number;
  gst: number;
  total: number;
}

interface BillingSummaryGroup {
  category: string;
  rows: BillingSummaryLineItem[];
}

const CATEGORY_BG = "#F2F4F7";
const HEADER_ROW_COLORS = ["#E2E8F0", "#E5E7EB", "#E5E7EB", "#F3F4F6"];

const mockBillingSummaryGroups: BillingSummaryGroup[] = [
  {
    category: "Sales Summary",
    rows: [
      {
        particulars: "Speaker",
        qty: 23670,
        rate: 90,
        taxable: 2111950,
        gst: 380151,
        total: 2492101,
      },
      {
        particulars: "Walnut",
        qty: 18430,
        rate: 24,
        taxable: 442320,
        gst: 79618,
        total: 521938,
      },
    ],
  },
  {
    category: "Logo Printing & Powder coating",
    rows: [
      {
        particulars: "Upper Shell Housing (logo printed)",
        qty: 19859,
        rate: 5.5,
        taxable: 109225,
        gst: 19660,
        total: 128885,
      },
      {
        particulars: "Upper Shell Housing (logo printed)",
        qty: 19859,
        rate: -3,
        taxable: -59577,
        gst: -10724,
        total: -70301,
      },
      {
        particulars: "QR Holder With Powder Coating",
        qty: 1249,
        rate: 9.5,
        taxable: 11866,
        gst: 2136,
        total: 14001,
      },
      {
        particulars: "Upper Shell Housing Powder Coating With Logo Printing",
        qty: 10608,
        rate: 18.25,
        taxable: 193596,
        gst: 34847,
        total: 228443,
      },
    ],
  },
  {
    category: "Component Purchase",
    rows: [
      {
        particulars: "Material Purchase in 1 to 20-Jul'26",
        qty: 411546,
        taxable: 1461483,
        gst: 198502,
        total: 1659985,
      },
      {
        particulars: "NFC TAG Provided by NPCI",
        qty: 23670,
        rate: -7,
        taxable: -165690,
        gst: -29824,
        total: -195514,
      },
    ],
  },
  {
    category: "Re-Utilization Item",
    rows: [
      {
        particulars: "QR Holder",
        qty: 17362,
        rate: 3.25,
        taxable: 56427,
        gst: 10157,
        total: 66583,
      },
      {
        particulars: "Adapter",
        qty: 12276,
        rate: 5.5,
        taxable: 67518,
        gst: 12153,
        total: 79671,
      },
      {
        particulars: "Adapter with cable",
        qty: 3,
        rate: 8.25,
        taxable: 25,
        gst: 4,
        total: 29,
      },
      {
        particulars: "PVC Plain Standee",
        rate: 4.9,
        taxable: 0,
        gst: 0,
        total: 0,
      },
      {
        particulars: "Cable",
        qty: 6,
        rate: 4.5,
        taxable: 27,
        gst: 5,
        total: 32,
      },
    ],
  },
];

const CATEGORY_ORDER = mockBillingSummaryGroups.map((group) => group.category);

const sumField = (
  rows: BillingSummaryLineItem[],
  key: "qty" | "taxable" | "gst" | "total",
): number => rows.reduce((acc, row) => acc + (Number(row[key]) || 0), 0);

const buildBillingSummaryRows = (
  groups: BillingSummaryGroup[],
): BillingSummaryRow[] => {
  const rows: BillingSummaryRow[] = [];
  groups.forEach((group) => {
    const groupSize = group.rows.length + 2; // sub-header row + line items + total row
    const middleIndex = Math.floor((groupSize - 1) / 2);
    let rowIndex = 0;

    rows.push({
      category: group.category,
      isGroupMiddle: rowIndex++ === middleIndex,
      rowType: "header",
      particulars: "Particulars",
      qty: "QTY",
      rate: "RATE",
      taxable: "Taxable",
      gst: "GST AMOUNT",
      total: "TOTAL INVOICE",
    });

    group.rows.forEach((row) => {
      rows.push({
        category: group.category,
        isGroupMiddle: rowIndex++ === middleIndex,
        rowType: "data",
        particulars: row.particulars,
        qty: row.qty,
        rate: row.rate,
        taxable: row.taxable,
        gst: row.gst,
        total: row.total,
      });
    });

    rows.push({
      category: group.category,
      isGroupMiddle: rowIndex++ === middleIndex,
      rowType: "total",
      particulars: "TOTAL",
      qty: sumField(group.rows, "qty"),
      taxable: sumField(group.rows, "taxable"),
      gst: sumField(group.rows, "gst"),
      total: sumField(group.rows, "total"),
    });
  });
  return rows;
};

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
    const idx = CATEGORY_ORDER.indexOf(data.category);
    return {
      ...base,
      backgroundColor: HEADER_ROW_COLORS[idx % HEADER_ROW_COLORS.length],
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
  const excelInputRef = useRef<HTMLInputElement>(null);

  const [isWholeData, setIsWholeData] = useState<boolean>(false);
  const [isExcelUploading, setIsExcelUploading] = useState<boolean>(false);
  // const [excelFile, setExcelFile] = useState<File | null>(null);

  const handleUploadExcelClick = () => {
    excelInputRef.current?.click();
  };

  const handleExcelFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!EXCEL_FILE_TYPES.includes(file.type)) {
      showToast("Please upload an Excel file (.xlsx or .xls)", "error");
      return;
    }
    showToast(`Selected file: ${file.name}`, "success");
  };

  const billingSummaryRows = useMemo(
    () => buildBillingSummaryRows(mockBillingSummaryGroups),
    [],
  );

  const grandTotalRow = useMemo<BillingSummaryRow>(() => {
    const totals = mockBillingSummaryGroups.map((group) => ({
      taxable: sumField(group.rows, "taxable"),
      gst: sumField(group.rows, "gst"),
      total: sumField(group.rows, "total"),
    }));
    return {
      category: "",
      isGroupMiddle: false,
      rowType: "grandTotal",
      particulars: "Grand Total",
      taxable: totals.reduce((acc, t) => acc + t.taxable, 0),
      gst: totals.reduce((acc, t) => acc + t.gst, 0),
      total: totals.reduce((acc, t) => acc + t.total, 0),
    };
  }, []);

  const billingSummaryColumnDefs = useMemo<ColDef<BillingSummaryRow>[]>(
    () => [
      {
        field: "category",
        headerName: "Category",
        width: 200,
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
        minWidth: 260,
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
      date: null,
      type: null,
      
    },
  });

  const onSubmit = () => {
    setIsWholeData(true);
    // const payload: any = {
    //   from: dayjs(data?.date[0]).format("DD-MM-YYYY"),
    //   to: dayjs(data?.date[1]).format("DD-MM-YYYY"),
    // };

    // dispatch(getWorkerReport(payload));
  };

  const handleReset = () => {
    reset({ date: null });
    setIsWholeData(false);
    setIsExcelUploading(false);
  };

  return (
    <div className="grid  w-full grid-cols-[1fr_3fr]  bg-white">
      <div className="w-full border-r border-neutral-300">
        <form onSubmit={handleSubmit(onSubmit)} className="p-[10px]">
  
          <div className="py-[0px] flex flex-col gap-[0px]">
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
                    <MenuItem value="swipemachine">Swipe Machine</MenuItem>
                  </Select>
                )}
              />
              {errors.date && (
                <span className=" text-[12px] text-red-500">
                  {/* @ts-ignore */}
                  {errors.date.message}
                </span>
              )}
            </div>
            <div>
              <label className="text-[14px] font-[500] text-slate-600 ">
                Date Range
              </label>
              <Controller
                name="date"
                control={control}
                rules={{
                  required: "Date range is required",
                }}
                render={({ field }) => (
                  <RangePicker
                    {...field}
                    placement="bottomRight"
                    className="w-full h-[50px]"
                    format="DD-MM-YYYY"
                    placeholder={["Start date", "End date"]}
                    value={field.value}
                    onChange={(dates) => field.onChange(dates)}
                    presets={rangePresets}
                  />
                )}
              />
              {errors.date && (
                <span className=" text-[12px] text-red-500">
                  {/* @ts-ignore */}
                  {errors.date.message}
                </span>
              )}
            </div>
          </div>
          <div className="h-[50px] p-0 flex items-center px-[10px] gap-[10px] justify-end">
            <LoadingButton
              loadingPosition="start"
              type="button"
              variant="outlined"
              color="error"
              onClick={handleReset}
            >
              Reset
            </LoadingButton>
            <LoadingButton
              loadingPosition="start"
              type="submit"
              variant="contained"
              disabled={isExcelUploading}
            >
              Search
            </LoadingButton>
            {isExcelUploading && (
              <LoadingButton
                loadingPosition="start"
                type="button"
                variant="outlined"
                startIcon={<UploadFileIcon />}
                onClick={handleUploadExcelClick}
              >
                Upload Excel
              </LoadingButton>
            )}

            <input
              ref={excelInputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleExcelFileChange}
            />
          </div>
        </form>
      </div>
      <div className="flex flex-col w-full min-h-0 h-[calc(100vh-100px)]">
        <div className="ag-theme-quartz billing-summary-grid flex-1 min-h-0">
          <AgGridReact
            ref={gridRef}
            suppressCellFocus={true}
            suppressMenuHide={true}
            headerHeight={0}
            rowHeight={34}
            rowData={billingSummaryRows}
            pinnedBottomRowData={[grandTotalRow]}
            columnDefs={billingSummaryColumnDefs}
            defaultColDef={{ resizable: true }}
          />
        </div>
      </div>
      <ConfirmationModel
        open={isWholeData}
        title={"Confirmation"}
        content={"If you proceed, the whole data will be generated ?"}
        onClose={() => {
          setIsWholeData(false);
        }}
        onConfirm={() => {
          setIsWholeData(false);
          setIsExcelUploading(true);
        }}
        confirmText="Yes"
        cancelText="No"
      />
    </div>
  );
};

export default BillingSummary;
