import React, { useEffect, useState } from "react";
import {
  Alert,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Icons } from "@/components/icons";
import { showToast } from "@/utils/toasterContext";
import {
  refreshApprovalData,
  requestPriceApproval,
  RateApprovalItem,
  RateApprovalStatus,
} from "@/features/procurement/poRateService";

type Props = {
  open: boolean;
  items: RateApprovalItem[];
  vendorId: string;
  submitting?: boolean;
  onClose: () => void; 
  onSubmit: () => void;
  onRatesApproved: (
    approvedRates: { componentKey: string; rate: number }[],
  ) => void; 
};

const statusChip: Record<
  RateApprovalStatus,
  { label: string; color: "warning" | "success" | "error" }
> = {
  pending: { label: "Pending", color: "warning" },
  approved: { label: "Approved", color: "success" },
  rejected: { label: "Rejected", color: "error" },
};

const toStatus = (raw: string): RateApprovalStatus => {
  const normalized = raw?.toLowerCase();
  if (normalized === "approved" || normalized === "rejected") return normalized;
  return "pending";
};

const RateApprovalDialog: React.FC<Props> = ({
  open,
  items,
  vendorId,
  submitting,
  onClose,
  onRatesApproved,
}) => {
  const [statuses, setStatuses] = useState<Record<string, RateApprovalStatus>>(
    {},
  );
  const [reqId, setReqId] = useState<string | null>(null);
  const [requesting, setRequesting] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [remarks, setRemarks] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setStatuses({});
      setRemarks({});
      setReqId(null);
      setRequesting(false);
      setRefreshing(false);
    }
  }, [open]);

  const getStatus = (id: string): RateApprovalStatus =>
    statuses[id] ?? "pending";
  const allApproved =
    items.length > 0 &&
    items.every((item) => getStatus(item.id) === "approved");
  const hasRejected = items.some((item) => getStatus(item.id) === "rejected");

  const handleRequestApproval = async () => {
    setRequesting(true);
    try {
      const response = await requestPriceApproval(vendorId, items, remarks);
      setReqId(response.req_id);
      showToast(response.message || "Approval request sent", "success");
    } catch (error) {
      console.error("Error requesting rate approval:", error);
      showToast("Unable to request rate approval", "error");
    } finally {
      setRequesting(false);
    }
  };

  const handleRefresh = async () => {
    if (!reqId) return;
    setRefreshing(true);
    try {
      const response = await refreshApprovalData(reqId);
      if (response.success) {
        showToast(response.message || "Approval status refreshed", "success");
        const responseItems = response.data.items;

        const newStatuses: Record<string, RateApprovalStatus> = {};
        items.forEach((item) => {
          const match = responseItems.find(
            (i) => i.component_key === item.componentKey,
          );
          newStatuses[item.id] = match
            ? toStatus(match.status)
            : getStatus(item.id);
        });
        setStatuses(newStatuses);

        const allNowApproved =
          items.length > 0 &&
          items.every((item) => newStatuses[item.id] === "approved");
        if (allNowApproved) {
          const approvedRates = responseItems.map((i) => ({
            componentKey: i.component_key,
            rate: Number(i.requested_rate),
          }));
          onRatesApproved(approvedRates);
        }
      }
    } catch (error) {
      showToast("Unable to fetch approval status", "error");
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {}}
      disableEscapeKeyDown
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Rate Approval Required</DialogTitle>
      <DialogContent dividers>
        <Alert
          severity={allApproved ? "success" : hasRejected ? "error" : "warning"}
          sx={{ mb: 2 }}
        >
          {allApproved
            ? "All rates are approved. You can submit the PO now."
            : hasRejected
              ? "Some rates were rejected by the admin. Close and correct the rates."
              : reqId
                ? "Waiting for admin approval. Click Refresh to check the latest status."
                : "The rates below are higher than the vendor's initial rate. Click Request Approval to notify the admin. "}{" "}
          Don't Refresh until the admin approves.
        </Alert>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Component</TableCell>
              <TableCell align="right">Initial Rate</TableCell>
              <TableCell align="right">Entered Rate</TableCell>
              <TableCell align="right">Difference</TableCell>

              <TableCell align="center">Status</TableCell>
              <TableCell>Remark</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => {
              const chip = statusChip[getStatus(item.id)];
              return (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.componentLabel}</TableCell>
                  <TableCell align="right">{item.initialRate}</TableCell>
                  <TableCell align="right">{item.enteredRate}</TableCell>
                  <TableCell align="right" sx={{ color: "error.main" }}>
                    +{(item.enteredRate - item.initialRate).toFixed(2)}
                  </TableCell>

                  <TableCell align="center">
                    <Chip size="small" label={chip.label} color={chip.color} />
                  </TableCell>
                  <TableCell sx={{ minWidth: 180 }}>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Optional"
                      value={remarks[item.id] ?? ""}
                      disabled={!!reqId || requesting}
                      onChange={(e) =>
                        setRemarks((prev) => ({
                          ...prev,
                          [item.id]: e.target.value,
                        }))
                      }
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 1.5, gap: 1 }}>
        <LoadingButton
          variant="contained"
          sx={{ background: "white", color: "red", mr: "auto" }}
          startIcon={<Icons.close />}
          disabled={refreshing || requesting || submitting || allApproved}
          onClick={onClose}
        >
          Close
        </LoadingButton>
        <LoadingButton
          variant="outlined"
          loading={requesting}
          loadingPosition="start"
          disabled={
            requesting || !!reqId || submitting || allApproved || hasRejected
          }
          onClick={handleRequestApproval}
        >
          Request Approval
        </LoadingButton>
        <LoadingButton
          variant="outlined"
          startIcon={<Icons.refreshv2 />}
          loading={refreshing}
          loadingPosition="start"
          disabled={!reqId || submitting || allApproved}
          onClick={handleRefresh}
        >
          Refresh
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default RateApprovalDialog;
