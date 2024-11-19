import { CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { DatePicker, TimeRangePickerProps } from "antd";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getQ2Data } from "@/features/query/query/querySlice";
import { Skeleton } from "@/components/ui/skeleton";
import Q2ReportTable from "@/table/query/Q2ReportTable";
import { getPertCodesync } from "@/features/production/MaterialRequestWithoutBom/MRRequestWithoutBomSlice";
import { RowData } from "@/features/query/query/queryType";
import { AgGridReact } from "@ag-grid-community/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { CardContent, IconButton, Paper } from "@mui/material";
import SelectComponent, { ComponentType } from "@/components/reusable/SelectComponent";
import SelectLocation, { LocationType } from "@/components/reusable/SelectLocation";
import LoadingButton from "@mui/lab/LoadingButton";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import FilterIcon from "@mui/icons-material/Filter";
import { showToast } from "@/utils/toasterContext";
dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;
const Q2Statement: React.FC = () => {
  const [date, setDate] = useState<{ from: Dayjs | null; to: Dayjs | null }>({
    from: null,
    to: null,
  });
  const [filterType, setFilterType] = useState<string>("");
  const gridRef = useRef<AgGridReact<RowData>>(null);
  const dispatch = useAppDispatch();
  const { q2Data, getQ2DataLading } = useAppSelector((state) => state.query);
  const [value, setValue] = useState<ComponentType | null>(null);
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
    gridRef.current!.api.exportDataAsExcel();
  }, []);

  useEffect(() => {
    // dispatch(getQ1Data());
    dispatch(getPertCodesync(null));
  }, []);

  return (
    <div>
      <div className="grid grid-cols-[400px_1fr]">
        <div className="p-[10px] flex flex-col gap-[10px] h-[calc(100vh-90px)] overflow-y-auto">
          <Paper elevation={2} className="rounded-md ">
            <CardContent>
              <div className="py-[20px] flex flex-col gap-[30px]">
                <div>
                  <SelectComponent value={value} onChange={(e) => setValue(e)} label="-- Part --" />
                </div>
                <div className="relative h-[90px] overflow-hidden">
                  <div className="flex justify-end">
                    {filterType === "location" ? (
                      <Button onClick={() => setFilterType("")} variant="link" className="p-0 max-h-max text-cyan-600 font-[400] text-[13px] flex items-center gap-[5px] mb-[3px]">
                        <FaChevronLeft className="h-[10px] w-[10px]" />
                        Date Range
                      </Button>
                    ) : (
                      <Button onClick={() => setFilterType("location")} variant="link" className="p-0 max-h-max text-cyan-600 font-[400] text-[13px] mb-[3px]">
                        Location
                        <FaChevronRight className="h-[10px] w-[10px]" />
                      </Button>
                    )}
                  </div>
                  <div className={`absolute transition-all ${filterType === "location" ? "left-[-400px]" : "left-0"} `}>
                    <RangePicker
                      className="w-[330px] h-[50px] "
                      presets={rangePresets}
                      onChange={handleDateChange}
                      disabledDate={(current) => current && current > dayjs()}
                      placeholder={["Start date", "End Date"]}
                      value={date.from && date.to ? [date.from, date.to] : null} // Set value based on `from` and `to`
                      format="DD/MM/YYYY" // Update with your desired format
                    />{" "}
                  </div>
                  <div className={`absolute transition-all ${filterType === "location" ? "right-0" : "right-[-400px]"} w-full `}>
                    <SelectLocation value={location} onChange={(e) => setLocation(e)} label="-- Location --" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="h-[50px] p-0 flex items-center justify-between px-[20px] border-t gap-[10px]">
              <LoadingButton
                variant="contained"
                loadingPosition="start"
                loading={getQ2DataLading}
                onClick={() => {
                  console.log(value, location);
                  if (value && (date || location)) {
                    dispatch(getQ2Data({ date: date ? `${dayjs(date.from).format("DD-MM-YYYY")}_to_${dayjs(date.to).format("DD-MM-YYYY")}` : null, value: value.id, location: location ? location.id : null })).then((res: any) => {
                      if (!res.payload?.data?.success) {
                        showToast(res.payload?.data?.message, "error");
                      } else {
                        setLocation(null);
                      }
                    });
                  } else {
                    showToast("Please select required fields", "error");
                  }
                }}
                type="submit"
                startIcon={<SearchIcon fontSize="small" />}
              >
                Search
              </LoadingButton>
              <div className="flex items-center gap-[5px]">
                <IconButton disabled={!q2Data} onClick={onBtExport} color="primary">
                  <DownloadIcon />
                </IconButton>
                <IconButton disabled={!q2Data} color="warning">
                  <FilterIcon />
                </IconButton>
              </div>
            </CardFooter>
          </Paper>
          <Paper elevation={2} className="rounded-md">
            <CardHeader className="p-0 h-[40px] flex justify-center px-[10px] bg-hbg border-b">
              <CardTitle className="font-[500] text-slate-600">Device Info</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-[5px]">
                <li className="py-[5px] border-b flex flex-col text-slate-500">
                  <span className="font-[500]">Name</span>
                  {getQ2DataLading ? <Skeleton className="h-[20px] w-full" /> : <span className="text-[13px] ">{q2Data?.head?.name || "--"}</span>}
                </li>
                <li className="py-[5px] border-b flex flex-col text-slate-500">
                  <span className="font-[500]">SKU</span>
                  {getQ2DataLading ? <Skeleton className="h-[20px] w-full" /> : <span className="text-[13px] ">{q2Data?.head?.code || "--"}</span>}
                </li>
                <li className="py-[5px] border-b flex flex-col text-slate-500">
                  <span className="font-[500]">Unit</span>
                  {getQ2DataLading ? <Skeleton className="h-[20px] w-full" /> : <span className="text-[13px] ">{q2Data?.head?.uom || "--"}</span>}
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
                  {getQ2DataLading ? <Skeleton className="h-[20px] w-full" /> : <span className="text-[13px] ">{q2Data?.head?.openingQty || "--"}</span>}
                </li>
                <li className="py-[5px] border-b flex flex-col text-slate-500">
                  <span className="font-[500]">Closing Qty</span>
                  {getQ2DataLading ? <Skeleton className="h-[20px] w-full" /> : <span className="text-[13px] ">{q2Data?.head?.closingQty || "--"}</span>}
                </li>
              </ul>
            </CardContent>
          </Paper>
        </div>
        <Q2ReportTable gridRef={gridRef} />
      </div>
    </div>
  );
};

export default Q2Statement;
