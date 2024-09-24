import React from "react";
import { CustomDrawer, CustomDrawerContent, CustomDrawerHeader, CustomDrawerFooter, CustomDrawerTitle } from "@/components/reusable/CustomDrawer"; // Update with the correct path
import { CustomButton } from "@/components/reusable/CustomButton";
import { IoCheckmark } from "react-icons/io5";
import CustomInput from "@/components/reusable/CustomInput";
import CustomSelect from "@/components/reusable/CustomSelect";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RxCross2 } from "react-icons/rx";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const AddBillingAddressDrawer: React.FC<Props> = ({ open, setOpen }) => {
  return (
    <div>
      <CustomDrawer open={open} onOpenChange={setOpen}>
        <CustomDrawerContent side="right" className="min-w-[50%] p-0">
          <CustomDrawerHeader className="h-[50px] p-0 flex flex-col justify-center px-[20px] space-y-0 bg-zinc-200 gap-0">
            <CustomDrawerTitle className="text-slate-600 font-[500] p-0">Add Billing Address</CustomDrawerTitle>
          </CustomDrawerHeader>
          <div className="h-[calc(100vh-100px)] overflow-y-auto flex flex-col gap-[30px] px-[20px] ">
            <div className=""></div>
            <fieldset className="border p-[20px] rounded-md">
              <legend className="text-slate-600 font-[600]">Address Details</legend>
              <div className="grid grid-cols-2 gap-[30px]">
                <CustomInput label="Warehouse Name" />

                <CustomInput label="Company Name" />

                <CustomInput label="Pan No." />
                <CustomInput label="GST No." />
                <CustomInput label="CIN No" />
                <CustomSelect placeholder={"Select City"} />
              </div>
              <div className="flex flex-col mt-[30px]">
                <Label className="text-slate-500 text-[15px] font-[400]">Enter Complete Address</Label>
                <Textarea className="h-[100px]" />
              </div>
            </fieldset>
            <div className="min-h-[100px]"></div>
          </div>

          <CustomDrawerFooter className="h-[50px] p-0 flex items-center px-[20px] border-t gap-[10px] justify-end">
            <CustomButton onClick={() => setOpen(false)} icon={<RxCross2 className="h-[18px] w-[18px] text-red-600" />} variant={"outline"}>
              Back
            </CustomButton>
            <CustomButton icon={<IoCheckmark className="h-[18px] w-[18px] " />} className="bg-cyan-700 hover:bg-cyan-800">
              Add
            </CustomButton>
          </CustomDrawerFooter>
        </CustomDrawerContent>
      </CustomDrawer>
    </div>
  );
};

export default AddBillingAddressDrawer;
