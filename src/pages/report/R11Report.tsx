import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@mui/lab";
import { AgGridReact } from "@ag-grid-community/react";
import React, {  useRef, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import RangeSelect from "@/components/reusable/antSelecters/RangeSelect";
import { rangePresets } from "@/utils/rangePresets";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getR11Report } from "@/features/report/report/reportSlice";
import R11ReportTable from "@/table/report/R11ReportTable";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { useSocketContext } from "@/components/context/SocketContext";
import { showToast } from "@/utils/toasterContext";

const R11Report: React.FC = () => {
  const dispatch = useAppDispatch();
  const { r11ReportLoading, r11Report } = useAppSelector(
    (state) => state.report
  );
  const [dateRange, setDateRange] = useState<{
    from: Dayjs | null;
    to: Dayjs | null;
  }>({
    from: null,
    to: null,
  });
  const gridRef = useRef<AgGridReact<any>>(null);
  const [colapse, setcolapse] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1);
    const { emitR11Report,isConnected } = useSocketContext();

  const handleDateChange = (dates: {
    from: Dayjs | null;
    to: Dayjs | null;
  }) => {
    setDateRange(dates);
  };
  const getreport = () => {
    if (dateRange.from && dateRange.to) {
      setCurrentPage(1); // Reset to first page on new search
      dispatch(
        getR11Report({
          from: dateRange.from.format("YYYY-MM-DD"),
          to: dateRange.to.format("YYYY-MM-DD"),
          page: currentPage,
          limit: pageSize,
        })
      );
    }
  };
  // const onBtExport = useCallback(() => {
  //   gridRef.current!.api.exportDataAsExcel({
  //     sheetName: "R11 Report", // Set your desired sheet name here
  //   });
  // }, []);

   const onBtExport = () => {
    if(dateRange.from && dateRange.to){
      emitR11Report({startDate:dateRange.from?.format("YYYY-MM-DD"),endDate:dateRange.to?.format("YYYY-MM-DD")});
    }
    else{
      showToast("Please select Date range", "error");
    }
    };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (dateRange.from && dateRange.to) {
      dispatch(
        getR11Report({
          from: dateRange.from.format("YYYY-MM-DD"),
          to: dateRange.to.format("YYYY-MM-DD"),
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
        getR11Report({
          from: dateRange.from.format("YYYY-MM-DD"),
          to: dateRange.to.format("YYYY-MM-DD"),
          page: 1,
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
                loading={r11ReportLoading}
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
          {r11Report && (
            <>
              <Paper elevation={0} className="rounded-md mt-[20px] px-[20px] ">
                <Typography
                  className=" text-slate-600"
                  fontWeight={600}
                  gutterBottom
                >
                  Device Status
                </Typography>
                <Divider />
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Total Approve"
                      secondary={r11Report?.totalApprove}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Total Pending"
                      secondary={r11Report?.totalPending}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Total Reject"
                      secondary={r11Report?.totalReject || "--"}
                    />
                  </ListItem>
                </List>
              </Paper>
            </>
          )}
        </div>
        <div className="w-full">
          <R11ReportTable
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

export default R11Report;
