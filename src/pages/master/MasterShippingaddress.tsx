import AddShippingDrawer from "@/components/Drawers/master/AddShippingDrawer";
import { CustomButton } from "@/components/reusable/CustomButton";
import MasterShippingAddressTable from "@/table/master/MasterShippingAddressTable";
import { Download, Plus } from "lucide-react";
import React from "react";

const MasterShippingaddress: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <AddShippingDrawer open={open} setOpen={setOpen} />
      <div className="h-[50px] flex justify-end items-center px-[20px] gap-[10px]">
        <CustomButton icon={<Download className="h-[18px] w-[18px]" />} className="text-slate-600" variant={"outline"}>
          Download
        </CustomButton>
        <CustomButton onClick={() => setOpen(true)} icon={<Plus className="h-[18px] w-[18px]" />} className="bg-cyan-700 hover:bg-cyan-800">
          Add Shipping Address
        </CustomButton>
      </div>
      <div>
        <MasterShippingAddressTable />
      </div>
    </>
  );
};

export default MasterShippingaddress;
