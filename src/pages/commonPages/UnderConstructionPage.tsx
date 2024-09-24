import { Button } from "@/components/ui/button";
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
            <h1 className="text-slate-600 text-[30px] font-[500] ">This page is under Development</h1>
          </div>
          <div className="flex items-center gap-[20px]">
            <Button className="bg-cyan-700 hover:bg-cyan-800" onClick={() => naviagte(-1)}>
              Go back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnderConstructionPage;
