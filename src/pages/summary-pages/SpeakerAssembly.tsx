import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { AgGridReact } from "@ag-grid-community/react";

import SpeakerAssemblyTable from "@/table/report/summary-tables/SpeakerAssemblyTable";
import { getSpeakerAssembly } from "@/features/summarySlice/billingSlices";

const SpeakerAssembly: React.FC = () => {
  const [pageSize, setPageSize] = useState<number>(20);
  const dispatch = useAppDispatch();
  dayjs.extend(customParseFormat);
  const dateRange = useAppSelector((state) => state.summary?.dateRange);
  const speakerAssemblyData = useAppSelector(
    (state) => state.summary?.speakerAssemblyData,
  );
  const gridRef = useRef<AgGridReact<any>>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (speakerAssemblyData?.data?.length) {
        return;
      }
    }
    if (!dateRange || !dateRange[0] || !dateRange[1]) {
      return;
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

  return (
    <>
      <div className="h-[calc(100vh-100px)] flex bg-white relative">
     
        <div className="w-full">
          <SpeakerAssemblyTable
            gridRef={gridRef}
            handlePageChange={handlePageChange}
            handlePageSizeChange={handlePageSizeChange}
            pageSize={pageSize}
          />
        </div>
      </div>
    </>
  );
};

export default SpeakerAssembly;
