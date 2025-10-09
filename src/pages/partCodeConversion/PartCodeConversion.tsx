import React, { useEffect, useState } from "react";
import { Typography, TextField, Button } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { showToast } from "@/utils/toasterContext";
import { Icons } from "@/components/icons";
import SelectLocationAcordingModule from "@/components/reusable/SelectLocationAcordingModule";
import SelectCostCenter from "@/components/reusable/SelectCostCenter";
import AntCompSelect from "@/components/reusable/antSelecters/AntCompSelect";
import SimpleInitialComponentsTable from "@/table/partCodeConversion/SimpleInitialComponentsTable";
import SimpleFinalComponentsTable from "@/table/partCodeConversion/SimpleFinalComponentsTable";
import {
  setpickLcn,
  setDropLcn,
  submitPartCodeConversion,
  fetchComponentStock,
  clearStockInfo,
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
  const { submitLoading, stockInfo, stockLoading } = useAppSelector(
    (state) => state.partCodeConversion
  );

  // Form states for Initial Component
  const [initialComponent, setInitialComponent] = useState<any>(null);
  const [initialQty, setInitialQty] = useState<number>(0);
  const [pickLocation, setPickLocation] = useState<any>(null);

  // Form states for Final Component
  const [finalComponent, setFinalComponent] = useState<any>(null);
  const [finalQty, setFinalQty] = useState<number>(0);
  const [dropLocation, setDropLocation] = useState<any>(null);

  // Cost Center states
  const [fromCostCenter, setFromCostCenter] = useState<any>(null);
  const [toCostCenter, setToCostCenter] = useState<any>(null);

  // Table data
  const [initialComponents, setInitialComponents] = useState<
    InitialComponent[]
  >([]);
  const [finalComponents, setFinalComponents] = useState<FinalComponent[]>([]);

  // Confirmation modal
  const [showConfirm, setShowConfirm] = useState(false);
  const [finalRemark, setFinalRemark] = useState("");

  // Handle adding initial component
  const handleAddInitialComponent = () => {
    if (!initialComponent) {
      showToast("Please select a component", "error");
      return;
    }
    if (!pickLocation) {
      showToast("Please select a pick location", "error");
      return;
    }
    if (initialQty <= 0) {
      showToast("Please enter a valid quantity", "error");
      return;
    }

    // Check if quantity exceeds available stock
    if (stockInfo && initialQty > stockInfo.balance) {
      showToast(
        `Quantity cannot exceed available stock (${stockInfo.balance})`,
        "error"
      );
      return;
    }

    const newComponent: InitialComponent = {
      id: Math.random().toString(36).substr(2, 9),
      component: initialComponent,
      quantity: initialQty,
      availableqty: stockInfo
        ? `${stockInfo.balance} ${stockInfo.uom || ""}`
        : "--",
      unit: stockInfo?.uom || "",
      isNew: true,
    };

    setInitialComponents([...initialComponents, newComponent]);

    // Reset form
    setInitialComponent(null);
    setInitialQty(0);
    // Clear stock info by dispatching clear action
    dispatch(clearStockInfo());
  };

  // Handle adding final component
  const handleAddFinalComponent = () => {
    if (!finalComponent) {
      showToast("Please select a component", "error");
      return;
    }
    if (!dropLocation) {
      showToast("Please select a drop location", "error");
      return;
    }
    if (finalQty <= 0) {
      showToast("Please enter a valid quantity", "error");
      return;
    }

    const newComponent: FinalComponent = {
      id: Math.random().toString(36).substr(2, 9),
      component: finalComponent,
      quantity: finalQty,
      unit: "",
      isNew: true,
    };

    setFinalComponents([...finalComponents, newComponent]);

    // Reset form
    setFinalComponent(null);
    setFinalQty(0);
  };

  // Handle submit
  const handleSubmit = () => {
    if (!pickLocation || !dropLocation) {
      showToast("Please select both pick and drop locations", "error");
      return;
    }

    if (!fromCostCenter || !toCostCenter) {
      showToast("Please select both from and to cost centers", "error");
      return;
    }

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
        fromCostCenter: fromCostCenter?.id || "",
        toCostCenter: toCostCenter?.id || "",
        initialComponents: initialComponents.map(
          (item) => item.component.value
        ),
        finalComponents: finalComponents.map((item) => item.component.value),
        initialQty: initialComponents.map((item) => item.quantity),
        finalQty: finalComponents.map((item) => item.quantity),
        remark: finalRemark,
      };

      dispatch(submitPartCodeConversion(payload)).then((result) => {
        if (result.payload.data.success) {
          showToast(
            result.payload.data.message ||
              "Part code conversion submitted successfully",
            "success"
          );
          handleReset();
        } else {
          showToast(
            result.payload.data.message ||
              "Failed to submit part code conversion",
            "error"
          );
        }
      });
    } catch (error) {
      showToast("Failed to submit part code conversion", "error");
    }
    setShowConfirm(false);
  };

  // Handle reset
  const handleReset = () => {
    setInitialComponents([]);
    setFinalComponents([]);
    setInitialComponent(null);
    setInitialQty(0);
    setPickLocation(null);
    setFinalComponent(null);
    setFinalQty(0);
    setDropLocation(null);
    setFromCostCenter(null);
    setToCostCenter(null);
    setFinalRemark("");
  };

  // Handle component selection for initial component
  const handleInitialComponentChange = (selectedValue: any) => {
    if (!selectedValue) {
      setInitialComponent(null);
      return;
    }

    // Check if this component is already selected in final components (form)
    if (finalComponent && selectedValue.value === finalComponent.value) {
      showToast(
        "This component is already selected in Final Component",
        "error"
      );
      return;
    }

    // Check if this component is already added in final components (table)
    const isInFinalTable = finalComponents.some(
      (comp) => comp.component.value === selectedValue.value
    );
    if (isInFinalTable) {
      showToast("This component is already added in Final Components", "error");
      return;
    }

    setInitialComponent(selectedValue);
    if (selectedValue && pickLocation) {
      dispatch(
        fetchComponentStock({
          component: selectedValue.value,
          location: pickLocation.value || pickLocation.code,
        })
      );
    }
  };

  // Handle component selection for final component
  const handleFinalComponentChange = (selectedValue: any) => {
    if (!selectedValue) {
      setFinalComponent(null);
      return;
    }

    // Check if this component is already selected in initial components (form)
    if (initialComponent && selectedValue.value === initialComponent.value) {
      showToast(
        "This component is already selected in Initial Component",
        "error"
      );
      return;
    }

    // Check if this component is already added in initial components (table)
    const isInInitialTable = initialComponents.some(
      (comp) => comp.component.value === selectedValue.value
    );
    if (isInInitialTable) {
      showToast(
        "This component is already added in Initial Components",
        "error"
      );
      return;
    }

    setFinalComponent(selectedValue);
  };

  useEffect(() => {
    dispatch(setpickLcn(pickLocation));
  }, [pickLocation]);

  useEffect(() => {
    dispatch(setDropLcn(dropLocation));
  }, [dropLocation]);

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col bg-white">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Section - Input Forms */}
        <div className="border-b border-gray-200 p-6 space-y-6">
          {/* First Line - Locations and Cost Centers */}
          <div className="flex gap-6">
            {/* From Cost Center */}
            <div className="w-60">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Cost Center
              </label>
              <SelectCostCenter
                variant="standard"
                value={fromCostCenter}
                onChange={setFromCostCenter}
                label=""
              />
            </div>
            {/* Pick Location */}
            <div className="w-60">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pick Location
              </label>
              <SelectLocationAcordingModule
                label=""
                endPoint="/partConversion/pickLocation"
                value={pickLocation}
                onChange={setPickLocation}
                varient="standard"
                size="small"
              />
            </div>

      {/* To Cost Center */}
      <div className="w-60">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Cost Center
              </label>
              <SelectCostCenter
                variant="standard"
                value={toCostCenter}
                onChange={setToCostCenter}
                label=""
              />
            </div>
            {/* Drop Location */}
            <div className="w-60">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Drop Location
              </label>
              <SelectLocationAcordingModule
                label=""
                endPoint="/partConversion/dropLocation"
                value={dropLocation}
                onChange={setDropLocation}
                varient="standard"
                size="small"
              />
            </div>

      
          </div>

          {/* Second Line - Components and Quantities */}
          <div className="flex gap-6">
            {/* Initial Component Section */}
            <div className="flex-1 border-r border-gray-200 pr-6">
              <div className="flex items-end gap-4">
                {/* Component Selection */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Initial Component
                  </label>
                  <AntCompSelect
                    value={initialComponent}
                    onChange={handleInitialComponentChange}
                  />
                </div>

                {/* Quantity */}
                <div className="w-32">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Qty
                  </label>
                  <TextField
                    type="number"
                    value={initialQty}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      if (
                        typeof stockInfo?.balance === "number" &&
                        value > stockInfo.balance
                      ) {
                        showToast(
                          "Quantity cannot exceed available stock",
                          "error"
                        );
                        return;
                      }
                      setInitialQty(parseFloat(e.target.value) || 0);
                    }}
                    placeholder="Qty"
                    fullWidth
                    size="small"
                    variant="standard"
                    inputProps={{ min: 0 }}
                  />
                </div>

                {/* Add Button */}
                <div className="w-24">
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Icons.add fontSize="small" />}
                    onClick={handleAddInitialComponent}
                    size="small"
                    fullWidth
                  >
                    Add
                  </Button>
                </div>
              </div>

              {/* Existing Stock Display */}
              <div className="text-sm text-gray-600 mt-2">
                Existing Stock:{" "}
                {stockLoading
                  ? "Loading..."
                  : stockInfo
                  ? `${stockInfo.balance} ${stockInfo.uom || ""}`
                  : "--"}
              </div>
            </div>

            {/* Final Component Section */}
            <div className="flex-1 pl-6">
              <div className="flex items-end gap-4">
                {/* Component Selection */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Final Component
                  </label>
                  <AntCompSelect
                    value={finalComponent}
                    onChange={handleFinalComponentChange}
                  />
                </div>

                {/* Quantity */}
                <div className="w-32">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Qty
                  </label>
                  <TextField
                    type="number"
                    value={finalQty}
                    onChange={(e) =>
                      setFinalQty(parseFloat(e.target.value) || 0)
                    }
                    placeholder="Qty"
                    fullWidth
                    size="small"
                    variant="standard"
                    inputProps={{ min: 0 }}
                  />
                </div>

                {/* Add Button */}
                <div className="w-24">
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Icons.add fontSize="small" />}
                    onClick={handleAddFinalComponent}
                    size="small"
                    fullWidth
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Added Components */}
        <div className="flex-1 flex flex-col">
          <div className="h-[50px] border-b border-gray-200 flex items-center justify-between px-6 bg-gray-50">
            <Typography className="text-gray-700 font-medium">
              Added Components
            </Typography>
            <div className="flex gap-2">
              <Button
                variant="outlined"
                color="error"
                startIcon={<Icons.close fontSize="small" />}
                onClick={handleReset}
                size="small"
              >
                X Clear
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<Icons.check fontSize="small" />}
                onClick={handleSubmit}
                size="small"
                disabled={submitLoading}
              >
                ✓ Submit
              </Button>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 overflow-hidden">
            {/* Initial Components List */}
            <div className="border-r border-gray-200 flex flex-col">
              <div className="h-[40px] border-b border-gray-200 flex items-center px-4 bg-gray-50">
                <Typography className="text-gray-600 font-medium text-sm">
                  Initial Components
                </Typography>
              </div>
              <div className="flex-1 overflow-y-auto">
                <SimpleInitialComponentsTable
                  rowData={initialComponents}
                  setRowData={setInitialComponents}
                />
              </div>
            </div>

            {/* Final Components List */}
            <div className="flex flex-col">
              <div className="h-[40px] border-b border-gray-200 flex items-center px-4 bg-gray-50">
                <Typography className="text-gray-600 font-medium text-sm">
                  Final Components
                </Typography>
              </div>
              <div className="flex-1 overflow-y-auto">
                <SimpleFinalComponentsTable
                  rowData={finalComponents}
                  setRowData={setFinalComponents}
                />
              </div>
            </div>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Final Remark (Optional)
              </label>
              <TextField
                multiline
                rows={3}
                value={finalRemark}
                onChange={(e) => setFinalRemark(e.target.value)}
                placeholder="Enter any additional remarks..."
                fullWidth
                size="small"
                variant="outlined"
              />
            </div>
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
