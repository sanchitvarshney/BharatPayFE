import React, {  useEffect, useRef } from "react";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
import { AgGridReact } from "@ag-grid-community/react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { IconButton, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import MaterialPurchaseTable from "@/table/report/summary-tables/MaterialPurchaseTable";
import DateRangeBadge from "@/components/reusable/DateRangeBadge";
import {
  getMaterialPurchased,
  rangeKey,
} from "@/features/summarySlice/billingSlices";

dayjs.extend(customParseFormat);

const MaterialPurchase: React.FC = () => {
  const dispatch = useAppDispatch();
  const dateRange = useAppSelector((state) => state.summary?.dateRange);
  const materialData = useAppSelector((state) => state.summary?.materialData);
  const materialLoading = useAppSelector(
    (state) => state.summary?.materialLoading,
  );
  const materialRangeKey = useAppSelector(
    (state) => state.summary?.materialRangeKey,
  );
  // const [pageSize, setPageSize] = useState<number>(20);

  const gridRef = useRef<AgGridReact<any>>(null);
  const isFirstRender = useRef(true);

  // const handlePageChange = useCallback((page: number) => {
  //   dispatch(
  //     getr3Report({
  //       from: dayjs(dateRange?.[0]).format("DD-MM-YYYY"),
  //       to: dayjs(dateRange?.[1]).format("DD-MM-YYYY"),
  //       page: page,
  //       limit: pageSize,
  //     }),
  //   );
  // }, [dispatch, dateRange, pageSize]);

  // const handlePageSizeChange = useCallback((newPageSize: number) => {
  //   setPageSize(newPageSize);
  //   dispatch(
  //     getr3Report({
  //       from: dayjs(dateRange?.[0]).format("DD-MM-YYYY"),
  //       to: dayjs(dateRange?.[1]).format("DD-MM-YYYY"),
  //       page: 1,
  //       limit: newPageSize,
  //     }),
  //   );
  // }, [dispatch, dateRange]);


  
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
      if (materialData?.data?.length && materialRangeKey === currentRangeKey) {
        return;
      }
    }
    dispatch(
      getMaterialPurchased({
        from: dayjs(dateRange?.[0]).format("DD-MM-YYYY"),
        to: dayjs(dateRange?.[1]).format("DD-MM-YYYY"),
        // page: 1,
        // limit: pageSize,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, dateRange]);

  const handleRefresh = () => {
    dispatch(
      getMaterialPurchased({
        from: dayjs(dateRange?.[0]).format("DD-MM-YYYY"),
        to: dayjs(dateRange?.[1]).format("DD-MM-YYYY"),
      }),
    );
  };

  return (
    <div className="bg-white h-[calc(100vh-100px)]  p-1 flex flex-col">
    <div className="flex items-center justify-between">
        <DateRangeBadge dateRange={dateRange} />
        <Tooltip title="Refresh">
          <IconButton
            disabled={materialLoading}
            onClick={handleRefresh}
            size="small"
          >
            <RefreshIcon className={materialLoading ? "animate-spin" : ""} />
          </IconButton>
        </Tooltip>
      </div>
      <div className="w-full  mt-1">
        <MaterialPurchaseTable
          gridRef={gridRef}
          // handlePageChange={handlePageChange}
          // handlePageSizeChange={handlePageSizeChange}
          // pageSize={pageSize}
        />
      </div>
    </div>
  );
};

export default MaterialPurchase;
