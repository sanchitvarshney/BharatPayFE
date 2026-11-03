import { useMemo } from "react";
import dayjs from "dayjs";
import { useAppSelector } from "@/hooks/useReduxHook";
import { swipeRangeKey } from "@/features/swipeBilling/swipeBillingSlice";

/**
 * Shared swipe billing date range, formatted for the API.
 * `range` is null until both dates are picked.
 */
const useSwipeDateRange = () => {
  const dateRange = useAppSelector((state) => state.swipeBilling.dateRange);

  const range = useMemo(() => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) return null;
    const from = dayjs(dateRange[0]).format("DD-MM-YYYY");
    const to = dayjs(dateRange[1]).format("DD-MM-YYYY");
    return { from, to, key: swipeRangeKey(from, to) };
  }, [dateRange]);

  return { dateRange, range };
};

export default useSwipeDateRange;
