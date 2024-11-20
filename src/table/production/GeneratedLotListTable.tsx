import React from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { useAppSelector } from "@/hooks/useReduxHook";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import LoadingButton from "@mui/lab/LoadingButton";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import axiosInstance from "@/api/axiosInstance";
import { showToast } from "@/utils/toasterContext";
const GeneratedLotListTable: React.FC = () => {
  const { lotListData, getlotListLoading } = useAppSelector((state) => state.qr);
  const columnDefs: ColDef[] = [
    { headerName: "#", field: "serialNo", sortable: true, filter: true, valueGetter: "node.rowIndex+1", width: 100 },
    { headerName: "Device Model", field: "deviceModel", sortable: true, filter: true },
    { headerName: "SKU ID", field: "skuId", sortable: true, filter: true },
    { headerName: "Lot Size", field: "lotSize", sortable: true, filter: true },
    { headerName: "Sr No.", field: "srlno", sortable: true, filter: true },
    { headerName: "Box No.", field: "boxNo", sortable: true, filter: true },
    { headerName: "Insert Date", field: "insertDate", sortable: true, filter: true },
    { headerName: "Insert By", field: "insertBy", sortable: true, filter: true },
    { headerName: "", field: "refId", sortable: true, filter: true, hide: true },
    { headerName: "", field: "lotId", sortable: true, filter: true, hide: true },
    {
      headerName: "",
      field: "acrtion",
      sortable: false,
      filter: false,
      pinned: "right",
      cellRenderer: (params: any) => {
        const [loading, setLoading] = React.useState(false);
        return (
          <>
            <LoadingButton
              loading={loading}
              loadingPosition="start"
              startIcon={<PictureAsPdfIcon fontSize="small" />}
              variant="contained"
              onClick={async () => {
                setLoading(true);
                try {
                  const response = await axiosInstance.get(`/dispatchDevicePrint/printGenerateLotQr/${params.data.lotId}`, {
                    responseType: "blob",
                  });

                  const blob = new Blob([response.data], { type: "application/pdf" });
                  const pdfUrl = window.URL.createObjectURL(blob);

                  window.open(pdfUrl, "_blank");
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
              }}
            >
              Generate PDF
            </LoadingButton>
          </>
        );
      },
    },
  ];

  return (
    <div className=" ag-theme-quartz h-[calc(100vh-190px)] ">
      <AgGridReact loadingOverlayComponent={CustomLoadingOverlay} loading={getlotListLoading} overlayNoRowsTemplate={OverlayNoRowsTemplate} suppressCellFocus={true} rowData={lotListData ? lotListData : []} columnDefs={columnDefs} />
    </div>
  );
};

export default GeneratedLotListTable;
