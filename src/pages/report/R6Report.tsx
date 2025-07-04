import React, { useRef, useState } from "react";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getr6Report } from "@/features/report/report/reportSlice";
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
import { useSocketContext } from "@/components/context/SocketContext";

const R6Report: React.FC = () => {
  const [colapse, setcolapse] = useState<boolean>(false);
  const [type, setType] = useState<string>("min");
  const [min, setMin] = useState<string>("");
  const [date, setDate] = useState<{ from: Dayjs | null; to: Dayjs | null }>({
    from: null,
    to: null,
  });
  const [pageSize, setPageSize] = useState<number>(20);
  const dispatch = useAppDispatch();
  dayjs.extend(customParseFormat);
  const { r6ReportLoading, r6Report } = useAppSelector((state) => state.report);
  const gridRef = useRef<AgGridReact<any>>(null);
  const { RangePicker } = DatePicker;
  const { emitR6DispatchReport,isConnected } = useSocketContext();

  const onBtExport = () => {
    if (type === "min") {
      emitR6DispatchReport({
        type: "MINNO",
        data: min,
      });
    } else {
      emitR6DispatchReport({
        type: type==="date"?"DATE":type,
        startDate: date.from?.format("DD-MM-YYYY") || "",
        endDate: date.to?.format("DD-MM-YYYY") || "",
      });
    }
  };

  const handlePageChange = (page: number) => {
    if (type === "date") {
      dispatch(
        getr6Report({
          type: "DATE",
          from: dayjs(date.from).format("DD-MM-YYYY"),
          to: dayjs(date.to).format("DD-MM-YYYY"),
          data: "",
          page: page,
          limit: pageSize,
        })
      );
    } else {
      dispatch(
        getr6Report({
          type: "MINNO",
          data: min,
          from: "",
          to: "",
          page: page,
          limit: pageSize,
        })
      );
    }
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPageSize(pageSize);
    if (type === "date") {
      dispatch(
        getr6Report({
          type: "DATE",
          from: dayjs(date.from).format("DD-MM-YYYY"),
          to: dayjs(date.to).format("DD-MM-YYYY"),
          data: "",
          page: 1,
          limit: pageSize,
        })
      );
    } else {
      dispatch(
        getr6Report({
          type: "MINNO",
          data: min,
          from: "",
          to: "",
          page: 1,
          limit: pageSize,
        })
      );
    }
  };

  return (
    <>
      <div className="h-[calc(100vh-100px)] flex bg-white relative">
        <div
          className={`transition-all flex flex-col gap-[10px] h-[calc(100vh-100px)]  border-r border-neutral-300   ${
            colapse ? "min-w-0 max-w-0" : "min-w-[400px] max-w-[400px] "
          }`}
        >
          <div
            className={`transition-all ${
              colapse ? "left-0" : "left-[400px]"
            } w-[16px] p-0  h-full top-0 bottom-0 absolute rounded-none  text-slate-600 z-[10] flex items-center justify-center`}
          >
            <Button
              onClick={() => setcolapse(!colapse)}
              className={`transition-all w-[16px] p-0 py-[35px] bg-neutral-200  rounded-none hover:bg-neutral-300/50 text-slate-600 hover:h-full shadow-sm shadow-neutral-400 duration-300   `}
            >
              {colapse ? (
                <Icons.right fontSize="small" />
              ) : (
                <Icons.left fontSize="small" />
              )}
            </Button>
          </div>
          <div className="flex flex-col   gap-[20px] p-[20px]   mt-[20px] overflow-hidden">
            <FormControl fullWidth>
              <Select
                value={type}
                defaultValue="min"
                onChange={(e) => setType(e.target.value)}
              >
                {[
                  { value: "min", label: "MIN", isDisabled: false },
                  { value: "date", label: "Date", isDisabled: false },
                  { value: "serial", label: "Serial", isDisabled: true },
                  { value: "sim", label: "SIM Availibility", isDisabled: true },
                  { value: "docType", label: "Doc Type", isDisabled: true },
                  { value: "sku", label: "SKU", isDisabled: true },
                ].map((item) => (
                  <MenuItem
                    disabled={item.isDisabled}
                    value={item.value}
                    key={item.value}
                  >
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
                {(date.from || date.to) && (
                  <div className="flex justify-between mt-[20px]">
                    <LoadingButton
                      loadingPosition="start"
                      onClick={() => {
                        if (!date.from || !date.to) {
                          showToast("Please select date range", "error");
                        } else {
                          dispatch(
                            getr6Report({
                              type: "DATE",
                              from: dayjs(date.from).format("DD-MM-YYYY"),
                              to: dayjs(date.to).format("DD-MM-YYYY"),
                              data: "",
                              page: 1,
                              limit: pageSize,
                            })
                          );
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
                        disabled={!isConnected}
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
                  </div>
                )}
              </div>
            ) : type === "min" ? (
              <div className="flex flex-col gap-[20px] ">
                <TextField
                  label="MIN"
                  value={min}
                  onChange={(e) => setMin(e.target.value)}
                />

                {min && (
                  <div className="flex items-center justify-between">
                    <LoadingButton
                      className="max-w-max"
                      variant="contained"
                      loading={r6ReportLoading}
                      onClick={() => {
                        if (min) {
                          dispatch(
                            getr6Report({
                              type: "MINNO",
                              data: min,
                              from: "",
                              to: "",
                              page: 1,
                              limit: pageSize,
                            })
                          ).then((response: any) => {
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
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
        <div className="w-full">
          <R6reportTable
            gridRef={gridRef}
            handlePageChange={handlePageChange}
            handlePageSizeChange={handlePageSizeChange}
            pageSize={pageSize}
          />
        </div>
      </div>
    </>
  );
};

export default R6Report;
