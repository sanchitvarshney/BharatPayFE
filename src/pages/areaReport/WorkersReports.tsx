import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { toast } from "@/components/ui/use-toast";
import {
  getWorkerReport,
  syncWorkerReport,
} from "@/features/areaSlice/areaSlice";
import { rangePresets } from "@/utils/rangePresets";
import { LoadingButton, Skeleton } from "@mui/lab";
import { ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import React, { useMemo, useRef } from "react";

const NUMERIC_FIELDS = [
  "swipe_p12",
  "swipe_p10",
  "swipe_g24g",
  "swipe_ingenico",
  "swipe_assembly",
  "swipe_storeAdmin",
  "swipe_cost",
  "swipe_profitLoss",
  "soundbox_production",
  "soundbox_assemblycost",
  "soundbox_trc",
  "soundbox_storeAdmin",
  "soundbox_totalcost",
  "soundbox_profitLoss",
  "cleaning_production",
  "cleaning_cost",
  "cleaning_profitLoss",
  "preqc_production",
  "preqc_cost",
  "gtotal_production",
  "gtotal_cost",
  "gtotal_contribution",
  "gtotal_difference",
  "contribution_staff",
  "contribution_depreciation",
  "contribution_consumable",
  "contribution_other",
  "contribution_total",
];
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Button, CircularProgress } from "@mui/material";
import { Sync } from "@mui/icons-material";

const { RangePicker } = DatePicker;

const CustomLoadingCellRenderer: React.FC = () => {
  return (
    <div className="loading-cell">
      <Skeleton className="h-[20px] w-full" />
    </div>
  );
};

const WR_GROUP_0 = "wr-group-0";
const WR_GROUP_1 = "wr-group-1";
const WR_GROUP_2 = "wr-group-2";
const WR_GROUP_3 = "wr-group-3";
// const WR_GROUP_4 = "wr-group-4";
const WR_GROUP_5 = "wr-group-5";
// const WR_GROUP_6 = "wr-group-6";

const WR_LAST_0 = "wr-last-0";
const WR_LAST_1 = "wr-last-1";
const WR_LAST_2 = "wr-last-2";
const WR_LAST_3 = "wr-last-3";
// const WR_LAST_4 = "wr-last-4";
const WR_LAST_5 = "wr-last-5";
// const WR_LAST_6 = "wr-last-6";

