import { CustomButton } from "@/components/reusable/CustomButton";
import CustomSelect from "@/components/reusable/CustomSelect";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { DatePicker, Select, TimeRangePickerProps } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HiDocumentText } from "react-icons/hi2";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getQ2Data } from "@/features/query/query/querySlice";
import { transformGroupSelectData } from "@/utils/transformUtills";
import { convertDateRange } from "@/utils/converDateRangeUtills";
import { showToast } from "@/utils/toastUtils";
import { Skeleton } from "@/components/ui/skeleton";
import Q2ReportTable from "@/table/query/Q2ReportTable";
import { getPertCodesync } from "@/features/production/MaterialRequestWithoutBom/MRRequestWithoutBomSlice";
import { RowData } from "@/features/query/query/queryType";
import { AgGridReact } from "@ag-grid-community/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getLocationAsync } from "@/features/wearhouse/Divicemin/devaiceMinSlice";
dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;
const dateFormat = "DD-MM-YYYY";
const Q2Statement: React.FC = () => {
  const [filterType, setFilterType] = useState<string>("");
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const gridRef = useRef<AgGridReact<RowData>>(null);
  const dispatch = useAppDispatch();
  const { q2Data, getQ2DataLading } = useAppSelector((state) => state.query);
  const { partCodeData, getPartCodeLoading } = useAppSelector((state) => state.materialRequestWithoutBom);
  const { locationData, getLocationLoading } = useAppSelector((state) => state.divicemin);
  const [date, setDate] = useState<string | null>(null);
  const [value, setValue] = useState<{ label: string; value: string } | null>(null);
  const rangePresets: TimeRangePickerProps["presets"] = [
    { label: "Today", value: [dayjs().startOf("day"), dayjs()] },
    { label: "Yesterday", value: [dayjs().add(-1, "d"), dayjs()] },
    { label: "Last 7 Days", value: [dayjs().add(-7, "d"), dayjs()] },
    { label: "Last 14 Days", value: [dayjs().add(-14, "d"), dayjs()] },
    { label: "Last 30 Days", value: [dayjs().add(-30, "d"), dayjs()] },
    { label: "Last 90 Days", value: [dayjs().add(-90, "d"), dayjs()] },
  ];

  const onBtExport = useCallback(() => {
    gridRef.current!.api.exportDataAsExcel();
  }, []);

  useEffect(() => {
    // dispatch(getQ1Data());
    dispatch(getPertCodesync(null));
  }, []);

  return (
    <div>
      <div className="grid grid-cols-[350px_1fr]">
        <div className="p-[10px] flex flex-col gap-[10px] h-[calc(100vh-90px)] overflow-y-auto">
          <Card className="rounded-md ">
            <CardContent>
              <div className="py-[20px] flex flex-col gap-[30px]">
                <div>
                  <CustomSelect
                    value={value}
                    onChange={(e) => setValue(e)}
                    onInputChange={(value) => {
                      if (debounceTimeout.current) {
                        clearTimeout(debounceTimeout.current);
                      }
                      debounceTimeout.current = setTimeout(() => {
                        dispatch(getPertCodesync(!value ? null : value));
                      }, 500);
                    }}
                    isLoading={getPartCodeLoading}
                    required
                    placeholder="-- Part --"
                    options={transformGroupSelectData(partCodeData)}
                  />
                </div>
                <div className="relative h-[60px] overflow-hidden">
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
                  <div className={`absolute transition-all ${filterType === "location" ? "left-[-300px]" : "left-0"} `}>
                    <RangePicker onChange={(e) => setDate(convertDateRange(e!))} disabledDate={(current) => current && current > dayjs()} presets={rangePresets} placeholder={["Start date", "End Date"]} format={dateFormat} />
                  </div>
                  <div className={`absolute transition-all ${filterType === "location" ? "right-0" : "right-[-300px]"} w-full `}>
                    <Select showSearch placeholder="-- Location --" onSearch={(value) => dispatch(getLocationAsync(value ? value : null))} loading={getLocationLoading} className="w-full" value={value} defaultValue={value} options={transformGroupSelectData(locationData)} />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="h-[50px] p-0 flex items-center justify-between px-[20px] border-t gap-[10px]">
              <CustomButton
                loading={getQ2DataLading}
                onClick={() => {
                  if (date && value) {
                    dispatch(getQ2Data({ date: date, value: value.value })).then((res: any) => {
                      if (!res.payload?.data?.success) {
                        showToast({
                          description: res.payload?.data?.message,
                          variant: "destructive",
                        });
                      }
                    });
                  } else {
                    showToast({
                      description: "Please select date and component",
                      variant: "destructive",
                    });
                  }
                }}
                type="submit"
                icon={<Search className="h-[18px] w-[18px] " />}
                className="bg-cyan-700 hover:bg-cyan-800"
              >
                Serach
              </CustomButton>
              <div className="flex items-center gap-[5px]">
                <Button onClick={onBtExport} disabled={!q2Data} className="p-0 rounded-full shadow-lg bg-cyan-700 hover:bg-cyan-800 h-[30px] w-[30px]">
                  <Download className="h-[18px] w-[18px]" />
                </Button>
                <Button disabled={!q2Data} className="p-0 rounded-full shadow-lg bg-cyan-700 hover:bg-cyan-800 h-[30px] w-[30px]">
                  <HiDocumentText className="h-[18px] w-[18px]" />
                </Button>
              </div>
            </CardFooter>
          </Card>
          <Card className="rounded-md">
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
          </Card>
          <Card className="rounded-md ">
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
          </Card>
        </div>
        <Q2ReportTable gridRef={gridRef} />
      </div>
    </div>
  );
};

export default Q2Statement;
