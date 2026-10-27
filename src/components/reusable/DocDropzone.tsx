import React from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { IconButton, Typography } from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { showToast } from "@/utils/toasterContext";

export const DOC_MAX_FILE_SIZE_MB = 5;
const ACCEPTED_TYPES = {
  "application/pdf": [".pdf"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
};

type Props = {
  files: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  disabled?: boolean;
  label?: string;
};

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

const DocDropzone: React.FC<Props> = ({
  files,
  onChange,
  maxFiles = 2,
  disabled = false,
  label = "Selected documents",
}) => {
  const remaining = maxFiles - files.length;
  const locked = remaining <= 0 || disabled;

  const onDrop = (accepted: File[], rejected: FileRejection[]) => {
    rejected.forEach(({ file, errors }) => {
      const code = errors[0]?.code;
      const reason =
        code === "file-too-large"
          ? `larger than ${DOC_MAX_FILE_SIZE_MB} MB`
          : code === "file-invalid-type"
            ? "only PDF, JPG or PNG allowed"
            : errors[0]?.message;
      showToast(`${file.name}: ${reason}`, "error");
    });

    const fresh = accepted.filter(
      (f) => !files.some((e) => e.name === f.name && e.size === f.size),
    );
    if (fresh.length > remaining) {
      showToast(`Maximum ${maxFiles} documents allowed`, "warning");
    }
    if (fresh.length > 0) {
      onChange([...files, ...fresh.slice(0, remaining)]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: DOC_MAX_FILE_SIZE_MB * 1024 * 1024,
    disabled: locked,
    multiple: true,
  });

  return (
    <div className="flex flex-col gap-4">
      <div
        {...getRootProps()}
        className={`relative rounded-lg border-2 border-dashed px-6 py-8 flex flex-col items-center justify-center gap-2 text-center transition-colors ${
          locked
            ? "border-neutral-200 bg-neutral-50 cursor-not-allowed opacity-60"
            : isDragActive
              ? "border-blue-500 bg-blue-50 cursor-copy"
              : "border-neutral-300 hover:border-blue-400 hover:bg-blue-50/40 cursor-pointer"
        }`}
      >
        <input {...getInputProps()} />
        <CloudUploadOutlinedIcon
          sx={{ fontSize: 44 }}
          className={isDragActive ? "text-blue-500" : "text-neutral-400"}
        />
        {remaining <= 0 ? (
          <Typography variant="body2" fontWeight={500}>
            Maximum {maxFiles} documents added
          </Typography>
        ) : (
          <>
            <Typography variant="body2" fontWeight={500}>
              {isDragActive ? (
                "Drop files here"
              ) : (
                <>
                  Drag & drop or{" "}
                  <span className="text-blue-600 underline">browse</span>
                </>
              )}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              PDF, JPG or PNG · up to {DOC_MAX_FILE_SIZE_MB} MB each · max{" "}
              {maxFiles} files
            </Typography>
          </>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Typography variant="subtitle2">{label}</Typography>
        <Typography variant="caption" color="textSecondary">
          {files.length} / {maxFiles}
        </Typography>
      </div>

      {files.length === 0 ? (
        <Typography
          variant="body2"
          color="textSecondary"
          className="text-center py-2"
        >
          No documents selected yet
        </Typography>
      ) : (
        <ul className="flex flex-col gap-2">
          {files.map((file, idx) => (
            <li
              key={`${file.name}-${file.size}`}
              className="flex items-center gap-3 rounded-md border border-neutral-200 px-3 py-2"
            >
              {file.type === "application/pdf" ? (
                <PictureAsPdfOutlinedIcon className="text-red-500" />
              ) : (
                <ImageOutlinedIcon className="text-blue-500" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" title={file.name}>
                  {file.name}
                </p>
                <p className="text-xs text-neutral-500">
                  {formatSize(file.size)}
                </p>
              </div>
              <IconButton
                size="small"
                color="error"
                disabled={disabled}
                onClick={() => onChange(files.filter((_, i) => i !== idx))}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DocDropzone;
