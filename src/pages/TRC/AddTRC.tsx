import { CustomButton } from "@/components/reusable/CustomButton";
import { useCallback, useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getLocationAsync } from "@/features/production/MaterialRequestWithoutBom/MRRequestWithoutBomSlice";
import styled from "styled-components";
import { FaArrowRightLong } from "react-icons/fa6";
import AddtrcTable from "@/table/TRC/AddtrcTable";
import { addTrcAsync } from "@/features/trc/AddTrc/addtrcSlice";
import { AddtrcPayloadType } from "@/features/trc/AddTrc/addtrcType";
import { getIsueeList } from "@/features/common/commonSlice";
import {
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { Icons } from "@/components/icons";
import { LoadingButton } from "@mui/lab";
import { showToast } from "@/utils/toasterContext";
import { DeviceType } from "@/components/reusable/SelectSku";
import SelectSku from "@/components/reusable/SelectSku";
import { generateUniqueId } from "@/utils/uniqueid";
import { getDeviceDetail } from "@/features/production/Batteryqc/BatteryQcSlice";
import SelectLocationAcordingModule, {
  LocationType,
} from "@/components/reusable/SelectLocationAcordingModule";

interface RowData {
  remarks: string;
  id: string;
  isNew: boolean;
  issues: string[];
  IMEI: string;
}
type Formstate = {
  pickLocation: LocationType | null;
  putLocation: LocationType | null;
  remarks: string;
  sku: DeviceType | null;
};

const AddTRC = () => {
  const [imei, setImei] = useState<string>("");
  const [barcode, setBarcode] = useState<string>(""); // State for Barcode
  const [inputType, setInputType] = useState<"IMEI" | "Barcode" | "">("Barcode");
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [barcodeLoading , setBarcodeLoading] = useState<boolean>(false);
  const [location, setLocation] = useState<LocationType | null>(null);
  const [locationdetail, setLocationdetail] = useState<string>("--");
  const [final, setFinal] = useState<boolean>(false);
  const { locationData, craeteRequestData } = useAppSelector(
    (state) => state.materialRequestWithoutBom
  );
  const { addTrcLoading } = useAppSelector((state) => state.addTrc);
  const { deviceDetailLoading } = useAppSelector(
    (state) => state.batteryQcReducer
  );

  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<Formstate>({
    defaultValues: {
      pickLocation: null,
      putLocation: null,
      remarks: "",
    },
  });
  const addRow = useCallback(
    (imei: string) => {
      const newId = generateUniqueId();
      const newRow: RowData = {
        id: newId,
        remarks: "",
        isNew: true,
        IMEI: imei,
        issues: [],
      };
      setRowData((prev) => [newRow, ...prev]);
    },
    [rowData]
  );

  const onSubmit: SubmitHandler<Formstate> = (data) => {
    if (rowData.length === 0) {
      showToast("Please Add Material Details", "error");
      return;
    } else {
      let hasErrors = false;

      rowData.forEach((row) => {
        const missingFields: string[] = [];
        if (!row.IMEI) {
          missingFields.push("IMEI");
        }
        if (!row.issues.length) {
          missingFields.push("issues");
        }

        if (missingFields.length > 0) {
          showToast(
            `Row ${row.id}: Empty fields: ${missingFields.join(", ")}`,
            "error"
          );
          hasErrors = true;
        }
      });

      if (!hasErrors) {
        const issue = rowData.map((row) => row.issues);
        const device = rowData.map((row) => row.IMEI);
        const remark = rowData.map((row) => row.remarks);
        const payload: AddtrcPayloadType = {
          sku: data.sku?.id || "",
          issue,
          device,
          remark,
          comment: data.remarks,
          pickLocation: data.pickLocation?.code || "",
          putLocation: data.putLocation?.code || "",
        };
        dispatch(addTrcAsync(payload)).then((response: any) => {
          if (response.payload.data?.success) {
            showToast(
              `TRC Request Added Successfully -\n Txn ID : ${response.payload.data?.data?.refID}`,
              "success"
            );
            // reset();
            setRowData([]);
          }
        });
      }
    }
  };
  useEffect(() => {
    dispatch(getLocationAsync(null));
    dispatch(getIsueeList(null));
  }, []);
  useEffect(() => {
    if (location) {
      const locationDetail = locationData?.find(
        (item) => item.id === location?.code
      )?.specification;
      setLocationdetail(locationDetail || "");
    }
  }, [location]);

  const addIssueToRow = (barcode: string) => {  
    const updatedRows = rowData.map((row) => {
      // Check if the barcode is already included in the issues array
      if (!row.issues.includes(barcode)) {
        try {
          // Try to parse the barcode assuming it’s a JSON string
          const issuesArray = JSON.parse(barcode);
  
          // Extract the 'id' values into an array
          const idsArray = issuesArray.map((issue: any) => issue.id);
  
          // Add the unique ids to the row's issues array if not already included
          row.issues.push(...idsArray.filter((id: string) => !row.issues.includes(id)));
        } catch (e) {
          console.error("Invalid barcode JSON", e);
        }
      }
      return row;
    });
    setRowData(updatedRows); // Update the state with the new rows
  };
  
  
  
  const sanitizeData = (data: string) => {
    // Clean up data if needed (e.g., removing extraneous characters)
    return data.replace(/[^a-zA-Z0-9\s,.{}[\]":]/g, '');  // Example regex, adjust as necessary
  };
  
  const onScanComplete = (scannedData: string) => {
    try {
      // Sanitize and parse the data
      const parsedData = sanitizeData(scannedData);
      if (parsedData) {
        addIssueToRow(parsedData);  // Handle parsed data
        handleSubmit(onSubmit)(); 
      } else {
        console.error("Failed to parse QR data.");
      }
    } catch (error) {
      console.error("Error parsing QR data:", error);
    }
  };
  
  
  return (
    <div>
      {final ? (
        <div className="h-[calc(100vh-100px)] flex items-center justify-center bg-white">
          <div className="max-h-max max-w-max flex flex-col gap-[30px]">
            <Success>
              <div className="success-animation">
                <svg
                  className="checkmark"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 52 52"
                >
                  <circle
                    className="checkmark__circle"
                    cx="26"
                    cy="26"
                    r="25"
                    fill="none"
                  />
                  <path
                    className="checkmark__check"
                    fill="none"
                    d="M14.1 27.2l7.1 7.2 16.7-16.8"
                  />
                </svg>
              </div>
            </Success>
            <div className="flex items-center gap-[10px]">
              <p className="text-green-600">
                {craeteRequestData && craeteRequestData.message}
              </p>
            </div>
            <div className="flex items-center justify-center">
              <CustomButton
                onClick={() => setFinal(false)}
                className="flex items-center gap-[10px] bg-cyan-700 hover:bg-cyan-800"
              >
                Create New Request
                <FaArrowRightLong />
              </CustomButton>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[calc(100vh-100px)] overflow-y-hidden grid grid-cols-[450px_1fr]">
          <div className="h-full overflow-y-auto bg-white border-r border-neutral-300">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <div className="h-[41px] p-0 flex flex-col justify-center px-[20px] bg-hbg border-b border-neutral-300">
                  <Typography className="text-slate-600 " fontWeight={500}>
                    Header Details
                  </Typography>
                </div>
                <div className="flex flex-col gap-[20px] p-[20px]">
                  <Controller
                    name="sku"
                    control={control}
                    rules={{ required: "SKU is required" }}
                    render={({ field }) => (
                      <SelectSku
                        error={!!errors.sku}
                        helperText={errors.sku?.message}
                        value={field.value}
                        label="SKU"
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                      />
                    )}
                  />
                  <div>
                    <Controller
                      name="pickLocation"
                      control={control}
                      rules={{ required: "Pick Location is required" }}
                      render={({ field }) => (
                        <SelectLocationAcordingModule
                          endPoint="/trc/add/pickLocation"
                          error={!!errors.pickLocation}
                          helperText={errors.pickLocation?.message}
                          value={field.value}
                          label="Pick Location"
                          onChange={(value) => {
                            field.onChange(value);
                            setLocation(value);
                          }}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <Controller
                      name="putLocation"
                      control={control}
                      rules={{ required: "Location Location is required" }}
                      render={({ field }) => (
                        <SelectLocationAcordingModule
                          endPoint="/trc/add/putLocation"
                          error={!!errors.putLocation}
                          helperText={errors.putLocation?.message}
                          value={field.value}
                          label="Drop Location"
                          onChange={(value) => {
                            field.onChange(value);
                            setLocation(value);
                          }}
                        />
                      )}
                    />
                  </div>
                  <div className="flex gap-[10px] items-center">
                    <Typography>Location Details :</Typography>
                    <span className="text-[14px] text-slate-600">
                      {locationdetail}
                    </span>
                  </div>
                  <div>
                    <TextField
                      multiline
                      rows={3}
                      fullWidth
                      label="Remarks"
                      className="h-[100px] resize-none"
                      {...register("remarks")}
                    />
                  </div>
                </div>
                <div className="h-[50px] p-0 flex items-center px-[20px]  gap-[10px] justify-end">
                  <Button
                    type="button"
                    onClick={() => {
                      reset();
                      setRowData([]);
                    }}
                    startIcon={<Icons.refresh />}
                    variant={"contained"}
                    sx={{ color: "red", background: "white" }}
                  >
                    Reset
                  </Button>
                  <LoadingButton
                    loadingPosition="start"
                    loading={addTrcLoading}
                    startIcon={<Icons.save />}
                    variant="contained"
                    type="submit"
                  >
                    Submit
                  </LoadingButton>
                </div>
              </div>
            </form>
          </div>
          <div>
            <div className="h-[100px] bg-white flex flex-col sm:flex-row items-center px-4 gap-4 sm:gap-8 border-b border-neutral-300">
              {/* IMEI/Serial Number Input */}
              <FormControl className="w-full sm:w-[250px] md:w-[400px]">
                <InputLabel htmlFor="outlined-adornment-IMEI/Serial">
                  IMEI/Serial Number
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-IMEI/Serial"
                  value={imei}
                  onChange={(e) => 
                    setImei(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (imei) {
                        const isUnique = !rowData.some(
                          (row) => row.IMEI === imei
                        );

                        if (!isUnique) {
                          showToast("Duplicate IMEI found", "warning");
                          return;
                        }
                        dispatch(getDeviceDetail(imei.slice(0, 15))).then(
                          (res: any) => {
                            if (res.payload.data.success) {
                              addRow(res.payload.data?.data[0]?.device_imei);
                              setImei("");
                            }
                          }
                        );
                      }
                    }
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      {deviceDetailLoading ? (
                        <CircularProgress size={25} />
                      ) : (
                        <Icons.qrScan />
                      )}
                    </InputAdornment>
                  }
                  className="w-full"
                  label="IMEI/Serial Number"
                />
              </FormControl>

              {/* Barcode Input (Only shown when `inputType` is "Barcode") */}
              {inputType === "Barcode" && (
                <FormControl className="w-full sm:w-[250px] md:w-[400px] mt-4 sm:mt-0">
                  <InputLabel htmlFor="outlined-adornment-barcode">
                    Issues Barcode
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-barcode"
                    value={barcode}
                    onChange={(e) => {setBarcode(e.target.value);setBarcodeLoading(true)}}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && barcode) {
                        setBarcode(""); // Clear input after adding
                        onScanComplete(barcode);
                        setBarcodeLoading(false);
                      }
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        {barcodeLoading ? (
                        <CircularProgress size={25} />
                      ) : (
                        <Icons.qrScan />
                      )}
                      </InputAdornment>
                    }
                    className="w-full"
                    label="Barcode"
                  />
                </FormControl>
              )}

              {/* Input Type Selector (IMEI / Barcode Radio Buttons) */}
              <FormControl className="w-full sm:w-auto mt-4 sm:mt-0">
                <RadioGroup
                  row
                  aria-labelledby="input-type-group"
                  name="inputType"
                  value={inputType}
                  onChange={(e) => {
                    const type = e.target.value;
                    if (type === "IMEI") {
                      setBarcode(""); // Clear barcode
                      setInputType("IMEI");
                    } else if (type === "Barcode") {
                      setImei(""); // Clear IMEI
                      setInputType("Barcode");
                    }
                  }}
                  className="w-full"
                >
                  <FormControlLabel
                    value="IMEI"
                    control={<Radio />}
                    label="Manual"
                  />
                  <FormControlLabel
                    value="Barcode"
                    control={<Radio />}
                    label="Barcode"
                  />
                </RadioGroup>
              </FormControl>
            </div>

            <AddtrcTable setRowdata={setRowData} rowData={rowData} />
          </div>
        </div>
      )}
    </div>
  );
};

const Success = styled.div`
  .checkmark {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    display: block;
    stroke-width: 2;
    stroke: #4bb71b;
    stroke-miterlimit: 10;
    box-shadow: inset 0px 0px 0px #4bb71b;
    animation: fill 0.4s ease-in-out 0.4s forwards,
      scale 0.3s ease-in-out 0.9s both;
    position: relative;
    top: 5px;
    right: 5px;
    margin: 0 auto;
  }
  .checkmark__circle {
    stroke-dasharray: 166;
    stroke-dashoffset: 166;
    stroke-width: 2;
    stroke-miterlimit: 10;
    stroke: #4bb71b;
    fill: #fff;
    animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
  }

  .checkmark__check {
    transform-origin: 50% 50%;
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
  }

  @keyframes stroke {
    100% {
      stroke-dashoffset: 0;
    }
  }

  @keyframes scale {
    0%,
    100% {
      transform: none;
    }

    50% {
      transform: scale3d(1.1, 1.1, 1);
    }
  }

  @keyframes fill {
    100% {
      box-shadow: inset 0px 0px 0px 30px #4bb71b;
    }
  }
`;

export default AddTRC;
