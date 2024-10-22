import CustomSelect from "@/components/reusable/CustomSelect";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { DatePicker, TimeRangePickerProps } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import DeviceMinReportTable from "@/table/report/DeviceMinReportTable";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getR1Data } from "@/features/report/report/reportSlice";
import { CustomButton } from "@/components/reusable/CustomButton";
import { Download, Filter, Search } from "lucide-react";
import { FaAngleRight } from "react-icons/fa";
import { CustomDrawer, CustomDrawerContent, CustomDrawerHeader, CustomDrawerTitle } from "@/components/reusable/CustomDrawer";
import CustomInput from "@/components/reusable/CustomInput";
import { convertDateRange } from "@/utils/converDateRangeUtills";
import { AgGridReact } from "@ag-grid-community/react";
import { showToast } from "@/utils/toastUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { replaceBrWithNewLine } from "@/utils/replacebrtag";
const Deviceinreport: React.FC = () => {
  const [filter, setFilter] = useState<boolean>(false);
  const [type, setType] = useState<string>("");
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
    r1Data && gridRef.current!.api.exportDataAsExcel({
      sheetName: 'R1 Report' // Set your desired sheet name here
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
      <CustomDrawer open={filter} onOpenChange={setFilter}>
        <CustomDrawerContent className="p-0">
          <CustomDrawerHeader className="h-[50px] p-0 flex flex-col justify-center px-[20px] space-y-0 bg-zinc-200 gap-0">
            <CustomDrawerTitle className="text-slate-600 font-[500] p-0">Filter</CustomDrawerTitle>
          </CustomDrawerHeader>
          <div>
            <div className="flex items-center gap-[10px] p-[10px]">
              <CustomSelect
                placeholder={"Filter With"}
                className="w-full"
                onChange={(e) => setType(e!.value)}
                options={[
                  { value: "min", label: "MIN" },
                  { value: "date", label: "Date",isDisabled: true },
                  { value: "serial", label: "Serial",isDisabled: true },
                  { value: "sim", label: "SIM Availibility",isDisabled: true },
                  { value: "docType", label: "Doc Type" ,isDisabled: true},
                  { value: "sku", label: "SKU",isDisabled: true },
                ]}
              />
            </div>
            <div className="mt-[20px] p-[10px]">
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
                    <CustomButton loading={getR1DataLoading} disabled={!date || getR1DataLoading} icon={<Search className="h-[18px] w-[18px]" />} className="bg-cyan-700 hover:bg-cyan-800 max-w-max">
                      Search
                    </CustomButton>
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
                  <CustomInput label="MIN" required value={min} onChange={(e) => setMin(e.target.value)} />

                  <CustomButton
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
                    icon={<Search className="h-[18px] w-[18px]" />}
                    className="bg-cyan-700 hover:bg-cyan-800 max-w-max"
                  >
                    Search
                  </CustomButton>
                </div>
              ) : null}
            </div>
          </div>
        </CustomDrawerContent>
      </CustomDrawer>
      <div className="h-full grid grid-cols-[400px_1fr]">
        <div className="p-[10px]">
          <Card className="rounded-md">
            <CardHeader className="p-0 h-[40px] flex justify-center px-[10px] bg-hbg border-b">
              <CardTitle className="font-[500] text-slate-600">Report Detail</CardTitle>
            </CardHeader>
            <CardContent className="p-[10px]">
              <ul className="text-[14px] ">
                <li className="flex  gap-[5px] text-slate-600">
                  <p className="font-[500] whitespace-nowrap">Sku Code: </p>
                  <p className="text-slate-500 ">{r1Data ? r1Data.head.skuCode : "--"}</p>
                </li>
                <li className="flex  gap-[5px] text-slate-600">
                  <p className="font-[500] whitespace-nowrap">Sku Name: </p>
                  <p className="text-slate-500">{r1Data ? r1Data.head.skuName + r1Data.head.uom : "--"}</p>
                </li>
                <li className="flex  gap-[5px] text-slate-600">
                  <p className="font-[500] whitespace-nowrap">IN Location: </p>
                  <p className="text-slate-500">{r1Data ? r1Data.head.inLoc : "--"}</p>
                </li>
                <li className="flex  gap-[5px] text-slate-600">
                  <p className="font-[500] whitespace-nowrap">Vendor Name: </p>
                  <p className="text-slate-500">{r1Data ? r1Data.head.vendorName : "--"}</p>
                </li>
                <li className="flex  gap-[5px] text-slate-600">
                  <p className="font-[500] whitespace-nowrap">Vendor Code: </p>
                  <p className="text-slate-500">{r1Data ? r1Data.head.vendorCode : "--"}</p>
                </li>
                <li className="flex  gap-[5px] text-slate-600">
                  <p className="font-[500] whitespace-nowrap">Vendor Address: </p>
                  <p className="text-slate-500">{r1Data ? replaceBrWithNewLine(r1Data.head.vendorAddress) : "--"}</p>
                </li>
                <li className="flex  gap-[5px] text-slate-600">
                  <p className="font-[500] whitespace-nowrap">Doc Type: </p>
                  <p className="text-slate-500">{r1Data ? r1Data.head.docType : "--"}</p>
                </li>
                <li className="flex  gap-[5px] text-slate-600">
                  <p className="font-[500] whitespace-nowrap">Doc No.: </p>
                  <p className="text-slate-500">{r1Data ? r1Data.head.docNo : "--"}</p>
                </li>
                <li className="flex gap-[5px] text-slate-600">
                  <p className="font-[500] whitespace-nowrap">Doc Date.: </p>
                  <p className="text-slate-500">{r1Data ? r1Data.head.docDate : "--"}</p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        <div>
          <div className="h-[50px] px-[10px] bg-white shadow flex items-center justify-between gap-[20px]">
            <div></div>
            <div className="flex gap-[10px] items-center">
              <CustomButton onClick={onBtExport} icon={<Download className="h-[18px] w-[18px]" />} className="bg-cyan-700 hover:bg-cyan-800">
                Download
              </CustomButton>
              <CustomButton onClick={() => setFilter(true)} icon={<Filter className="h-[18px] w-[18px]" />} className="bg-cyan-700 hover:bg-cyan-800 ">
                Filter <FaAngleRight className="ml-[5px] h-[18px] w-[18px]" />
              </CustomButton>
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
