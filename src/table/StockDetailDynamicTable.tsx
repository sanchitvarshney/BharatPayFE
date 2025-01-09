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

const StockDetailDynamicTable: React.FC<Props> = ({ gridRef }) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = React.useState(false);
  const [current, setCurrent] = React.useState<string>("");
  const [rowData, setRowData] = useState<any[]>([]); // Holds the row data
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]); // Holds the column definitions
  const { r6Report, r6ReportLoading } = useAppSelector((state) => state.report);
  const generateprint = async (min: string) => {
    setLoading(true);

    try {
      const response = await axiosInstance.get(`/transaction/printMaterialMin?minno=${min}`, {
        responseType: "blob",
      });

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
      const filteredHeader = header?.filter((col: string) => col !== "Print");
      // Dynamically create column definitions based on the header
      const dynamicColumnDefs: ColDef[] = filteredHeader?.map((col: string) => ({
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
          } else {
            return params.value; // Display value for other columns
          }
        },
      }));

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
      <div className="relative ag-theme-quartz h-[100vh]">
        <AgGridReact
          loadingOverlayComponent={CustomLoadingOverlay}
          ref={gridRef}
          loading={r6ReportLoading}
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

export default StockDetailDynamicTable;
