import React, { useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Alert, IconButton, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import DateRangeBadge from "@/components/reusable/DateRangeBadge";
import { getSwipeSkuConsumption } from "@/features/swipeBilling/swipeBillingSlice";
import { SWIPE_SKU_TABS } from "@/features/swipeBilling/swipeBillingConfig";
import SwipeSkuConsumptionTable from "@/table/report/swipe-billing-tables/SwipeSkuConsumptionTable";
import useSwipeDateRange from "./useSwipeDateRange";

const SKU_CONSUMPTION_LIMIT = 500;

const SwipeSkuConsumption: React.FC = () => {
  const dispatch = useAppDispatch();
  const { skuKey = "" } = useParams<{ skuKey: string }>();
  const sku = SWIPE_SKU_TABS.find((tab) => tab.key === skuKey);
  const { dateRange, range } = useSwipeDateRange();
  const entry = useAppSelector(
    (state) => state.swipeBilling.skuConsumption[skuKey],
  );
  const loading = !!entry?.loading;

  const fetchPage = useCallback(
    (page: number) => {
      if (!range || !sku?.skuId) return;
      dispatch(
        getSwipeSkuConsumption({
          skuKey: sku.key,
          skuId: sku.skuId,
          from: range.from,
          to: range.to,
          page,
          limit: SKU_CONSUMPTION_LIMIT,
        }),
      );
    },
    [dispatch, range, sku],
  );

  useEffect(() => {
    if (!range || !sku?.skuId) return;
    if (entry?.data && entry.rangeKey === range.key) return;
    fetchPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range?.key, skuKey]);

  if (!sku) {
    return (
      <div className="p-4">
        <Alert severity="error">Unknown SKU.</Alert>
      </div>
    );
  }

  if (!sku.skuId) {
    return (
      <div className="p-4">
        <Alert severity="warning">
          SKU id for {sku.label} is not configured yet.
        </Alert>
      </div>
    );
  }

  return (
    <div className="bg-white h-full p-1 flex flex-col">
      <div className="flex items-center justify-between">
        <span className="text-[15px] font-[600] text-slate-700 px-1">
          {sku.label}
        </span>
        <div className="flex items-center gap-3">
          <DateRangeBadge dateRange={dateRange} />
          <Tooltip title="Refresh">
            <IconButton
              disabled={loading}
              onClick={() => fetchPage(1)}
              size="small"
            >
              <RefreshIcon className={loading ? "animate-spin" : ""} />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <div className="w-full mt-1 flex flex-col flex-1 min-h-0">
        <SwipeSkuConsumptionTable
          data={entry?.data}
          loading={loading}
          handlePageChange={fetchPage}
          pageSize={SKU_CONSUMPTION_LIMIT}
        />
      </div>
    </div>
  );
};

export default SwipeSkuConsumption;
