import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import MaterialInvardUploadDocumentDrawer from "@/components/Drawers/wearhouse/MaterialInvardUploadDocumentDrawer";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { clearaddressdetail } from "@/features/wearhouse/Divicemin/devaiceMinSlice";
import {
  resetDocumentFile,
  resetFormData,
} from "@/features/wearhouse/Rawmin/RawMinSlice";
import {
  createTransferRequest,
  getPertCodesync,
} from "@/features/production/MaterialRequestWithoutBom/MRRequestWithoutBomSlice";
import {
  Divider,
  InputLabel,
  FormHelperText,
  FormControl,
  Step,
  StepLabel,
  Stepper,
  Typography,
  Select,
  MenuItem,
  OutlinedInput,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Icons } from "@/components/icons";
import { showToast } from "@/utils/toasterContext";
import ConfirmationModel from "@/components/reusable/ConfirmationModel";
import Success from "@/components/reusable/Success";
import { DeviceType } from "@/components/reusable/SelectSku";
import { getAllBranch } from "@/features/Dispatch/DispatchSlice";
import { getDispatchFromDetail } from "@/features/master/client/clientSlice";
import { CostCenterType } from "@/components/reusable/SelectCostCenter";
import SelectDeviceWithType from "@/components/reusable/SelectDeviceWithType";
import axiosInstance from "@/api/axiosInstance";
import ManageBranchTransfer from "./ManageBranchTransfer";
import ComponentTable from "@/pages/branchTransfer/ComponentTable";

type FormData = {
  product: DeviceType | null;
  toLocation: any;
  fromLocation: any;
  fromBranch: any;
  toBranch: any;
  quantity: number;
  remark: string;
  cc: CostCenterType | null;
  type: string;
  branchType: string;
  fromLocationAddress: string;
  toLocationAddress: string;
  fromLocationName: string;
  toLocationName: string;
  mode: string;
  referenceNumber: string;
  otherTerms: string;
  termsOfDelivery: string;
  docNo: string;
  dispatchThrough: string;
  destination: string;
  transferType: string;
};

