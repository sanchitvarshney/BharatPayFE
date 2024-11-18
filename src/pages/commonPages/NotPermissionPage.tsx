import { Button, TextField, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
const NotPermissionPage: React.FC = () => {
  const naviagte = useNavigate();
  return (
    <div className="h-[calc(100vh-100px)] w-full flex justify-center items-center bg-white">
      <div className="flex gap-[30px] w-[50%]">
        <div className="flex flex-col gap-[20px]">
          <div>
            <Typography variant="h1" fontSize={30} fontWeight={500}>You don't have permission to access this page</Typography>
            <Typography >Request access or go back</Typography>
          </div>
          <TextField label="Message(optional)"  multiline rows={3} />
          <div className="flex items-center gap-[20px]">
            <Button variant="contained">Request access</Button>
            <Button variant="contained" onClick={() => naviagte(-1)}>
              Go back
            </Button>
          </div>
        </div>
        <div>
          <img src="/noaccess.png" className="w-[300px] opacity-50" alt="" />
        </div>
      </div>
    </div>
  );
};

export default NotPermissionPage;
