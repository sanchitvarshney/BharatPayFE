import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { AgGridReact } from "@ag-grid-community/react";
import { IconButton, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

import SpeakerAssemblyTable from "@/table/report/summary-tables/SpeakerAssemblyTable";
import HoldPartConsumptionAssemblyTable from "@/table/report/summary-tables/HoldPartConsumptionAssemblyTable";
import DateRangeBadge from "@/components/reusable/DateRangeBadge";
import SegmentedToggle from "@/components/reusable/SegmentedToggle";
import {
  getSpeakerAssembly,
  rangeKey,
} from "@/features/summarySlice/billingSlices";

type ViewMode = "trc" | "hold";

const SpeakerAssembly: React.FC = () => {
  const [mode, setMode] = useState<ViewMode>("trc");
  const dispatch = useAppDispatch();
  dayjs.extend(customParseFormat);
  const dateRange = useAppSelector((state) => state.summary?.dateRange);
  const speakerAssemblyData = useAppSelector(
    (state) => state.summary?.speakerAssemblyData,
  );
    const tabValue = useAppSelector(
    (state) => state.summary?.tabValue,
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
        limit: 10,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, dateRange]);

  const handlePageChange = (page: number) => {
    dispatch(
      getSpeakerAssembly({
        from: dayjs(dateRange?.[0]).format("DD-MM-YYYY"),
        to: dayjs(dateRange?.[1]).format("DD-MM-YYYY"),

        page: page,
        limit: 10,
      }),
    );
  };


  const handleRefresh = () => {
    dispatch(
      getSpeakerAssembly({
        from: dayjs(dateRange?.[0]).format("DD-MM-YYYY"),
        to: dayjs(dateRange?.[1]).format("DD-MM-YYYY"),
        page: 1,
        limit: 10,
      }),
    );
  };

  return (
    <div className={`bg-white ${tabValue === "preview" ? "h-[calc(100vh-100px)] " : "h-[calc(100vh-155px)]"} p-1 flex flex-col`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SegmentedToggle
            value={mode}
            onChange={(value) => setMode(value as ViewMode)}
            options={[
              { value: "trc", label: "Dispatch" },
              { value: "hold", label: "Hold" },
            ]}
          />
        </div>
        {mode === "trc" && (
          <div className="flex items-center gap-3">
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
        )}
      </div>
      <div className="w-full  mt-1">
        {mode === "trc" ? (
          <SpeakerAssemblyTable
            gridRef={gridRef}
            handlePageChange={handlePageChange}
          
          />
        ) : (
          <HoldPartConsumptionAssemblyTable />
        )}
      </div>
    </div>
  );
};

export default SpeakerAssembly;
