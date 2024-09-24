import React, { useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DeviceMinStep1 from "@/components/stepper/deviceMinSteps/DeviceMinStep1";
import DeviceMinStep4 from "@/components/stepper/deviceMinSteps/DeviceMinStep4";
import DeviceMinStep2 from "@/components/stepper/deviceMinSteps/DeviceMinStep2";
import DeviceMinStep3 from "@/components/stepper/deviceMinSteps/DeviceMinStep3";
import { BsUpcScan } from "react-icons/bs";
import { MdEditDocument } from "react-icons/md";
import { CiViewList } from "react-icons/ci";
import { IoCheckmarkCircleSharp } from "react-icons/io5";

const MemoizedDeviceMinStep1 = React.memo(DeviceMinStep1);
const MemoizedDeviceMinStep2 = React.memo(DeviceMinStep2);
const MemoizedDeviceMinStep3 = React.memo(DeviceMinStep3);
const MemoizedDeviceMinStep4 = React.memo(DeviceMinStep4);
const DeviceMin: React.FC = () => {
  const [step, setStep] = useState<number>(1);

  const handleStateChange = (state: number) => {
    setStep(state);
  };
  const RenderComponent = React.memo(({ type }: { type: number }) => {
    switch (type) {
      case 1:
        return <MemoizedDeviceMinStep1 setStep={handleStateChange} step={step} />;
      case 2:
        return <MemoizedDeviceMinStep2 setStep={handleStateChange} step={step} />;
      case 3:
        return <MemoizedDeviceMinStep3 setStep={handleStateChange} step={step} />;
      case 4:
        return <MemoizedDeviceMinStep4 setStep={handleStateChange} step={step} />;
      default:
        return null;
    }
  });
  return (
    <div className={`grid  grid-cols-[300px_1fr] h-[calc(100vh-50px)] transition-all`}>
      <div className="flex flex-col gap-[10px] p-[10px] border-r">
        <Card  className={`${step === 1 ? "bg-cyan-600 shadow-xl text-white" : ""} cursor-pointer transition-all flex  p-[20px] gap-[15px]`}>
          <div >
            <MdEditDocument className={`h-[35px] w-[35px] text-slate-600 ${step === 1 && "text-white"}`} />
          </div>
          <CardHeader className="p-0">
            <CardTitle>Step 1</CardTitle>
            <CardDescription className={`${step === 1 && "text-white"}`}>First enter all the details</CardDescription>
          </CardHeader>
        </Card>
        <Card className={`${step === 2 ? "bg-cyan-600 shadow-xl text-white" : ""} cursor-pointer transition-all flex  p-[20px] gap-[15px]`}>
        <div >
            <BsUpcScan className={`h-[35px] w-[35px] text-slate-600 ${step === 2 && "text-white"}`} />
          </div>
          <CardHeader className="p-0">
            <CardTitle>Step 2</CardTitle>
            <CardDescription className={`${step === 2 && "text-white"}`}>scan all the items</CardDescription>
          </CardHeader>
        </Card>
        <Card className={`${step === 3 ? "bg-cyan-600 shadow-xl text-white" : ""} transition-all cursor-pointer flex  p-[20px] gap-[15px]`}>
        <div >
            <CiViewList className={`h-[35px] w-[35px] text-slate-600 ${step === 3 && "text-white"}`} />
          </div>
          <CardHeader className="p-0">
            <CardTitle>Step 3</CardTitle>
            <CardDescription className={`${step === 3 && "text-white"}`}>Check All the Items you have scanned</CardDescription>
          </CardHeader>
        </Card>
        <Card className={`${step === 4 ? "bg-cyan-600 shadow-xl text-white" : ""} transition-all cursor-pointer flex  p-[20px] gap-[15px] `}>
        <div >
            <IoCheckmarkCircleSharp className={`h-[35px] w-[35px] text-slate-600 ${step === 4 && "text-white"}`} />
          </div>
          <CardHeader className="p-0">
            <CardTitle>Step 4</CardTitle>
            <CardDescription className={`${step === 4 && "text-white"}`}>MIN Created</CardDescription>
          </CardHeader>
        </Card>
      </div>
      <div className="p-[10px]"> <RenderComponent type={step} /></div>
    </div>
  );
};
export default DeviceMin;
