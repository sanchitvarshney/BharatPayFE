import { useCallback, useMemo } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import {
  ReportDateKey,
  ReportMeta,
  ReportThunk,
  setReportDateRange,
} from "@/features/report/report/reportSummarySlice";
import { showToast } from "@/utils/toasterContext";



export const useR26Report = (key: ReportDateKey, thunk: ReportThunk) => {
  const dispatch = useAppDispatch();
  const range = useAppSelector((state) => state.reportSummary.dateRanges[key]);
  const meta = useAppSelector(
    (state) => state.reportSummary.reportMeta?.[key] as ReportMeta | null,
  );
  const error = useAppSelector(
    (state) => state.reportSummary.reportErrors?.[key] as string | null,
  );

  const date = useMemo(
    () => ({
      from: range.from ? dayjs(range.from) : null,
      to: range.to ? dayjs(range.to) : null,
    }),
    [range],
  );

  const setRange = useCallback(
    (value: [Dayjs | null, Dayjs | null] | null) => {
      dispatch(
        setReportDateRange({
          key,
          from: value?.[0] ? value[0].toISOString() : null,
          to: value?.[1] ? value[1].toISOString() : null,
        }),
      );
    },
    [dispatch, key],
  );

  const generate = useCallback(async () => {
    if (!date.from || !date.to) {
      showToast("Select a date range", "error");
      return;
    }
    try {
      const res = await dispatch(
        thunk({
          from: date.from.format("DD-MM-YYYY"),
          to: date.to.format("DD-MM-YYYY"),
        }),
      ).unwrap();
      if (res?.data?.success) {
        showToast(res?.data?.message || "Report fetched successfully", "success");
      } else {
        showToast(res?.data?.message || "Report fetched failed", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "Something went wrong", "error");
    }
  }, [date, dispatch, thunk]);

  const fileSuffix = meta
    ? `${meta.from}_to_${meta.to}`
    : dayjs().format("DD-MM-YYYY");

  return { date, setRange, generate, meta, error, fileSuffix };
};
