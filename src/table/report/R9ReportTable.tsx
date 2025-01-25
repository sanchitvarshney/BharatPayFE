import React, { RefObject, useMemo } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector } from "@/hooks/useReduxHook";
import { Button } from "@mui/material";
import { Icons } from "@/components/icons";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type Props = {
  gridRef?: RefObject<AgGridReact<any>>;
};

const R9ReportTable: React.FC<Props> = ({ gridRef }) => {
  const { r9report, r9ReportLoading } = useAppSelector((state) => state.report);

  const columnDefs: ColDef[] = [
    { headerName: "#", field: "id", valueGetter: "node.rowIndex+1", maxWidth: 100 },
    { headerName: "Vendor Code", field: "vendorCode" },
    { headerName: "Vendor Name", field: "vendorName", minWidth: 300 },
    { headerName: "Vendor Address", field: "vendorAddress", minWidth: 400 },
    { headerName: "AWB No", field: "awbNo" },
    { headerName: "Serial", field: "serial" },
    { headerName: "IMEI", field: "imei" },
    { headerName: "Quantity", field: "quantity" },
    { headerName: "Product", field: "product" },
    { headerName: "Total Debit", field: "totalDebit" },
    {
      headerName: "",
      field: "issues",
      pinned: "right",
      cellRenderer: (params: any) => {
        return (
          <div className="flex items-center h-full gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button startIcon={<Icons.documentDetail />} className="btn-primary">
                  Item Detail
                </Button>
              </SheetTrigger>
              <SheetContent className="p-0 min-w-[40%]">
                <SheetHeader className="h-[50px] flex flex-row items-center px-[10px] bg-hbg border-b border-neutral-300">
                  <SheetTitle>Item Detail</SheetTitle>
                </SheetHeader>
                <div className="h-[calc(100vh-50px)] ag-theme-quartz p-[20px] space-y-2">
                  <table className="w-full text-left border border-collapse border-gray-300">
                    <tbody>
                      {Object.entries(params.value).map(([key, value]) => (
                        <tr key={key}>
                          <td className="border border-gray-300 p-2 text-[17px] font-[500]">{key}</td>
                          <td className="border border-gray-300 p-2 text-[17px] font-[500]"> {String(value)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        );
      },
    },
  ];
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);

  return (
    <div>
      <div className="relative ag-theme-quartz h-[calc(100vh-100px)]">
        <AgGridReact
          ref={gridRef}
          loadingOverlayComponent={CustomLoadingOverlay}
          loading={r9ReportLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={r9report || []}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={20}
        />
      </div>
    </div>
  );
};

export default R9ReportTable;
