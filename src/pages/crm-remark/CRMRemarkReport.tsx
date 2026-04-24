import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack } from "@mui/material";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef } from "@ag-grid-community/core";
import * as XLSX from "xlsx";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { showToast } from "@/utils/toasterContext";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import {
  CrmDeviceType,
  CrmSerialRow,
  fetchCrmSerials,
} from "@/features/crmRemark/crmRemarkSlice";


const CRMRemarkReport: React.FC = () => {
  const gridRef = useRef<AgGridReact<CrmSerialRow>>(null);
  const dispatch = useAppDispatch();
  const { serials, loading } = useAppSelector((state) => state.crmRemark);
  const [deviceType, setDeviceType] = useState<CrmDeviceType>("SWIPE");

  const fetchSerials = async (type: CrmDeviceType = deviceType) => {
    const action = await dispatch(fetchCrmSerials(type));
    if (fetchCrmSerials.rejected.match(action)) {
      showToast(
        (action.payload as string) || "Failed to load CRM serial numbers",
        "error",
      );
    }
  };

  useEffect(() => {
    fetchSerials();
  }, []);

  const handleDeviceTypeChange = async (value: CrmDeviceType) => {
    setDeviceType(value);
    await fetchSerials(value);
  };

  const handleDownloadAll = () => {
    if (!serials.length) {
      showToast("No serial numbers to download", "info");
      return;
    }
    const data = serials.map((row) => ({
      serial_number: row.serial,
    }));
    const worksheet = XLSX.utils.json_to_sheet(data, {
      header: ["serial_number"],
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "CRM Serials");
    XLSX.writeFile(workbook, "crm_serial_numbers.xlsx");
  };

  const columnDefs: ColDef<CrmSerialRow>[] = [
    {
      headerName: "#",
      field: "id",
      valueGetter: "node.rowIndex + 1",
      maxWidth: 100,
      headerClass: "font-semibold",
    },
    {
      headerName: "Serial Number",
      field: "serial",
      minWidth: 200,
      headerClass: "font-semibold",
    },
         {
      headerName: "Remark Updated Date",
      field: "date",
      minWidth: 200,
      headerClass: "font-semibold",
    },
          {
      headerName: "Insert Date",
      field: "insertDt",
      minWidth: 200,
      headerClass: "font-semibold",
    },
      {
      headerName: "Status",
      field: "status",
      minWidth: 200,
      headerClass: "font-semibold",
    },
  ];

  const defaultColDef = useMemo<ColDef>(
    () => ({
      filter: true,
      sortable: true,
      resizable: true,
      cellClass: "text-sm py-2",
    }),
    [],
  );

  return (
    <Box className="h-[calc(100vh-100px)] bg-white flex flex-col">
      <Box className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-neutral-200">
        <Box>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="crm-remark-device-type-label">Device Type</InputLabel>
            <Select
              labelId="crm-remark-device-type-label"
              id="crm-remark-device-type"
              value={deviceType}
              label="Device Type"
              onChange={(e) =>
                handleDeviceTypeChange(e.target.value as CrmDeviceType)
              }
            >
              <MenuItem value="SOUND">Sound box</MenuItem>
              <MenuItem value="SWIPE">Swipe</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => fetchSerials()}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleDownloadAll}
            disabled={!serials.length}
          >
            Download All Serials
          </Button>
        </Stack>
      </Box>

      <Box className="flex-1 ag-theme-quartz">
        <AgGridReact<CrmSerialRow>
          ref={gridRef}
          rowData={serials}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          loadingOverlayComponent={CustomLoadingOverlay}
          loadingOverlayComponentParams={{ loadingMessage: "Loading..." }}
          loading={loading}
          suppressCellFocus
          enableCellTextSelection
          pagination
        />
      </Box>
    </Box>
  );
};

export default CRMRemarkReport;
