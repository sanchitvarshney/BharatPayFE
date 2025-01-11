import React, { useEffect, useState } from "react";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import LoadingButton from "@mui/lab/LoadingButton";
import { FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import StockDetailDynamicTable from "@/table/StockDetailDynamicTable";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { showToast } from "@/utils/toasterContext";
import { clearStoredDeviceData, getDeviceDetail } from "@/features/Dashboard/Dashboard";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
const StockDetailPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { deviceData, devicedataLoading } = useAppSelector((state) => state.dashboard);
  const [colapse, setcolapse] = useState<boolean>(false);
  const [type, setType] = useState<string>("device");
  const [date, setDate] = useState<{ from: Dayjs | null; to: Dayjs | null }>({
    from: null,
    to: null,
  });
  dayjs.extend(customParseFormat);
  const { RangePicker } = DatePicker;

  useEffect(() => {
    dispatch(clearStoredDeviceData());
  }, []);
  return (
    <>
      <div className="h-[100vh] flex bg-white relative overflow-y-hidden">
        <div className={`transition-all flex flex-col gap-[10px] h-[100vh]  border-r border-neutral-300 overflow-hidden   ${colapse ? "min-w-0 max-w-0" : "min-w-[400px] max-w-[400px] "}`}>
          <div className={`transition-all ${colapse ? "left-0" : "left-[400px]"} w-[16px] p-0  h-full top-0 bottom-0 absolute rounded-none  text-slate-600 z-[10] flex items-center justify-center`}>
            <Button onClick={() => setcolapse(!colapse)} className={`transition-all w-[16px] p-0 py-[35px] bg-neutral-200  rounded-none hover:bg-neutral-300/50 text-slate-600 hover:h-full shadow-sm shadow-neutral-400 duration-300   `}>
              {colapse ? <Icons.right fontSize="small" /> : <Icons.left fontSize="small" />}
            </Button>
          </div>
          <div className="flex flex-col   gap-[20px] p-[20px]   mt-[20px] overflow-hidden">
            <FormControl fullWidth>
              <InputLabel>Select Type</InputLabel>
              <Select label="Select Type" value={type} defaultValue="device" onChange={(e) => setType(e.target.value)}>
                {[
                  { value: "location", label: "Location", isDisabled: true },
                  { value: "device", label: "Device", isDisabled: false },
                  { value: "raw-material", label: "Raw Material", isDisabled: true },
                ].map((item) => (
                  <MenuItem disabled={item.isDisabled} value={item.value} key={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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

            <div className="flex items-center justify-end">
              <LoadingButton
                loadingPosition="start"
                loading={devicedataLoading}
                onClick={() => {
                  if (!date.from || !date.to) {
                    showToast("Please select date range");
                    return;
                  }
                  dispatch(getDeviceDetail({ from: dayjs(date.from).format("DD-MM-YYYY"), to: dayjs(date.to).format("DD-MM-YYYY") }));
                }}
                variant="contained"
                startIcon={<Icons.search />}
              >
                Search
              </LoadingButton>
            </div>
          </div>
        </div>
        <div className="w-full relative h-[100vh] overflow-y-auto bg-neutral-100 ">
          <div className=" sticky top-0 z-[10] bg-white py-[10px] px-[20px] border-b border-neutral-300">
            <Typography fontWeight={600} fontSize={25} className="text-slate-600">
              Location Wise Device Stock Detail
            </Typography>
          </div>

          <div className="p-[20px] flex flex-col gap-[20px] h-full">
            {devicedataLoading || !deviceData ? (
              <div className="flex items-center justify-center w-full h-full">
                <img src="/empty.png" className="w-[110px]" alt="No Data" />
              </div>
            ) : (
              deviceData?.map((item, i) => (
                <div>
                  <Accordion defaultExpanded={i === 0}>
                    <AccordionSummary expandIcon={<ArrowDropDownIcon />} aria-controls="panel2-content" id="panel2-header">
                      <Typography fontWeight={600} fontSize={20} className="text-slate-600">
                        {item.locationName}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div className="table w-full border border-neutral-300">
                        <StockDetailDynamicTable data={item.products} />
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default StockDetailPage;
