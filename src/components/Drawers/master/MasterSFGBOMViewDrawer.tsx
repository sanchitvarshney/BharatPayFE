import React from "react";
import { CustomDrawer, CustomDrawerContent, CustomDrawerHeader, CustomDrawerTitle } from "@/components/reusable/CustomDrawer"; // Update with the correct path
import MasterSFGBOMViewTable from "@/table/master/MasterSFGBOMViewTable";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const MasterSFGBOMViewDrawer: React.FC<Props> = ({ open, setOpen }) => {
  return (
    <div>
      <CustomDrawer open={open} onOpenChange={setOpen}>
        <CustomDrawerContent side="right" className="min-w-[60%] p-0">
          <CustomDrawerHeader className="h-[50px] p-0 flex flex-col justify-center px-[20px] bg-zinc-200 gap-0 border-b border-zinc-400">
            <CustomDrawerTitle className="text-slate-600 font-[500] p-0">PCB_Oakremote V2 (SKU-44202)</CustomDrawerTitle>
          </CustomDrawerHeader>
          <div className="h-[calc(100vh-100px)] overflow-y-hidden">
            <MasterSFGBOMViewTable/>
          </div>
        </CustomDrawerContent>
      </CustomDrawer>
    </div>
  );
};

export default MasterSFGBOMViewDrawer;
