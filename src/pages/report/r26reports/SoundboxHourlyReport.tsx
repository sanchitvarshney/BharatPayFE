import React, { useMemo, useRef, useState } from "react";
import { DatePicker } from "antd";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs, { Dayjs } from "dayjs";
import { AgGridReact } from "@ag-grid-community/react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import LoadingButton from "@mui/lab/LoadingButton";
import { showToast } from "@/utils/toasterContext";
import { rangePresets } from "@/utils/rangePresets";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import SoundboxHourlyTable from "@/table/report/r26tabls/SoundboxHourlyTable";
import {
  getSoundboxHourlyReport,
  setReportDateRange,
} from "@/features/report/report/reportSummarySlice";

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;

const SoundboxHourlyReport: React.FC = () => {
  const [colapse, setcolapse] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { soundboxHourlyReportLoading, soundboxHourlyReport, dateRanges } =
    useAppSelector((state) => state.reportSummary);
  const date = useMemo(
    () => ({
      from: dateRanges.soundboxHourly.from
        ? dayjs(dateRanges.soundboxHourly.from)
        : null,
      to: dateRanges.soundboxHourly.to
        ? dayjs(dateRanges.soundboxHourly.to)
        : null,
    }),
    [dateRanges.soundboxHourly],
  );

  const gridRef = useRef<AgGridReact<any>>(null);

  const handleDateChange = (range: [Dayjs | null, Dayjs | null] | null) => {
    dispatch(
      setReportDateRange({
        key: "soundboxHourly",
        from: range?.[0] ? range[0].toISOString() : null,
        to: range?.[1] ? range[1].toISOString() : null,
      }),
    );
  };

  const handleExportExcel = () => {
    if (!soundboxHourlyReport?.data?.length) {
      showToast("No data to export", "error");
      return;
    }
    gridRef.current?.api.exportDataAsExcel({
      sheetName: "Soundbox Hourly Report",
      fileName: `Soundbox_Hourly_Report_${date.from && date.to ? `${date.from.format("DD-MM-YYYY")}_to_${date.to.format("DD-MM-YYYY")}` : dayjs().format("DD-MM-YYYY")}.xlsx`,
    });
  };

  const handleFetchSoundboxHourlyReport = async () => {
    if (!date.from || !date.to) {
      showToast("Select a date range", "error");
    } else {
      try {
        const res = await dispatch(
          getSoundboxHourlyReport({
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
    <div className="bg-white h-[calc(100vh-150px)] flex relative">
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
      <div
        className={`transition-all h-[calc(100vh-150px)] overflow-hidden border-r border-neutral-300 ${colapse ? "min-w-0 max-w-0" : "min-w-[400px] max-w-[400px]"}`}
      >
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
              loading={soundboxHourlyReportLoading}
              onClick={handleFetchSoundboxHourlyReport}
            >
              Search
            </LoadingButton>
            <LoadingButton
              variant="outlined"
              startIcon={<Icons.download fontSize="small" />}
              onClick={handleExportExcel}
              disabled={!soundboxHourlyReport?.data?.length}
            >
              Export
            </LoadingButton>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full min-w-0 min-h-0 h-[calc(100vh-150px)]">
        <SoundboxHourlyTable gridRef={gridRef} />
      </div>
    </div>
  );
};

export default SoundboxHourlyReport;
