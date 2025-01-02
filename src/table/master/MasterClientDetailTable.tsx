import React, { useMemo } from "react";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { Link } from "react-router-dom";
import { Icons } from "@/components/icons";
import { useAppSelector } from "@/hooks/useReduxHook";
import { Typography } from "@mui/material";

const MasterClientDetailTable: React.FC = () => {
  const { vendor, getvendorLoading } = useAppSelector((state) => state.vendor);
  const columnDefs: ColDef[] = [
    { headerName: "#", field: "id", sortable: true, filter: false, valueGetter: "node.rowIndex+1", maxWidth: 80 },
    { headerName: "Client ID", field: "client_id", sortable: true, filter: false },
    {
      headerName: "Name",
      field: "vendor_name",
      sortable: true,
      filter: true,
      flex: 1,
      cellRenderer: (params: any) => (
        <div className="flex items-center justify-center h-[50px] ">
          <Link to={`/master-vendor/${params.data.vendor_code}`} className=" hover:bg-white   rounded-md   flex items-center justify-between text-cyan-600  gap-[20px]  whitespace-pre-wrap  w-full px-[5px] ">
            <Typography fontSize={14} textAlign={"start"}>
              {params.value}
            </Typography>
            <Icons.followLink sx={{ fontSize: "16px" }} />
          </Link>
        </div>
      ),
      maxWidth: 300,
      autoHeight: true,
    },
    { headerName: "Email", field: "vendor_email", sortable: true, filter: false, flex: 1 },
    { headerName: "Mobile", field: "vendor_mobile", sortable: true, filter: false, flex: 1 },
    { headerName: "PAN No.", field: "vendor_pan", sortable: true, filter: false, flex: 1 },

    {
      headerName: "Vendor Status",
      field: "vendor_status",
      sortable: false,
      filter: false,
      flex: 1,
      cellRenderer: (params: any) => (
        <div className="flex items-center h-full">
          {" "}
          <Typography fontSize={14} textAlign={"start"} color={params.value === "A" ? "success" : "error"}>
            {params.value === "A" ? "Active" : "Inactive"}
          </Typography>
        </div>
      ),
    },
  ];
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
      floatingFilter: true,
    };
  }, []);
  return (
    <div>
      <div className=" ag-theme-quartz h-[calc(100vh-150px)]">
        <AgGridReact
          loading={getvendorLoading}
          loadingOverlayComponent={CustomLoadingOverlay}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={vendor ? vendor : []}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSizeSelector={[10, 25, 50]}
        />
      </div>
    </div>
  );
};

export default MasterClientDetailTable;
