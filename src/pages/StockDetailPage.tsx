import React, { useRef, useState } from "react";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { AgGridReact } from "@ag-grid-community/react";
import LoadingButton from "@mui/lab/LoadingButton";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import StockDetailDynamicTable from "@/table/StockDetailDynamicTable";
import SelectDevice, { DeviceType } from "@/components/reusable/SelectSku";
import SelectComponent, { ComponentType } from "@/components/reusable/SelectComponent";
const StockDetailPage: React.FC = () => {
  const [device, setDevice] = useState<DeviceType | null>(null);
  const [compselect, setcompselect] = useState<ComponentType | null>(null);
  const [colapse, setcolapse] = useState<boolean>(false);
  const [type, setType] = useState<string>("device");
  const [location, setLocation] = useState<string>("");
  const [date, setDate] = useState<{ from: Dayjs | null; to: Dayjs | null }>({
    from: null,
    to: null,
  });
  dayjs.extend(customParseFormat);
  const gridRef = useRef<AgGridReact<any>>(null);
  const { RangePicker } = DatePicker;
  return (
    <>
      <div className="h-[100vh] flex bg-white relative">
        <div className={`transition-all flex flex-col gap-[10px] h-[100vh]  border-r border-neutral-300   ${colapse ? "min-w-0 max-w-0" : "min-w-[400px] max-w-[400px] "}`}>
          <div className={`transition-all ${colapse ? "left-0" : "left-[400px]"} w-[16px] p-0  h-full top-0 bottom-0 absolute rounded-none  text-slate-600 z-[10] flex items-center justify-center`}>
            <Button onClick={() => setcolapse(!colapse)} className={`transition-all w-[16px] p-0 py-[35px] bg-neutral-200  rounded-none hover:bg-neutral-300/50 text-slate-600 hover:h-full shadow-sm shadow-neutral-400 duration-300   `}>
              {colapse ? <Icons.right fontSize="small" /> : <Icons.left fontSize="small" />}
            </Button>
          </div>
          <div className="flex flex-col   gap-[20px] p-[20px]   mt-[20px] overflow-hidden">
            <RangePicker
              required
              placement="bottomRight"
              className="w-full h-[50px] border-[2px] rounded-sm border-neutral-400/70 hover:border-neutral-400"
              format="DD-MM-YYYY"
              disabledDate={(current) => current && current > dayjs()}
              placeholder={["Start date", "End Date"]}
              value={date.from && date.to ? [date.from, date.to] : null}
              onChange={(range: [Dayjs | null, Dayjs | null] | null) => {
                if (range) {
                  setDate({ from: range[0], to: range[1] });
                } else {
                  setDate({ from: null, to: null });
                }
              }}
              presets={[
                { label: "Today", value: [dayjs().startOf("day"), dayjs()] },
                { label: "Yesterday", value: [dayjs().add(-1, "d"), dayjs()] },
                { label: "Last 7 Days", value: [dayjs().add(-7, "d"), dayjs()] },
                { label: "Last 14 Days", value: [dayjs().add(-14, "d"), dayjs()] },
                { label: "Current Month", value: [dayjs().startOf("month"), dayjs()] },
              ]}
            />
            <FormControl fullWidth>
              <InputLabel>Select Type</InputLabel>
              <Select label="Select Type" value={type} defaultValue="device" onChange={(e) => setType(e.target.value)}>
                {[
                  { value: "location", label: "Location", isDisabled: false },
                  { value: "device", label: "Device", isDisabled: false },
                  { value: "raw-material", label: "Raw Material", isDisabled: false },
                ].map((item) => (
                  <MenuItem disabled={item.isDisabled} value={item.value} key={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {type === "device" && <SelectDevice value={device} onChange={(value) => setDevice(value)} />}
            {type === "raw-material" && <SelectComponent value={compselect} onChange={(value) => setcompselect(value)} />}
            <FormControl fullWidth>
              <InputLabel>Select Location</InputLabel>
              <Select label="Select Location" value={location} defaultValue="trc" onChange={(e) => setLocation(e.target.value)}>
                {[
                  { value: "trc", label: "TRC", isDisabled: false },
                  { value: "Assembly", label: "Assembly", isDisabled: false },
                  { value: "Inward Store", label: "Inward Store", isDisabled: false },
                  { value: "FG Store", label: " FG Store", isDisabled: false },
                ].map((item) => (
                  <MenuItem disabled={item.isDisabled} value={item.value} key={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div className="flex items-center justify-end">
              <LoadingButton variant="contained" startIcon={<Icons.search />}>
                Search
              </LoadingButton>
            </div>
          </div>
        </div>
        <div className="w-full">
          <StockDetailDynamicTable gridRef={gridRef} />
        </div>
      </div>
    </>
  );
};

export default StockDetailPage;
