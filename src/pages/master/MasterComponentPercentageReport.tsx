import SelectSku, { DeviceType } from "@/components/reusable/SelectSku";
import { fetchComponentPercentageReportAsync } from "@/features/master/componentPercentage/componentPercentageSlice";
import { getComponentPoDetails } from "@/features/procurement/poSlices";
import { ComponentPoDetailsResponse } from "@/features/procurement/poTypes";
import CreatePOFromComponentsDrawer from "@/components/Drawers/procurement/CreatePOFromComponentsDrawer";
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
import {
  ColDef,
  ICellRendererParams,
  SelectionChangedEvent,
} from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { LoadingButton } from "@mui/lab";
import {
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useCallback, useMemo, useRef, useState } from "react";

const deviceTypeOptions: {
  label: string;
  value: ComponentPercentageDeviceType;
}[] = [
  { label: "Swipe Machine", value: "swipeMachine" },
  { label: "Soundbox", value: "soundbox" },
];

// Some report cells arrive as reference objects, e.g. { comp_name, comp_key }.
const extractCellText = (value: unknown): string => {
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    return String(
      obj.comp_name ?? obj.name ?? obj.label ?? obj.text ?? obj.value ?? "",
    ).trim();
  }
  return String(value ?? "").trim();
};

const extractCellKey = (value: unknown): string => {
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    return String(
      obj.comp_key ?? obj.component_key ?? obj.key ?? obj.id ?? "",
    ).trim();
  }
  return String(value ?? "").trim();
};

const formatReportValue = (
  value: unknown,
  type: ComponentPercentageReportHeaderType,
) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (typeof value === "object") {
    return extractCellText(value) || "-";
  }

  if (type === "percent") {
    return `${value}%`;
  }

  if (type === "number") {
    const numericValue = Number(value);
    return Number.isNaN(numericValue)
      ? String(value)
      : numericValue.toLocaleString();
  }

  return String(value);
};

type StatusTone = "success" | "warning" | "danger" | "neutral";

const STATUS_TONE_SX: Record<StatusTone, Record<string, string>> = {
  success: { color: "#047857", backgroundColor: "#ecfdf5", borderColor: "#a7f3d0" },
  warning: { color: "#b45309", backgroundColor: "#fffbeb", borderColor: "#fde68a" },
  danger: { color: "#b91c1c", backgroundColor: "#fef2f2", borderColor: "#fecaca" },
  neutral: { color: "#475569", backgroundColor: "#f8fafc", borderColor: "#e2e8f0" },
};

const getStatusTone = (value: string): StatusTone => {
  const normalized = value.trim().toLowerCase();

  if (["ok", "available", "sufficient", "success", "in stock", "instock", "enough"].includes(normalized)) {
    return "success";
  }
  if (["low", "warning", "partial", "moderate", "reorder"].includes(normalized)) {
    return "warning";
  }
  if (["short", "shortage", "purchase", "required", "error", "critical", "out of stock"].includes(normalized)) {
    return "danger";
  }
  return "neutral";
};

const ReportStatusCellRenderer: React.FC<
  ICellRendererParams<ComponentPercentageReportItem>
> = ({ value }) => {
  if (value === null || value === undefined || value === "") {
    return <span className="text-slate-400">-</span>;
  }

  const label = String(value);
  const tone = getStatusTone(label);

  return (
    <span className="flex h-full items-center">
      <Chip
        label={label}
        size="small"
        variant="outlined"
      
        sx={{
          height: 22,
          fontSize: 12,
          fontWeight: 600,
          borderRadius: "999px",
          border: "1px solid",
          textTransform: "capitalize",
          "& .MuiChip-label": { pl: 0.75, pr: 1 },
          "& .MuiChip-icon": { mr: 0 },
          ...STATUS_TONE_SX[tone],
        }}
      />
    </span>
  );
};

const buildReportColumnDefs = (
  headers: ComponentPercentageReportHeader[],
): ColDef<ComponentPercentageReportItem>[] =>
  headers.map((header) => {
    const column: ColDef<ComponentPercentageReportItem> = {
      headerName: header.label,
      colId: header.key,
      flex: 1,
      minWidth: header.key === "sr_no" ? 120 : 250,
      pinned:
        header.key === "status" || header.key === "sr_no" ? "left" : undefined,
      filter: header.type !== "badge" && header.key !== "sr_no",
    };

    if (header.type === "string" || header.type === "badge") {
      // Text / badge columns may hold reference objects — derive a plain string.
      column.valueGetter = (params) =>
        extractCellText(params.data?.[header.key]);
    } else {
      column.field = header.key;
      column.valueFormatter = (params) =>
        formatReportValue(params.value, header.type);
    }

    if (header.type === "badge") {
      column.cellRenderer = ReportStatusCellRenderer;
    }

    return column;
  });

