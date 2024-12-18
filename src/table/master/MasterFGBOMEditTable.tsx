import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
// import { Button } from "@/components/ui/button";
// import { HiMiniTrash } from "react-icons/hi2";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import EditBomCellRenderer from "@/table/Cellrenders/EditBomCellRenderer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/features/Store";
import { getFGBomList, UpdateBom } from "@/features/master/BOM/BOMSlice";
import LoadingButton from "@mui/lab/LoadingButton";
import { SaveIcon } from "lucide-react";
import { showToast } from "@/utils/toastUtils";
interface RowData {
  components: string;
  quantity: number;
  partCode: string;
  status: string;
  priority: string;
  qty: string;
  category: string;
  source: string;
  smtMiLoc: string;
  id: number;
  compKey: string;
  requiredQty: string;
  bomstatus: string;
}

const MasterFGBOMEditTable: React.FC<{ data: any; header: any; setOpen: any}> = ({
  data,
  header,
  setOpen,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [rowData, setRowData] = useState<RowData[]>([]);

  useEffect(() => {
    if (data) {
      setRowData(data);
    }
  }, [data]);

  // const handleDeleteRow = (id: number) => {
  //   setRowData(rowData.filter((row) => row.id !== id));
  // };

  const handleSubmit = () => {
    const payload = {
      items: {
        component: rowData.map((row) => row.compKey), // Array of component names
        qty: rowData.map((row) => Number(row.requiredQty)), // Array of quantities (converted to number)
        status: rowData.map((row) => Number(row.bomstatus)), // Array of status values (converted to number)
        category: rowData.map((row) => row.category), // Array of categories
      },
      id: header.subjectKey,
      sku: header?.skukey,
    };
    dispatch(UpdateBom(payload)).then((res: any) => {
      if (res.payload.data.success) {
        dispatch(getFGBomList("FG"));
        setRowData([]);
        showToast({
          variant: "success",
          description: res.payload.data?.message,
        });
        setOpen(false);
      }
    })
  };
  const columnDefs: ColDef[] = [
    // {
    //   headerName: "Action",
    //   field: "action",
    //   width: 120,
    //   cellRenderer: (params: any) => (
    //     <div className="flex items-center justify-center w-full h-full">
    //       {" "}
    //       <Button
    //         variant={"outline"}
    //         className="border shadow-none p-0 h-[30px] w-[30px]"
    //         onClick={() => handleDeleteRow(params.data.id)}
    //       >
    //         <HiMiniTrash className="h-[18px] w-[18px] text-red-500" />
    //       </Button>
    //     </div>
    //   ),
    //   // headerComponent: () => (
    //   //   <div className="flex items-center justify-center w-full h-full">
    //   //     <Button className="bg-cyan-700 hover:bg-cyan-800 h-[30px] w-[30px] p-0 flex justify-center items-center" onClick={handleAddRow}>
    //   //       <Plus className="h-[18px] w-[18px]" />
    //   //     </Button>
    //   //   </div>
    //   // ),
    // },
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
      cellRenderer: EditBomCellRenderer,
      // (params: any) => (
      //   <Select
      //     className="w-full"
      //     defaultValue={params.value}
      //     onChange={(value) => handleCategoryChange(params.data.id, value)}
      //     options={[
      //       { value: "1", label: "Active" },
      //       { value: "0", label: "Inactive" },
      //     ]}
      //   />
      // ),
    },
    // {
    //   headerName: "Priority",
    //   field: "priority",
    //   cellRenderer: (params: any) => (
    //     <div className="flex items-center justify-center w-full h-full">
    //       <Input type="number" className="border-slate-400 py-[4px]" value={params.value} onChange={(e) => handleQuantityChange(params.data.id, Number(e.target.value))} style={{ width: "100%" }} />
    //     </div>
    //   ),
    // },
    {
      headerName: "Quantity",
      field: "requiredQty",
      // editable: true,
      cellRenderer: EditBomCellRenderer, // Use the same renderer for quantity
    },
    {
      headerName: "Category",
      field: "category",
      cellRenderer: EditBomCellRenderer,
      // (params: any) => (
      //   <Select
      //     className="w-full"
      //     defaultValue="0"
      //     onChange={(value) => {console.log(value ,params.data);handleCategoryChange(params.data.compKey, value)}}
      //     options={[
      //       { value: "0", label: "PART" },
      //       { value: "1", label: "PCB" },
      //       { value: "2", label: "OTHER" },
      //       { value: "3", label: "PACKING" },
      //     ]}
      //   />
      // ),
    },
    // {
    //   headerName: "Source",
    //   field: "source",
    //   cellRenderer: (params: any) => (
    //     <Select
    //       className="w-full"
    //       defaultValue="lucy"
    //       onChange={(value) => handleComponentChange(params.data.id, value)}
    //       options={[
    //         { value: "jack", label: "Active" },
    //         { value: "lucy", label: "Inactive" },
    //       ]}
    //     />
    //   ),
    // },
    // {
    //   headerName: "SMT/MI LOC",
    //   field: "smtMiLoc",
    //   cellRenderer: (params: any) => (
    //     <div className="flex items-center justify-center w-full h-full">
    //       <Input type="number" className="border-slate-400 py-[4px]" value={params.value} onChange={(e) => handleQuantityChange(params.data.id, Number(e.target.value))} style={{ width: "100%" }} />
    //     </div>
    //   ),
    // },
    // {
    //   headerName: "",
    //   field: "save",
    //   cellRenderer: () => (
    //     <div className="flex items-center justify-center w-full h-full">
    //       <Button className="bg-cyan-700 hover:bg-cyan-800 h-[30px] w-[30px] p-0 flex justify-center items-center">
    //         <IoCheckmark className="h-[18px] w-[18px] " />
    //       </Button>
    //     </div>
    //   ),
    // },
  ];

  return (
    <div className=" ag-theme-quartz h-[calc(100vh-100px)]">
      <AgGridReact
        overlayNoRowsTemplate={OverlayNoRowsTemplate}
        suppressCellFocus={true}
        rowData={rowData}
        columnDefs={columnDefs}
        components={{
          EditBomCellRenderer: EditBomCellRenderer, // Register the custom renderer
        }}
      />
      <div className="flex justify-end mt-[10px] gap-[10px] pl-[10px]">
      <LoadingButton
        loadingPosition="start"
        type="submit"
        variant="contained"
        // loading={createBomLoading}
        startIcon={<SaveIcon fontSize="small" />}
        onClick={handleSubmit}
      >
        Submit
      </LoadingButton></div>
    </div>
  );
};

export default MasterFGBOMEditTable;
