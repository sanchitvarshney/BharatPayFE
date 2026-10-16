import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import dayjs from "dayjs";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Icons } from "@/components/icons";
import {
  fetchAdminApprovalRequest,
  submitAdminApproval,
  RefreshApprovalDataResponse,
  RefreshApprovalItem,
} from "@/features/procurement/poRateService";
import { Refresh } from "@mui/icons-material";

type DecisionStatus = "APPROVED" | "REJECTED";
type RequestInfo = Omit<RefreshApprovalDataResponse["data"], "items">;

const formatDateTime = (value?: string | null) =>
  value ? dayjs(value).format("DD MMM YYYY, hh:mm A") : "--";

const formatRate = (value: string) => {
  const num = Number(value);
  return Number.isNaN(num)
    ? value
    : num.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      });
};

const statusChip: Record<
  string,
  { label: string; color: "warning" | "success" | "error" }
> = {
  APPROVED: { label: "Approved", color: "success" },
  REJECTED: { label: "Rejected", color: "error" },
  PENDING: { label: "Pending", color: "warning" },
};

const AdminApprovalPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const pathParams = new URLSearchParams(
    location.pathname.split("/po/adminApprovalPage/")[1] || "",
  );
  const reqId = searchParams.get("req_id") || pathParams.get("req_id") || "";
  const token = searchParams.get("token") || pathParams.get("token") || "";

  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [requestInfo, setRequestInfo] = useState<RequestInfo | null>(null);
  const [items, setItems] = useState<RefreshApprovalItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [remarks, setRemarks] = useState<string>("");
  const [submittingStatus, setSubmittingStatus] =
    useState<DecisionStatus | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const loadRequest = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const response = await fetchAdminApprovalRequest(reqId, token);
      if (!response?.success || !response.data) {
        setLoadError(
          response?.message || "This approval link is invalid or has expired.",
        );
        return;
      }
      const { items: requestItems, ...info } = response.data;
      setRequestInfo(info);
      setItems(requestItems ?? []);
    } catch (error: any) {
      setLoadError(
        error?.response?.data?.message ||
          "This approval link is invalid or has expired.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!reqId || !token) {
      setLoadError("This approval link is missing required details.");
      setLoading(false);
      return;
    }
    loadRequest();
  }, []);

  const pendingItems = items.filter(
    (item) => item.status.toUpperCase() === "PENDING",
  );
  const isDecided = items.length > 0 && pendingItems.length === 0;
  const selectedPendingCount = pendingItems.filter((item) =>
    selectedIds.has(item.id),
  ).length;
  const allPendingSelected =
    pendingItems.length > 0 && selectedPendingCount === pendingItems.length;

  const toggleSelected = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAllPending = () => {
    setSelectedIds((prev) => {
      if (allPendingSelected) {
        const next = new Set(prev);
        pendingItems.forEach((item) => next.delete(item.id));
        return next;
      }
      const next = new Set(prev);
      pendingItems.forEach((item) => next.add(item.id));
      return next;
    });
  };

  const handleDecision = async (status: DecisionStatus) => {
    const targetItems = items.filter(
      (item) =>
        selectedIds.has(item.id) && item.status.toUpperCase() === "PENDING",
    );
    if (targetItems.length === 0) return;

    setSubmittingStatus(status);
    setSubmitError(null);
    try {
      await submitAdminApproval(
        reqId,
        token,
        targetItems.map((item) => ({ id: item.id, status })),
        remarks,
      );
      const decidedIds = new Set(targetItems.map((item) => item.id));
      setItems((prev) =>
        prev.map((item) =>
          decidedIds.has(item.id) ? { ...item, status } : item,
        ),
      );
      setSelectedIds((prev) => {
        const next = new Set(prev);
        decidedIds.forEach((id) => next.delete(id));
        return next;
      });
    } catch (error: any) {
      setSubmitError(
        error?.response?.data?.message ||
          `Unable to ${status === "APPROVED" ? "approve" : "reject"} the selected components.`,
      );
    } finally {
      setSubmittingStatus(null);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f6fa",
        display: "flex",
        justifyContent: "center",
        p: { xs: 2, sm: 4 },
      }}
    >
      <Card
        sx={{
          maxWidth: "80%",
        
          width: "100%",
          height: "fit-content",
          mt: { sm: 4 },
        }}
        elevation={2}
      >
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
              mb: 1,
            }}
          >
            <Typography variant="h5" fontWeight={600}>
              Vendor Rate Approval
            </Typography>
            <div className="flex gap-2">
              <Button
                variant="outlined"
                size="small"
                startIcon={<Refresh />}
                onClick={() => window.location.reload()}
              >
                Reload
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<HomeIcon />}
                onClick={() => navigate("/")}
              >
                Home
              </Button>
            </div>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress />
            </Box>
          ) : loadError ? (
            <Alert severity="error">{loadError}</Alert>
          ) : (
            <>
              {requestInfo && (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
                    gap: 1.5,
                    p: 2,
                    mb: 2,
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "#fafafa",
                  }}
                >
                  {[
                    ["Vendor", requestInfo.vendor_name],
                    ["Requested By", requestInfo.requested_by],
                    ["Requested On", formatDateTime(requestInfo.created_at)],
                  ].map(([label, value]) => (
                    <Box key={label}>
                      <Typography variant="caption" color="text.secondary">
                        {label}
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {value || "--"}
                      </Typography>
                    </Box>
                  ))}
               
                </Box>
              )}

              {items.length === 0 ? (
                <Alert severity="info" sx={{ mb: 2 }}>
                  No components found in this request.
                </Alert>
              ) : (
                <Alert
                  severity={isDecided ? "success" : "warning"}
                  sx={{ mb: 2 }}
                >
                  {isDecided
                    ? "All components in this request have been decided."
                    : "Select the components to act on, then approve or reject them. You can approve some and reject others."}
                </Alert>
              )}

              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={
                          selectedPendingCount > 0 && !allPendingSelected
                        }
                        checked={allPendingSelected}
                        disabled={pendingItems.length === 0}
                        onChange={toggleSelectAllPending}
                      />
                    </TableCell>
                    <TableCell>#</TableCell>
                    <TableCell>Component</TableCell>
                    <TableCell>Part Code</TableCell>
                    <TableCell align="right">Current Rate</TableCell>
                    <TableCell align="right">Requested Rate</TableCell>
                    <TableCell align="right">Difference</TableCell>
                    <TableCell align="center">Status</TableCell>
                     <TableCell>Remark</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item, index) => {
                    const chip =
                      statusChip[item.status.toUpperCase()] ||
                      statusChip.PENDING;
                    const isPending = item.status.toUpperCase() === "PENDING";
                    return (
                      <TableRow
                        key={item.id}
                        selected={selectedIds.has(item.id)}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedIds.has(item.id)}
                            disabled={!isPending}
                            onChange={() => toggleSelected(item.id)}
                          />
                        </TableCell>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          {item.component_name?.trim()}
                          {item.is_new_pair === 1 && (
                            <Chip
                              size="small"
                              label="New"
                              color="info"
                              variant="outlined"
                              sx={{ ml: 1, height: 20 }}
                            />
                          )}
                        </TableCell>
                        <TableCell>{item.part_code}</TableCell>
                        <TableCell align="right">
                          {formatRate(item.current_rate)}
                        </TableCell>
                        <TableCell align="right">
                          {formatRate(item.requested_rate)}
                        </TableCell>
                        <TableCell align="right" sx={{ color: "error.main" }}>
                          +
                          {(Number(item.requested_rate) - Number(item.current_rate)).toFixed(2)}
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            size="small"
                            label={chip.label}
                            color={chip.color}
                          />
                        </TableCell>
                        <TableCell>{item.remarks}</TableCell>
                      </TableRow>
                      
                    );
                  })}
                </TableBody>
              </Table>

              {!isDecided && (
                <>
                  <TextField
                    label="Remarks (optional)"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    fullWidth
                    multiline
                    minRows={2}
                    sx={{ mt: 3 }}
                  />

                  {submitError && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {submitError}
                    </Alert>
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 1.5,
                      mt: 3,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {selectedPendingCount} of {pendingItems.length} pending
                      component{pendingItems.length === 1 ? "" : "s"} selected
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1.5 }}>
                      <LoadingButton
                        variant="outlined"
                        color="error"
                        startIcon={<Icons.close />}
                        loading={submittingStatus === "REJECTED"}
                        loadingPosition="start"
                        disabled={
                          submittingStatus !== null ||
                          selectedPendingCount === 0
                        }
                        onClick={() => handleDecision("REJECTED")}
                      >
                        Reject Selected
                      </LoadingButton>
                      <LoadingButton
                        variant="contained"
                        color="success"
                        startIcon={<Icons.check />}
                        loading={submittingStatus === "APPROVED"}
                        loadingPosition="start"
                        disabled={
                          submittingStatus !== null ||
                          selectedPendingCount === 0
                        }
                        onClick={() => handleDecision("APPROVED")}
                      >
                        Approve Selected
                      </LoadingButton>
                    </Box>
                  </Box>
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminApprovalPage;
