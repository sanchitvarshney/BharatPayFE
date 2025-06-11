import React, {
  RefObject,
  useMemo,
  useCallback,
  useEffect,
  useState,
} from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import {
  getR16Report,
  getSwipeItemDetails,
} from "@/features/report/report/reportSlice";
import CustomPagination from "@/components/reusable/CustomPagination";
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
} from "@mui/material";
import { showToast } from "@/utils/toasterContext";
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

const R16ReportTable: React.FC<Props> = ({ gridRef }) => {
  const {
    r16Report,
    r16ReportLoading,
    r16ReportDateRange,
    r16ReportPartner,
    swipeItemDetails,
    swipeItemDetailsLoading,
  } = useAppSelector((state) => state.report);
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingButtons, setLoadingButtons] = useState<Set<string>>(new Set());

  const handleReceivedItem = (data: any) => {
    const buttonId = `${data.txnID}-${data.uniqueKey}`;
    setLoadingButtons((prev) => new Set([...prev, buttonId]));

    dispatch(getSwipeItemDetails({ id: data?.txnID, key: data?.uniqueKey }))
      .unwrap()
      .then((response) => {
        if (!response?.data || response.data.length === 0) {
          showToast("No items found", "info");
          return;
        }
        setIsModalOpen(true);
      })
      .catch(() => {
        showToast("Failed to fetch item details", "error");
      })
      .finally(() => {
        setLoadingButtons((prev) => {
          const newSet = new Set(prev);
          newSet.delete(buttonId);
          return newSet;
        });
      });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // const handleLostItem = (data: any) => {
  //   // TODO: Implement lost item logic
  //   showToast("Lost Item action triggered", "info");
  //   console.log("Lost Item:", data);
  // };

  const columnDefs: ColDef[] = [
    {
      headerName: "#",
      field: "id",
      valueGetter: "node.rowIndex+1",
      maxWidth: 100,
      headerClass: "font-semibold",
    },
    {
      headerName: "Inward Location",
      field: "inwardLoc",
      minWidth: 150,
      headerClass: "font-semibold",
    },
    {
      headerName: "Partner Name",
      field: "partnerName",
      minWidth: 150,
      headerClass: "font-semibold",
    },
    {
      headerName: "Method",
      field: "method",
      minWidth: 100,
      headerClass: "font-semibold",
    },
    {
      headerName: "SKU Name",
      field: "skuName",
      minWidth: 150,
      headerClass: "font-semibold",
    },
    {
      headerName: "Device SKU",
      field: "deviceSKU",
      minWidth: 150,
      headerClass: "font-semibold",
    },
    {
      headerName: "Model",
      field: "model",
      minWidth: 100,
      headerClass: "font-semibold",
    },
    {
      headerName: "Serial No",
      field: "serialNo",
      minWidth: 150,
      headerClass: "font-semibold",
    },
    {
      headerName: "IMEI No 1",
      field: "imeiNo1",
      minWidth: 150,
      headerClass: "font-semibold",
    },
    {
      headerName: "IMEI No 2",
      field: "imeiNo2",
      minWidth: 150,
      headerClass: "font-semibold",
    },
    {
      headerName: "Sim No",
      field: "simNo",
      minWidth: 150,
      headerClass: "font-semibold",
    },
    {
      headerName: "Transaction ID",
      field: "txnID",
      minWidth: 200,
      headerClass: "font-semibold",
    },
    {
      headerName: "Remark",
      field: "remark",
      minWidth: 150,
      headerClass: "font-semibold",
    },
    {
      headerName: "Insert Date",
      field: "insertData",
      minWidth: 150,
      headerClass: "font-semibold",
    },
    {
      headerName: "Actions",
      field: "actions",
      minWidth: 200,
      headerClass: "font-semibold",
      cellRenderer: (params: any) => {
        const buttonId = `${params.data.txnID}-${params.data.uniqueKey}`;
        const isLoading = loadingButtons.has(buttonId);

        return (
          <div className="flex gap-2">
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleReceivedItem(params.data)}
              className="font-medium hover:shadow-md transition-shadow duration-200 min-w-[120px]"
              disabled={isLoading}
              startIcon={
                isLoading ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <InventoryIcon />
                )
              }
            >
              {isLoading ? "Loading..." : "Received Item"}
            </Button>
            {/* <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleLostItem(params.data)}
            >
              Lost Item
            </Button> */}
          </div>
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

  const handlePageChange = useCallback(
    (page: number) => {
      if (
        !r16ReportDateRange.from ||
        !r16ReportDateRange.to ||
        !r16ReportPartner
      ) {
        return;
      }

      setCurrentPage(page);
      dispatch(
        getR16Report({
          from: r16ReportDateRange.from,
          to: r16ReportDateRange.to,
          partner: r16ReportPartner,
          page: page,
          limit: pageSize,
        })
      );
    },
    [dispatch, r16ReportDateRange, r16ReportPartner, pageSize]
  );

  const handlePageSizeChange = useCallback(
    (size: number) => {
      setPageSize(size);
      setCurrentPage(1); // Reset to first page when changing page size
      if (
        r16ReportDateRange.from &&
        r16ReportDateRange.to &&
        r16ReportPartner
      ) {
        dispatch(
          getR16Report({
            from: r16ReportDateRange.from,
            to: r16ReportDateRange.to,
            partner: r16ReportPartner,
            page: 1,
            limit: size,
          })
        );
      }
    },
    [dispatch, r16ReportDateRange, r16ReportPartner]
  );

  // Initial data load
  useEffect(() => {
    if (
      isInitialLoad &&
      r16ReportDateRange.from &&
      r16ReportDateRange.to &&
      r16ReportPartner
    ) {
      setIsInitialLoad(false);
      dispatch(
        getR16Report({
          from: r16ReportDateRange.from,
          to: r16ReportDateRange.to,
          partner: r16ReportPartner,
          page: 1,
          limit: pageSize,
        })
      );
    }
  }, [dispatch, r16ReportDateRange, r16ReportPartner, pageSize, isInitialLoad]);

  // Update current page when data is loaded
  useEffect(() => {
    if (r16Report?.page) {
      setCurrentPage(r16Report.page);
    }
  }, [r16Report?.page]);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm">
      <div className="flex-1">
        <div className="relative ag-theme-quartz h-[calc(100vh-190px)]">
          <AgGridReact
            ref={gridRef}
            loadingOverlayComponent={CustomLoadingOverlay}
            loading={r16ReportLoading}
            overlayNoRowsTemplate={OverlayNoRowsTemplate}
            suppressCellFocus={true}
            rowData={r16Report?.data || []}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            enableCellTextSelection={true}
            className="rounded-lg"
            rowClass="hover:bg-gray-50 transition-colors duration-200"
          />
        </div>
      </div>
      {r16Report && (
        <CustomPagination
          currentPage={currentPage}
          totalPages={r16Report.totalPages}
          totalRecords={r16Report.totalRecords}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
      <SwipeItemDetailsModal
        open={isModalOpen}
        onClose={handleCloseModal}
        details={swipeItemDetails}
        loading={swipeItemDetailsLoading}
      />
    </div>
  );
};

export default R16ReportTable;
