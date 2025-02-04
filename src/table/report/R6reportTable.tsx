import React, { RefObject, useEffect, useMemo, useState } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { CircularProgress, IconButton } from "@mui/material";
import MuiTooltip from "@/components/reusable/MuiTooltip";
import axiosInstance from "@/api/axiosInstance";
import { showToast } from "@/utils/toasterContext";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { clearR6data } from "@/features/report/report/reportSlice";

type Props = {
  gridRef?: RefObject<AgGridReact<any>>;
};

const R6reportTable: React.FC<Props> = ({ gridRef }) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = React.useState(false);
  const [current, setCurrent] = React.useState<string>("");
  const [rowData, setRowData] = useState<any[]>([]); // Holds the row data
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]); // Holds the column definitions
  const { r6Report, r6ReportLoading,wrongDeviceReportLoading } = useAppSelector((state) => state.report);
  const generateprint = async (min: string) => {
    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `/transaction/printMaterialMin?minno=${min}`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const pdfUrl = window.URL.createObjectURL(blob);

      window.open(pdfUrl, "_blank");

      showToast("PDF generated successfully!", "success");
    } catch (error: any) {
      console.error("Error generating PDF:", error);

      if (error.response) {
        const contentType = error.response.headers["content-type"];

        if (contentType.includes("application/json")) {
          const errorData = await error.response.data.text();
          const parsedError = JSON.parse(errorData);
          const backendMessage = parsedError.message || "An error occurred";
          showToast(backendMessage, "error");
        } else {
          showToast("Error generating PDF", "error");
        }
      } else {
        showToast("Network error or server not reachable", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  // const columnDefs: ColDef[] = [
  //   { field: "id", headerName: "#", sortable: true, filter: true, valueGetter: "node.rowIndex+1", width: 70 },
  //   {
  //     field: "txnId",
  //     headerName: "MIN No.",
  //     sortable: true,
  //     filter: true,
  //     pinned: "left",
  //     cellRenderer: (params: any) => {
  //       return (
  //         <div className="flex items-center justify-center h-full gap-[10px]">
  //           {loading && current === params.data.insertDt ? (
  //             <CircularProgress size={20} />
  //           ) : (
  //             <MuiTooltip title="Print" placement="left">
  //               <IconButton
  //                 onClick={() => {
  //                   generateprint(params.value);
  //                   setCurrent(params.data.insertDt);
  //                 }}
  //                 color="primary"
  //               >
  //                 <LocalPrintshopIcon />
  //               </IconButton>
  //             </MuiTooltip>
  //           )}

  //           {params.value}
  //         </div>
  //       );
  //     },
  //   },
  //   { field: "partCode", headerName: "Part Code", sortable: true, filter: true },
  //   { field: "componentName", headerName: "Component Name", sortable: true, filter: true },
  //   { field: "uom", headerName: "Unit", sortable: true, filter: true },
  //   { field: "qty", headerName: "QTY", sortable: true, filter: true },
  //   { field: "location", headerName: "Location", sortable: true, filter: true },
  //   // { field: "rate", headerName: "Rate", sortable: true, filter: true },
  //   { field: "hsn", headerName: "HSN", sortable: true, filter: true },
  //   { field: "vendorCode", headerName: "Vendor Code", sortable: true, filter: true },
  //   { field: "vendorName", headerName: "Vendor Name", sortable: true, filter: true, minWidth: 300 },
  //   {
  //     field: "vendorAddress",
  //     headerName: "Vendor Address",
  //     sortable: true,
  //     filter: true,

  //     autoHeight: true,
  //     minWidth: 400,
  //   },
  //   {
  //     field: "insertDt",
  //     headerName: "Insert Date",
  //     sortable: true,
  //   },
  //   { field: "insertby", headerName: "Inserted By", sortable: true, filter: true },
  //   { field: "category", headerName: "Category", sortable: true, filter: true },
  //   { field: "subCategory", headerName: "Sub Category", sortable: true, filter: true },
  // ];
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);

  useEffect(() => {
    const fetchGridData = async () => {
      setLoading(true);
      const r6Data: any = r6Report;
      const header = r6Data?.header; // Headers from API response
      const data = r6Data?.data; // Row data from API response
      const filteredHeader = header?.filter((col: string) => col !== "Print"&& col !== "Transaction ID");
      // Dynamically create column definitions based on the header
      const dynamicColumnDefs: ColDef[] = filteredHeader?.map(
        (col: string) => ({
          field: col,
          headerName: col,
          sortable: true,
          filter: true,
          resizable: true,
          autoHeight: true,
          cellRenderer: (params: any) => {
            // Check if it's the MINNo column and if the print option is true
            if (col === "MINNo" && params.data.Print) {
              return (
                <div className="flex items-center justify-center gap-[10px]">
                  {loading && current === params.data["Insert Date"] ? (
                    <CircularProgress size={20} />
                  ) : (
                    <MuiTooltip title="Print" placement="left">
                      <IconButton
                        color="primary"
                        onClick={() => {
                          generateprint(params.value); // Call the print function
                          setCurrent(params.data["Insert Date"]); // Set current for loading indicator
                        }}
                      >
                        <LocalPrintshopIcon />
                      </IconButton>
                    </MuiTooltip>
                  )}
                  {params.value} {/* Display MINNo value */}
                </div>
              );
            }
            //photo section will be done later 
            // if (col === "Photo" && params.data.Photo) {
            //   console.log(params)
            //   return (
            //     <a href={params.data.Photo} target="_blank" rel="noopener noreferrer">
            //       View Photo
            //     </a>
            //   );
            // } 
            else {
              return params.value; // Display value for other columns
            }
          },
        })
      );

      setColumnDefs(dynamicColumnDefs); // Set dynamic column definitions
      setRowData(data); // Set the row data
      setLoading(false);
    };

    fetchGridData();
  }, [r6Report]);

  useEffect(() => {
    dispatch(clearR6data());
  }, []);

  return (
    <div>
      {loading && <FullPageLoading />}
      <div className="relative ag-theme-quartz h-[calc(100vh-100px)]">
        <AgGridReact
          loadingOverlayComponent={CustomLoadingOverlay}
          ref={gridRef}
          loading={r6ReportLoading||wrongDeviceReportLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={20}
        />
      </div>
    </div>
  );
};

export default R6reportTable;
