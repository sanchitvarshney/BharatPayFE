import CustomSelect from "@/components/reusable/CustomSelect";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { DatePicker, TimeRangePickerProps } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import DeviceMinReportTable from "@/table/report/DeviceMinReportTable";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getR1Data } from "@/features/report/report/reportSlice";
import { CustomButton } from "@/components/reusable/CustomButton";
import { Search } from "lucide-react";
import CustomInput from "@/components/reusable/CustomInput";
import { convertDateRange } from "@/utils/converDateRangeUtills";
import { AgGridReact } from "@ag-grid-community/react";
import { showToast } from "@/utils/toastUtils";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { replaceBrWithNewLine } from "@/utils/replacebrtag";
import LoadingButton from "@mui/lab/LoadingButton";
import SearchIcon from "@mui/icons-material/Search";
import { Divider, Drawer, FormControl, IconButton, List, ListItem, ListItemText, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
const Deviceinreport: React.FC = () => {
  const [filter, setFilter] = useState<boolean>(false);
  const [type, setType] = useState<string>("min");
  const [date, setDate] = useState<string | null>(null);
  const [min, setMin] = useState<string>("");
  const dispatch = useAppDispatch();
  dayjs.extend(customParseFormat);
  const { getR1DataLoading, r1Data } = useAppSelector((state) => state.report);
  const gridRef = useRef<AgGridReact<any>>(null);
  const { RangePicker } = DatePicker;
  const rangePresets: TimeRangePickerProps["presets"] = [
    { label: "Today", value: [dayjs().startOf("day"), dayjs()] },
    { label: "Last 7 Days", value: [dayjs().add(-7, "d"), dayjs()] },
    { label: "Last 14 Days", value: [dayjs().add(-14, "d"), dayjs()] },
    { label: "Current Month", value: [dayjs().startOf("month"), dayjs()] },
    { label: "Last 3 Months", value: [dayjs().subtract(3, "month").startOf("month"), dayjs()] },
  ];
  const onBtExport = useCallback(() => {
    r1Data &&
      gridRef.current!.api.exportDataAsExcel({
        sheetName: "R1 Report", // Set your desired sheet name here
      });
  }, []);

  useEffect(() => {
    if (!filter) {
      setType("");
      setDate(null);
      setMin("");
    }
  }, [filter]);

  return (
    <>
      <Drawer anchor={"right"} open={filter} onClose={() => setFilter(false)}>
        <div className="h-[50px] bg-neutral-200 flex items-center justify-between px-[10px]">
          <Typography variant="h3" fontSize={18} fontWeight={500}>
            Filter
          </Typography>
          <IconButton onClick={() => setFilter(false)}>
            <CloseIcon fontSize="medium" />
          </IconButton>
        </div>
        <Divider />
        <div className="flex items-center gap-[10px] p-[10px] w-[400px] mt-[20px]">
          <FormControl fullWidth>
            <Select value={type} onChange={(e) => setType(e.target.value)}>
              {[
                { value: "min", label: "MIN", isDisabled: false },
                { value: "date", label: "Date", isDisabled: true },
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
            <div className="flex flex-col gap-[20px] opacity-60 pointer-events-none cursor-not-allowed">
              <RangePicker
                required
                placement="bottomRight"
                className="w-full"
                format="DD-MM-YYYY"
                disabledDate={(current) => current && (current < dayjs().subtract(3, "month") || current > dayjs())}
                onChange={(e: any) => {
                  setDate(convertDateRange(e));
                }}
                presets={rangePresets}
              />
              <div className="flex justify-end">
                <LoadingButton variant="contained" loading={getR1DataLoading} disabled={!date || getR1DataLoading} startIcon={<SearchIcon fontSize="small" />}>
                  Search
                </LoadingButton>
              </div>
            </div>
          ) : type === "serial" ? (
            <div className="flex flex-col gap-[20px] opacity-60 pointer-events-none">
              <CustomInput required label="Serial No." />
              <RangePicker
                required
                placement="bottomRight"
                className="w-full"
                format="DD-MM-YYYY"
                disabledDate={(current) => current && (current < dayjs().subtract(3, "month") || current > dayjs())}
                onChange={(e: any) => {
                  console.log(e);
                }}
                presets={rangePresets}
              />
              <CustomButton icon={<Search className="h-[18px] w-[18px]" />} className="bg-cyan-700 hover:bg-cyan-800 max-w-max">
                Search
              </CustomButton>
            </div>
          ) : type === "sim" ? (
            <div className="flex flex-col gap-[20px] opacity-60 pointer-events-none cursor-not-allowed">
              <CustomSelect
                placeholder={"SIM Availibility"}
                className="w-full"
                options={[
                  { value: "Yes", label: "Yes" },
                  { value: "No", label: "No" },
                ]}
              />
              <RangePicker
                required
                placement="bottomRight"
                className="w-full"
                format="DD-MM-YYYY"
                disabledDate={(current) => current && (current < dayjs().subtract(3, "month") || current > dayjs())}
                onChange={(e: any) => {
                  console.log(e);
                }}
                presets={rangePresets}
              />
              <CustomButton icon={<Search className="h-[18px] w-[18px]" />} className="bg-cyan-700 hover:bg-cyan-800 max-w-max">
                Search
              </CustomButton>
            </div>
          ) : type === "docType" ? (
            <div className="flex flex-col gap-[20px] opacity-60 pointer-events-none cursor-not-allowed">
              <CustomSelect
                required
                placeholder={"Document Type"}
                className="w-full"
                options={[
                  { value: "CHL", label: "Challan" },
                  { value: "INV", label: "Invoice" },
                ]}
              />
              <RangePicker
                placement="bottomRight"
                className="w-full"
                format="DD-MM-YYYY"
                disabledDate={(current) => current && (current < dayjs().subtract(3, "month") || current > dayjs())}
                onChange={(e: any) => {
                  console.log(e);
                }}
                presets={rangePresets}
              />
              <CustomButton icon={<Search className="h-[18px] w-[18px]" />} className="bg-cyan-700 hover:bg-cyan-800 max-w-max">
                Search
              </CustomButton>
            </div>
          ) : type === "sku" ? (
            <div className="flex flex-col gap-[20px] opacity-60 pointer-events-none cursor-not-allowed">
              <CustomInput label="SKU" required />
              <RangePicker
                placement="bottomRight"
                className="w-full"
                format="DD-MM-YYYY"
                disabledDate={(current) => current && (current < dayjs().subtract(3, "month") || current > dayjs())}
                onChange={(e: any) => {
                  console.log(e);
                }}
                presets={rangePresets}
              />
              <CustomButton icon={<Search className="h-[18px] w-[18px]" />} className="bg-cyan-700 hover:bg-cyan-800 max-w-max">
                Search
              </CustomButton>
            </div>
          ) : type === "min" ? (
            <div className="flex flex-col gap-[20px] ">
              <TextField label="MIN" value={min} onChange={(e) => setMin(e.target.value)} />

              <LoadingButton
                variant="contained"
                loading={getR1DataLoading}
                onClick={() => {
                  if (min) {
                    dispatch(getR1Data({ type: "min", data: min })).then((response: any) => {
                      if (response.payload?.data?.success) {
                        setFilter(false);
                      }
                    });
                  } else {
                    showToast({
                      description: "Please enter MIN",
                      variant: "destructive",
                    });
                  }
                }}
                startIcon={<SearchIcon fontSize="small" />}
              >
                Search
              </LoadingButton>
            </div>
          ) : null}
        </div>
      </Drawer>

      <div className="h-full grid grid-cols-[400px_1fr] bg-white">
        <div className="h-full border-r border-neutral-300">
          <Paper elevation={2} className="h-full rounded-md">
            <CardHeader className="p-0 h-[40px] flex justify-center px-[10px] bg-hbg border-b">
              <CardTitle className="font-[500] text-slate-600">Report Detail</CardTitle>
            </CardHeader>
            <CardContent className="p-[10px] h-[calc(100vh-130px)] overflow-y-auto">
              <List>
                <ListItem>
                  <ListItemText primary="SKU Code" secondary={r1Data ? r1Data.head.skuCode : "--"} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="SKU Name" secondary={r1Data ? r1Data.head.skuName + r1Data.head.uom : "--"} />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText primary="IN Location" secondary={r1Data ? r1Data.head.inLoc : "--"} />
                </ListItem>

                <ListItem>
                  <ListItemText primary="Vendor Code" secondary={r1Data ? r1Data.head.vendorCode : "--"} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Vendor Name" secondary={r1Data ? r1Data.head.vendorName : "--"} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Vendor Address" secondary={r1Data ? replaceBrWithNewLine(r1Data.head.vendorAddress) : "--"} />
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemText primary="Doc Type" secondary={r1Data ? r1Data.head.docType : "--"} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Doc No." secondary={r1Data ? r1Data.head.docNo : "--"} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Doc Date." secondary={r1Data ? r1Data.head.docDate : "--"} />
                </ListItem>
              </List>
            </CardContent>
          </Paper>
        </div>
        <div>
          <div className="h-[50px] px-[10px] bg-white shadow flex items-center justify-between gap-[20px]">
            <div></div>
            <div className="flex gap-[10px] items-center">
              <LoadingButton onClick={onBtExport} startIcon={<FileDownloadIcon fontSize="small" />} variant="contained">
                Download
              </LoadingButton>
              <LoadingButton variant="contained" onClick={() => setFilter(true)} startIcon={<FilterAltIcon fontSize="small" />} endIcon={<KeyboardArrowRightIcon fontSize="small" />}>
                Filter
              </LoadingButton>
            </div>
          </div>
          <div className="h-[calc(100vh-135px)] ">
            <DeviceMinReportTable gridRef={gridRef} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Deviceinreport;
