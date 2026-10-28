import React, { useCallback, useMemo, useRef, useState } from "react";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { AgGridReact } from "@ag-grid-community/react";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Chip, Divider, Drawer, IconButton, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { showToast } from "@/utils/toasterContext";
import { rangePresets } from "@/utils/rangePresets";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import MuiTooltip from "@/components/reusable/MuiTooltip";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { DeviceQualityReportRow, fetchDeviceQualityReport } from "@/features/deviceDefect/deviceDefectSlice";
import { getStatusChip } from "@/pages/procurement/adminApproval/helpers";
import FqcImagePreviewModal from "@/pages/queries/fqcDeviceImage/FqcImagePreviewModal";
import { formatServerDateTime } from "@/pages/deviceDefectApproval/deviceDefectApproval.utils";
import { leftAlignedColumn } from "@/utils/agGridAlignUtils";

const { RangePicker } = DatePicker;

const DeviceQualityReport: React.FC = () => {
  const [colapse, setcolapse] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { reportList, reportLoading } = useAppSelector((state) => state.deviceDefect);

  const [date, setDate] = useState<{ from: Dayjs | null; to: Dayjs | null }>({ from: null, to: null });
  const [activeRow, setActiveRow] = useState<DeviceQualityReportRow | null>(null);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const gridRef = useRef<AgGridReact<DeviceQualityReportRow>>(null);
  const activeImages = activeRow?.image_links?.filter(Boolean) ?? [];

  const handleDateChange = (range: [Dayjs | null, Dayjs | null] | null) => {
    setDate({ from: range?.[0] ?? null, to: range?.[1] ?? null });
  };

  const handleSearch = () => {
    if (!date.from || !date.to) {
      showToast("Please select a date", "error");
      return;
    }
    dispatch(
      fetchDeviceQualityReport({
        from: date.from.format("DD-MM-YYYY"),
        to: date.to.format("DD-MM-YYYY"),
      }),
    );
  };

  const onBtExport = useCallback(() => {
    gridRef.current?.api.exportDataAsExcel({
      sheetName: "Device Quality Report",
      fileName: `DeviceQualityReport_${dayjs().format("DD-MM-YYYY_HH-mm")}.xlsx`,
      columnKeys: ["serial_no", "status", "requested_by", "action_by", "remark", "created_at", "images"],
    });
  }, []);

  const defaultColDef = useMemo(
    () => ({
      wrapText: true,
      autoHeight: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    }),
    [],
  );

  const columnDefs = useMemo<any[]>(
    () => [
      { headerName: "#", width: 80, valueGetter: "node.rowIndex+1",  ...leftAlignedColumn,  },
      { headerName: "Serial No.", field: "serial_no", sortable: true, filter: true, flex: 1, minWidth: 180, ...leftAlignedColumn, },
      {
        headerName: "Status",
        field: "status",
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 130,
        cellRenderer: (params: any) => {
          const chip = getStatusChip(params.value);
          return <Chip size="small" label={chip.label} color={chip.color} />;
        },
        ...leftAlignedColumn,
      },
      {
        headerName: "Requested By",
        field: "requested_by",
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 160,
        valueFormatter: (params: any) => params.value || "-",
        ...leftAlignedColumn,
      },
      {
        headerName: "Action By",
        field: "action_by",
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 160,
        valueFormatter: (params: any) => params.value || "-",
        ...leftAlignedColumn,
      },
      {
        headerName: "Remark",
        colId: "remark",
        sortable: true,
        filter: true,
        flex: 2,
        minWidth: 240,
        valueGetter: (params: any) => params.data?.remarks || params.data?.remark || "-",
        tooltipValueGetter: (params: any) => (params.value && params.value !== "-" ? params.value : undefined),
        ...leftAlignedColumn,
      },
      {
        headerName: "Action Date & Time",
        field: "created_at",
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 180,
        ...leftAlignedColumn,
        valueFormatter: (params: any) => formatServerDateTime(params.value),
      },
      {
        headerName: "Images",
        colId: "images",
        flex: 1,
        minWidth: 170,
        valueGetter: (params: any) => params.data?.image_links?.filter(Boolean).length ?? 0,
        cellRenderer: (params: any) => (
          <Button
            size="sm"
            variant="secondary"
            className="h-7 px-2 text-xs"
            disabled={!params.value}
            onClick={() => setActiveRow(params.data)}
          >
            <Icons.view sx={{ fontSize: 16 }} />
            <span className="ml-1 font-medium">View Images ({params.value})</span>
          </Button>
        ),
        ...leftAlignedColumn,
      },
    ],
    [],
  );

  return (
    <div className="bg-white h-[calc(100vh-100px)] flex relative">
      <div
        className={`transition-all flex flex-col gap-[10px] h-[calc(100vh-100px)]  border-r border-neutral-300   ${
          colapse ? "min-w-0 max-w-0" : "min-w-[400px] max-w-[400px] "
        }`}
      >
        <div
          className={`transition-all ${
            colapse ? "left-0" : "left-[400px]"
          } w-[16px] p-0  h-full top-0 bottom-0 absolute rounded-none  text-slate-600 z-[10] flex items-center justify-center`}
        >
          <Button
            onClick={() => setcolapse(!colapse)}
            className={`transition-all w-[16px] p-0 py-[35px] bg-neutral-200  rounded-none hover:bg-neutral-300/50 text-slate-600 hover:h-full shadow-sm shadow-neutral-400 duration-300   `}
          >
            {colapse ? <Icons.right fontSize="small" /> : <Icons.left fontSize="small" />}
          </Button>
        </div>
        <div className="flex  gap-[20px] flex-col   p-[20px] overflow-hidden mt-[20px]">
          <RangePicker
            className="w-full h-[55px] border-2 border-neutral-300 rounded-0 "
            presets={rangePresets}
            onChange={handleDateChange}
            disabledDate={(current) => current && current > dayjs()}
            placeholder={["Start date", "End Date"]}
            value={date.from && date.to ? [date.from, date.to] : null}
            format="DD/MM/YYYY"
          />

          <div className="flex justify-between items-center">
            <LoadingButton
              loading={reportLoading}
              variant="contained"
              startIcon={<Icons.search fontSize="small" />}
              loadingPosition="start"
              onClick={handleSearch}
            >
              Search
            </LoadingButton>
            <MuiTooltip title="Download" placement="right">
              <LoadingButton
                variant="contained"
                disabled={!reportList.length}
                onClick={onBtExport}
                color="primary"
                style={{ borderRadius: "50%", width: 30, height: 30, minWidth: 0, padding: 0 }}
                size="small"
                sx={{ zIndex: 1 }}
              >
                <Icons.download fontSize="small" />
              </LoadingButton>
            </MuiTooltip>
          </div>
        </div>
      </div>
      <div className="w-full relative ag-theme-quartz h-[calc(100vh-105px)] ">
        <AgGridReact
          ref={gridRef}
          loadingOverlayComponent={CustomLoadingOverlay}
          loading={reportLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={reportList}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={100}
          enableCellTextSelection
          enableBrowserTooltips
        />
      </div>

      <Drawer
        anchor="right"
        open={activeRow !== null}
        onClose={() => setActiveRow(null)}
        PaperProps={{ sx: { width: { xs: "100%", md: "50vw" }, display: "flex", flexDirection: "column" } }}
      >
        {activeRow && (
          <>
            <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1, px: 3, py: 2 }}>
              <Box sx={{ minWidth: 0 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                  <Typography variant="h6" fontWeight={600} sx={{ wordBreak: "break-all" }}>
                    {activeRow.serial_no}
                  </Typography>
                  <Chip
                    size="small"
                    variant="outlined"
                    label={getStatusChip(activeRow.status).label}
                    color={getStatusChip(activeRow.status).color}
                  />
                </Box>
                <Typography variant="body2" className="text-slate-500">
                  Created on {formatServerDateTime(activeRow.created_at)}
                </Typography>
              </Box>
              <IconButton onClick={() => setActiveRow(null)} size="small" aria-label="Close">
                <Icons.close />
              </IconButton>
            </Box>
            <Divider />
            <Box sx={{ flex: 1, overflowY: "auto", px: 3, py: 2 }}>
              {activeImages.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeImages.map((url, idx) => (
                    <button
                      key={url}
                      type="button"
                      onClick={() => setPreviewIndex(idx)}
                      className="flex flex-col items-center border rounded-lg p-3 shadow-sm bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
                    >
                      <img src={url} alt={`Photo ${idx + 1}`} className="rounded object-contain max-h-[220px] w-full" />
                      <Typography variant="subtitle2" className="mt-2 font-medium text-slate-700">
                        Photo {idx + 1}
                      </Typography>
                    </button>
                  ))}
                </div>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No images available for this device
                </Typography>
              )}
            </Box>
          </>
        )}
      </Drawer>

      <FqcImagePreviewModal
        open={previewIndex !== null}
        label={previewIndex !== null ? `Photo ${previewIndex + 1}` : ""}
        imageUrl={previewIndex !== null ? activeImages[previewIndex] : undefined}
        currentIndex={previewIndex ?? 0}
        total={activeImages.length}
        onClose={() => setPreviewIndex(null)}
        onPrev={() => setPreviewIndex((i) => (i === null ? i : (i - 1 + activeImages.length) % activeImages.length))}
        onNext={() => setPreviewIndex((i) => (i === null ? i : (i + 1) % activeImages.length))}
      />
    </div>
  );
};

export default DeviceQualityReport;
