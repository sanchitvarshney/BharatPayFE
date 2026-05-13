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
import { ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { LoadingButton } from "@mui/lab";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";

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

const MasterComponentPercentage: React.FC = () => {
  const dispatch = useAppDispatch();
  const gridRef = useRef<AgGridReact<MasterComponentPercentageItem>>(null);
  const { components, fetchLoading, insertLoading } = useAppSelector((state) => state.componentPercentage);
  const [rows, setRows] = useState<MasterComponentPercentageItem[]>([]);
  const [deviceType, setDeviceType] = useState<ComponentPercentageDeviceType>("soundbox");

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
        maxWidth: 80,
        filter: false,
        sortable: false,
        valueGetter: (params) => (params.node?.rowIndex ?? 0) + 1,
      },
      {
        headerName: "Part Code",
        field: "component",
        flex: 1,
        minWidth: 140,
      },
      {
        headerName: "Component",
        field: "component_name",
        flex: 1,
        minWidth: 240,
      },
      {
        headerName: "Percentage",
        field: "percentage",
        editable: true,
        cellEditor: "agNumberCellEditor",
        width: 220,
      },
    ],
    [],
  );

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: false,
      sortable: false,
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

  const handleSubmit = () => {
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
      <div className="p-[20px] border-b border-neutral-300 flex items-center justify-between gap-[20px]">
        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel id="component-percentage-device-type-label">Device Type</InputLabel>
          <Select
            labelId="component-percentage-device-type-label"
            id="component-percentage-device-type"
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
      </div>

      <div className="flex-1 overflow-hidden p-[20px]">
        <div className="ag-theme-quartz h-full border border-neutral-300 rounded-md overflow-hidden">
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
            onCellValueChanged={syncRowsFromGrid}
          />
        </div>
      </div>

      <div className="h-[60px] border-t border-neutral-300 px-[20px] flex items-center justify-end">
        <LoadingButton loading={insertLoading} variant="contained" onClick={handleSubmit} disabled={fetchLoading || !rows.length}>
          Submit
        </LoadingButton>
      </div>
    </div>
  );
};

export default MasterComponentPercentage;
