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
  leftAlignedColumn,
  rightAlignedColumn,
} from "@/utils/agGridAlignUtils";
import {
  ColDef,
  ICellRendererParams,
  IRowNode,
  SelectionChangedEvent,
} from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
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

// "ok" -> Available, "out of stock" -> Out of Stock, anything else -> Low Stock.
const getStatusDisplay = (
  value: string,
): { label: string; tone: StatusTone } => {
  const normalized = value.trim().toLowerCase();

  if (normalized === "ok") {
    return { label: "Available", tone: "success" };
  }
  if (normalized === "out of stock") {
    return { label: "Out of Stock", tone: "danger" };
  }
  return { label: "Low Stock", tone: "warning" };
};

const ReportStatusCellRenderer: React.FC<
  ICellRendererParams<ComponentPercentageReportItem>
> = ({ value }) => {
  if (value === null || value === undefined || value === "") {
    return <span className="text-slate-400">-</span>;
  }

  const { label, tone } = getStatusDisplay(String(value));

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
  sr_no: 70,
  component: 240,
  last_updated: 140,
  updated_by: 140,
};
const DEFAULT_COLUMN_WIDTH = 100;

// Text columns stay left aligned; everything else (numbers) aligns right.
const LEFT_ALIGNED_KEYS = new Set(["sr_no", "status", "component", "part_code"]);

