import React, { useCallback, useEffect } from "react";
import { IconButton, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import DateRangeBadge from "@/components/reusable/DateRangeBadge";
import { getSwipePurchase } from "@/features/swipeBilling/swipeBillingSlice";
import SwipePurchaseTable from "@/table/report/swipe-billing-tables/SwipePurchaseTable";
import useSwipeDateRange from "./useSwipeDateRange";

const SwipePurchase: React.FC = () => {
  const dispatch = useAppDispatch();
  const { dateRange, range } = useSwipeDateRange();
  const { purchaseData, purchaseLoading, purchaseRangeKey } = useAppSelector(
    (state) => state.swipeBilling,
  );

  const fetchData = useCallback(() => {
    if (!range) return;
    dispatch(getSwipePurchase({ from: range.from, to: range.to }));
  }, [dispatch, range]);

  useEffect(() => {
    if (!range) return;
    if (purchaseData && purchaseRangeKey === range.key) return;
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range?.key]);

  return (
    <div className="bg-white h-full p-1 flex flex-col">
      <div className="flex items-center justify-between">
        <span className="text-[14px] font-[500] text-slate-600 px-1">
          Total Components:{" "}
          <span className="font-[700] text-slate-800">
            {purchaseData?.total_components ?? 0}
          </span>
        </span>
        <div className="flex items-center gap-3">
          <DateRangeBadge dateRange={dateRange} />
          <Tooltip title="Refresh">
            <IconButton
              disabled={purchaseLoading}
              onClick={fetchData}
              size="small"
            >
              <RefreshIcon className={purchaseLoading ? "animate-spin" : ""} />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <div className="w-full mt-1 flex flex-col flex-1 min-h-0">
        <SwipePurchaseTable />
      </div>
    </div>
  );
};

export default SwipePurchase;
