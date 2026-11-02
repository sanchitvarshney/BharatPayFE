import React, { RefObject, useMemo, useState } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector } from "@/hooks/useReduxHook";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Link,
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { VisibilityOutlined } from "@mui/icons-material";
import MuiTooltip from "@/components/reusable/MuiTooltip";
import axiosInstance from "@/api/axiosInstance";
import { showToast } from "@/utils/toasterContext";

type Props = {
  gridRef: RefObject<AgGridReact>;
};

interface SwipeItemDetails {
  status: string;
  success: boolean;
  data: Array<{
    issueName: string;
  }>;
}

const SwipeItemDetailsModal: React.FC<{
  open: boolean;
  onClose: () => void;
  details: SwipeItemDetails | any;
  loading?: boolean;
}> = ({ open, onClose, details, loading }) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "success":
        return "success";
      case "error":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "success":
        return <CheckCircleOutlineIcon className="text-green-500" />;
      case "error":
        return <ErrorOutlineIcon className="text-red-500" />;
      default:
        return <InventoryIcon className="text-gray-500" />;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: "rounded-lg shadow-lg",
      }}
    >
      <DialogTitle className="bg-gray-50 border-b">
        <Box className="flex items-center gap-2">
          <InventoryIcon className="text-primary-600" />
          <Typography
            variant="h6"
            component="div"
            className="font-semibold text-gray-800"
          >
            Received Item
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent className="p-0">
        {loading && <CustomLoadingOverlay />}
        <Paper elevation={0} className="p-4">
          {details?.length > 0 ? (
            <List className="divide-y divide-gray-100">
              {details?.map((item: any, index: any) => (
                <ListItem
                  key={index}
                  className="py-3 hover:bg-gray-50 transition-colors duration-200"
                >
                  <Box className="flex items-center justify-between w-full">
                    <Box className="flex items-center gap-3">
                      {getStatusIcon(item.status)}
                      <ListItemText
                        primary={
                          <Typography className="font-medium text-gray-800">
                            {item.issueName}
                          </Typography>
                        }
                      />
                    </Box>
                    {item.status && (
                      <Chip
                        label={item.status}
                        color={getStatusColor(item.status)}
                        size="small"
                        className="font-medium"
                      />
                    )}
                  </Box>
                </ListItem>
              ))}
            </List>
          ) : (
            <Box className="flex flex-col items-center justify-center py-8 text-center">
              <InventoryIcon className="text-gray-400 text-5xl mb-3" />
              <Typography variant="h6" className="text-gray-600 font-medium">
                No Items Found
              </Typography>
              <Typography variant="body2" className="text-gray-500 mt-1">
                There are no items to display at the moment.
              </Typography>
            </Box>
          )}
        </Paper>
      </DialogContent>
      <DialogActions className="bg-gray-50 border-t p-4">
        <Button
          onClick={onClose}
          color="primary"
          variant="contained"
          className="font-medium px-6 hover:shadow-md transition-shadow duration-200"
          startIcon={<CheckCircleOutlineIcon />}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const R20ReportTable: React.FC<Props> = ({ gridRef }) => {
  const {
    r20Report,
    getR20DataLoading,
    swipeItemDetails,
    swipeItemDetailsLoading,
  } = useAppSelector((state) => state.report);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [docLoadingRow, setDocLoadingRow] = useState<string>("");
  const [documents, setDocuments] = useState<string[]>([]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const extractUrls = (data: any): string[] => {
    if (!data) return [];
    if (typeof data === "string") return [data];
    if (Array.isArray(data)) return data.flatMap(extractUrls);
    if (typeof data === "object") {
      const url = data.url || data.file_url || data.document || data.path || data.link;
      if (url) return [url];
      if (data.data) return extractUrls(data.data);
    }
    return [];
  };

  const viewDocument = async (txnNo: string, rowId: string) => {
    if (!txnNo) {
      showToast("Transaction number not found", "error");
      return;
    }
    setDocLoadingRow(rowId);
    try {
      const response = await axiosInstance.get(
        `/scan/awb/document/${encodeURIComponent(txnNo)}`,
        { responseType: "blob" }
      );
      const contentType = String(response.headers["content-type"] || "");

      if (contentType.includes("application/json")) {
        const json = JSON.parse(await response.data.text());
        if (json?.success === false) {
          showToast(json?.message || "Document not found", "error");
          return;
        }
        const urls = extractUrls(json?.data ?? json);
        if (urls.length === 0) {
          showToast("No document found", "error");
        } else if (urls.length === 1) {
          window.open(urls[0], "_blank", "noopener,noreferrer");
        } else {
          setDocuments(urls);
        }
        return;
      }

      const blob = new Blob([response.data], { type: contentType || "application/pdf" });
      window.open(window.URL.createObjectURL(blob), "_blank");
    } catch (error: any) {
      let message = "Failed to fetch document";
      try {
        const text = await error?.response?.data?.text?.();
        if (text) message = JSON.parse(text)?.message || message;
      } catch {
        // response is not JSON
      }
      showToast(message, "error");
    } finally {
      setDocLoadingRow("");
    }
  };

  const columnDefs: ColDef[] = [
    {
      headerName: "#",
      field: "id",
      valueGetter: "node.rowIndex+1",
      maxWidth: 100,
      headerClass: "font-semibold",
    },
    {
      headerName: "AWB No.",
      field: "awb_nos",
      minWidth: 150,
      headerClass: "font-semibold",
    },
    {
      headerName: "Lot QTY",
      field: "doc_qty",
      minWidth: 100,
      headerClass: "font-semibold",
    },
    {
      headerName: "Inward Quantity",
      field: "total_inward",
      minWidth: 100,
      headerClass: "font-semibold",
    },
    {
      headerName: "AWB Count",
      field: "awb_count",
      minWidth: 100,
      headerClass: "font-semibold",
    },

    {
      headerName: "Pending QTY",
      field: "penQty",
      minWidth: 100,
      headerClass: "font-semibold",
    },
       {
      headerName: "Scanned QTY",
      field: "total_scanned",
      minWidth: 100,
      headerClass: "font-semibold",
    },

    {
      headerName: "MIN",
      field: "min",
      minWidth: 100,
      headerClass: "font-semibold",
    },
    {
      headerName: "Device Type",
      field: "deviceType",
      minWidth: 100,
      headerClass: "font-semibold",
    },
        {
      headerName: "Document No.",
      field: "doc_no",
      minWidth: 100,
      headerClass: "font-semibold",
    },
    {
      headerName: "Partner",
      field: "partner",
      minWidth: 100,
      headerClass: "font-semibold",
    },
    {
      headerName: "Insert Date",
      field: "insert_dt",
      minWidth: 100,
      headerClass: "font-semibold",
    },
    {
      headerName: "Documents",
      field: "txn_no",
      minWidth: 110,
      headerClass: "font-semibold",
      filter: false,
      sortable: false,
      cellRenderer: (params: any) => {
        const txnNo = params.data?.txn_no;
        const rowId = String(params.node?.id ?? params.node?.rowIndex);
        return docLoadingRow === rowId ? (
          <CircularProgress size={20} />
        ) : (
          <MuiTooltip title="View Document" placement="left">
            <IconButton size="small" color="primary" onClick={() => viewDocument(txnNo, rowId)}>
              <VisibilityOutlined fontSize="small" />
            </IconButton>
          </MuiTooltip>
        );
      },
    },
  ];

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
      sortable: true,
      resizable: true,
      cellClass: "text-sm py-2",
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm">
      <div className="flex-1">
        <div className="relative ag-theme-quartz h-[calc(100vh-100px)]">
          <AgGridReact
            ref={gridRef}
            loadingOverlayComponent={CustomLoadingOverlay}
            loading={getR20DataLoading}
            overlayNoRowsTemplate={OverlayNoRowsTemplate}
            suppressCellFocus={true}
            rowData={r20Report?.data || []}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            enableCellTextSelection={true}
            className="rounded-lg"
            rowClass="hover:bg-gray-50 transition-colors duration-200"
            pagination
          />
        </div>
      </div>
      <SwipeItemDetailsModal
        open={isModalOpen}
        onClose={handleCloseModal}
        details={swipeItemDetails}
        loading={swipeItemDetailsLoading}
      />
      <Dialog open={documents.length > 0} onClose={() => setDocuments([])} maxWidth="sm" fullWidth>
        <DialogTitle>Documents</DialogTitle>
        <DialogContent>
          <List>
            {documents.map((url, index) => (
              <ListItem key={index}>
                <Link href={url} target="_blank" rel="noopener noreferrer">
                  Document {index + 1}
                </Link>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDocuments([])} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default R20ReportTable;
