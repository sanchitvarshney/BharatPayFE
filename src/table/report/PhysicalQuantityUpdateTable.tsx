import React, { RefObject, useMemo } from "react";
import { ColDef, ICellRendererParams } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector, useAppDispatch } from "@/hooks/useReduxHook";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { showToast } from "@/utils/toasterContext";
import { updatePhysicalQuantity } from "@/features/report/report/reportSlice";
import { Input } from "@/components/ui/input";

type Props = {
  gridRef: RefObject<AgGridReact<any>>;
};

const InputCellRenderer = (props: ICellRendererParams) => {
  const dispatch = useAppDispatch();
  const [inputValue, setInputValue] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async () => {
    if (!inputValue) {
      showToast("Please enter a quantity", "error");
      return;
    }
    setIsLoading(true);
    try {
      const response = await dispatch(
        updatePhysicalQuantity({
          txnId: props.data.txnID,
          qty: parseFloat(inputValue),
        })
      ).unwrap();

      if (response.data.success) {
        showToast("Quantity updated successfully", "success");
        setInputValue("");
      } else {
        showToast(
          response.data.message || "Failed to update quantity",
          "error"
        );
      }
    } catch (error) {
      showToast("Error updating quantity", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const hasExistingQty =
    props.data.qty !== undefined &&
    props.data.qty !== null &&
    props.data.qty !== "";

  return (
    <div className="flex items-center gap-2">
      {hasExistingQty ? (
        <div className="w-24 px-2 py-1 text-sm font-medium text-gray-700">
          {props.data.qty}
        </div>
      ) : (
        <Input
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
          type="text"
          placeholder="Enter Qty"
          className="w-full custom-input"
        />
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleSubmit}
        disabled={isLoading || hasExistingQty}
        className="hover:bg-blue-50"
      >
        {isLoading ? (
          <Icons.refreshv2 className="h-4 w-4 animate-spin" />
        ) : (
          <Icons.check className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

const columnDefs: ColDef[] = [
  {
    headerName: "#",
    field: "id",
    valueGetter: "node.rowIndex+1",
    maxWidth: 100,
  },
  {
    headerName: "Part Code",
    field: "partCode",
    sortable: true,
    filter: true,
    width: 150,
  },
  { headerName: "Part Name", field: "partName", sortable: true, filter: true },
  {
    headerName: "Opening Qty",
    field: "openingQty",
    sortable: true,
    filter: true,
  },
  {
    headerName: "Inward Qty",
    field: "inwardQty",
    sortable: true,
    filter: true,
  },
  {
    headerName: "Consumption Qty",
    field: "consumpQty",
    sortable: true,
    filter: true,
  },
  {
    headerName: "Closing Qty",
    field: "closingQty",
    sortable: true,
    filter: true,
  },
  { headerName: "Count Qty", field: "countQty", sortable: true, filter: true },
  {
    headerName: "Physical Date",
    field: "physicalDt",
    sortable: true,
    filter: true,
  },
  {
    headerName: "Update Qty",
    field: "updateQty",
    cellRenderer: InputCellRenderer,
    width: 200,
    sortable: false,
    filter: false,
  },
];

const PhysicalQuantityUpdateTable: React.FC<Props> = ({ gridRef }) => {
  const { r15Report, r15ReportLoading } = useAppSelector(
    (state) => state.report
  );
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);

  return (
    <div>
      <div className="relative ag-theme-quartz h-[calc(105vh-100px)]">
        <AgGridReact
          ref={gridRef}
          loadingOverlayComponent={CustomLoadingOverlay}
          loading={r15ReportLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={r15Report?.data || []}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={20}
        />
      </div>
    </div>
  );
};

export default PhysicalQuantityUpdateTable;
