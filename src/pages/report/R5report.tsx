import React, { useCallback, useRef, useState } from "react";
import { DatePicker } from "antd";
import customParseFormat from "dayjs/plugin/customParseFormat";

import dayjs, { Dayjs } from "dayjs";
import { AgGridReact } from "@ag-grid-community/react";

import SelectSku, { DeviceType } from "@/components/reusable/SelectSku";
import { Divider, Drawer, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import LoadingButton from "@mui/lab/LoadingButton";
import { showToast } from "@/utils/toasterContext";
import DownloadIcon from "@mui/icons-material/Download";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getr5Report } from "@/features/report/report/reportSlice";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import R5ReportTable from "@/table/report/R5ReportTable";
import R5ReportDetail from "@/table/report/R5ReportDetail";
import { rangePresets } from "@/utils/rangePresets";

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;

const R5report: React.FC = () => {
  const dispatch = useAppDispatch();
  const { r5reportLoading, r5report } = useAppSelector((state) => state.report);
  const [filter, setFilter] = useState<string>("DATE");
  const [txn, setTxn] = useState<string>("");
  const [device, setDevice] = useState<DeviceType | null>(null);
  const [date, setDate] = useState<{ from: Dayjs | null; to: Dayjs | null }>({
    from: null,
    to: null,
  });
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const gridRef = useRef<AgGridReact<any>>(null);

  const handleDateChange = (range: [Dayjs | null, Dayjs | null] | null) => {
    if (range) {
      setDate({ from: range[0], to: range[1] });
    } else {
      setDate({ from: null, to: null });
    }
  };
  const onBtExport = useCallback(() => {
    gridRef.current!.api.exportDataAsExcel({
      sheetName: "R5 Report", // Set your desired sheet name here
    });
  }, []);
  return (
    <>
      <Drawer anchor="right" open={open} onClose={handleClose}>
        <div className="h-[50px] w-[400px] flex items-center px-[10px] gap-[5px]">
          <IconButton onClick={handleClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
          #{txn}
        </div>
        <Divider />
        <R5ReportDetail />
      </Drawer>
      <div className="bg-white h-[calc(100vh-90px)] overflow-x-hidden">
        <div className="h-[90px] flex items-center justify-between px-[20px] gap-[20px]">
          <div className="flex items-center gap-[10px]">
            <FormControl sx={{ minWidth: "300px" }}>
              <InputLabel id="demo-simple-select-label">Filter By</InputLabel>
              <Select value={filter} onChange={(e) => setFilter(e.target.value)} labelId="demo-simple-select-label" id="demo-simple-select" label="Filter By">
                <MenuItem value={"DEVICE"}>SKU</MenuItem>
                <MenuItem value={"DATE"}>Date</MenuItem>
              </Select>
            </FormControl>
            {filter === "DEVICE" && <SelectSku width="300px" varient="outlined" onChange={(e) => setDevice(e)} value={device} />}
            {filter === "DATE" && (
              <RangePicker
                className="w-[300px]  h-[50px] border-2 rounded-lg border-neutral-300 rounded-0 "
                presets={rangePresets}
                onChange={handleDateChange}
                disabledDate={(current) => current && current > dayjs()}
                placeholder={["Start date", "End Date"]}
                value={date.from && date.to ? [date.from, date.to] : null} // Set value based on `from` and `to`
                format="DD/MM/YYYY" // Update with your desired format
              />
            )}
            <LoadingButton
              loading={r5reportLoading}
              variant="contained"
              startIcon={<FilterAltIcon fontSize="small" />}
              loadingPosition="start"
              onClick={() => {
                if (filter === "DEVICE") {
                  if (!device) {
                    showToast("Please select a device", "error");
                  } else {
                    dispatch(getr5Report({ type: "DEVICE", device: device?.id }));
                  }
                }
                if (filter === "DATE") {
                  if (!date.from || !date.to) {
                    showToast("Please select a date", "error");
                  } else {
                    dispatch(getr5Report({ type: "DATE", from: dayjs(date.from).format("DD-MM-YYYY"), to: dayjs(date.to).format("DD-MM-YYYY") }));
                  }
                }
              }}
            >
              Filter
            </LoadingButton>
          </div>
          <LoadingButton disabled={!r5report} variant="contained" startIcon={<DownloadIcon fontSize="small" />} onClick={onBtExport}>
            Download
          </LoadingButton>
        </div>
        <R5ReportTable setTxn={setTxn} setOpen={setOpen} gridRef={gridRef} />
      </div>
    </>
  );
};

export default R5report;
