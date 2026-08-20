import React, { useCallback, useEffect, useRef, useState } from "react";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
import { AgGridReact } from "@ag-grid-community/react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { IconButton, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import DispatchedTable from "@/table/report/summary-tables/DispatchedTable";
import HoldDispatchTable from "@/table/report/summary-tables/HoldDispatchTable";
import DateRangeBadge from "@/components/reusable/DateRangeBadge";
import SegmentedToggle from "@/components/reusable/SegmentedToggle";
import {
  getDispatchedSummary,
  rangeKey,
} from "@/features/summarySlice/billingSlices";

dayjs.extend(customParseFormat);

type ViewMode = "trc" | "hold";

const Dispatched: React.FC = () => {
  const [mode, setMode] = useState<ViewMode>("trc");
  const dispatch = useAppDispatch();
  const dateRange = useAppSelector((state) => state.summary?.dateRange);
  const dispatchedData = useAppSelector(
    (state) => state.summary?.dispatchedData,
  );
  const dispatchedLoading = useAppSelector(
    (state) => state.summary?.dispatchedLoading,
  );
    const tabValue = useAppSelector(
    (state) => state.summary?.tabValue,
  );
  const dispatchedRangeKey = useAppSelector(
    (state) => state.summary?.dispatchedRangeKey,
  );

  const gridRef = useRef<AgGridReact<any>>(null);
  const isFirstRender = useRef(true);

  const handlePageChange = useCallback(
    (page: number) => {
      dispatch(
        getDispatchedSummary({
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
        dispatchedData?.data?.length &&
        dispatchedRangeKey === currentRangeKey
      ) {
        return;
      }
    }
    dispatch(
      getDispatchedSummary({
        from: dayjs(dateRange?.[0]).format("DD-MM-YYYY"),
        to: dayjs(dateRange?.[1]).format("DD-MM-YYYY"),
        page: 1,
        limit: 10,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, dateRange]);

  const handleRefresh = () => {
    dispatch(
      getDispatchedSummary({
        from: dayjs(dateRange?.[0]).format("DD-MM-YYYY"),
        to: dayjs(dateRange?.[1]).format("DD-MM-YYYY"),
        page: 1,
        limit: 10,
      }),
    );
  };

  return (
    <div className={`bg-white ${tabValue === "preview" ? "h-[calc(100vh-210px)]" : "h-[calc(100vh-155px)]"}  p-1 flex flex-col`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SegmentedToggle
            value={mode}
            onChange={(value) => setMode(value as ViewMode)}
            options={[
              { value: "trc", label: "Dispatch" },
              { value: "hold", label: "Hold" },
            ]}
          />
        </div>
        {mode === "trc" && (
          <div className="flex items-center gap-3">
            <DateRangeBadge dateRange={dateRange} />
            <Tooltip title="Refresh">
              <IconButton
                disabled={dispatchedLoading}
                onClick={handleRefresh}
                size="small"
              >
                <RefreshIcon
                  className={dispatchedLoading ? "animate-spin" : ""}
                />
              </IconButton>
            </Tooltip>
          </div>
        )}
      </div>
      <div className="w-full  mt-1">
        {mode === "trc" ? (
          <DispatchedTable
            gridRef={gridRef}
            handlePageChange={handlePageChange}
          />
        ) : (
          <HoldDispatchTable />
        )}
      </div>
    </div>
  );
};

export default Dispatched;
