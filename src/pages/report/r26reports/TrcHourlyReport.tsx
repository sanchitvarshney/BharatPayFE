import React, { useMemo, useRef, useState } from "react";
import { DatePicker } from "antd";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs, { Dayjs } from "dayjs";
import { AgGridReact } from "@ag-grid-community/react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import LoadingButton from "@mui/lab/LoadingButton";
import { showToast } from "@/utils/toasterContext";
import { Icons } from "@/components/icons";
import { Typography } from "@mui/material";
import TrcHourlyTable from "@/table/report/r26tabls/TrcHourlyTable";
import { getTrcHourlyReport } from "@/features/report/report/reportSummarySlice";
import { rangePresets } from "@/utils/rangePresets";
import ReportStatCard from "@/components/reusable/ReportStatCard";

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;

const TrcHourlyReport: React.FC = () => {
  const dispatch = useAppDispatch();
  const { trcHourlyReportLoading, trcHourlyReport } = useAppSelector(
    (state) => state.reportSummary,
  );
  const [date, setDate] = useState<{ from: Dayjs | null; to: Dayjs | null }>({
    from: null,
    to: null,
  });

  const gridRef = useRef<AgGridReact<any>>(null);

  const handleExportExcel = () => {
    if (!trcHourlyReport?.data?.length) {
      showToast("No data to export", "error");
      return;
    }
    gridRef.current?.api.exportDataAsExcel({
      sheetName: "TRC Hourly Report",
      fileName: `TRC_Hourly_Report_${date.from && date.to ? `${date.from.format("DD-MM-YYYY")}_to_${date.to.format("DD-MM-YYYY")}` : dayjs().format("DD-MM-YYYY")}.xlsx`,
    });
  };
  const handleDateChange = (range: [Dayjs | null, Dayjs | null] | null) => {
    if (range) {
      setDate({ from: range[0], to: range[1] });
    } else {
      setDate({ from: null, to: null });
    }
  };

  const handleFetchTrcHourlyReport = async () => {
    if (!date.from || !date.to) {
      showToast("Select a date range", "error");
    } else {
      try {
        const res = await dispatch(
          getTrcHourlyReport({
            from: date.from.format("DD-MM-YYYY"),
            to: date.to.format("DD-MM-YYYY"),
          }),
        ).unwrap();

        if (res?.data?.success) {
          showToast(
            res?.data?.message || "Report fetched successfully",
            "success",
          );
        } else {
          showToast(res?.data?.message || "Report fetched failed", "error");
        }
      } catch (error: any) {
        showToast(error?.message || "Something went wrong", "error");
      }
    }
  };

  const remainingTrc = useMemo(() => {
    return (
      Number(trcHourlyReport?.summary?.workRepair ?? 0) -
      Number(trcHourlyReport?.summary?.totalout ?? 0)
    );
  }, [
    trcHourlyReport?.summary?.workRepair,
    trcHourlyReport?.summary?.totalout,
  ]);
  const remainingToRaipr = useMemo(() => {
    return (
      Number(trcHourlyReport?.summary?.trc_in ?? 0) -
      Number(trcHourlyReport?.summary?.workRepair ?? 0)
    );
  }, [trcHourlyReport?.summary?.workRepair, trcHourlyReport?.summary?.trc_in]);

  return (
    <div className="grid w-full grid-cols-[1fr_3fr] bg-white">
      <div className="w-full border-r border-neutral-300">
        <div className="p-[10px] flex flex-col gap-[15px]">
          <div>
            <label className="text-[14px] font-[500] text-slate-600">
              Select Date Range
            </label>
            <RangePicker
              className="h-[50px] w-full mt-[6px]"
              presets={rangePresets}
              onChange={handleDateChange}
              disabledDate={(current) => current && current > dayjs()}
              placeholder={["Start date", "End Date"]}
              value={date.from && date.to ? [date.from, date.to] : null}
              format="DD/MM/YYYY"
            />
          </div>
          <div className="flex items-center justify-end gap-[10px]">
            <LoadingButton
              variant="contained"
              startIcon={<Icons.search fontSize="small" />}
              loadingPosition="start"
              loading={trcHourlyReportLoading}
              onClick={handleFetchTrcHourlyReport}
            >
              Search
            </LoadingButton>
            <LoadingButton
              variant="outlined"
              startIcon={<Icons.download fontSize="small" />}
              onClick={handleExportExcel}
              disabled={!trcHourlyReport?.data?.length}
            >
              Export
            </LoadingButton>
          </div>
        </div>
        <div className="border-t border-neutral-200 px-[10px] py-[12px]">
          <Typography
            className="mb-[10px] text-slate-500"
            variant="caption"
            fontWeight={600}
            textTransform="uppercase"
            letterSpacing={0.4}
          >
            Summary
          </Typography>
          <div className="grid grid-cols-2 gap-[10px]">
            <ReportStatCard
              label="Device Repair"
              value={trcHourlyReport?.summary?.workRepair ?? 0}
              color="primary"
            />
            <ReportStatCard
              label="Consumption"
              value={trcHourlyReport?.total?.Trc_consumption ?? 0}
              color="info"
            />
            <ReportStatCard
              label="In Consumption"
              value={trcHourlyReport?.summary?.trc_in ?? 0}
              color="success"
            />
            <ReportStatCard
              label="Out Consumption"
              value={trcHourlyReport?.summary?.totalout ?? 0}
              color="warning"
            />
            <ReportStatCard
              label="Remaining Consumption"
              value={remainingTrc ?? 0}
              color="error"
            />
            <ReportStatCard
              label="Remaining To Repair"
              value={remainingToRaipr ?? 0}
              color="error"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full min-h-0 h-[calc(100vh-150px)]">
        <TrcHourlyTable gridRef={gridRef} />
      </div>
    </div>
  );
};

export default TrcHourlyReport;
