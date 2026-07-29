import React, { useCallback, useRef, useState } from "react";
import { DatePicker } from "antd";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs, { Dayjs } from "dayjs";
import { AgGridReact } from "@ag-grid-community/react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getr3Report } from "@/features/report/report/reportSlice";
import LoadingButton from "@mui/lab/LoadingButton";
import { showToast } from "@/utils/toasterContext";
import { rangePresets } from "@/utils/rangePresets";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import MuiTooltip from "@/components/reusable/MuiTooltip";
import { useSocketContext } from "@/components/context/SocketContext";
import { Typography } from "@mui/material";
import MaterialPurchaseTable from "@/table/report/summary-tables/MaterialPurchaseTable";

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;

const MaterialPurchase: React.FC = () => {
  const [colapse, setcolapse] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const r3reportLoading = useAppSelector((state) => state.report.r3reportLoading);
  const [date, setDate] = useState<{ from: Dayjs | null; to: Dayjs | null }>({
    from: null,
    to: null,
  });
  const [pageSize, setPageSize] = useState<number>(20);
  const { emitDownloadR3Report, isConnected } = useSocketContext();

  const gridRef = useRef<AgGridReact<any>>(null);

  const handleDateChange = useCallback((range: [Dayjs | null, Dayjs | null] | null) => {
    if (range) {
      setDate({ from: range[0], to: range[1] });
    } else {
      setDate({ from: null, to: null });
    }
  }, []);

  const handlePageChange = useCallback((page: number) => {
    dispatch(
      getr3Report({
        from: dayjs(date.from).format("DD-MM-YYYY"),
        to: dayjs(date.to).format("DD-MM-YYYY"),
        page: page,
        limit: pageSize,
      }),
    );
  }, [dispatch, date, pageSize]);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    dispatch(
      getr3Report({
        from: dayjs(date.from).format("DD-MM-YYYY"),
        to: dayjs(date.to).format("DD-MM-YYYY"),
        page: 1,
        limit: newPageSize,
      }),
    );
  }, [dispatch, date]);

  const handleDownload = useCallback(() => {
    emitDownloadR3Report({
      from: dayjs(date.from).format("DD-MM-YYYY"),
      to: dayjs(date.to).format("DD-MM-YYYY"),
    });
  }, [emitDownloadR3Report, date]);

  return (
    <div className="bg-white h-[calc(100vh-100px)] flex relative">
      <div
        className={`transition-all flex flex-col gap-[10px] h-[calc(100vh-100px)]  border-r border-neutral-300   ${colapse ? "min-w-0 max-w-0" : "min-w-[400px] max-w-[400px] "}`}
      >
        <div
          className={`transition-all ${colapse ? "left-0" : "left-[400px]"} w-[16px] p-0  h-full top-0 bottom-0 absolute rounded-none  text-slate-600 z-[10] flex items-center justify-center`}
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
        <div className="flex flex-col gap-[20px]  p-[20px] mt-[0px] overflow-hidden">
          <div className="flex flex-col gap-[10px] ">
            <Typography className="text-xl font-semibold" variant="subtitle2">
              Select Date Range
            </Typography>
            <RangePicker
              className="h-[50px]"
              presets={rangePresets}
              onChange={handleDateChange}
              disabledDate={(current) => current && current > dayjs()}
              placeholder={["Start date", "End Date"]}
              value={date.from && date.to ? [date.from, date.to] : null} // Set value based on `from` and `to`
              format="DD/MM/YYYY" // Update with your desired format
            />
          </div>
          <div className="flex items-center justify-between w-full">
            <LoadingButton
              variant="contained"
              startIcon={<Icons.search fontSize="small" />}
              loadingPosition="start"
              loading={r3reportLoading}
              onClick={() => {
                if (!date.from || !date.to) {
                  showToast("Select date range", "error");
                } else {
                  dispatch(
                    getr3Report({
                      from: dayjs(date.from).format("DD-MM-YYYY"),
                      to: dayjs(date.to).format("DD-MM-YYYY"),
                      page: 1,
                      limit: pageSize,
                    }),
                  );
                }
              }}
            >
              Search
            </LoadingButton>
            <MuiTooltip title="Download" placement="right">
              <LoadingButton
                variant="contained"
                disabled={!isConnected}
                onClick={handleDownload}
                color="primary"
                style={{
                  borderRadius: "50%",
                  width: 30,
                  height: 30,
                  minWidth: 0,
                  padding: 0,
                }}
                size="small"
                sx={{ zIndex: 1 }}
              >
                <Icons.download fontSize="small" />
              </LoadingButton>
            </MuiTooltip>
          </div>
        </div>
      </div>
      <div className="w-full">
        <MaterialPurchaseTable
          gridRef={gridRef}
          handlePageChange={handlePageChange}
          handlePageSizeChange={handlePageSizeChange}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
};

export default MaterialPurchase;