const CreateBranchTransferPage: React.FC = () => {
  const [alert, setAlert] = useState<boolean>(false);
  const [upload, setUpload] = useState<boolean>(false);
  const [rowData, setRowData] = useState<any>([]);
  const [dispatchNo, setDispatchNo] = useState<string>("");
  const [fromLocationList, setFromLocationList] = useState<any[]>([]);
  const [toLocationList, setToLocationList] = useState<any[]>([]);
  const [componentsRowData, setComponentsRowData] = useState<any[]>([]);
  const dispatch = useAppDispatch();
  const { branchList } = useAppSelector((state) => state.dispatch);
  const { transferRequestLoading } = useAppSelector(
    (state) => state.materialRequestWithoutBom
  );

  const {
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      product: null,
      toLocation: null,
      fromLocation: null,
      quantity: 1,
      remark: "",
      cc: null,
      type: "soundBox",
      fromLocationAddress: "",
      toLocationAddress: "",
      fromLocationName: "",
      toLocationName: "",
      mode: "",
      referenceNumber: "",
      otherTerms: "",
      termsOfDelivery: "",
      docNo: "",
      dispatchThrough: "",
      transferType: "",
    },
  });

  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Form Details", "Add Component Details", "Review & Submit"];
  const formdata = new FormData();
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const resetall = () => {
    setRowData([]);
    reset();
    dispatch(resetDocumentFile());
    dispatch(clearaddressdetail());
    formdata.delete("document");
  };

  const onSubmit: SubmitHandler<FormData> = () => {
    // if (!data.document)
    //   return showToast("Please Upload Invoice Documents", "error");
    // dispatch(storeFormdata(data));
    handleNext();
  };

  const onFinalSubmit: SubmitHandler<FormData> = (data) => {
    if (rowData.length === 0) {
      showToast("Please add at least one device", "error");
      return;
    }
    if (data.fromBranch === data.toBranch) {
      showToast("From and To Branch cannot be the same", "error");
      return;
    }
    const imei = rowData.map((row: any) => row.imei);
    const serial = rowData.map((row: any) => row.srno || "");
    dispatch(
      createTransferRequest({
        imei,
        serial,
        fromBranch: data.fromBranch?.branch_code || "",
        fromLocation: data.fromLocation || "",
        toBranch: data.toBranch?.branch_code || "",
        toLocation: data.toLocation || "",
        product: data.product?.id || "",
        type: data.type,
        qty: data.quantity,
        mode: data.mode,
        referenceNumber: data.referenceNumber,
        otherTerms: data.otherTerms,
        termsOfDelivery: data.termsOfDelivery,
        docNo: data.docNo,
        dispatchThrough: data.dispatchThrough,
        destination: data.destination,
      })
    ).then((res: any) => {
      if (res.payload?.data.success) {
        reset();
        setRowData([]);
        showToast(
          res.payload.data.message || "Transfer Request Created Successfully",
          "success"
        );
        setActiveStep(2);
        setDispatchNo(res.payload.data.message);
      }
    });
  };

  useEffect(() => {
    dispatch(getPertCodesync(null));
    dispatch(getDispatchFromDetail());
    dispatch(getAllBranch());
  }, []);

  const fetchLocations = async (endPoint: string) => {
    // setLoading(true);
    try {
      const response = await axiosInstance.get(`${endPoint}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };
  useEffect(() => {
    if (watch("fromBranch")) {
      fetchLocations(
        `/deviceBranchTransfer/getLocationListBranchWise/${
          watch("fromBranch")?.branch_code
        }`
      ).then((res) => {
        setFromLocationList(res);
      });
    }
  }, [watch("fromBranch")]);

  useEffect(() => {
    if (watch("toBranch")) {
      fetchLocations(
        `/deviceBranchTransfer/getLocationListBranchWise/${
          watch("toBranch")?.branch_code
        }`
      ).then((res) => {
        setToLocationList(res);
      });
    }
  }, [watch("toBranch")]);

  return (
    <>
      <ConfirmationModel
        open={alert}
        onClose={() => setAlert(false)}
        title="Are you sure?"
        content="Are you sure you want to reset all fields and table data?"
        cancelText="Cancel"
        confirmText="Continue"
        onConfirm={() => {
          resetall();
          dispatch(resetDocumentFile());
          dispatch(resetFormData());
          setActiveStep(0);
          setAlert(false);
        }}
      />
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white">
        <MaterialInvardUploadDocumentDrawer open={upload} setOpen={setUpload} />

        <div className="h-[calc(100vh-100px)]">
          <div className="h-[50px] flex items-center w-full px-[20px] bg-neutral-50 border-b border-neutral-300">
            <Stepper activeStep={activeStep} className="w-full">
              {steps.map((label, index) => (
                <Step key={index}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </div>

          {activeStep === 0 && (
            <div className="h-[calc(100vh-200px)] py-[20px] sm:px-[10px] md:px-[30px] lg:px-[50px] flex flex-col gap-[20px] overflow-y-auto">
              <div
                id="primary-item-details"
                className="flex items-center w-full gap-3"
              >
                <div className="flex items-center gap-[5px]">
                  <Icons.user />
                  <h2
                    id="primary-item-details"
                    className="text-lg font-semibold"
                  >
                    Device Details
                  </h2>
                </div>
                <Divider
                  sx={{
                    borderBottomWidth: 2,
                    borderColor: "#f59e0b",
                    flexGrow: 1,
                  }}
                />
              </div>
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
                <div>
                  <Controller
                    name="type"
                    control={control}
                    rules={{ required: "Device Type is required" }}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Device Type
                        </InputLabel>
                        <Select
                          {...field}
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Device Type"
                          onChange={(e) => {
                            field.onChange(e.target.value || "");
                          }}
                          value={field.value || ""}
                        >
                          <MenuItem value="soundBox">SoundBox</MenuItem>
                          <MenuItem value="swipeMachine">
                            Swipe Machine
                          </MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                  {errors.type && (
                    <p className="text-red-500 text-[12px]">
                      {errors.type.message?.toString()}
                    </p>
                  )}
                </div>
                <Controller
                  name="product"
                  rules={{ required: "Device is required" }}
                  control={control}
                  render={({ field }) => (
                    <SelectDeviceWithType
                      {...field}
                      label="Search Device"
                      error={!!errors.product}
                      helperText={errors?.product?.message}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      type={watch("type") as "soundBox" | "swipeMachine"}
                    />
                  )}
                />
                <Controller
                  name="quantity"
                  control={control}
                  rules={{ required: "Quantity is required" }}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Quantity</InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={!!errors.quantity}
                        {...field}
                        value={field.value}
                        type="number"
                        label="Quantity"
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                      />
                    </FormControl>
                  )}
                />
              </div>
              <div className="flex items-center w-full gap-3">
                <div className="flex items-center gap-[5px]">
                  <Icons.userAddress />
                  <h2 className="text-lg font-semibold">From Details</h2>
                </div>
                <Divider
                  sx={{
                    borderBottomWidth: 2,
                    borderColor: "#f59e0b",
                    flexGrow: 1,
                  }}
                />
              </div>
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
                <div>
                  <Controller
                    name="fromBranch"
                    rules={{ required: "From Branch is required" }}
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel id="from-branch-label">
                          From Branch
                        </InputLabel>
                        <Select
                          {...field}
                          labelId="from-branch-label"
                          id="from-branch-select"
                          label="From Branch"
                          onChange={(e) => {
                            const selectedBranch = branchList?.find(
                              (branch: any) =>
                                branch.branch_code === e.target.value
                            );
                            setValue(
                              "fromLocationAddress",
                              selectedBranch?.address
                            );
                            field.onChange(selectedBranch || null);
                          }}
                          value={field.value?.branch_code || ""}
                        >
                          {branchList?.map((branch: any) => (
                            <MenuItem
                              key={branch.branch_code}
                              value={branch.branch_code}
                            >
                              {branch.branch_name}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.fromBranch && (
                          <FormHelperText error>
                            {errors.fromBranch.message?.toString()}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />

              {!!watch("fromLocationAddress")&&    <Paper 
                    elevation={0}
                    sx={{ 
                      p: 1.5,
                      mt: 1,
                      backgroundColor: 'rgba(34, 197, 94, 0.1)',
                      border: '1px solid rgba(34, 197, 94, 0.2)',
                      borderRadius: 1
                    }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      sx={{
                        color: 'rgb(22, 163, 74)',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <Icons.building className="text-green-600" />
                      {watch("fromLocationAddress")?.replace(/<br\s*\/?>/gi, '\n')}
                    </Typography>
                  </Paper>}
                </div>
                <div>
                  <Controller
                    name="fromLocation"
                    control={control}
                    rules={{ required: "From Location is required" }}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          From Location
                        </InputLabel>
                        <Select
                          {...field}
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="From Location"
                          onChange={(e) => {
                            const selectedLocation = fromLocationList.find(
                              (loc: any) => loc.loc_name === e.target.value
                            );
                            field.onChange(
                              selectedLocation?.location_key || ""
                            );
                            setValue(
                              "fromLocationName",
                              selectedLocation?.loc_name
                            );
                          }}
                          value={
                            fromLocationList.find(
                              (loc: any) => loc.location_key === field.value
                            )?.loc_name || ""
                          }
                        >
                          {fromLocationList?.length > 0 ? (
                            fromLocationList.map((location: any) => (
                              <MenuItem
                                key={location.location_key}
                                value={location.loc_name}
                              >
                                {location.loc_name}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem value="">No Location Found</MenuItem>
                          )}
                        </Select>
                      </FormControl>
                    )}
                  />
                  {errors.fromLocation && (
                    <p className="text-red-500 text-[12px]">
                      {errors.fromLocation.message?.toString()}
                    </p>
                  )}
                </div>
               
              </div>
              <div className="flex items-center w-full gap-3">
                <div className="flex items-center gap-[5px]">
                  <Icons.userAddress />
                  <h2 className="text-lg font-semibold">To Details</h2>
                </div>
                <Divider
                  sx={{
                    borderBottomWidth: 2,
                    borderColor: "#f59e0b",
                    flexGrow: 1,
                  }}
                />
              </div>
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
                <div>
                <Controller
                  name="toBranch"
                  rules={{ required: "To Branch is required" }}
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel id="to-branch-label">To Branch</InputLabel>
                      <Select
                        {...field}
                        labelId="to-branch-label"
                        id="to-branch-select"
                        label="To Branch"
                        onChange={(e) => {
                          const selectedBranch = branchList?.find(
                            (branch: any) =>
                              branch.branch_code === e.target.value
                          );
                          setValue(
                            "toLocationAddress",
                            selectedBranch?.address
                          );
                          field.onChange(selectedBranch || null);
                        }}
                        value={field.value?.branch_code || ""}
                      >
                        {branchList?.map((branch: any) => (
                          <MenuItem
                            key={branch.branch_code}
                            value={branch.branch_code}
                          >
                            {branch.branch_name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.toBranch && (
                        <FormHelperText error>
                          {errors.toBranch.message?.toString()}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
                 {!!watch("toLocationAddress")&&    <Paper 
                    elevation={0}
                    sx={{ 
                      p: 1.5,
                      mt: 1,
                      backgroundColor: 'rgba(34, 197, 94, 0.1)',
                      border: '1px solid rgba(34, 197, 94, 0.2)',
                      borderRadius: 1
                    }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      sx={{
                        color: 'rgb(22, 163, 74)',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <Icons.building className="text-green-600" />
                      {watch("toLocationAddress")?.replace(/<br\s*\/?>/gi, '\n')}
                    </Typography>
                  </Paper>}
                </div>
                <div>
                  <Controller
                    name="toLocation"
                    control={control}
                    rules={{ required: "To Location is required" }}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          To Location
                        </InputLabel>
                        <Select
                          {...field}
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="To Location"
                          onChange={(e) => {
                            const selectedLocation = toLocationList.find(
                              (loc: any) => loc.loc_name === e.target.value
                            );
                            field.onChange(
                              selectedLocation?.location_key || ""
                            );
                            setValue(
                              "toLocationName",
                              selectedLocation?.loc_name
                            );
                          }}
                          value={
                            toLocationList.find(
                              (loc: any) => loc.location_key === field.value
                            )?.loc_name || ""
                          }
                        >
                          {toLocationList?.length > 0 ? (
                            toLocationList.map((location: any) => (
                              <MenuItem
                                key={location.location_key}
                                value={location.loc_name}
                              >
                                {location.loc_name}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem value="">No Location Found</MenuItem>
                          )}
                        </Select>
                      </FormControl>
                    )}
                  />
                  {errors.toLocation && (
                    <p className="text-red-500 text-[12px]">
                      {errors.toLocation.message?.toString()}
                    </p>
                  )}
                </div>
              </div>
              <div
                id="primary-item-details"
                className="flex items-center w-full gap-3"
              >
                <div className="flex items-center gap-[5px]">
                  <Icons.detail />
                  <h2
                    id="primary-item-details"
                    className="text-lg font-semibold"
                  >
                    DC Terms
                  </h2>
                </div>
                <Divider
                  sx={{
                    borderBottomWidth: 2,
                    borderColor: "#f59e0b",
                    flexGrow: 1,
                  }}
                />
              </div>
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
                 <Controller
                  name="mode"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Mode / Terms and Conditions</InputLabel>
                      <OutlinedInput
                        fullWidth
                        {...field}
                        value={field.value}
                        type="text"
                        label="Mode / Terms and Conditions"
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                      />
                    </FormControl>
                  )}
                />
                 <Controller
                  name="referenceNumber"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Reference Number & Date</InputLabel>
                      <OutlinedInput
                        fullWidth
                        {...field}
                        value={field.value}
                            type="text"
                        label="Reference Number & Date"
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                      />
                    </FormControl>
                  )}
                />
                 <Controller
                  name="otherTerms"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Other Terms</InputLabel>
                      <OutlinedInput
                        fullWidth
                        {...field}
                        value={field.value}
                        type="text"
                        label="Other Terms"
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                      />
                    </FormControl>
                  )}
                />
                 <Controller
                  name="termsOfDelivery"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Terms of Delivery</InputLabel>
                      <OutlinedInput
                        fullWidth
                          {...field}
                        value={field.value}
                        type="text"
                        label="Terms of Delivery"
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                      />
                    </FormControl>
                  )}
                />
                 <Controller
                  name="docNo"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Dispatch Doc Number</InputLabel>
                      <OutlinedInput
                        fullWidth
                        {...field}
                        value={field.value}
                        type="text"
                        label="Dispatch Doc Number"
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                      />
                    </FormControl>
                  )}
                />
                 <Controller
                  name="dispatchThrough"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Dispatch Through</InputLabel>
                      <OutlinedInput
                        fullWidth
                        {...field}
                        value={field.value}
                        type="text"
                        label="Dispatch Through"
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                      />
                    </FormControl>
                  )}
                />
                 <Controller
                  name="destination"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Destination</InputLabel>
                      <OutlinedInput
                        fullWidth
                          {...field}
                        value={field.value}
                        type="text"
                        label="Destination"
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                      />
                    </FormControl>
                  )}
                />
                <Controller
                  name="transferType"
                  control={control}
                  rules={{ required: "Transfer type is required" }}
                  render={({ field }) => (
                    <FormControl
                      error={!!errors.transferType}
                      component="fieldset"
                    >
                      <Typography variant="subtitle1" className="mb-2">
                      Transfer Type
                      </Typography>
                      <RadioGroup
                        row
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      >
                        <FormControlLabel
                          value="device"
                          control={<Radio />}
                          label="Device"
                        />
                        <FormControlLabel
                          value="component"
                          control={<Radio />}
                          label="Component"
                        />
                      </RadioGroup>
                      {errors.transferType && (
                        <FormHelperText error>
                          {errors.transferType.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
                
              </div>
            </div>
          )}
          {activeStep === 1 && (
            <>

            {watch("transferType")==="device" ? <ManageBranchTransfer
              formData={watch()}
              rowData={rowData}
              setRowData={setRowData}
            />:
             <div className="h-[calc(100vh-200px)]   ">
              <ComponentTable
                rowData={componentsRowData}
                setRowData={setComponentsRowData}
              />
            </div>}
            </>
          )}
          {activeStep === 2 && (
            <div className="h-[calc(100vh-200px)] flex items-center justify-center">
              <div className="flex flex-col items-center justify-center gap-[10px]">
                <Success />
                <Typography variant="inherit" fontWeight={500}>
                  {dispatchNo ? dispatchNo : ""}
                </Typography>
                <LoadingButton
                  onClick={() => setActiveStep(0)}
                  variant="contained"
                  className="w-1/2"
                >
                  Create New Branch Transfer
                </LoadingButton>
              </div>
            </div>
          )}
          <div className="h-[50px] border-t border-neutral-300 flex items-center justify-center px-[20px] bg-neutral-50 gap-[10px] relative">
            {activeStep === 0 && (
              <>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  endIcon={<Icons.next />}
                >
                  Next
                </LoadingButton>
              </>
            )}
            {activeStep === 1 && (
              <>
                <LoadingButton
                  disabled={transferRequestLoading}
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
                  loading={transferRequestLoading}
                  loadingPosition="start"
                  variant="contained"
                  startIcon={<Icons.save />}
                  onClick={() => {
                    onFinalSubmit(watch());
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

export default CreateBranchTransferPage;
