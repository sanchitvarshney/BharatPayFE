import React, { useState, useCallback } from "react";
import { Box, Typography, IconButton, List, ListItem, CircularProgress } from "@mui/material";
import { useDropzone, Accept } from "react-dropzone";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
import { showToast } from "@/utils/toasterContext";
import styled from "styled-components";

interface FileUploaderProps {
  multiple?: boolean;
  onFileChange?: (files: File[]) => void;
  value?: File[] | null;
  allowDuplicates?: boolean;
  acceptedFileTypes?: Accept;
  label?: string;
  loading?: boolean;
  disabled?: boolean;
  success?: boolean;
  isDeletable?: boolean;
  ondelete?: (fileName: string) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ multiple = false, onFileChange, value, allowDuplicates = true, acceptedFileTypes, label = "Upload File", loading = false, disabled = false, success = false, isDeletable = true, ondelete }) => {
  const [files, setFiles] = useState<File[]>(value || []);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any[]) => {
      // Show toast for unsupported file types
      fileRejections.forEach((file) => {
        showToast(`Unsupported file format: ${file.file.name}, Accepted formats: ${acceptedFileTypes ? Object.values(acceptedFileTypes).flat().join(", ") : "Any format"}`, "error");
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
    if (ondelete) {
      ondelete(fileName);
    } else {
      const updatedFiles = files.filter((file) => file.name !== fileName);
      setFiles(updatedFiles);
      onFileChange?.(updatedFiles);
    }
  };

  return (
    <Box sx={{ width: "100%", textAlign: "center", mt: 2 }}>
      <Box
        {...getRootProps()}
        sx={{
          p: 3,
          border: "3px dashed #0e7490",
          borderRadius: 1,
          cursor: loading || disabled ? "not-allowed" : "pointer",
          bgcolor: isDragActive ? "action.hover" : "background.paper",
          opacity: loading ? 0.7 : 1,
          "&:hover": { bgcolor: "#fffbeb" },
          "&:focus": { bgcolor: "#fffbeb" },
        }}
      >
        <input {...getInputProps()} disabled={loading || disabled} className="" />
        {loading ? (
          <CircularProgress size={35} />
        ) : success ? (
          <Sucess>
            <div className="success-animation">
              <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
              </svg>
            </div>
          </Sucess>
        ) : (
          <UploadFileIcon color="primary" fontSize="large" />
        )}
        {success ? (
          <Typography variant="body2" color="textSecondary">
            File Uploaded Successfully
          </Typography>
        ) : (
          <Typography variant="body2" color="textSecondary">
            {isDragActive ? "Drop files here..." : `Drag & drop or click to upload, ${acceptedFileTypes ? Object.values(acceptedFileTypes).flat().join(", ") : "Any format"}`}
          </Typography>
        )}

        {!success && (
          <Typography color="textSecondary" fontWeight={500}>
            {label}
          </Typography>
        )}
      </Box>

      {files.length > 0 && (
        <List>
          {value?.map((file, index) => (
            <ListItem key={index} sx={{ display: "flex", justifyContent: "space-between", p: 0 }}>
              <Typography variant="body2" noWrap>
                {file.name}
              </Typography>
              {isDeletable && (
                <IconButton type="button" sx={{ paddingX: "10px", paddingY: "5px" }} onClick={() => handleDelete(file.name)} color="error">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};
const Sucess = styled.div`
  margin: 10px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  justify-content: center;
  .success-animation {
  }
  .checkmark {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: block;
    stroke-width: 2;
    stroke: #4bb71b;
    stroke-miterlimit: 10;
    box-shadow: inset 0px 0px 0px #4bb71b;
    animation: fill 0.4s ease-in-out 0.4s forwards, scale 0.3s ease-in-out 0.9s both;
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

export default FileUploader;
