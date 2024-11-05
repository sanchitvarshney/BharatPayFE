import React, { useEffect, useState } from "react";
import { DatePicker, TimeRangePickerProps } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { convertDateRangev2 } from "@/utils/converDateRangeUtills";
import { Download, Filter } from "lucide-react";
import R2ReportDetail from "@/table/report/R2ReportDetail";
import { CustomDrawer, CustomDrawerContent, CustomDrawerHeader, CustomDrawerTitle } from "@/components/reusable/CustomDrawer";
import { showToast } from "@/utils/toastUtils";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getR2Data } from "@/features/report/report/reportSlice";
import { CustomButton } from "@/components/reusable/CustomButton";
import R2ReportTable from "@/table/report/R2ReportTable";
import { useSocket } from "@/hooks/useSocket";

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;
const dateFormat = "DD-MM-YYYY";

const R2Report: React.FC = () => {
  const [date, setDate] = useState<{ from: string; to: string } | null>(null);
  const [open, setOpen] = useState(false);
  const { emitDownloadReport, onDownloadReport } = useSocket();
  const rangePresets: TimeRangePickerProps["presets"] = [
    { label: "Today", value: [dayjs().startOf("day"), dayjs()] },
    { label: "Yesterday", value: [dayjs().add(-1, "d"), dayjs()] },
    { label: "Last 7 Days", value: [dayjs().add(-7, "d"), dayjs()] },
    { label: "Last 14 Days", value: [dayjs().add(-14, "d"), dayjs()] },
    { label: "Last 30 Days", value: [dayjs().add(-30, "d"), dayjs()] },
    { label: "Last 90 Days", value: [dayjs().add(-90, "d"), dayjs()] },
  ];

  const dispatch = useAppDispatch();
  const { getR2DataLoading, refId } = useAppSelector((state) => state.report);
  const [loading, setLoading] = useState(false);
  const handleDownload = () => {
    emitDownloadReport({ from: date?.from || "", to: date?.to || "" });
    setLoading(true);
  };
  useEffect(() => {
    onDownloadReport((data) => {
      console.log("Report downloaded:", data);
      setLoading(false);
      showToast({
        description: "Report downloaded successfully",
        variant: "success",
      });
      // Handle downloaded report data
    });
  }, [onDownloadReport]);
  return (
    <>
      <CustomDrawer open={open} onOpenChange={setOpen}>
        <CustomDrawerContent side="right" className="min-w-[70%] p-0" onInteractOutside={(e) => e.preventDefault()}>
          <CustomDrawerHeader className="h-[50px] p-0 flex flex-col justify-center px-[20px] space-y-0 bg-zinc-200 gap-0">
            <CustomDrawerTitle className="text-slate-600 font-[500] p-0">Ref ID: {"#" + refId}</CustomDrawerTitle>
          </CustomDrawerHeader>
          <div className="h-[calc(100vh-50px)] ">
            <R2ReportDetail />
          </div>
        </CustomDrawerContent>
      </CustomDrawer>

      <div className="bg-white">
        <div className="h-[50px] flex items-center justify-between px-[20px] gap-[20px]">
          <div className="flex items-center gap-[10px]">
            <RangePicker
              value={[date ? dayjs(date.from, dateFormat) : null, date ? dayjs(date.to, dateFormat) : null]}
              onChange={(value) => {
                // Ensure the value is not null and correctly formatted
                const newDate = convertDateRangev2(value!);
                setDate(newDate);
              }}
              disabledDate={(current) => current && current > dayjs()}
              presets={rangePresets}
              placeholder={["Start date", "End Date"]}
              format={dateFormat}
            />
            <CustomButton
              loading={getR2DataLoading}
              onClick={() => {
                if (!date) {
                  showToast({
                    description: "Please select a date",
                    variant: "destructive",
                  });
                } else {
                  dispatch(getR2Data(date)).then((res: any) => {
                    if (res.payload?.data?.status === "success") {
                    }
                  });
                }
              }}
              size={"sm"}
              className="bg-cyan-700 hover:bg-cyan-800 flex items-center gap-[5px]"
            >
              <Filter className="h-[17px] w-[17px]" /> Filter
            </CustomButton>
          </div>
          <CustomButton loading={loading} onClick={handleDownload} size={"sm"} className="bg-cyan-700 hover:bg-cyan-800 flex items-center gap-[5px]">
            <Download className="h-[17px] w-[17px]" /> Download
          </CustomButton>
        </div>
        <R2ReportTable setOpen={setOpen} />
      </div>
    </>
  );
};

export default R2Report;
