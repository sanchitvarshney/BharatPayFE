import React, { useRef, useState } from "react";
import { DatePicker } from "antd";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs, { Dayjs } from "dayjs";
import R25ReportTable from "@/table/report/R25ReportTable";
import { AgGridReact } from "@ag-grid-community/react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getr25Report } from "@/features/report/report/reportSlice";
import LoadingButton from "@mui/lab/LoadingButton";
import { showToast } from "@/utils/toasterContext";
import { rangePresets } from "@/utils/rangePresets";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Typography } from "@mui/material";

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;

const R25Report: React.FC = () => {
  const [colapse, setcolapse] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { r25reportLoading } = useAppSelector((state) => state.report);
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
  const handleFetchR25Report = () => {
    if (!date.from || !date.to) {
      showToast("Select date range", "error");
    } else {
      dispatch(
        getr25Report({
          from: dayjs(date.from).format("DD-MM-YYYY"),
          to: dayjs(date.to).format("DD-MM-YYYY"),
        }),
      );
    }
  };

  return (
    <div className="bg-white h-[calc(100vh-100px)] flex relative">
      <div
        className={`transition-all flex flex-col gap-[10px] h-[calc(100vh-100px)]  border-r border-neutral-300   ${colapse ? "min-w-0 max-w-0" : "min-w-[400px] max-w-[400px] "}`}
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
        <div className="flex flex-col gap-[20px]  p-[20px] mt-[0px] overflow-hidden">
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
              loading={r25reportLoading}
              onClick={handleFetchR25Report}
            >
              Search
            </LoadingButton>
          </div>
        </div>
      </div>
      <div className="w-full">
        <R25ReportTable gridRef={gridRef} />
      </div>
    </div>
  );
};

export default R25Report;
