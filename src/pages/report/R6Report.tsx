import React, { useCallback, useRef, useState } from "react";
import { DatePicker, TimeRangePickerProps } from "antd";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getr6Report } from "@/features/report/report/reportSlice";

import { AgGridReact } from "@ag-grid-community/react";

import LoadingButton from "@mui/lab/LoadingButton";
import SearchIcon from "@mui/icons-material/Search";
import { Button, FormControl, MenuItem, Select, TextField } from "@mui/material";

import { showToast } from "@/utils/toasterContext";
import { Icons } from "@/components/icons";
import MuiTooltip from "@/components/reusable/MuiTooltip";
import R6reportTable from "@/table/report/R6reportTable";

const R6Report: React.FC = () => {
  const [type, setType] = useState<string>("min");
  const [min, setMin] = useState<string>("");
  const [date, setDate] = useState<{ from: Dayjs | null; to: Dayjs | null }>({
    from: null,
    to: null,
  });
  const dispatch = useAppDispatch();
  dayjs.extend(customParseFormat);
  const { r6ReportLoading, r6Report } = useAppSelector((state) => state.report);
  const gridRef = useRef<AgGridReact<any>>(null);
  const { RangePicker } = DatePicker;
  const rangePresets: TimeRangePickerProps["presets"] = [
    { label: "Today", value: [dayjs().startOf("day"), dayjs()] },
    { label: "Last 7 Days", value: [dayjs().add(-7, "d"), dayjs()] },
    { label: "Last 14 Days", value: [dayjs().add(-14, "d"), dayjs()] },
    { label: "Current Month", value: [dayjs().startOf("month"), dayjs()] },
    { label: "Previous Month", value: [dayjs().subtract(1, "month").startOf("month"), dayjs().subtract(1, "month").endOf("month")] },
    { label: "Last 3 Months", value: [dayjs().subtract(3, "month").startOf("month"), dayjs()] },
  ];
  const onBtExport = useCallback(() => {
    console.log("click")
    r6Report &&
      gridRef.current!.api.exportDataAsExcel({
        sheetName: "R6 Report", 
        
      });
  }, []);

  return (
    <>
      <div className="h-full bg-white grid grid-cols-[400px_1fr]">
        <div className="h-full border-r border-neutral-300">
          <div className="flex items-center gap-[10px] p-[10px] w-[400px] mt-[20px]">
            <FormControl fullWidth>
              <Select value={type} defaultValue="min" onChange={(e) => setType(e.target.value)}>
                {[
                  { value: "min", label: "MIN", isDisabled: false },
                  { value: "date", label: "Date", isDisabled: false },
                  { value: "serial", label: "Serial", isDisabled: true },
                  { value: "sim", label: "SIM Availibility", isDisabled: true },
                  { value: "docType", label: "Doc Type", isDisabled: true },
                  { value: "sku", label: "SKU", isDisabled: true },
                ].map((item) => (
                  <MenuItem disabled={item.isDisabled} value={item.value} key={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className=" p-[10px]">
            {type === "date" ? (
              <div className="flex flex-col gap-[20px] ">
                <RangePicker
                  required
                  placement="bottomRight"
                  className="w-full h-[50px]"
                  format="DD-MM-YYYY"
                  disabledDate={(current) => current && (current < dayjs().subtract(3, "month") || current > dayjs())}
                  placeholder={["Start date", "End Date"]}
                  value={date.from && date.to ? [date.from, date.to] : null}
                  onChange={(range: [Dayjs | null, Dayjs | null] | null) => {
                    if (range) {
                      setDate({ from: range[0], to: range[1] });
                    } else {
                      setDate({ from: null, to: null });
                    }
                  }}
                  presets={rangePresets}
                />
                <div className="flex justify-between">
                  <LoadingButton
                    loadingPosition="start"
                    onClick={() => {
                      if (!date.from || !date.to) {
                        showToast("Please select date range", "error");
                      } else {
                        dispatch(getr6Report({ type: "DATE", from: dayjs(date.from).format("DD-MM-YYYY"), to: dayjs(date.to).format("DD-MM-YYYY"), data: "" }));
                      }
                    }}
                    variant="contained"
                    loading={r6ReportLoading}
                    disabled={!date || r6ReportLoading}
                    startIcon={<SearchIcon fontSize="small" />}
                  >
                    Search
                  </LoadingButton>
                  <MuiTooltip title="Download" placement="right">
                    <Button
                      disabled={!r6Report}
                      variant="contained"
                      color="primary"
                      style={{
                        borderRadius: "50%",
                        width: 40,
                        height: 40,
                        minWidth: 0,
                        padding: 0,
                      }}
                      onClick={() => onBtExport()}
                      size="small"
                      sx={{ zIndex: 1 }}
                    >
                      <Icons.download />
                    </Button>
                  </MuiTooltip>
                </div>
              </div>
            ) : type === "min" ? (
              <div className="flex flex-col gap-[20px] ">
                <TextField label="MIN" value={min} onChange={(e) => setMin(e.target.value)} />

                <div className="flex items-center justify-between">
                  <LoadingButton
                    className="max-w-max"
                    variant="contained"
                    loading={r6ReportLoading}
                    onClick={() => {
                      if (min) {
                        dispatch(getr6Report({ type: "MINNO", data: min, from: "", to: "" })).then((response: any) => {
                          if (response.payload?.data?.success) {
                          }
                        });
                      } else {
                        showToast("Please enter MIN", "error");
                      }
                    }}
                    startIcon={<SearchIcon fontSize="small" />}
                  >
                    Search
                  </LoadingButton>
                  <MuiTooltip title="Download" placement="right">
                    <Button
                      disabled={!R6Report}
                      variant="contained"
                      color="primary"
                      style={{
                        borderRadius: "50%",
                        width: 40,
                        height: 40,
                        minWidth: 0,
                        padding: 0,
                      }}
                      onClick={() => onBtExport()}
                      size="small"
                      sx={{ zIndex: 1 }}
                    >
                      <Icons.download />
                    </Button>
                  </MuiTooltip>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div>
          <R6reportTable gridRef={gridRef} />
        </div>
      </div>
    </>
  );
};

export default R6Report;
