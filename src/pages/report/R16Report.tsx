import React, { useState, useRef } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import LoadingButton from "@mui/lab/LoadingButton";
import { FormControl, MenuItem, Select } from "@mui/material";
import { Icons } from "@/components/icons";
import { rangePresets } from "@/utils/rangePresets";
import { Button } from "@/components/ui/button";
import RangeSelect from "@/components/reusable/antSelecters/RangeSelect";
import R16ReportTable from "@/table/report/R16ReportTable";
import { showToast } from "@/utils/toasterContext";
import { getR16Report } from "@/features/report/report/reportSlice";
import { AgGridReact } from "@ag-grid-community/react";
import { useSocketContext } from "@/components/context/SocketContext";

const R16Report: React.FC = () => {
  const gridRef = useRef<AgGridReact>(null);
  const [colapse, setcolapse] = useState<boolean>(false);
  const [partner, setPartner] = useState<string>("eCOM");
  const [dateRange, setDateRange] = useState<{
    from: Dayjs | null;
    to: Dayjs | null;
  }>({
    from: null,
    to: null,
  });

  const dispatch = useAppDispatch();
  const { r16ReportLoading } = useAppSelector(
    (state) => state.report
  );
  const { swipeMachineInward,isConnected } = useSocketContext();

  const handleDateChange = (dates: {
    from: Dayjs | null;
    to: Dayjs | null;
  }) => {
    setDateRange(dates);
  };

  const handleExport = () => {
      if (!dateRange.from || !dateRange.to || !partner)
        return showToast("Please select location and date range", "error");
      const reportPayload = {
        partner: partner,
        fromDate: dateRange.from?.format("DD-MM-YYYY"),
        toDate: dateRange.to?.format("DD-MM-YYYY"),
      };
      swipeMachineInward(reportPayload);
      showToast("Start downloading ", "success");
    };
  

  return (
    <div className="flex bg-white h-[calc(100vh-100px)] relative">
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
            className={`transition-all w-[16px] p-0 py-[35px] bg-neutral-200 rounded-none hover:bg-neutral-300/50 text-slate-600 hover:h-full shadow-sm shadow-neutral-400 duration-300`}
          >
            {colapse ? (
              <Icons.right fontSize="small" />
            ) : (
              <Icons.left fontSize="small" />
            )}
          </Button>
        </div>
        <div className="p-[20px] overflow-hidden">
          <div className="flex flex-col gap-[20px]">
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
            <FormControl fullWidth>
              <Select
                value={partner}
                onChange={(e) => setPartner(e.target.value)}
              >
                {[
                  { value: "eKart", label: "eKart" },
                  { value: "eCOM", label: "eCOM" },
                  { value: "DTDC", label: "DTDC" },
                  { value: "dVery", label: "dVery" },
                  { value: "PLADA", label: "PLADA" },
                  { value: "BILLBOX", label: "BILLBOX" },
                  { value: "XPRESSBEES", label: "XPRESSBEES" },
                  { value: "DARTX", label: "DARTX" },
                  { value: "BLUEDART", label: "BLUEDART" },
                  { value: "ALL", label: "ALL" },
                ].map((item) => (
                  <MenuItem value={item.value} key={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="mt-[20px] flex items-center justify-between">
            <LoadingButton
              loading={r16ReportLoading}
              loadingPosition="start"
              startIcon={<Icons.search fontSize="small" />}
              variant="contained"
              onClick={() => {
                if (!dateRange.from && !dateRange.to) {
                  showToast("Please select a date range", "error");
                } else if (!partner) {
                  showToast("Please select a partner", "error");
                } else {
                  dispatch(
                    getR16Report({
                      from: dayjs(dateRange.from).format("DD-MM-YYYY"),
                      to: dayjs(dateRange.to).format("DD-MM-YYYY"),
                      partner: partner,
                      page: 1,
                      limit: 20,
                    })
                  );
                }
              }}
            >
              Search
            </LoadingButton>
            <LoadingButton
             disabled={!isConnected}
              onClick={handleExport}
              variant="contained"
              color="primary"
              style={{
                borderRadius: "50%",
                width: 40,
                height: 40,
                minWidth: 0,
                padding: 0,
              }}
              size="small"
              sx={{ zIndex: 1 }}
            >
              <Icons.download />
            </LoadingButton>
          </div>
        </div>
      </div>
      <div className="w-full">
        <R16ReportTable gridRef={gridRef} />
      </div>
    </div>
  );
};

export default R16Report;
