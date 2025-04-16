import React, { RefObject, useEffect, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef, ICellRendererParams } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/features/Store";
import {
  addComponentInBom,
  fetchBomDetail,
  UpdateBom,
  addAlternativeComponent,
} from "@/features/master/BOM/BOMSlice";
import LoadingButton from "@mui/lab/LoadingButton";
import { Icons } from "@/components/icons";
import { useAppSelector } from "@/hooks/useReduxHook";
import EditBomDetailCellRenderer from "../Cellrenders/EditBomDetailCellRenderer";
import { showToast } from "@/utils/toasterContext";
import { useParams } from "react-router-dom";
import { Button, Divider, TextField, IconButton, Tooltip } from "@mui/material";
import BootstrapStyleDialog from "@/components/ui/BootstrapStyleDialog";
import SelectComponent, {
  ComponentType,
} from "@/components/reusable/SelectComponent";
import MuiSelect from "@/components/reusable/MuiSelect";
const categoryOptions = [
  { value: "PART", label: "PART" },
  { value: "PCB", label: "PCB" },
  { value: "OTHER", label: "OTHER" },
  { value: "PACKING", label: "PACKING" },
];
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
  const { bomDetail, updateBomLoading, addBomLoading } = useAppSelector(
    (state) => state.bom
  );
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [altOpen, setAltOpen] = useState(false);
  const [selectedPartCode, setSelectedPartCode] = useState<string>("");
  const [component, setComponent] = useState<ComponentType | null>(null);
  const [altComponent, setAltComponent] = useState<ComponentType | null>(null);
  const [category, setCategory] = useState<string | undefined>();
  const [altCategory, setAltCategory] = useState<string | undefined>();
  const [qty, setQty] = useState<string | undefined>();
  const [altQty, setAltQty] = useState<string | undefined>();
  const [ref, setRef] = useState<string>("");
  const [altRef, setAltRef] = useState<string>("");

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
      cellRenderer: (params: ICellRendererParams) => (
        <div className="flex items-center justify-center gap-1">
          <Tooltip title="Add Alternative Component">
            <IconButton
              size="small"
              onClick={() => {
                setSelectedPartCode(params.data.compKey);
                setAltOpen(true);
              }}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                  color: "primary.main",
                },
              }}
            >
              <Icons.add fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="View Alternative Components">
            <IconButton
              size="small"
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                  color: "primary.main",
                  paddingTop: "2px",
                },
              }}
            >
              <Icons.visible fontSize="small" />
            </IconButton>
          </Tooltip>
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
          <div className="">
            <form action="">
              <div className="grid grid-cols-2 gap-[20px] p-[20px]">
                <SelectComponent label="Select Component" varient="filled" width="300px" value={component} onChange={(value) => setComponent(value)} />
                <TextField type="number" label="QTY" variant="filled" value={qty} onChange={(e) => setQty(e.target.value)} />

                <MuiSelect onChange={(value) => setCategory(value)} value={category} variant="filled" options={categoryOptions} label="Category" fullWidth />
                <TextField label="Reference" variant="filled" value={ref} onChange={(e) => setRef(e.target.value)} />
              </div>
              <Divider />
              <div className=" h-[60px] flex items-center justify-end gap-[10px] px-[20px]">
                <Button
                  onClick={() => {
                    if (!component) return showToast("Please select component", "error");
                    if (!category) return showToast("Please select category", "error");
                    if (!qty) return showToast("Please select quantity", "error");
                    if (rowData.find((row) => row.compKey === component.id)) return showToast("Component already added", "error");
                    const payload = {
                      componentKey: component.id,
                      bomID: id || "",
                      quantity: Number(qty),
                      category: category || "",
                      reference: ref,
                    };
                    dispatch(addComponentInBom(payload)).then((res: any) => {
                      if (res.payload.data.success) {
                        dispatch(fetchBomDetail(id || ""));
                        setOpen(false);
                        setRef("");
                        setQty("");
                        setComponent(null);
                        setCategory(undefined);
                      }
                    });
                  }}
                  disabled={addBomLoading}
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
        loading={addBomLoading}
      />

      <BootstrapStyleDialog
        open={altOpen}
        handleClose={() => setAltOpen(false)}
        title="Add Alternative Component"
        content={
          <div className="">
            <form action="">
              <div className="grid grid-cols-2 gap-[20px] p-[20px]">
                <SelectComponent
                  label="Select Alternative Component"
                  varient="filled"
                  width="300px"
                  value={altComponent}
                  onChange={(value) => setAltComponent(value)}
                />
                <TextField
                  type="number"
                  label="QTY"
                  variant="filled"
                  value={altQty}
                  onChange={(e) => setAltQty(e.target.value)}
                />
                <MuiSelect
                  onChange={(value) => setAltCategory(value)}
                  value={altCategory}
                  variant="filled"
                  options={categoryOptions}
                  label="Category"
                  fullWidth
                />
                <TextField
                  label="Reference"
                  variant="filled"
                  value={altRef}
                  onChange={(e) => setAltRef(e.target.value)}
                />
              </div>
              <Divider />
              <div className="h-[60px] flex items-center justify-end gap-[10px] px-[20px]">
                <Button
                  onClick={() => {
                    if (!altComponent)
                      return showToast("Please select component", "error");
                    if (!altCategory)
                      return showToast("Please select category", "error");
                    if (!altQty)
                      return showToast("Please select quantity", "error");
                    const payload = {
                      altComponentKey: altComponent.id,
                      bomID: id || "",
                      quantity: Number(altQty),
                      category: altCategory || "",
                      reference: altRef,
                      componentKey: selectedPartCode,
                    };
                    dispatch(addAlternativeComponent(payload)).then(
                      (res: any) => {
                        if (res.payload.data.success) {
                          dispatch(fetchBomDetail(id || ""));
                          setAltOpen(false);
                          setAltRef("");
                          setAltQty("");
                          setAltComponent(null);
                          setAltCategory(undefined);
                        }
                      }
                    );
                  }}
                  disabled={addBomLoading}
                  variant="contained"
                  color="primary"
                  startIcon={<Icons.save fontSize="small" />}
                >
                  Add Alternative
                </Button>
              </div>
            </form>
          </div>
        }
        loading={addBomLoading}
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
        <LoadingButton loading={updateBomLoading}  loadingPosition="start" type="submit" variant="contained" startIcon={<Icons.save fontSize="small" />} onClick={handleSubmit}>
          Submit
        </LoadingButton>
      </div>
    </div>
  );
};

export default MasterFGBOMDetailTable;
