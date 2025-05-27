import React, { useCallback, useRef, useState } from "react";
import { DatePicker } from "antd";
import customParseFormat from "dayjs/plugin/customParseFormat";

import dayjs, { Dayjs } from "dayjs";
import { AgGridReact } from "@ag-grid-community/react";

import SelectSku, { DeviceType } from "@/components/reusable/SelectSku";
import { Divider, Drawer, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { showToast } from "@/utils/toasterContext";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getr5Report } from "@/features/report/report/reportSlice";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import R5ReportTable from "@/table/report/R5ReportTable";
import R5ReportDetail from "@/table/report/R5ReportDetail";
import { rangePresets } from "@/utils/rangePresets";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import MuiTooltip from "@/components/reusable/MuiTooltip";

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;

import * as XLSX from "xlsx";

interface DataItem {
  slNo: string;
  insert_dt: string;
  shipLabel: string;
  shipToCity: string;
  p_name: string;
  imei: string;
  nfc_enable: string | null;
  iccid: string | null;
  qr_url: string | null;
}

const downloadExcel = (data: DataItem[]): void => {
  const columns = [
    { header: "Date", field: "insert_dt" },
    { header: "Shipment Label", field: "shipLabel" },
    { header: "Shipment City", field: "shipToCity" },
    { header: "Model Name", field: "p_name" },
    { header: "IMEI/SR No.", field: "imei" },
    { header: "SR No.", field: "imei" },
    { header: "NFC Enable", field: "nfc_enable" },
    { header: "SIM", field: "iccid" },
    { header: "QR URL", field: "qr_url" },
  ];

  // Map data to match column headers
  const formattedData = data?.map((item) => {
    return columns.reduce((acc: Record<string, string>, col) => {
      acc[col.header] = item[col.field as keyof DataItem] ?? ""; // Handle null/undefined values
      return acc;
    }, {});
  });

  // Create worksheet and workbook
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Download the Excel file
  XLSX.writeFile(workbook, "DisatchReport.xlsx");
};
const R5report: React.FC = () => {
  const [colapse, setcolapse] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { r5reportLoading, r5report, r5reportDetail } = useAppSelector((state) => state.report);
  const [filter, setFilter] = useState<string>("DATE");
  const [txn, setTxn] = useState<string>("");
  const [device, setDevice] = useState<DeviceType | null>(null);
  const [type, setType] = useState<string>("soundBox");
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
  const onBtExportDetail = () => {
    if (r5reportDetail) {
      downloadExcel(r5reportDetail);
    }
  };
  return (
    <>
      <Drawer anchor="right" open={open} onClose={handleClose}>
        <div className="h-[50px] min-w-[80vw]  flex items-center justify-between px-[10px] gap-[5px]">
          <div>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
            #{txn}
          </div>
          <IconButton disabled={!r5reportDetail} onClick={onBtExportDetail}>
            <Icons.download/>
          </IconButton>
        </div>
        <Divider />
        <R5ReportDetail />
      </Drawer>
      <div className="bg-white h-[calc(100vh-100px)] overflow-x-hidden relative flex">
        <div className={`transition-all flex flex-col gap-[10px] h-[calc(100vh-100px)]  border-r border-neutral-300   ${colapse ? "min-w-0 max-w-0" : "min-w-[400px] max-w-[400px] "}`}>
          <div className={`transition-all ${colapse ? "left-0" : "left-[400px]"} w-[16px] p-0  h-full top-0 bottom-0 absolute rounded-none  text-slate-600 z-[10] flex items-center justify-center`}>
            <Button onClick={() => setcolapse(!colapse)} className={`transition-all w-[16px] p-0 py-[35px] bg-neutral-200  rounded-none hover:bg-neutral-300/50 text-slate-600 hover:h-full shadow-sm shadow-neutral-400 duration-300   `}>
              {colapse ? <Icons.right fontSize="small" /> : <Icons.left fontSize="small" />}
            </Button>
          </div>
          <div className="flex flex-col gap-[20px]  mt-[20px] p-[20px] overflow-hidden">
          <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Device Type</InputLabel>
              <Select value={type} onChange={(e) => setType(e.target.value)} labelId="demo-simple-select-label" id="demo-simple-select" label="Device Type">
                <MenuItem value={"soundBox"}>Sound Box</MenuItem>
                <MenuItem value={"swipeMachine"}>Swipe Machine</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Filter By</InputLabel>
              <Select value={filter} onChange={(e) => setFilter(e.target.value)} labelId="demo-simple-select-label" id="demo-simple-select" label="Filter By">
                <MenuItem value={"DEVICE"}>SKU</MenuItem>
                <MenuItem value={"DATE"}>Date</MenuItem>
              </Select>
            </FormControl>
            {filter === "DEVICE" && <SelectSku varient="outlined" onChange={(e) => setDevice(e)} value={device} />}
            {filter === "DATE" && (
              <RangePicker
                className="w-full  h-[50px] border-2 rounded-lg border-neutral-300 rounded-0 "
                presets={rangePresets}
                onChange={handleDateChange}
                disabledDate={(current) => current && current > dayjs()}
                placeholder={["Start date", "End Date"]}
                value={date.from && date.to ? [date.from, date.to] : null} // Set value based on `from` and `to`
                format="DD-MM-YYYY" // Update with your desired format
              />
            )}
            <div className="flex items-center justify-between">
              <LoadingButton
                loading={r5reportLoading}
                variant="contained"
                startIcon={<Icons.search fontSize="small" />}
                loadingPosition="start"
                onClick={() => {
                  if (filter === "DEVICE") {
                    if (!device) {
                      showToast("Please select a device", "error");
                    } else {
                      dispatch(getr5Report({ type: "DEVICE", device: device?.id, deviceType: type }));
                    }
                  }
                  if (filter === "DATE") {
                    if (!date.from || !date.to) {
                      showToast("Please select a date", "error");
                    } else {
                      dispatch(getr5Report({ type: "DATE", from: dayjs(date.from).format("DD-MM-YYYY"), to: dayjs(date.to).format("DD-MM-YYYY"), deviceType: type }));
                    }
                  }
                }}
              >
                Search
              </LoadingButton>

              <MuiTooltip title="Download" placement="right">
                <LoadingButton
                  variant="contained"
                  disabled={!r5report}
                  onClick={onBtExport}
                  color="primary"
                  style={{
                    borderRadius: "50%",
                    width: 30,
                    height: 30,
                    minWidth: 0,
                    padding: 0,
                  }}
                  size="small"
                  sx={{ zIndex: 1 }}
                >
                  <Icons.download fontSize="small" />
                </LoadingButton>
              </MuiTooltip>
            </div>
          </div>
        </div>
        <div className="w-full">
          <R5ReportTable setTxn={setTxn} setOpen={setOpen} gridRef={gridRef} />
        </div>
      </div>
    </>
  );
};

export default R5report;
