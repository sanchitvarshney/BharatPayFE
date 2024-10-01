import React from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Props } from "@/types/MainLayout";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAppDispatch } from "@/hooks/useReduxHook";
import { logout } from "@/features/authentication/authSlice";

const MainLayoutPopovers: React.FC<Props> = ({ uiState }) => {
  const { logotAlert, setLogotAlert, notificationSheet, setNotificationSheet } = uiState;

  const dispatch = useAppDispatch();
  return (
    <>
      {/* logout alert ========================== */}
      <AlertDialog open={logotAlert} onOpenChange={setLogotAlert}>
        <AlertDialogContent className="bg-white rounded">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>Do you want to log out of your account?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => dispatch(logout())}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* logout alert ========================== */}

      {/* notification sheet ==================== */}
      <Sheet open={notificationSheet} onOpenChange={setNotificationSheet}>
        <SheetContent className="p-0 bg-white text-slate-600 border-slate-200">
          <SheetHeader className="h-[50px] px-[10px] justify-center border-b">
            <SheetTitle className="text-slate-600">Notifications</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-[10px] mt-[20px] h-[calc(100vh-100px)]  items-center justify-center">
            <img src="/empty.png" alt="" className="h-[150px] w-[150px]" />
          </div>
          <SheetFooter className="absolute bottom-0 left-0 w-[100%] h-[50px] bg-cyan-700 px-[10px] flex items-center">
            <div className="flex justify-center w-full">
              <Link to={"#"} className="text-white hover:underline">
                See All
              </Link>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      {/* notification sheet ==================== */}
    </>
  );
};

export default MainLayoutPopovers;
