import React, { useCallback, useRef, useState } from "react";
import { DatePicker, TimeRangePickerProps } from "antd";
import customParseFormat from "dayjs/plugin/customParseFormat";

import dayjs, { Dayjs } from "dayjs";
import { AgGridReact } from "@ag-grid-community/react";
import R4ReportTable from "@/table/report/R4ReportTable";
import SelectSku, { DeviceType } from "@/components/reusable/SelectSku";
import { FormControl, InputLabel,  MenuItem, Select } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import LoadingButton from "@mui/lab/LoadingButton";
import { showToast } from "@/utils/toasterContext";
import DownloadIcon from "@mui/icons-material/Download";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getr4Report } from "@/features/report/report/reportSlice";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import DateRangeIcon from "@mui/icons-material/DateRange";
import ShareLocationIcon from "@mui/icons-material/ShareLocation";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import PersonIcon from "@mui/icons-material/Person";
import R4ReportDetailTable from "@/table/report/R4ReportDetailTable";
import { Skeleton } from "@/components/ui/skeleton";
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;

const R4Report: React.FC = () => {
  const dispatch = useAppDispatch();
  const { r4reportLoading, r4ReportDetail, r4ReportDetailLoading } = useAppSelector((state) => state.report);
  const [filter, setFilter] = useState<string>("DEVICE");
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
    <>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <div className="border-b h-[50px] border-neutral-300 bg-neutral-200 flex items-center px-[20px]">
          <IconButton size="small" edge="start" onClick={handleClose} aria-label="close">
            <CloseIcon fontSize="small" />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div" fontWeight={500} fontSize={18}>
            {r4ReportDetail && (`#${r4ReportDetail?.productionData?.productImei}`)}
            {r4ReportDetailLoading && <Skeleton className="h-[30px] w-[300px]"/>}
          </Typography>
        </div>
        <div className="h-full grid grid-cols-[400px_1fr] w-full ">
          <div className="h-full border-r border-neutral-300">
            <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <LocationCityIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Pick Location" secondary={<>
                {
                  r4ReportDetailLoading ? (
                    <Skeleton className="h-[15px] w-[100px]"/>
                  ):(
                    r4ReportDetail?.productionData?.productionLocation
                  )
                }
                  </>} />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <ShareLocationIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Drop Location" secondary={<>
                {
                  r4ReportDetailLoading ? ( 
                    <Skeleton className="h-[15px] w-[130px]"/>
                  ):(
                    r4ReportDetail?.productionData?.dropLocation
                  )
                }
                  </>} />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <DateRangeIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Insert Date" secondary={<>
                  {
                  r4ReportDetailLoading ? ( 
                    <Skeleton className="h-[15px] w-[150px]"/>
                  ):(
                    r4ReportDetail?.productionData?.insertDate
                  )
                }
                  </>} />
              </ListItem>

              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Insert By" secondary={<>
                  {
                  r4ReportDetailLoading ? ( 
                    <Skeleton className="h-[15px] w-[100px]"/>
                  ):(
                    r4ReportDetail?.productionData?.insertBy
                  )
                }
                  </>} />
              </ListItem>
            </List>
          </div>
          <div className="h-full ">
            <R4ReportDetailTable />
          </div>
        </div>
      </Dialog>
      <div className="bg-white h-[calc(100vh-90px)]">
        <div className="h-[90px] flex items-center justify-between px-[20px] gap-[20px]">
          <div className="flex items-center gap-[10px]">
            <FormControl size="small" sx={{ minWidth: "300px" }}>
              <InputLabel id="demo-simple-select-label">Filter By</InputLabel>
              <Select value={filter} onChange={(e) => setFilter(e.target.value)} labelId="demo-simple-select-label" id="demo-simple-select" label="Filter By">
                <MenuItem value={"DEVICE"}>SKU</MenuItem>
                <MenuItem value={"DATE"}>Date</MenuItem>
              </Select>
            </FormControl>
            {filter === "DEVICE" && <SelectSku width="300px" varient="outlined" onChange={(e) => setDevice(e)} value={device} />}
            {filter === "DATE" && (
              <RangePicker
                className="w-[300px] h-[35px] border-2 rounded-lg border-neutral-300 rounded-0 "
                presets={rangePresets}
                onChange={handleDateChange}
                disabledDate={(current) => current && current > dayjs()}
                placeholder={["Start date", "End Date"]}
                value={date.from && date.to ? [date.from, date.to] : null} // Set value based on `from` and `to`
                format="DD/MM/YYYY" // Update with your desired format
              />
            )}
            <LoadingButton
              loading={r4reportLoading}
              variant="contained"
              startIcon={<FilterAltIcon fontSize="small" />}
              loadingPosition="start"
              onClick={() => {
                if (filter === "DEVICE") {
                  if (!device) {
                    showToast("Please select a device", "error");
                  } else {
                    dispatch(getr4Report({ type: "DEVICE", device: device?.id }));
                  }
                }
                if (filter === "DATE") {
                  if (!date.from || !date.to) {
                    showToast("Please select a date", "error");
                  } else {
                    dispatch(getr4Report({ type: "DATE", from: dayjs(date.from).format("DD-MM-YYYY"), to: dayjs(date.to).format("DD-MM-YYYY") }));
                  }
                }
              }}
            >
              Filter
            </LoadingButton>
          </div>
          <LoadingButton variant="contained" startIcon={<DownloadIcon fontSize="small" />} onClick={onBtExport}>
            Download
          </LoadingButton>
        </div>
        <R4ReportTable setOpen={setOpen} gridRef={gridRef} />
      </div>
    </>
  );
};

export default R4Report;
