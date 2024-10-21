import R2ReportTable from "@/table/report/R2ReportTable";
import React, { useState } from "react";
import { DatePicker, TimeRangePickerProps } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { convertDateRange } from "@/utils/converDateRangeUtills";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import R2ReportDetail from "@/table/report/R2ReportDetail";
import { CustomDrawer, CustomDrawerContent, CustomDrawerHeader, CustomDrawerTitle } from "@/components/reusable/CustomDrawer"; // Update with the correct path

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;
const dateFormat = "DD-MM-YYYY";
const R2Report: React.FC = () => {
  const [_, setDate] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const rangePresets: TimeRangePickerProps["presets"] = [
    { label: "Today", value: [dayjs().startOf("day"), dayjs()] },
    { label: "Yesterday", value: [dayjs().add(-1, "d"), dayjs()] },
    { label: "Last 7 Days", value: [dayjs().add(-7, "d"), dayjs()] },
    { label: "Last 14 Days", value: [dayjs().add(-14, "d"), dayjs()] },
    { label: "Last 30 Days", value: [dayjs().add(-30, "d"), dayjs()] },
    { label: "Last 90 Days", value: [dayjs().add(-90, "d"), dayjs()] },
  ];
  return (
    <>
      <CustomDrawer open={open} onOpenChange={setOpen}>
        <CustomDrawerContent side="right" className="min-w-[70%] p-0">
          <CustomDrawerHeader className="h-[50px] p-0 flex flex-col justify-center px-[20px] space-y-0 bg-zinc-200 gap-0">
            <CustomDrawerTitle className="text-slate-600 font-[500] p-0">54FGHJKLJJ6789</CustomDrawerTitle>
          </CustomDrawerHeader>
          <div className="h-[calc(100vh-50px)] ">
            <R2ReportDetail />
          </div>
        </CustomDrawerContent>
      </CustomDrawer>

      <div className="bg-white">
        <div className="h-[50px] flex items-center px-[20px] gap-[20px]">
          <RangePicker onChange={(e) => setDate(convertDateRange(e!))} disabledDate={(current) => current && current > dayjs()} presets={rangePresets} placeholder={["Start date", "End Date"]} format={dateFormat} />
          <Button size={"sm"} className="bg-cyan-700 hover:bg-cyan-800 flex items-center gap-[5px]">
            <Filter className="h-[17px] w-[17px]" /> Filter
          </Button>
        </div>
        <R2ReportTable setOpen={setOpen} />
      </div>
    </>
  );
};

export default R2Report;
