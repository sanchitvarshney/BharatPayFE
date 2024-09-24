import React from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Props } from "@/types/MainLayout";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch } from "@/hooks/useReduxHook";
import { logout } from "@/features/authentication/authSlice";


const MainLayoutPopovers: React.FC<Props> = ({ uiState }) => {
  const { logotAlert, setLogotAlert,notificationSheet, setNotificationSheet } = uiState;

  const dispatch = useAppDispatch();
  return (
    <>
      {/* logout alert ========================== */}
      <AlertDialog open={logotAlert} onOpenChange={setLogotAlert}>
        <AlertDialogContent className="bg-white rounded">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() =>dispatch(logout())}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* logout alert ========================== */}

      {/* notification sheet ==================== */}
      <Sheet open={notificationSheet} onOpenChange={setNotificationSheet}>
        <SheetContent className="text-slate-600 bg-neutral-300 border-slate-200">
          <SheetHeader>
            <SheetTitle className="text-slate-600">Notifications</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-[10px] mt-[20px] ">
            {Array.from({ length: 3 }).map((_, i) => (
              <Link key={i} to={"#"}>
                <Card className="border-0 rounded shadow text-slate-600 bg-blue-50">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-[10px]">
                      Sachin Maurya <Badge className="h-[10px] w-[10px] p-0 bg-green-300"></Badge>
                    </CardTitle>
                    <CardDescription className="text-slate-600">09:38 AM</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Title</p>
                    <p className="text-[13px] font-[400] text-slate-600">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita, labore!...</p>
                  </CardContent>
                  <CardFooter></CardFooter>
                </Card>
              </Link>
            ))}
          </div>
          <SheetFooter className="absolute bottom-0 left-0 w-[100%] bg-neutral-600 py-[10px]">
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
