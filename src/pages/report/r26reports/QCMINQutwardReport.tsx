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
import { Typography } from "@mui/material";
import QcMinOutwardTable from "@/table/report/r26tabls/QcMinOutwardTable";
import {
  getQcMinReport,
  setReportDateRange,
} from "@/features/report/report/reportSummarySlice";
import ReportStatCard from "@/components/reusable/ReportStatCard";

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;

const QCMINQutwardReport: React.FC = () => {
  const dispatch = useAppDispatch();
  const { qcminreportLoading, qcminreport, dateRanges } = useAppSelector(
    (state) => state.reportSummary,
  );
  const date = useMemo(
    () => ({
      from: dateRanges.qcMinOutward.from
        ? dayjs(dateRanges.qcMinOutward.from)
        : null,
      to: dateRanges.qcMinOutward.to
        ? dayjs(dateRanges.qcMinOutward.to)
        : null,
    }),
    [dateRanges.qcMinOutward],
  );

  const gridRef = useRef<AgGridReact<any>>(null);

  const handleDateChange = (range: [Dayjs | null, Dayjs | null] | null) => {
    dispatch(
      setReportDateRange({
        key: "qcMinOutward",
        from: range?.[0] ? range[0].toISOString() : null,
        to: range?.[1] ? range[1].toISOString() : null,
      }),
    );
  };
  const handleFetchQcMinReport = async () => {
    if (!date.from || !date.to) {
      showToast("Select date range", "error");
    } else {
      try {
        const res = await dispatch(
          getQcMinReport({
            from: dayjs(date.from).format("DD-MM-YYYY"),
            to: dayjs(date.to).format("DD-MM-YYYY"),
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
          <div className="flex items-center justify-end">
            <LoadingButton
              variant="contained"
              startIcon={<Icons.search fontSize="small" />}
              loadingPosition="start"
              loading={qcminreportLoading}
              onClick={handleFetchQcMinReport}
            >
              Search
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
              label="Total Wrong Device"
              value={qcminreport?.wrong_device?.total_scan ?? 0}
              color="error"
            />
            <ReportStatCard
              label="Total MIN"
              value={qcminreport?.wrong_device?.total_min ?? 0}
              color="primary"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full min-h-0 h-[calc(100vh-150px)]">
        <QcMinOutwardTable gridRef={gridRef} />
      </div>
    </div>
  );
};

export default QCMINQutwardReport;
