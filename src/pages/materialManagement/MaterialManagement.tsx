import { useState, useRef, useEffect } from "react";
import { Button, CardContent, Typography, IconButton } from "@mui/material";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { showToast } from "@/utils/toasterContext";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { Icons } from "@/components/icons";
import MaterialManagementCellRenderer from "../../table/Cellrenders/MaterialManagementCellRenderer";
import {
  setFromCC,
  setFromLoc,
  submitMaterialTransfer,
} from "@/features/materialManagement/materialManagementSlices";
import { CardFooter } from "@/components/ui/card";
import { LoadingButton } from "@mui/lab";
import SelectLocationAcordingModule from "@/components/reusable/SelectLocationAcordingModule";
import SelectCostCenter from "@/components/reusable/SelectCostCenter";
import ConfirmationModel from "@/components/reusable/ConfirmationModel";

interface RowData {
  id: string;
  component: { label: string; value: string } | null;
  quantity: string;
  availableqty: string;
  remarks: string;
  unit: string;
  isNew: boolean;
}

const MaterialManagement = () => {
  const gridRef = useRef<AgGridReact>(null);
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [fromLocation, setFromLocation] = useState<any>(null);
  const [toLocation, setToLocation] = useState<any>(null);
  const [fromCostCenter, setFromCostCenter] = useState<any>(null);
  const [toCostCenter, setToCostCenter] = useState<any>(null);

  // Confirmation modal state
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingChange, setPendingChange] = useState<{
    type: "fromLocation" | "toLocation" | "fromCostCenter" | "toCostCenter";
    value: any;
  } | null>(null);

  const dispatch = useAppDispatch();
  const { submitLoading } = useAppSelector((state) => state.materialManagement);

  // Generate unique ID for new rows
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Check if components have been added
  const hasComponents = rowData.length > 0;

  // Handle header field changes with confirmation
  const handleHeaderChange = (
    type: "fromLocation" | "toLocation" | "fromCostCenter" | "toCostCenter",
    value: any
  ) => {
    if (hasComponents) {
      // Show confirmation if components exist
      setPendingChange({ type, value });
      setShowConfirm(true);
    } else {
      // Directly update if no components
      updateHeaderField(type, value);
    }
  };

  // Update header field directly
  const updateHeaderField = (
    type: "fromLocation" | "toLocation" | "fromCostCenter" | "toCostCenter",
    value: any
  ) => {
    switch (type) {
      case "fromLocation":
        setFromLocation(value);
        break;
      case "toLocation":
        setToLocation(value);
        break;
      case "fromCostCenter":
        setFromCostCenter(value);
        break;
      case "toCostCenter":
        setToCostCenter(value);
        break;
    }
  };

  // Confirm header change and reset components
  const confirmHeaderChange = () => {
    if (pendingChange) {
      updateHeaderField(pendingChange.type, pendingChange.value);
      setRowData([]); // Reset components
      showToast("Header details updated. Components have been reset.", "info");
    }
    setShowConfirm(false);
    setPendingChange(null);
  };

  // Cancel header change
  const cancelHeaderChange = () => {
    setShowConfirm(false);
    setPendingChange(null);
  };

  // Add new row
  const handleAddRow = () => {
    const newRow: RowData = {
      id: generateId(),
      component: null,
      quantity: "",
      availableqty: "--",
      remarks: "",
      unit: "",
      isNew: true,
    };
    setRowData([...rowData, newRow]);
  };

  // Delete row
  const handleDeleteRow = (id: string) => {
    setRowData(rowData.filter((row) => row.id !== id));
  };
  useEffect(() => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.refreshCells({ force: true });
    }
  }, [fromLocation, fromCostCenter]);

  // Cell renderer components
  const components = {
    textInputCellRenderer: (params: any) => {
      console.log("Creating cell renderer with:", {
        fromLocation,
        fromCostCenter,
        field: params.colDef?.field,
      });
      return (
        <MaterialManagementCellRenderer
          props={params}
          customFunction={() => {}}
          updateRowData={() => {}}
          fromLocation={fromLocation}
          fromCostCenter={fromCostCenter}
        />
      );
    },
  };

  // Column definitions
  const columnDefs: ColDef[] = [
    {
      headerName: "#",
      field: "id",
      width: 50,
      valueGetter: "node.rowIndex + 1",
      pinned: "left",
    },
    {
      headerName: "Action",
      field: "action",
      width: 80,
      cellRenderer: (params: any) => (
        <div className="flex items-center justify-center w-full h-full">
          <IconButton onClick={() => handleDeleteRow(params.data.id)}>
            <Icons.delete fontSize="small" color="error" />
          </IconButton>
        </div>
      ),
      headerComponent: () => (
        <div className="flex items-center justify-center w-full h-full">
          <Button
            variant="contained"
            color="primary"
            style={{
              borderRadius: "10%",
              width: 25,
              height: 25,
              minWidth: 0,
              padding: 0,
            }}
            onClick={handleAddRow}
            size="small"
            sx={{ zIndex: 1 }}
          >
            <Icons.add fontSize="small" />
          </Button>
        </div>
      ),
      pinned: "left",
    },
    {
      headerName: "Component",
      field: "component",
      cellRenderer: "textInputCellRenderer",
      minWidth: 300,
    },
    {
      headerName: "Available Qty",
      field: "availableqty",
      cellRenderer: "textInputCellRenderer",
    },
    {
      headerName: "Quantity",
      field: "quantity",
      cellRenderer: "textInputCellRenderer",
      minWidth: 250,
    },
    {
      headerName: "Remarks",
      field: "remarks",
      cellRenderer: "textInputCellRenderer",
    },
    {
      headerName: "unit",
      field: "unit",
      hide: true,
    },
  ];

  // Handle reset
  const handleReset = () => {
    setRowData([]);
    setFromLocation(null);
    setToLocation(null);
    setFromCostCenter(null);
    setToCostCenter(null);
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!fromLocation || !toLocation || !fromCostCenter || !toCostCenter) {
      showToast(
        "Please select all required locations and cost centers",
        "error"
      );
      return;
    }

    if (rowData.length === 0) {
      showToast("Please add at least one component", "error");
      return;
    }

    // Validate that all components are selected
    const hasEmptyComponents = rowData.some(
      (row) => !row.component || !row.quantity
    );
    if (hasEmptyComponents) {
      showToast("Please fill all required fields for all rows", "error");
      return;
    }

    try {
      const submitData = {
        fromLocation: fromLocation.code,
        toLocation: toLocation.code,
        fromCostCenter: fromCostCenter.id,
        toCostCenter: toCostCenter.id,
        quantity: rowData.map((row) => parseFloat(row.quantity) || 0),
        components: rowData.map((row) => row.component?.value),
        remarks: rowData.map((row) => row.remarks),
      };

      dispatch(submitMaterialTransfer(submitData as any)).then((result) => {
        console.log(result)
        if(result.payload.success){
          showToast(result.payload.message || "Material transfer request submitted successfully", "success");
        setRowData([]);
        setFromLocation(null);
        setToLocation(null);
        setFromCostCenter(null);
        setToCostCenter(null);
        }
        else{
          showToast(result.payload.data.message || "Failed to submit material transfer request", "error");
        }
      });
    } catch (error) {
      console.error("Error submitting data:", error);
      showToast("Failed to submit material transfer request", "error");
    }
  };

  useEffect(() => {
    dispatch(setFromCC(fromCostCenter));
  }, [fromCostCenter]);

  useEffect(() => {
    dispatch(setFromLoc(fromLocation));
  }, [fromLocation]);

  return (
    <div className="h-[calc(100vh-100px)] overflow-y-hidden grid grid-cols-[450px_1fr]">
      {/* Left Panel - Header Details */}
      <div className="h-full overflow-y-auto bg-white border-r border-neutral-300">
        <div>
          <div className="h-[41px] border-b border-neutral-300 p-0 flex flex-col justify-center px-[20px] bg-hbg">
            <Typography className="text-slate-600 font-[500]" fontWeight={500}>
              Header Details
            </Typography>
          </div>
          <CardContent className="flex flex-col gap-[20px] py-[20px]">
            <SelectLocationAcordingModule
              label="From Location"
              endPoint="/material-movement/pickLocation"
              value={fromLocation}
              onChange={(e) => {
                handleHeaderChange("fromLocation", e);
              }}
            />

            {/* To Location */}
            <div>
              <SelectLocationAcordingModule
                endPoint="/material-movement/dropLocation"
                value={toLocation}
                onChange={(e) => handleHeaderChange("toLocation", e)}
                label="To Location"
              />
            </div>

            {/* From Cost Center */}
            <div>
              <SelectCostCenter
                variant="outlined"
                value={fromCostCenter}
                onChange={(e) => {
                  console.log(e);
                  handleHeaderChange("fromCostCenter", e);
                }}
                label="From Cost Center"
              />
            </div>

            {/* To Cost Center */}
            <div>
              <SelectCostCenter
                value={toCostCenter}
                onChange={(e) => handleHeaderChange("toCostCenter", e)}
                label="To Cost Center"
              />
            </div>
          </CardContent>
          <CardFooter className="h-[50px] p-0 flex items-center px-[20px] gap-[10px] justify-end">
            <LoadingButton
              type="button"
              onClick={handleReset}
              startIcon={<Icons.refresh fontSize="small" />}
              variant={"contained"}
              sx={{ background: "white", color: "red" }}
            >
              Reset
            </LoadingButton>
            <LoadingButton
              type="button"
              onClick={handleSubmit}
              loading={submitLoading}
              startIcon={<Icons.save fontSize="small" />}
              variant="contained"
            >
              Submit
            </LoadingButton>
          </CardFooter>
        </div>
      </div>

      {/* Right Panel - Component Selection Table */}
      <div className="ag-theme-quartz h-[calc(100vh-100px)]">
        <AgGridReact
          ref={gridRef}
          onCellFocused={(event: any) => {
            const { rowIndex, column } = event;
            const focusedCell = document.querySelector(
              `.ag-row[row-index="${rowIndex}"] .ag-cell[col-id="${column.colId}"] input `
            ) as HTMLInputElement;
            const focusButton = document.querySelector(
              `.ag-row[row-index="${rowIndex}"] .ag-cell[col-id="${column.colId}"] button `
            ) as HTMLButtonElement;

            if (focusedCell) {
              focusedCell.focus();
            }
            if (focusButton) {
              focusButton.focus();
            }
          }}
          columnDefs={columnDefs}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          rowData={rowData}
          animateRows
          loading={false}
          components={components}
          defaultColDef={{
            resizable: true,
            suppressCellFlash: true,
            editable: false,
          }}
          navigateToNextCell={() => {
            return null; // Returning null prevents default focus movement
          }}
        />
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModel
        open={showConfirm}
        onClose={cancelHeaderChange}
        title="Confirm Header Change"
        content={
          <div className="space-y-4">
            <Typography>
              Are you sure you want to change the header details?
            </Typography>
            <Typography className="text-red-600">
              <strong>Warning:</strong> This will reset all added components and
              you'll need to add them again.
            </Typography>
            <Typography>
              You have {rowData.length} component(s) that will be removed.
            </Typography>
          </div>
        }
        cancelText="Cancel"
        confirmText="Continue"
        onConfirm={confirmHeaderChange}
      />
    </div>
  );
};

export default MaterialManagement;
