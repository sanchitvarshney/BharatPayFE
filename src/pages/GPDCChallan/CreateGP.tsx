import React, { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getPertCodesync } from "@/features/production/MaterialRequestWithoutBom/MRRequestWithoutBomSlice";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { getSkuAsync } from "@/features/wearhouse/Divicemin/devaiceMinSlice";
import { resetUploadFileData } from "@/features/master/BOM/BOMSlice";
import {
  createGPDC,
  clearGPDCData,
} from "@/features/GPDCChallan/GPDCChallanSlice";
import { showToast } from "@/utils/toasterContext";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import SaveIcon from "@mui/icons-material/Save";
import ConfirmationModel from "@/components/reusable/ConfirmationModel";
import { generateUniqueId } from "@/utils/uniqueid";
import MasterGatePassTable from "@/table/master/MasterGatePassTable";
import SelectLocationAcordingModule, {
  LocationType,
} from "@/components/reusable/SelectLocationAcordingModule";
interface RowData {
  id: string;
  component: { lable: string; value: string } | null;
  qty: number;
  isNew: boolean;
  remark: string;
}

type FormState = {
  type: string;
  name: string;
  mobile: string;
  email: string;
  address: string;
  narration: string;
  location: LocationType | null;
};
const CreateGP: React.FC = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [alert, setAlert] = useState<boolean>(false);
  const [methodchange, setMethodChange] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { createGPDCLoading } = useAppSelector((state) => state.gpdcChallan);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormState>({
    defaultValues: {
      type: "RGP",
      name: "",
      mobile: "",
      email: "",
      address: "",
      narration: "",
      location: null,
    },
  });

  const addRow = useCallback(() => {
    const newId = generateUniqueId();
    const newRow: RowData = {
      id: newId,
      component: null,
      qty: 0,
      isNew: true,
      remark: "",
    };
    setRowData((prev) => [newRow, ...prev]);
  }, [rowData]);

  // const checkRequiredFields = (data: RowData[]) => {
  //   let hasErrors = false;
  //   const requiredFields: Array<keyof RowData> = ["component", "qty"];
  //   const miss = data.map((item) => {
  //     const missingFields: string[] = [];
  //     requiredFields.forEach((field) => {
  //       // Check if the required field is empty
  //       if (
  //         item[field] === "" ||
  //         item[field] === 0 ||
  //         item[field] === undefined ||
  //         item[field] === null
  //       ) {
  //         missingFields.push(field);
  //       }
  //     });

  //     if (missingFields.length > 0) {
  //       return `${item.id}`;
  //     }
  //   });

  //   if (miss.filter((item) => item !== undefined).length > 0) {
  //     showToast(
  //       `Some required fields are empty: ${miss
  //         .filter((item) => item !== undefined)
  //         .reverse()
  //         .join(", ")}`,
  //       "error"
  //     );
  //     hasErrors = true;
  //   }

  //   return hasErrors;
  // };

  const onSubmit: SubmitHandler<FormState> = (data) => {
    if (rowData.length === 0) {
      showToast("Add Material Details", "error");
      return;
    }

    // Validate row data
    const invalidRows = rowData.filter((row) => !row.component || row.qty <= 0);
    if (invalidRows.length > 0) {
      showToast("Please fill all component details and quantities", "error");
      return;
    }

    const components = rowData.map((row) => row.component?.value || "");
    const qty = rowData.map((row) => row.qty);
    const remark = rowData.map((row) => row.remark || "");

    // Dispatch create GPDC action
    dispatch(
      createGPDC({
        type: data.type,
        name: data.name,
        mobile: data.mobile,
        email: data.email,
        address: data.address,
        //@ts-ignore
        fromLocation: data.location,
        narration: data.narration,
        components,
        quantity: qty,
        remark,
      })
    ).then((res: any) => {
      if (res.payload?.data?.success) {
        setRowData([]);
        reset();
        dispatch(clearGPDCData());
      }
    });
  };

  useEffect(() => {
    dispatch(getPertCodesync(null));
    dispatch(getSkuAsync(null));
  }, []);
  return (
    <>
      <ConfirmationModel
        open={alert}
        onClose={() => setAlert(false)}
        title="Are you sure?"
        content="Are you sure you want to reset all the fields ?"
        onConfirm={() => {
          reset();
          setRowData([]);
          setAlert(false);
          dispatch(resetUploadFileData());
        }}
        confirmText="Continue"
        cancelText="Cancel"
      />
      <ConfirmationModel
        open={methodchange}
        onClose={() => setMethodChange(false)}
        title="Are you sure?"
        content="Are you sure you want to reset all the fields ?"
        onConfirm={() => {
          reset();
          setRowData([]);
          setMethodChange(false);
          dispatch(resetUploadFileData());
        }}
        confirmText="Continue"
        cancelText="Cancel"
      />
      <div className="h-[calc(100vh-100px)] grid grid-cols-[500px_1fr]  bg-white">
        <div className="h-full overflow-y-auto border-r border-neutral-300 ">
          <form onSubmit={handleSubmit(onSubmit)} className="p-[20px]">
            <div className="grid grid-cols-2 gap-[20px] mt-[10px]">
              <div>
                <Controller
                  name="type"
                  control={control}
                  rules={{ required: "Type is required" }}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Type
                      </InputLabel>
                      <Select
                        {...field}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Type"
                      >
                        <MenuItem value={"RGP"}>
                          RGP(Returnable Gate Pass)
                        </MenuItem>
                        <MenuItem value={"NRGP"}>
                          NRGP(Non Returnable Gate Pass)
                        </MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
                {errors.type && (
                  <p className="text-red-500 text-[12px]">
                    {errors.type.message}
                  </p>
                )}
              </div>
              <div>
                <TextField
                  fullWidth
                  label="Name of the Recipient"
                  {...register("name", {
                    required: "Name of the Recipient is required",
                  })}
                />
                {errors.name && (
                  <p className="text-red-500 text-[12px]">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <TextField
                  fullWidth
                  label="Mobile"
                  {...register("mobile", { required: "Mobile is required" })}
                />
                {errors.mobile && (
                  <p className="text-red-500 text-[12px]">
                    {errors.mobile.message}
                  </p>
                )}
              </div>
              <div>
                <TextField
                  fullWidth
                  label="Email"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="text-red-500 text-[12px]">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="col-span-2">
                <Controller
                  name="location"
                  control={control}
                  rules={{ required: "Location is required" }}
                  render={({ field }) => (
                    <SelectLocationAcordingModule
                      endPoint={"/gpdc/pickLocation"}
                      error={!!errors.location}
                      helperText={errors.location?.message}
                      value={field.value as LocationType}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                  )}
                />
                {errors.location && (
                  <p className="text-red-500 text-[12px]">
                    {errors.location.message}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-[30px]">
              <TextField
                multiline
                rows={3}
                fullWidth
                label="Address"
                {...register("address", { required: "Address is required" })}
              />
              {errors.address && (
                <p className="text-red-500 text-[12px]">
                  {errors.address.message}
                </p>
              )}
            </div>
            <div className="mt-[30px]">
              <TextField
                multiline
                rows={3}
                fullWidth
                label="Narration"
                {...register("narration", {
                  required: "Narration is required",
                })}
              />
              {errors.narration && (
                <p className="text-red-500 text-[12px]">
                  {errors.narration.message}
                </p>
              )}
            </div>
            <div className="h-[50px] p-0 flex items-center px-[20px]  gap-[10px] justify-end mt-[30px]">
              <Button
                disabled={createGPDCLoading}
                onClick={() => {
                  rowData.length > 0 ? setAlert(true) : reset();
                }}
                type="button"
                startIcon={<RefreshIcon fontSize="small" />}
                variant={"contained"}
                sx={{ backgroundColor: "white", color: "red" }}
              >
                Reset
              </Button>
              <LoadingButton
                loadingPosition="start"
                type="submit"
                variant="contained"
                loading={createGPDCLoading}
                startIcon={<SaveIcon fontSize="small" />}
              >
                Submit
              </LoadingButton>
            </div>
          </form>
        </div>
        <div>
          <MasterGatePassTable
            addRow={addRow}
            rowData={rowData}
            setRowdata={setRowData}
          />
        </div>
      </div>
    </>
  );
};

export default CreateGP;