const columnDefs: any[] = [
  {
    headerName: "Date",
    field: "date",
    minWidth: 150,
    flex: 1,
    headerClass: `${WR_GROUP_0} ${WR_LAST_0}`,
    cellClass: WR_LAST_0,
  },
  {
    headerName: "Swipe Sales Cost",
    headerClass: `${WR_GROUP_1} ${WR_LAST_1}`,
    children: [
      {
        headerName: "P12 Revenue",
        field: "swipe_p12",
        headerClass: WR_GROUP_1,
        minWidth: 150,
        width: 170,
        maxWidth: 250,
      },
      {
        headerName: "P10 Revenue",
        field: "swipe_p10",
        headerClass: WR_GROUP_1,
        minWidth: 150,
        width: 170,
        maxWidth: 250,
      },
      {
        headerName: "G2 4G Revenue",
        field: "swipe_g24g",
        headerClass: WR_GROUP_1,
        minWidth: 150,
        width: 170,
        maxWidth: 250,
      },
      {
        headerName: "Ingenico Revenue",
        field: "swipe_ingenico",
        headerClass: WR_GROUP_1,
        minWidth: 150,
        width: 170,
        maxWidth: 250,
      },
      {
        headerName: "Assembly",
        field: "swipe_assembly",
        headerClass: WR_GROUP_1,
        minWidth: 150,
        width: 170,
        maxWidth: 250,
      },
      {
        headerName: "Store + Admin",
        field: "swipe_storeAdmin",
        headerClass: WR_GROUP_1,
        minWidth: 150,
        width: 170,
        maxWidth: 250,
      },
      {
        headerName: "Cost",
        field: "swipe_cost",
        headerClass: WR_GROUP_1,
        minWidth: 150,
        width: 170,
        maxWidth: 250,
      },
      {
        headerName: "Profit / Loss",
        field: "swipe_profitLoss",
        headerClass: `${WR_GROUP_1} ${WR_LAST_1}`,
        cellClass: WR_LAST_1,
        minWidth: 150,
        width: 170,
        maxWidth: 250,
      },
    ],
  },
  {
    headerName: "Sound Box Sales Cost",
    headerClass: `${WR_GROUP_2} ${WR_LAST_2}`,
    field: "",
    children: [
      {
        headerName: "Production",
        field: "soundbox_production",
        headerClass: WR_GROUP_2,
        minWidth: 150,
        width: 170,
        maxWidth: 250,
      },
      {
        headerName: "Assembly / Cost",
        field: "soundbox_assemblycost",
        headerClass: WR_GROUP_2,
        minWidth: 150,
        width: 170,
        maxWidth: 250,
      },
      {
        headerName: "TRC",
        field: "soundbox_trc",
        headerClass: WR_GROUP_2,
        minWidth: 150,
        width: 170,
        maxWidth: 250,
      },
      {
        headerName: "Store + Admin",
        field: "soundbox_storeAdmin",
        headerClass: WR_GROUP_2,
        minWidth: 150,
        width: 170,
        maxWidth: 250,
      },
           {   headerName: "PreQC Cost",
        field: "preqc_cost",
        headerClass: WR_GROUP_2,
        minWidth: 150,
        width: 170,
        maxWidth: 250,
      },
      {
        headerName: "Total Cost",
        field: "soundbox_totalcost",
        headerClass: WR_GROUP_2,
        minWidth: 150,
        width: 170,
        maxWidth: 250,
      },
      {
        headerName: "Profit / Loss",
        field: "soundbox_profitLoss",
        headerClass: `${WR_GROUP_2} ${WR_LAST_2}`,
        cellClass: WR_LAST_2,
        minWidth: 150,
        width: 170,
        maxWidth: 250,
      },
    ],
  },
  {
    headerName: "Cleaning Production",
    headerClass: `${WR_GROUP_3} ${WR_LAST_3}`,
    field: "",
    children: [
      {
        headerName: "Production",
        field: "cleaning_production",
        headerClass: WR_GROUP_3,
        minWidth: 150,
        width: 170,
        maxWidth: 250,
      },
      {
        headerName: "Cost",
        field: "cleaning_cost",
        headerClass: WR_GROUP_3,
        minWidth: 150,
        width: 170,
        maxWidth: 250,
      },
      {
        headerName: "Profit / Loss",
        field: "cleaning_profitLoss",
        headerClass: `${WR_GROUP_3} ${WR_LAST_3}`,
        cellClass: WR_LAST_3,
        minWidth: 150,
        width: 170,
        maxWidth: 250,
      },
    ],
  },
  // {
  //   headerName: "Pre QC Sound Box",
  //   headerClass: `${WR_GROUP_4} ${WR_LAST_4}`,
  //   field: "",
  //   children: [
  //     {
  //       headerName: "Production",
  //       field: "preqc_production",
  //       headerClass: WR_GROUP_4,
  //       minWidth: 150,
  //       width: 170,
  //       maxWidth: 250,
  //     },
  //     {
  //       headerName: "Cost",
  //       field: "preqc_cost",
  //       headerClass: WR_GROUP_4,
  //       minWidth: 150,
  //       width: 170,
  //       maxWidth: 250,
  //     },
  //     {
  //       headerName: "Profit / Loss",
  //       field: "preqc_production",
  //       headerClass: `${WR_GROUP_4} ${WR_LAST_4}`,
  //       cellClass: WR_LAST_4,
  //       minWidth: 150,
  //       width: 170,
  //       maxWidth: 250,
  //     },
  //   ],
  // },
  {
    headerName: "G. Total",
    headerClass: `${WR_GROUP_5} ${WR_LAST_5}`,
    field: "",
    children: [
      {
        headerName: "Production",
        field: "gtotal_production",
        headerClass: WR_GROUP_5,
        minWidth: 150,
        width: 170,
        maxWidth: 250,
      },
      {
        headerName: "Cost",
        field: "gtotal_cost",
        headerClass: WR_GROUP_5,
        minWidth: 150,
        width: 170,
        maxWidth: 250,
      },
      {
        headerName: "Contribution Cost",
        field: "gtotal_contribution",
        headerClass: WR_GROUP_5,
        minWidth: 150,
        width: 170,
        maxWidth: 250,
      },
      {
        headerName: "Difference",
        field: "gtotal_difference",
        headerClass: `${WR_GROUP_5} ${WR_LAST_5}`,
        cellClass: WR_LAST_5,
        minWidth: 150,
        width: 170,
        maxWidth: 250,
      },
    ],
  },
  // {
  //   headerName: "Contribution Cost",
  //   headerClass: `${WR_GROUP_6} ${WR_LAST_6}`,
  //   field: "",
  //   children: [
  //     {
  //       headerName: "Staff Cost",
  //       field: "contribution_staff",
  //       headerClass: WR_GROUP_6,
  //       minWidth: 150,
  //       width: 170,
  //       maxWidth: 250,
  //     },
  //     {
  //       headerName: "Depreciation",
  //       field: "contribution_depreciation",
  //       headerClass: WR_GROUP_6,
  //       minWidth: 150,
  //       width: 170,
  //       maxWidth: 250,
  //     },
  //     {
  //       headerName: "Consumable",
  //       field: "contribution_consumable",
  //       headerClass: WR_GROUP_6,
  //       minWidth: 150,
  //       width: 170,
  //       maxWidth: 250,
  //     },
  //     {
  //       headerName: "Other",
  //       field: "contribution_other",
  //       headerClass: WR_GROUP_6,
  //       minWidth: 150,
  //       width: 170,
  //       maxWidth: 250,
  //     },
  //     {
  //       headerName: "Total",
  //       field: "contribution_total",
  //       headerClass: `${WR_GROUP_6} ${WR_LAST_6}`,
  //       cellClass: WR_LAST_6,
  //       minWidth: 150,
  //       width: 170,
  //       maxWidth: 250,
  //     },
  //   ],
  // },
];

