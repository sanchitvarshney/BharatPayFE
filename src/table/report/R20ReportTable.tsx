import React, {
  RefObject,
  useMemo,
  useState,
} from "react";
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
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

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

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
      headerName: "Qty",
      field: "doc_qty",
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
      headerName: "Mail cc",
      field: "mail_cc",
      minWidth: 150,
      headerClass: "font-semibold",
    },
    {
      headerName: "Mail To",
      field: "mail_cc",
      minWidth: 150,
      headerClass: "font-semibold",
    },
    {
      headerName: "MIN",
      field: "min",
      minWidth: 100,
      headerClass: "font-semibold",
    },
    {
      headerName: "Partner",
      field: "partner",
      minWidth: 100,
      headerClass: "font-semibold",
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
        <div className="relative ag-theme-quartz h-[calc(100vh-160px)]">
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
    </div>
  );
};

export default R20ReportTable;