const getComponentKey = (row: ComponentPercentageReportItem): string =>
  extractCellKey(
    row.component ??
      row.component_key ??
      row.componentKey ??
      row.component_id ??
      row.componentId ??
      row.id ??
      "",
  );

const MasterComponentPercentageReport: React.FC = () => {
  const dispatch = useAppDispatch();
  const { reportData, reportHeaders, reportLoading } = useAppSelector(
    (state) => state.componentPercentage,
  );
  const { componentPoDetailsLoading } = useAppSelector((state) => state.po);
  const [totalDevice, setTotalDevice] = useState<string>("");
  const [deviceType, setDeviceType] =
    useState<ComponentPercentageDeviceType>("soundbox");
  const [sku, setSku] = useState<DeviceType | null>(null);
  const [selectedRows, setSelectedRows] = useState<
    ComponentPercentageReportItem[]
  >([]);
  const gridRef = useRef<AgGridReact<ComponentPercentageReportItem>>(null);
  const [poDrawerOpen, setPoDrawerOpen] = useState(false);
  const [poDetails, setPoDetails] = useState<
    ComponentPoDetailsResponse["data"] | null
  >(null);

  const columnDefs = useMemo<ColDef<ComponentPercentageReportItem>[]>(
    () => [
      {
        headerName: "",
        colId: "__select",
        width: 60,
        maxWidth: 60,
        pinned: "left",
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        filter: false,
        sortable: false,
        resizable: false,
        lockPosition: true,
        suppressMovable: true,
        cellStyle: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      },
      ...buildReportColumnDefs(reportHeaders ?? []),
    ],
    [reportHeaders],
  );

  const handleSelectionChanged = (
    event: SelectionChangedEvent<ComponentPercentageReportItem>,
  ) => {
    setSelectedRows(event.api.getSelectedRows());
  };

  const handlePoCreated = useCallback(() => {
    gridRef.current?.api?.deselectAll();
    setSelectedRows([]);
    setPoDetails(null);
  }, []);

  const handleCreatePO = () => {
    const components = Array.from(
      new Set(selectedRows.map(getComponentKey).filter(Boolean)),
    );

    if (!components.length) {
      showToast("Select at least one component to create a PO", "error");
      return;
    }

    dispatch(getComponentPoDetails({ components })).then((res: any) => {
      const response = res.payload?.data;
      if (response?.success && response.data) {
        setPoDetails(response.data);
        setPoDrawerOpen(true);
      } else if (response?.message) {
        showToast(response.message, "error");
      }
    });
  };

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
      sortable: true,
    };
  }, []);

  const handleSearch = () => {
    const totalDeviceValue = Number(totalDevice);

    if (
      !totalDevice ||
      Number.isNaN(totalDeviceValue) ||
      totalDeviceValue < 1
    ) {
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
          <InputLabel id="component-percentage-report-device-type-label">
            Device Type
          </InputLabel>
          <Select
            labelId="component-percentage-report-device-type-label"
            id="component-percentage-report-device-type"
            value={deviceType}
            label="Device Type"
            onChange={(event) => {
              setDeviceType(
                event.target.value as ComponentPercentageDeviceType,
              );
              setSku(null);
            }}
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
          quaryValue={deviceType}
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
        <LoadingButton
          loading={reportLoading}
          variant="contained"
          onClick={handleSearch}
        >
          Search
        </LoadingButton>
        <LoadingButton
          loading={componentPoDetailsLoading}
          variant="outlined"
          onClick={handleCreatePO}
          disabled={!selectedRows.length}
        >
          Create PO{selectedRows.length ? ` (${selectedRows.length})` : ""}
        </LoadingButton>
      </div>

      <div className="flex-1 overflow-hidden p-[20px]">
        <div className="ag-theme-quartz h-full border border-neutral-300 rounded-md overflow-hidden">
          <AgGridReact
            ref={gridRef}
            rowData={reportData ?? []}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            loading={reportLoading}
            loadingOverlayComponent={CustomLoadingOverlay}
            overlayNoRowsTemplate={OverlayNoRowsTemplate}
            pagination={false}
            rowSelection="multiple"
            suppressRowClickSelection
            onSelectionChanged={handleSelectionChanged}
          />
        </div>
      </div>

      <CreatePOFromComponentsDrawer
        open={poDrawerOpen}
        setOpen={setPoDrawerOpen}
        details={poDetails}
        onSuccess={handlePoCreated}
      />
    </div>
  );
};

export default MasterComponentPercentageReport;