const WorkersReports = () => {
  const gridRef = useRef(null);
  const dispatch: any = useDispatch();
  const { workerReports, isSyncReportLoading, isReportLoading } = useSelector(
    (state: any) => state.placeMaster,
  );

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: "agTextColumnFilter",
      floatingFilter: true,
      sortable: true,

      resizable: true,
      cellRenderer: (params: any) => {
        const v = params.value;
        if (v === null || v === undefined) return 0;
        if (typeof v === "number" && !Number.isFinite(v)) return 0;
        return v;
      },
      cellStyle: { textAlign: "center" },
    };
  }, []);
  const sideBar = useMemo(
    () => ({
      toolPanels: [
        {
          id: "columns",
          labelDefault: "Columns",
          labelKey: "columns",
          iconKey: "columns",
          toolPanel: "agColumnsToolPanel",
          toolPanelParams: {
            suppressPivotMode: true,
            suppressPivots: true,
          },
        },
      ],
      defaultToolPanel: "",
    }),
    [],
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      date: null,
    },
  });

  const handleSyncReport =async () => {
    try {
      const res = await dispatch(syncWorkerReport()).unwrap();
      if (res?.data?.success) {
        toast({
          description: res?.data?.message || "Report Synced Successfully",
          variant: "success",
          className: "font-[500]",
          duration: 1500,
        });
      }  else {
        toast({
          description: res?.data?.message || "Something went wrong",
          variant: "destructive",
          className: "font-[500]",
          duration: 1500,
        });
      }
    } catch (error:any) {
      toast({
        description: error?.message,
        variant: "destructive",
        className: "font-[500]",
        duration: 1500,
      });
    }
  };

  const pinnedBottomRowData = useMemo(() => {
    const rows = workerReports ?? [];
    if (rows.length === 0) return [];

    const toNum = (val: unknown): number => {
      if (val === null || val === undefined) return 0;
      const n = Number(val);
      return Number.isFinite(n) ? n : 0;
    };

    const totalRow: Record<string, string | number> = { date: "Total" };
    NUMERIC_FIELDS.forEach((field) => {
      const sum = rows.reduce(
        (acc: any, row: any) => acc + toNum(row[field]),
        0,
      );
      totalRow[field] = Number.isFinite(sum) ? sum : 0;
    });
    return [totalRow];
  }, [workerReports]);

  const profitPercentages: any = useMemo(() => {
    const rows = workerReports ?? [];
    if (rows.length === 0) return null;

    const toNum = (val: unknown): number => {
      if (val === null || val === undefined) return 0;
      const n = Number(val);
      return Number.isFinite(n) ? n : 0;
    };

    const sumField = (field: string): number =>
      rows.reduce((acc: any, row: any) => acc + toNum(row[field]), 0);

    const pct = (profit: number, cost: number): number | null => {
      if (!Number.isFinite(profit) || !Number.isFinite(cost) || cost === 0)
        return null;
      const value = (cost / profit) * 100;
      if (!Number.isFinite(value)) return null;
      // Cap profit/loss % to 100% and -100% for display
      if (value >= 0) return Math.min(100, value);
      return Math.max(-100, value);
    };

    const sp1 = sumField("swipe_p12");
    const sp2 = sumField("swipe_p10");
    const sp3 = sumField("swipe_g24g");
    const sp4 = sumField("swipe_ingenico");
    const sP = sumField("swipe_profitLoss");

    const soundp = sumField("soundbox_production");
    const sound = sumField("soundbox_profitLoss");
    const cleanp = sumField("cleaning_production");
    const clean = sumField("cleaning_profitLoss");
    const gtotalp = sumField("gtotal_production");
    const gtotalc1 = sumField("gtotal_cost");
    const gtotalc2 = sumField("gtotal_contribution");

    // G total % = (Sum of Production - (Sum of Cost + Sum of contribution)) / Sum of production * 100
    let gtotal: number | null = null;
    if (Number.isFinite(gtotalp) && gtotalp !== 0) {
      const value =
        ((gtotalp - (gtotalc1 + gtotalc2)) / gtotalp) * 100;
      if (Number.isFinite(value)) {
        gtotal = Math.min(100, Math.max(-100, value));
      }
    }

    return {
      swipe: pct(sp1 + sp2 + sp3 + sp4, sP),
      soundbox: pct(soundp, sound),
      cleaning: pct(cleanp, clean),
      gtotal,
    };
  }, [workerReports]);

  const onSubmit = (data: any) => {
    const payload: any = {
      from: dayjs(data?.date[0]).format("DD-MM-YYYY"),
      to: dayjs(data?.date[1]).format("DD-MM-YYYY"),
    };

    //@ts-ignore
    dispatch(getWorkerReport(payload)).then((res: any) => {
      if (res.payload?.data?.status) {
        toast({
          description: res.payload.data.message,
          variant: "success",
          className: "font-[500]",
          duration: 1500,
        });
      } else {
        toast({
          description: res.payload?.data?.message || "Something went wrong",
          variant: "destructive",
          className: "font-[500]",
          duration: 1500,
        });
      }
    });
  };

  return (
    <div className="grid  w-full grid-cols-[1fr_3fr]  bg-white">
      <div className="w-full border-r border-neutral-300">
        <form onSubmit={handleSubmit(onSubmit)} className="p-[10px]">
          <div className="py-[0px] flex flex-col gap-[0px]">
            <div>
              <label className="text-[14px] font-[500] text-slate-600 ">
                Select Date Range
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
          <div className="h-[50px] p-0 flex items-center px-[20px] gap-[10px] justify-end">
            <LoadingButton
              loadingPosition="start"
              type="submit"
              variant="contained"
              disabled={isReportLoading}
            >
              Search
            </LoadingButton>
          </div>
        </form>
      </div>
      <div className="flex flex-col w-full min-h-0 h-[calc(100vh-100px)]">
        {profitPercentages && (
          <div className="flex flex-wrap items-center gap-3 px-3 py-2 border-b border-slate-200 bg-slate-50 shrink-0">
            <span className="text-sm font-semibold text-slate-600">
              Profit / Loss %
            </span>
            {Number.isFinite(profitPercentages.swipe) && (
              <span className="text-sm">
                <span className="text-slate-500">Swipe:</span>{" "}
                <span
                  className={
                    profitPercentages.swipe >= 0
                      ? "text-emerald-600 font-medium"
                      : "text-red-600 font-medium"
                  }
                >
                  {profitPercentages.swipe >= 0
                    ? `${profitPercentages.swipe.toFixed(1)}% profit`
                    : `${profitPercentages.swipe.toFixed(1)}% loss`}
                </span>
              </span>
            )}
            {Number.isFinite(profitPercentages.soundbox) && (
              <span className="text-sm">
                <span className="text-slate-500">Soundbox:</span>{" "}
                <span
                  className={
                    profitPercentages.soundbox >= 0
                      ? "text-emerald-600 font-medium"
                      : "text-red-600 font-medium"
                  }
                >
                  {profitPercentages.soundbox >= 0
                    ? `${profitPercentages.soundbox.toFixed(1)}% profit`
                    : `${profitPercentages.soundbox.toFixed(1)}% loss`}
                </span>
              </span>
            )}
            {Number.isFinite(profitPercentages.cleaning) && (
              <span className="text-sm">
                <span className="text-slate-500">Cleaning:</span>{" "}
                <span
                  className={
                    profitPercentages.cleaning >= 0
                      ? "text-emerald-600 font-medium"
                      : "text-red-600 font-medium"
                  }
                >
                  {profitPercentages.cleaning >= 0
                    ? `${profitPercentages.cleaning.toFixed(1)}% profit`
                    : `${profitPercentages.cleaning.toFixed(1)}% loss`}
                </span>
              </span>
            )}
            {Number.isFinite(profitPercentages.gtotal) && (
              <span className="text-sm">
                <span className="text-slate-500">G.Total:</span>{" "}
                <span
                  className={
                    profitPercentages.gtotal >= 0
                      ? "text-emerald-600 font-medium"
                      : "text-red-600 font-medium"
                  }
                >
                  {profitPercentages.gtotal >= 0
                    ? `${profitPercentages.gtotal.toFixed(1)}% profit`
                    : `${profitPercentages.gtotal.toFixed(1)}% loss`}
                </span>
              </span>
            )}
          </div>
        )}
        <div className="flex flex-wrap justify-end gap-3 p-2 ">
          <Button
            variant="contained"
            color="primary"
            startIcon={
              isSyncReportLoading ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <Sync fontSize="small" color="inherit" />
              )
            }
            onClick={handleSyncReport}
            disabled={isSyncReportLoading}
            size="small"
          >
            Sync
          </Button>
        </div>
        <div className="ag-theme-quartz workers-report-grid flex-1 min-h-0">
          <AgGridReact
            ref={gridRef}
            loadingOverlayComponent={CustomLoadingOverlay}
            suppressCellFocus={true}
            suppressMenuHide={true}
            overlayNoRowsTemplate={OverlayNoRowsTemplate}
            rowData={workerReports ?? []}
            pinnedBottomRowData={pinnedBottomRowData}
            getRowClass={(params) =>
              params.node?.rowPinned === "bottom" ? "wr-total-row" : undefined
            }
            loading={isReportLoading}
            sideBar={sideBar}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={50}
            components={{
              customLoadingCellRenderer: CustomLoadingCellRenderer,
            }}
            loadingCellRenderer="customLoadingCellRenderer"
          />
        </div>
      </div>
    </div>
  );
};

export default WorkersReports;
