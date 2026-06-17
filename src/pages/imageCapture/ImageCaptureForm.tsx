import { LoadingButton } from "@mui/lab";
import { Card, CardContent, TextField, Typography } from "@mui/material";
import React from "react";
import { fieldSx } from "../queries/fqcDeviceImage/fqcDeviceImage.constants";
import { Icons } from "@/components/icons";
import StepCard, { CAPTURE_STEPS } from "@/components/StepCard";



type Props = {
  serialNo: string;
  onSerialNoChange: (value: string) => void;
  loading?: boolean;
  selectedStep: number;
  onSelectStep: (id: number) => void;
  onOpenWebCamera: () => void;
};





const ImageCaptureForm: React.FC<Props> = ({
  serialNo,
  onSerialNoChange,
  loading,
  selectedStep,
  onSelectStep,
  onOpenWebCamera,
}) => {
  return (
    <Card elevation={0}  className="m-2 w-full min-w-[400px] max-w-[500px]">
      <CardContent>
        <div className="flex flex-col gap-[20px]">
          <div className="flex flex-col gap-[10px]">
            <Typography
              variant="subtitle1"
              className="text-slate-600 font-medium"
            >
              Serial Number
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              value={serialNo}
              onChange={(e) => onSerialNoChange(e.target.value)}
              sx={fieldSx}
            />
          </div>
          <div className="flex flex-col gap-[10px]">
            <Typography
              variant="subtitle1"
              className="text-slate-600 font-medium "
            >
              Select Step
            </Typography>
            <div className="grid grid-cols-2 gap-3">
              {CAPTURE_STEPS.map((step) => {
                const isActive = selectedStep === step.id;
                return (
                  <StepCard
                    key={step.id}
                    step={step}
                    isActive={isActive}
                    onSelect={(id) => onSelectStep(id)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>

      <div className="h-[50px] px-[20px] flex items-center justify-end gap-[10px] pb-4">
        <LoadingButton
          loading={loading}
          onClick={onOpenWebCamera}
          endIcon={<Icons.right />}
          variant="contained"
        >
          Start Camera
        </LoadingButton>
      </div>
    </Card>
  );
};

export default ImageCaptureForm;
