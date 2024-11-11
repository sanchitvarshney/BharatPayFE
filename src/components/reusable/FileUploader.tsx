import React, { useState, useCallback } from "react";
import { Box, Typography, IconButton, List, ListItem } from "@mui/material";
import { useDropzone, Accept } from "react-dropzone";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
import { showToast } from "@/utils/toasterContext";


interface FileUploaderProps {
  multiple?: boolean;
  onFileChange?: (files: File[]) => void;
  value?: File[] | null;
  allowDuplicates?: boolean;
  acceptedFileTypes?: Accept;
  label?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  multiple = false,
  onFileChange,
  value,
  allowDuplicates = true,
  acceptedFileTypes,
  label = "Upload File",
}) => {
  const [files, setFiles] = useState<File[]>(value || []);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any[]) => {
      // Show toast for unsupported file types
      fileRejections.forEach((file) => {
        showToast(`Unsupported file format: ${file.file.name}, Accepted formats: ${acceptedFileTypes
          ? Object.values(acceptedFileTypes).flat().join(", ")
          : "Any format"}`, "error");
      });

      let newFiles = acceptedFiles;

      // Filter out duplicates if not allowed
      if (!allowDuplicates) {
        const existingFileNames = new Set(files.map((file) => file.name));

        const uniqueFiles = acceptedFiles.filter((file) => {
          const isDuplicate = existingFileNames.has(file.name);
          if (isDuplicate) {
            showToast(`Duplicate file detected: ${file.name}`, "warning");
          }
          return !isDuplicate;
        });

        newFiles = uniqueFiles;
      }

      const updatedFiles = multiple ? [...files, ...newFiles] : newFiles.slice(0, 1);

      setFiles(updatedFiles);
      onFileChange?.(updatedFiles);
    },
    [files, multiple, onFileChange, allowDuplicates]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept: acceptedFileTypes,
  });

  const handleDelete = (fileName: string) => {
    const updatedFiles = files.filter((file) => file.name !== fileName);
    setFiles(updatedFiles);
    onFileChange?.(updatedFiles);
  };

  return (
    <Box sx={{ width: "100%", textAlign: "center", mt: 2 }}>
      <Box
        {...getRootProps()}
        sx={{
          p: 3,
          border: "2px dashed #888",
          borderRadius: 1,
          cursor: "pointer",
          bgcolor: isDragActive ? "action.hover" : "background.paper",
        }}
      >
        <input {...getInputProps()} />
        <UploadFileIcon color="primary" fontSize="large" />
        <Typography variant="body2" color="textSecondary">
          {isDragActive ? "Drop files here..." : `Drag & drop or click to upload, ${acceptedFileTypes
          ? Object.values(acceptedFileTypes).flat().join(", ")
          : "Any format"}`}
        </Typography>
        <Typography color="textSecondary">{label}</Typography>
      </Box>

      {files.length > 0 && (
        <List>
          {files.map((file, index) => (
            <ListItem key={index} sx={{ display: "flex", justifyContent: "space-between", p: 0 }}>
              <Typography variant="body2" noWrap>
                {file.name}
              </Typography>
              <IconButton
                sx={{ paddingX: "10px", paddingY: "5px" }}
                onClick={() => handleDelete(file.name)}
                color="error"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default FileUploader;