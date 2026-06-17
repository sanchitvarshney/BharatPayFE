import { useState } from "react";
import { useFqcDeviceImage } from "../queries/fqcDeviceImage/useFqcDeviceImage";
import ImageCaptureForm from "./ImageCaptureForm";
import FullScreenCamera from "./FullScreenCamera";
import { showToast } from "@/utils/toasterContext";
import { STEP_VIEWS } from "@/components/StepCard";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import {
  checkCapturePhoto,
  editCapturePhotos,
  saveCapturePhotos,
} from "@/features/imageCapture/imageCaptureSlice";

const ImageCapturePage = () => {
  const { deviceType, setDeviceType, serialNo, setSerialNo } =
    useFqcDeviceImage();
  const dispatch = useAppDispatch();
  const { isSaving, isEditing, isChecking } = useAppSelector(
    (state) => state.imageCapture
  );
  const [cameraOpen, setCameraOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState(1);

  const handleOpenCamera = async () => {
    if (!serialNo) {
      showToast("Please enter Serial Number", "error");
      return;
    }

    const result = await dispatch(checkCapturePhoto(serialNo));
    if (!checkCapturePhoto.fulfilled.match(result)) {
      return;
    }

    const type = result.payload.data?.data?.type ?? "";
    if (!type) {
      showToast(
        "Unable to determine device type for this serial number",
        "error"
      );
      return;
    }

    setDeviceType(type);
    setCameraOpen(true);
  };

  const handleUpload = async (images: Record<string, string>) => {
    const module = deviceType === "swipe" ? "swipe" : "sound";
    // Step 1 captures a brand-new set; Step 2 edits the existing record.
    const action:any =
      selectedStep === 1
        ? saveCapturePhotos({ type: deviceType, serialNo, images })
        : editCapturePhotos({ module, dsn: serialNo, images });

    const result = await dispatch(action);
    const isFulfilled =
      saveCapturePhotos.fulfilled.match(result) ||
      editCapturePhotos.fulfilled.match(result);

    if (isFulfilled) {
      const body = result.payload?.data;
      if (body?.success) {
        showToast(body.message ?? "Images uploaded successfully", "success");
        setCameraOpen(false);
      } else {
        showToast(body?.message ?? "Failed to upload images", "error");
      }
    } else {
      showToast("Failed to upload images", "error");
    }
  };

  return (
    <div className="flex w-full  h-[calc(100vh-100px)]  justify-center  items-center">
      <ImageCaptureForm
        serialNo={serialNo}
        onSerialNoChange={setSerialNo}
        loading={isChecking}
        selectedStep={selectedStep}
        onSelectStep={setSelectedStep}
        onOpenWebCamera={handleOpenCamera}
      />
      <FullScreenCamera
        open={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onUpload={handleUpload}
        views={STEP_VIEWS[selectedStep]}
        stepTitle={`Step ${selectedStep}`}
        uploading={isSaving || isEditing}
      />
    </div>
  );
};

export default ImageCapturePage;
