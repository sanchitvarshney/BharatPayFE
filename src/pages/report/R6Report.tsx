import React, { useCallback, useRef, useState } from "react";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getr6Report, getWrongDeviceReport } from "@/features/report/report/reportSlice";
import { AgGridReact } from "@ag-grid-community/react";
import LoadingButton from "@mui/lab/LoadingButton";
import SearchIcon from "@mui/icons-material/Search";
import { FormControl, MenuItem, Select, TextField } from "@mui/material";
import { showToast } from "@/utils/toasterContext";
import { Icons } from "@/components/icons";
import MuiTooltip from "@/components/reusable/MuiTooltip";
import R6reportTable from "@/table/report/R6reportTable";
import { rangePresets } from "@/utils/rangePresets";
import { Button } from "@/components/ui/button";
const R6Report: React.FC = () => {
  const [colapse, setcolapse] = useState<boolean>(false);
  const [type, setType] = useState<string>("min");
  const [partner, setPartner] = useState<string>("eCOM");
  const [min, setMin] = useState<string>("");
  const [date, setDate] = useState<{ from: Dayjs | null; to: Dayjs | null }>({
    from: null,
    to: null,
  });
  const [reportDate, setReportDate] = useState<{ from: Dayjs | null; to: Dayjs | null }>({
    from: null,
    to: null,
  });
  const dispatch = useAppDispatch();
  dayjs.extend(customParseFormat);
  const { r6ReportLoading, r6Report,wrongDeviceReportLoading } = useAppSelector((state) => state.report);
  const gridRef = useRef<AgGridReact<any>>(null);
  const { RangePicker } = DatePicker;

  const onBtExport = useCallback(() => {
    console.log("click");
    r6Report &&
      gridRef.current!.api.exportDataAsExcel({
        sheetName: "R6 Report",
      });
  }, [r6Report]);

  const exportWrongDeviceData = useCallback(() => {
    console.log("click");
    r6Report &&
      gridRef.current!.api.exportDataAsExcel({
        sheetName: "R6 Report",
      });
  }, [r6Report]);
  return (
    <>
      <div className="h-[calc(100vh-100px)] flex bg-white relative">
        <div className={`transition-all flex flex-col gap-[10px] h-[calc(100vh-100px)]  border-r border-neutral-300   ${colapse ? "min-w-0 max-w-0" : "min-w-[400px] max-w-[400px] "}`}>
        <div className={`transition-all ${colapse ? "left-0" : "left-[400px]"} w-[16px] p-0  h-full top-0 bottom-0 absolute rounded-none  text-slate-600 z-[10] flex items-center justify-center`}>
            <Button onClick={() => setcolapse(!colapse)} className={`transition-all w-[16px] p-0 py-[35px] bg-neutral-200  rounded-none hover:bg-neutral-300/50 text-slate-600 hover:h-full shadow-sm shadow-neutral-400 duration-300   `}>
              {colapse ? <Icons.right fontSize="small" /> : <Icons.left fontSize="small" />}
            </Button>
          </div>
          <div className="flex flex-col   gap-[20px] p-[20px]   mt-[20px] overflow-hidden">
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
            {type === "date" ? (
              <div>
                <RangePicker
                  required
                  placement="bottomRight"
                  className="w-full h-[50px] border-[2px] rounded-sm"
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
                  presets={rangePresets}
                />
              { (date.from || date.to)&& <div className="flex justify-between mt-[20px]">
                  <LoadingButton
                    loadingPosition="start"
                    onClick={() => {
                      if (!date.from || !date.to) {
                        showToast("Please select date range", "error");
                      } else {
                        dispatch(getr6Report({ type: "DATE", from: dayjs(date.from).format("DD-MM-YYYY"), to: dayjs(date.to).format("DD-MM-YYYY"), data: "" }));
                      }
                    }}
                    variant="contained"
                    loading={r6ReportLoading}
                    disabled={!date || r6ReportLoading}
                    startIcon={<SearchIcon fontSize="small" />}
                  >
                    Search
                  </LoadingButton>
                  <MuiTooltip title="Download" placement="right">
                    <LoadingButton
                      disabled={!r6Report}
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
                    </LoadingButton>
                  </MuiTooltip>
                </div>}
              </div>
            ) : type === "min" ? (
              <div className="flex flex-col gap-[20px] ">
                <TextField label="MIN" value={min} onChange={(e) => setMin(e.target.value)} />

                {(min) && <div className="flex items-center justify-between">
                  <LoadingButton
                    className="max-w-max"
                    variant="contained"
                    loading={r6ReportLoading}
                    onClick={() => {
                      if (min) {
                        dispatch(getr6Report({ type: "MINNO", data: min, from: "", to: "" })).then((response: any) => {
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
                    <LoadingButton
                      disabled={!r6Report}
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
                      <Icons.download fontSize="small" />
                    </LoadingButton>
                  </MuiTooltip>
                </div>}
              </div>
            ) : null}
          </div>
          <div>
            <div className="text-[20px] font-bold text-center">
              Wrong Device Report
            </div>
            <div className="flex flex-col   gap-[20px] p-[20px]   mt-[20px] overflow-hidden">

              <div>
                <RangePicker
                  required
                  placement="bottomRight"
                  className="w-full h-[50px] border-[2px] rounded-sm"
                  format="DD-MM-YYYY"
                  disabledDate={(current) => current && current > dayjs()}
                  placeholder={["Start date", "End Date"]}
                  value={reportDate.from && reportDate.to ? [reportDate.from, reportDate.to] : null}
                  onChange={(range: [Dayjs | null, Dayjs | null] | null) => {
                    if (range) {
                      setReportDate({ from: range[0], to: range[1] });
                    } else {
                      setReportDate({ from: null, to: null });
                    }
                  }}
                  presets={rangePresets}
                />
              </div>
      
              <div className="flex flex-col gap-[20px] ">
              <FormControl fullWidth>
              <Select value={partner} defaultValue="eCOM" onChange={(e) => setPartner(e.target.value)}>
                {[
                  { value: "eKart", label: "eKart", isDisabled: false },
                  { value: "eCOM", label: "eCOM", isDisabled: false },
                  { value: "DTDC", label: "DTDC", isDisabled: false },
                  { value: "dVery", label: "Delhivery", isDisabled: false },
                ].map((item) => (
                  <MenuItem disabled={item.isDisabled} value={item.value} key={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
              {(reportDate.from || reportDate.to)&&  <div className="flex items-center justify-between">
                  <LoadingButton
                    className="max-w-max"
                    variant="contained"
                    loading={wrongDeviceReportLoading}
                    onClick={() => {
                      if (partner) {
                        dispatch(getWrongDeviceReport({ type: partner, from: dayjs(reportDate.from).format("DD-MM-YYYY"), to: dayjs(reportDate.to).format("DD-MM-YYYY") })).then((response: any) => {
                          if (response.payload?.data?.success) {
                          }
                        });
                      } else {
                        showToast("Please enter Partner", "error");
                      }
                    }}
                    startIcon={<SearchIcon fontSize="small" />}
                  >
                    Search
                  </LoadingButton>
                  <MuiTooltip title="Download" placement="right">
                    <LoadingButton
                      // disabled={!r6Report}
                      variant="contained"
                      color="primary"
                      style={{
                        borderRadius: "50%",
                        width: 40,
                        height: 40,
                        minWidth: 0,
                        padding: 0,
                      }}
                      onClick={() => exportWrongDeviceData()}
                      size="small"
                      sx={{ zIndex: 1 }}
                    >
                      <Icons.download fontSize="small" />
                    </LoadingButton>
                  </MuiTooltip>
                </div>}
              </div>
          
            </div>

          </div>
        </div>
        <div className="w-full">
          <R6reportTable gridRef={gridRef} />
        </div>
      </div>
    </>
  );
};

export default R6Report;
