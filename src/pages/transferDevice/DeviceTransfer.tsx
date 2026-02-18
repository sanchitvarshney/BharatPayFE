import { useAppSelector } from "@/hooks/useReduxHook";
import Webcam from "react-webcam";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  FormControlLabel,
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
    issueData,
    isImageLoading,
    isSubmitLoading,
  } = useAppSelector((state) => state.deviceTransfer);
  const videoConstraints = {
    deviceId: deviceId ? { exact: deviceId } : undefined,
    width: { ideal: 1280 },
    height: { ideal: 720 },
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
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      imeinumber: "",
      issue: [],
      returnissue: "",
      remark: "",
    },
  });
  const DEFAULT_DEVICE_MODEL = "soundBox";

  useEffect(() => {
    //@ts-ignore
    dispatch(fetchIssue());
  }, []);

  const getErrorMessage = (err: unknown): string => {
    if (err == null) return "Something went wrong.";
    if (typeof err === "string") return err;
    const ax = err as { response?: { data?: { message?: string; error?: string } }; message?: string };
    return ax?.response?.data?.message ?? ax?.response?.data?.error ?? ax?.message ?? "Something went wrong.";
  };

  const onSubmit = async (data: any) => {
    try {
      const slNo = deviceDetailsData?.sl_no != null ? String(deviceDetailsData.sl_no) : null;
      const payload = {
        imeiNo: [data.imeinumber],
        srlNo: slNo != null ? [slNo] : [],
        issue: data.issue,
        return_reason: data.returnissue,
        remark: data.remark,
      };

      //@ts-ignore
      const result: any = await dispatch(submitTransferData(payload)).unwrap();
      if (result?.success) {
        showToast(result?.message || "Success", "success");
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
              showToast(getErrorMessage(res.payload?.data) || res.payload?.data?.message || "Upload failed", "error");
            }
          });
        }
      } else {
        const msg = result?.message ?? result?.error ?? "Request failed.";
        showToast(typeof msg === "string" ? msg : "Something went wrong.", "error");
      }
    } catch (error: unknown) {
      showToast(getErrorMessage(error), "error");
    }
  };

  const handleSubmitForm = () => {
    handleSubmit(onSubmit)();
  };

  return (
    <div className="h-[calc(100vh-100px)] bg-white flex flex-col">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0 p-0">
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col w-full px-2 py-2">
          <div className="flex flex-col flex-1 min-h-0 gap-2 w-full">
            {/* IMEI */}
            <div className="flex flex-wrap items-end gap-2 flex-shrink-0">
              <div className="w-full sm:w-auto sm:min-w-[200px] sm:max-w-[280px]">
                <Typography variant="subtitle2" sx={{ mb: 0.4 }}>
                  Enter IMEI Number
                </Typography>
                <Controller
                  name="imeinumber"
                  control={control}
                  rules={{
                    required: "IMEI Number is required",
                    validate: (v) =>
                      !v || /^\d{15}$/.test(v) || "IMEI must be exactly 15 digits",
                  }}
                  render={({ field }) => (
                    <TextField
                      placeholder="Enter IMEI (15 digits) and press Enter"
                      value={field.value || ""}
                      fullWidth
                      size="medium"
                      inputProps={{ "aria-label": "IMEI", maxLength: 15 }}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 15);
                        field.onChange(val);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (field.value.trim()) {
                            dispatch(
                              fetchDeviceDetails({
                                deviceCode: field.value.trim(),
                                deviceModel: DEFAULT_DEVICE_MODEL,
                              }) as any,
                            );
                          }
                        }
                      }}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <QrCodeScanner />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  )}
                />
                {errors.imeinumber && (
                  <span className="text-xs text-red-500">
                    {(errors.imeinumber as { message?: string })?.message}
                  </span>
                )}
              </div>
            </div>

            {/* Select Issue, Return Issue, Remark - aligned in a row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-shrink-0 items-start">
              <div className="min-w-0">
                <Typography variant="subtitle2" sx={{ mb: 0.4 }}>Select Issue</Typography>
                <Controller
                  name="issue"
                  control={control}
                  rules={{ required: "Issue is required" }}
                  render={({ field }) => (
                    <RadioGroup
                      {...field}
                      sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 0.5 }}
                    >
                      {issueData?.map((item: any) => (
                        <FormControlLabel
                          key={item.id}
                          value={item.id}
                          control={<Radio size="medium" />}
                          label={item.text}
                          sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.875rem" } }}
                        />
                      ))}
                    </RadioGroup>
                  )}
                />
                {errors.issue && (
                  <span className="text-xs text-red-500">Issue is required</span>
                )}
              </div>
              <div className="min-w-0">
                <Typography variant="subtitle2" sx={{ mb: 0.4 }}>Return Issue</Typography>
                <Controller
                  name="returnissue"
                  control={control}
                  rules={{ required: "Return Issue is required" }}
                  render={({ field }) => (
                    <Select
                      size="medium"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      displayEmpty
                      fullWidth
                      renderValue={(selected) => {
                        if (!selected) return "Return Issue";
                        const found = issueTypes.find((item) => item.id === selected);
                        return found?.text || "Return Issue";
                      }}
                      error={!!errors.returnissue}
                    >
                      <MenuItem value="" disabled>Return Issue</MenuItem>
                      {issueTypes.map((item) => (
                        <MenuItem key={item.id} value={item.id}>{item.text}</MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </div>
              <div className="min-w-0">
                <Typography variant="subtitle2" sx={{ mb: 0.4 }}>Remark</Typography>
                <Controller
                  name="remark"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      multiline
                      rows={2}
                      size="medium"
                      placeholder="Enter Remark"
                      variant="outlined"
                      fullWidth
                      value={field?.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  )}
                />
              </div>
            </div>

            {/* Camera + Capture */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-1 min-h-0 min-w-0 content-start">
              <div className="flex-shrink-0">
                <Typography variant="subtitle2" sx={{ mb: 0.4 }}>Select Camera</Typography>
                <Select
                  size="medium"
                  value={deviceId}
                  onChange={(e: any) => setDeviceId(e.target.value)}
                  fullWidth
                >
                  {devices.map((device, i) => (
                    <MenuItem key={i} value={device.deviceId}>
                      {device.label || `Camera ${i + 1}`}
                    </MenuItem>
                  ))}
                </Select>
              </div>
              {deviceId && (
                <div className="flex flex-col gap-1 min-w-0 max-h-[220px]">
                  <div className="flex-1 min-h-[160px] w-full overflow-hidden rounded border bg-black">
                    <Webcam
                      key={deviceId}
                      ref={webcamRef}
                      screenshotFormat="image/png"
                      videoConstraints={videoConstraints}
                      minScreenshotHeight={360}
                      minScreenshotWidth={640}
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  </div>
                  <Button size="medium" variant="contained" onClick={capture}>Capture</Button>
                </div>
              )}
              {image && (
                <div className="flex flex-col gap-1 items-start min-w-0 flex-shrink-0">
                  <img src={image} alt="captured" className="max-w-full max-h-[180px] object-contain rounded border" />
                  <Button size="medium" variant="contained" color="error" onClick={() => setImage(null)}>Remove</Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-neutral-300 py-2 absolute bottom-0 left-0 right-0 bg-white">
          <div className="h-12 flex items-center gap-2 px-4 justify-end">
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
