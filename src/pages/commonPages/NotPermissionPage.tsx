import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { useNavigate } from "react-router-dom";

const NotPermissionPage: React.FC = () => {
    const naviagte = useNavigate()
  return (
    <div className="h-[calc(100vh-50px)] w-full flex justify-center items-center bg-white">
      <div className="flex gap-[30px] w-[50%]">
        <div className="flex flex-col gap-[20px]">
          <div>
          <h1 className="text-slate-600 text-[30px] font-[500] ">You don't have permission to access this page</h1>
          <p className="text-slate-600">Request access or go back</p>
          </div>
          <Textarea  placeholder="Message(optional)" />
          <div className="flex items-center gap-[20px]">
            <Button >Request access</Button>
            <Button onClick={()=>naviagte(-1)}>Go back</Button>
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