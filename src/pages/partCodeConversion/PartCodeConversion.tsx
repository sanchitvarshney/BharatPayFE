import React, { useEffect, useState } from "react";
import { CardContent, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { showToast } from "@/utils/toasterContext";
import { Icons } from "@/components/icons";
import { CardFooter } from "@/components/ui/card";
import { LoadingButton } from "@mui/lab";
import SelectLocationAcordingModule from "@/components/reusable/SelectLocationAcordingModule";
import InitialComponentsTable from "@/table/partCodeConversion/InitialComponentsTable";
import FinalComponentsTable from "@/table/partCodeConversion/FinalComponentsTable";
import {
  setpickLcn,
  submitPartCodeConversion,
} from "@/features/partCodeConversion/partCodeConversionSlices";
import ConfirmationModel from "@/components/reusable/ConfirmationModel";

interface InitialComponent {
  id: string;
  component: { label: string; value: string };
  quantity: number;
  availableqty: string;
  unit: string;
  isNew: boolean;
}

interface FinalComponent {
  id: string;
  component: { label: string; value: string };
  quantity: number;
  unit: string;
  isNew: boolean;
}

const PartCodeConversion: React.FC = () => {
  const dispatch = useAppDispatch();
  const { submitLoading } = useAppSelector((state) => state.partCodeConversion);

  // Form states
  const [pickLocation, setPickLocation] = useState<any>(null);
  const [dropLocation, setDropLocation] = useState<any>(null);

  // Table data
  const [initialComponents, setInitialComponents] = useState<
    InitialComponent[]
  >([]);
  const [finalComponents, setFinalComponents] = useState<FinalComponent[]>([]);

  // Confirmation modal
  const [showConfirm, setShowConfirm] = useState(false);

  // Handle submit
  const handleSubmit = () => {
    if (initialComponents.length === 0) {
      showToast("Please add at least one initial component", "error");
      return;
    }

    if (finalComponents.length === 0) {
      showToast("Please add at least one final component", "error");
      return;
    }

    setShowConfirm(true);
  };

  const confirmSubmit = async () => {
    try {
      const payload = {
        pickLocation: pickLocation?.code || "",
        dropLocation: dropLocation?.code || "",
        initialComponents: initialComponents.map(
          (item) => item.component.value
        ),
        finalComponents: finalComponents.map((item) => item.component.value),
        initialQty: initialComponents.map((item) => item.quantity),
        finalQty: finalComponents.map((item) => item.quantity),
      };

      const result = await dispatch(submitPartCodeConversion(payload));

      if (submitPartCodeConversion.fulfilled.match(result)) {
        showToast("Part code conversion submitted successfully", "success");
        handleReset();
      } else {
        showToast("Failed to submit part code conversion", "error");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      showToast("Failed to submit part code conversion", "error");
    }
    setShowConfirm(false);
  };

  // Handle reset
  const handleReset = () => {
    setInitialComponents([]);
    setFinalComponents([]);
    setPickLocation(null);
    setDropLocation(null);
  };

  useEffect(() => {
    dispatch(setpickLcn(pickLocation));
  }, [pickLocation]);

  return (
    <div className="h-[calc(100vh-100px)] overflow-y-hidden grid grid-cols-[450px_1fr]">
      {/* Left Panel - Location Details */}
      <div className="h-full overflow-y-auto bg-white border-r border-neutral-300">
        <div>
          <div className="h-[41px] border-b border-neutral-300 p-0 flex flex-col justify-center px-[20px] bg-hbg">
            <Typography className="text-slate-600 font-[500]" fontWeight={500}>
              Location Details
            </Typography>
          </div>
          <CardContent className="flex flex-col gap-[20px] py-[20px]">
            {/* Pick Location */}
            <SelectLocationAcordingModule
              label="Pick Location"
              endPoint="/partConversion/pickLocation"
              value={pickLocation}
              onChange={setPickLocation}
            />

            {/* Drop Location */}
            <SelectLocationAcordingModule
              label="Drop Location"
              endPoint="/partConversion/dropLocation"
              value={dropLocation}
              onChange={setDropLocation}
            />
          </CardContent>

          <CardFooter className="h-[50px] p-0 flex items-center px-[20px] gap-[10px] justify-end">
            <LoadingButton
              type="button"
              onClick={handleReset}
              startIcon={<Icons.refresh fontSize="small" />}
              variant="contained"
              sx={{ background: "white", color: "red" }}
            >
              Reset
            </LoadingButton>
            <LoadingButton
              type="button"
              onClick={handleSubmit}
              loading={submitLoading}
              startIcon={<Icons.save fontSize="small" />}
              variant="contained"
            >
              Submit
            </LoadingButton>
          </CardFooter>
        </div>
      </div>

      {/* Right Panel - Components Tables */}
      <div className="h-full overflow-y-auto bg-white">
        <div className="h-[41px] border-b border-neutral-300 p-0 flex flex-col justify-center px-[20px] bg-hbg">
          <Typography className="text-slate-600 font-[500]" fontWeight={500}>
            Components
          </Typography>
        </div>
        <div className="grid grid-cols-2 h-[calc(100%-41px)]">
          {/* Initial Components Table */}
          <div className="border-r border-neutral-300">
            <InitialComponentsTable
              rowData={initialComponents}
              setRowData={setInitialComponents}
            />
          </div>

          {/* Final Components Table */}
          <div>
            <FinalComponentsTable
              rowData={finalComponents}
              setRowData={setFinalComponents}
            />
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModel
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Confirm Part Code Conversion"
        content={
          <div className="space-y-4">
            <Typography>
              Are you sure you want to convert these part codes?
            </Typography>
            <Typography>
              You have entered{" "}
              <strong>{initialComponents.length} Initial Components</strong> to
              convert
            </Typography>
          </div>
        }
        cancelText="Cancel"
        confirmText="Continue"
        onConfirm={confirmSubmit}
      />
    </div>
  );
};

export default PartCodeConversion;
