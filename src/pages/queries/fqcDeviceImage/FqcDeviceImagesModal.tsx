import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { Icons } from "@/components/icons";
import { IMAGE_VIEWS } from "./fqcDeviceImage.constants";
import { getImageUrl } from "./fqcDeviceImage.utils";
import { FqcTableRow, ImageViewKey } from "./fqcDeviceImage.types";

type ViewItem = (typeof IMAGE_VIEWS)[number];

type Props = {
  open: boolean;
  row: FqcTableRow | null;
  views: ViewItem[];
  onClose: () => void;
  onImageClick: (index: number) => void;
};

const FqcDeviceImagesModal: React.FC<Props> = ({
  open,
  row,
  views,
  onClose,
  onImageClick,
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
    <DialogTitle className="flex items-center justify-between pr-2">
      <span>Device Images</span>
      <IconButton onClick={onClose} size="small">
        <Icons.close />
      </IconButton>
    </DialogTitle>
    <DialogContent dividers>
      {row && (
        <div className="flex flex-col gap-4 pb-2">
          <div>
            <Typography variant="body2" className="text-slate-500">
              DSN: {row.dsn} • Type: {row.type}
            </Typography>
            <Typography variant="body2" className="text-slate-500">
              Ref ID: {row.refId} • Inserted by {row.insertBy} • {row.insertDt}
            </Typography>
          </div>

          {views.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {views.map((view, idx) => {
                const url = getImageUrl(row, view.key as ImageViewKey) ?? "";
                return (
                  <button
                    key={view.key}
                    type="button"
                    onClick={() => onImageClick(idx)}
                    className="flex flex-col items-center border rounded-lg p-3 shadow-sm bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
                  >
                    <img
                      src={url}
                      alt={view.label}
                      className="rounded object-contain max-h-[220px] w-full"
                    />
                    <Typography
                      variant="subtitle2"
                      className="mt-2 font-medium text-slate-700"
                    >
                      {view.label}
                    </Typography>
                  </button>
                );
              })}
            </div>
          ) : (
            <Typography variant="body2" color="textSecondary">
              No images available for this record
            </Typography>
          )}
        </div>
      )}
    </DialogContent>
  </Dialog>
);

export default FqcDeviceImagesModal;
