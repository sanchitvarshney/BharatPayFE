import React, { useState } from "react";
import DeviceMinStep1 from "@/components/stepper/deviceMinSteps/DeviceMinStep1";
import DeviceMinStep4 from "@/components/stepper/deviceMinSteps/DeviceMinStep4";
import DeviceMinStep2 from "@/components/stepper/deviceMinSteps/DeviceMinStep2";
import DeviceMinStep3 from "@/components/stepper/deviceMinSteps/DeviceMinStep3";
import { Card, Typography } from "@mui/material";
import { Icons } from "@/components/icons";
const MemoizedDeviceMinStep1 = React.memo(DeviceMinStep1);
const MemoizedDeviceMinStep2 = React.memo(DeviceMinStep2);
const MemoizedDeviceMinStep3 = React.memo(DeviceMinStep3);
const MemoizedDeviceMinStep4 = React.memo(DeviceMinStep4);
const stepComponents = [
  { Component: MemoizedDeviceMinStep1, label: "Step 1", description: "First enter all the details", icon: <Icons.form fontSize="large" /> },
  { Component: MemoizedDeviceMinStep2, label: "Step 2", description: "Scan all the items", icon: <Icons.qrScan fontSize="large" /> },
  { Component: MemoizedDeviceMinStep3, label: "Step 3", description: "Check all the items you have scanned", icon: <Icons.checklist fontSize="large" /> },
  { Component: MemoizedDeviceMinStep4, label: "Step 4", description: "MIN Created", icon: <Icons.alldone fontSize="large" /> },
];

const StepCard = ({ active, label, description, icon }: { active: boolean; label: string; description: string; icon: JSX.Element }) => (
  <Card elevation={active ? 5 : 2} sx={{ background: active ? "#0891b2" : "white", px: 2, py: 3, display: "flex", alignItems: "center", gap: 2 }}>
    <div className={`h-[35px] w-[35px] ${active ? "text-white" : "text-slate-600"}`}>{icon}</div>
    <div className={`${active ? "text-white" : ""}`}>
      <Typography fontWeight={600} fontSize={16}>
        {label}
      </Typography>
      <Typography>{description}</Typography>
    </div>
  </Card>
);

const DeviceMin: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const handleStateChange = (state: number) => setStep(state);
  const CurrentStepComponent = stepComponents[step - 1]?.Component || null;
  return (
    <div className="grid grid-cols-[300px_1fr] h-[calc(100vh-50px)] bg-white">
      <div className="flex flex-col gap-[10px] p-[10px] border-r border-neutral-300">
        {stepComponents.map(({ label, description, icon }, index) => (
          <StepCard key={label} active={step === index + 1} label={label} description={description} icon={icon} />
        ))}
      </div>
      <div>{CurrentStepComponent && <CurrentStepComponent setStep={handleStateChange} step={step} />}</div>
    </div>
  );
};

export default DeviceMin;
