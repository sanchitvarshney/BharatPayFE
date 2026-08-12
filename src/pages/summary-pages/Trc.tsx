import React, { useRef, useState } from "react";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { AgGridReact } from "@ag-grid-community/react";
import LoadingButton from "@mui/lab/LoadingButton";
import SearchIcon from "@mui/icons-material/Search";
import { showToast } from "@/utils/toasterContext";
import { Icons } from "@/components/icons";
import { rangePresets } from "@/utils/rangePresets";
import { Button } from "@/components/ui/button";
import { getTRC } from "@/features/summarySlice/billingSlices";
import { Typography } from "@mui/material";
import TrcTable from "@/table/report/summary-tables/TrcTable";

const Trc: React.FC = () => {
  const [colapse, setcolapse] = useState<boolean>(false);
  const [date, setDate] = useState<{ from: Dayjs | null; to: Dayjs | null }>({
    from: null,
    to: null,
  });
  const [pageSize, setPageSize] = useState<number>(20);
  const dispatch = useAppDispatch();
  dayjs.extend(customParseFormat);
  const trcLoading = useAppSelector(
    (state) => state.summary?.trcLoading,
  );
  const gridRef = useRef<AgGridReact<any>>(null);
  const { RangePicker } = DatePicker;
  //   const { emitR6DispatchReport, isConnected } = useSocketContext();

  //   const onBtExport = () => {
  //     if (type === "min") {
  //       emitR6DispatchReport({
  //         type: "MINNO",
  //         data: min,
  //         module: moduleType,
  //       });
  //     } else {
  //       emitR6DispatchReport({
  //         type: type === "date" ? "DATE" : type,
  //         startDate: date.from?.format("DD-MM-YYYY") || "",
  //         endDate: date.to?.format("DD-MM-YYYY") || "",
  //         module: moduleType,
  //       });
  //     }
  //   };

  const handlePageChange = (page: number) => {
    dispatch(
      getTRC({
        from: dayjs(date.from).format("DD-MM-YYYY"),
        to: dayjs(date.to).format("DD-MM-YYYY"),

        page: page,
        limit: pageSize,
      }),
    );
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPageSize(pageSize);
    dispatch(
      getTRC({
        from: dayjs(date.from).format("DD-MM-YYYY"),
        to: dayjs(date.to).format("DD-MM-YYYY"),
        page: 1,
        limit: pageSize,
      }),
    );
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
          <div className="flex flex-col   gap-[20px] py-[10px] px-[20px]   mt-[0px] overflow-hidden">
            <div>
                <Typography fontWeight={500} variant="subtitle1">
                  Date Range
                </Typography>
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

            
                <div className="flex justify-end mt-[20px]">
                  <LoadingButton
                    loadingPosition="start"
                    onClick={() => {
                      if (!date.from || !date.to) {
                        showToast("Please select date range", "error");
                      } else {
                        dispatch(
                          getTRC({
                            from: dayjs(date.from).format("DD-MM-YYYY"),
                            to: dayjs(date.to).format("DD-MM-YYYY"),

                            page: 1,
                            limit: pageSize,
                          }),
                        );
                      }
                    }}
                    variant="contained"
                    loading={trcLoading}
                    disabled={!date || trcLoading}
                    startIcon={<SearchIcon fontSize="small" />}
                  >
                    Search
                  </LoadingButton>
                  {/* <MuiTooltip title="Download" placement="right">
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
                        // onClick={() => onBtExport()}
                        size="small"
                        sx={{ zIndex: 1 }}
                      >
                        <Icons.download />
                      </LoadingButton>
                    </MuiTooltip> */}
                </div>
           
            </div>
          </div>
        </div>
        <div className="w-full">
          <TrcTable
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

export default Trc;
