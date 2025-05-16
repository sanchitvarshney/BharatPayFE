import {  useMemo, useState } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { Button } from "@/components/ui/button";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Icons } from "@/components/icons";
import { transferBranchReport } from "@/features/report/report/reportSlice";

// Generate dummy data according to pagination needs
const ManageBranchTable  = () => {
  const dispatch = useAppDispatch();
 const columnDefs: ColDef[] = [
    {
      headerName: "#",
      field: "serialNo",
      sortable: true,
      filter: true,
      valueGetter: "node.rowIndex+1",
      width: 100,
    },
    {
      headerName: "Challan ID",
      field: "challanId",
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      headerName: "Device Type",
      field: "deviceType",
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      headerName: "SKU",
      field: "sku",
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      headerName: "From Branch",
      field: "fromFranch",
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      headerName: "To Branch",
      field: "to_branch",
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      headerName: "From Location",
      field: "from_location",
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      headerName: "To Location",
      field: "to_location",
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      headerName: "Model Name",
      field: "modelName",
      sortable: true,
      filter: true,
      width: 200,
      
    },
    {
      headerName: "Insert Date",
      field: "insertDate",
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      headerName: "Insert By",
      field: "insertBy",
      sortable: true,
      filter: true,
      width: 200,
    },
    // {
    //   headerName: "Actions",
    //   field: "",
    //   sortable: false,
    //   filter: false,
    //   cellRenderer: (params: any) => (
    //     <IconButton
    //       onClick={() => {
    //         setRowData(
    //           rowData.filter((row: any) => row.imei !== params.data.imei)
    //         );
    //       }}
    //     >
    //       <DeleteIcon fontSize="small" color="error" />
    //     </IconButton>
    //   ),
    //   width: 100,
    // },
  ];
  const { transferReport, transferReportLoading } = useAppSelector((state) => state.report);
  const [status, setStatus] = useState<string>("");
  const [colapse, setcolapse] = useState<boolean>(false);
  const paginationPageSize = 20; // Define page size

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
      sortable: true,
    };
  }, []);


  return (
    <div className="bg-white h-[calc(100vh-100px)] flex relative">
      <div
        className={`transition-all flex flex-col gap-[10px] h-[calc(100vh-100px)]  border-r border-neutral-300   ${
          colapse ? "min-w-0 max-w-0" : "min-w-[400px] max-w-[400px] "
        }`}
      >
        <div
          className={`transition-all ${
            colapse ? "left-0" : "left-[400px]"
          } w-[16px] p-0  h-full top-0 bottom-0 absolute rounded-none  text-slate-600 z-[10] flex items-center justify-center`}
        >
          <Button
            onClick={() => setcolapse(!colapse)}
            className={`transition-all w-[16px] p-0 py-[35px] bg-neutral-200  rounded-none hover:bg-neutral-300/50 text-slate-600 hover:h-full shadow-sm shadow-neutral-400 duration-300   `}
          >
            {colapse ? (
              <Icons.right fontSize="small" />
            ) : (
              <Icons.left fontSize="small" />
            )}
          </Button>
        </div>
        <div className="flex  gap-[20px] flex-col   p-[20px] overflow-hidden mt-[20px]">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Filter By"
            >
              <MenuItem value={"APR"}>APPROVED</MenuItem>
              <MenuItem value={"PEN"}>PENDING</MenuItem>
              <MenuItem value={"CANCELLED"}>CANCELLED</MenuItem>
            </Select>
          </FormControl>

          <div className="flex justify-between itesms-center">
            <div className="flex gap-[10px]">
              <LoadingButton
                loading={transferReportLoading}
                variant="contained"
                startIcon={<Icons.search fontSize="small" />}
                loadingPosition="start"
                onClick={() => {
                  dispatch(transferBranchReport(status));
                }}
              >
                Search
              </LoadingButton>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full ">
        <div className="relative ag-theme-quartz h-[calc(100vh-100px)]">
          <AgGridReact
            // ref={gridRef}
            loadingOverlayComponent={CustomLoadingOverlay}
            loading={transferReportLoading}
            overlayNoRowsTemplate={OverlayNoRowsTemplate}
            suppressCellFocus={true}
            rowData={transferReport ? transferReport : []}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={paginationPageSize}
            enableCellTextSelection
          />
        </div>
      </div>
    </div>
  );
};

export default ManageBranchTable;
