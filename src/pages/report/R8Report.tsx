import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@mui/lab";
import { AgGridReact } from "@ag-grid-community/react";
import React, { useRef, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import RangeSelect from "@/components/reusable/antSelecters/RangeSelect";
import { rangePresets } from "@/utils/rangePresets";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getr8Report } from "@/features/report/report/reportSlice";
import R8ReportTable from "@/table/report/R8ReportTable";
import { useSocketContext } from "@/components/context/SocketContext";

const R8Report: React.FC = () => {
  const dispatch = useAppDispatch();
  const { r8ReportLoading } = useAppSelector((state) => state.report);
  const { emitR8DeviceReport,isConnected } = useSocketContext();

  const [dateRange, setDateRange] = useState<{
    from: Dayjs | null;
    to: Dayjs | null;
  }>({
    from: null,
    to: null,
  });
  const [pageSize, setPageSize] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const gridRef = useRef<AgGridReact<any>>(null);
  const [colapse, setcolapse] = useState<boolean>(false);

  const handleDateChange = (dates: {
    from: Dayjs | null;
    to: Dayjs | null;
  }) => {
    console.log("Selected Dates:", dates);
    setDateRange(dates);
  };

  const getreport = () => {
    if (dateRange.from && dateRange.to) {
      setCurrentPage(1); // Reset to first page when searching
      dispatch(
        getr8Report({
          from: dateRange.from.format("DD-MM-YYYY"),
          to: dateRange.to.format("DD-MM-YYYY"),
          page: currentPage,
          limit: pageSize,
        })
      );
    }
  };

  // const onBtExport = useCallback(() => {
  //   gridRef.current!.api.exportDataAsExcel({
  //     sheetName: "R8 Report", // Set your desired sheet name here
  //   });
  // }, []);

  const onBtExport = () => {
    if (dateRange.from && dateRange.to) {
      emitR8DeviceReport({
        data:
          dateRange.from.format("DD-MM-YYYY") +
          " " +
          dateRange.to.format("DD-MM-YYYY"),
        type: "RANGE",
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (dateRange.from && dateRange.to) {
      dispatch(
        getr8Report({
          from: dateRange.from.format("DD-MM-YYYY"),
          to: dateRange.to.format("DD-MM-YYYY"),
          page: page,
          limit: pageSize,
        })
      );
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
    if (dateRange.from && dateRange.to) {
      dispatch(
        getr8Report({
          from: dateRange.from.format("DD-MM-YYYY"),
          to: dateRange.to.format("DD-MM-YYYY"),
          page: currentPage,
          limit: newPageSize,
        })
      );
    }
  };

  return (
    <div className="  h-[calc(100vh-100px)] bg-white">
      <div className={` h-full flex relative   `}>
        <div
          className={` transition-all h-full ${
            colapse ? "min-w-0 max-w-[0px]" : "min-w-[400px] max-w-[400px] "
          }  overflow-y-auto overflow-x-hidden border-r border-neutral-400/70   `}
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
          <div className="p-[20px] ">
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
            </div>
            <div className="mt-[20px] flex items-center justify-between">
              <LoadingButton
                onClick={getreport}
                loading={r8ReportLoading}
                loadingPosition="start"
                startIcon={<Icons.search fontSize="small" />}
                variant="contained"
              >
                Search
              </LoadingButton>
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
            </div>
          </div>
        </div>
        <div className="w-full">
          <R8ReportTable
            gridRef={gridRef}
            handlePageChange={handlePageChange}
            handlePageSizeChange={handlePageSizeChange}
            pageSize={pageSize}
          />
        </div>
      </div>
    </div>
  );
};

export default R8Report;
