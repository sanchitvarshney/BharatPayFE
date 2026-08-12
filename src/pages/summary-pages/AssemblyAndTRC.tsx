import React, { useCallback, useEffect, useRef, useState } from "react";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
import { AgGridReact } from "@ag-grid-community/react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getr3Report } from "@/features/report/report/reportSlice";
import AssemblyAndTRCTable from "@/table/report/summary-tables/AssemblyAndTRCTable";
import { getAssembly } from "@/features/summarySlice/billingSlices";

dayjs.extend(customParseFormat);

const AssemblyAndTRC: React.FC = () => {
  const dispatch = useAppDispatch();
  const dateRange = useAppSelector((state) => state.summary?.dateRange);
  const [pageSize, setPageSize] = useState<number>(20);

  const gridRef = useRef<AgGridReact<any>>(null);

  const handlePageChange = useCallback((page: number) => {
    dispatch(
      getr3Report({
        from: dayjs(dateRange?.[0]).format("DD-MM-YYYY"),
        to: dayjs(dateRange?.[1]).format("DD-MM-YYYY"),
        page: page,
        limit: pageSize,
      }),
    );
  }, [dispatch, dateRange, pageSize]);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    dispatch(
      getr3Report({
        from: dayjs(dateRange?.[0]).format("DD-MM-YYYY"),
        to: dayjs(dateRange?.[1]).format("DD-MM-YYYY"),
        page: 1,
        limit: newPageSize,
      }),
    );
  }, [dispatch, dateRange]);

  
    useEffect(() => {
      if (!dateRange || !dateRange[0] || !dateRange[1]) {
        return;
      }
      dispatch(
        getAssembly({
          from: dayjs(dateRange?.[0]).format("DD-MM-YYYY"),
          to: dayjs(dateRange?.[1]).format("DD-MM-YYYY"),
          page: 1,
          limit: pageSize,
        }),
      );
    }, [dispatch, dateRange, pageSize]);



  return (
    <div className="bg-white h-[calc(100vh-100px)] flex relative">
   
      <div className="w-full">
        <AssemblyAndTRCTable
          gridRef={gridRef}
          handlePageChange={handlePageChange}
          handlePageSizeChange={handlePageSizeChange}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
};

export default AssemblyAndTRC;
