import React from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector } from "@/hooks/useReduxHook";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import {
  CustomDrawerHeader,
  CustomDrawerTitle,
  CustomDrawerContent,
} from "@/components/reusable/CustomDrawer";
import { CustomDrawer } from "@/components/reusable/CustomDrawer";

type Props = {
  open?: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  poId: string;
};
const ViewPOModal: React.FC<Props> = ({ open, setOpen, poId }) => {
  const { fetchPOData, fetchPODataLoading } = useAppSelector(
    (state) => state.po
  );

  const columnDefs: ColDef[] = [
    {
      headerName: "#",
      field: "srNo",
      sortable: true,
      filter: true,
      valueGetter: "node.rowIndex + 1",
      maxWidth: 80,
    },
    {
      headerName: "Part Code",
      field: "componentPartID",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Part Name",
      field: "po_components",
      sortable: true,
      filter: true,
    },
    { headerName: "Qty", field: "ordered_qty", sortable: true, filter: true },
    {
      headerName: "Pending Qty",
      field: "pending_qty",
      sortable: true,
      filter: true,
    },
   
    {
      headerName: "PO Order Rate",
      field: "po_order_rate",
      sortable: true,
      filter: true,
    },
    {
      headerName: "PO Part Status",
      field: "po_part_status",
      sortable: true,
      filter: true,
    },
    {
      headerName: "PO Remark",
      field: "po_remark",
      sortable: true,
      filter: true,
    },
  ];

  return (
    <CustomDrawer open={open} onOpenChange={setOpen}>
      <CustomDrawerContent
        side="right"
        className="min-w-[80%] p-0"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <CustomDrawerHeader className="h-[50px] p-0 flex flex-col justify-center px-[20px] space-y-0 bg-zinc-200 gap-0">
          <CustomDrawerTitle className="text-slate-600 font-[500] p-0">
            PO Details - {poId}
          </CustomDrawerTitle>
        </CustomDrawerHeader>
        <div className="h-[calc(100vh-50px)] ">
          <div className="relative ag-theme-quartz h-[calc(100vh-100px)]">
            <AgGridReact
              loading={fetchPODataLoading}
              loadingOverlayComponent={CustomLoadingOverlay}
              overlayNoRowsTemplate={OverlayNoRowsTemplate}
              suppressCellFocus
              columnDefs={columnDefs}
              rowData={fetchPOData ? fetchPOData : []}
              pagination={true}
              enableCellTextSelection={true}
            />
          </div>
        </div>
      </CustomDrawerContent>
    </CustomDrawer>
  );
};

export default ViewPOModal;
