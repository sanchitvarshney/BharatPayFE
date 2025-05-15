import {  useMemo, useState } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { Button } from "@/components/ui/button";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { transferReport } from "@/features/report/report/reportSlice";
import LoadingButton from "@mui/lab/LoadingButton";
import { Icons } from "@/components/icons";

// Generate dummy data according to pagination needs
const ManageBranchTable  = () => {
  const dispatch = useAppDispatch();
  const columnDefs: ColDef[] = [
    {
      headerName: "#",
      field: "id",
      sortable: true,
      filter: true,
      width: 100,
      valueGetter: "node.rowIndex+1",
    },
    {
      headerName: "Production ID",
      field: "prodductionId",
      sortable: true,
      filter: true,
    },
    {
      headerName: "SR No.",
      field: "productSrlNo",
      sortable: true,
      filter: true,
    },
    {
      headerName: "IMEI 1",
      field: "productImei1",
      sortable: true,
      filter: true,
    },
    {
      headerName: "IMEI 2",
      field: "productImei2",
      sortable: true,
      filter: true,
    },
    { headerName: "SKU", field: "sku", sortable: true, filter: true },
    { headerName: "SKU Name", field: "skuName", sortable: true, filter: true },
    {
      headerName: "Requested Date",
      field: "insertDate",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Requested By",
      field: "insertBy",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Pick Location",
      field: "productionLocation",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Drop Location",
      field: "dropLocation",
      sortable: true,
      filter: true,
    },
    {
      headerName: "",
      field: "prodductionId",
      sortable: true,
      filter: true,
      hide: true,
    },
    // {
    //   headerName: "",
    //   pinned: "right",
    //   sortable: false,
    //   filter: false,
    //   cellRenderer: (params: any) => (
    //     <Button
    //       onClick={() => {
    //         setOpen(true);
    //         dispatch(r4ReportDetail(params.data.prodductionId));
    //       }}
    //       variant="contained"
    //       size="small"
    //       startIcon={<FullscreenIcon fontSize="small" />}
    //     >
    //       Detail
    //     </Button>
    //   ),
    //   width: 150,
    // },
  ];
  const { r4report, r4reportLoading } = useAppSelector((state) => state.report);
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
                loading={r4reportLoading}
                variant="contained"
                startIcon={<Icons.search fontSize="small" />}
                loadingPosition="start"
                onClick={() => {
                  dispatch(transferReport(status));
                }}
                // onClick={() => {
                //   if (filter === "DEVICE") {
                //     if (!device || !deviceType) {
                //       showToast(
                //         "Please select a device and device type",
                //         "error"
                //       );
                //     } else {
                //       dispatch(
                //         getr4Report({
                //           type: "DEVICE",
                //           device: device?.id,
                //           deviceType,
                //         })
                //       );
                //     }
                //   }
                //   if (filter === "DATE") {
                //     if (!date.from || !date.to) {
                //       showToast("Please select a date", "error");
                //     } else {
                //       dispatch(
                //         getr4Report({
                //           type: "DATE",
                //           from: dayjs(date.from).format("DD-MM-YYYY"),
                //           to: dayjs(date.to).format("DD-MM-YYYY"),
                //           deviceType,
                //         })
                //       );
                //     }
                //   }
                // }}
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
            loading={r4reportLoading}
            overlayNoRowsTemplate={OverlayNoRowsTemplate}
            suppressCellFocus={true}
            rowData={r4report ? r4report : []}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={paginationPageSize}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageBranchTable;
