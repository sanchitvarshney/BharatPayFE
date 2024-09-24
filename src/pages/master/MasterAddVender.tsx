import { CustomButton } from "@/components/reusable/CustomButton";
import CustomInput from "@/components/reusable/CustomInput";
import CustomSelect from "@/components/reusable/CustomSelect";
import FileUploaderTest from "@/components/reusable/FileUploaderTest";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCcw, Save } from "lucide-react";
import React, { useState } from "react";

const MasterAddVender: React.FC = () => {
  const [files, setfiles] = useState<File[] | null>(null);
  return (
    <div className="h-[calc(100vh-100px)]">
      <div className="h-[calc(100vh-150px)]  overflow-y-auto p-[20px] grid  gap-[20px] lg:px-[200px] md:px-[20px] sm:px-[20px]">
        <Card className="rounded-md max-h-max">
          <CardHeader className="h-[60px] p-0 flex flex-col justify-center px-[20px] bg-[#e0f2f1]">
            <CardTitle className="text-slate-600 font-[500]">Vendor Details</CardTitle>
            <CardDescription>Provide Vendor Details (New Or Supplementary)</CardDescription>
          </CardHeader>
          <CardContent className="mt-[20px]">
            <div className="grid grid-cols-3 gap-[30px] ">
              <CustomInput label="Vendor Name" />
              <CustomInput label="Pan Number" />
              <CustomInput label="CIN Number" />
              <CustomInput label="Payment Terms (in-days)" />
              <CustomInput label="Email" />
              <CustomInput label="Mobile" />
              <CustomInput label="Fax Number" />
              <CustomInput label="Payment Terms (in-days)" />
              <div>
                <CustomSelect required placeholder={"MSME Status"} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-md max-h-max">
          <CardHeader className="h-[60px] p-0 flex flex-col justify-center px-[20px] bg-[#e0f2f1]">
            <CardTitle className="text-slate-600 font-[500]">GST Details</CardTitle>
            <CardDescription>Provide GSt Details</CardDescription>
          </CardHeader>
          <CardContent className="mt-[20px]">
            <div className="grid grid-cols-3 gap-[30px] ">
              <CustomInput label="GST Number" />
              <div>
                <CustomSelect required placeholder={"E-Invoice Applicability"} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-md max-h-max">
          <CardHeader className="h-[60px] p-0 flex flex-col justify-center px-[20px] bg-[#e0f2f1]">
            <CardTitle className="text-slate-600 font-[500]">Branch Details</CardTitle>
            <CardDescription>Provide Branch Details</CardDescription>
          </CardHeader>
          <CardContent className="mt-[20px]">
            <div className="grid grid-cols-3 gap-[30px] ">
              <CustomInput label="Branch Name" />
              <div>
                <CustomSelect required placeholder={"Select State"} />
              </div>
              <CustomInput label="City" />
              <CustomInput label="Pin Code" />
              <div></div>
              <div></div>
              <div>
                <Label className="text-slate-500 font-[400]">Complete Address</Label>
                <Textarea className="h-[100px] resize-none" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-md max-h-max w-[50%]">
          <CardHeader className="h-[60px] p-0 flex flex-col justify-center px-[20px] bg-[#e0f2f1]">
            <CardTitle className="text-slate-600 font-[500]">Upload Document</CardTitle>
            <CardDescription>Upload vendor PDF document</CardDescription>
          </CardHeader>
          <CardContent className="mt-[20px]">
            <div className="grid gap-[30px] ">
              <FileUploaderTest files={files} setFiles={setfiles} requiredFilename="XLS, CSV, XLSX" />
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

export default MasterAddVender;
