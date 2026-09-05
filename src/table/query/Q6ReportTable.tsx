import React, { useEffect, useMemo, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { useAppSelector } from "@/hooks/useReduxHook";
import { ColDef } from "@ag-grid-community/core";
import { ConsumptionItem, RowData } from "@/features/query/query/queryType";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { IconButton } from "@mui/material";
import { Icons } from "@/components/icons";
import MuiTooltip from "@/components/reusable/MuiTooltip";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from "@/components/reusable/CustomModal";

type Props = {
  gridRef: any;
  deviceType?: string;
};

const ConsumptionModal: React.FC<{
  open: boolean;
  onClose: () => void;
  consumption: ConsumptionItem[] | null;
}> = ({ open, onClose, consumption }) => {
  const items = consumption ?? [];
  return (
    <Modal open={open} onOpenChange={(v) => !v && onClose()}>
      <ModalContent className="max-w-lg w-full p-0 overflow-hidden">
        <ModalHeader className="px-6 pt-6 pb-4 border-b border-slate-100">
          <ModalTitle className="text-base font-semibold text-slate-800">
            Consumption Details
          </ModalTitle>
          <ModalDescription className="text-xs text-slate-500">
            {items.length} component{items.length !== 1 ? "s" : ""} consumed
          </ModalDescription>
        </ModalHeader>
        <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="text-sm text-slate-400 text-center py-6">
              No consumption data available
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500 border-b border-slate-100">
                  <th className="py-2 pr-2 font-medium">Part Code</th>
                  <th className="py-2 pr-2 font-medium">Component Name</th>
                  <th className="py-2 pl-2 font-medium text-right">Qty</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-50 last:border-0">
                    <td className="py-2 pr-2 text-slate-700">{item.partCode}</td>
                    <td className="py-2 pr-2 text-slate-700">{item.componentName}</td>
                    <td className="py-2 pl-2 text-slate-700 text-right">{item.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </ModalContent>
    </Modal>
  );
};

const Q6ReportTable: React.FC<Props> = ({ gridRef, deviceType }) => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const { q6Statement, q6StatementLoading } = useAppSelector(
    (state) => state.query
  );
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);

  const parseDate = (dateString: string): Date | null => {
    if (!dateString) {
      return null; // Return null if the input string is empty or undefined
    }
  
    const parts = dateString.split(" ");
    if (parts.length !== 2) {
      return null; // Return null if the date string doesn't contain both date and time parts
    }
  
    const dateParts = parts[0].split("-");
    if (dateParts.length !== 3) {
      return null; // Return null if the date part doesn't have exactly 3 components (DD-MM-YYYY)
    }
  
    const timeParts = parts[1].split(":");
    if (timeParts.length !== 3) {
      return null; // Return null if the time part doesn't have exactly 3 components (HH:mm:ss)
    }
  
    // Construct a new date in the format YYYY-MM-DDTHH:mm:ss
    const formattedDateString = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T${timeParts[0]}:${timeParts[1]}:${timeParts[2]}`;
  
    const parsedDate = new Date(formattedDateString);
    return isNaN(parsedDate.getTime()) ? null : parsedDate; // Return null if the resulting date is invalid
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

useEffect(() => {
  if (Array.isArray(q6Statement) && q6Statement.length > 0) {
    const convertedData: any[] = q6Statement
      .filter(item => item.time) // filter out any items without time
      .map((item) => ({
        insertDate: parseDate(item.time),
        transaction: item.minNo,
        transactionType: item.transactionType,
        method: item.method,
        locIn: item.location,
        locOut: item.locationOut,
        insertBy: item.user,
        moveId: item.deviceMovId,
        manufacturingMonth: item.manufacturingMonth,
        issue: item.issue,
        consumption: item.consumption,
      }));
    setRowData(convertedData);
  } else {
    setRowData([]);
  }
}, [q6Statement]);


  const [consumptionRow, setConsumptionRow] = useState<ConsumptionItem[] | null>(null);
  const isSoundbox = deviceType?.toLowerCase() === "soundbox";

  const columnDefs: ColDef[] = [
    {
      headerName: "#",
      field: "id",
      sortable: true,
      filter: true,
      width: 100,
      valueGetter: (params: any) => params.node.rowIndex + 1,
    },
    {
      headerName: "Date",
      field: "insertDate",
      sortable: true,
      filter: true,
      sort: "asc",
      valueFormatter: (params: any) => formatDate(new Date(params.value)),
    },
    {
      headerName: "Transaction ID",
      field: "transaction",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Method",
      field: "method",
      sortable: true,
      filter: true,
      width: 150,
    },
    { headerName: "Location In", field: "locIn", sortable: true, filter: true },
    {
      headerName: "Location Out",
      field: "locOut",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Transaction Type",
      field: "transactionType",
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      headerName: "Move ID",
      field: "moveId",
      sortable: true,
      filter: true,
      width:250
    },
    {
      headerName: "Inserted By",
      field: "insertBy",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Remark",
      field: "remark",
      sortable: true,
      filter: true,
    },
    ...(isSoundbox
      ?   [
           {
            headerName: "Issue",
            field: "issue",
            sortable: true,
            filter: true,
            valueFormatter: (params: any) => params.value || "--",
          },
          {
            headerName: "Action",
            field: "consumption",
            sortable: false,
            filter: false,
            width: 110,
            cellRenderer: (params: any) => {
              const count = params.value?.length ?? 0;
              return (
                <div className="flex h-full items-center justify-center">
                  <MuiTooltip
                    title={
                      count
                        ? `View Consumption (${count} item${count > 1 ? "s" : ""})`
                        : "No consumption data"
                    }
                    placement="top"
                  >
                    <span>
                      <IconButton
                        size="small"
                        disabled={count === 0}
                        onClick={() => setConsumptionRow(params.value ?? [])}
                        sx={{
                          width: 32,
                          height: 32,
                          color: "#1d4ed8",
                          backgroundColor: "#eff6ff",
                          border: "1px solid #bfdbfe",
                          "&:hover": { backgroundColor: "#dbeafe" },
                          "&.Mui-disabled": {
                            color: "#cbd5e1",
                            backgroundColor: "#f8fafc",
                            border: "1px solid #e2e8f0",
                          },
                        }}
                      >
                        <Icons.visible sx={{ fontSize: 16 }} />
                      </IconButton>
                    </span>
                  </MuiTooltip>
                </div>
              );
            },
          },
        ] : []
     ),
  ];

  return (
    <div>
      <div className=" ag-theme-quartz h-[calc(100vh-100px)]">
        <AgGridReact
          loadingOverlayComponent={CustomLoadingOverlay}
          ref={gridRef}
          loading={q6StatementLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true} 
          paginationPageSize={20}
          enableCellTextSelection
        />
      </div>
      <ConsumptionModal
        open={consumptionRow !== null}
        onClose={() => setConsumptionRow(null)}
        consumption={consumptionRow}
      />
    </div>
  );
};

export default Q6ReportTable;
