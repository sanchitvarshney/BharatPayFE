import React from "react";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Icons } from "@/components/icons";
import { CreatePoForm } from "./useCreatePoForm";

export const VendorPickDialog = React.memo<{ form: CreatePoForm }>(({ form }) => {
  const multi = form.vendorOptions.length > 1;

  return (
    <Dialog open={form.vendorPickOpen} onClose={form.skipVendorPick} maxWidth="md" fullWidth >
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Icons.user color={multi ? "warning" : "primary"} fontSize="small" />
        Select vendor for this PO
      </DialogTitle>

      <DialogContent dividers>
        <p className="text-[13px] leading-relaxed text-slate-600">
          {multi ? (
            <>
              These <b>{form.rows.length} components</b> have purchase history with{" "}
              <b>{form.vendorOptions.length} vendors</b>. Pick the one you want to raise this PO for,
              or choose <b>Select manually</b>.
            </>
          ) : (
            <>
              These <b>{form.rows.length} components</b> were last purchased from the vendor below.
              Use it to prefill the vendor details, or choose <b>Select manually</b>.
            </>
          )}
        </p>

        <TableContainer
          sx={{ my: 1.5, maxHeight: 240, border: "1px solid", borderColor: "divider", borderRadius: 1 }}
        >
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, bgcolor: "grey.50" }}>Component</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: "grey.50" }}>Vendor options</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, bgcolor: "grey.50" }}>
                  Part No
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {form.rows.map((r) => (
                <TableRow key={r.componentKey} hover>
                  <TableCell sx={{ maxWidth: 200 }}>
                    <span className="block truncate">{r.componentName || r.componentKey}</span>
                  </TableCell>
                  <TableCell>
                    {r.vendors.length === 0 ? (
                      <span className="text-slate-400">—</span>
                    ) : (
                      <div className="flex flex-wrap gap-[4px]">
                        {r.vendors.map((v) => (
                          <Chip
                            key={v.id}
                            label={v.name}
                            size="small"
                            variant={form.pickedVendorId === v.id ? "filled" : "outlined"}
                            color={form.pickedVendorId === v.id ? "primary" : "default"}
                            onClick={() => form.setPickedVendorId(v.id)}
                            sx={{ height: 20, fontSize: 11, maxWidth: "100%" }}
                          />
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell align="right" sx={{ color: "text.secondary", whiteSpace: "nowrap" }}>
                    {r.partNo || "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <FormControl fullWidth size="small">
          <InputLabel id="cpo-vendor-pick">Vendor</InputLabel>
          <Select
            labelId="cpo-vendor-pick"
            label="Vendor"
            value={form.pickedVendorId}
            onChange={(e) => form.setPickedVendorId(e.target.value)}
          >
            {form.vendorOptions.map((v) => (
              <MenuItem key={v.vendor_id} value={v.vendor_id}>
                {v.vendor_name?.trim() || v.vendor_id}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button color="inherit" onClick={form.skipVendorPick}>
          Select manually
        </Button>
        <Button variant="contained" onClick={form.confirmVendorPick} disabled={!form.pickedVendorId}>
          Use vendor
        </Button>
      </DialogActions>
    </Dialog>
  );
});
VendorPickDialog.displayName = "VendorPickDialog";
