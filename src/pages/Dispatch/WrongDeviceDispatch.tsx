import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import MaterialInvardUploadDocumentDrawer from "@/components/Drawers/wearhouse/MaterialInvardUploadDocumentDrawer";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { clearaddressdetail } from "@/features/wearhouse/Divicemin/devaiceMinSlice";
import { resetDocumentFile, storeFormdata } from "@/features/wearhouse/Rawmin/RawMinSlice";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import {CircularProgress, Divider, FilledInput, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, ListItem, Step, StepLabel, Stepper, TextField, Typography } from "@mui/material";
import FileUploader from "@/components/reusable/FileUploader";
import { LoadingButton } from "@mui/lab";
import { Icons } from "@/components/icons";
import { showToast } from "@/utils/toasterContext";
import Success from "@/components/reusable/Success";
import { LocationType } from "@/components/reusable/editor/SelectClient";
import { DeviceType } from "@/components/reusable/SelectSku";
import {  getClientBranch, uploadFile, wrongDeviceDispatch } from "@/features/Dispatch/DispatchSlice";
import { DispatchWrongItemPayload } from "@/features/Dispatch/DispatchType";
import DeleteIcon from "@mui/icons-material/Delete";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import WrongDeviceImeiTable from "@/table/dispatch/WrongDeviceImeiTable";
import { useParams } from "react-router-dom";
type RowData = {
  awbNo: string;
};

type FormDataType = {
  clientDetail: clientDetailType | null;
  shipToDetails: shipToDetailsType | null;
  invoice: string;
  qty: string;
  location: LocationType | null;
  remark: string;
  file: File[] | null;
  sku: DeviceType | null;
  docNo: string;
  document: string;
  dispatchDate: Dayjs | null;
};

type clientDetailType = {
  client: string;
  branchId: string;
  address1: string;
  address2: string;
  pincode: string;
};

type shipToDetailsType = {
  shipTo: string;
  address1: string;
  address2: string;
  pincode: string;
  mobileNo: string;
  city: string;
};

