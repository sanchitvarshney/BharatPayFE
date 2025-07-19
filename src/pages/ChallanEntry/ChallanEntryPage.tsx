import React, { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import {
  TextField,
  FormControl,
  InputLabel,
  FilledInput,
  FormHelperText,
  Typography,
} from "@mui/material";
import { Icons } from "@/components/icons";
import { useAppSelector } from "@/hooks/useReduxHook";
import { showToast } from "@/utils/toasterContext";
import ImeiTable from "@/table/dispatch/ImeiTable";
import { LoadingButton } from "@mui/lab";

type RowData = {
  imei: string;
  srno: string;
  productKey: string;
  serialNo: number;
  modalNo: string;
  deviceSku: string;
  imei2?: string;
};

type FormDataType = {
  challanNumber: string;
};

const ChallanEntryPage: React.FC = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [imei, setImei] = useState<string>("");
  const { deviceDetailLoading } = useAppSelector(
    (state) => state.batteryQcReducer
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormDataType>({
    defaultValues: {
      challanNumber: "",
    },
  });

  const onImeiSubmit = (imei: string) => {
    if (!imei.trim()) return;

    // Check for duplicates
    const isDuplicate = rowData.some((row) => row.imei === imei);
    if (isDuplicate) {
      showToast("IMEI already exists in the table", "warning");
      return;
    }

    // Add to table (you can integrate with your API here)
    const newRow: RowData = {
      imei: imei,
      srno: `SR${Date.now()}`, // Generate serial number
      productKey: `PK${Date.now()}`, // Generate product key
      serialNo: rowData.length + 1,
      modalNo: "Device Model", // You can fetch this from API
      deviceSku: "SKU001", // You can fetch this from API
    };

    setRowData((prev) => [...prev, newRow]);
    setImei("");
  };

  const onSubmit: SubmitHandler<FormDataType> = (data) => {
    if (!data.challanNumber.trim()) {
      showToast("Please enter a challan number", "error");
      return;
    }

    if (rowData.length === 0) {
      showToast("Please add at least one IMEI/Serial number", "error");
      return;
    }

    // Here you can submit the data to your API
    console.log("Challan Number:", data.challanNumber);
    console.log("Row Data:", rowData);

    showToast("Data submitted successfully", "success");

    // Reset form
    setRowData([]);
    setImei("");
  };

  return (
    <div className="bg-white h-full flex">
      {/* Left Side - Challan Number Input */}
      <div className="w-1/3 border-r border-neutral-300 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Icons.files />
          <h2 className="text-lg font-semibold">Challan Entry</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            name="challanNumber"
            control={control}
            rules={{
              required: { value: true, message: "Challan number is required" },
            }}
            render={({ field }) => (
              <FormControl
                error={!!errors.challanNumber}
                fullWidth
                variant="filled"
              >
                <InputLabel htmlFor="challanNumber">Challan Number</InputLabel>
                <FilledInput
                  {...field}
                  error={!!errors.challanNumber}
                  id="challanNumber"
                  type="text"
                  placeholder="Enter challan number"
                />
                {errors.challanNumber && (
                  <FormHelperText>
                    {errors.challanNumber.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />

          <div className="pt-4">
            <LoadingButton
              type="submit"
              variant="contained"
              fullWidth
              startIcon={<Icons.save />}
            >
              Submit
            </LoadingButton>
          </div>
        </form>
      </div>

      {/* Right Side - IMEI/Serial Number Table */}
      <div className="w-2/3 flex flex-col">
        <div className="p-6 border-b border-neutral-300">
          <div className="flex items-center gap-4 mb-4">
            <Typography variant="h6" className="font-semibold">
              Device Entry
            </Typography>
          </div>

          {/* IMEI Input */}
          <div className="flex items-center gap-4">
            <FormControl sx={{ width: "400px" }} variant="outlined">
              <TextField
                value={imei}
                label="IMEI/Serial Number"
                onChange={(e) => setImei(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onImeiSubmit(imei);
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <div className="flex items-center">
                      {deviceDetailLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
                      ) : (
                        <Icons.qrScan className="text-gray-400" />
                      )}
                    </div>
                  ),
                }}
              />
            </FormControl>

            {/* Statistics */}
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="font-semibold text-blue-600">
                  Total Devices:{" "}
                </span>
                <span className="text-gray-800">{rowData.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1">
          <ImeiTable
            setRowdata={setRowData}
            rowData={rowData}
            module="swipedevice"
          />
        </div>
      </div>
    </div>
  );
};

export default ChallanEntryPage;
