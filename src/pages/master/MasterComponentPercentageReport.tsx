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
  IRowNode,
  SelectionChangedEvent,
} from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { LoadingButton } from "@mui/lab";
import {
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const deviceTypeOptions: {
  label: string;
  value: ComponentPercentageDeviceType;
}[] = [
  { label: "Swipe Machine", value: "swipeMachine" },
  { label: "Soundbox", value: "soundbox" },
];

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
  success: {
    color: "#047857",
    backgroundColor: "#ecfdf5",
    borderColor: "#a7f3d0",
  },
  warning: {
    color: "#b45309",
    backgroundColor: "#fffbeb",
    borderColor: "#fde68a",
  },
  danger: {
    color: "#b91c1c",
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
  },
  neutral: {
    color: "#475569",
    backgroundColor: "#f8fafc",
    borderColor: "#e2e8f0",
  },
};

const getStatusTone = (value: string): StatusTone => {
  const normalized = value.trim().toLowerCase();

  if (
    [
      "ok",
      "available",
      "sufficient",
      "success",
      "in stock",
      "instock",
      "enough",
    ].includes(normalized)
  ) {
    return "success";
  }
  if (
    ["low", "warning", "partial", "moderate", "reorder"].includes(normalized)
  ) {
    return "warning";
  }
  if (
    [
      "short",
      "shortage",
      "purchase",
      "required",
      "error",
      "critical",
      "out of stock",
    ].includes(normalized)
  ) {
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

const COLUMN_WIDTHS: Record<string, number> = {
  sr_no: 80,
  component: 220,
};
const DEFAULT_COLUMN_WIDTH = 100;

const LEFT_ALIGNED_KEYS = new Set(["sr_no", "status", "component", "part_code"]);

const buildReportColumnDefs = (
  headers: ComponentPercentageReportHeader[],
): ColDef<ComponentPercentageReportItem>[] =>
  headers.map((header) => {
    const columnWidth = COLUMN_WIDTHS[header.key] ?? DEFAULT_COLUMN_WIDTH;
    const isLeftAligned = LEFT_ALIGNED_KEYS.has(header.key);
    const column: ColDef<ComponentPercentageReportItem> = {
      headerName: header.label,
      colId: header.key,
      width: columnWidth,
      maxWidth: columnWidth,
      wrapText: true,
      autoHeight: true,
      headerClass: [
        "[&_.ag-header-cell-text]:text-[11px]",
        "[&_.ag-header-cell-text]:font-bold",
        ...(isLeftAligned ? [] : ["ag-right-aligned-header"]),
      ],
      cellStyle: {
        lineHeight: "20px",
        paddingTop: 8,
        paddingBottom: 8,
        fontSize: 12,
        textAlign: isLeftAligned ? "left" : "right",
      },
      pinned:
        header.key === "status" || header.key === "sr_no" ? "left" : undefined,
    };

    if (header.type === "string" || header.type === "badge") {
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

const SEARCHABLE_COLUMN_PATTERN =
  /^(component|part[\s_-]*(code|no|number)?|comp(onent)?[\s_-]*name)$/i;

const getSearchableKeys = (
  headers: ComponentPercentageReportHeader[],
): string[] =>
  headers
    .filter(
      (header) =>
        SEARCHABLE_COLUMN_PATTERN.test(header.key) ||
        SEARCHABLE_COLUMN_PATTERN.test(header.label.trim()),
    )
    .map((header) => header.key);

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
  const [searchText, setSearchText] = useState("");
  const [displayedCount, setDisplayedCount] = useState(0);

  const searchableKeys = useMemo(
    () => getSearchableKeys(reportHeaders ?? []),
    [reportHeaders],
  );
  const normalizedSearch = searchText.trim().toLowerCase();

  const isExternalFilterPresent = useCallback(
    () => normalizedSearch.length > 0,
    [normalizedSearch],
  );

  const doesExternalFilterPass = useCallback(
    (node: IRowNode<ComponentPercentageReportItem>) =>
      searchableKeys.some((key) =>
        extractCellText(node.data?.[key])
          .toLowerCase()
          .includes(normalizedSearch),
      ),
    [searchableKeys, normalizedSearch],
  );

  useEffect(() => {
    gridRef.current?.api?.onFilterChanged();
  }, [normalizedSearch, searchableKeys]);

  const updateDisplayedCount = useCallback(() => {
    setDisplayedCount(gridRef.current?.api?.getDisplayedRowCount() ?? 0);
  }, []);

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
      filter: false,
      sortable: true,
      resizable: true,
      suppressHeaderMenuButton: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
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

  const totalRows = reportData?.length ?? 0;

  return (
    <div className="h-full bg-slate-50 flex flex-col">
      <div className="px-[20px] py-[16px] bg-white border-b border-neutral-200 flex items-center gap-[12px] flex-wrap">
        <FormControl size="small" sx={{ width: 200 }}>
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
          onKeyDown={(event) => {
            if (event.key === "Enter") handleSearch();
          }}
          slotProps={{
            htmlInput: {
              min: 1,
            },
          }}
          sx={{ width: 180 }}
        />
        <LoadingButton
          loading={reportLoading}
          variant="contained"
          disableElevation
          startIcon={<SearchIcon />}
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

      <div className="flex-1 overflow-hidden p-[16px] flex flex-col">
        <div className="flex-1 flex flex-col bg-white border border-neutral-200 rounded-lg shadow-sm overflow-hidden">
          <div className="px-[16px] py-[10px] border-b border-neutral-200 flex items-center justify-between gap-[12px] flex-wrap">
            <div className="flex items-center gap-[8px]">
              <span className="text-[15px] font-semibold text-slate-700">
                Component Report
              </span>
              <Chip
                size="small"
                label={
                  normalizedSearch
                    ? `${displayedCount} of ${totalRows}`
                    : `${totalRows} rows`
                }
                sx={{ height: 22, fontSize: 12, fontWeight: 500 }}
              />
              {selectedRows.length > 0 && (
                <Chip
                  size="small"
                  color="primary"
                  variant="outlined"
                  label={`${selectedRows.length} selected`}
                  onDelete={() => gridRef.current?.api?.deselectAll()}
                  sx={{ height: 22, fontSize: 12, fontWeight: 500 }}
                />
              )}
            </div>

            <div className="flex items-center gap-[10px] ml-auto">
              <TextField
                size="small"
                placeholder="Search part code or component name"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                disabled={!totalRows}
                sx={{ width: 320 }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: searchText ? (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          edge="end"
                          aria-label="Clear search"
                          onClick={() => setSearchText("")}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ) : undefined,
                  },
                }}
              />
              <LoadingButton
                loading={componentPoDetailsLoading}
                variant="contained"
                disableElevation
                onClick={handleCreatePO}
                disabled={!selectedRows.length}
              >
                Create PO
                {selectedRows.length ? ` (${selectedRows.length})` : ""}
              </LoadingButton>
            </div>
          </div>

          <div className="ag-theme-quartz flex-1 overflow-hidden">
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
              suppressCellFocus
              animateRows
              isExternalFilterPresent={isExternalFilterPresent}
              doesExternalFilterPass={doesExternalFilterPass}
              onModelUpdated={updateDisplayedCount}
              onSelectionChanged={handleSelectionChanged}
            />
          </div>
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
