import CustomSelect from "@/components/reusable/CustomSelect";
import React, { useCallback, useRef, useState } from "react";
import { DatePicker, TimeRangePickerProps } from "antd";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import DeviceMinReportTable from "@/table/report/DeviceMinReportTable";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { clearR1data, getMainR1Data } from "@/features/report/report/reportSlice";
import { CustomButton } from "@/components/reusable/CustomButton";
import { Search } from "lucide-react";
import CustomInput from "@/components/reusable/CustomInput";
import { AgGridReact } from "@ag-grid-community/react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { replaceBrWithNewLine } from "@/utils/replacebrtag";
import LoadingButton from "@mui/lab/LoadingButton";
import SearchIcon from "@mui/icons-material/Search";
import { Button, Dialog, Divider, FormControl, IconButton, List, ListItem, ListItemText, MenuItem, Paper, Select, Slide, TextField, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import R1reportTable from "@/table/report/R1reportTable";
import { showToast } from "@/utils/toasterContext";
import { TransitionProps } from "@mui/material/transitions";
import { Icons } from "@/components/icons";
import MuiTooltip from "@/components/reusable/MuiTooltip";
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const Deviceinreport: React.FC = () => {
  const [type, setType] = useState<string>("min");
  const [detail, setDetail] = useState<boolean>(false);
  const [min, setMin] = useState<string>("");
  const [date, setDate] = useState<{ from: Dayjs | null; to: Dayjs | null }>({
    from: null,
    to: null,
  });
  const dispatch = useAppDispatch();
  dayjs.extend(customParseFormat);
  const { r1Data, mainR1ReportLoading, mainR1Report } = useAppSelector((state) => state.report);
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
    mainR1Report &&
      gridRef.current!.api.exportDataAsExcel({
        sheetName: "R1 Report", // Set your desired sheet name here
      });
  }, [mainR1Report]);

  return (
    <>
      <Dialog fullScreen open={detail} TransitionComponent={Transition} onClose={() => setDetail(false)}>
        <div className="h-[50px] bg-neutral-200 flex items-center justify-between px-[10px]">
          <Typography variant="h3" fontSize={18} fontWeight={500}>
            <Typography fontWeight={500} fontSize={16}>
              #{min}
            </Typography>
          </Typography>
          <IconButton
            onClick={() => {
              setDetail(false);
              setMin("");
              dispatch(clearR1data());
            }}
          >
            <CloseIcon fontSize="medium" />
          </IconButton>
        </div>
        <Divider />
        <div className="h-full grid grid-cols-[400px_1fr] bg-white">
          <div className="h-full border-r border-neutral-300">
            <Paper elevation={2} className="h-full rounded-md">
              <CardHeader className="p-0 h-[40px] flex justify-center px-[10px] bg-hbg border-b">
                <CardTitle className="font-[500] text-slate-600">Report Detail</CardTitle>
              </CardHeader>
              <CardContent className="p-[10px] h-[calc(100vh-90px)] overflow-y-auto">
                <List>
                  <ListItem>
                    <ListItemText primary="SKU Code" secondary={r1Data ? r1Data?.head?.skuCode : "--"} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="SKU Name" secondary={r1Data ? r1Data?.head?.skuName + r1Data?.head?.uom : "--"} />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText primary="IN Location" secondary={r1Data ? r1Data?.head?.inLoc : "--"} />
                  </ListItem>

                  <ListItem>
                    <ListItemText primary="Vendor Code" secondary={r1Data ? r1Data?.head?.vendorCode : "--"} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Vendor Name" secondary={r1Data ? r1Data?.head?.vendorName : "--"} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Vendor Address" secondary={r1Data ? replaceBrWithNewLine(r1Data?.head?.vendorAddress) : "--"} />
                  </ListItem>
                  <Divider />

                  <ListItem>
                    <ListItemText primary="Doc Type" secondary={r1Data ? r1Data?.head?.docType : "--"} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Doc No." secondary={r1Data ? r1Data?.head?.docNo : "--"} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Doc Date." secondary={r1Data ? r1Data?.head?.docDate : "--"} />
                  </ListItem>
                </List>
              </CardContent>
            </Paper>
          </div>
          <div>
            <div className="h-[calc(100vh-135px)] ">
              <DeviceMinReportTable gridRef={gridRef} />
            </div>
          </div>
        </div>
      </Dialog>
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
                        dispatch(getMainR1Data({ type: "date", from: dayjs(date.from).format("DD-MM-YYYY"), to: dayjs(date.to).format("DD-MM-YYYY"), data: "" }));
                      }
                    }}
                    variant="contained"
                    loading={mainR1ReportLoading}
                    disabled={!date || mainR1ReportLoading}
                    startIcon={<SearchIcon fontSize="small" />}
                  >
                    Search
                  </LoadingButton>
                  <MuiTooltip title="Download" placement="right">
                    <Button
                      disabled={!mainR1Report}
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

                <div className="flex items-center justify-between">
                  <LoadingButton
                    className="max-w-max"
                    variant="contained"
                    loading={mainR1ReportLoading}
                    onClick={() => {
                      if (min) {
                        dispatch(getMainR1Data({ type: "min", data: min, from: "", to: "" })).then((response: any) => {
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
                      disabled={!mainR1Report}
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
          <R1reportTable gridRef={gridRef} setMin={setMin} setOpen={setDetail} />
        </div>
      </div>
    </>
  );
};

export default Deviceinreport;
