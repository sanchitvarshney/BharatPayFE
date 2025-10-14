import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import {
  createProductReturnMIN,
  resetFormData,
} from "@/features/wearhouse/Rawmin/RawMinSlice";
import {
  CreateProductReturnMINPayloadType,
} from "@/features/wearhouse/Rawmin/RawMinType";
import {
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Icons } from "@/components/icons";
import { showToast } from "@/utils/toasterContext";
import Success from "@/components/reusable/Success";
import ProdReturnMinMaterialsReturnTable from "@/table/wearhouse/ProdReturnMinMaterialsReturnTable";
interface RowData {
  partComponent: { lable: string; value: string } | null;
  qty: number;
  hsnCode: string;
  location: { lable: string; value: string } | null;
  remarks: string;
  id: string;
  currency: string;
  isNew?: boolean;
}

const ProdReturnMin: React.FC = () => {
  const [minNo, setMinno] = useState<string>("");
  const [rowData, setRowData] = useState<RowData[]>([]);
  
  const dispatch = useAppDispatch();
  const { createminLoading } = useAppSelector(
    (state) => state.rawmin
  );

  const [activeStep, setActiveStep] = useState(1);
  const steps = ["Add Component Details", "Review & Submit"];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const checkRequiredFields = (data: RowData[]) => {
    let hasErrors = false;
    const requiredFields: Array<keyof RowData> = [
      "partComponent",
      "qty",
      "hsnCode",
      "location",
    ];

    const missingDetails: string[] = [];

    data.forEach((item, index) => {
      const missingFields: string[] = [];

      requiredFields.forEach((field) => {
        if (
          item[field] === "" ||
          item[field] === 0 ||
          item[field] === undefined ||
          item[field] === null
        ) {
          missingFields.push(field);
        }
      });

      if (missingFields.length > 0) {
        missingDetails.push(`Row ${index + 1}: ${missingFields.join(", ")}`);
        hasErrors = true;
      }
    });

    if (missingDetails.length > 0) {
      showToast(
        `Some required fields are missing:\n${missingDetails.join("\n")}`,
        "error"
      );
    }

    return hasErrors;
  };

  const resetall = () => {
    setRowData([]);
  };

  const finalSubmit = () => {
    if (rowData.length === 0) {
      showToast("Please Add Material Details", "error");
    } else {
      if (!checkRequiredFields(rowData)) {
        const component = rowData.map(
          (item) => item.partComponent?.value || ""
        );
        const qty = rowData.map((item) => Number(item.qty));
        const location = rowData.map((item) => item.location?.value || "");
        const remarks = rowData.map((item) => item.remarks);
        const hsnCode = rowData.map((item) => item.hsnCode);
        const payload: CreateProductReturnMINPayloadType = {
          component,
          qty,
          location,
          hsnCode,
          remarks,
          minType: "PROD-RETURN",
        };
        dispatch(createProductReturnMIN(payload)).then((response: any) => {
          if (response.payload.data.success) {
            showToast(response.payload?.data?.message, "success");
            resetall();
            handleNext();
            dispatch(resetFormData());
            setMinno(response.payload?.data?.data.transaction_id);
          }
        });
      }
    }
  };

  return (
    <>
      <form onSubmit={() => {}} className="bg-white ">
        <div className="h-[calc(100vh-100px)]   ">
          <div className="h-[50px] flex items-center w-full px-[20px] bg-neutral-50 border-b border-neutral-300">
            <Stepper activeStep={activeStep} className="w-full">
              {steps.map((label, index) => (
                <Step key={index}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </div>

          {activeStep === 1 && (
            <div className="h-[calc(100vh-200px)]   ">
              <ProdReturnMinMaterialsReturnTable
                rowData={rowData}
                setRowData={setRowData}
              />
            </div>
          )}
          {activeStep === 2 && (
            <div className="h-[calc(100vh-200px)] flex items-center justify-center">
              <div className="flex flex-col justify-center gap-[10px]">
                <Success />
                <Typography variant="inherit" fontWeight={500}>
                  Min No. : {minNo}
                </Typography>
                <LoadingButton
                  onClick={() => setActiveStep(0)}
                  variant="contained"
                >
                  Create New MIN
                </LoadingButton>
              </div>
            </div>
          )}
          <div className="h-[50px] border-t border-neutral-300 flex items-center justify-end px-[20px] bg-neutral-50 gap-[10px] relative">
            {activeStep === 1 && (
              <>
                <LoadingButton
                  disabled={createminLoading}
                  sx={{ background: "white", color: "red" }}
                  variant="contained"
                  startIcon={<Icons.previous />}
                  onClick={() => {
                    handleBack();
                  }}
                >
                  Back
                </LoadingButton>
                <LoadingButton
                  disabled={createminLoading}
                  sx={{ background: "white", color: "red" }}
                  variant="contained"
                  startIcon={<Icons.refreshv2 />}
                  onClick={() => {
                    resetall();
                  }}
                >
                  Reset
                </LoadingButton>
                <LoadingButton
                  loading={createminLoading}
                  loadingPosition="start"
                  variant="contained"
                  startIcon={<Icons.save />}
                  onClick={() => {
                    finalSubmit();
                  }}
                >
                  Submit
                </LoadingButton>
              </>
            )}
          </div>
        </div>
      </form>
    </>
  );
};

export default ProdReturnMin;
