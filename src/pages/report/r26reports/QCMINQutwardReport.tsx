import React, { useRef, useState } from "react";
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
import QcMinOutwardTable from "@/table/report/r26tabls/QcMinOutwardTable";
import { getQcMinReport } from "@/features/report/report/reportSummarySlice";
import ReportStatCard from "@/components/reusable/ReportStatCard";

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;

const QCMINQutwardReport: React.FC = () => {
  const [colapse, setcolapse] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { qcminreportLoading, qcminreport } = useAppSelector(
    (state) => state.reportSummary,
  );
  const [date, setDate] = useState<{ from: Dayjs | null; to: Dayjs | null }>({
    from: null,
    to: null,
  });

  const gridRef = useRef<AgGridReact<any>>(null);

  const handleDateChange = (range: [Dayjs | null, Dayjs | null] | null) => {
    if (range) {
      setDate({ from: range[0], to: range[1] });
    } else {
      setDate({ from: null, to: null });
    }
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
        console.log(error || "Something went wrong", "data");
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
              loading={qcminreportLoading}
              onClick={handleFetchQcMinReport}
            >
              Search
            </LoadingButton>
          </div>
        </div>
        <Divider />
        <div className="grid grid-cols-2 gap-[10px] p-[10px]">
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

      <div className="w-full">
        <QcMinOutwardTable gridRef={gridRef} />
      </div>
    </div>
  );
};

export default QCMINQutwardReport;
