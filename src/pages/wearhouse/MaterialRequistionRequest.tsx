import MrRequisitionReqTable from "@/table/wearhouse/MrRequisitionReqTable";
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import CustomSelect from "@/components/reusable/CustomSelect";
import { CustomButton } from "@/components/reusable/CustomButton";
import { Download, Search } from "lucide-react";
import CustomDatePicker from "@/components/reusable/CustomDatePicker";

const MaterialRequistionRequest: React.FC = () => {
  return (
    <div className="h-[calc(100vh-100px)] grid grid-cols-[400px_1fr]">
      <div className="p-[10px] h-full overflow-y-auto">
        <Card className="overflow-hidden rounded-md ">
          <CardHeader className="h-[50px] p-0 flex flex-col justify-center px-[20px] bg-hbg">
            <CardTitle className="text-slate-600 font-[500]">HSN Codes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid  gap-[40px] mt-[30px]">
              <div>
                <CustomSelect required placeholder={"Code"} />
              </div>
              <div>
                <CustomDatePicker label="Start Date" placeholder="Choose a start date" className="mb-4" buttonClassName="w-full"  />
              </div>
            </div>
          </CardContent>
          <CardFooter className="h-[50px] p-0 flex items-center px-[20px] border-t gap-[10px] justify-end">
            <CustomButton icon={<Download className="h-[18px] w-[18px] " />} variant={"outline"}>
              Download
            </CustomButton>
            <CustomButton icon={<Search className="h-[18px] w-[18px] " />} className="bg-cyan-700 hover:bg-cyan-800">
              Search
            </CustomButton>
          </CardFooter>
        </Card>
      </div>
      <div>
        <MrRequisitionReqTable />
      </div>
    </div>
  );
};

export default MaterialRequistionRequest;
