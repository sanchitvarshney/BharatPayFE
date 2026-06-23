import React from "react";
import { Icons } from "@/components/icons";
import type { CaptureView } from "./camera.types";

type Props = {
  index: number;
  view: CaptureView;
  image?: string;
  isActive: boolean;
  onSelect: (index: number) => void;
  onPreview: (index: number) => void;
};

const CameraThumbnail: React.FC<Props> = ({
  index,
  view,
  image,
  isActive,
  onSelect,
  onPreview,
}) => {
  return (
    <button
      type="button"
      onClick={() => (image ? onPreview(index) : onSelect(index))}
      className={`relative h-[58px] w-[78px] overflow-hidden rounded-lg border text-left transition-all ${
        isActive
          ? "border-cyan-400 ring-2 ring-cyan-400/50"
          : "border-slate-600 hover:border-slate-400"
      }`}
    >
      {image && (
        <img
          src={image}
          alt={view.label}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
      )}
      <span className="relative z-10 flex h-full flex-col justify-between p-1">
        <span className="flex items-center justify-between">
          <span className="text-xs font-bold">{index + 1}</span>
          {image && <Icons.check fontSize="small" className="text-cyan-300" />}
        </span>
        <span className="truncate text-[9px] leading-tight text-slate-200">
          {image ? "Tap to view" : view.label}
        </span>
      </span>
    </button>
  );
};

export default React.memo(CameraThumbnail);