const buildReportColumnDefs = (
  headers: ComponentPercentageReportHeader[],
): ColDef<ComponentPercentageReportItem>[] =>
  headers.map((header) => {
    const columnWidth = COLUMN_WIDTHS[header.key] ?? DEFAULT_COLUMN_WIDTH;
    const alignedColumn = LEFT_ALIGNED_KEYS.has(header.key)
      ? leftAlignedColumn
      : rightAlignedColumn;
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
        alignedColumn.headerClass,
      ],
      cellStyle: {
        lineHeight: "20px",
        paddingTop: 8,
        paddingBottom: 8,
        fontSize: 12,
        ...alignedColumn.cellStyle,
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

// The search box only matches part code and component name columns.
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

type SkuRow = {
  key: number;
  sku: DeviceType | null;
  qty: string;
};

const createSkuRow = (key: number): SkuRow => ({ key, sku: null, qty: "" });

const isValidQty = (qty: string) => {
  const value = Number(qty);
  return qty.trim() !== "" && Number.isInteger(value) && value >= 1;
};

const MasterComponentPercentageReport: React.FC = () => {
  const dispatch = useAppDispatch();
  const { reportData, reportHeaders, reportLoading } = useAppSelector(
    (state) => state.componentPercentage,
  );
  const { componentPoDetailsLoading } = useAppSelector((state) => state.po);
  const [deviceType, setDeviceType] =
    useState<ComponentPercentageDeviceType>("soundbox");
  const skuRowKeyRef = useRef(1);
  const [skuRows, setSkuRows] = useState<SkuRow[]>(() => [createSkuRow(0)]);
  const [showSkuErrors, setShowSkuErrors] = useState(false);
  const [filterPanelOpen, setFilterPanelOpen] = useState(true);
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

  const addSkuRow = () => {
    setSkuRows((rows) => [...rows, createSkuRow(skuRowKeyRef.current++)]);
  };

  const removeSkuRow = (key: number) => {
    setSkuRows((rows) =>
      rows.length > 1 ? rows.filter((row) => row.key !== key) : rows,
    );
  };

  const updateSkuRow = (key: number, changes: Partial<SkuRow>) => {
    setSkuRows((rows) =>
      rows.map((row) => (row.key === key ? { ...row, ...changes } : row)),
    );
  };

  const handleSkuChange = (key: number, value: DeviceType | null) => {
    if (
      value &&
      skuRows.some((row) => row.key !== key && row.sku?.id === value.id)
    ) {
      showToast(`${value.text} is already added`, "error");
      return;
    }
    updateSkuRow(key, { sku: value });
  };

  const handleDeviceTypeChange = (value: ComponentPercentageDeviceType) => {
    setDeviceType(value);
    // SKUs are filtered by device type, so previous selections no longer apply.
    setSkuRows([createSkuRow(skuRowKeyRef.current++)]);
    setShowSkuErrors(false);
  };

  const totalQty = skuRows.reduce(
    (sum, row) => sum + (isValidQty(row.qty) ? Number(row.qty) : 0),
    0,
  );
  const selectedSkuCount = skuRows.filter((row) => row.sku).length;

  const handleSearch = () => {
    if (skuRows.some((row) => !row.sku || !isValidQty(row.qty))) {
      setShowSkuErrors(true);
      showToast("Select a SKU and enter a valid quantity in every row", "error");
      return;
    }
    setShowSkuErrors(false);

    dispatch(
      fetchComponentPercentageReportAsync({
        deviceType,
        skuData: skuRows.map((row) => ({
          sku: row.sku!.id,
          qty: Number(row.qty),
        })),
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
    <div className="h-full bg-slate-50 flex">
      <aside
        className={`h-full shrink-0 bg-white border-r border-neutral-200 flex flex-col transition-[width] duration-200 ${
          filterPanelOpen ? "w-[380px]" : "w-[52px]"
        }`}
      >
        {filterPanelOpen ? (
          <>
            <div className="px-[16px] py-[12px] border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-[8px]">
                <FilterAltOutlinedIcon fontSize="small" className="text-slate-500" />
                <span className="text-[15px] font-semibold text-slate-700">
                  Filters
                </span>
              </div>
              <Tooltip title="Collapse filters">
                <IconButton
                  size="small"
                  aria-label="Collapse filters"
                  onClick={() => setFilterPanelOpen(false)}
                >
                  <KeyboardDoubleArrowLeftIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>

            <div className="flex-1 overflow-y-auto px-[16px] py-[16px] flex flex-col gap-[16px]">
              <FormControl size="small" fullWidth>
                <InputLabel id="component-percentage-report-device-type-label">
                  Device Type
                </InputLabel>
                <Select
                  labelId="component-percentage-report-device-type-label"
                  id="component-percentage-report-device-type"
                  value={deviceType}
                  label="Device Type"
                  onChange={(event) =>
                    handleDeviceTypeChange(
                      event.target.value as ComponentPercentageDeviceType,
                    )
                  }
                >
                  {deviceTypeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <div className="flex flex-col gap-[10px]">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-slate-600">
                    SKUs & Quantity
                  </span>
                  <Button size="small" startIcon={<AddIcon />} onClick={addSkuRow}>
                    Add SKU
                  </Button>
                </div>

                {skuRows.map((row, index) => (
                  <div
                    key={row.key}
                    className="border border-neutral-200 rounded-lg p-[12px] pt-[14px] flex flex-col gap-[12px] bg-slate-50/50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-semibold text-slate-500">
                        SKU {index + 1}
                      </span>
                      <Tooltip title="Remove SKU">
                        <span>
                          <IconButton
                            size="small"
                            aria-label="Remove SKU"
                            onClick={() => removeSkuRow(row.key)}
                            disabled={skuRows.length === 1}
                            sx={{ p: 0.25 }}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </div>
                    <SelectSku
                      varient="outlined"
                      size="small"
                      label="SKU"
                      width="100%"
                      value={row.sku}
                      quaryValue={deviceType}
                      onChange={(value) => handleSkuChange(row.key, value)}
                      error={showSkuErrors && !row.sku}
                    />
                    <TextField
                      type="number"
                      size="small"
                      label="Quantity"
                      fullWidth
                      value={row.qty}
                      onChange={(event) =>
                        updateSkuRow(row.key, { qty: event.target.value })
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") handleSearch();
                      }}
                      error={showSkuErrors && !isValidQty(row.qty)}
                      slotProps={{
                        htmlInput: {
                          min: 1,
                        },
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="px-[16px] py-[12px] border-t border-neutral-200 flex flex-col gap-[10px]">
              <div className="flex items-center justify-between text-[13px] text-slate-600">
                <span>
                  {selectedSkuCount} SKU{selectedSkuCount === 1 ? "" : "s"}
                </span>
                <span>
                  Total Qty:{" "}
                  <span className="font-semibold text-slate-800">
                    {totalQty.toLocaleString()}
                  </span>
                </span>
              </div>
              <LoadingButton
                loading={reportLoading}
                variant="contained"
                disableElevation
                fullWidth
                startIcon={<SearchIcon />}
                onClick={handleSearch}
              >
                Search
              </LoadingButton>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center gap-[12px] py-[12px]">
            <Tooltip title="Expand filters" placement="right">
              <IconButton
                size="small"
                aria-label="Expand filters"
                onClick={() => setFilterPanelOpen(true)}
              >
                <KeyboardDoubleArrowRightIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <FilterAltOutlinedIcon fontSize="small" className="text-slate-500" />
            <span className="text-[13px] font-semibold text-slate-600 [writing-mode:vertical-rl] rotate-180">
              Filters
            </span>
            {selectedSkuCount > 0 && (
              <Chip
                size="small"
                color="primary"
                label={selectedSkuCount}
                sx={{ height: 20, fontSize: 11, fontWeight: 600 }}
              />
            )}
          </div>
        )}
      </aside>

      <div className="flex-1 min-w-0 overflow-hidden p-[8px] flex flex-col">
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
