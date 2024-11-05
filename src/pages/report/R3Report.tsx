import React, { useCallback, useRef, useState } from "react";
import { DatePicker, TimeRangePickerProps } from "antd";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { CustomButton } from "@/components/reusable/CustomButton";
import { Download, Filter } from "lucide-react";
import dayjs, { Dayjs } from "dayjs";
import R3ReportTable from "@/table/report/R3ReportTable";
import { AgGridReact } from "@ag-grid-community/react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { showToast } from "@/utils/toastUtils";
import { getr3Report } from "@/features/report/report/reportSlice";

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;

const R3Report: React.FC = () => {
  const dispatch = useAppDispatch();
  const { r3reportLoading } = useAppSelector((state) => state.report);
  const [date, setDate] = useState<{ from: Dayjs | null; to: Dayjs | null }>({
    from: null,
    to: null,
  });
  const gridRef = useRef<AgGridReact<any>>(null);
  const rangePresets: TimeRangePickerProps["presets"] = [
    { label: "Today", value: [dayjs().startOf("day"), dayjs()] },
    { label: "Yesterday", value: [dayjs().add(-1, "d"), dayjs()] },
    { label: "Last 7 Days", value: [dayjs().add(-7, "d"), dayjs()] },
    { label: "Last 14 Days", value: [dayjs().add(-14, "d"), dayjs()] },
    { label: "Last 30 Days", value: [dayjs().add(-30, "d"), dayjs()] },
    { label: "Last 90 Days", value: [dayjs().add(-90, "d"), dayjs()] },
  ];
  const handleDateChange = (range: [Dayjs | null, Dayjs | null] | null) => {
    if (range) {
      setDate({ from: range[0], to: range[1] });
    } else {
      setDate({ from: null, to: null });
    }
  };
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
            presets={rangePresets}
            onChange={handleDateChange}
            disabledDate={(current) => current && current > dayjs()}
            placeholder={["Start date", "End Date"]}
            value={date.from && date.to ? [date.from, date.to] : null} // Set value based on `from` and `to`
            format="DD/MM/YYYY" // Update with your desired format
          />
          <CustomButton
            loading={r3reportLoading}
            onClick={() => {
              if (!date) {
                showToast({
                  description: "Please select date",
                  variant: "destructive",
                });
              } else {
                dispatch(getr3Report({ from: dayjs(date.from).format("DD-MM-YYYY"), to: dayjs(date.to).format("DD-MM-YYYY") }));
              }
            }}
            size={"sm"}
            className="bg-cyan-700 hover:bg-cyan-800 flex items-center gap-[5px]"
          >
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
