import MaterialRequestApprovalDrawer from "@/components/Drawers/wearhouse/MaterialRequestApprovalDrawer";
import MaterialRequestDeviceApprovalDrawer from "@/components/Drawers/wearhouse/MaterialRequestDeviceApprovalDrawer";
import { crearLocation, getLocationAsync } from "@/features/wearhouse/Divicemin/devaiceMinSlice";
import { clearItemdetail, getPendingMaterialListsync, materialRequestCancel } from "@/features/wearhouse/MaterialApproval/MrApprovalSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import PendingMrApprovalTable from "@/table/wearhouse/PendingMrApprovalTable";
import React, { useEffect, useState } from "react";
import { AlertDialog,  AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { CustomButton } from "@/components/reusable/CustomButton";
import { showToast } from "@/utils/toastUtils";
const MaterialApproval: React.FC = () => {
  const [approve, setApprove] = useState<boolean>(false);
  const [alert, setAlert] = useState<boolean>(false);
  const [approved, setApproved] = useState<string[] | null>(null);
  const [requestType, setRequestType] = useState<string>("");
  const [remarks,setRemarks] = useState<string>("")
  const {cancelItemLoading} = useAppSelector(state=>state.pendingMr)
  const [txnId,setTxnId] = useState<string>("")
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getPendingMaterialListsync());
  }, []);
  useEffect(() => {
    dispatch(clearItemdetail());
    if(!approve){
      dispatch(crearLocation())
      
    }else{
      dispatch(getLocationAsync(null));
    }
  }, [approve]);
  return (
    <>
     <AlertDialog open={alert} onOpenChange={setAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-600">Do you Want to Cancel the Material Request?</AlertDialogTitle>
          </AlertDialogHeader>
          <div>
            <Textarea placeholder="Remarks" className="resize-none" onChange={(e) => setRemarks(e.target.value)} />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            {/* <AlertDialogAction className="bg-red-500 hover:bg-red-600">Yes</AlertDialogAction> */}
            <CustomButton
              loading={cancelItemLoading}
              className="bg-red-500 hover:bg-red-600"
              onClick={(e) => {
                e.preventDefault();
               if(remarks){
                dispatch(materialRequestCancel({ remarks: remarks, txnID:txnId})).then((res:any)=>{
                  if( res.payload.data?.success){
                    setRemarks("")
                   setTxnId("")
                   setAlert(false)
                   dispatch(getPendingMaterialListsync());
                  }
               })
               }else{
                  showToast({
                    description: "Please Enter Remarks",
                    variant: "destructive",
                  })
               }
               
              }}
            >
              Yes
            </CustomButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {requestType === "DEVICE" ? (
        <MaterialRequestDeviceApprovalDrawer approved={approved} setApproved={setApproved} open={approve} setOpen={setApprove} alert={alert} setAlert={setAlert} />
      ) : (
        <MaterialRequestApprovalDrawer approved={approved} setApproved={setApproved} open={approve} setOpen={setApprove} alert={alert} setAlert={setAlert} />
      )}
      <div className="h-[calc(100vh-100px)] overflow-y-auto">
        <PendingMrApprovalTable setxnId={setTxnId} setRequestType={setRequestType} approve={approve} setApprove={setApprove} setAlert={setAlert} />
      </div>
    </>
  );
};

export default MaterialApproval;
