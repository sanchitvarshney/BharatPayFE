import { CardFooter } from "@/components/ui/card";
import React, { useCallback, useRef, useState } from "react";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import {
  getPackagingFeedbackReport,
  PackagingFeedbackParams,
} from "@/features/Dispatch/DispatchSlice";
import Q7ReportTable from "@/table/query/Q7ReportTable";
import { AgGridReact } from "@ag-grid-community/react";
import {
  CardContent,
  FormControl,
  IconButton,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SearchIcon from "@mui/icons-material/Search";
import FilterIcon from "@mui/icons-material/Filter";
import { showToast } from "@/utils/toasterContext";
import MuiTooltip from "@/components/reusable/MuiTooltip";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { rangePresets } from "@/utils/rangePresets";

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;

const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "rgb(203 213 225)" },
    "&:hover fieldset": { borderColor: "rgb(148 163 184)" },
    "&.Mui-focused fieldset": { borderColor: "rgb(14 116 144)" },
  },
};

const selectSx = {
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgb(203 213 225)" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgb(148 163 184)" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "rgb(14 116 144)" },
};

const Q7Report: React.FC = () => {
  const [colapse, setcolapse] = useState(false);
  const [searchType, setSearchType] = useState<"DATE" | "TYPE" | "SERIAL">("DATE");
  const [date, setDate] = useState<{ from: Dayjs | null; to: Dayjs | null }>({ from: null, to: null });
  const [serial, setSerial] = useState("");
  const [status, setStatus] = useState<"" | "PASS" | "FAIL">("");
  const [type, setType] = useState<"" | "SWIPE" | "SOUND">("");

  const gridRef = useRef<AgGridReact<any>>(null);
  const dispatch = useAppDispatch();
  const { packagingFeedbackLoading, packagingFeedbackList } = useAppSelector(
    (state) => state.dispatch
  );

  const handleDateChange = (range: [Dayjs | null, Dayjs | null] | null) => {
    if (range) setDate({ from: range[0], to: range[1] });
    else setDate({ from: null, to: null });
  };

  const onBtExport = useCallback(() => {
    gridRef.current!.api.exportDataAsExcel();
  }, []);

  const handleSearch = () => {
    if (searchType === "SERIAL") {
      if (!serial.trim()) {
        showToast("Please enter a serial number", "error");
        return;
      }
      dispatch(getPackagingFeedbackReport({ searchType: "SERIAL", serial: serial.trim() }));
    } else if (searchType === "TYPE") {
      if (!type) {
        showToast("Please select a type", "error");
        return;
      }
      if (!date.from || !date.to) {
        showToast("Please select a date range", "error");
        return;
      }
      dispatch(getPackagingFeedbackReport({
        searchType: "DATE",
        from: dayjs(date.from).format("YYYY-MM-DD"),
        to: dayjs(date.to).format("YYYY-MM-DD"),
        type: type as "SWIPE" | "SOUND",
      }));
    } else {
      if (!date.from || !date.to) {
        showToast("Please select a date range", "error");
        return;
      }
      const params: PackagingFeedbackParams = {
        searchType: "DATE",
        from: dayjs(date.from).format("YYYY-MM-DD"),
        to: dayjs(date.to).format("YYYY-MM-DD"),
      };
      if (status) params.status = status;
      dispatch(getPackagingFeedbackReport(params));
    }
  };

  return (
    <div>
      <div className="relative flex bg-white">
        <div
          className={`transition-all flex flex-col gap-[10px] h-[calc(100vh-100px)] border-r border-neutral-300 ${
            colapse ? "min-w-0 max-w-0" : "min-w-[400px] max-w-[400px]"
          }`}
        >
          <div
            className={`transition-all ${
              colapse ? "left-0" : "left-[400px]"
            } w-[16px] p-0 h-full top-0 bottom-0 absolute rounded-none text-slate-600 z-[10] flex items-center justify-center`}
          >
            <Button
              onClick={() => setcolapse(!colapse)}
              className="transition-all w-[16px] p-0 py-[35px] bg-neutral-200 rounded-none hover:bg-neutral-300/50 text-slate-600 hover:h-full shadow-sm shadow-neutral-400 duration-300"
            >
              {colapse ? <Icons.right fontSize="small" /> : <Icons.left fontSize="small" />}
            </Button>
          </div>

          <div className="h-full overflow-y-auto">
            <Paper elevation={0}>
              <CardContent>
                <div className="flex flex-col gap-[20px] px-[20px] py-[20px]">

                  <div className="flex flex-col gap-[10px]">
                    <Typography variant="subtitle1" className="text-slate-600 font-medium">
                      Search By
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        value={searchType}
                        onChange={(e) => {
                          setSearchType(e.target.value as "DATE" | "TYPE" | "SERIAL");
                          setDate({ from: null, to: null });
                          setSerial("");
                          setStatus("");
                          setType("");
                        }}
                        sx={selectSx}
                      >
                        <MenuItem value="DATE">Date Range</MenuItem>
                        <MenuItem value="TYPE">By Type</MenuItem>
                        <MenuItem value="SERIAL">Serial No.</MenuItem>
                      </Select>
                    </FormControl>
                  </div>

                  {searchType === "DATE" && (
                    <>
                      <div className="flex flex-col gap-[10px]">
                        <Typography variant="subtitle1" className="text-slate-600 font-medium">
                          Date Range
                        </Typography>
                        <RangePicker
                          className="w-full h-[55px] border-[2px] border-neutral-300 rounded-sm"
                          presets={rangePresets}
                          onChange={handleDateChange}
                          disabledDate={(current) => current && current > dayjs()}
                          placeholder={["Start date", "End Date"]}
                          value={date.from && date.to ? [date.from, date.to] : null}
                          format="DD/MM/YYYY"
                        />
                      </div>
                      <div className="flex flex-col gap-[10px]">
                        <Typography variant="subtitle1" className="text-slate-600 font-medium">
                          Status <span className="text-slate-400 text-xs font-normal">(optional)</span>
                        </Typography>
                        <FormControl fullWidth>
                          <Select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as "" | "PASS" | "FAIL")}
                            displayEmpty
                            sx={selectSx}
                          >
                            <MenuItem value=""><em>All</em></MenuItem>
                            <MenuItem value="PASS">PASS</MenuItem>
                            <MenuItem value="FAIL">FAIL</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                    </>
                  )}

                  {searchType === "TYPE" && (
                    <>
                      <div className="flex flex-col gap-[10px]">
                        <Typography variant="subtitle1" className="text-slate-600 font-medium">
                          Type
                        </Typography>
                        <FormControl fullWidth>
                          <Select
                            value={type}
                            onChange={(e) => setType(e.target.value as "" | "SWIPE" | "SOUND")}
                            displayEmpty
                            sx={selectSx}
                          >
                            <MenuItem value="" disabled><em>Select Type</em></MenuItem>
                            <MenuItem value="SWIPE">SWIPE</MenuItem>
                            <MenuItem value="SOUND">SOUND</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                      <div className="flex flex-col gap-[10px]">
                        <Typography variant="subtitle1" className="text-slate-600 font-medium">
                          Date Range
                        </Typography>
                        <RangePicker
                          className="w-full h-[55px] border-[2px] border-neutral-300 rounded-sm"
                          presets={rangePresets}
                          onChange={handleDateChange}
                          disabledDate={(current) => current && current > dayjs()}
                          placeholder={["Start date", "End Date"]}
                          value={date.from && date.to ? [date.from, date.to] : null}
                          format="DD/MM/YYYY"
                        />
                      </div>
                    </>
                  )}

                  {searchType === "SERIAL" && (
                    <div className="flex flex-col gap-[10px]">
                      <Typography variant="subtitle1" className="text-slate-600 font-medium">
                        Serial No.
                      </Typography>
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Enter Serial Number"
                        value={serial}
                        onChange={(e) => setSerial(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                        sx={textFieldSx}
                      />
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="h-[50px] p-0 flex items-center justify-between px-[20px] gap-[10px]">
                <LoadingButton
                  variant="contained"
                  loadingPosition="start"
                  loading={packagingFeedbackLoading}
                  onClick={handleSearch}
                  startIcon={<SearchIcon fontSize="small" />}
                >
                  Search
                </LoadingButton>
                <div className="flex items-center gap-[5px]">
                  <MuiTooltip title="Download" placement="right">
                    <LoadingButton
                      disabled={!packagingFeedbackList || packagingFeedbackList.length === 0}
                      variant="contained"
                      color="primary"
                      style={{ borderRadius: "50%", width: 30, height: 30, minWidth: 0, padding: 0 }}
                      onClick={onBtExport}
                      size="small"
                      sx={{ zIndex: 1 }}
                    >
                      <Icons.download fontSize="small" />
                    </LoadingButton>
                  </MuiTooltip>
                  <IconButton disabled color="warning">
                    <FilterIcon />
                  </IconButton>
                </div>
              </CardFooter>
            </Paper>
          </div>
        </div>

        <div className="w-full">
          <Q7ReportTable gridRef={gridRef} />
        </div>
      </div>
    </div>
  );
};

export default Q7Report;
