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
import R5ReportDetail from "@/table/report/R5ReportDetail";
import { rangePresets } from "@/utils/rangePresets";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import MuiTooltip from "@/components/reusable/MuiTooltip";

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;
import { getChallan } from "@/features/Dispatch/DispatchSlice";
import ChallanTable from "@/pages/ewayBill/ChallanTable";

const ManageChallan: React.FC = () => {
  const [colapse, setcolapse] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { getChallanLoading, challanList } = useAppSelector((state) => state.dispatch);
  const [filter, setFilter] = useState<string>("DATE");
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

  // const onBtExportDetail = () => {
  //   if () {
  //     downloadExcel(r5reportDetail);
  //   }
  // };

  return (
    <>
      <Drawer anchor="right" open={open} onClose={handleClose}>
        <div className="h-[50px] min-w-[80vw]  flex items-center justify-between px-[10px] gap-[5px]">
          {/* <IconButton disabled={!challanList} onClick={onBtExportDetail}>
            <Icons.download/>
          </IconButton> */}
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
                loading={getChallanLoading}
                variant="contained"
                startIcon={<Icons.search fontSize="small" />}
                loadingPosition="start"
                onClick={() => {
                  if (filter === "DATE") {
                    if (!date.from || !date.to) {
                      showToast("Please select a date", "error");
                    } else {
                      dispatch(getChallan({ type: "DATE", from: dayjs(date.from).format("DD-MM-YYYY"), to: dayjs(date.to).format("DD-MM-YYYY") }));
                    }
                  }
                }}
              >
                Search
              </LoadingButton>

              <MuiTooltip title="Download" placement="right">
                <LoadingButton
                  variant="contained"
                  disabled={!challanList}
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
          <ChallanTable gridRef={gridRef}/>
        </div>
      </div>
    </>
  );
};

export default ManageChallan;
