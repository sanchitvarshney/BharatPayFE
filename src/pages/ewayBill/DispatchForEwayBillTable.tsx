import React, { RefObject, useMemo, useState } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FillEwayBillSheet from "@/components/ewayBill/FillEwayBillSheet";
import CancelEwayBillModal from "@/components/ewayBill/CancelEwayBillModal";
import {
  cancelEwayBill,
  printChallan,
} from "@/features/Dispatch/DispatchSlice";
import { showToast } from "@/utils/toasterContext";
import CustomPagination from "@/components/reusable/CustomPagination";

interface RowData {
  orderQty: number;
  material: string;
  hsnCode: string;
  isNew: boolean;
  taxableValue: number;
  txnId: string;
  dispatchId: string;
  dispatchDate: string;
  inserby: string;
  skuName: string;
  sku: string;
  ewaybill_no: string;
  ewayBill_status: string;
  challanId: string;
}

type Props = {
  gridRef: RefObject<AgGridReact<RowData>>;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number) => void;
  pageSize: number;
};

const R5ReportTable: React.FC<Props> = ({ gridRef ,pageSize,handlePageChange,handlePageSizeChange}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { getChallanLoading } = useAppSelector((state) => state.dispatch);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    rowData: RowData
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(rowData);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // setSelectedRow(null);
  };

  // const handleFilloutEwayBill = () => {
  //   if (selectedRow) {
  //     setSheetOpen(true);
  //     handleMenuClose();
  //     dispatch(getDispatchData(selectedRow.txnId));
  //   }
  // };

  const handleCreateEwayBill = () => {
    if (selectedRow) {
      // Add your create eway bill logic here
      console.log("Create eway bill for:", selectedRow);
      const txnId = selectedRow.txnId;
      const shipmentId = txnId.replace(/\//g, "_");
      fnOpenNewWindow(`/create/e-waybill/${shipmentId}`);
      handleMenuClose();
    }
  };

  const handleCancelEwayBill = () => {
    if (selectedRow) {
      setCancelModalOpen(true);
      handleMenuClose();
    }
  };

  const handleCancelConfirm = async (data: {
    remarks: string;
    cancelType: string;
  }) => {
    if (!selectedRow) return;

    setCancelLoading(true);
    try {
      const result = await dispatch(
        cancelEwayBill({
          ewayBillNo: selectedRow.ewaybill_no,
          remark: data.remarks,
          cancelRsnCode: data.cancelType,
        })
      ).unwrap();

      if (result.status) {
        showToast("Eway bill cancelled successfully", "success");
        setCancelModalOpen(false);
      } else {
        showToast(result.data.Message || "Failed to cancel eway bill", "error");
      }
    } finally {
      setCancelLoading(false);
    }
  };

  function fnOpenNewWindow(link: string) {
    // Define window dimensions
    const width = 920;
    const height = 500;

    // Calculate the position to center the window on the screen
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    // Open the new window centered on the screen
    window.open(
      link,
      "BharatPe",
      `width=${width},height=${height},top=${top},left=${left},status=1,scrollbars=1,location=0,resizable=yes`
    );
  }

  const handlePrintChallan = () => {
    if (selectedRow) {
      const txnId = selectedRow.challanId;
      const shipmentId = txnId.replace(/\//g, "/");
      dispatch(printChallan({ challanId: shipmentId })).then((res: any) => {
        if (res.payload.data.success) {
          window.open(res.payload.data.data, "_blank");
        }
      });
      handleMenuClose();
    }
  };

  const columnDefs: ColDef[] = [
    {
      headerName: "",
      // pinned: "right",
      sortable: false,
      filter: false,
      cellRenderer: (params: { data: RowData }) => (
        <IconButton
          size="small"
          onClick={(e) => handleMenuClick(e, params.data)}
          className="hover:bg-gray-100"
        >
          <MoreVertIcon className="h-4 w-4" />
        </IconButton>
      ),
      width: 50,
    },
    { headerName: "SKU", field: "sku", sortable: true, filter: true, flex: 1 },
    {
      headerName: "SKU Name",
      field: "skuName",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Dispatch Date",
      field: "dispatchDate",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Dispatch Qty",
      field: "dispatchQty",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Insert By",
      field: "inserby",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "TXN ID",
      field: "txnId",
      sortable: false,
      filter: true,
      flex: 1,
      hide: true,
    },
    {
      headerName: "Eway Bill Status",
      field: "ewayBill_status",
      sortable: true,
      filter: true,
      flex: 1,
      valueGetter: (params: { data: RowData }) =>
        params.data.ewayBill_status == "Y"
          ? "Yes"
          : params.data.ewayBill_status == "C"
          ? "Cancelled"
          : "No",
    },
    {
      headerName: "Eway Bill No",
      field: "ewaybill_no",
      sortable: true,
      filter: true,
      flex: 1,
    },
  ];

  const { r5report, r5reportLoading } = useAppSelector((state) => state.report);
  const paginationPageSize = 20;

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
      sortable: true,
    };
  }, []);

  const isEwayBillCreated = (row: RowData) => row.ewayBill_status === "Y";
  const isEwayBillCancelled = (row: RowData) => row.ewayBill_status === "C";

  return (
    <>
      <div>
        <div className="relative ag-theme-quartz h-[calc(105vh-200px)]">
          <AgGridReact
            ref={gridRef}
            loadingOverlayComponent={CustomLoadingOverlay}
            loading={r5reportLoading || getChallanLoading}
            overlayNoRowsTemplate={OverlayNoRowsTemplate}
            suppressCellFocus={true}
            rowData={r5report?.data|| []}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={false}
            paginationPageSize={paginationPageSize}
          />
        </div>
        {r5report && <CustomPagination
          currentPage={r5report?.pagination?.currentPage}
          totalPages={r5report?.pagination?.totalPages}
          totalRecords={r5report?.pagination?.totalRecords}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSize={pageSize}
        />}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem
            onClick={handleCreateEwayBill}
            disabled={
              selectedRow
                ? isEwayBillCreated(selectedRow) ||
                  isEwayBillCancelled(selectedRow)
                : false
            }
          >
            Create Eway Bill
          </MenuItem>
          <MenuItem onClick={handlePrintChallan}>Print Challan</MenuItem>
          <MenuItem
            onClick={handleCancelEwayBill}
            disabled={selectedRow ? isEwayBillCancelled(selectedRow) : false}
          >
            Cancel Eway Bill
          </MenuItem>
        </Menu>
      </div>

      <FillEwayBillSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        selectedRow={selectedRow}
      />

      <CancelEwayBillModal
        open={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleCancelConfirm}
        loading={cancelLoading}
      />
    </>
  );
};

export default R5ReportTable;
