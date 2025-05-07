import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { uploadSwipeDeviceStatus } from "@/features/upload/uploadSlice";
import { Button, Card, Typography, Box, CircularProgress } from "@mui/material";
import { CloudUpload, Download } from "@mui/icons-material";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";

const SwipeDeviceUpload: React.FC = () => {
  const dispatch = useAppDispatch();
  const { uploadLoading, uploadError } = useAppSelector(
    (state) => state.upload
  );
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      if (
        selectedFile.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        selectedFile.type === "application/vnd.ms-excel"
      ) {
        setFile(selectedFile);
      } else {
        toast.error("Please upload an Excel file (.xlsx or .xls)");
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await dispatch(uploadSwipeDeviceStatus(formData)).unwrap();
      toast.success("File uploaded successfully");
      setFile(null);
    } catch (error) {
      toast.error(uploadError || "Upload failed");
    }
  };

  const handleDownloadTemplate = () => {
    // TODO: Implement template download functionality
    toast.info("Template download functionality coming soon");
  };

  return (
    <Box
      sx={{
        p: 3,
        maxWidth: 800,
        mx: "auto",
        minHeight: "calc(100vh - 100px)",
        display: "flex",
        alignItems: "center",
        bgcolor: "#f5f5f5",
      }}
    >
      <Card sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Upload Swipe Device Status
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Upload an Excel file containing the swipe device status information.
        </Typography>

        <Box
          {...getRootProps()}
          sx={{
            border: "2px dashed",
            borderColor: isDragActive ? "primary.main" : "grey.300",
            borderRadius: 2,
            p: 4,
            textAlign: "center",
            cursor: "pointer",
            bgcolor: isDragActive ? "action.hover" : "background.paper",
            mb: 3,
          }}
        >
          <input {...getInputProps()} />
          <CloudUpload sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {isDragActive
              ? "Drop the file here"
              : "Drag & drop an Excel file here"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            or click to select a file
          </Typography>
          {file && (
            <Typography variant="body2" sx={{ mt: 2, color: "primary.main" }}>
              Selected file: {file.name}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleDownloadTemplate}
          >
            Download Sample File
          </Button>
          <Button
            variant="contained"
            startIcon={
              uploadLoading ? <CircularProgress size={20} /> : <CloudUpload />
            }
            onClick={handleUpload}
            disabled={!file || uploadLoading}
          >
            {uploadLoading ? "Uploading..." : "Upload File"}
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
          Note: Please ensure your Excel file follows the required format.
          Download the template for reference.
        </Typography>
      </Card>
    </Box>
  );
};

export default SwipeDeviceUpload;
