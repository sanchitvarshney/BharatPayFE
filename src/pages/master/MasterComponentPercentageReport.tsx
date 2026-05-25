import { fetchComponentPercentageReportAsync } from "@/features/master/componentPercentage/componentPercentageSlice";
import {
  ComponentPercentageDeviceType,
  ComponentPercentageReportHeader,
  ComponentPercentageReportHeaderType,
  ComponentPercentageReportItem,
} from "@/features/master/componentPercentage/componentPercentageType";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { showToast } from "@/utils/toasterContext";
import { ColDef, ICellRendererParams } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { LoadingButton } from "@mui/lab";
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import React, { useMemo, useState } from "react";
import SelectSku, { DeviceType } from "@/components/reusable/SelectSku";

const deviceTypeOptions: { label: string; value: any }[] = [
  { label: "Swipe Machine", value: "swipeMachine" },
  { label: "Soundbox", value: "soundbox" },
];

const formatReportValue = (value: unknown, type: ComponentPercentageReportHeaderType) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (type === "percent") {
    return `${value}%`;
  }

  if (type === "number") {
    const numericValue = Number(value);
    return Number.isNaN(numericValue) ? String(value) : numericValue.toLocaleString();
  }

  return String(value);
};

const getStatusClassName = (value: string) => {
  const normalizedValue = value.trim().toLowerCase();

  if (["ok", "available", "sufficient", "success"].includes(normalizedValue)) {
    return "bg-emerald-100 text-emerald-700";
  }

  if (["low", "warning", "partial"].includes(normalizedValue)) {
    return "bg-amber-100 text-amber-700";
  }

  if (["short", "purchase", "required", "error", "critical"].includes(normalizedValue)) {
    return "bg-red-100 text-red-700";
  }

  return "bg-slate-100 text-slate-700";
};

const ReportStatusCellRenderer: React.FC<ICellRendererParams<ComponentPercentageReportItem>> = ({ value }) => {
  if (value === null || value === undefined || value === "") {
    return <span>-</span>;
  }

  const label = String(value);

  return (
    <span className={`inline-flex items-center rounded-full px-[10px] py-[2px] text-[12px] font-medium ${getStatusClassName(label)}`}>
      {label}
    </span>
  );
};

const buildReportColumnDefs = (headers: ComponentPercentageReportHeader[]): ColDef<ComponentPercentageReportItem>[] =>
  headers.map((header) => {
    const column: ColDef<ComponentPercentageReportItem> = {
      headerName: header.label,
      field: header.key,
      flex: 1,
      minWidth: header.key === "component_name" ? 220 : 140,
      filter: header.type !== "badge",
      valueFormatter: (params) => formatReportValue(params.value, header.type),
    };

    if (header.type === "badge") {
      column.cellRenderer = ReportStatusCellRenderer;
    }

    return column;
  });
const MasterComponentPercentageReport: React.FC = () => {
  const dispatch = useAppDispatch();
  const { reportData, reportHeaders, reportLoading } = useAppSelector((state) => state.componentPercentage);
  const [totalDevice, setTotalDevice] = useState<string>("");
  const [deviceType, setDeviceType] = useState<ComponentPercentageDeviceType>("soundbox");
  const [sku, setSku] = useState<DeviceType | null>(null);

  const columnDefs = useMemo(
    () => buildReportColumnDefs(reportHeaders ?? []),
    [reportHeaders],
  );

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
      sortable: true,
    };
  }, []);

  const handleSearch = () => {
    const totalDeviceValue = Number(totalDevice);

    if (!totalDevice || Number.isNaN(totalDeviceValue) || totalDeviceValue < 1) {
      showToast("Please enter a valid total device value", "error");
      return;
    }

    if (!sku?.id) {
      showToast("Please select a SKU", "error");
      return;
    }

    dispatch(
      fetchComponentPercentageReportAsync({
        totalDevice: totalDeviceValue,
        deviceType,
        sku: sku.id,
      }),
    ).then((res: any) => {
      const response = res.payload?.data;

      if (response?.success && response.message) {
        showToast(response.message, response.data?.length ? "success" : "info");
      }
    });
  };

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="p-[20px] border-b border-neutral-300 flex items-end gap-[16px] flex-wrap">
        <FormControl size="small" sx={{ width: 220 }}>
          <InputLabel id="component-percentage-report-device-type-label">Device Type</InputLabel>
          <Select
            labelId="component-percentage-report-device-type-label"
            id="component-percentage-report-device-type"
            value={deviceType}
            label="Device Type"
            onChange={(event) => setDeviceType(event.target.value as ComponentPercentageDeviceType)}
          >
            {deviceTypeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <SelectSku
          varient="outlined"
          size="small"
          label="SKU"
          width="280px"
          value={sku}
          onChange={setSku}
        />
        <TextField
          type="number"
          size="small"
          label="Total Device"
          value={totalDevice}
          onChange={(event) => setTotalDevice(event.target.value)}
          slotProps={{
            htmlInput: {
              min: 1,
            },
          }}
          sx={{ width: 220 }}
        />
        <LoadingButton loading={reportLoading} variant="contained" onClick={handleSearch}>
          Search
        </LoadingButton>
      </div>

      <div className="flex-1 overflow-hidden p-[20px]">
        <div className="ag-theme-quartz h-full border border-neutral-300 rounded-md overflow-hidden">
          <AgGridReact
            rowData={reportData ?? []}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            loading={reportLoading}
            loadingOverlayComponent={CustomLoadingOverlay}
            overlayNoRowsTemplate={OverlayNoRowsTemplate}
            pagination={false}
          />
        </div>
      </div>
    </div>
  );
};

export default MasterComponentPercentageReport;
