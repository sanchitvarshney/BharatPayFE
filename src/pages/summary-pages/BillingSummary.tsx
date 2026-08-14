import { rangePresets } from "@/utils/rangePresets";
import { LoadingButton } from "@mui/lab";
import { ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { DatePicker } from "antd";

import { useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { MenuItem, Select } from "@mui/material";
import {
  getBillingSummary,
  setDateRange,
  setIsData,
} from "@/features/summarySlice/billingSlices";
import { useAppSelector } from "@/hooks/useReduxHook";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
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
  const [dateError, setDateError] = useState<string>("");
  const dateRange = useAppSelector((state) => state.summary?.dateRange);
  const billingSummaryData = useAppSelector(
    (state) => state.summary?.billingSummaryData,
  );
  const billingSummaryLoading = useAppSelector(
    (state) => state.summary?.billingSummaryLoading,
  );

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
    await dispatch(
      getBillingSummary({
        from: dayjs(dateRange[0]).format("DD-MM-YYYY"),
        to: dayjs(dateRange[1]).format("DD-MM-YYYY"),
      }),
    );
    dispatch(setIsData(true));
  };

  const handleReset = () => {
    reset({ date: null });
    dispatch(setDateRange(null));
    setDateError("");
    dispatch(setIsData(false));
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
                onChange={(dates) => {
                  dispatch(setDateRange(dates));
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
              sx={{
                minWidth: "100px",
              }}
            >
              Search
            </LoadingButton>
          </div>
        </form>
      </div>
      <div className="flex flex-col w-full min-h-0 h-[calc(100vh-100px)]">
        <div className="ag-theme-quartz billing-summary-grid flex-1 min-h-0">
          <AgGridReact
            ref={gridRef}
            suppressCellFocus={true}
            suppressMenuHide={true}
            headerHeight={10}
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
    </div>
  );
};

export default BillingSummary;
