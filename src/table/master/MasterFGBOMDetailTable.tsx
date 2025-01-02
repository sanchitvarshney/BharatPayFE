import React, { RefObject, useEffect, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/features/Store";
import { fetchBomDetail, UpdateBom } from "@/features/master/BOM/BOMSlice";
import LoadingButton from "@mui/lab/LoadingButton";
import { Icons } from "@/components/icons";
import { useAppSelector } from "@/hooks/useReduxHook";
import EditBomDetailCellRenderer from "../Cellrenders/EditBomDetailCellRenderer";
import { showToast } from "@/utils/toasterContext";
import { useParams } from "react-router-dom";
import { Button,  TextField } from "@mui/material";
import BootstrapStyleDialog from "@/components/ui/BootstrapStyleDialog";
import SelectComponent, { ComponentType } from "@/components/reusable/SelectComponent";
import SelectCategory, { CategoryType } from "@/components/reusable/SelectCategory.";
import MuiSelect from "@/components/reusable/MuiSelect";
interface RowData {
  requiredQty: string; // Quantity required (as a string)
  bomstatus: string; // Bill of Materials status (as a string)
  category: string; // Category of the component
  compKey: string; // Unique key for the component
  componentName: string; // Name of the component
  partCode: string; // Part code identifier
  componentDesc: string; // Description of the component
  unit: string; // Unit of measurement
}
type Props = {
  gridRef: RefObject<AgGridReact<any>>;
};

const MasterFGBOMDetailTable: React.FC<Props> = ({ gridRef }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [rowData, setRowData] = useState<RowData[]>([]);
  const { bomDetail, updateBomLoading } = useAppSelector((state) => state.bom);
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [component, setComponent] = useState<ComponentType | null>(null);
  const [category, setCategory] = useState<CategoryType | null>(null);
  const [status, setStatus] = useState<string | undefined>();
  const [qty, setQty] = useState<string | undefined>();
  useEffect(() => {
    if (bomDetail) {
      setRowData(bomDetail?.data?.data.map((item: any) => ({ ...item })));
    }
  }, [bomDetail]);

  const handleSubmit = () => {
    const payload = {
      items: {
        component: rowData.map((row) => row.compKey),
        qty: rowData.map((row) => Number(row.requiredQty)),
        status: rowData.map((row) => Number(row.bomstatus)),
        category: rowData.map((row) => row.category), // Array of categories
      },
      id: bomDetail?.data?.header?.subjectKey || "",
      sku: bomDetail?.data?.header?.skukey || "",
    };
    dispatch(UpdateBom(payload)).then((res: any) => {
      if (res.payload.data.success) {
        showToast(res.payload.data?.message, "success");
        dispatch(fetchBomDetail(id || ""));
      }
    });
  };
  const columnDefs: ColDef[] = [
    {
      headerName: "Action",
      field: "action",
      width: 120,
    
      headerComponent: () => (
        <div className="flex items-center justify-center w-full h-full">
          <Button
            onClick={() => setOpen(true)}
            variant="contained"
            color="primary"
            style={{
              borderRadius: "10%",
              width: 25,
              height: 25,
              minWidth: 0,
              padding: 0,
            }}
            size="small"
            sx={{ zIndex: 1 }}
          >
            <Icons.add fontSize="small" />
          </Button>
        </div>
      ),
    },

    {
      headerName: "Components",
      field: "componentName",
      sortable: false,
      filter: false,
      cellStyle: { textAlign: "center" },
    },
    {
      headerName: "Part Code",
      field: "partCode",
      sortable: false,
      filter: false,
    },

    {
      headerName: "Status",
      field: "bomstatus",
      cellRenderer: "EditBomCellRenderer",
    },

    {
      headerName: "Quantity",
      field: "requiredQty",
      // editable: true,
      cellRenderer: "EditBomCellRenderer", // Use the same renderer for quantity
    },
    {
      headerName: "Category",
      field: "category",
      cellRenderer: "EditBomCellRenderer",
    },
  ];

  return (
    <div className=" ag-theme-quartz h-[calc(100vh-201px)]">
      <BootstrapStyleDialog
        open={open}
        handleClose={() => setOpen(false)}
        title="Add New Component"
        content={
          <div>
            <form action="">
              <div className="grid grid-cols-2 gap-[20px]">
                <SelectComponent varient="filled" width="300px" value={component} onChange={(value) => setComponent(value)} />
                <TextField type="number" label="QTY" variant="filled" value={qty} onChange={(e) => setQty(e.target.value)} />

                <SelectCategory variant="filled" value={category} onChange={(value) => setCategory(value)} />
                <MuiSelect
                  onChange={(value) => setStatus(value)}
                  value={status}
                  variant="filled"
                  options={[
                    { value: "1", label: "Active" },
                    { value: "0", label: "Inactive" },
                  ]}
                  label="Status"
                  fullWidth
                />
              </div>

              <div className="mt-[20px] h-[60px] flex items-center justify-end gap-[10px]">
                <Button
                  onClick={() => {
                    if (!component) return showToast("Please select component", "error");
                    if (!category) return showToast("Please select category", "error");
                    if (!status) return showToast("Please select status", "error");
                    if (!qty) return showToast("Please select quantity", "error");
                    if(rowData.find((row) => row.compKey === component.id)) return showToast("Component already added", "error");
                    const payload = {
                      items: {
                        component: [...rowData.map((row) => row.compKey), component.id], // Array of component names
                        qty: [...rowData.map((row) => Number(row.requiredQty)), Number(qty)], // Array of quantities
                        status: [...rowData.map((row) => Number(row.bomstatus)), status], // Array of statuses)],
                        category: [...rowData.map((row) => row.category), category.catId], // Array of categories
                      },
                      id: bomDetail?.data?.header?.subjectKey || "",
                      sku: bomDetail?.data?.header?.skukey || "",
                    };
                    dispatch(UpdateBom(payload)).then((res: any) => {
                      if (res.payload.data.success) {
                        showToast(res.payload.data?.message, "success");
                        dispatch(fetchBomDetail(id || ""));
                        setOpen(false);
                        setComponent(null);
                        setCategory(null);
                        setStatus(undefined);
                        setQty(undefined);
                        
                      }
                    });
                  }}
                  disabled={updateBomLoading}
                  variant="contained"
                  color="primary"
                  startIcon={<Icons.save fontSize="small" />}
                >
                  Add
                </Button>
              </div>
            </form>
          </div>
        }
        loading={updateBomLoading}
      />
      <AgGridReact
        ref={gridRef}
        overlayNoRowsTemplate={OverlayNoRowsTemplate}
        suppressCellFocus={true}
        rowData={rowData}
        columnDefs={columnDefs}
        components={{
          EditBomCellRenderer: EditBomDetailCellRenderer,
        }}
      />
      <div className="flex items-center justify-end  px-[20px] h-[50px] border-t border-neutral-300">
        <LoadingButton disabled={updateBomLoading} loadingPosition="start" type="submit" variant="contained" startIcon={<Icons.save fontSize="small" />} onClick={handleSubmit}>
          Submit
        </LoadingButton>
      </div>
    </div>
  );
};

export default MasterFGBOMDetailTable;
