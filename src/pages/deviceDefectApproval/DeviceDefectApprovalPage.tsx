import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Alert, Box, Button, Chip, CircularProgress, Typography } from "@mui/material";
import { Refresh } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import {
  DeviceApprovalItem,
  DeviceDecisionStatus,
  DeviceNextAction,
  clearDecisionError,
  fetchDeviceApprovalList,
  submitDeviceApproval,
} from "@/features/deviceDefect/deviceDefectSlice";
import FqcImagePreviewModal from "@/pages/queries/fqcDeviceImage/FqcImagePreviewModal";
import { getDevicePhotos } from "./deviceDefectApproval.utils";
import DeviceApprovalCard from "./DeviceApprovalItems";

const DeviceDefectApprovalPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();

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

  const [actions, setActions] = useState<Record<number, string>>({});
  const [remarks, setRemarks] = useState<Record<number, string>>({});
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const [preview, setPreview] = useState<{ deviceId: number; index: number } | null>(null);

  const missingParams = !reqId || !token;

  const loadRequest = useCallback(() => {
    if (missingParams) return;
    dispatch(fetchDeviceApprovalList({ reqId, token }));
  }, [dispatch, reqId, token, missingParams]);

  useEffect(() => {
    loadRequest();
  }, [loadRequest]);

  const previewPhotos = useMemo(
    () => getDevicePhotos(devices.find((d) => d.id === preview?.deviceId)),
    [devices, preview?.deviceId],
  );

  const handleDecision = async (device: DeviceApprovalItem, status: DeviceDecisionStatus) => {
    // reject dialog only enables confirm once Scrap / Repair is picked
    if (status === "REJECTED" && !actions[device.id]) return;
    setSubmittingId(device.id);
    await dispatch(
      submitDeviceApproval({
        reqId,
        token,
        actions: [
          {
            unique_key: device.key,
            status,
            next: (actions[device.id] || "") as DeviceNextAction | "",
            remark: (remarks[device.id] || "").trim(),
          },
        ],
      }),
    );
    setSubmittingId(null);
  };

  const renderContent = () => {
    if (missingParams) return <Alert severity="error">This approval link is missing required details.</Alert>;
    if (approvalListLoading)
      return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress />
        </Box>
      );
    if (approvalListError) return <Alert severity="error">{approvalListError}</Alert>;
    if (devices.length === 0) return <Alert severity="info">No device found in this request.</Alert>;

    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {devices.map((device) => (
          <DeviceApprovalCard
            key={device.id}
            item={device}
            photos={getDevicePhotos(device)}
            action={actions[device.id] ?? ""}
            remark={remarks[device.id] ?? ""}
            submitting={submittingId === device.id ? decisionLoading : null}
            disabled={decisionLoading !== null}
            error={submittingId === null || submittingId === device.id ? decisionError : null}
            onActionChange={(value) => setActions((prev) => ({ ...prev, [device.id]: value }))}
            onRemarkChange={(value) => setRemarks((prev) => ({ ...prev, [device.id]: value }))}
            onDecision={(status) => handleDecision(device, status)}
            onImageClick={(index) => setPreview({ deviceId: device.id, index })}
            onClearError={() => dispatch(clearDecisionError())}
          />
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f6fa", p: { xs: 1.5, sm: 2, lg: 3 } }}>
      <Box sx={{ width: "100%", maxWidth: 1280, mx: "auto" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1.5,
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
              Device Quality Approval
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Review the device images, then approve, hold or reject.
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {(approvalReqId || reqId) && (
              <Chip label={`Request ID: ${approvalReqId || reqId}`} variant="outlined" sx={{ fontWeight: 600, bgcolor: "#fff" }} />
            )}
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={loadRequest}
              disabled={missingParams || approvalListLoading}
              sx={{ bgcolor: "#fff" }}
            >
              Reload
            </Button>
          </Box>
        </Box>

        {renderContent()}
      </Box>

      <FqcImagePreviewModal
        open={preview !== null}
        label={preview ? previewPhotos[preview.index]?.label ?? "" : ""}
        imageUrl={preview ? previewPhotos[preview.index]?.url : undefined}
        currentIndex={preview?.index ?? 0}
        total={previewPhotos.length}
        onClose={() => setPreview(null)}
        onPrev={() =>
          setPreview((p) => p && { ...p, index: (p.index - 1 + previewPhotos.length) % previewPhotos.length })
        }
        onNext={() => setPreview((p) => p && { ...p, index: (p.index + 1) % previewPhotos.length })}
      />
    </Box>
  );
};

export default DeviceDefectApprovalPage;
