import { Card, CardContent, Typography } from "@mui/material";
export const CAPTURE_STEPS = [
  {
    id: 1,
    title: "Step 1",
    photoCount: "6 Photos",
    details: "Front · Back · Sides · Views",
  },
  {
    id: 2,
    title: "Step 2",
    photoCount: "2 Photos",
    details: "Device View · Box View",
  },
] as const;
export type CaptureView = { key: string; label: string };

export const STEP_VIEWS: Record<number, CaptureView[]> = {
  1: [
    { key: "frontImage", label: "Front Image" },
    { key: "backImage", label: "Back Image" },
    { key: "leftSide", label: "Left Side" },
    { key: "rightSide", label: "Right Side" },
    { key: "topView", label: "Top View" },
    { key: "bottomView", label: "Bottom View" },
  ],
  2: [
    { key: "deviceView", label: "Device View" },
    { key: "boxView", label: "Box View" },
  ],
};

type Step = (typeof CAPTURE_STEPS)[number];
const StepCard: React.FC<{
  step: Step;
  isActive: boolean;
  onSelect: (id: Step["id"]) => void;
}> = ({ step, isActive, onSelect }) => {
  return (
    <Card
      elevation={0}
      onClick={() => onSelect(step.id)}
      className={`cursor-pointer rounded-[30px] transition-all duration-200 ${
        isActive
          ? "border-2 border-cyan-500 bg-cyan-50 shadow-[0_0_0_1px_rgba(6,182,212,0.2),0_0_16px_rgba(6,182,212,0.18),0_4px_16px_rgba(6,182,212,0.12)]"
          : "border border-slate-200 bg-white shadow-[0_0_0_1px_rgba(148,163,184,0.15),0_0_12px_rgba(15,23,42,0.06),0_4px_12px_rgba(15,23,42,0.08)] hover:shadow-[0_0_0_1px_rgba(148,163,184,0.2),0_0_14px_rgba(15,23,42,0.08),0_4px_14px_rgba(15,23,42,0.1)]"
      }`}
    >
      {/* Compact step card: reduce padding + set a consistent min-height */}
      <CardContent className="flex flex-col items-center text-center justify-center gap-[4px] py-[10px] px-[12px] min-h-[86px]">
        <Typography
          variant="subtitle1"
          className={`font-bold ${isActive ? "text-cyan-600" : "text-slate-400"}`}
        >
          {step.title}
        </Typography>
        <Typography
          variant="body2"
          className={`font-medium ${isActive ? "text-slate-600" : "text-slate-400"}`}
        >
          {step.photoCount}
        </Typography>
        <Typography
          variant="caption"
          className={isActive ? "text-slate-500 leading-tight" : "text-slate-300 leading-tight"}
        >
          {step.details}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StepCard;