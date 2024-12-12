import { Icons } from "@/components/icons";
import SelectMin, { MinType } from "@/components/reusable/SelectMin";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@mui/lab";
import { FormControl, MenuItem, Select, TextField } from "@mui/material";
import React, { useCallback, useRef, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import RangeSelect from "@/components/reusable/antSelecters/RangeSelect";
import { rangePresets } from "@/utils/rangePresets";
import Q5StatementTable from "@/table/query/Q5StatementTable";
import { AgGridReact } from "@ag-grid-community/react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getQ5Data } from "@/features/query/query/querySlice";
import { showToast } from "@/utils/toasterContext";
const Q5Report: React.FC = () => {
  const dispatch = useAppDispatch();
  const { q5Data, q5DataLoading } = useAppSelector((state) => state.query);
  const [dateRange, setDateRange] = useState<{ from: Dayjs | null; to: Dayjs | null }>({
    from: null,
    to: null,
  });
  const [colapse, setcolapse] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("min");
  const [min, setMin] = React.useState<MinType | null>(null);
  const [sim, setSim] = useState<string>("");
  const gridRef = useRef<AgGridReact<any>>(null);
  const handleDateChange = (dates: { from: Dayjs | null; to: Dayjs | null }) => {
    console.log("Selected Dates:", dates);
    setDateRange(dates);
  };

  const onBtExport = useCallback(() => {
    gridRef.current!.api.exportDataAsExcel({
      sheetName: "Q5  ", // Set your desired sheet name here
    });
  }, []);
  return (
    <div className="  h-[calc(100vh-100px)] bg-white">
      <div className={` h-full flex relative   `}>
        <div className={` transition-all h-full ${colapse ? "min-w-0 max-w-[0px]" : "min-w-[400px] max-w-[400px] "}  overflow-y-auto overflow-x-hidden border-r border-neutral-400/70   `}>
          <div className={`transition-all ${colapse ? "left-0" : "left-[400px]"} w-[16px] p-0  h-full top-0 bottom-0 absolute rounded-none  text-slate-600 z-[10] flex items-center justify-center`}>
            <Button onClick={() => setcolapse(!colapse)} className={`transition-all w-[16px] p-0 py-[35px] bg-neutral-200  rounded-none hover:bg-neutral-300/50 text-slate-600 hover:h-full shadow-sm shadow-neutral-400 duration-300   `}>
              {colapse ? <Icons.right fontSize="small" /> : <Icons.left fontSize="small" />}
            </Button>
          </div>
          <div className="p-[20px] ">
            <div className="flex flex-col gap-[20px]">
              <FormControl fullWidth>
                <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
                  <MenuItem value={"min"}>MIN</MenuItem>
                  <MenuItem value={"sim"}>SIM Number</MenuItem>
                  <MenuItem value={"date"}>Date Range</MenuItem>
                </Select>
              </FormControl>
              {filter === "min" && (
                <SelectMin
                  value={min}
                  onChange={(value) => {
                    setMin(value);
                  }}
                />
              )}
              {filter === "date" && (
                <RangeSelect
                  value={dateRange}
                  onChange={handleDateChange}
                  disabledDate={(current) => {
                    return current ? current > dayjs() : false;
                  }}
                  format="DD/MM/YYYY"
                  presets={rangePresets}
                  placeholder={["Start Date", "End Date"]}
                />
              )}
              {filter === "sim" && <TextField value={sim} onChange={(e) => setSim(e.target.value)} label="SIM No." />}
            </div>
            <div className="mt-[20px] flex items-center justify-between">
              <LoadingButton
                onClick={() => {
                  if (filter === "date") {
                    if (dateRange.from && dateRange.to) {
                      dispatch(getQ5Data({ type: "RANGE", data: `${dayjs(dateRange.from).format("DD-MM-YYYY")}-${dayjs(dateRange.to).format("DD-MM-YYYY")}` }));
                    } else {
                      showToast("Select search criteria", "error");
                    }
                  } else if (filter === "min") {
                    if (min) {
                      dispatch(getQ5Data({ type: "MIN", data: min.minNo || "" }));
                    } else {
                      showToast("Select the MIN", "error");
                    }
                  } else if (filter === "sim") {
                    if (sim) {
                      dispatch(getQ5Data({ type: "SIM", data: sim }));
                    } else {
                      showToast("Supply the SIM No.", "error");
                    }
                  }
                }}
                loading={q5DataLoading}
                loadingPosition="start"
                startIcon={<Icons.search fontSize="small" />}
                variant="contained"
              >
                Search
              </LoadingButton>
              <LoadingButton
                disabled={!q5Data}
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
            </div>
          </div>
        </div>
        <div className="w-full">
          <Q5StatementTable gridRef={gridRef} />
        </div>
      </div>
    </div>
  );
};

export default Q5Report;
