import { CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import DeviceQueryRepoTable from "@/table/query/DeviceQueryRepoTable";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { DatePicker, TimeRangePickerProps } from "antd";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getBothComponentData, getQ1Data } from "@/features/query/query/querySlice";
import { Skeleton } from "@/components/ui/skeleton";
import { AgGridReact } from "@ag-grid-community/react";
import { RowData } from "@/features/query/query/queryType";
import { getLocationAsync } from "@/features/wearhouse/Divicemin/devaiceMinSlice";

import { Button, CardContent, Paper, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SearchIcon from "@mui/icons-material/Search";
import MuiTooltip from "@/components/reusable/MuiTooltip";
import SelectSku, { DeviceType } from "@/components/reusable/SelectSku";
import SelectLocation, { LocationType } from "@/components/reusable/SelectLocation";
import { showToast } from "../../utils/toasterContext";
import { Icons } from "@/components/icons";

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;
const DeviceQuery: React.FC = () => {
  const [filterType, _] = useState<string>("");
  const gridRef = useRef<AgGridReact<RowData>>(null);
  const dispatch = useAppDispatch();
  const { q1Data, getQ1DataLoading } = useAppSelector((state) => state.query);
  const [date, setDate] = useState<{ from: Dayjs | null; to: Dayjs | null }>({
    from: null,
    to: null,
  });
  const [value, setValue] = useState<DeviceType | null>(null);
  const [location, setLocation] = useState<LocationType | null>(null);
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
      sheetName: "Q1-Statement", // Set your desired sheet name here
    });
  }, []);

  useEffect(() => {
    dispatch(getBothComponentData(null));
    dispatch(getLocationAsync(null));
  }, []);

  return (
    <div>
      <div className="grid grid-cols-[400px_1fr]  ">
        <div className="p-[10px] flex flex-col gap-[10px] h-[calc(100vh-90px)] overflow-y-auto border-r border-neutral-300">
          <Paper elevation={2} className="rounded-md ">
            <CardContent className="relative">
              <div className="py-[20px] flex flex-col gap-[30px]">
                <div>
                  <SelectSku
                    varient="outlined"
                    size="medium"
                    value={value}
                    onChange={(value) => {
                      setValue(value);
                    }}
                  />
                </div>
                <div className="relative h-[90px] overflow-hidden w-full">
                  <div className="flex justify-end w-full">
                    {/* {filterType === "location" ? (
                      <Button onClick={() => setFilterType("")} variant="link" className="p-0 max-h-max text-cyan-600 font-[400] text-[13px] flex items-center gap-[5px] mb-[3px]">
                        <FaChevronLeft className="h-[10px] w-[10px]" />
                        Date Range
                      </Button>
                    ) : (
                      <Button onClick={() => setFilterType("location")} variant="link" className="p-0 max-h-max text-cyan-600 font-[400] text-[13px] mb-[3px]">
                        Location
                        <FaChevronRight className="h-[10px] w-[10px]" />
                      </Button>
                    )} */}
                  </div>
                  <div className={`absolute transition-all ${filterType === "location" ? "left-[-400px]" : "left-0"} `}>
                    <RangePicker
                      className="w-[330px] h-[50px]"
                      presets={rangePresets}
                      onChange={handleDateChange}
                      disabledDate={(current) => current && current > dayjs()}
                      placeholder={["Start date", "End Date"]}
                      value={date.from && date.to ? [date.from, date.to] : null} // Set value based on `from` and `to`
                      format="DD/MM/YYYY" // Update with your desired format
                    />
                  </div>
                  <div className={`absolute transition-all ${filterType === "location" ? "right-0" : "right-[-400px]"} w-full `}>
                    <SelectLocation value={location} onChange={(e) => setLocation(e)} size="medium" varient="outlined" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="h-[50px] p-0 flex items-center justify-between px-[20px] border-t gap-[10px]">
              <LoadingButton
                loading={getQ1DataLoading}
                onClick={() => {
                  if (filterType === "location") {
                    if (value && location) {
                      dispatch(getQ1Data({ date: date ? `${dayjs(date.from).format("DD-MM-YYYY")}_to_${dayjs(date.to).format("DD-MM-YYYY")}` : null, value: value.id, location: location ? location.id : null })).then((res: any) => {
                        if (!res.payload?.data?.success) {
                          showToast(res.payload?.data?.message, "error");
                        }
                      });
                    } else {
                      showToast("Please select SKU and location", "error");
                    }
                  } else {
                    if (value && date) {
                      dispatch(getQ1Data({ date: date ? `${dayjs(date.from).format("DD-MM-YYYY")}_to_${dayjs(date.to).format("DD-MM-YYYY")}` : null, value: value.id, location: location ? location.id : null })).then((res: any) => {
                        if (!res.payload?.data?.success) {
                          showToast(res.payload?.data?.message, "error");
                        }
                      });
                    } else {
                      showToast("Please select SKU and Date", "error");
                    }
                  }
                }}
                type="submit"
                startIcon={<SearchIcon fontSize="small" />}
                variant="contained"
                loadingPosition="start"
              >
                Search
              </LoadingButton>
              <div className="flex items-center gap-[5px]">
                <MuiTooltip title="Download" placement="right">
                  <Button
                    disabled={!q1Data || q1Data.body.length === 0}
                    variant="contained"
                    color="primary"
                    style={{
                      borderRadius: "50%",
                      width: 30,
                      height: 30,
                      minWidth: 0,
                      padding: 0,
                    }}
                    onClick={() => onBtExport()}
                    size="small"
                    sx={{ zIndex: 1 }}
                  >
                    <Icons.download fontSize="small" />
                  </Button>
                </MuiTooltip>
              </div>
            </CardFooter>
          </Paper>
          <Paper elevation={2} className="rounded-md ">
            <CardHeader className="p-0 h-[40px] flex justify-center px-[10px] bg-hbg border-b">
              <Typography className=" text-slate-600" fontWeight={600}>
                Device Info
              </Typography>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-[5px]">
                <li className="py-[5px] border-b flex flex-col text-slate-500">
                  <span className="font-[500]">Name</span>
                  {getQ1DataLoading ? <Skeleton className="h-[20px] w-full" /> : <span className="text-[13px] ">{q1Data?.head?.name || "--"}</span>}
                </li>
                <li className="py-[5px] border-b flex flex-col text-slate-500">
                  <span className="font-[500]">SKU</span>
                  {getQ1DataLoading ? <Skeleton className="h-[20px] w-full" /> : <span className="text-[13px] ">{q1Data?.head?.code || "--"}</span>}
                </li>
                <li className="py-[5px] border-b flex flex-col text-slate-500">
                  <span className="font-[500]">Unit</span>
                  {getQ1DataLoading ? <Skeleton className="h-[20px] w-full" /> : <span className="text-[13px] ">{q1Data?.head?.uom || "--"}</span>}
                </li>
              </ul>
            </CardContent>
          </Paper>
          <Paper elevation={2} className="rounded-md ">
            <CardHeader className="p-0 h-[40px] flex justify-center px-[10px] bg-hbg border-b">
              <CardTitle className="font-[600] text-slate-600">Stock Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-[5px]">
                <li className="py-[5px] border-b flex flex-col text-slate-500">
                  <span className="font-[500]">Openning Qty</span>
                  {getQ1DataLoading ? <Skeleton className="h-[20px] w-full" /> : <span className="text-[13px] ">{q1Data?.head?.openingQty}</span>}
                </li>
                <li className="py-[5px] border-b flex flex-col text-slate-500">
                  <span className="font-[500]">Closing Qty</span>
                  {getQ1DataLoading ? <Skeleton className="h-[20px] w-full" /> : <span className="text-[13px] ">{q1Data?.head?.closingQty || "--"}</span>}
                </li>
              </ul>
            </CardContent>
          </Paper>
        </div>
        <DeviceQueryRepoTable gridRef={gridRef} />
      </div>
    </div>
  );
};

export default DeviceQuery;
