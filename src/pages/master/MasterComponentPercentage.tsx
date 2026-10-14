import {
  fetchMasterComponentPercentageAsync,
  insertComponentPercentageAsync,
} from "@/features/master/componentPercentage/componentPercentageSlice";
import {
  ComponentPercentageDeviceType,
  MasterComponentPercentageItem,
} from "@/features/master/componentPercentage/componentPercentageType";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { showToast } from "@/utils/toasterContext";
import {
  CellClassParams,
  ColDef,
  ICellRendererParams,
  IRowNode,
  ModelUpdatedEvent,
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

const deviceTypeOptions: { label: string; value: ComponentPercentageDeviceType }[] = [
  { label: "Swipe Machine", value: "swipeMachine" },
  { label: "Soundbox", value: "soundbox" },
];

const normalizePercentageValue = (value: number | string | null | undefined) => {
  if (value === null || value === undefined || value === "" || value === "--") {
    return 0;
  }

  const numericValue = Number(value);
  return Number.isNaN(numericValue) ? 0 : numericValue;
};

const normalizeComponentRows = (components: MasterComponentPercentageItem[]) =>
  components.map((item, index) => ({
    ...item,
    percentage: normalizePercentageValue(item.percentage),
    rowId: `${item.component_id}-${index}`,
  }));

const PercentageCellRenderer: React.FC<ICellRendererParams<MasterComponentPercentageItem>> = ({ value }) => (
  <div className="flex h-full w-full items-center justify-between gap-[8px]">
    <span className="font-medium text-slate-700">
      {value === null || value === undefined || value === "" ? "-" : `${value}%`}
    </span>
    <EditOutlinedIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
  </div>
);

const MasterComponentPercentage: React.FC = () => {
  const dispatch = useAppDispatch();
  const gridRef = useRef<AgGridReact<MasterComponentPercentageItem>>(null);
  const { components, fetchLoading, insertLoading } = useAppSelector((state) => state.componentPercentage);
  const [rows, setRows] = useState<MasterComponentPercentageItem[]>([]);
  const [deviceType, setDeviceType] = useState<ComponentPercentageDeviceType>("soundbox");
  const [searchText, setSearchText] = useState("");
  const [displayedCount, setDisplayedCount] = useState(0);
  const normalizedSearch = searchText.trim().toLowerCase();

  // Saved percentages keyed by rowId, used to highlight and count unsaved edits.
  const originalPercentages = useMemo(
    () => new Map(normalizeComponentRows(components ?? []).map((row) => [row.rowId, row.percentage])),
    [components],
  );
  const originalPercentagesRef = useRef(originalPercentages);
  originalPercentagesRef.current = originalPercentages;

  const changedCount = useMemo(
    () => rows.filter((row) => Number(row.percentage) !== originalPercentages.get(row.rowId ?? "")).length,
    [rows, originalPercentages],
  );

  const isExternalFilterPresent = useCallback(() => normalizedSearch.length > 0, [normalizedSearch]);
  const doesExternalFilterPass = useCallback(
    (node: IRowNode<MasterComponentPercentageItem>) =>
      [node.data?.component, node.data?.component_name].some((value) =>
        String(value ?? "").toLowerCase().includes(normalizedSearch),
      ),
    [normalizedSearch],
  );

  useEffect(() => {
    gridRef.current?.api?.onFilterChanged();
  }, [normalizedSearch]);

  useEffect(() => {
    dispatch(fetchMasterComponentPercentageAsync({ deviceType }));
  }, [dispatch, deviceType]);

  useEffect(() => {
    if (components) {
      setRows(normalizeComponentRows(components));
    }
  }, [components]);

  const columnDefs = useMemo<ColDef<MasterComponentPercentageItem>[]>(
    () => [
      {
        headerName: "#",
        maxWidth: 70,
        valueGetter: (params) => (params.node?.rowIndex ?? 0) + 1,
        cellClass: "text-slate-400",
      },
      {
        headerName: "Part Code",
        field: "component",
        flex: 1,
        minWidth: 130,
        maxWidth: 170,
        cellClass: "font-medium",
      },
      {
        headerName: "Component",
        field: "component_name",
        flex: 2,
        minWidth: 220,
        wrapText: true,
        autoHeight: true,
        cellStyle: { display: "flex", alignItems: "center", lineHeight: "20px", paddingTop: 8, paddingBottom: 8 },
      },
      {
        headerName: "Percentage",
        field: "percentage",
        editable: true,
        singleClickEdit: true,
        cellEditor: "agNumberCellEditor",
        cellEditorParams: { min: 0, max: 100, precision: 2 },
        cellRenderer: PercentageCellRenderer,
        width: 180,
        cellClassRules: {
          "percentage-cell-changed": (params: CellClassParams<MasterComponentPercentageItem>) =>
            Number(params.value) !== originalPercentagesRef.current.get(params.data?.rowId ?? ""),
        },
      },
    ],
    [],
  );

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: false,
      sortable: false,
      suppressHeaderMenuButton: true,
      cellStyle: { display: "flex", alignItems: "center" },
    };
  }, []);

  const syncRowsFromGrid = () => {
    const nextRows: MasterComponentPercentageItem[] = [];
    gridRef.current?.api.forEachNode((node) => {
      if (node.data) {
        nextRows.push(node.data);
      }
    });
    setRows(nextRows);
  };

  const handleModelUpdated = (event: ModelUpdatedEvent<MasterComponentPercentageItem>) => {
    setDisplayedCount(event.api.getDisplayedRowCount());
  };

  const handleReset = () => {
    setRows(normalizeComponentRows(components ?? []));
  };

  const handleDeviceTypeChange = (nextDeviceType: ComponentPercentageDeviceType) => {
    if (changedCount && !window.confirm("You have unsaved changes. Discard them and switch device type?")) {
      return;
    }
    setSearchText("");
    setDeviceType(nextDeviceType);
  };

  const handleSubmit = () => {
    gridRef.current?.api.stopEditing();

    const currentRows: MasterComponentPercentageItem[] = [];
    gridRef.current?.api.forEachNode((node) => {
      if (node.data) {
        currentRows.push(node.data);
      }
    });

    if (!currentRows.length) {
      showToast("No components available to submit", "error");
      return;
    }

    const componentCodes: string[] = [];
    const percentages: number[] = [];

    for (const row of currentRows) {
      const percentageValue = Number(row.percentage);
      if (!row.component || row.percentage === "" || row.percentage === null || Number.isNaN(percentageValue)) {
        showToast("Please enter a valid percentage for all components", "error");
        return;
      }

      componentCodes.push(row.component);
      percentages.push(percentageValue);
    }

    dispatch(
      insertComponentPercentageAsync({
        component: componentCodes,
        percentage: percentages,
        deviceType,
      }),
    ).then((res: any) => {
      if (res.payload?.data?.success) {
        showToast(res.payload.data.message, "success");
        dispatch(fetchMasterComponentPercentageAsync({ deviceType }));
      }
    });
  };

  return (
    <div className="h-full bg-white flex flex-col">
      <style>{`.percentage-cell-changed { background-color: #fffbeb; box-shadow: inset 3px 0 0 #f59e0b; }`}</style>

      <div className="px-[20px] py-[12px] border-b border-neutral-200 flex items-center justify-between gap-[12px] flex-wrap">
        <div className="flex items-center gap-[12px] flex-wrap">
          <FormControl size="small" sx={{ width: 200 }}>
            <InputLabel id="component-percentage-device-type-label">Device Type</InputLabel>
            <Select
              labelId="component-percentage-device-type-label"
              id="component-percentage-device-type"
              value={deviceType}
              label="Device Type"
              onChange={(event) => handleDeviceTypeChange(event.target.value as ComponentPercentageDeviceType)}
            >
              {deviceTypeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Chip
            size="small"
            label={normalizedSearch ? `${displayedCount} of ${rows.length}` : `${rows.length} components`}
            sx={{ height: 22, fontSize: 12, fontWeight: 500 }}
          />
          {changedCount > 0 && (
            <Chip
              size="small"
              variant="outlined"
              label={`${changedCount} unsaved`}
              sx={{
                height: 22,
                fontSize: 12,
                fontWeight: 600,
                color: "#b45309",
                backgroundColor: "#fffbeb",
                borderColor: "#fde68a",
              }}
            />
          )}
        </div>

        <TextField
          size="small"
          placeholder="Search part code or component name"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          disabled={!rows.length}
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
                  <IconButton size="small" edge="end" aria-label="Clear search" onClick={() => setSearchText("")}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : undefined,
            },
          }}
        />
      </div>

      <div className="ag-theme-quartz flex-1 overflow-hidden">
        <AgGridReact
          ref={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          getRowId={(params) => params.data.rowId ?? `${params.data.component_id}-${params.data.component}`}
          loading={fetchLoading}
          loadingOverlayComponent={CustomLoadingOverlay}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          pagination={false}
          stopEditingWhenCellsLoseFocus
          enterNavigatesVerticallyAfterEdit
          isExternalFilterPresent={isExternalFilterPresent}
          doesExternalFilterPass={doesExternalFilterPass}
          onModelUpdated={handleModelUpdated}
          onCellValueChanged={syncRowsFromGrid}
        />
      </div>

      <div className="h-[56px] border-t border-neutral-200 px-[20px] flex items-center justify-between gap-[12px]">
        <span className="text-[13px] text-slate-500">
          {changedCount
            ? `${changedCount} component${changedCount > 1 ? "s" : ""} changed`
            : "Click a percentage to edit it"}
        </span>
        <div className="flex items-center gap-[10px]">
          <Button
            variant="text"
            color="inherit"
            startIcon={<RestartAltIcon />}
            onClick={handleReset}
            disabled={!changedCount || insertLoading}
          >
            Reset
          </Button>
          <LoadingButton
            loading={insertLoading}
            variant="contained"
            disableElevation
            startIcon={<SaveOutlinedIcon />}
            onClick={handleSubmit}
            disabled={fetchLoading || !rows.length}
          >
            Save{changedCount ? ` (${changedCount})` : ""}
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};

export default MasterComponentPercentage;
