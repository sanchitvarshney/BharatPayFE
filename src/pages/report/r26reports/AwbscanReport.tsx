import React, { useMemo, useRef, useState } from "react";
import { DatePicker } from "antd";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs, { Dayjs } from "dayjs";
import { AgGridReact } from "@ag-grid-community/react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import LoadingButton from "@mui/lab/LoadingButton";
import { showToast } from "@/utils/toasterContext";
import { rangePresets } from "@/utils/rangePresets";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Divider, Typography } from "@mui/material";
import AwbscanTable from "@/table/report/r26tabls/AwbscanTable";
import {
  getawbscanReport,
  setReportDateRange,
} from "@/features/report/report/reportSummarySlice";
import WrongAwbscanTable from "@/table/report/r26tabls/WrongAwbScanTable";
import ReportStatCard from "@/components/reusable/ReportStatCard";

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;

const AwbscanReport: React.FC = () => {
  const [colapse, setcolapse] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { awbscanreportLoading, awbscanreport, dateRanges } = useAppSelector(
    (state) => state.reportSummary,
  );
  const date = useMemo(
    () => ({
      from: dateRanges.awbscan.from ? dayjs(dateRanges.awbscan.from) : null,
      to: dateRanges.awbscan.to ? dayjs(dateRanges.awbscan.to) : null,
    }),
    [dateRanges.awbscan],
  );

  const gridRef = useRef<AgGridReact<any>>(null);

  const handleDateChange = (range: [Dayjs | null, Dayjs | null] | null) => {
    dispatch(
      setReportDateRange({
        key: "awbscan",
        from: range?.[0] ? range[0].toISOString() : null,
        to: range?.[1] ? range[1].toISOString() : null,
      }),
    );
  };
  const handleFetchR25Report = async () => {
    if (!date.from || !date.to) {
      showToast("Select date range", "error");
    } else {
      try {
        const res = await dispatch(
          getawbscanReport({
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
    <div className="bg-white h-[calc(100vh-150px)] flex relative">
      <div
        className={`transition-all flex flex-col gap-[10px] h-[calc(100vh-150px)]  border-r border-neutral-300   ${colapse ? "min-w-0 max-w-0" : "min-w-[400px] max-w-[400px] "}`}
      >
        <div
          className={`transition-all ${colapse ? "left-0" : "left-[400px]"} w-[16px] p-0  h-full top-0 bottom-0 absolute rounded-none  text-slate-600 z-[10] flex items-center justify-center`}
        >
          <Button
            onClick={() => setcolapse(!colapse)}
            className={`transition-all w-[16px] p-0 py-[35px] bg-neutral-200  rounded-none hover:bg-neutral-300/50 text-slate-600 hover:h-full shadow-sm shadow-neutral-400 duration-300   `}
          >
            {colapse ? (
              <Icons.right fontSize="small" />
            ) : (
              <Icons.left fontSize="small" />
            )}
          </Button>
        </div>
        <div className="flex flex-col gap-[20px]  p-[10px] mt-[0px] overflow-hidden">
          <div className="w-full">
            <Typography className="mb-[14px] font-semibold" variant="subtitle1">
              Select Date Range
            </Typography>
            <RangePicker
              className="h-[50px] w-full"
              presets={rangePresets}
              onChange={handleDateChange}
              disabledDate={(current) => current && current > dayjs()}
              placeholder={["Start date", "End Date"]}
              value={date.from && date.to ? [date.from, date.to] : null} // Set value based on `from` and `to`
              format="DD/MM/YYYY" // Update with your desired format
            />
          </div>
          <div className="flex items-center justify-between w-full">
            <LoadingButton
              variant="contained"
              startIcon={<Icons.search fontSize="small" />}
              loadingPosition="start"
              loading={awbscanreportLoading}
              onClick={handleFetchR25Report}
            >
              Search
            </LoadingButton>
          </div>
        </div>
        <Divider />
        <div className="p-[10px]">
          <ReportStatCard
            label="Total Wrong Scan"
            value={awbscanreport?.WrongDevice?.totalWrongDevices ?? 0}
            color="error"
          />
        </div>
        <Divider />
        <WrongAwbscanTable gridRef={gridRef} />
      </div>

      <div className="w-full">
        <AwbscanTable gridRef={gridRef} />
      </div>
    </div>
  );
};

export default AwbscanReport;
