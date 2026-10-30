import React, { RefObject, useCallback, useMemo, useState } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector, useAppDispatch } from "@/hooks/useReduxHook";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import {
  DescriptionOutlined,
  LocalShippingOutlined,
  OpenInNew,
  PictureAsPdfOutlined,
  ReceiptLongOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import FillEwayBillSheet from "@/components/ewayBill/FillEwayBillSheet";
import {
  printChallan,
  printPartChallan,
} from "@/features/Dispatch/DispatchSlice";
import { cancelPartCodeChallan } from "@/features/procurement/poSlices";
import { showToast } from "@/utils/toasterContext";
import FullPageLoading from "@/components/shared/FullPageLoading";
import UploadChallanDocDialog from "@/pages/ewayBill/UploadChallanDocDialog";
import { leftAlignedColumn } from "@/utils/agGridAlignUtils";

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
  challanId: string;
  isdispatch: string;
  isewaybill: string;
  deviceType: string;
  type?: string;
  itemType?: string;
  status?: string;
  productName?: string;
  materialName?: string;
  documentInvoiceNo?: string | null;
  billLinks?: (BillLink | string)[];
}

type BillLink = { filename: string; url: string };

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|bmp|svg)$/i;

const getFileName = (url: string) => {
  try {
    return decodeURIComponent(new URL(url).pathname.split("/").pop() || url);
  } catch {
    return url;
  }
};

const normalizeBillLinks = (links?: (BillLink | string)[]): BillLink[] =>
  (links ?? [])
    .map((link) =>
      typeof link === "string"
        ? { url: link, filename: getFileName(link) }
        : { url: link?.url, filename: link?.filename || getFileName(link?.url ?? "") },
    )
    .filter((link) => Boolean(link.url));

const isImageLink = (link: BillLink) =>
  IMAGE_EXT.test(link.filename) || IMAGE_EXT.test(getFileName(link.url));

type BillType = "ewb" | "inv" | "other";

const BILL_TABS: { type: BillType; label: string }[] = [
  { type: "ewb", label: "E-way Bills" },
  { type: "inv", label: "Invoices" },
  { type: "other", label: "Others" },
];

const getBillType = (link: BillLink): BillType => {
  const name = link.filename.trim().toUpperCase();
  if (name.startsWith("EWB_")) return "ewb";
  if (name.startsWith("INV_")) return "inv";
  return "other";
};

const groupBillLinks = (links: BillLink[]) =>
  links.reduce<Record<BillType, BillLink[]>>(
    (acc, link) => {
      acc[getBillType(link)].push(link);
      return acc;
    },
    { ewb: [], inv: [], other: [] },
  );

const hasEwayBill = (row: RowData | null) =>
  normalizeBillLinks(row?.billLinks).some((link) => getBillType(link) === "ewb");

type Props = {
  gridRef: RefObject<AgGridReact<RowData>>;
  challanType?: string;
};

