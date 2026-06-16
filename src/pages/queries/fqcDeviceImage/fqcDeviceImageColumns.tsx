import { Button } from "@mui/material";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { FqcTableRow } from "./fqcDeviceImage.types";

export const createFqcColumnDefs = (
  onView: (row: FqcTableRow) => void
): ColDef<FqcTableRow>[] => [
  { headerName: "DSN", field: "dsn", flex: 1, minWidth: 130 },
  { headerName: "Type", field: "type", flex: 1, minWidth: 80 },
  { headerName: "Inserted By", field: "insertBy", flex: 1, minWidth: 120 },
  { headerName: "Insert Date", field: "insertDt", flex: 1, minWidth: 160 },
  {
    headerName: "Action",
    pinned: "right",
    width: 110,
    sortable: false,
    filter: false,
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
