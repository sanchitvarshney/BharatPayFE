import React, { useCallback, useEffect } from "react";
import { IconButton, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import DateRangeBadge from "@/components/reusable/DateRangeBadge";
import { getSwipeDispatched } from "@/features/swipeBilling/swipeBillingSlice";
import { SWIPE_DISPATCH_LOCATION } from "@/features/swipeBilling/swipeBillingConfig";
import SwipeDispatchTable from "@/table/report/swipe-billing-tables/SwipeDispatchTable";
import useSwipeDateRange from "./useSwipeDateRange";

const DISPATCH_LIMIT = 100;

const SwipeDispatch: React.FC = () => {
  const dispatch = useAppDispatch();
  const { dateRange, range } = useSwipeDateRange();
  const { dispatchData, dispatchLoading, dispatchRangeKey } = useAppSelector(
    (state) => state.swipeBilling,
  );

  const fetchPage = useCallback(
    (page: number) => {
      if (!range) return;
      dispatch(
        getSwipeDispatched({
          from: range.from,
          to: range.to,
          page,
          limit: DISPATCH_LIMIT,
          locOut: SWIPE_DISPATCH_LOCATION,
        }),
      );
    },
    [dispatch, range],
  );

  useEffect(() => {
    if (!range) return;
    if (dispatchData && dispatchRangeKey === range.key) return;
    fetchPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range?.key]);

  return (
    <div className="bg-white h-full p-1 flex flex-col">
      <div className="flex items-center justify-between">
        <span className="text-[14px] font-[500] text-slate-600 px-1">
          Total Dispatched:{" "}
          <span className="font-[700] text-slate-800">
            {dispatchData?.total_dispatched ?? 0}
          </span>
        </span>
        <div className="flex items-center gap-3">
          <DateRangeBadge dateRange={dateRange} />
          <Tooltip title="Refresh">
            <IconButton
              disabled={dispatchLoading}
              onClick={() => fetchPage(1)}
              size="small"
            >
              <RefreshIcon className={dispatchLoading ? "animate-spin" : ""} />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <div className="w-full mt-1 flex flex-col flex-1 min-h-0">
        <SwipeDispatchTable
          handlePageChange={fetchPage}
          pageSize={DISPATCH_LIMIT}
        />
      </div>
    </div>
  );
};

export default SwipeDispatch;
