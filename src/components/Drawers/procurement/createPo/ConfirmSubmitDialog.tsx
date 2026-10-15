import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Icons } from "@/components/icons";
import { money } from "./helpers";
import { CreatePoForm } from "./useCreatePoForm";

export const ConfirmSubmitDialog = React.memo<{ form: CreatePoForm }>(({ form }) => (
  <Dialog open={form.confirmOpen} maxWidth="xs" fullWidth>
    <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Icons.checklist color="primary" fontSize="small" />
      Confirm purchase order
    </DialogTitle>
    <DialogContent>
      <DialogContentText>
        Create this PO for <b>{form.vendor?.text || "the selected vendor"}</b> with{" "}
        <b>{form.rows.length}</b> component{form.rows.length === 1 ? "" : "s"} (grand total{" "}
        <b>{money(form.grandTotal)}</b>)? Please make sure all details are verified.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button color="inherit" onClick={form.closeConfirm} disabled={form.loading}>
        Back
      </Button>
      <LoadingButton
        variant="contained"
        startIcon={<Icons.save fontSize="small" />}
        loading={form.loading}
        loadingPosition="start"
        onClick={form.handleSubmit}
      >
        Confirm & Create PO
      </LoadingButton>
    </DialogActions>
  </Dialog>
));
ConfirmSubmitDialog.displayName = "ConfirmSubmitDialog";
