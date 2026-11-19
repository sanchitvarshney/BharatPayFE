import { Button } from "@mui/material";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { FqcTableRow } from "./fqcDeviceImage.types";
import { leftAlignedColumn } from "@/utils/agGridAlignUtils";

export const createFqcColumnDefs = (
  onView: (row: FqcTableRow) => void
): ColDef<FqcTableRow>[] => [
  {
    headerName: "#",
    valueGetter: "node.rowIndex + 1",
    maxWidth: 60,
    ...leftAlignedColumn,
  },
  { headerName: "DSN", field: "dsn", flex: 1, minWidth: 130, ...leftAlignedColumn, },
  { headerName: "Type", field: "type", flex: 1, minWidth: 80, ...leftAlignedColumn, },
  { headerName: "Inserted By", field: "insertBy", flex: 1, minWidth: 120, ...leftAlignedColumn, },
  { headerName: "Insert Date", field: "insertDt", flex: 1, minWidth: 160, ...leftAlignedColumn, },
  {
    headerName: "Action",
    pinned: "right",
    width: 110,
    sortable: false,
    filter: false,
    ...leftAlignedColumn,
    cellRenderer: (params: ICellRendererParams<FqcTableRow>) => (
      <div className="flex items-center h-full">
        <Button
          size="small"
          variant="contained"
          onClick={() => params.data && onView(params.data)}
        >
          View
        </Button>
      </div>
    ),
  },
];
