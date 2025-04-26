import MaterialRequestApprovalDrawer from "@/components/Drawers/wearhouse/MaterialRequestApprovalDrawer";
import { crearLocation, getLocationAsync } from "@/features/wearhouse/Divicemin/devaiceMinSlice";
import { clearItemdetail, getPendingSwipeDeviceListsync, materialRequestCancel } from "@/features/wearhouse/MaterialApproval/MrApprovalSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";

import { LoadingButton } from "@mui/lab";

import { showToast } from "@/utils/toasterContext";
import PendingSwipeApprovalTable from "@/table/wearhouse/PendingSwipeApprovalTable";
import MaterialRequestSwipeApprovalDrawer from "@/components/Drawers/wearhouse/MaterialRequestSwipeApprovalDrawer";

const SwipeMaterialApproval: React.FC = () => {
  const [approve, setApprove] = useState<boolean>(false);
  const [alert, setAlert] = useState<boolean>(false);
  const [approved, setApproved] = useState<string[] | null>(null);
  const [requestType, setRequestType] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");
  const { cancelItemLoading } = useAppSelector((state) => state.pendingMr);
  const [txnId, setTxnId] = useState<string>("");

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getPendingSwipeDeviceListsync());
  }, []);
  useEffect(() => {
    dispatch(clearItemdetail());
    if (!approve) {
      dispatch(crearLocation());
    } else {
      dispatch(getLocationAsync(null));
    }
  }, [approve]);
  return (
    <>
      <Dialog
        open={alert}
        onClose={() => setAlert(false)}
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const remark = formJson.remark;

            if (remark) {
              dispatch(materialRequestCancel({ remarks: remarks, txnID: txnId })).then((res: any) => {
                if (res.payload.data?.success) {
                  setRemarks("");
                  setTxnId("");
                  setAlert(false);
                  dispatch(getPendingSwipeDeviceListsync());
                }
              });
            } else {
              showToast("Please Enter Remarks", "error");
            }
          },
        }}
      >
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent sx={{ width: "600px" }}>
          <DialogContentText>do you want to cancel the material request?</DialogContentText>
          <TextField autoComplete="off" autoFocus margin="dense" id="name" name="remark" label="Remark (required)" fullWidth variant="standard" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAlert(false)}>No</Button>
          <LoadingButton loading={cancelItemLoading} type="submit" variant="contained" color="error">
            Yes
          </LoadingButton>
        </DialogActions>
      </Dialog>
      {requestType === "DEVICE" ? (
        <MaterialRequestSwipeApprovalDrawer approved={approved} setApproved={setApproved} open={approve} setOpen={setApprove} alert={alert} setAlert={setAlert} />
      ) : (
        <MaterialRequestApprovalDrawer approved={approved} setApproved={setApproved} open={approve} setOpen={setApprove} alert={alert} setAlert={setAlert} />
      )}
      <div className="h-[calc(100vh-100px)] overflow-y-auto">
        <PendingSwipeApprovalTable setxnId={setTxnId} setRequestType={setRequestType} approve={approve} setApprove={setApprove} setAlert={setAlert} />
      </div>
    </>
  );
};

export default SwipeMaterialApproval;
