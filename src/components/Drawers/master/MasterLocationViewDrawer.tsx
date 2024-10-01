import React from "react";
import { CustomDrawer, CustomDrawerContent, CustomDrawerHeader, CustomDrawerTitle } from "@/components/reusable/CustomDrawer"; // Update with the correct path
import { useAppSelector } from "@/hooks/useReduxHook";
import { CgSpinner } from "react-icons/cg";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const MasterLocationViewDrawer: React.FC<Props> = ({ open, setOpen }) => {
  const { getLocationDetailsLoading, getLocationDetails } = useAppSelector((state) => state.location);
  return (
    <div>
      <CustomDrawer open={open} onOpenChange={setOpen}>
        <CustomDrawerContent side="right" className="p-0">
          <CustomDrawerHeader className="h-[50px] p-0 flex flex-col justify-center px-[20px] bg-zinc-200 gap-0 border-b border-zinc-400 ">
            <CustomDrawerTitle className="text-slate-600 font-[500] p-0">Location Deatil</CustomDrawerTitle>
          </CustomDrawerHeader>
          <div className="h-[calc(100vh-50px)] overflow-y-hidden p-[20px]">
            {getLocationDetailsLoading ? (
              <div className="flex items-center justify-center w-full h-full">
                <CgSpinner className="h-[50px] w-[50px] animate-spin text-slate-500" />
              </div>
            ) : (
              <ul>
                <li className="py-[5px] border-b text-slate-600 flex items-center justify-between">
                  <span className="font-[600]">Location Name :</span>
                  <span className="font-[500]">{getLocationDetails?.loc_name}</span>
                </li>
                <li className="py-[5px] border-b text-slate-600 flex items-center justify-between">
                  <span className="font-[600]">Parent Location :</span>
                  <span className="font-[500]">{getLocationDetails?.parent_loc_name}</span>
                </li>
                <li className="py-[5px] border-b text-slate-600 flex items-center justify-between">
                  <span className="font-[600]">Location Type :</span>
                  <span className="font-[500]">{getLocationDetails?.loc_type}</span>
                </li>
                
                <li className="py-[5px] border-b text-slate-600 flex items-center justify-between">
                  <span className="font-[600]">Address :</span>
                  <span className="font-[500]">{getLocationDetails?.loc_address}</span>
                </li>
                <li className="py-[5px] border-b text-slate-600 flex items-center justify-between">
                  <span className="font-[600]">Insert Date :</span>
                  <span className="font-[500]">{getLocationDetails?.insert_date}</span>
                </li>
                <li className="py-[5px] border-b text-slate-600 flex items-center justify-between">
                  <span className="font-[600]">Insert By :</span>
                  <span className="font-[500]">{getLocationDetails?.insert_by}</span>
                </li>
              </ul>
            )}
          </div>
        </CustomDrawerContent>
      </CustomDrawer>
    </div>
  );
};

export default MasterLocationViewDrawer;
