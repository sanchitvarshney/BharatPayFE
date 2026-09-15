import React, { useCallback, useEffect, useRef } from "react";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
import { AgGridReact } from "@ag-grid-community/react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { IconButton, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

import AssemblyAndTRCTable from "@/table/report/summary-tables/AssemblyAndTRCTable";
import DateRangeBadge from "@/components/reusable/DateRangeBadge";
import {
  getAssableAndTRC,
  rangeKey,
} from "@/features/summarySlice/billingSlices";

dayjs.extend(customParseFormat);

const AssemblyAndTRC: React.FC = () => {
  const dispatch = useAppDispatch();
  const dateRange = useAppSelector((state) => state.summary?.dateRange);
    const isFirstRender = useRef(true);
 const trcAssemblyLoading = useAppSelector(
    (state) => state.summary?.trcAssemblyLoading,
 )
  const tabValue = useAppSelector(
    (state) => state.summary?.tabValue,
 )
   const trcAssemblyData = useAppSelector(
     (state) => state.summary?.trcAssemblyData,
   );
   const trcAssemblyRangeKey = useAppSelector(
     (state) => state.summary?.trcAssemblyRangeKey,
   );

  const gridRef = useRef<AgGridReact<any>>(null);

  const handlePageChange = useCallback(
    (page: number) => {
      dispatch(
        getAssableAndTRC({
          from: dayjs(dateRange?.[0]).format("DD-MM-YYYY"),
          to: dayjs(dateRange?.[1]).format("DD-MM-YYYY"),
          page: page,
          limit: 10,
        }),
      );
    },
    [dispatch, dateRange],
  );



  useEffect(() => {
   if (!dateRange || !dateRange[0] || !dateRange[1]) {
      isFirstRender.current = false;
      return;
    }
    const currentRangeKey = rangeKey(
      dayjs(dateRange[0]).format("DD-MM-YYYY"),
      dayjs(dateRange[1]).format("DD-MM-YYYY"),
    );
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (
        trcAssemblyData?.data?.length &&
        trcAssemblyRangeKey === currentRangeKey
      ) {
        return;
      }
    }
    dispatch(
      getAssableAndTRC({
        from: dayjs(dateRange?.[0]).format("DD-MM-YYYY"),
        to: dayjs(dateRange?.[1]).format("DD-MM-YYYY"),
        page: 1,
        limit: 10,
      }),
    );
  }, [dispatch, dateRange]);

  const handleRefresh = async () => {
 
    await dispatch(
      getAssableAndTRC({
        from: dayjs(dateRange?.[0]).format("DD-MM-YYYY"),
        to: dayjs(dateRange?.[1]).format("DD-MM-YYYY"),
        page: 1,
        limit: 10,
      }),
    );
  
  };

  return (
    <div className={`bg-white ${tabValue === "preview" ? "h-[calc(100vh-100px)] " : "h-[calc(100vh-150px)]"}  p-1 flex flex-col`}>
      <div className="flex items-center justify-between">
        <DateRangeBadge dateRange={dateRange} />
        <Tooltip title="Refresh">
          <IconButton
            disabled={trcAssemblyLoading}
            onClick={handleRefresh}
            size="small"
          >
            <RefreshIcon className={trcAssemblyLoading ? "animate-spin" : ""} />
          </IconButton>
        </Tooltip>
      </div>
      <div className="w-full  mt-1">
        <AssemblyAndTRCTable
          gridRef={gridRef}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default AssemblyAndTRC;
