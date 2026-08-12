import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { AgGridReact } from "@ag-grid-community/react";
import { IconButton, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { getTRC } from "@/features/summarySlice/billingSlices";
import TrcTable from "@/table/report/summary-tables/TrcTable";

const Trc: React.FC = () => {
  const [pageSize, setPageSize] = useState<number>(20);
  const dispatch = useAppDispatch();
  dayjs.extend(customParseFormat);
  const dateRange = useAppSelector((state) => state.summary?.dateRange);
  const trcLoading = useAppSelector((state) => state.summary?.trcLoading);
  const gridRef = useRef<AgGridReact<any>>(null);
  //   const { emitR6DispatchReport, isConnected } = useSocketContext();

  //   const onBtExport = () => {
  //     if (type === "min") {
  //       emitR6DispatchReport({
  //         type: "MINNO",
  //         data: min,
  //         module: moduleType,
  //       });
  //     } else {
  //       emitR6DispatchReport({
  //         type: type === "date" ? "DATE" : type,
  //         startDate: date.from?.format("DD-MM-YYYY") || "",
  //         endDate: date.to?.format("DD-MM-YYYY") || "",
  //         module: moduleType,
  //       });
  //     }
  //   };

  const handlePageChange = (page: number) => {
    dispatch(
      getTRC({
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
      getTRC({
        from: dayjs(dateRange?.[0]).format("DD-MM-YYYY"),
        to: dayjs(dateRange?.[1]).format("DD-MM-YYYY"),
        page: 1,
        limit: pageSize,
      }),
    );
  };

    useEffect(() => {
      if (!dateRange || !dateRange[0] || !dateRange[1]) {
        return;
      }
      dispatch(
        getTRC({
          from: dayjs(dateRange?.[0]).format("DD-MM-YYYY"),
          to: dayjs(dateRange?.[1]).format("DD-MM-YYYY"),
          page: 1,
          limit: pageSize,
        }),
      );
    }, [dispatch, dateRange, pageSize]);

  const handleRefresh = () => {
    dispatch(
      getTRC({
        from: dayjs(dateRange?.[0]).format("DD-MM-YYYY"),
        to: dayjs(dateRange?.[1]).format("DD-MM-YYYY"),
        page: 1,
        limit: pageSize,
      }),
    );
  };

  return (
    <div className="bg-white h-[calc(100vh-100px)]  p-1 flex flex-col">
      <Tooltip title="Refresh">
        <IconButton
          className="self-end"
          disabled={trcLoading}
          onClick={handleRefresh}
          size="small"
        >
          <RefreshIcon className={trcLoading ? "animate-spin" : ""} />
        </IconButton>
      </Tooltip>
      <div className="w-full  mt-1">
        <TrcTable
          gridRef={gridRef}
          handlePageChange={handlePageChange}
          handlePageSizeChange={handlePageSizeChange}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
};

export default Trc;
