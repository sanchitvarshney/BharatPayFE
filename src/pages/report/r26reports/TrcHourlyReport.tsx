import React, { useRef, useState } from "react";
import { DatePicker } from "antd";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs, { Dayjs } from "dayjs";
import { AgGridReact } from "@ag-grid-community/react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import LoadingButton from "@mui/lab/LoadingButton";
import { showToast } from "@/utils/toasterContext";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Divider, Typography } from "@mui/material";
import TrcHourlyTable from "@/table/report/r26tabls/TrcHourlyTable";
import { getTrcHourlyReport } from "@/features/report/report/reportSummarySlice";

dayjs.extend(customParseFormat);

const TrcHourlyReport: React.FC = () => {
  const [colapse, setcolapse] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { trcHourlyReportLoading, trcHourlyReport } = useAppSelector(
    (state) => state.reportSummary,
  );
  const [date, setDate] = useState<Dayjs | null>(null);

  const gridRef = useRef<AgGridReact<any>>(null);

  const handleExportExcel = () => {
    if (!trcHourlyReport?.data?.length) {
      showToast("No data to export", "error");
      return;
    }
    gridRef.current?.api.exportDataAsExcel({
      sheetName: "TRC Hourly Report",
      fileName: `TRC_Hourly_Report_${date ? dayjs(date).format("DD-MM-YYYY") : dayjs().format("DD-MM-YYYY")}.xlsx`,
    });
  };

  const handleFetchTrcHourlyReport = async () => {
    if (!date) {
      showToast("Select a date", "error");
    } else {
      try {
        const res = await dispatch(
          getTrcHourlyReport({
            date: dayjs(date).format("DD-MM-YYYY"),
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
              Select Date
            </Typography>
            <DatePicker
              className="h-[50px] w-full"
              onChange={(value) => setDate(value)}
              disabledDate={(current) => current && current > dayjs()}
              placeholder="Select date"
              value={date}
              format="DD/MM/YYYY"
            />
          </div>
          <div className="flex items-center justify-between w-full gap-[10px]">
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
        <Divider />
        <div className="flex flex-col gap-[6px] p-[0px]">
          <Typography fontWeight={600} fontSize={18} px={1} variant="subtitle1" color="primary">
            Device Repair : {trcHourlyReport?.total?.worker_consumption ?? 0}
          </Typography>
            <Divider />
          <Typography  fontWeight={600} px={1} fontSize={18}  variant="subtitle1" color="error">
            TRC Consumption : {trcHourlyReport?.total?.Trc_consumption ?? 0}
          </Typography>
            <Divider />
        </div>
      </div>

      <div className="w-full">
        <TrcHourlyTable gridRef={gridRef} />
      </div>
    </div>
  );
};

export default TrcHourlyReport;
