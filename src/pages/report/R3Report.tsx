import React, { useCallback, useRef, useState } from "react";
import { DatePicker, TimeRangePickerProps } from "antd";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { convertDateRangev2 } from "@/utils/converDateRangeUtills";
import { CustomButton } from "@/components/reusable/CustomButton";
import { Download, Filter } from "lucide-react";
import dayjs from "dayjs";
import R3ReportTable from "@/table/report/R3ReportTable";
import { AgGridReact } from "@ag-grid-community/react";

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;
const dateFormat = "DD-MM-YYYY";
const R3Report: React.FC = () => {
  const [date, setDate] = useState<{ from: string; to: string } | null>(null);
  const gridRef = useRef<AgGridReact<any>>(null);
  const rangePresets: TimeRangePickerProps["presets"] = [
    { label: "Today", value: [dayjs().startOf("day"), dayjs()] },
    { label: "Yesterday", value: [dayjs().add(-1, "d"), dayjs()] },
    { label: "Last 7 Days", value: [dayjs().add(-7, "d"), dayjs()] },
    { label: "Last 14 Days", value: [dayjs().add(-14, "d"), dayjs()] },
    { label: "Last 30 Days", value: [dayjs().add(-30, "d"), dayjs()] },
    { label: "Last 90 Days", value: [dayjs().add(-90, "d"), dayjs()] },
  ];
  const onBtExport = useCallback(() => {
    gridRef.current!.api.exportDataAsExcel({
      sheetName: "R3 Report", // Set your desired sheet name here
    });
  }, []);
  return (
    <div className="bg-white h-[calc(100vh-90px)]">
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
          <CustomButton size={"sm"} className="bg-cyan-700 hover:bg-cyan-800 flex items-center gap-[5px]">
            <Filter className="h-[17px] w-[17px]" /> Filter
          </CustomButton>
        </div>
        <CustomButton onClick={onBtExport} size={"sm"} className="bg-cyan-700 hover:bg-cyan-800 flex items-center gap-[5px]">
          <Download className="h-[17px] w-[17px]" /> Download
        </CustomButton>
      </div>
      <R3ReportTable gridRef={gridRef} />
    </div>
  );
};

export default R3Report;
