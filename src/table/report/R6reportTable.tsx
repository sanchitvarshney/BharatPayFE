import React, { RefObject, useMemo } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { useAppSelector } from "@/hooks/useReduxHook";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
// import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
// import { CircularProgress, IconButton } from "@mui/material";
// import MuiTooltip from "@/components/reusable/MuiTooltip";
// import axiosInstance from "@/api/axiosInstance";
// import { showToast } from "@/utils/toasterContext";

type Props = {
  gridRef?: RefObject<AgGridReact<any>>;
};

const R6reportTable: React.FC<Props> = ({ gridRef }) => {
  // const [loading, setLoading] = React.useState(false);
  // const [current, setCurrent] = React.useState<string>("");
  const { r6Report, r6ReportLoading } = useAppSelector((state) => state.report);
  // const generateprint = async (min: string) => {
  //   setLoading(true);

  //   try {
  //     const response = await axiosInstance.get(`/transaction/printMaterialMin?minno=${min}`, {
  //       responseType: "blob",
  //     });

  //     const blob = new Blob([response.data], { type: "application/pdf" });
  //     const pdfUrl = window.URL.createObjectURL(blob);

  //     window.open(pdfUrl, "_blank");

  //     showToast("PDF generated successfully!", "success");
  //   } catch (error: any) {
  //     console.error("Error generating PDF:", error);

  //     if (error.response) {
  //       const contentType = error.response.headers["content-type"];

  //       if (contentType.includes("application/json")) {
  //         const errorData = await error.response.data.text();
  //         const parsedError = JSON.parse(errorData);
  //         const backendMessage = parsedError.message || "An error occurred";
  //         showToast(backendMessage, "error");
  //       } else {
  //         showToast("Error generating PDF", "error");
  //       }
  //     } else {
  //       showToast("Network error or server not reachable", "error");
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const columnDefs: ColDef[] = [
    { field: "id", headerName: "#", sortable: true, filter: true, valueGetter: "node.rowIndex+1", width: 70 },
    {
      field: "txnId",
      headerName: "MIN No.",
      sortable: true,
      filter: true,
      pinned: "left",
      cellRenderer: (params: any) => {
        return (
          <div className="flex items-center justify-center h-full gap-[10px]">
            {/* {loading && current === params.data.insertDt ? (
              <CircularProgress size={20} />
            ) : (
              <MuiTooltip title="Print" placement="left">
                <IconButton
                  onClick={() => {
                    generateprint(params.value);
                    setCurrent(params.data.insertDt);
                  }}
                  color="primary"
                >
                  <LocalPrintshopIcon />
                </IconButton>
              </MuiTooltip>
            )} */}

            {params.value}
          </div>
        );
      },
    },
    { field: "partCode", headerName: "Part Code", sortable: true, filter: true },
    { field: "componentName", headerName: "Component Name", sortable: true, filter: true },
    { field: "uom", headerName: "Unit", sortable: true, filter: true },
    { field: "qty", headerName: "QTY", sortable: true, filter: true },
    { field: "location", headerName: "Location", sortable: true, filter: true },
    // { field: "rate", headerName: "Rate", sortable: true, filter: true },
    { field: "hsn", headerName: "HSN", sortable: true, filter: true },
    { field: "vendorCode", headerName: "Vendor Code", sortable: true, filter: true },
    { field: "vendorName", headerName: "Vendor Name", sortable: true, filter: true, minWidth: 300 },
    {
      field: "vendorAddress",
      headerName: "Vendor Address",
      sortable: true,
      filter: true,

      autoHeight: true,
      minWidth: 400,
    },
    {
      field: "insertDt",
      headerName: "Insert Date",
      sortable: true,
    },
    { field: "insertby", headerName: "Inserted By", sortable: true, filter: true },
    { field: "category", headerName: "Category", sortable: true, filter: true },
    { field: "subCategory", headerName: "Sub Category", sortable: true, filter: true },
  ];
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);
  return (
    <div>
      <div className="relative ag-theme-quartz h-[calc(100vh-100px)]">
        <AgGridReact
          loadingOverlayComponent={CustomLoadingOverlay}
          ref={gridRef}
          loading={r6ReportLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={r6Report ? r6Report : []}
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
