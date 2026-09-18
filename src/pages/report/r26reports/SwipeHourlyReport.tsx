import React, { useMemo, useRef } from "react";
import { DatePicker } from "antd";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs, { Dayjs } from "dayjs";
import { AgGridReact } from "@ag-grid-community/react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import LoadingButton from "@mui/lab/LoadingButton";
import { showToast } from "@/utils/toasterContext";
import { rangePresets } from "@/utils/rangePresets";
import { Icons } from "@/components/icons";
import SwipeHourlyTable from "@/table/report/r26tabls/SwipeHourlyTable";
import {
  getSwipeHourlyReport,
  setReportDateRange,
} from "@/features/report/report/reportSummarySlice";

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;

const SwipeHourlyReport: React.FC = () => {
  const dispatch = useAppDispatch();
  const { swipeHourlyReportLoading, swipeHourlyReport, dateRanges } =
    useAppSelector((state) => state.reportSummary);
  const date = useMemo(
    () => ({
      from: dateRanges.swipeHourly.from
        ? dayjs(dateRanges.swipeHourly.from)
        : null,
      to: dateRanges.swipeHourly.to ? dayjs(dateRanges.swipeHourly.to) : null,
    }),
    [dateRanges.swipeHourly],
  );

  const gridRef = useRef<AgGridReact<any>>(null);

  const handleDateChange = (range: [Dayjs | null, Dayjs | null] | null) => {
    dispatch(
      setReportDateRange({
        key: "swipeHourly",
        from: range?.[0] ? range[0].toISOString() : null,
        to: range?.[1] ? range[1].toISOString() : null,
      }),
    );
  };

  const handleExportExcel = () => {
    if (!swipeHourlyReport?.data?.length) {
      showToast("No data to export", "error");
      return;
    }
    gridRef.current?.api.exportDataAsExcel({
      sheetName: "Swipe Hourly Report",
      fileName: `Swipe_Hourly_Report_${date.from && date.to ? `${date.from.format("DD-MM-YYYY")}_to_${date.to.format("DD-MM-YYYY")}` : dayjs().format("DD-MM-YYYY")}.xlsx`,
    });
  };

  const handleFetchSwipeHourlyReport = async () => {
    if (!date.from || !date.to) {
      showToast("Select a date range", "error");
    } else {
      try {
        const res = await dispatch(
          getSwipeHourlyReport({
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
              loading={swipeHourlyReportLoading}
              onClick={handleFetchSwipeHourlyReport}
            >
              Search
            </LoadingButton>
            <LoadingButton
              variant="outlined"
              startIcon={<Icons.download fontSize="small" />}
              onClick={handleExportExcel}
              disabled={!swipeHourlyReport?.data?.length}
            >
              Export
            </LoadingButton>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full min-h-0 h-[calc(100vh-150px)]">
        <SwipeHourlyTable gridRef={gridRef} />
      </div>
    </div>
  );
};

export default SwipeHourlyReport;
