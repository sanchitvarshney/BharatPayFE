import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Icons } from "@/components/icons";
import {
  ComponentMetaData,
  fetchAdminApprovalRequest,
  getComponentMetaData,
  submitAdminApproval,
  RefreshApprovalDataResponse,
  RefreshApprovalItem,
} from "@/features/procurement/poRateService";
import { Refresh } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { setApprovalRemark } from "@/features/procurement/adminApprovalRemarkSlice";
import { ApprovalItemCards, ApprovalItemsTable } from "./adminApproval/ApprovalItems";
import ComponentMetaDrawer from "./adminApproval/ComponentMetaPanel";
import { formatDateTime, isPendingStatus } from "./adminApproval/helpers";

type DecisionStatus = "APPROVED" | "REJECTED";
type RequestInfo = Omit<RefreshApprovalDataResponse["data"], "items">;

const INVALID_LINK = "This approval link is invalid or has expired.";

const AdminApprovalPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { reqId, token } = useMemo(() => {
    const pathParams = new URLSearchParams(
      location.pathname.split("/po/adminApprovalPage/")[1] || "",
    );
    return {
      reqId: searchParams.get("req_id") || pathParams.get("req_id") || "",
      token: searchParams.get("token") || pathParams.get("token") || "",
    };
  }, [location.pathname, searchParams]);

  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [requestInfo, setRequestInfo] = useState<RequestInfo | null>(null);
  const [items, setItems] = useState<RefreshApprovalItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const dispatch = useAppDispatch();
  const reasons = useAppSelector((state) => state.adminApprovalRemark.remarks);
  const [reasonErrorIds, setReasonErrorIds] = useState<Set<number>>(new Set());
  const [submittingStatus, setSubmittingStatus] =
    useState<DecisionStatus | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [metaItems, setMetaItems] = useState<ComponentMetaData[]>([]);
  const [metaLoading, setMetaLoading] = useState<boolean>(true);
  const [metaError, setMetaError] = useState<string | null>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const loadRequest = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const response = await fetchAdminApprovalRequest(reqId, token);
      if (!response?.success || !response.data) {
        setLoadError(response?.message || INVALID_LINK);
        return;
      }
      const { items: requestItems, ...info } = response.data;
      setRequestInfo(info);
      setItems(requestItems ?? []);
    } catch (error: any) {
      setLoadError(error?.response?.data?.message || INVALID_LINK);
    } finally {
      setLoading(false);
    }
  }, [reqId, token]);

  const loadMetaData = useCallback(async () => {
    setMetaLoading(true);
    setMetaError(null);
    try {
      const response = await getComponentMetaData(reqId, token);
      if (!response?.success || !response.data) {
        setMetaError(response?.message || "Unable to load component details.");
        return;
      }
      setMetaItems(response.data.items ?? []);
    } catch (error: any) {
      setMetaError(
        error?.response?.data?.message || "Unable to load component details.",
      );
    } finally {
      setMetaLoading(false);
    }
  }, [reqId, token]);

  useEffect(() => {
    if (!reqId || !token) {
      setLoadError("This approval link is missing required details.");
      setLoading(false);
      setMetaLoading(false);
      return;
    }
    loadRequest();
    loadMetaData();
  }, [reqId, token, loadRequest, loadMetaData]);

  const pendingItems = useMemo(
    () => items.filter((item) => isPendingStatus(item.status)),
    [items],
  );
  const selectedPendingCount = useMemo(
    () => pendingItems.filter((item) => selectedIds.has(item.id)).length,
    [pendingItems, selectedIds],
  );
  const activeIndex = useMemo(
    () => items.findIndex((item) => item.component_key === activeKey),
    [items, activeKey],
  );
  const activeItem = activeIndex >= 0 ? items[activeIndex] : null;
  const activeMeta = useMemo(
    () => metaItems.find((meta) => meta.component_key === activeKey),
    [metaItems, activeKey],
  );
  const isDecided = items.length > 0 && pendingItems.length === 0;
  const allPendingSelected =
    pendingItems.length > 0 && selectedPendingCount === pendingItems.length;

  const toggleSelected = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAllPending = useCallback(() => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      pendingItems.forEach((item) =>
        allPendingSelected ? next.delete(item.id) : next.add(item.id),
      );
      return next;
    });
  }, [pendingItems, allPendingSelected]);

  const showDetails = useCallback((componentKey: string) => {
    setActiveKey(componentKey);
  }, []);
  const closeDetails = useCallback(() => setActiveKey(null), []);
  const changeReason = useCallback((id: number, value: string) => {
    dispatch(setApprovalRemark({ id, value }));
    setReasonErrorIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, [dispatch]);
  const showPrev = useCallback(() => {
    if (activeIndex > 0) setActiveKey(items[activeIndex - 1].component_key);
  }, [items, activeIndex]);
  const showNext = useCallback(() => {
    if (activeIndex < items.length - 1)
      setActiveKey(items[activeIndex + 1].component_key);
  }, [items, activeIndex]);

  const handleDecision = async (status: DecisionStatus) => {
    const targetItems = pendingItems.filter((item) => selectedIds.has(item.id));
    if (targetItems.length === 0) return;

    if (status === "REJECTED") {
      const missing = targetItems.filter((item) => !reasons[item.id]?.trim());
      if (missing.length > 0) {
        setReasonErrorIds(new Set(missing.map((item) => item.id)));
        setSubmitError("Enter a reason for every component you are rejecting.");
        return;
      }
    }

    setSubmittingStatus(status);
    setSubmitError(null);
    setReasonErrorIds(new Set());
    try {
      await submitAdminApproval(
        reqId,
        token,
        targetItems.map((item) => ({
          id: item.id,
          status,
          remarks: (reasons[item.id] || "").trim(),
        })),
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
      loadMetaData();
    } catch (error: any) {
      setSubmitError(
        error?.response?.data?.message ||
          `Unable to ${status === "APPROVED" ? "approve" : "reject"} the selected components.`,
      );
    } finally {
      setSubmittingStatus(null);
    }
  };

  const itemsProps = {
    items,
    selectedIds,
    activeKey,
    pendingCount: pendingItems.length,
    selectedPendingCount,
    onToggle: toggleSelected,
    onToggleAll: toggleSelectAllPending,
    onShowDetails: showDetails,
    reasons,
    reasonErrorIds,
    onReasonChange: changeReason,
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f6fa",
        p: { xs: 1, sm: 2, lg: 3 },
      }}
    >
      <Box sx={{ width: "100%", maxWidth: { xs: "100%", xl: 1600 }, mx: "auto" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1,
          mb: 2,
        }}
      >
        <Typography
          variant="h5"
          fontWeight={600}
          sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }}
        >
          Vendor Rate Approval
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Refresh />}
            onClick={() => window.location.reload()}
          >
            Reload
          </Button>
        </Box>
      </Box>

        <Card elevation={2}>
          <CardContent sx={{ p: { xs: 1.5, sm: 3 } }}>
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
                      : "Select the components to act on, then approve or reject them. Click a component to see its rate history and other vendors."}
                  </Alert>
                )}

                {isMobile ? (
                  <ApprovalItemCards {...itemsProps} />
                ) : (
                  <ApprovalItemsTable {...itemsProps} />
                )}

                {!isDecided && (
                  <>
                    {submitError && (
                      <Alert severity="error" sx={{ mt: 2 }}>
                        {submitError}
                      </Alert>
                    )}

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "stretch", sm: "center" },
                        justifyContent: "space-between",
                        gap: 1.5,
                        mt: 3,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {selectedPendingCount} of {pendingItems.length} pending
                        component{pendingItems.length === 1 ? "" : "s"} selected
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1.5,
                          "& > *": { flex: { xs: 1, sm: "none" } },
                        }}
                      >
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

      <ComponentMetaDrawer
        open={activeItem !== null}
        reqId={reqId}
        item={activeItem}
        meta={activeMeta}
        loading={metaLoading}
        error={metaError}
        position={{ index: activeIndex, total: items.length }}
        onClose={closeDetails}
        onPrev={showPrev}
        onNext={showNext}
      />
    </Box>
  );
};

export default AdminApprovalPage;
