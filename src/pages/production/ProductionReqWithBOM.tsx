import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription,  CardHeader, CardTitle } from "@/components/ui/card";
import CustomInput from "@/components/reusable/CustomInput";
import CustomSelect from "@/components/reusable/CustomSelect";
import { CustomButton } from "@/components/reusable/CustomButton";
import {  Send } from "lucide-react";
import { HiOutlineRefresh } from "react-icons/hi";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FaLeftLong, FaRightLong } from "react-icons/fa6";
import MaterialReqWithBomPartTable from "@/table/production/MaterialReqWithBomPartTable";
import MaterialReqWithBomPackingTable from "@/table/production/MaterialReqWithBomPackingTable";
import MaterialReqWithBomPcbTable from "@/table/production/MaterialReqWithBomPcbTable";
import MaterialReqWithBomOtherTable from "@/table/production/MaterialReqWithBomOtherTable";

const ProductionReqWithBOM: React.FC = () => {
  const [tab, setTab] = useState<string>("basic-detail");
  return (
    <>
      <div>
        <Tabs defaultValue="basic-detail" className="h-[calc(100vh-100px)]   m-0 p-0" value={tab}>
          <TabsContent value="basic-detail" className="p-0 m-0">
            <div className="grid grid-cols-2 gap-[20px] h-[calc(100vh-150px)] p-[20px] overflow-y-auto">
              <Card className="rounded-md ">
                <CardHeader className="h-[60px] p-0 flex flex-col justify-center px-[20px] bg-[#e0f2f1]">
                  <CardTitle className="text-slate-600 font-[500]">Location</CardTitle>
                  <CardDescription>LocationProvide Product shifting request location</CardDescription>
                </CardHeader>
                <CardContent className="mt-[20px]">
                  <div className="grid grid-cols-2 gap-[30px] ">
                    <div>
                      <CustomSelect required placeholder={"Shifting Location"} />
                    </div>
                    <CustomInput label="Shifting Location Details" disabled />
                    <div>
                      <CustomSelect required placeholder={"Pick Location"} />
                    </div>
                    <CustomInput label="Pick Location Details" disabled />
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-md ">
                <CardHeader className="h-[60px] p-0 flex flex-col justify-center px-[20px] bg-[#e0f2f1]">
                  <CardTitle className="text-slate-600 font-[500]">Product</CardTitle>
                  <CardDescription>Product Provide Product SKU or its BOM type</CardDescription>
                </CardHeader>
                <CardContent className="mt-[20px]">
                  <div className="grid grid-cols-2 gap-[30px] ">
                    <div>
                      <CustomSelect required placeholder={"Product SKU"} />
                    </div>
                    <CustomInput label="Product Name" disabled />
                    <div>
                      <CustomSelect required placeholder={"Product BOM"} />
                    </div>
                    <CustomInput label="Product Qty" required />
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-md ">
                <CardHeader className="h-[60px] p-0 flex flex-col justify-center px-[20px] bg-[#e0f2f1]">
                  <CardTitle className="text-slate-600 font-[500]">Remark</CardTitle>
                  <CardDescription>Remarks (if any)</CardDescription>
                </CardHeader>
                <CardContent className="mt-[20px]">
                  <div>
                    <Label>Remarks</Label>
                    <Textarea className="h-[120px] resize-none" />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="h-[50px] bg-white shadow flex  items-center justify-end px-[20px] gap-[20px]">
              <CustomButton icon={<HiOutlineRefresh className="h-[18px] w-[18px] text-red-600" />} variant={"outline"}>
                Reset
              </CustomButton>
              <CustomButton onClick={() => setTab("material-request")} className="bg-cyan-700 hover:bg-cyan-800 flex items-center gap-[5px]">
                Next
                <FaRightLong className="h-[18px] w-[18px] " />
              </CustomButton>
            </div>
          </TabsContent>
          <TabsContent value="material-request" className="p-0 m-0">
            <div className="h-[calc(100vh-150px)]">
              <Tabs defaultValue="part">
                <div className="h-[50px] py-[5px] px-[20px]">
                  <TabsList className="h-[40px] bg-white px-[10px]">
                    <TabsTrigger value="part" className="data-[state=active]:bg-hbg data-[state=active]:text-slate-600">
                      Part
                    </TabsTrigger>
                    <TabsTrigger value="packing" className="data-[state=active]:bg-hbg data-[state=active]:text-slate-600">
                      Packing
                    </TabsTrigger>
                    <TabsTrigger value="other" className="data-[state=active]:bg-hbg data-[state=active]:text-slate-600">
                      Other
                    </TabsTrigger>
                    <TabsTrigger value="pcb" className="data-[state=active]:bg-hbg data-[state=active]:text-slate-600">
                      PCB
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="part" className="p-0 m-0">
                  <MaterialReqWithBomPartTable />
                </TabsContent>
                <TabsContent value="packing" className="p-0 m-0">
                  <MaterialReqWithBomPackingTable />
                </TabsContent>
                <TabsContent value="other" className="p-0 m-0">
                  <MaterialReqWithBomOtherTable />
                </TabsContent>
                <TabsContent value="pcb" className="p-0 m-0">
                  <MaterialReqWithBomPcbTable />
                </TabsContent>
              </Tabs>
            </div>
            <div className="h-[50px] bg-white shadow flex  items-center justify-end px-[20px] gap-[20px]">
              <CustomButton variant={"outline"} className="flex items-center gap-[5px]">
                <FaLeftLong className="h-[18px] w-[18px] text-slate-600" />
                Back
              </CustomButton>
              <CustomButton onClick={() => setTab("material-request")} icon={<Send className="h-[18px] w-[18px]" />} className="bg-cyan-700 hover:bg-cyan-800 flex items-center gap-[5px]">
                Send Request
              </CustomButton>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ProductionReqWithBOM;
