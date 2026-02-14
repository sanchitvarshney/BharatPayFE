import SelectLocationAcordingModule from "@/components/reusable/SelectLocationAcordingModule";
import { useAppSelector } from "@/hooks/useReduxHook";
import Webcam from "react-webcam";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { QrCodeScanner } from "@mui/icons-material";
import {
  fetchDeviceDetails,
  fetchIssue,
  submitImage,
  submitTransferData,
} from "@/features/transfer/deviceTransferSlice";
import { showToast } from "@/utils/toasterContext";
const issueTypes = [
  { id: "customer_return", text: "Customer Return" },
  { id: "trc", text: "TRC" },
  { id: "assembly", text: "Assembly" },
  { id: "dismentaling", text: "Dismentaling" },
];

const DeviceTransfer = () => {
  const dispatch = useDispatch<any>();
  const webcamRef = useRef<any>(null);
  const [image, setImage] = useState(null);
  const [devices, setDevices] = useState<any[]>([]);
  const [deviceId, setDeviceId] = useState("");
  const {
    deviceDetailsData,
    loadingDeviceDetails,
    issueData,
    isImageLoading,
    isSubmitLoading,
  } = useAppSelector((state) => state.deviceTransfer);
  const videoConstraints = {
    deviceId: deviceId ? { exact: deviceId } : undefined,
    width: 200,
    height: 200,
  };

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((mediaDevices) => {
      const cams: any = mediaDevices.filter((d) => d.kind === "videoinput");
      setDevices(cams);
      setDeviceId(cams[1]?.deviceId ? cams[1]?.deviceId : cams[0]?.deviceId);
    });
  }, []);

  const capture = () => {
    const screenshot = webcamRef.current.getScreenshot();
    setImage(screenshot);
  };

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      deviceId: "",
      locationfromId: "",
      locationtoId: "",
      optionValue: "serialNo",
      costcenterId: "",
      imeinumber: "",
      issue: [],
      returnissue: "",
      remark: "",
    },
  });
  const deviceModel = watch("deviceId");

  useEffect(() => {
    //@ts-ignore
    dispatch(fetchIssue());
  }, []);

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        skuId: data.deviceId?.id,
        fromLocation: data.locationfromId?.code,
        toLocation: data.locationtoId?.code,
        cc: data.costcenterId?.id,
        imeiNo: [data.imeinumber],
        srlNo: [deviceDetailsData?.sl_no],
        issue: data.issue,
        return_reason: data.returnissue,
        remark: data.remark,
      };

      //@ts-ignore
      const result: any = await dispatch(submitTransferData(payload)).unwrap();
      if (result?.success) {
        showToast(result?.message);
        if (image) {
          const formData: any = new FormData();
          const response = await fetch(image);
          const blob = await response.blob();
          formData.append("file", blob, "capture.png");

          dispatch(
            //@ts-ignore
            submitImage({
              imei: data.imeinumber,
              body: formData,
            }),
          ).then((res: any) => {
            if (res.payload.data.success) {
              showToast(res.payload.data.message, "success");
              setImage(null);
            } else {
              showToast(res.payload.data.message, "error");
            }
          });
        }
      } else {
        showToast(result?.message, "error");
      }
    } catch (error: any) {
      showToast(error, "error");
    }
  };

  const handleSubmitForm = () => {
    handleSubmit(onSubmit)();
  };

  const showDetails = (
    <Card
      elevation={0}
      sx={{ mt: 2, borderRadius: 2, boxShadow: "0 0 12px rgba(0,0,0,0.12)" }}
    >
      <CardContent>
        <div className="flex justify-between items-center">
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Device Details
          </Typography>
          {loadingDeviceDetails && <CircularProgress size={20} />}
        </div>

        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <LabelValue
              label="Product Name"
              value={deviceDetailsData?.p_name}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <LabelValue label="IMEI" value={deviceDetailsData?.device_imei} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <LabelValue label="Model" value={deviceDetailsData?.device_model} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <LabelValue label="SKU" value={deviceDetailsData?.device_sku} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <LabelValue label="Manufacturer" value={deviceDetailsData?.mfgBy} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <LabelValue
              label="Manufactured On"
              value={`${deviceDetailsData?.mfgMonth ?? "-"}/${deviceDetailsData?.mfgYear ?? "-"}`}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <LabelValue label="Serial No" value={deviceDetailsData?.sl_no} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <div className="h-[calc(100vh-100px)]  bg-white">
      <form onSubmit={handleSubmit(onSubmit)} className="p-[0px]  ">
        <div className="w-full h-[calc(100vh-170px)] overflow-y-auto  ">
          <div className="w-full grid grid-cols-3 gap-[20px] p-[15px]   ">
            <div>
              <Typography variant="subtitle2" sx={{ mb: 0.4 }}>
                Device Model
              </Typography>
              <Controller
                name="deviceId"
                control={control}
                rules={{
                  required: "Device Model is required",
                }}
                render={({ field }) => (
                  <SelectLocationAcordingModule
                    endPoint="/product/bySku/null?type=soundBox"
                    value={field.value || null}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                    error={!!errors.deviceId}
                    placeholder="Device Model"
                    isSearch={false}
                  />
                )}
              />
              {errors.date && (
                <span className=" text-[12px] text-red-500">
                  {/* @ts-ignore */}
                  {errors.date.message}
                </span>
              )}
            </div>

            <div>
              <Typography variant="subtitle2" sx={{ mb: 0.4 }}>
                Location from
              </Typography>
              <Controller
                name="locationfromId"
                control={control}
                rules={{ required: "Location from is required" }}
                render={({ field }) => (
                  <SelectLocationAcordingModule
                    endPoint="/device-movement/pickLocation"
                    value={field.value || null}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                    error={!!errors.locationfromId}
                    placeholder="Location from"
                    isSearch={false}
                  />
                )}
              />
            </div>

            <div>
              <Typography variant="subtitle2" sx={{ mb: 0.4 }}>
                Location to
              </Typography>
              <Controller
                name="locationtoId"
                control={control}
                rules={{ required: "Location to is required" }}
                render={({ field }) => (
                  <SelectLocationAcordingModule
                    endPoint="/device-movement/dropLocation"
                    value={field.value || null}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                    error={!!errors.locationtoId}
                    placeholder="Location to"
                    isSearch={false}
                  />
                )}
              />
            </div>
            <div>
              <Typography variant="subtitle2" sx={{ mb: 0.4 }}>
                Cost Center (CC)
              </Typography>
              <Controller
                name="costcenterId"
                control={control}
                rules={{ required: "Cost Center is required" }}
                render={({ field }) => (
                  <SelectLocationAcordingModule
                    endPoint="/backend/costcenter"
                    value={field.value || null}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                    error={!!errors.costcenterId}
                    placeholder="Cost Center (CC)"
                    isSearch={false}
                  />
                )}
              />
            </div>
            <div>
              <Typography variant="subtitle2" sx={{ mb: 0.4 }}>
                Enter IMEI Number
              </Typography>
              <Controller
                name="imeinumber"
                control={control}
                rules={{
                  required: "IMIE Number is required",
                  validate: (v) =>
                    !v || /^\d{15}$/.test(v) || "IMEI must be exactly 15 digits",
                }}
                render={({ field }) => (
                  <TextField
                    placeholder="Enter IMEI Number (15 digits)"
                    value={field.value || ""}
                    fullWidth
                    inputProps={{
                      "aria-label": "weight",
                      maxLength: 15,
                     
                    }}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 15);
                      field.onChange(val);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (field.value.trim() && deviceModel) {
                          dispatch(
                            //@ts-ignore
                            fetchDeviceDetails({
                              deviceCode: field.value.trim(),
                              deviceModel: deviceModel?.id,
                            }),
                          );
                        }
                        e.preventDefault();
                      }
                    }}
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
                )}
              />
            </div>
          </div>

          <div className="w-full grid grid-cols-2 gap-[20px] p-[15px] ">
            {showDetails}
          </div>
          <div className="w-full grid grid-cols-3 gap-[20px] p-[15px] ">
            <div>
              <Typography variant="subtitle2" sx={{ mb: 0.4 }}>
                Select Issue
              </Typography>
              <Controller
                name="issue"
                control={control}
                rules={{ required: "Issue is required" }}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: 1,
                    }}
                  >
                    {issueData?.map((item: any) => (
                      <FormControlLabel
                        key={item.id}
                        value={item.id}
                        control={<Radio />}
                        label={item.text}
                      />
                    ))}
                  </RadioGroup>
                )}
              />
            </div>
            <div>
              <Typography variant="subtitle2" sx={{ mb: 0.4 }}>
                Return Issue
              </Typography>
              <Controller
                name="returnissue"
                control={control}
                rules={{ required: "Return Issue is required" }}
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    displayEmpty
                    renderValue={(selected) => {
                      if (!selected) return "Return Issue";

                      const found = issueTypes.find(
                        (item) => item.id === selected,
                      );

                      return found?.text || "Return Issue";
                    }}
                    className="w-[100%]"
                    error={!!errors.returnissue}
                  >
                    <MenuItem value="" disabled>
                      Return Issue
                    </MenuItem>

                    {issueTypes.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.text}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </div>
          </div>
          <div className="w-full grid grid-cols-3 gap-[20px] p-[15px]">
            <div>
              <Typography variant="subtitle2" sx={{ mb: 0.4 }}>
                Select Camera
              </Typography>
              <Select
                value={deviceId}
                onChange={(e: any) => setDeviceId(e.target.value)}
                className="w-[100%]"
              >
                {devices.map((device, i) => (
                  <MenuItem key={i} value={device.deviceId}>
                    {device.label || `Camera ${i + 1}`}
                  </MenuItem>
                ))}
              </Select>
            </div>
            {deviceId && (
              <div className="flex flex-col items-center gap-[10px]">
                <Webcam
                  key={deviceId}
                  ref={webcamRef}
                  screenshotFormat="image/png"
                  videoConstraints={videoConstraints}
                  minScreenshotHeight={200}
                  minScreenshotWidth={200}
                  width={200}
                  height={200}
                />
                <Button variant="contained" onClick={capture}>
                  Capture
                </Button>
              </div>
            )}
            <div className="flex flex-col items-center gap-[10px]">
              {image && (
                <>
                  {" "}
                  <img src={image} alt="captured" />
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => setImage(null)}
                  >
                    Remove
                  </Button>
                </>
              )}{" "}
            </div>
          </div>
          {/* show textfile for remark */}
          <div className="w-full grid grid-cols-2 gap-[20px] p-[15px]">
            <div>
              <Typography variant="subtitle2" sx={{ mb: 0.4 }}>
                Remark
              </Typography>
              <Controller
                name="remark"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    multiline
                    rows={4}
                    placeholder="Enter Remark"
                    variant="outlined"
                    sx={{ width: "100%" }}
                    value={field?.value ?? ""}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons Section */}
        <div className="border-t border-neutral-300 py-[10px] absolute bottom-0 left-0 right-0">
          <div className="h-[50px] p-0 flex items-center  gap-[10px] px-[20px] justify-end">
            <Button
              onClick={() => {
                reset();
              }}
              variant="outlined"
            >
              Reset
            </Button>
            <LoadingButton
              loadingPosition="start"
              onClick={handleSubmitForm}
              variant="contained"
              loading={isImageLoading || isSubmitLoading}
            >
              Submit
            </LoadingButton>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DeviceTransfer;

const LabelValue = ({ label, value }: any) => (
  <div>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2" fontWeight={500}>
      {value || "-"}
    </Typography>
  </div>
);
