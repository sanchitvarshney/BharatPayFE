import React, { useMemo } from "react";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector } from "@/hooks/useReduxHook";

const MasterClientDetailTable: React.FC = () => {
  const { clientdata, getClientLoading } = useAppSelector((state) => state.client);
  const columnDefs: ColDef[] = [
    { headerName: "#", field: "id", sortable: true, filter: false, valueGetter: "node.rowIndex+1", maxWidth: 80 },
    { headerName: "Client ID", field: "c_id", sortable: true, filter: false },
    { headerName: "Client Name", field: "name", sortable: true, filter: false },
    // {
    //   headerName: "Name",
    //   field: "vendor_name",
    //   sortable: true,
    //   filter: true,
    //   flex: 1,
    //   // cellRenderer: (params: any) => (
    //   //   <div className="flex items-center justify-center h-[50px] ">
    //   //     <Link to={`/master-vendor/${params.data.vendor_code}`} className=" hover:bg-white   rounded-md   flex items-center justify-between text-cyan-600  gap-[20px]  whitespace-pre-wrap  w-full px-[5px] ">
    //   //       <Typography fontSize={14} textAlign={"start"}>
    //   //         {params.value}
    //   //       </Typography>
    //   //       <Icons.followLink sx={{ fontSize: "16px" }} />
    //   //     </Link>
    //   //   </div>
    //   // ),
    //   maxWidth: 300,
    //   autoHeight: true,
    // },
    { headerName: "GST Number", field: "gst", sortable: true, filter: false, flex: 1 },
    { headerName: "Mobile", field: "mobile", sortable: true, filter: false, flex: 1 },
    { headerName: "Email", field: "email", sortable: true, filter: false, flex: 1 },
    { headerName: "City", field: "city", sortable: true, filter: false, flex: 1 },
  ];
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
      floatingFilter: false,
    };
  }, []);
  return (
    <div>
      <div className=" ag-theme-quartz h-[calc(100vh-150px)]">
        <AgGridReact
          loading={getClientLoading}
          loadingOverlayComponent={CustomLoadingOverlay}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={clientdata || []}
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
