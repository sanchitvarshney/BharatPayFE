import React, { RefObject, useMemo, useState } from "react";
import { ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { Link } from "react-router-dom";
import { Icons } from "@/components/icons";
import { MenuItem, Select } from "@mui/material";
import ConfirmationModel from "@/components/reusable/ConfirmationModel";
import { getComponentsAsync, updateMaterialPurchasedAsync } from "@/features/master/component/componentSlice";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  uploadImage: boolean;
  setUploadImage: React.Dispatch<React.SetStateAction<boolean>>;
  viewImage: boolean;
  setViewImage: React.Dispatch<React.SetStateAction<boolean>>;
  gridRef?: RefObject<AgGridReact<any>>;
};

const MsterComponentsMaterialListTable: React.FC<Props> = ({ gridRef }) => {
  const dispatch = useAppDispatch();
  const { component, getComponentLoading, updateMaterialPurchasedLoading } = useAppSelector(
    (state) => state.component,
  );
  const [rowMaterialConfirm, setRowMaterialConfirm] = useState<boolean>(false);
  const [rowMaterialData, setRowMaterialData] = useState<any>(null);
  const handleChange = (value: any) => {
    setRowMaterialConfirm(true);
    setRowMaterialData(value);
  };

  const handleChangeRowMaterial = () => {
    dispatch(
      updateMaterialPurchasedAsync({
        comp: rowMaterialData?.component_key,
        is_row_material_purchased: rowMaterialData?.is_row_material_purchased === "Y" ? "N" : "Y",
      }),
    ).then((res: any) => {
      if (res.payload?.data?.success) {
        dispatch(getComponentsAsync());
        setRowMaterialConfirm(false);
        setRowMaterialData(null);
      }
    });
  };
  const columnDefs: ColDef[] = [
    {
      headerName: "#",
      maxWidth: 100,
      field: "id",
      filter: false,
      valueGetter: (params: any) => params.node.rowIndex + 1,
    },
    {
      headerName: "Name",
      field: "c_name",
      sortable: true,
      filter: true,
      minWidth: 300,
      cellRenderer: (params: any) => (
        <Link
          className=" text-cyan-600"
          to={`/master-components/${params?.data?.component_key}`}
        >
          <span className="whitespace-normal">{params?.value}</span>
          <Icons.followLink sx={{ fontSize: "15px", mx: 1 }} />
        </Link>
      ),
      autoHeight: true,
    },
    {
      headerName: "Part Code",
      field: "c_part_no",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Department",
      field: "department",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Rate",
      field: "rate",
      sortable: true,
      filter: true,
    },

    {
      headerName: "Is Enabled",
      field: "is_enabled",
      sortable: true,
      filter: true,
      cellRenderer: (params: any) =>
        params?.value === "Y" ? "Enable" : "Disable",
    },
    {
      headerName: "UOM",
      field: "units_name",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Raw Material Purchased",
      field: "is_row_material_purchased",
      sortable: true,
      filter: true,
      cellRenderer: (params: any) => (
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={params?.data?.is_row_material_purchased === "Y" ? "Y" : "N"}
          IconComponent={null as any}
          size="small"
          variant="standard"
          fullWidth
          onChange={() => handleChange(params?.data)}
          sx={{
            color:
              params.data?.is_row_material_purchased === "Y" ? "green" : "red",
            textTransform: "none",
            "& .MuiFilledInput-input": {
              backgroundColor: "#fff",
            },
          }}
        >
          <MenuItem value="Y">Yes</MenuItem>
          <MenuItem value="N">No</MenuItem>
        </Select>
      ),
    },
    {
      headerName: "key",
      field: "component_key",
      hide: true,
    },
  ];
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
      floatingFilter: false,
    };
  }, []);
  return (
    <div>
      <div className=" ag-theme-quartz h-[calc(100vh-140px)]">
        <AgGridReact
          ref={gridRef}
          loadingOverlayComponent={CustomLoadingOverlay}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          loading={getComponentLoading}
          rowData={component?.components}
          suppressCellFocus={true}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSizeSelector={[20, 30, 50]}
          paginationPageSize={30}
        />
      </div>
      <ConfirmationModel
        open={rowMaterialConfirm}
        onClose={() => {
          setRowMaterialConfirm(false);
          setRowMaterialData(null);
        }}
        onConfirm={handleChangeRowMaterial}
        title="Confirmation"
        content="Are you sure you want to update?"
        confirmText="Update"
        cancelText="Cancel"
        loading={updateMaterialPurchasedLoading}
      />
    </div>
  );
};

export default MsterComponentsMaterialListTable;
