import { CustomButton } from "@/components/reusable/CustomButton";
import CustomDatePicker from "@/components/reusable/CustomDatePicker";
import CustomInput from "@/components/reusable/CustomInput";
import CustomSelect from "@/components/reusable/CustomSelect";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCcw, Save } from "lucide-react";
import React from "react";

const CraetePPR: React.FC = () => {
  return (
    <div className="h-[calc(100vh-100px)]">
      <div className="h-[calc(100vh-150px)]  overflow-y-auto p-[20px] grid grid-cols-2  gap-[20px]">
        <Card className="rounded-md max-h-max">
          <CardHeader className="h-[60px] p-0 flex flex-col justify-center px-[20px] bg-[#e0f2f1]">
            <CardTitle className="text-slate-600 font-[500]">PPR Details</CardTitle>
            <CardDescription>Enter details like PPR type and project name</CardDescription>
          </CardHeader>
          <CardContent className="mt-[20px]">
            <div className="grid grid-cols-2 gap-[30px] ">
              <div>
                <CustomSelect required placeholder={"PPR Type"} />
              </div>
              <div>
                <CustomSelect required placeholder={"Project"} />
              </div>

              <div>
                <Label className="text-slate-500 font-[400]">Project Descrition</Label>
                <Textarea className="h-[100px] resize-none" />
              </div>
              <div>
                <Label className="text-slate-500 font-[400]">Remarks</Label>
                <Textarea className="h-[100px] resize-none" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-md max-h-max">
          <CardHeader className="h-[60px] p-0 flex flex-col justify-center px-[20px] bg-[#e0f2f1]">
            <CardTitle className="text-slate-600 font-[500]">Product Details</CardTitle>
            <CardDescription>Enter Product details and planning Qty</CardDescription>
          </CardHeader>
          <CardContent className="mt-[20px]">
            <div className="grid grid-cols-2 gap-[30px] ">
              <div>
                <CustomSelect required placeholder={"Product"} />
              </div>
              <div>
                <CustomSelect required placeholder={"BOM"} />
              </div>
              <CustomInput label="Planning Qty" />
              <CustomDatePicker label="Due Date" />
              <div>
                <CustomSelect required placeholder={"Section/Location"} />
              </div>
              <CustomInput label="Customer Name" />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="h-[50px] bg-white shadow flex  items-center justify-end px-[20px] gap-[20px] border-t border-slate-300">
        <CustomButton variant={"outline"} className="flex items-center gap-[5px]">
          <RefreshCcw className="h-[18px] w-[18px] text-slate-600" />
          Reset
        </CustomButton>
        <CustomButton icon={<Save className="h-[18px] w-[18px]" />} className="bg-cyan-700 hover:bg-cyan-800 flex items-center gap-[5px]">
          Submit
        </CustomButton>
      </div>
    </div>
  );
};

export default CraetePPR;
