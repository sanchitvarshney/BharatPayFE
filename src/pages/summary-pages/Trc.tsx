import React, { useCallback, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { AgGridReact } from "@ag-grid-community/react";
import { IconButton, Tooltip, CircularProgress } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useDropzone } from "react-dropzone";
import {
  getTRC,
  rangeKey,
  setTrcMode,
  uploadHoldPartConsumptionTRC,
} from "@/features/summarySlice/billingSlices";
import TrcTable from "@/table/report/summary-tables/TrcTable";
import HoldPartConsumptionTable from "@/table/report/summary-tables/HoldPartConsumptionTable";
import DateRangeBadge from "@/components/reusable/DateRangeBadge";
import SegmentedToggle from "@/components/reusable/SegmentedToggle";
import { showToast } from "@/utils/toasterContext";

type ViewMode = "trc" | "hold";

const Trc: React.FC = () => {
  const [pageSize, setPageSize] = useState<number>(20);
  const dispatch = useAppDispatch();
  dayjs.extend(customParseFormat);
  const dateRange = useAppSelector((state) => state.summary?.dateRange);
  const trcLoading = useAppSelector((state) => state.summary?.trcLoading);
  const isFirstRender = useRef(true);
  const trcData = useAppSelector((state) => state.summary?.trcData);
  const trcRangeKey = useAppSelector((state) => state.summary?.trcRangeKey);
  const holdLoading = useAppSelector((state) => state.summary?.holdLoading);
  const mode = useAppSelector(
    (state) => state.summary?.trcMode,
  ) as ViewMode;
  const [holdFileName, setHoldFileName] = useState<string | null>(null);

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
      isFirstRender.current = false;
      return;
    }
    const currentRangeKey = rangeKey(
      dayjs(dateRange[0]).format("DD-MM-YYYY"),
      dayjs(dateRange[1]).format("DD-MM-YYYY"),
    );
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (trcData?.data?.length && trcRangeKey === currentRangeKey) {
        return;
      }
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

  const handleHoldUpload = useCallback(
    (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      setHoldFileName(file.name);
      dispatch(uploadHoldPartConsumptionTRC(formData)).then((res) => {
        const payload: any = res?.payload;
        if (payload?.data?.success) {
          showToast(
            payload?.data?.message || "File uploaded successfully",
            "success",
          );
        }
      });
    },
    [dispatch],
  );

  const onHoldDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        handleHoldUpload(file);
      }
    },
    [handleHoldUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onHoldDrop,
    multiple: false,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
  });

  return (
    <div className="bg-white h-[calc(100vh-100px)]  p-1 flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SegmentedToggle
            value={mode}
            onChange={(value) => dispatch(setTrcMode(value as ViewMode))}
            options={[
              { value: "trc", label: "Dispatch" },
              { value: "hold", label: "Hold" },
            ]}
          />
        </div>
        {mode === "trc" ? (
          <div className="flex items-center gap-3">
            <DateRangeBadge dateRange={dateRange} />
            <Tooltip title="Refresh">
              <IconButton
                disabled={trcLoading}
                onClick={handleRefresh}
                size="small"
              >
                <RefreshIcon className={trcLoading ? "animate-spin" : ""} />
              </IconButton>
            </Tooltip>
          </div>
        ) : (
          <div
            {...getRootProps()}
            className={`flex items-center gap-2 border border-dashed rounded px-3 py-1 text-sm cursor-pointer ${
              isDragActive
                ? "bg-blue-50 border-blue-400"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            <input {...getInputProps()} />
            {holdLoading ? (
              <CircularProgress size={16} />
            ) : (
              <CloudUploadIcon fontSize="small" color="primary" />
            )}
            <span className="text-gray-600">
              {holdLoading
                ? "Uploading..."
                : holdFileName
                  ? holdFileName
                  : isDragActive
                    ? "Drop Excel file here"
                    : "Drag & drop or click to upload Excel"}
            </span>
          </div>
        )}
      </div>
      <div className="w-full  mt-1">
        {mode === "trc" ? (
          <TrcTable
            gridRef={gridRef}
            handlePageChange={handlePageChange}
            handlePageSizeChange={handlePageSizeChange}
            pageSize={pageSize}
          />
        ) : (
          <HoldPartConsumptionTable />
        )}
      </div>
    </div>
  );
};

export default Trc;
