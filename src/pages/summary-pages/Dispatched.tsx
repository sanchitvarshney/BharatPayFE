import React, { useCallback, useEffect, useRef, useState } from "react";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
import { AgGridReact } from "@ag-grid-community/react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import DispatchedTable from "@/table/report/summary-tables/DispatchedTable";
import { getDispatchedSummary } from "@/features/summarySlice/billingSlices";

dayjs.extend(customParseFormat);

const Dispatched: React.FC = () => {
  const dispatch = useAppDispatch();
  const dateRange = useAppSelector((state) => state.summary?.dateRange);
  const dispatchedData = useAppSelector(
    (state) => state.summary?.dispatchedData,
  );
  const [pageSize, setPageSize] = useState<number>(20);

  const gridRef = useRef<AgGridReact<any>>(null);
  const isFirstRender = useRef(true);

  const handlePageChange = useCallback(
    (page: number) => {
      dispatch(
        getDispatchedSummary({
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
        getDispatchedSummary({
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
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (dispatchedData?.data?.length) {
        return;
      }
    }
    if (!dateRange || !dateRange[0] || !dateRange[1]) {
      return;
    }
    dispatch(
      getDispatchedSummary({
        from: dayjs(dateRange?.[0]).format("DD-MM-YYYY"),
        to: dayjs(dateRange?.[1]).format("DD-MM-YYYY"),
        page: 1,
        limit: pageSize,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, dateRange, pageSize]);

  return (
    <div className="bg-white h-[calc(100vh-100px)] flex relative">
      <div className="w-full">
        <DispatchedTable
          gridRef={gridRef}
          handlePageChange={handlePageChange}
          handlePageSizeChange={handlePageSizeChange}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
};

export default Dispatched;
