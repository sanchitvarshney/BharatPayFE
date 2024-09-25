import { CustomButton } from "@/components/reusable/CustomButton";
import { CustomDrawer, CustomDrawerContent, CustomDrawerFooter, CustomDrawerHeader, CustomDrawerTitle } from "@/components/reusable/CustomDrawer";
import ViewTRCTable from "@/table/TRC/ViewTRCTable";
import React, { useState } from "react";
import { IoMdCheckmark } from "react-icons/io";
import { FaXmark } from "react-icons/fa6";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
const ViewTRC: React.FC = () => {
  const [process, setProcess] = useState<boolean>(false);
  return (
    <>
      <CustomDrawer open={process} onOpenChange={setProcess}>
        <CustomDrawerContent className="min-w-[60%] p-0" onInteractOutside={(e) => e.preventDefault()}>
          <CustomDrawerHeader className="h-[50px] p-0 flex flex-col justify-center px-[20px] bg-zinc-200 gap-0 border-b border-zinc-300">
            <CustomDrawerTitle className="text-slate-600 font-[500] p-0">REF98765RDFGHBJKLOI9876</CustomDrawerTitle>
          </CustomDrawerHeader>
          <div className="h-[calc(100vh-100px)] grid grid-cols-2">
            <div className="border-r border-zinc-300">
              <div className="bg-hbg h-[40px] flex items-center px-[10px]">
                <p className="text-slate-600 font-[600]">Device List</p>
              </div>
              <div className="h-[calc(100vh-140px)]">
                <div className="h-[30px] grid grid-cols-[30px_1fr_1fr] bg-zinc-300 items-center font-[500] ps-[10px]">
                  <p></p>
                  <p>Device</p>
                  <p>Issue</p>
                </div>
                <RadioGroup defaultValue="option-one" className="flex flex-col gap-0 p-0 m-0">
                  <Label htmlFor="option-one" className="p-0 cursor-pointer">
                    <div className=" items-center grid grid-cols-[30px_1fr_1fr] py-[10px] border-b ps-[10px] ">
                      <RadioGroupItem value="option-one" id="option-one" />
                      <p>Device1</p>
                      <p>Device2</p>
                    </div>
                  </Label>
                  <Label htmlFor="option-two" className="p-0 cursor-pointer">
                    <div className=" items-center grid grid-cols-[30px_1fr_1fr] py-[10px] border-b ps-[10px] ">
                      <RadioGroupItem value="option-two" id="option-two" />
                      <p>Device1</p>
                      <p>Device2</p>
                    </div>
                  </Label>
                </RadioGroup>
              </div>
            </div>
            <div>
              <div className="bg-hbg h-[40px] flex items-center px-[10px]">
                <p className="text-slate-600 font-[600]">Fix Issues</p>
              </div>
              <div className="h-[calc(100vh-140px)] overflow-y-auto ">
                <div className="flex items-center justify-center h-[100%]">
                  <img src="/empty.png" alt="" className="h-[100px] w-[100px]" />
                </div>
              </div>
            </div>
          </div>
          <CustomDrawerFooter className="h-[50px] flex items-center px-[10px] border-t border-zinc-300">
            <CustomButton disabled variant={"outline"} icon={<FaXmark className="h-[18px] w-[18px] text-red-500" />}>
              Cancel
            </CustomButton>
            <CustomButton disabled className="bg-cyan-700 hover:bg-cyan-800" icon={<IoMdCheckmark className="h-[18px] w-[18px] " />}>
              Submit
            </CustomButton>
          </CustomDrawerFooter>
        </CustomDrawerContent>
      </CustomDrawer>
      <ViewTRCTable open={process} setOpen={setProcess} />
    </>
  );
};

export default ViewTRC;
