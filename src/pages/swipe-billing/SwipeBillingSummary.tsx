import { useState } from "react";
import { DatePicker } from "antd";
import { LoadingButton } from "@mui/lab";
import { Alert, MenuItem, Select } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { rangePresets } from "@/utils/rangePresets";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { showToast } from "@/utils/toasterContext";
import ConfirmationModel from "@/components/reusable/ConfirmationModel";
import DateRangeBadge from "@/components/reusable/DateRangeBadge";
import {
  getSwipeSummaryReport,
  resetSwipeBilling,
  setSwipeDateRange,
  setSwipeIsData,
} from "@/features/swipeBilling/swipeBillingSlice";
import useSwipeDateRange from "./useSwipeDateRange";

const { RangePicker } = DatePicker;

export const SWIPE_SUMMARY_LIMIT = 500;

const SwipeBillingSummary = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { dateRange, range } = useSwipeDateRange();
  const isData = useAppSelector((state) => state.swipeBilling.isData);
  const summaryReportLoading = useAppSelector(
    (state) => state.swipeBilling.summaryReportLoading,
  );
  const [dateError, setDateError] = useState("");
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const handleSearch = async () => {
    if (!range) {
      setDateError("Date range is required");
      return;
    }
    setDateError("");

    try {
      const response = await dispatch(
        getSwipeSummaryReport({
          from: range.from,
          to: range.to,
          page: 1,
          limit: SWIPE_SUMMARY_LIMIT,
        }),
      ).unwrap();

      if (response?.data?.success) {
        showToast(
          response?.data?.message || "Data fetched successfully",
          "success",
        );
        dispatch(setSwipeIsData(true));
      } else {
        showToast(response?.data?.message || "Failed to fetch data", "error");
        dispatch(setSwipeIsData(false));
      }
    } catch (error: any) {
      showToast(error?.message || "Failed to fetch data", "error");
      dispatch(setSwipeIsData(false));
    }
  };

  const handleConfirmReset = () => {
    setDateError("");
    dispatch(resetSwipeBilling());
    setResetConfirmOpen(false);
  };

  return (
    <div className="grid w-full h-full grid-cols-[320px_3fr] bg-white">
      <div className="w-full border-r border-neutral-300 overflow-y-auto">
        <div className="p-[10px] flex flex-col gap-[10px]">
          <div>
            <label className="text-[14px] font-[500] text-slate-600">
              Device Type
            </label>
            <Select fullWidth value="swipemachine" disabled>
              <MenuItem value="swipemachine">Swipe Machine</MenuItem>
            </Select>
          </div>
          <div>
            <label className="text-[14px] font-[500] text-slate-600">
              Date Range
            </label>
            <RangePicker
              placement="bottomRight"
              className="w-full h-[50px]"
              format="DD-MM-YYYY"
              placeholder={["Start date", "End date"]}
              value={dateRange}
              disabled={isData}
              onChange={(dates) => {
                dispatch(setSwipeDateRange(dates));
                dispatch(setSwipeIsData(false));
                if (dates && dates[0] && dates[1]) {
                  setDateError("");
                }
              }}
              presets={rangePresets}
            />
            {dateError && (
              <span className="text-[12px] text-red-500">{dateError}</span>
            )}
          </div>
          <div className="h-[50px] flex items-center gap-[10px] justify-end">
            <LoadingButton
              type="button"
              variant="outlined"
              color="error"
              onClick={() => setResetConfirmOpen(true)}
              sx={{ minWidth: "100px" }}
            >
              Reset
            </LoadingButton>
            <LoadingButton
              type="button"
              variant="contained"
              loading={summaryReportLoading}
              loadingPosition="center"
              disabled={isData}
              onClick={handleSearch}
              sx={{ minWidth: "100px" }}
            >
              Search
            </LoadingButton>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-3 p-6">
        {isData ? (
          <>
            <DateRangeBadge dateRange={dateRange} />
            <Alert severity="success" sx={{ fontWeight: 500 }}>
              Swipe billing data is ready. Open the tabs above to review the
              summary, SKU consumption, dispatch and purchase.
            </Alert>
            <LoadingButton
              variant="outlined"
              onClick={() => navigate("/swipe-billing/summary")}
            >
              Go to Summary
            </LoadingButton>
          </>
        ) : (
          <Alert severity="info" sx={{ fontWeight: 500 }}>
            Select a date range and click Search to load swipe billing data.
          </Alert>
        )}
      </div>

      <ConfirmationModel
        open={resetConfirmOpen}
        onClose={() => setResetConfirmOpen(false)}
        onConfirm={handleConfirmReset}
        title="Reset all data?"
        content="This will clear the date range and all swipe billing results. Do you want to continue?"
        cancelText="No"
        confirmText="Yes"
      />
    </div>
  );
};

export default SwipeBillingSummary;