const WrongDeviceDispatch: React.FC = () => {
  const [filename, setFilename] = useState<string>("");
  const [upload, setUpload] = useState<boolean>(false);
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [imei, setImei] = React.useState<string>("");
  const [dispatchNo, setDispatchNo] = useState<string>("");
  const [data, setData] = useState<any>(null);
  const dispatch = useAppDispatch();
  const { deviceDetailLoading } = useAppSelector((state) => state.batteryQcReducer);

  const { wrongDispatchLoading, uploadFileLoading } = useAppSelector((state) => state.dispatch);


  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormDataType>({
    defaultValues: {
      clientDetail: null,
      shipToDetails: null,
      invoice: "",
      qty: "",
      document: "",
      location: null,
      remark: "",
      file: null,
      sku: null,
    },
  });
  const formValues = watch();
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Form Details", "Add Component Details", "Review & Submit"];
  const formdata = new FormData();
  const { challanList } = useAppSelector(
    (state) => state.dispatch
  );
  const { id } = useParams();

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
    setFilename("");
    dispatch(clearaddressdetail());
    formdata.delete("document");
  };

  const onSubmit: SubmitHandler<FormDataType> = (data) => {
    if (!data.document) return showToast("Please Upload Invoice Documents", "error");
    dispatch(storeFormdata(data));
    handleNext();
  };

  useEffect(() => {
    if (challanList) {
      setData(challanList?.[0]);
      setValue("remark", challanList?.[0]?.remark);
      setValue("qty", challanList?.[0]?.dispatchQty);
    }
  }, [challanList]);

  const finalSubmit = () => {
    const data = formValues;
    // if (formdata) {
    if (rowData.length !== Number(data.qty)) return showToast("Total Devices should be equal to Quantity you have entered", "error");
    const payload: DispatchWrongItemPayload = {
      docNo: data.docNo,
      remark: data.remark,
      awb: rowData.map((item) => item.awbNo),
      document: data.document || "",
      dispatchDate: dayjs(data.dispatchDate).format("DD-MM-YYYY"),
      // clientDetail: data.clientDetail,
      // shipToDetails: data.shipToDetails,
      challanId: id?.replace(/_/g, "/") || "",
    };
    dispatch(wrongDeviceDispatch(payload)).then((res: any) => {
      if (res.payload.data.success) {
        setDispatchNo(res?.payload?.data?.data?.refID);
        reset();
        setRowData([]);
        handleNext();
        resetall();
        //  dispatch(clearFile());
      }
    });
    //  };
  };

  useEffect(() => {
    if (formValues.clientDetail?.client) {
      dispatch(getClientBranch((formValues.clientDetail.client as any).code));
    }
  }, [formValues.clientDetail?.client]);


  return (
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white ">
        <MaterialInvardUploadDocumentDrawer open={upload} setOpen={setUpload} />

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

          {activeStep === 0 && (
              <div className="h-[calc(100vh-200px)] py-[20px] sm:px-[10px] md:px-[30px] lg:px-[50px] flex flex-col gap-[20px] overflow-y-auto">
                <div>
                  {/* Section: Primary Item Details */}
                  <section aria-labelledby="primary-item-details">
                    <div
                      id="primary-details"
                      className="flex items-center w-full gap-3"
                    >
                      <Icons.user />
                      <h2
                        id="primary-details"
                        className="text-lg font-semibold"
                      >
                        Client Details
                      </h2>
                      <Divider
                        sx={{
                          borderBottomWidth: 2,
                          borderColor: "#f59e0b",
                          flexGrow: 1,
                        }}
                      />
                    </div>

                    {/* Subsection: Basic Item Details */}
                    <section
                      aria-labelledby="basic-item-details"
                      className="mt-2"
                    >
                      <div className="grid grid-cols-5 gap-2 mt-4">
                        {[
                          { label: "Name", value: data?.clientDetail?.name },
                          {
                            label: "Branch",
                            value: data?.clientDetail?.branchName,
                          },
                          {
                            label: "PinCode",
                            value: data?.clientDetail?.pincode,
                          },
                          {
                            label: "Address Line 1",
                            value: data?.clientDetail?.address1,
                          },
                          {
                            label: "Address Line 2",
                            value: data?.clientDetail?.address2,
                          },
                        ].map(({ label, value }) => (
                          <div key={label} className="py-5">
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              className="text-gray-600"
                            >
                              {label}:
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {value || "N/A"}
                            </Typography>
                          </div>
                        ))}
                      </div>
                    </section>
                  </section>
                  <section aria-labelledby="ship-to-details">
                    <div
                      id="ship-to-details"
                      className="flex items-center w-full gap-3"
                    >
                      {" "}
                      <Icons.userAddress />
                      <h2
                        id="ship-to-details"
                        className="text-lg font-semibold"
                      >
                        Ship To Details
                      </h2>
                      <Divider
                        sx={{
                          borderBottomWidth: 2,
                          borderColor: "#f59e0b",
                          flexGrow: 1,
                        }}
                      />
                    </div>

                    {/* Subsection: Basic Item Details */}
                    <section
                      aria-labelledby="basic-item-details"
                      className="mt-2"
                    >
                      <div className="grid grid-cols-6 gap-2 mt-4">
                        {[
                          {
                            label: "Ship To",
                            value: data?.shipToDetails?.shipLabel,
                          },
                          {
                            label: "PinCode",
                            value: data?.shipToDetails?.pincode,
                          },
                          {
                            label: "Mobile No",
                            value: data?.shipToDetails?.mobileNo,
                          },
                          { label: "City", value: data?.shipToDetails?.city },
                          {
                            label: "Address Line 1",
                            value: data?.shipToDetails?.address1,
                          },
                          {
                            label: "Address Line 2",
                            value: data?.shipToDetails?.address2,
                          },
                        ].map(({ label, value }) => (
                          <div key={label} className="py-5">
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              className="text-gray-600"
                            >
                              {label}:
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {value || "N/A"}
                            </Typography>
                          </div>
                        ))}
                      </div>
                    </section>
                  </section>
                  <section aria-labelledby="dispatch-from-details">
                    <div
                      id="dispatch-from-details"
                      className="flex items-center w-full gap-3"
                    >
                      {" "}
                      <Icons.shipping />
                      <h2
                        id="dispatch-from-details"
                        className="text-lg font-semibold"
                      >
                        Dispatch From Details
                      </h2>
                      <Divider
                        sx={{
                          borderBottomWidth: 2,
                          borderColor: "#f59e0b",
                          flexGrow: 1,
                        }}
                      />
                    </div>

                    {/* Subsection: Basic Item Details */}
                    <section
                      aria-labelledby="basic-item-details"
                      className="mt-2"
                    >
                      <div className="grid grid-cols-4 gap-6 mt-4">
                        {[
                          {
                            label: "Dispatch From",
                            value: data?.dispatchFromDetails?.dispatchFromLabel,
                          },
                          {
                            label: "PinCode",
                            value: data?.dispatchFromDetails?.pin,
                          },
                          {
                            label: "Mobile No",
                            value: data?.dispatchFromDetails?.mobileNo,
                          },
                          {
                            label: "GST No",
                            value: data?.dispatchFromDetails?.gst,
                          },
                          {
                            label: "PAN No",
                            value: data?.dispatchFromDetails?.pan,
                          },
                          {
                            label: "City",
                            value: data?.dispatchFromDetails?.city,
                          },
                          {
                            label: "Address Line 1",
                            value: data?.dispatchFromDetails?.address1,
                          },
                          {
                            label: "Address Line 2",
                            value: data?.dispatchFromDetails?.address2,
                          },
                        ].map(({ label, value }) => (
                          <div key={label} className="py-5">
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              className="text-gray-600"
                            >
                              {label}:
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {value || "N/A"}
                            </Typography>
                          </div>
                        ))}
                      </div>
                    </section>
                  </section>
                  <section aria-labelledby="dispatch-from-details">
                    <div
                      id="dispatch-from-details"
                      className="flex items-center w-full gap-3 pt-6"
                    >
                      {" "}
                      <Icons.files />
                      <h2
                        id="dispatch-details"
                        className="text-lg font-semibold"
                      >
                        Dispatch Details and Attachments
                      </h2>
                      <Divider
                        sx={{
                          borderBottomWidth: 2,
                          borderColor: "#f59e0b",
                          flexGrow: 1,
                        }}
                      />
                    </div>

                    {/* Subsection: Basic Item Details */}
                    <section
                      aria-labelledby="basic-item-details"
                      className="mt-2"
                    >
                      <div className="grid grid-cols-4 gap-6 mt-4">
                        {[
                          {
                            label: "Dispatch Quantity",
                            value: data?.dispatchQty,
                          },
                          { label: "Other Reference", value: data?.otherRef },
                          { label: "GST Rate", value: data?.gstrate },
                          { label: "GST Type", value: data?.gsttype==="inter"?"Inter State":"Intra State" },
                          {label: "Device Type", value: "Wrong Device"},
                          {label:"Item Rate",value:data?.itemRate},
                          {label:"HSN Code",value:data?.hsnCode},
                          {label:"Material Name",value:data?.materialName},
                          {label:"Remarks",value:data?.remark},
                        ].map(({ label, value }) => (
                          <div key={label} className="py-5">
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              className="text-gray-600"
                            >
                              {label}:
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {value || "N/A"}
                            </Typography>
                          </div>
                        ))}
                      </div>
                    </section>
                  </section>
                </div>
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
                <Controller
                  name="docNo"
                  control={control}
                  rules={{
                    required: { value: true, message: "Document is required" },
                  }}
                  render={({ field }) => (
                    <FormControl error={!!errors.docNo} fullWidth variant="filled">
                      <InputLabel htmlFor="docNo">Document No</InputLabel>
                      <FilledInput {...field} error={!!errors.docNo} id="docNo" type="text" />
                      {errors.docNo && <FormHelperText>{errors.docNo.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
                
                <div>
                  <Controller
                    name="dispatchDate"
                    control={control}
                    rules={{ required: " Dispatch Date is required" }}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          format="DD-MM-YYYY"
                          slots={{
                            textField: TextField,
                          }}
                          maxDate={dayjs()}
                          slotProps={{
                            textField: {
                              variant: "filled",
                              error: !!errors.dispatchDate,
                              helperText: errors.dispatchDate?.message,
                            },
                          }}
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          sx={{ width: "100%" }}
                          label="Dispatch Date"
                          name="startDate"
                        />
                      </LocalizationProvider>
                    )}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className=" flex flex-col gap-[20px] py-[20px] ">
                  <div>
                    <Controller
                      name="file"
                      control={control}
                      render={({ field }) => (
                        <FileUploader
                          loading={uploadFileLoading}
                          acceptedFileTypes={{
                            "application/pdf": [".pdf"],
                            "application/msword": [".doc"],
                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
                            "image/*": [],
                          }}
                          multiple={false}
                          value={field.value}
                          onFileChange={(value) => {
                            if (value && value.length > 0) {
                              formdata.delete("document");
                              const file = value[0]; // Get the first file (if there's one)
                              setFilename(value[0].name);
                              formdata.append("document", file);
                              dispatch(uploadFile(formdata)).then((res: any) => {
                                if (res.payload.data.success) {
                                  const docNos = res.payload.data?.data;
                                  setValue("document", docNos); // Update the document field in the form
                                }
                              });
                            }
                          }}
                          label="Upload Attachment"
                        />
                      )}
                    />
                    <ListItem
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        p: 0,
                      }}
                    >
                      <Typography variant="body2" noWrap>
                        {filename}
                      </Typography>
                      {filename && (
                        <IconButton
                          type="button"
                          sx={{ paddingX: "10px", paddingY: "5px" }}
                          onClick={() => {
                            formdata.delete("document");
                            setFilename("");
                            setValue("document", "");
                          }}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </ListItem>
                  </div>
                </div>
                <div className="pt-10 pl-10 ">
                  <TextField {...register("remark")} fullWidth label={"Remarks (If any)"} variant="outlined" multiline rows={5} />
                </div>
              </div>
            </div>
            )}
          {activeStep === 1 && (
            <div className="h-[calc(100vh-200px)]   ">
              {/* <RMMaterialsAddTablev2
                rowData={rowData}
                setRowData={setRowData}
                setTotal={setTotal}
              /> */}
              <div>
                <div className="h-[90px] flex items-center px-[20px] justify-between flex-wrap">
                  <FormControl sx={{ width: "400px" }} variant="outlined">
                    <TextField
                      rows={2}
                      value={imei}
                      label="AWB Device"
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
                          // Check if the imei already exists in the rowData
                          const isDuplicate = rowData.some((item) => item.awbNo === imei);
                          
                          if (isDuplicate) {
                            showToast("This AWB Device already exists", "error"); // You can use a toast or other way to notify the user
                          } else {
                            const awbNo = [{ awbNo: imei }];
                            setRowData((prevRowData) => [...awbNo, ...prevRowData]); // Add the new IMEI to the rowData
                          }
                          
                          setImei(""); // Clear the input field after adding
                          e.preventDefault(); // Prevent the default Enter key behavior
                        }
                      }}
                      slotProps={{
                        input: {
                          endAdornment: <InputAdornment position="end">{deviceDetailLoading ? <CircularProgress size={20} color="inherit" /> : <QrCodeScannerIcon />}</InputAdornment>,
                        },
                      }}
                    />
                  </FormControl>

                  </div>

                <div className="h-[calc(100vh-250px)]">
                  <WrongDeviceImeiTable setRowdata={setRowData} rowData={rowData} />
                </div>
              </div>
            </div>
          )}
          {activeStep === 2 && (
            <div className="h-[calc(100vh-200px)] flex items-center justify-center">
              <div className="flex flex-col justify-center gap-[10px]">
                <Success />
                <Typography variant="inherit" fontWeight={500}>
                  Dispatch Number - {dispatchNo ? dispatchNo : ""}
                </Typography>
                <LoadingButton onClick={() => setActiveStep(0)} variant="contained">
                  Create New Dispatch
                </LoadingButton>
              </div>
            </div>
          )}
          <div className="h-[50px] border-t border-neutral-300 flex items-center justify-end px-[20px] bg-neutral-50 gap-[10px] relative">
            {activeStep === 0 && (
              <>
                <LoadingButton type="submit" variant="contained" endIcon={<Icons.next />} >
                  Next
                </LoadingButton>
              </>
            )}
            {activeStep === 1 && (
              <>
                <LoadingButton
                  disabled={wrongDispatchLoading}
                  sx={{ background: "white", color: "red" }}
                  variant="contained"
                  startIcon={<Icons.previous />}
                  onClick={() => {
                    handleBack();
                  }}
                >
                  Back
                </LoadingButton>
                {/* <LoadingButton
                  disabled={createminLoading}
                  sx={{ background: "white", color: "red" }}
                  variant="contained"
                  startIcon={<Icons.refreshv2 />}
                  onClick={() => {
                    setAlert(true);
                  }}
                >
                  Reset
                </LoadingButton> */}
                <LoadingButton
                  loading={wrongDispatchLoading}
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
  );
};

export default WrongDeviceDispatch;
