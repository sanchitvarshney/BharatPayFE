import React, { useCallback, useEffect, useRef, useState } from "react";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
import { AgGridReact } from "@ag-grid-community/react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { IconButton, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

import AssemblyAndTRCTable from "@/table/report/summary-tables/AssemblyAndTRCTable";
import {
  getAssableAndTRC,
} from "@/features/summarySlice/billingSlices";

dayjs.extend(customParseFormat);

const AssemblyAndTRC: React.FC = () => {
  const dispatch = useAppDispatch();
  const dateRange = useAppSelector((state) => state.summary?.dateRange);
  const [pageSize, setPageSize] = useState<number>(20);
 const trcAssemblyLoading = useAppSelector(
    (state) => state.summary?.trcAssemblyLoading,
 )

  const gridRef = useRef<AgGridReact<any>>(null);

  const handlePageChange = useCallback(
    (page: number) => {
      dispatch(
        getAssableAndTRC({
          from: dayjs(dateRange?.[0]).format("DD-MM-YYYY"),
          to: dayjs(dateRange?.[1]).format("DD-MM-YYYY"),
          page: page,
          limit: pageSize,
        }),
      );
    },
    [dispatch, dateRange, pageSize],
  );

  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      setPageSize(newPageSize);
      dispatch(
        getAssableAndTRC({
          from: dayjs(dateRange?.[0]).format("DD-MM-YYYY"),
          to: dayjs(dateRange?.[1]).format("DD-MM-YYYY"),
          page: 1,
          limit: newPageSize,
        }),
      );
    },
    [dispatch, dateRange],
  );

  useEffect(() => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) {
      return;
    }
    dispatch(
      getAssableAndTRC({
        from: dayjs(dateRange?.[0]).format("DD-MM-YYYY"),
        to: dayjs(dateRange?.[1]).format("DD-MM-YYYY"),
        page: 1,
        limit: pageSize,
      }),
    );
  }, [dispatch, dateRange, pageSize]);

  const handleRefresh = async () => {
 
    await dispatch(
      getAssableAndTRC({
        from: dayjs(dateRange?.[0]).format("DD-MM-YYYY"),
        to: dayjs(dateRange?.[1]).format("DD-MM-YYYY"),
        page: 1,
        limit: pageSize,
      }),
    );
  
  };

  return (
    <div className="bg-white h-[calc(100vh-100px)]  p-1 flex flex-col">
      <Tooltip title="Refresh">
        <IconButton
          className="self-end"
          disabled={trcAssemblyLoading}
          onClick={handleRefresh}
          size="small"
        >
          <RefreshIcon className={trcAssemblyLoading ? "animate-spin" : ""} />
        </IconButton>
      </Tooltip>
      <div className="w-full  mt-1">
        <AssemblyAndTRCTable
          gridRef={gridRef}
          handlePageChange={handlePageChange}
          handlePageSizeChange={handlePageSizeChange}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
};

export default AssemblyAndTRC;
