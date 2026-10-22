import React, { memo, useMemo, useState } from "react";
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
  ComponentLog,
  ComponentMetaData,
  PurchaseRecord,
  RefreshApprovalItem,
} from "@/features/procurement/poRateService";
import {
  formatDateTime,
  formatDmy,
  formatRate,
  getStatusChip,
  isPendingStatus,
  parseDateTime,
  parseDmy,
} from "./helpers";

const byLatestPurchase = (a: PurchaseRecord, b: PurchaseRecord) =>
  parseDmy(b.purchase_date) - parseDmy(a.purchase_date);

const vendorRateKey = (record: PurchaseRecord) =>
  `${record.vendor_id}-${record.rate}`;

// Latest purchase per vendor + rate, excluding the vendor of this request
const getOtherVendors = (records: PurchaseRecord[] = []) => {
  const latest = new Map<string, PurchaseRecord & { po_count: number }>();
  [...records].sort(byLatestPurchase).forEach((record) => {
    if (record.is_current_vendor) return;
    const existing = latest.get(vendorRateKey(record));
    if (existing) existing.po_count += 1;
    else latest.set(vendorRateKey(record), { ...record, po_count: 1 });
  });
  return [...latest.values()];
};

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



type RateRequest = {
  reqId: string;
  rate: number;
  status: string;
  requestedAt?: string;
  decidedAt?: string;
  decidedBy?: string | null;
  brand?: string | null;
  specification?: string | null;
  remarks?: string | null;
};

const PAGE_SIZE = 5;

const latestTime = (request: RateRequest) =>
  Math.max(parseDateTime(request.decidedAt), parseDateTime(request.requestedAt));

// Merges the "raised" and "decided" log rows of each request into one entry
const groupLogsByRequest = (logs: ComponentLog[] = []) => {
  const requests = new Map<string, RateRequest>();
  logs.forEach((log) => {
    const entry: RateRequest = requests.get(log.req_id) ?? {
      reqId: log.req_id,
      rate: log.rate,
      status: "pending",
    };
    if (isPendingStatus(log.status)) {
      entry.requestedAt = log.date;
    } else {
      entry.status = log.status.toLowerCase();
      entry.decidedAt = log.date;
      entry.decidedBy = log.action_by_name;
      entry.remarks = log.remarks;
    }
    entry.rate = log.rate;
    entry.brand = log.brand || entry.brand;
    entry.specification = log.specification || entry.specification;
    requests.set(log.req_id, entry);
  });
  return [...requests.values()].sort((a, b) => latestTime(b) - latestTime(a));
};


const RateRequestCard: React.FC<{
  request: RateRequest;
  isCurrent: boolean;
}> = ({ request, isCurrent }) => {
  const chip = getStatusChip(request.status);
  const isPending = isPendingStatus(request.status);
  const remark = request.remarks?.trim();

  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 1,
        border: "1px solid",
        borderColor: isCurrent ? "warning.light" : "divider",
        borderLeft: "4px solid",
        borderLeftColor: statusDotColor[chip.color],
        bgcolor: isCurrent ? "#fffaf0" : "background.paper",
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.2 }}>
            ₹ {formatRate(request.rate)}
          </Typography>
          {isCurrent && (
            <Chip
              size="small"
              label="Current request"
              color="warning"
              sx={{ height: 20, fontSize: 11 }}
            />
          )}
        </Box>
        <Chip size="small" label={chip.label} color={chip.color} variant="outlined" />
      </Box>

      <Box sx={{ mt: 0.75, display: "flex", flexDirection: "column", gap: 0.25 }}>
        {request.requestedAt && (
          <Typography variant="caption" color="text.secondary">
            Requested · {formatDateTime(request.requestedAt)}
          </Typography>
        )}
        {!isPending && (
          <Typography variant="caption" color="text.secondary">
            {chip.label}
            {request.decidedBy ? ` by ${request.decidedBy}` : ""} ·{" "}
            {formatDateTime(request.decidedAt)}
          </Typography>
        )}
      </Box>

      {(request.brand || request.specification) && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 1 }}>
          {request.brand && (
            <Chip
              size="small"
              variant="outlined"
              label={`Brand: ${request.brand}`}
              sx={{ maxWidth: "100%" }}
            />
          )}
          {request.specification && (
            <Chip
              size="small"
              variant="outlined"
              label={`Spec: ${request.specification}`}
              sx={{ maxWidth: "100%" }}
            />
          )}
        </Box>
      )}

      {remark && (
        <Box
          sx={{
            mt: 1,
            px: 1.25,
            py: 0.75,
            borderRadius: 1,
            bgcolor: "#f5f6fa",
          }}
        >
          <Typography variant="caption" color="text.secondary" component="div">
            APR/REJ Remark
          </Typography>
          <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
            {remark}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

const RateTimeline: React.FC<{ meta: ComponentMetaData; reqId: string }> = ({
  meta,
  reqId,
}) => {
  const [visible, setVisible] = useState<number>(PAGE_SIZE);

  const requests = useMemo(
    () => groupLogsByRequest(meta.component_logs),
    [meta.component_logs],
  );

  return (
    <Accordion
      defaultExpanded
      disableGutters
      elevation={0}
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
          count={requests.length}
          mb={0}
        />
      </AccordionSummary>
      <AccordionDetails sx={{ px: 2, pt: 0, pb: 2 }}>
        {requests.length === 0 ? (
          <EmptyNote>No rate requests for this component yet.</EmptyNote>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {requests.slice(0, visible).map((request) => (
              <RateRequestCard
                key={request.reqId}
                request={request}
                isCurrent={request.reqId === reqId}
              />
            ))}
            {requests.length > visible && (
              <Button
                size="small"
                onClick={() => setVisible((prev) => prev + PAGE_SIZE)}
              >
                Show more ({requests.length - visible} remaining)
              </Button>
            )}
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
    () =>
      getOtherVendors(meta.other_vendors).sort(
        (a, b) => a.rate - b.rate || byLatestPurchase(a, b),
      ),
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
                key={vendorRateKey(vendor)}
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
                    Last PO {vendor.po_number} · {formatDmy(vendor.purchase_date)}
                    {vendor.po_count > 1 ? ` · ${vendor.po_count} POs at this rate` : ""}
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
  const otherVendors = getOtherVendors(meta?.other_vendors);
  const lowestOther = otherVendors.length
    ? otherVendors.reduce((min, v) => (v.rate < min.rate ? v : min))
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
