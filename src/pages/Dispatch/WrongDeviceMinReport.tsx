import React, { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "antd";
import LoadingButton from "@mui/lab/LoadingButton";
import { Icons } from "@/components/icons";
import { rangePresets } from "@/utils/rangePresets";
import { showToast } from "@/utils/toasterContext";
import { useSocketContext } from "@/components/context/SocketContext";
const { RangePicker } = DatePicker;

const WrongDeviceMinReport: React.FC = () => {
  const { emitDownloadWrongDeviceReport, isConnected } = useSocketContext();
  const [reportDate, setReportDate] = useState<{
    from: Dayjs | null;
    to: Dayjs | null;
  }>({
    from: null,
    to: null,
  });

  const days =
    reportDate.from && reportDate.to
      ? reportDate.to.diff(reportDate.from, "day") + 1
      : 0;

  const handleDownload = () => {
    if (!reportDate.from || !reportDate.to) {
      showToast("Please select a date range", "error");
      return;
    }
    emitDownloadWrongDeviceReport({
      fromDate: dayjs(reportDate.from).format("DD-MM-YYYY"),
      toDate: dayjs(reportDate.to).format("DD-MM-YYYY"),
    });
    showToast("Report requested. Download will start shortly.", "success");
  };

  return (
    <div className="h-[calc(100vh-100px)] bg-slate-50 flex items-start justify-center p-[20px] pt-[60px]">
      <div className="w-full max-w-[520px] bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
        <div className="flex items-center gap-[14px] px-[24px] py-[18px] bg-cyan-50 border-b border-cyan-100">
          <div className="h-[44px] w-[44px] rounded-full bg-cyan-500 text-white flex items-center justify-center shadow-sm">
            <Icons.download fontSize="small" />
          </div>
          <div>
            <div className="text-[18px] font-semibold text-slate-700">
              Wrong Device Report
            </div>
            <div className="text-[13px] text-slate-500">
              Select a date range to download the report
            </div>
          </div>
        </div>

        <div className="p-[24px] flex flex-col gap-[20px]">
          <div className="flex flex-col gap-[6px]">
            <label className="text-[13px] font-medium text-slate-600">
              Date Range <span className="text-red-500">*</span>
            </label>
            <RangePicker
              placement="bottomLeft"
              className="w-full h-[44px] rounded-md"
              format="DD-MM-YYYY"
              disabledDate={(current) => current && current > dayjs()}
              placeholder={["Start date", "End date"]}
              value={
                reportDate.from && reportDate.to
                  ? [reportDate.from, reportDate.to]
                  : null
              }
              onChange={(range: [Dayjs | null, Dayjs | null] | null) => {
                if (range) {
                  setReportDate({ from: range[0], to: range[1] });
                } else {
                  setReportDate({ from: null, to: null });
                }
              }}
              presets={rangePresets}
            />
            {days > 0 && (
              <div className="text-[12px] text-slate-500">
                {reportDate.from?.format("DD MMM YYYY")} –{" "}
                {reportDate.to?.format("DD MMM YYYY")} ({days}{" "}
                {days === 1 ? "day" : "days"})
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-[16px] border-t border-slate-100">
        <div />
            <LoadingButton
              variant="contained"
              disabled={!isConnected || !reportDate.from || !reportDate.to}
              onClick={handleDownload}
              startIcon={<Icons.download fontSize="small" />}
              sx={{ textTransform: "none", px: 3 }}
            >
              Download Report
            </LoadingButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WrongDeviceMinReport;