const ChallanTable: React.FC<Props> = ({ gridRef, challanType }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);
  const [printLoading, setPrintLoading] = useState(false);
  const [uploadDocOpen, setUploadDocOpen] = useState(false);
  const [billLinksView, setBillLinksView] = useState<{
    challanId: string;
    groups: Record<BillType, BillLink[]>;
    tab: BillType;
  } | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleMenuClick = useCallback(
    (event: React.MouseEvent<HTMLElement>, rowData: RowData) => {
      setAnchorEl(event.currentTarget);
      setSelectedRow(rowData);
    },
    [],
  );

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditChallan = () => {
    if (selectedRow) {
      const txnId = selectedRow.challanId;
      const shipmentId = txnId.replace(/\//g, "_");
      navigate(`/update-challan/${shipmentId}`);
      handleMenuClose();
    }
  };

  const handleCreateDispatch = () => {
    if (selectedRow) {
      const txnId = selectedRow.challanId;
      const shipmentId = txnId.replace(/\//g, "_");
      if (selectedRow.deviceType == "wrongDevices") {
        navigate(`/dispatch/wrong-device/${shipmentId}`);
      } else {
        navigate(`/dispatch/create/${shipmentId}`);
      }
      handleMenuClose();
    }
  };

  const isPartChallanCancelled = (row: RowData | null) => {
    if (!row || challanType !== "PART") return false;
    const status = (row.status ?? "").trim().toLowerCase();
    return status === "cancel" || status === "cancelled" || status === "c" ;
  };

  const handleCancelChallan = () => {
    if (isPartChallanCancelled(selectedRow)) {
      handleMenuClose();
      return;
    }
    handleMenuClose();
    setCancelReason("");
    setCancelDialogOpen(true);
  };

  const handleConfirmCancel = () => {
    if (!cancelReason.trim() || !selectedRow) return;
    setCancelLoading(true);
    dispatch(
      cancelPartCodeChallan({
        challanId: selectedRow.challanId,
        reason: cancelReason.trim(),
      }),
    ).then((res) => {
      setCancelLoading(false);
      setCancelDialogOpen(false);
      const payload = res.payload as
        | { data?: { success?: boolean; message?: string } }
        | undefined;
      if (payload?.data?.success) {
        showToast("Challan cancelled successfully", "success");
      } else {
        showToast(
          payload?.data?.message || "Failed to cancel challan",
          "error",
        );
      }
    });
  };

  const handlePrintChallan = () => {
    if (isPartChallanCancelled(selectedRow)) {
      handleMenuClose();
      return;
    }
    if (selectedRow) {
      const txnId = selectedRow.challanId;
      const shipmentId = txnId.replace(/\//g, "/");
      const printAction =
        challanType === "PART" ? printPartChallan : printChallan;
      setPrintLoading(true);
      dispatch(printAction({ challanId: shipmentId })).then((res) => {
        setPrintLoading(false);
        const payload = res.payload as
          | { data?: { success?: boolean; data?: string } }
          | undefined;

        if (payload?.data?.success && payload.data.data) {
          window.open(payload.data.data, "_blank");
        }
      });
      handleMenuClose();
    }
  };

  // Rebuilt only when challanType changes; a new array on every render makes
  // AG Grid re-apply all columns and re-render every cell (e.g. on each keystroke
  // in the cancel dialog).
  const columnDefs = useMemo<ColDef[]>(() => {
    const isPart = challanType === "PART";
    return [
    {
      headerName: "#",
      // pinned: "right",
      sortable: false,
      filter: false,
      cellRenderer: (params: { data: RowData }) => (
        <IconButton
          size="small"
          onClick={(e) => handleMenuClick(e, params.data)}
          className="hover:bg-gray-100"
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      ),
      width: 80,
    },
    {
      headerName: "Challan ID",
      field: "challanId",
      sortable: true,
      filter: true,
      flex: 1,
      sort: "desc",
      minWidth: 190,
    },
    {
      headerName: "Quantity",
      field: "dispatchQty",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 140,
    },
    {
      headerName: "Type",
      field: "deviceType",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 140,
      valueGetter: (params: { data: RowData }) =>
        params.data.deviceType == "wrongDevices"
          ? "Wrong Device"
          : params.data.deviceType == "swipedevice"
            ? "Swipe Device"
            : params.data.deviceType == "scrapDevice"
              ? "Scrap Device"
              : "Sound Box",
    },
       ...(isPart
      ? [
          
          {
            headerName: "Material Name",
            field: "materialName",
            sortable: true,
            filter: true,
            flex: 1,
            minWidth: 200,
          },
        ]
      : []),
    ...(!isPart
      ? [
          {
            headerName: "Product Name",
            field: "productName",
            sortable: true,
            filter: true,
            flex: 1,
            minWidth: 200,
            cellRenderer: (params: { data: RowData }) => {
              return (
                <div className="flex items-center">
                  {params.data.productName===""   ? "-" : params.data.productName}
                </div>
              );
            }
          },
          {
            headerName: "Material Name",
            field: "materialName",
            sortable: true,
            filter: true,
            flex: 1,
            minWidth: 200,
            cellRenderer: (params: { data: RowData }) => {
              return (
                <div className="flex items-center">
                  {params.data.materialName===""   ? "-" : params.data.materialName}
                </div>
              );
            }
          },
          {
            headerName: "Invoice No",
            field: "documentInvoiceNo",
            sortable: true,
            filter: true,
            flex: 1,
            minWidth: 160,
            valueGetter: (params: { data: RowData }) =>
              params.data.documentInvoiceNo || "-",
          },
          {
            headerName: "Bills",
            field: "billLinks",
            sortable: false,
            filter: false,
            minWidth: 220,
            cellRenderer: (params: { data: RowData }) => {
              const groups = groupBillLinks(normalizeBillLinks(params.data.billLinks));
              const open = (tab: BillType) =>
                setBillLinksView({ challanId: params.data.challanId, groups, tab });
              if (!groups.ewb.length && !groups.inv.length && !groups.other.length) {
                return <span className="text-slate-400">-</span>;
              }
              return (
                <div className="flex flex-wrap items-center gap-1 py-1">
                  {groups.ewb.length > 0 && (
                    <Chip
                      size="small"
                      color="success"
                      variant="outlined"
                      icon={<LocalShippingOutlined />}
                      label={`E-way Bill (${groups.ewb.length})`}
                      onClick={() => open("ewb")}
                    />
                  )}
                  {groups.inv.length > 0 && (
                    <Chip
                      size="small"
                      color="primary"
                      variant="outlined"
                      icon={<ReceiptLongOutlined />}
                      label={`Invoice (${groups.inv.length})`}
                      onClick={() => open("inv")}
                    />
                  )}
                  {groups.other.length > 0 && (
                    <Chip
                      size="small"
                      variant="outlined"
                      icon={<DescriptionOutlined />}
                      label={`Other (${groups.other.length})`}
                      onClick={() => open("other")}
                    />
                  )}
                </div>
              );
            },
          },
        ]
      : []),
    {
      headerName: isPart ? "Status" : "Client",
      field: isPart ? "status" : "clientDetail.name",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: "Ship Label",
      field: "shipToDetails.shipLabel",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 160,
    },
    {
      headerName: "Ship Company",
      field: "shipToDetails.shipCompany",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 160,
    },
    {
      headerName: "Other Ref",
      field: "otherRef",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 160,
    },
    {
      headerName: "Dispatch Date",
      field: "date",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 160,
    },
    {
      headerName: "Is Dispatch",
      field: "isdispatch",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 160,
      valueGetter: (params: { data: RowData }) =>
        params.data.isdispatch == "Y" ? "Yes" : "No",
    },
    {
      headerName: "Is Eway Bill",
      field: "isewaybill",
      sortable: true,
      filter: true,
      flex: 1,
      valueGetter: (params: { data: RowData }) =>
        params.data.isewaybill == "Y"
          ? "Yes"
          : params.data.isewaybill == "C"
            ? "Cancelled"
            : "No",
      minWidth: 160,
    },
    {
      headerName: "Dispatch Date",
      field: "date",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 160,
    },
  ];
  }, [challanType, handleMenuClick]);

  const { challanList, getChallanLoading } = useAppSelector(
    (state) => state.dispatch,
  );
  const rowData = useMemo(() => challanList || [], [challanList]);
  const paginationPageSize = 20;

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
      sortable: true,
         wrapText: true,
    autoHeight: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    ...leftAlignedColumn,
    };
  }, []);

  const isDispatchCreated = (row: RowData) => row.isdispatch === "Y";

  return (
    <>
      {printLoading && <FullPageLoading />}
      <div>
        <div className="relative ag-theme-quartz h-[calc(105vh-140px)]">
          <AgGridReact
            ref={gridRef}
            loadingOverlayComponent={CustomLoadingOverlay}
            loading={getChallanLoading}
            overlayNoRowsTemplate={OverlayNoRowsTemplate}
            suppressCellFocus={true}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={paginationPageSize}
          />
        </div>
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
          {challanType !== "PART" && (
            <MenuItem
              onClick={handleEditChallan}
              disabled={selectedRow ? isDispatchCreated(selectedRow) : false}
            >
              Edit
            </MenuItem>
          )}
          {challanType !== "PART" && (
            <MenuItem
              onClick={handleCreateDispatch}
              disabled={selectedRow ? isDispatchCreated(selectedRow) : false}
            >
              Create Dispatch
            </MenuItem>
          )}
          {challanType !== "PART"  && (
            <MenuItem
              onClick={() => {
                handleMenuClose();
                setUploadDocOpen(true);
              }}
              disabled={hasEwayBill(selectedRow)}
            >
              {hasEwayBill(selectedRow) ? "E-way Bill Uploaded" : "Upload E-way Bill"}
            </MenuItem>
          )}
          {challanType === "PART" && (
            <MenuItem
              onClick={handleCancelChallan}
              disabled={isPartChallanCancelled(selectedRow)}
              sx={{ color: "error.main" }}
            >
              Cancel
            </MenuItem>
          )}
          <MenuItem
            onClick={handlePrintChallan}
            disabled={
              isPartChallanCancelled(selectedRow) ||
              (selectedRow?.isdispatch !== "Y" && challanType !== "PART")
            }
          >
            Print
          </MenuItem>
        </Menu>
      </div>

      <FillEwayBillSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        selectedRow={selectedRow}
      />

      <UploadChallanDocDialog
        open={uploadDocOpen}
        challanId={selectedRow?.challanId}
        invoiceNo={selectedRow?.documentInvoiceNo}
        onClose={() => setUploadDocOpen(false)}
      />

      {/* ── Bill Links Dialog ── */}
      <Dialog
        open={Boolean(billLinksView)}
        onClose={() => setBillLinksView(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 1, pb: 0 }}>
          Bills
          {billLinksView && <Chip size="small" label={billLinksView.challanId} />}
          <IconButton size="small" onClick={() => setBillLinksView(null)} sx={{ ml: "auto" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        {billLinksView && (
          <Tabs
            value={billLinksView.tab}
            onChange={(_, tab: BillType) => setBillLinksView({ ...billLinksView, tab })}
            sx={{ px: 2, borderBottom: 1, borderColor: "divider" }}
          >
            {BILL_TABS.filter((t) => t.type !== "other" || billLinksView.groups.other.length > 0).map((t) => (
              <Tab
                key={t.type}
                value={t.type}
                label={`${t.label} (${billLinksView.groups[t.type].length})`}
                sx={{ textTransform: "none", fontWeight: 600 }}
              />
            ))}
          </Tabs>
        )}
        <DialogContent sx={{ minHeight: 240 }}>
          {billLinksView && billLinksView.groups[billLinksView.tab].length === 0 ? (
            <div className="h-[200px] flex flex-col items-center justify-center gap-2 text-slate-400">
              <DescriptionOutlined />
              <span className="text-[13px]">
                No {BILL_TABS.find((t) => t.type === billLinksView.tab)?.label.toLowerCase()} uploaded
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {billLinksView?.groups[billLinksView.tab].map((link, index) => {
                return (
                  <div
                    key={`${link.url}-${index}`}
                    className="flex items-center gap-3 border border-neutral-200 rounded-lg p-3 hover:bg-slate-50 transition-colors"
                  >
                    {isImageLink(link) ? (
                      <img
                        src={link.url}
                        alt={link.filename}
                        className="h-[56px] w-[56px] rounded object-cover bg-neutral-100 flex-shrink-0"
                      />
                    ) : (
                      <div className="h-[56px] w-[56px] rounded bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0">
                        <PictureAsPdfOutlined />
                      </div>
                    )}
                    <p
                      className="flex-1 min-w-0 text-[13px] font-medium text-slate-700 break-all"
                      title={link.filename}
                    >
                      {link.filename}
                    </p>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<OpenInNew fontSize="small" />}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ flexShrink: 0, textTransform: "none" }}
                    >
                      Open
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="outlined" color="inherit" onClick={() => setBillLinksView(null)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Cancel Challan Dialog ── */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => {
          if (!cancelLoading) setCancelDialogOpen(false);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Cancel Challan</DialogTitle>
        <DialogContent>
          <p className="text-slate-500 text-[13px] mb-4">
            Challan ID:{" "}
            <strong className="text-slate-700">{selectedRow?.challanId}</strong>
          </p>
          <TextField
            label="Reason for Cancellation"
            required
            multiline
            rows={3}
            fullWidth
            autoFocus
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            error={cancelReason.trim() === ""}
            helperText={cancelReason.trim() === "" ? "Reason is mandatory" : ""}
            placeholder="Enter reason for cancellation..."
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            variant="outlined"
            color="inherit"
            disabled={cancelLoading}
            onClick={() => setCancelDialogOpen(false)}
          >
            Close
          </Button>
          <LoadingButton
            loading={cancelLoading}
            variant="contained"
            color="error"
            disabled={!cancelReason.trim()}
            onClick={handleConfirmCancel}
          >
            Confirm Cancel
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChallanTable;
