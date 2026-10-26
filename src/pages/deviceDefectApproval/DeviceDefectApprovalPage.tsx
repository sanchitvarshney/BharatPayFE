import React, { useCallback, useEffect, useMemo, useState } from "react";
import {  useSearchParams } from "react-router-dom";
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
import { PauseCircleOutline, Refresh } from "@mui/icons-material";
import { Icons } from "@/components/icons";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import {
  DeviceDecisionStatus,
  DeviceNextAction,
  clearDecisionError,
  fetchDeviceApprovalList,
  submitDeviceApproval,
} from "@/features/deviceDefect/deviceDefectSlice";
import { isPendingStatus } from "@/pages/procurement/adminApproval/helpers";
import FqcImagePreviewModal from "@/pages/queries/fqcDeviceImage/FqcImagePreviewModal";
import DeviceImagesModal from "./DeviceImagesModal";
import { getDevicePhotos } from "./deviceDefectApproval.utils";
import { DeviceApprovalCards, DeviceApprovalTable } from "./DeviceApprovalItems";

const DeviceDefectApprovalPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const reqId = searchParams.get("req_id") || "";
  const token = searchParams.get("token") || "";

  const {
    approvalReqId,
    approvalDevices: devices,
    approvalListLoading,
    approvalListError,
    decisionLoading,
    decisionError,
  } = useAppSelector((state) => state.deviceDefect);

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [actions, setActions] = useState<Record<number, string>>({});
  const [remarks, setRemarks] = useState<Record<number, string>>({});
  const [actionErrorIds, setActionErrorIds] = useState<Set<number>>(new Set());
  const [activeId, setActiveId] = useState<number | null>(null);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const missingParams = !reqId || !token;

  const loadRequest = useCallback(() => {
    if (missingParams) return;
    dispatch(fetchDeviceApprovalList({ reqId, token }));
  }, [dispatch, reqId, token, missingParams]);

  useEffect(() => {
    loadRequest();
  }, [loadRequest]);

  const pendingDevices = useMemo(() => devices.filter((d) => isPendingStatus(d.status)), [devices]);
  const isDecided = devices.length > 0 && pendingDevices.length === 0;

  const activeDevice = useMemo(() => devices.find((d) => d.id === activeId) ?? null, [devices, activeId]);
  const activePhotos = useMemo(() => getDevicePhotos(activeDevice), [activeDevice]);

  const selectedPendingIds = useMemo(
    () => pendingDevices.filter((d) => selectedIds.has(d.id)).map((d) => d.id),
    [pendingDevices, selectedIds],
  );
  const allPendingSelected = pendingDevices.length > 0 && selectedPendingIds.length === pendingDevices.length;

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
      pendingDevices.forEach((d) => (allPendingSelected ? next.delete(d.id) : next.add(d.id)));
      return next;
    });
  }, [pendingDevices, allPendingSelected]);

  const changeRemark = useCallback((id: number, value: string) => {
    setRemarks((prev) => ({ ...prev, [id]: value }));
  }, []);

  const changeAction = useCallback((id: number, value: string) => {
    setActions((prev) => ({ ...prev, [id]: value }));
    setActionErrorIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const handleDecision = async (ids: number[], status: DeviceDecisionStatus) => {
    const targets = pendingDevices.filter((d) => ids.includes(d.id));
    if (!targets.length) return;

    if (status === "REJECTED") {
      const missing = targets.filter((d) => !actions[d.id]);
      if (missing.length) {
        setActionErrorIds(new Set(missing.map((d) => d.id)));
        return;
      }
    }
    setActionErrorIds(new Set());

    const result = await dispatch(
      submitDeviceApproval({
        reqId,
        token,
        actions: targets.map((d) => ({
          unique_key: d.key,
          status,
          next: (actions[d.id] || "") as DeviceNextAction | "",
          remark: (remarks[d.id] || "").trim(),
        })),
      }),
    );
    if (submitDeviceApproval.fulfilled.match(result)) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        targets.forEach((d) => next.delete(d.id));
        return next;
      });
    }
  };

  const itemsProps = {
    items: devices,
    selectedIds,
    activeId,
    pendingCount: pendingDevices.length,
    selectedPendingCount: selectedPendingIds.length,
    onToggle: toggleSelected,
    onToggleAll: toggleSelectAllPending,
    onShowImages: setActiveId,
    actions,
    remarks,
    actionErrorIds,
    onActionChange: changeAction,
    onRemarkChange: changeRemark,
  };

  const renderContent = () => {
    if (missingParams) return <Alert severity="error">This approval link is missing required details.</Alert>;
    if (approvalListLoading)
      return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      );
    if (approvalListError) return <Alert severity="error">{approvalListError}</Alert>;

    return (
      <>
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
            ["Request ID", approvalReqId || reqId],
            ["Total Devices", String(devices.length)],
            ["Pending", String(pendingDevices.length)],
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

        {devices.length === 0 ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            No devices found in this request.
          </Alert>
        ) : (
          <Alert severity={isDecided ? "success" : "warning"} sx={{ mb: 2 }}>
            {isDecided
              ? "All devices in this request have been decided."
              : "Click View to check device images, then select devices and approve, hold or reject them. Action (Scrap / Repair) is required for rejection."}
          </Alert>
        )}

        {isMobile ? <DeviceApprovalCards {...itemsProps} /> : <DeviceApprovalTable {...itemsProps} />}

        {!isDecided && devices.length > 0 && (
          <>
            {(decisionError || actionErrorIds.size > 0) && (
              <Alert severity="error" sx={{ mt: 2 }} onClose={decisionError ? () => dispatch(clearDecisionError()) : undefined}>
                {actionErrorIds.size > 0 ? "Select an Action (Scrap / Repair) for every device you are rejecting." : decisionError}
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
                {selectedPendingIds.length} of {pendingDevices.length} pending device{pendingDevices.length === 1 ? "" : "s"} selected
              </Typography>
              <Box sx={{ display: "flex", gap: 1.5, "& > *": { flex: { xs: 1, sm: "none" } } }}>
                <LoadingButton
                  variant="outlined"
                  color="error"
                  startIcon={<Icons.close />}
                  loading={decisionLoading === "REJECTED" && activeId === null}
                  loadingPosition="start"
                  disabled={decisionLoading !== null || selectedPendingIds.length === 0}
                  onClick={() => handleDecision(selectedPendingIds, "REJECTED")}
                >
                  Reject
                </LoadingButton>
                <LoadingButton
                  variant="outlined"
                  color="warning"
                  startIcon={<PauseCircleOutline />}
                  loading={decisionLoading === "HOLD" && activeId === null}
                  loadingPosition="start"
                  disabled={decisionLoading !== null || selectedPendingIds.length === 0}
                  onClick={() => handleDecision(selectedPendingIds, "HOLD")}
                >
                  Hold
                </LoadingButton>
                <LoadingButton
                  variant="contained"
                  color="success"
                  startIcon={<Icons.check />}
                  loading={decisionLoading === "APPROVED" && activeId === null}
                  loadingPosition="start"
                  disabled={decisionLoading !== null || selectedPendingIds.length === 0}
                  onClick={() => handleDecision(selectedPendingIds, "APPROVED")}
                >
                  Approve
                </LoadingButton>
              </Box>
            </Box>
          </>
        )}
      </>
    );
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f6fa", p: { xs: 1, sm: 2, lg: 3 } }}>
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
          <Typography variant="h5" fontWeight={600} sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }}>
            Device Quality Approval
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Refresh />}
              onClick={loadRequest}
              disabled={missingParams || approvalListLoading}
            >
              Reload
            </Button>
        
          </Box>
        </Box>

        <Card elevation={2}>
          <CardContent sx={{ p: { xs: 1.5, sm: 3 } }}>{renderContent()}</CardContent>
        </Card>
      </Box>

      <DeviceImagesModal
        open={activeDevice !== null}
        device={activeDevice}
        photos={activePhotos}
        action={activeDevice ? actions[activeDevice.id] ?? "" : ""}
        remark={activeDevice ? remarks[activeDevice.id] ?? "" : ""}
        actionError={!!activeDevice && actionErrorIds.has(activeDevice.id)}
        decisionLoading={decisionLoading}
        error={decisionError}
        onActionChange={(value) => activeDevice && changeAction(activeDevice.id, value)}
        onRemarkChange={(value) => activeDevice && changeRemark(activeDevice.id, value)}
        onDecision={(status) => activeDevice && handleDecision([activeDevice.id], status)}
        onImageClick={setPreviewIndex}
        onClose={() => {
          setActiveId(null);
          setActionErrorIds(new Set());
          dispatch(clearDecisionError());
        }}
      />

      <FqcImagePreviewModal
        open={previewIndex !== null}
        label={previewIndex !== null ? activePhotos[previewIndex]?.label ?? "" : ""}
        imageUrl={previewIndex !== null ? activePhotos[previewIndex]?.url : undefined}
        currentIndex={previewIndex ?? 0}
        total={activePhotos.length}
        onClose={() => setPreviewIndex(null)}
        onPrev={() => setPreviewIndex((i) => (i === null ? i : (i - 1 + activePhotos.length) % activePhotos.length))}
        onNext={() => setPreviewIndex((i) => (i === null ? i : (i + 1) % activePhotos.length))}
      />
    </Box>
  );
};

export default DeviceDefectApprovalPage;
