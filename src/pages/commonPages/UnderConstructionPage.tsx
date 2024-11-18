import { Button, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
const UnderConstructionPage: React.FC = () => {
  const naviagte = useNavigate();
  return (
    <div className="h-[calc(100vh-50px)] w-full flex justify-center items-center bg-white">
      <div className="flex items-center gap-[20px] w-[50%] flex-col">
        <div>
          <img src="/underdev.webp" className="w-[300px] opacity-70" alt="" />
        </div>
        <div className="flex flex-col gap-[20px] items-center">
          <div>
            <Typography variant="h1" fontSize={30} fontWeight={500} className="">
              This page is Under Development
            </Typography>
          </div>
          <div className="flex items-center gap-[20px]">
            <Button variant="contained" onClick={() => naviagte(-1)}>
              Go back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnderConstructionPage;
