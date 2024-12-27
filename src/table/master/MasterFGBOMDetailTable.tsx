import React, { RefObject, useEffect, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/features/Store";
import { fetchBomDetail,  UpdateBom } from "@/features/master/BOM/BOMSlice";
import LoadingButton from "@mui/lab/LoadingButton";
import { Icons } from "@/components/icons";
import { useAppSelector } from "@/hooks/useReduxHook";
import EditBomDetailCellRenderer from "../Cellrenders/EditBomDetailCellRenderer";
import { showToast } from "@/utils/toasterContext";
import { useParams } from "react-router-dom";
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
  useEffect(() => {
    if (bomDetail) {
      setRowData(bomDetail?.data?.data.map((item: any) => ({ ...item })));
    }
  }, [bomDetail]);

  const handleSubmit = () => {
    console.log("click");
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
      cellRenderer: "EditBomCellRenderer",
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
      cellRenderer: "EditBomCellRenderer", // Use the same renderer for quantity
    },
    {
      headerName: "Category",
      field: "category",
      cellRenderer: "EditBomCellRenderer",
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
    <div className=" ag-theme-quartz h-[calc(100vh-201px)]">
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
        <LoadingButton loading={updateBomLoading} loadingPosition="start" type="submit" variant="contained" startIcon={<Icons.save fontSize="small" />} onClick={handleSubmit}>
          Submit
        </LoadingButton>
      </div>
    </div>
  );
};

export default MasterFGBOMDetailTable;
