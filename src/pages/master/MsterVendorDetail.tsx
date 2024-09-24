import { CustomButton } from "@/components/reusable/CustomButton";
import MasterVendorDetailTable from "@/table/master/MasterVendorDetailTable";
import { Download } from "lucide-react";
import React from "react";

const MsterVendorDetail: React.FC = () => {
  return (
    <div className="h-[calc(100vh-100px)]">
      <div className="h-[50px] flex items-center justify-end px-[20px]">
        <CustomButton icon={<Download className="h-[18px] w-[18px]" />} className="bg-cyan-700 hover:bg-cyan-800">Download</CustomButton>
      </div>
      <div>
        <MasterVendorDetailTable />
      </div>
    </div>
  );
};

export default MsterVendorDetail;
