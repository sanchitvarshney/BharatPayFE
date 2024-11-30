import React, { useMemo } from "react";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import {  useAppSelector } from "@/hooks/useReduxHook";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";


const MasterSubCategoryListTable: React.FC = () => {
  const { getSubCategoryLoading, subCategoryList } = useAppSelector((state) => state.category);
  const columnDefs: ColDef[] = [
    {
      headerName: "#",
      field: "#",
      sortable: true,
      filter: false,
      width: 70,
      valueGetter: "node.rowIndex+1",
    },
    {
      headerName: "Category Name",
      field: "name",
      sortable: true,
      filter: true,
      flex: 1,
    },

    {
      headerName: "",
      field: "catId",
      sortable: false,
      filter: false,

      hide: true,
      width: 200,
    },
  ];
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);

  return (
    <div>
      <div className="ag-theme-quartz h-[calc(100vh-50px)]">
        <AgGridReact
          loadingOverlayComponent={CustomLoadingOverlay}
          suppressCellFocus={true}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          rowData={subCategoryList || []}
          loading={getSubCategoryLoading}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default MasterSubCategoryListTable;
