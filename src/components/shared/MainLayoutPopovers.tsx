import React from "react";
import { Props } from "@/types/MainLayout";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Button } from "@mui/material";
const MainLayoutPopovers: React.FC<Props> = ({ uiState }) => {
  const { logotAlert, setLogotAlert, notificationSheet, setNotificationSheet } = uiState;
  const navigate = useNavigate();
  return (
    <>
      {/* logout alert ========================== */}
      <Dialog open={logotAlert} onClose={setLogotAlert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{"Are you sure you want to logout?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">Logging out will end your current session and return you to the login screen. </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogotAlert(false)}>Back</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              localStorage.clear();
              navigate("/login");
              setLogotAlert(false);
            }}
            autoFocus
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>

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
