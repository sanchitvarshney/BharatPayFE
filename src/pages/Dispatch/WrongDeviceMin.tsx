import React, { useState, useRef } from "react";

import { showToast } from "@/utils/toasterContext";
import { useDispatch, useSelector } from "react-redux";
import { getWorkingData } from "@/features/areaSlice/areaSlice";
import { Controller, useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { wrongDeviceMin } from "@/features/Dispatch/DispatchSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import dayjs from "dayjs";
import SelectLocationAcordingModule from "@/components/reusable/SelectLocationAcordingModule";
import FormTables from "@/table/dispatch/FormTables";
import { QrCodeScanner } from "@mui/icons-material";

const CategoryData = [
  { value: "abb8d54f-6862-4978-ab41-a69fdaaab6ec", text: "BPe Swipe Machine" },
  { value: "bdc8d26f-47c3-4bm7-a8c6-753bc77547ld", text: "Walnut" },
  { value: "051aec9b-fdd6-4d34-848a-25b9f1b6252a", text: "Other" },
];
const PartnerData = [
  { value: "eCOM", text: "eCommerce" },
  { value: "eKart", text: "eKart" },
  { value: "dVery", text: "Delhivery" },
  { value: "DTDC", text: "DTDC" },
  { value: "F1", text: "F1" },
  { value: "PLADA", text: "PLADA" },
  { value: "BILLBOX", text: "BILLBOX" },
  { value: "XPRESSBEES", text: "XPRESSBEES" },
  { value: "DARTX", text: "DARTX" },
  { value: "NANDAN", text: "NANDAN" },
  { value: "MARK", text: "MARK" },
  { value: "ShipRocket", text: "ShipRocket" },
  { value: "DSKCargo", text: "DSK Cargo and Logistics" },
  { value: "ShadowFox", text: "ShadowFox" },
  { value: "GMS", text: "GMS" },
  { value: "BLUEDART", text: "BLUEDART" },
];

// AWB Length validation mapping based on partner
const getAWBLengthRange = (
  partnerId: string
): { min: number; max: number } | null => {
  switch (partnerId) {
    case "eCOM":
      return { min: 9, max: 12 };
    case "eKart":
      return { min: 10, max: 16 };
    case "dVery":
      return { min: 13, max: 14 };
    case "DTDC":
      return { min: 8, max: 14 };
    case "F1":
      return { min: 3, max: 10 };
    case "PLADA":
      return { min: 8, max: 10 };
    case "BILLBOX":
      return { min: 8, max: 10 };
    case "XPRESSBEES":
      return { min: 14, max: 15 };
    case "DARTX":
      return { min: 8, max: 10 };
    case "NANDAN":
      return { min: 8, max: 13 };
    case "DSKCargo":
      return { min: 7, max: 13 };
    case "ShipRocket":
      return { min: 7, max: 13 };
    case "ShadowFox":
      return { min: 12, max: 18 };
    case "GMS":
      return { min: 9, max: 10 };
    case "BLUEDART":
      return { min: 11, max: 13 };
    default:
      return null;
  }
};

const WrongDeviceMin: React.FC = () => {
  const [imei, setImei] = useState<string>("");
  const [awbNo, setAwbNo] = useState<string>("");
  const [serialNo, setSerialNo] = useState<string>("");
  const [combinedRowData, setCombinedRowData] = useState<any[]>([]);
  const dispatch: any = useDispatch();
  const appDispatch = useAppDispatch();
  const { workingDataLoading } = useSelector((state: any) => state.placeMaster);
  const { submitCustomFormLoading } = useAppSelector((state) => state.dispatch);

  // Refs for input fields to manage focus
  const awbNoInputRef = useRef<HTMLInputElement>(null);
  const serialNoInputRef = useRef<HTMLInputElement>(null);
  const imeiInputRef = useRef<HTMLInputElement>(null);

  // Helper function to generate unique ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Helper function to validate AWB length based on partner
  const validateAWBLength = (awbValue: string, partnerId: string): boolean => {
    if (!partnerId) {
      showToast("Please select a partner first", "error");
      return false;
    }

    const lengthRange = getAWBLengthRange(partnerId);
    if (!lengthRange) {
      showToast("Invalid delivery partner selected.", "error");
      return false;
    }

    const awbLength = awbValue.trim().length;
    if (awbLength < lengthRange.min || awbLength > lengthRange.max) {
      showToast(
        `AWB length must be between ${lengthRange.min} and ${lengthRange.max} characters for the selected partner.`,
        "error"
      );
      return false;
    }

    return true;
  };

  // Helper function to add or update row
  const addOrUpdateRow = (
    field: "awbNo" | "serialNo" | "imeiNo",
    value: string
  ) => {
    const trimmedValue = value.trim();

    // Validate AWB length if it's an AWB field
    if (field === "awbNo") {
      if (!validateAWBLength(trimmedValue, formValues.partnerId)) {
        return;
      }
    }

    setCombinedRowData((prevData) => {
      // Check for duplicate across all rows and all fields (AWB, Serial, IMEI)
      const isDuplicate = prevData.some((row) => {
        if (trimmedValue === "") return false;
        // Check if the scanned value exists in any field of any row
        return (
          row.awbNo === trimmedValue ||
          row.serialNo === trimmedValue ||
          row.imeiNo === trimmedValue
        );
      });

      if (isDuplicate) {
        const deviceType =
          field === "awbNo" ? "AWB" : field === "serialNo" ? "Serial" : "IMEI";
        showToast(
          `Device already scanned. This ${deviceType} number has already been added.`,
          "error"
        );
        return prevData;
      }

      // Check if last row exists and the same field is empty in that row
      const lastRow = prevData[0]; // Since we add to the beginning, first item is the last added
      const canUpdateLastRow = lastRow && !lastRow[field];

      if (canUpdateLastRow) {
        // Update the last row with the new value for this field
        return prevData.map((row, index) =>
          index === 0 ? { ...row, [field]: trimmedValue } : row
        );
      } else {
        // Create a new row with only the entered field filled
        const newRow = {
          id: generateId(),
          awbNo: field === "awbNo" ? trimmedValue : "",
          serialNo: field === "serialNo" ? trimmedValue : "",
          imeiNo: field === "imeiNo" ? trimmedValue : "",
        };
        return [newRow, ...prevData];
      }
    });
  };

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      categoryId: "",
      locationId: null,
      partnerId: "",
    },
  });

  const formValues = watch();

  const onSubmit = (data: any) => {
    const payload: any = {
      from: dayjs(data?.date[0]).format("DD-MM-YYYY"),
      to: dayjs(data?.date[1]).format("DD-MM-YYYY"),
      department: data?.departmentId,
      place: data?.areaId,
    };

    //@ts-ignore
    dispatch(getWorkingData(payload)).then((res: any) => {
      if (res.payload?.data?.success) {
        toast({
          description: res.payload.data.message,
          variant: "success",
          className: "font-[500]",
          duration: 1500,
        });
      } else {
        toast({
          description: res.payload?.data?.message || "Something went wrong",
          variant: "destructive",
          className: "font-[500]",
          duration: 1500,
        });
      }
    });
  };

  const handleSubmitForm = () => {
    // Validate form fields
    if (!formValues.categoryId) {
      showToast("Please select a category", "error");
      return;
    }
    if (!formValues.locationId) {
      showToast("Please select a location", "error");
      return;
    }
    if (!formValues.partnerId) {
      showToast("Please select a partner", "error");
      return;
    }
    if (combinedRowData.length === 0) {
      showToast(
        "Please add at least one device (AWB, Serial, or IMEI)",
        "error"
      );
      return;
    }

    // Prepare payload
    const payload = {
      categoryId: formValues.categoryId,
      locationId: formValues.locationId?.code || formValues.locationId,
      partnerId: formValues.partnerId,
      awbNo: combinedRowData.map((row) => row.awbNo || ""),
      serialNo: combinedRowData.map((row) => row.serialNo || ""),
      imeiNo: combinedRowData.map((row) => row.imeiNo || ""),
      remark: combinedRowData.map((row) => row.remark || ""),
    };

    // Submit the form
    appDispatch(wrongDeviceMin(payload)).then((res: any) => {
      if (res.payload?.data?.success) {
        // Reset form on success
        reset();
        setCombinedRowData([]);
        setAwbNo("");
        setSerialNo("");
        setImei("");
      } else {
        showToast(
          res.payload?.data?.message || "Something went wrong",
          "error"
        );
      }
    });
  };

  return (
    <div className=" w-full   bg-white">
      <form onSubmit={handleSubmit(onSubmit)} className="p-[20px]">
        <div className="w-full grid grid-cols-3 gap-[20px] border-r border-neutral-300">
          <div>
            <Controller
              name="categoryId"
              control={control}
              rules={{
                required: "Category  is required",
              }}
              render={({ field }) => (
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="area-select-label">
                    Select Category
                  </InputLabel>
                  <Select
                    {...field}
                    labelId="area-select-label"
                    label="Select Category"
                  >
                    {CategoryData?.map((item: any) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.text}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            {errors.date && (
              <span className=" text-[12px] text-red-500">
                {/* @ts-ignore */}
                {errors.date.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-[10px]">
            <div>
              <Controller
                name="locationId"
                control={control}
                rules={{ required: "Location is required" }}
                render={({ field }) => (
                  <SelectLocationAcordingModule
                    endPoint="/deviceMin/device-inward-location"
                    value={field.value || null}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                    error={!!errors.locationId}
                    label="Location"
                  />
                )}
              />
            </div>
          </div>
          <div className="flex flex-col gap-[10px]">
            <div>
              <Controller
                name="partnerId"
                control={control}
                rules={{ required: "Partner is required" }}
                render={({ field }) => (
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="partner-select-label">
                      Select Partner
                    </InputLabel>
                    <Select
                      {...field}
                      labelId="partner-select-label"
                      label="Select Partner"
                    >
                      {PartnerData?.map((item: any) => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.text}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-[20px] my-[10px] ">
          {/* Awb no */}
          <div>
            <FormControl sx={{ width: "400px", mb: "10px" }} variant="outlined">
              <TextField
                rows={2}
                value={awbNo}
                label="AWB Device"
                id="standard-adornment-qty"
                aria-describedby="standard-weight-helper-text"
                inputProps={{
                  "aria-label": "weight",
                }}
                onChange={(e) => {
                  setAwbNo(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (awbNo.trim()) {
                      addOrUpdateRow("awbNo", awbNo);
                      setAwbNo("");
                      // Keep focus on AWB No field
                      setTimeout(() => {
                        awbNoInputRef.current?.focus();
                      }, 0);
                    }
                    e.preventDefault();
                  }
                }}
                inputRef={awbNoInputRef}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        {<QrCodeScanner />}
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </FormControl>
          </div>

          <div>
            <FormControl
              sx={{ width: "400px", mb: "10px" }}
              variant="outlined"
              disabled
            >
              <TextField
                rows={2}
                value={serialNo}
                disabled
                label="Serial Device"
                id="standard-adornment-qty"
                aria-describedby="standard-weight-helper-text"
                inputProps={{
                  "aria-label": "weight",
                }}
                onChange={(e) => {
                  setSerialNo(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (serialNo.trim()) {
                      addOrUpdateRow("serialNo", serialNo);
                      setSerialNo("");
                      // Keep focus on Serial No field
                      setTimeout(() => {
                        serialNoInputRef.current?.focus();
                      }, 0);
                    }
                    e.preventDefault();
                  }
                }}
                inputRef={serialNoInputRef}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        {<QrCodeScanner />}
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </FormControl>
          </div>
          {/* imie */}
          <div>
            <FormControl
              sx={{ width: "400px", mb: "10px" }}
              variant="outlined"
              disabled
            >
              <TextField
                rows={2}
                value={imei}
                disabled
                label="IMEI Device"
                id="standard-adornment-qty"
                aria-describedby="standard-weight-helper-text"
                inputProps={{
                  "aria-label": "weight",
                }}
                onChange={(e) => {
                  setImei(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (imei.trim()) {
                      addOrUpdateRow("imeiNo", imei);
                      setImei("");

                      setTimeout(() => {
                        awbNoInputRef.current?.focus();
                      }, 0);
                    }
                    e.preventDefault();
                  }
                }}
                inputRef={imeiInputRef}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        {<QrCodeScanner />}
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </FormControl>
          </div>
        </div>

        <div className="h-[calc(100vh-350px)] my-[10px]">
          <FormTables
            setRowdata={setCombinedRowData}
            rowData={combinedRowData}
          />
        </div>

        {/* Action Buttons Section */}
        <div className="border-t border-neutral-300 mt-[20px] pt-[20px]">
          <div className="h-[50px] p-0 flex items-center px-[20px] gap-[10px] justify-end">
            <Button
              onClick={() => {
                reset();
                setCombinedRowData([]);
                setAwbNo("");
                setSerialNo("");
                setImei("");
              }}
              variant="outlined"
              disabled={submitCustomFormLoading || workingDataLoading}
            >
              Reset
            </Button>
            <LoadingButton
              loadingPosition="start"
              onClick={handleSubmitForm}
              variant="contained"
              loading={submitCustomFormLoading}
              disabled={combinedRowData.length === 0 || workingDataLoading}
            >
              Submit
            </LoadingButton>
          </div>
        </div>
      </form>
    </div>
  );
};

export default WrongDeviceMin;
