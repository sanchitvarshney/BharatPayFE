import React, { useCallback, useEffect } from "react";
import { IconButton, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import DateRangeBadge from "@/components/reusable/DateRangeBadge";
import { getSwipeSummaryReport } from "@/features/swipeBilling/swipeBillingSlice";
import SwipeSummaryReportTable from "@/table/report/swipe-billing-tables/SwipeSummaryReportTable";
import useSwipeDateRange from "./useSwipeDateRange";
import { SWIPE_SUMMARY_LIMIT } from "./SwipeBillingSummary";

const SwipeSummaryReport: React.FC = () => {
  const dispatch = useAppDispatch();
  const { dateRange, range } = useSwipeDateRange();
  const { summaryReportData, summaryReportLoading, summaryReportRangeKey } =
    useAppSelector((state) => state.swipeBilling);

  const fetchPage = useCallback(
    (page: number) => {
      if (!range) return;
      dispatch(
        getSwipeSummaryReport({
          from: range.from,
          to: range.to,
          page,
          limit: SWIPE_SUMMARY_LIMIT,
        }),
      );
    },
    [dispatch, range],
  );

  useEffect(() => {
    if (!range) return;
    if (summaryReportData && summaryReportRangeKey === range.key) return;
    fetchPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range?.key]);

  return (
    <div className="bg-white h-full p-1 flex flex-col">
      <div className="flex items-center justify-end gap-3">
        <DateRangeBadge dateRange={dateRange} />
        <Tooltip title="Refresh">
          <IconButton
            disabled={summaryReportLoading}
            onClick={() => fetchPage(1)}
            size="small"
          >
            <RefreshIcon className={summaryReportLoading ? "animate-spin" : ""} />
          </IconButton>
        </Tooltip>
      </div>
      <div className="w-full mt-1 flex flex-col flex-1 min-h-0">
        <SwipeSummaryReportTable
          handlePageChange={fetchPage}
          pageSize={SWIPE_SUMMARY_LIMIT}
        />
      </div>
    </div>
  );
};

export default SwipeSummaryReport;
