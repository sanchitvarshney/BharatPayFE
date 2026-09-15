import React from "react";
import {
  Button,
  Chip,
  Drawer,
  IconButton,
  Step,
  StepButton,
  Stepper,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Icons } from "@/components/icons";
import { CreatePoDrawerProps } from "./createPo/types";
import { STEPS } from "./createPo/helpers";
import { useCreatePoForm } from "./createPo/useCreatePoForm";
import {
  BillingShippingStep,
  DocumentStep,
  ReviewStep,
  VendorStep,
} from "./createPo/StepForms";
import { SummaryPanel } from "./createPo/SummaryPanel";
import { ComponentsDrawer } from "./createPo/ComponentsDrawer";
import { VendorPickDialog } from "./createPo/VendorPickDialog";
import { ConfirmSubmitDialog } from "./createPo/ConfirmSubmitDialog";

const STEP_CONTENT = [
  VendorStep,
  BillingShippingStep,
  DocumentStep,
  ReviewStep,
];

const CreatePOFromComponentsDrawer: React.FC<CreatePoDrawerProps> = (props) => {
  const form = useCreatePoForm(props);
  const { step, rows, loading } = form;
  const isLastStep = step === STEPS.length - 1;
  const StepContent = STEP_CONTENT[step] ?? VendorStep;

  return (
    <>
      <Drawer
        anchor="right"
        open={props.open}
        onClose={form.handleClose}
        PaperProps={{ sx: { width: "100%", maxWidth: "100%" } }}
      >
        <div className="flex h-full flex-col">
          {/* header */}
          <div className="flex h-[54px] shrink-0 items-center justify-between border-b border-zinc-300 bg-zinc-100 px-[20px]">
            <span className="flex items-center gap-[8px] font-semibold text-slate-700">
              <Icons.files fontSize="small" />
              Create Purchase Order
              <Chip
                size="small"
                label={`${rows.length} component${rows.length === 1 ? "" : "s"}`}
                className="ml-[6px]"
              />
            </span>
            <IconButton size="small" onClick={form.handleClose}>
              <Icons.close fontSize="small" />
            </IconButton>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[3fr_minmax(320px,1fr)]">
            {/* LEFT : vertical stepper rail + step form */}
            <div className="flex min-w-0 border-r border-neutral-200">
              <div className="hidden w-[220px] shrink-0 overflow-y-auto border-r border-neutral-200 bg-neutral-50/60 px-[16px] py-[24px] sm:block">
                <Stepper activeStep={step} nonLinear orientation="vertical">
                  {STEPS.map((label, i) => (
                    <Step key={label} completed={i < step}>
                      <StepButton onClick={() => form.goToStep(i)}>
                        {label}
                      </StepButton>
                    </Step>
                  ))}
                </Stepper>
              </div>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex-1 overflow-y-auto px-[24px] py-[22px]">
                  <StepContent form={form} />
                </div>

                {/* step nav */}
                <div className="flex items-center justify-between gap-[10px] border-t border-neutral-300 bg-neutral-50 px-[24px] py-[12px]">
                  <Button
                    variant="text"
                    color="inherit"
                    startIcon={
                      step === 0 ? undefined : (
                        <Icons.previous fontSize="small" />
                      )
                    }
                    onClick={step === 0 ? form.handleClose : form.handleBack}
                  >
                    {step === 0 ? "Cancel" : "Back"}
                  </Button>

                  <div className="flex items-center gap-[10px]">
                    <LoadingButton
                      variant="outlined"
                      loading={form.isComponentsPending}
                      loadingPosition="start"
                      startIcon={<Icons.checklist fontSize="small" />}
                      onClick={form.openComponents}
                    >
                      Components ({rows.length})
                    </LoadingButton>
                    {isLastStep ? (
                      <LoadingButton
                        variant="contained"
                        startIcon={<Icons.save fontSize="small" />}
                        loading={loading}
                        loadingPosition="start"
                        onClick={form.openConfirm}
                        disabled={!form.canSubmit}
                      >
                        Submit PO
                      </LoadingButton>
                    ) : (
                      <Button
                        variant="contained"
                        endIcon={<Icons.next fontSize="small" />}
                        onClick={form.handleNext}
                      >
                        Next
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT : live summary */}
            <SummaryPanel form={form} />
          </div>
        </div>
      </Drawer>

      <ComponentsDrawer form={form} />
      <VendorPickDialog form={form} />
      <ConfirmSubmitDialog form={form} />
    </>
  );
};

export default React.memo(CreatePOFromComponentsDrawer);
