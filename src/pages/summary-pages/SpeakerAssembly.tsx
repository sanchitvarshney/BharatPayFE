import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { AgGridReact } from "@ag-grid-community/react";
import { IconButton, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

import SpeakerAssemblyTable from "@/table/report/summary-tables/SpeakerAssemblyTable";
import DateRangeBadge from "@/components/reusable/DateRangeBadge";
import {
  getSpeakerAssembly,
  rangeKey,
} from "@/features/summarySlice/billingSlices";

const SpeakerAssembly: React.FC = () => {
  const [pageSize, setPageSize] = useState<number>(20);
  const dispatch = useAppDispatch();
  dayjs.extend(customParseFormat);
  const dateRange = useAppSelector((state) => state.summary?.dateRange);
  const speakerAssemblyData = useAppSelector(
    (state) => state.summary?.speakerAssemblyData,
  );
  const speakerAssemblyLoading = useAppSelector(
    (state) => state.summary?.speakerAssemblyLoading,
  );
  const speakerAssemblyRangeKey = useAppSelector(
    (state) => state.summary?.speakerAssemblyRangeKey,
  );
  const gridRef = useRef<AgGridReact<any>>(null);
  const isFirstRender = useRef(true);

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
        speakerAssemblyData?.data?.length &&
        speakerAssemblyRangeKey === currentRangeKey
      ) {
        return;
      }
    }
    dispatch(
      getSpeakerAssembly({
        from: dayjs(dateRange?.[0]).format("DD-MM-YYYY"),
        to: dayjs(dateRange?.[1]).format("DD-MM-YYYY"),
        page: 1,
        limit: pageSize,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, dateRange, pageSize]);

  const handlePageChange = (page: number) => {
    dispatch(
      getSpeakerAssembly({
        from: dayjs(dateRange?.[0]).format("DD-MM-YYYY"),
        to: dayjs(dateRange?.[1]).format("DD-MM-YYYY"),

        page: page,
        limit: pageSize,
      }),
    );
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPageSize(pageSize);
    dispatch(
      getSpeakerAssembly({
        from: dayjs(dateRange?.[0]).format("DD-MM-YYYY"),
        to: dayjs(dateRange?.[1]).format("DD-MM-YYYY"),
        page: 1,
        limit: pageSize,
      }),
    );
  };

  const handleRefresh = () => {
    dispatch(
      getSpeakerAssembly({
        from: dayjs(dateRange?.[0]).format("DD-MM-YYYY"),
        to: dayjs(dateRange?.[1]).format("DD-MM-YYYY"),
        page: 1,
        limit: pageSize,
      }),
    );
  };

  return (
    <div className="bg-white h-[calc(100vh-100px)]  p-1 flex flex-col">
      <div className="flex items-center justify-between">
        <DateRangeBadge dateRange={dateRange} />
        <Tooltip title="Refresh">
          <IconButton
            disabled={speakerAssemblyLoading}
            onClick={handleRefresh}
            size="small"
          >
            <RefreshIcon
              className={speakerAssemblyLoading ? "animate-spin" : ""}
            />
          </IconButton>
        </Tooltip>
      </div>
      <div className="w-full  mt-1">
        <SpeakerAssemblyTable
          gridRef={gridRef}
          handlePageChange={handlePageChange}
          handlePageSizeChange={handlePageSizeChange}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
};

export default SpeakerAssembly;
