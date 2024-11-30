import React, { useMemo } from "react";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { Button } from "@mui/material";
import { Icons } from "@/components/icons";
import { getSubCategoryList } from "@/features/master/Category/CategorySlice";

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCategoryName: React.Dispatch<React.SetStateAction<string>>;
};
const MasterCategoryList: React.FC<Props> = ({ setOpen, setCategoryName }) => {
  const { getCategoryLoading, categoryList } = useAppSelector((state) => state.category);
  const dispatch = useAppDispatch();
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

      cellRenderer: (params: any) => (
        <Button
          onClick={() => {
            dispatch(getSubCategoryList(params.data.catId));
            setOpen(true);
            setCategoryName(params.data.name);
          }}
          variant="contained"
          size="small"
          startIcon={<Icons.view fontSize="small" />}
        >
          View Subcategories
        </Button>
      ),
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
          rowData={categoryList || []}
          loading={getCategoryLoading}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={50}
        />
      </div>
    </div>
  );
};

export default MasterCategoryList;
