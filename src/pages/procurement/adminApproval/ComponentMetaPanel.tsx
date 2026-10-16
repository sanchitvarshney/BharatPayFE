import React, { memo, useMemo } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HistoryIcon from "@mui/icons-material/History";
import StorefrontIcon from "@mui/icons-material/Storefront";
import {
  ComponentMetaData,
  RefreshApprovalItem,
} from "@/features/procurement/poRateService";
import {
  formatDateTime,
  formatRate,
  getStatusChip,
  isPendingStatus,
} from "./helpers";

type Props = {
  open: boolean;
  reqId: string;
  item: RefreshApprovalItem | null;
  meta: ComponentMetaData | undefined;
  loading: boolean;
  error: string | null;
  position: { index: number; total: number };
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

const statusDotColor: Record<string, string> = {
  success: "success.main",
  error: "error.main",
  warning: "warning.main",
};

const SectionHeader: React.FC<{
  icon: React.ReactNode;
  title: string;
  count: number;
  mb?: number;
}> = ({ icon, title, count, mb = 1.5 }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb }}>
    <Box sx={{ color: "primary.main", display: "flex" }}>{icon}</Box>
    <Typography variant="subtitle2" fontWeight={600}>
      {title}
    </Typography>
    <Chip size="small" label={count} sx={{ height: 20, fontSize: 11 }} />
  </Box>
);

const EmptyNote: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box
    sx={{
      p: 2,
      borderRadius: 1,
      border: "1px dashed",
      borderColor: "divider",
      textAlign: "center",
    }}
  >
    <Typography variant="body2" color="text.secondary">
      {children}
    </Typography>
  </Box>
);



const RateTimeline: React.FC<{ meta: ComponentMetaData; reqId: string }> = ({
  meta,
  reqId,
}) => {
  const logs = useMemo(
    () =>
      meta.component_logs
        .filter((log) => !isPendingStatus(log.status))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [meta.component_logs],
  );

  return (
    <Accordion
      disableGutters
      elevation={0}
      slotProps={{ transition: { unmountOnExit: true } }}
      sx={{
        mb: 2,
        borderRadius: 1,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2 }}>
        <SectionHeader
          icon={<HistoryIcon fontSize="small" />}
          title="Rate History"
          count={logs.length}
          mb={0}
        />
      </AccordionSummary>
      <AccordionDetails sx={{ px: 2, pt: 0, pb: 2 }}>
      {logs.length === 0 ? (
        <EmptyNote>No approved or rejected rates yet.</EmptyNote>
      ) : (
        <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0 }}>
          {logs.map((log, index) => {
            const chip = getStatusChip(log.status);
            const isLast = index === logs.length - 1;
            return (
              <Box
                component="li"
                key={`${log.req_id}-${log.date}-${index}`}
                sx={{ display: "flex", gap: 1.5 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    pt: 0.75,
                  }}
                >
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: statusDotColor[chip.color],
                      flexShrink: 0,
                    }}
                  />
                  {!isLast && (
                    <Box sx={{ width: 2, flex: 1, bgcolor: "divider", my: 0.5 }} />
                  )}
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    pb: isLast ? 0 : 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 1,
                    }}
                  >
                    <Typography variant="body2" fontWeight={700}>
                      ₹ {formatRate(log.rate)}
                    </Typography>
                    <Chip size="small" label={chip.label} color={chip.color} variant="outlined" />
                  </Box>
                  <Typography variant="caption" color="text.secondary" component="div">
                    {formatDateTime(log.date)}
                    {log.action_by_name ? ` · by ${log.action_by_name}` : ""}
                  </Typography>
                  {log.req_id === reqId && (
                    <Chip
                      size="small"
                      label="This request"
                      color="warning"
                      sx={{ mt: 0.5, height: 18, fontSize: 10 }}
                    />
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
      </AccordionDetails>
    </Accordion>
  );
};

const OtherVendors: React.FC<{
  meta: ComponentMetaData;
}> = ({ meta }) => {
  const vendors = useMemo(
    () => [...meta.other_vendors].sort((a, b) => a.rate - b.rate),
    [meta.other_vendors],
  );

  return (
    <>
      <SectionHeader
        icon={<StorefrontIcon fontSize="small" />}
        title="Other Vendors"
        count={vendors.length}
      />
      {vendors.length === 0 ? (
        <EmptyNote>No other vendor supplies this component.</EmptyNote>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {vendors.map((vendor) => {
        
           
            return (
              <Box
                key={vendor.vendor_id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor:  "divider",
                  bgcolor: "background.paper",
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={600} noWrap>
                    {vendor.vendor_name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" component="div">
                    {vendor.vendor_id} · Last updated {formatDateTime(vendor.updated_date)}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                  <Typography variant="body2" fontWeight={700}>
                    ₹ {formatRate(vendor.rate)}
                  </Typography>
          
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </>
  );
};

const ComponentMetaDrawer: React.FC<Props> = ({
  open,
  reqId,
  item,
  meta,
  loading,
  error,
  position,
  onClose,
  onPrev,
  onNext,
}) => {
  const requestedRate = Number(item?.requested_rate ?? 0);
  const lowestOther = meta?.other_vendors.length
    ? meta.other_vendors.reduce((min, v) => (v.rate < min.rate ? v : min))
    : undefined;
  const statusChip = getStatusChip(item?.status);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 480, md: 560 },
          display: "flex",
          flexDirection: "column",
          bgcolor: "#f8f9fc",
        },
      }}
    >
      {item && (
        <>
          <Box
            sx={{
              px: 2.5,
              py: 2,
              bgcolor: "background.paper",
              borderBottom: "1px solid",
              borderColor: "divider",
              display: "flex",
              alignItems: "flex-start",
              gap: 1,
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
           
              <Typography variant="h6" fontWeight={600} sx={{ lineHeight: 1.3, wordBreak: "break-word" }}>
                {item.component_name?.trim()}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                <Typography variant="body2" color="text.secondary">
                  {item.part_code}
                </Typography>
                <Chip size="small" label={statusChip.label} color={statusChip.color} />
              </Box>
            </Box>
            <IconButton onClick={onClose} aria-label="Close">
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ flex: 1, overflowY: "auto", p: 2.5 }}>
          

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress size={28} />
              </Box>
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : !meta ? (
              <Alert severity="info">No details available for this component.</Alert>
            ) : (
              <>
                {lowestOther && lowestOther.rate < requestedRate && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    {lowestOther.vendor_name} supplies this component at ₹{" "}
                    {formatRate(lowestOther.rate)}, ₹{" "}
                    {formatRate(requestedRate - lowestOther.rate)} less than the
                    requested rate.
                  </Alert>
                )}
                <RateTimeline key={item.part_code} meta={meta} reqId={reqId} />
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <OtherVendors meta={meta}  />
                </Box>
              </>
            )}
          </Box>

          <Divider />
          <Box
            sx={{
              px: 2.5,
              py: 1.5,
              bgcolor: "background.paper",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              size="small"
              startIcon={<ChevronLeftIcon />}
              disabled={position.index === 0}
              onClick={onPrev}
            >
              Previous
            </Button>
            <Button
              size="small"
              endIcon={<ChevronRightIcon />}
              disabled={position.index >= position.total - 1}
              onClick={onNext}
            >
              Next
            </Button>
          </Box>
        </>
      )}
    </Drawer>
  );
};

export default memo(ComponentMetaDrawer);
